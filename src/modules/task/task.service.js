const mongoose = require("mongoose");
const Task = require("./task.model");
const Project = require("../projects/project.model");


exports.createTask = async (data, userId) => {
 
      const { title, description, project, assignee, priority, type, status } = data || {};
    
      if (!title) {
    throw new Error("Task title is required");
  }

  if (!project) {
    throw new Error("Project id is required");
  }

  // Check project exists
  const existingProject = await Project.findById(project).lean();

  if (!existingProject) {
    throw new Error("Project not found");
  }

  // Check if user is a member of the project
  const isMember =
    existingProject.owner.toString() === userId ||
    existingProject.members?.some(
      (member) => member.toString() === userId
    );

  if (!isMember) {
    throw new Error("Not authorized to create task in this project");
  }

  const task = await Task.create({
    title,
    description,
    project,
    assignee,
    priority,
    type,
    status,
    reporter: userId
  });

  return task;
}

exports.getTaskById = async (taskId, userId) => {
    if(!taskId) {
        throw new Error("Task Id is required.")
    }

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
    throw new Error("Invalid task id");
  }
    const task = await Task.findById(taskId)
    .populate("assignee", "name email")
    .populate("project", "title owner members")
    .lean();

    if (!task) {
    throw new Error("Task not found");
  }

  const project = task.project;

  const isMember =
    project.owner.toString() === userId ||
    project.members?.some(member => member.toString() === userId);

  if (!isMember) {
    throw new Error("Not authorized to access this task");
  }

  return task;
}

exports.getTasksByProjectId = async (projectId, userId) => {
  if (!projectId) {
    throw new Error("Project ID is required");
  }

  if (!userId) {
    throw new Error("User ID is required");
  }

  // Get project
  const project = await Project.findById(projectId).lean();

  if (!project) {
    throw new Error("Project not found");
  }

  // Check authorization
  const isOwner = project.owner.toString() === userId;

  const isMember = project.members?.some(
    (member) => member.toString() === userId
  );

  if (!isOwner && !isMember) {
    throw new Error("Not authorized to access this project's tasks");
  }

  // Fetch tasks
  const tasks = await Task.find({ project: projectId }).populate("assignee", "name email")
    .populate("project", "title owner members").lean();

  return tasks;
};

exports.patchTask = async (taskId, userId, updateData) => {
    
    if(!taskId) {
        throw new Error("Task ID is required");
    }

    const task = await Task.findById(taskId);

    if(!task) {
        throw new Error("Task not found");
    }

    const project = await Project.findOne({
        _id: task.project,
        $or: [{owner: userId}, {members: userId}]
    }).lean();

    if (!project) {
    throw new Error("Not authorized to update this task");
  }

  const updatedTask = await Task.findByIdAndUpdate(taskId, { $set: updateData }, {
    new: true,
    runValidators: true
  }).lean()

  return updatedTask;
}

exports.deleteTask = async (taskId, userId) => {

  if (!taskId) {
    throw new Error("Task ID is required");
  }

  const task = await Task.findById(taskId);

  if (!task) {
    throw new Error("Task not found");
  }

  // Check project access
  const project = await Project.findOne({
    _id: task.project,
    $or: [
      { owner: userId },
      { members: userId }
    ]
  });

  if (!project) {
    throw new Error("Not authorized to delete this task");
  }

  await Task.findByIdAndDelete(taskId);

  return { message: "Task deleted successfully" };
};