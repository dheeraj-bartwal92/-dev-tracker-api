const Project = require("./project.model");
const { logActivity } = require("../../utils/activityLogger");

exports.createProject = async (data, userId) => {
  const { title, description } = data || {};

  if (!title) {
    throw new Error("Project title is required");
  }

  const existing = await Project.findOne({
  title: title.trim(),
  owner: userId
}).lean();

if (existing) {
  throw new Error("You already have a project with this title");
}

  // Create project securely — owner comes from authenticated user
  const project = await Project.create({
    title: title.trim(),
    description: description?.trim(),
    owner: userId,
    members: [userId] // owner automatically becomes member
  });

  await logActivity({
    projectId: project._id,
    userId,
    action: "PROJECT_CREATED",
    metadata: {
      title: project.title
    }
  });

  return project;
};

exports.getProjects = async (userId) => {
    const projects = await Project.find({
        members: userId
    }).sort({ createdAt: -1 })
    .populate("members", "name email")
    .lean();

    return projects
}

exports.deleteProject = async (projectId, userId) => {
    const deleted = await Project.findByIdAndDelete({
        _id: projectId,
        owner: userId
    })

    if(!deleted) {
        throw new Error("Project not found or not authorized")
    }

    return deleted
}


exports.updateProject = async (projectId, data, userId) => {
    const { title, description } = data;

    const project = await Project.findOneAndUpdate({
        _id: projectId, owner: userId
    }, {
        $set: {
            ...(title && { title }),
            ... (description && { description })
        }
    }, {
        new: true,
        runValidators: true
    })

  if (!project) {
    throw new Error("Project not found or not authorized");
  }

  await logActivity({
    projectId,
    userId,
    action: "PROJECT_UPDATED",
    metadata: {
      title,
      description
    }
  });

  return project;
}

exports.addMember = async (projectId, userId, memberId) => {

    const project = await Project.findByIdAndUpdate({
        _id: projectId, owner: userId
    }, {$addToSet: { members: memberId }}, {
        new: true
    })

  if (!project) {
    throw new Error("Project not found or not authorized");
  }

  await logActivity({
    projectId,
    userId,
    action: "MEMBER_ADDED",
    metadata: {
      memberId
    }
  });

  return project;
  
}

exports.removeMember = async (projectId, userId, memberId) => {
    const project = await Project.findOneAndUpdate({
        _id: projectId,
        owner: userId
    },{
        $pull: {
            members: memberId
        }
    },{
        new: true
    })

  if (!project) {
    throw new Error("Project not found or not authorized");
  }

  await logActivity({
    projectId,
    userId,
    action: "MEMBER_REMOVED",
    metadata: {
      memberId
    }
  });

  return project;
}

exports.getMembers = async (projectId, userId) => {

  if (!projectId) {
    throw new Error("Project ID is required");
  }

  const project = await Project.findOne({
    _id: projectId,
    $or: [
      { owner: userId },
      { members: userId }
    ]
  })
  .populate("members", "name email userName")
  .populate("owner", "name email userName")
  .lean();

  if (!project) {
    throw new Error("Project not found or access denied");
  }

  return {
    owner: project.owner,
    members: project.members || []
  };
};
