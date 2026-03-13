const mongoose = require("mongoose");
const Task = require("./task.model");
const Project = require("../projects/project.model");
const User = require("../auth/auth.model");
const { logActivity } = require("../../utils/activityLogger");

const validateObjectId = (value, fieldName) => {
  if (!value) {
    throw new Error(`${fieldName} is required`);
  }

  if (!mongoose.Types.ObjectId.isValid(value)) {
    throw new Error(`Invalid ${fieldName.toLowerCase()}`);
  }
};

const ensureProjectAccess = async (projectId, userId) => {
  const project = await Project.findById(projectId).lean();

  if (!project) {
    throw new Error("Project not found");
  }

  const isMember =
    project.owner.toString() === userId ||
    project.members?.some((member) => member.toString() === userId);

  if (!isMember) {
    throw new Error("Not authorized to access this project");
  }

  return project;
};

const ensureTaskAccess = async (taskId, userId) => {
  validateObjectId(taskId, "Task ID");

  const task = await Task.findById(taskId).lean();

  if (!task) {
    throw new Error("Task not found");
  }

  await ensureProjectAccess(task.project, userId);

  return task;
};

exports.createTask = async (data, userId) => {
  const { title, description, project, assignee, priority, type, status } = data || {};

  if (!title) {
    throw new Error("Task title is required");
  }

  if (!project) {
    throw new Error("Project id is required");
  }

  const existingProject = await ensureProjectAccess(project, userId);

  if (assignee) {
    const assigneeUser = await User.findById(assignee).select("_id").lean();

    if (!assigneeUser) {
      throw new Error("Assignee user not found");
    }

    const isAssigneePartOfProject =
      existingProject.owner.toString() === assignee ||
      existingProject.members?.some((member) => member.toString() === assignee);

    if (!isAssigneePartOfProject) {
      throw new Error("Assignee must be a project owner or member");
    }
  }

  const task = await Task.create({
    title,
    description,
    project,
    assignee,
    priority,
    type,
    status
  });

  await logActivity({
    projectId: task.project,
    taskId: task._id,
    userId,
    action: "TASK_CREATED",
    metadata: {
      title: task.title,
      status: task.status
    }
  });

  return task;
};

exports.getTaskById = async (taskId, userId) => {
  validateObjectId(taskId, "Task ID");

  const task = await Task.findById(taskId)
    .populate("assignee", "name email")
    .populate("project", "title owner members")
    .populate("comments.author", "name email userName")
    .lean();

  if (!task) {
    throw new Error("Task not found");
  }

  const project = task.project;

  const isMember =
    project.owner.toString() === userId ||
    project.members?.some((member) => member.toString() === userId);

  if (!isMember) {
    throw new Error("Not authorized to access this task");
  }

  return task;
};

exports.getTasksByProjectId = async (projectId, userId) => {
  validateObjectId(projectId, "Project ID");

  if (!userId) {
    throw new Error("User ID is required");
  }

  await ensureProjectAccess(projectId, userId);

  const tasks = await Task.find({ project: projectId })
    .populate("assignee", "name email")
    .populate("project", "title owner members")
    .populate("comments.author", "name email userName")
    .lean();

  return tasks;
};

exports.patchTask = async (taskId, userId, updateData) => {
  validateObjectId(taskId, "Task ID");

  const task = await Task.findById(taskId).lean();

  if (!task) {
    throw new Error("Task not found");
  }

  await ensureProjectAccess(task.project, userId);

  const updatedTask = await Task.findByIdAndUpdate(taskId, { $set: updateData }, {
    new: true,
    runValidators: true
  }).lean();

  if (Object.prototype.hasOwnProperty.call(updateData || {}, "status")) {
    await logActivity({
      projectId: updatedTask.project,
      taskId: updatedTask._id,
      userId,
      action: "TASK_STATUS_UPDATED",
      metadata: {
        previousStatus: task.status,
        newStatus: updatedTask.status
      }
    });
  }

  await logActivity({
    projectId: updatedTask.project,
    taskId: updatedTask._id,
    userId,
    action: "TASK_UPDATED",
    metadata: {
      updatedFields: Object.keys(updateData || {})
    }
  });

  return updatedTask;
};

