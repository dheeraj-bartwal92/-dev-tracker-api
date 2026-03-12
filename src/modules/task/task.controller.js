const asyncHandler = require("../../utils/asyncHandler");
const taskService = require("./task.service");

exports.createTask = asyncHandler(async (req, res) => {
  const userId = req.user.sub;

  const task = await taskService.createTask(req.body, userId);

  res.status(201).json({
    success: true,
    message: "Task created successfully",
    data: task
  });
});

exports.getTaskById = asyncHandler( async (req, res) => {
    const userId = req.user.sub;
    const { taskId } = req.params;

    const task = await taskService.getTaskById(taskId, userId)

    res.status(201).json({
    success: true,
    message: "Task fetched successfully",
    data: task
  });
})

exports.getTaskByProjectId = asyncHandler(async (req, res) => {
  const userId = req.user?.sub;
  const { projectId } = req.params;

  if (!projectId) {
    return res.status(400).json({
      success: false,
      message: "Project ID is required"
    });
  }

  const tasks = await taskService.getTasksByProjectId(projectId, userId);

  res.status(200).json({
    success: true,
    count: tasks.length,
    data: tasks
  });
});

exports.patchTask = asyncHandler(async (req, res) => {

  const userId = req.user.sub;
  const { taskId } = req.params;
  const updateData = req.body;

  if (!taskId) {
    return res.status(400).json({
      success: false,
      message: "Task ID is required"
    });
  }

  const updatedTask = await taskService.patchTask(
    taskId,
    userId,
    updateData
  );

  res.status(200).json({
    success: true,
    message: "Task updated successfully",
    data: updatedTask
  });

});

exports.deleteTask = asyncHandler(async (req, res) => {

  const userId = req.user.sub;
  const { taskId } = req.params;

  await taskService.deleteTask(taskId, userId);

  res.status(200).json({
    success: true,
    message: "Task deleted successfully"
  });

});

exports.assignTask = asyncHandler(async (req, res) => {
  const userId = req.user.sub;
  const { taskId } = req.params;
  const { assigneeId } = req.body;

  const updatedTask = await taskService.assignTask(taskId, assigneeId, userId);

  res.status(200).json({
    success: true,
    message: "Task assigned successfully",
    data: updatedTask
  });
});

exports.unassignTask = asyncHandler(async (req, res) => {
  const userId = req.user.sub;
  const { taskId } = req.params;

  const updatedTask = await taskService.unassignTask(taskId, userId);

  res.status(200).json({
    success: true,
    message: "Task unassigned successfully",
    data: updatedTask
  });
});
