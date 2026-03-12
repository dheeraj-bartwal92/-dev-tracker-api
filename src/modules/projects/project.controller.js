const asyncHandler = require("../../utils/asyncHandler");
const projectService = require("./project.service");

exports.createProject = asyncHandler(async (req, res) => {
  const userId = req.user.sub; 

  const result = await projectService.createProject(req.body, userId);

  res.status(201).json({
    success: true,
    message: "Project created successfully",
    data: result
  });
});

exports.getProjects = asyncHandler(async (req, res) => {
  const projects = await projectService.getProjects(req.user.sub);

  res.status(200).json({
    success: true,
    count: projects.length,
    data: projects
  });
});

exports.updateProject = asyncHandler(async (req, res) => {
     const userId = req.user.sub;
     const { projectId } = req.params;
     await projectService.updateProject(projectId, req.body, userId);

    res.status(200).json({
    success: true,
    message: "Project updated successfully",
    data: updatedProject
  });
})


exports.deleteProject = asyncHandler(async (req, res) => {
   const userId = req.user.sub; 
   const { projectId } = req.params;
   await projectService.deleteProject(projectId, userId)

   res.status(200).json({
    success: true,
    message: "Project deleted successfully"
  });
});

exports.addMember = asyncHandler(async (req, res) => {
   const userId = req.user.sub
   const { projectId } = req.params;
   const { memberId } = req.body
   await projectService.addMember(projectId, userId, memberId)

   res.status(200).json({
    success: true,
    message: "User added successfully"
  });
})


exports.removeMember = asyncHandler(async (req, res) => {
    const userId = req.user.sub
    const { projectId, memberId } = req.params;

    const project = await projectService.removeMember(projectId, userId, memberId);

    res.status(200).json({
    success: true,
    message: "Member removed successfully",
    data: project
  });
})


exports.getMembers = asyncHandler(async (req, res) => {

  const userId = req.user.sub;
  const { projectId } = req.params;

  if (!projectId) {
    return res.status(400).json({
      success: false,
      message: "Project ID is required"
    });
  }

  const result = await projectService.getMembers(projectId, userId);

  res.status(200).json({
    success: true,
    data: {
      owner: result.owner,
      members: result.members
    }
  });

});