exports.deleteTask = async (taskId, userId) => {
  validateObjectId(taskId, "Task ID");

  const task = await Task.findById(taskId).lean();

  if (!task) {
    throw new Error("Task not found");
  }

  await ensureProjectAccess(task.project, userId);

  await Task.findByIdAndDelete(taskId);

  await logActivity({
    projectId: task.project,
    taskId: task._id,
    userId,
    action: "TASK_DELETED",
    metadata: {
      title: task.title
    }
  });

  return { message: "Task deleted successfully" };
};

exports.assignTask = async (taskId, assigneeId, userId) => {
  validateObjectId(taskId, "Task ID");
  validateObjectId(assigneeId, "Assignee ID");

  const task = await Task.findById(taskId).lean();

  if (!task) {
    throw new Error("Task not found");
  }

  const project = await ensureProjectAccess(task.project, userId);

  const assignee = await User.findById(assigneeId).select("_id").lean();

  if (!assignee) {
    throw new Error("Assignee user not found");
  }

  const isAssigneePartOfProject =
    project.owner.toString() === assigneeId ||
    project.members?.some((member) => member.toString() === assigneeId);

  if (!isAssigneePartOfProject) {
    throw new Error("Assignee must be a project owner or member");
  }

  const updatedTask = await Task.findByIdAndUpdate(
    taskId,
    { $set: { assignee: assigneeId } },
    { new: true, runValidators: true }
  )
    .populate("assignee", "name email userName")
    .populate("project", "title owner members")
    .populate("comments.author", "name email userName")
    .lean();

  return updatedTask;
};

exports.unassignTask = async (taskId, userId) => {
  validateObjectId(taskId, "Task ID");

  const task = await Task.findById(taskId).lean();

  if (!task) {
    throw new Error("Task not found");
  }

  await ensureProjectAccess(task.project, userId);

  const updatedTask = await Task.findByIdAndUpdate(
    taskId,
    { $set: { assignee: null } },
    { new: true, runValidators: true }
  )
    .populate("assignee", "name email userName")
    .populate("project", "title owner members")
    .populate("comments.author", "name email userName")
    .lean();

  return updatedTask;
};

exports.addComment = async (taskId, body, userId) => {
  validateObjectId(taskId, "Task ID");

  if (!body || !body.trim()) {
    throw new Error("Comment body is required");
  }

  await ensureTaskAccess(taskId, userId);

  const updatedTask = await Task.findByIdAndUpdate(
    taskId,
    {
      $push: {
        comments: {
          body: body.trim(),
          author: userId
        }
      }
    },
    { new: true, runValidators: true }
  )
    .populate("comments.author", "name email userName")
    .lean();

  return updatedTask.comments[updatedTask.comments.length - 1];
};

exports.getComments = async (taskId, userId) => {
  validateObjectId(taskId, "Task ID");

  await ensureTaskAccess(taskId, userId);

  const task = await Task.findById(taskId)
    .select("comments")
    .populate("comments.author", "name email userName")
    .lean();

  return task.comments || [];
};

exports.updateComment = async (taskId, commentId, body, userId) => {
  validateObjectId(taskId, "Task ID");
  validateObjectId(commentId, "Comment ID");

  if (!body || !body.trim()) {
    throw new Error("Comment body is required");
  }

  const task = await ensureTaskAccess(taskId, userId);

  const comment = task.comments?.find((item) => item._id.toString() === commentId);

  if (!comment) {
    throw new Error("Comment not found");
  }

  if (comment.author.toString() !== userId) {
    throw new Error("Only comment author can update this comment");
  }

  await Task.updateOne(
    { _id: taskId, "comments._id": commentId },
    { $set: { "comments.$.body": body.trim() } },
    { runValidators: true }
  );

  const updatedTask = await Task.findById(taskId)
    .select("comments")
    .populate("comments.author", "name email userName")
    .lean();

  return updatedTask.comments.find((item) => item._id.toString() === commentId);
};

exports.deleteComment = async (taskId, commentId, userId) => {
  validateObjectId(taskId, "Task ID");
  validateObjectId(commentId, "Comment ID");

  const task = await ensureTaskAccess(taskId, userId);

  const comment = task.comments?.find((item) => item._id.toString() === commentId);

  if (!comment) {
    throw new Error("Comment not found");
  }

  if (comment.author.toString() !== userId) {
    throw new Error("Only comment author can delete this comment");
  }

  await Task.findByIdAndUpdate(
    taskId,
    {
      $pull: {
        comments: {
          _id: commentId
        }
      }
    },
    { runValidators: true }
  );

  return { message: "Comment deleted successfully" };
};
