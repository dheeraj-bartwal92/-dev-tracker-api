const projectService = require("./activity.service");

exports.getProjectActivity = asyncHandler(async (req, res) => {

  const { projectId } = req.params;

  const logs = await projectService.getProjectActivity(projectId);

  res.status(200).json({
    success: true,
    data: logs
  });
  
});