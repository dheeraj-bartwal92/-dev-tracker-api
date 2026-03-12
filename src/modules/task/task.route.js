const express = require("express");
const taskController = require("./task.controller");
const { authMiddleware } = require("../../middleware/auth.middleware");

const router = express.Router();

// Create Task
router.post("/", authMiddleware, taskController.createTask);

// Get All Tasks By ProjectId
router.get("/project/:projectId", authMiddleware, taskController.getTaskByProjectId);

// Assign and unassign task
router.patch("/:taskId/assign", authMiddleware, taskController.assignTask);
router.patch("/:taskId/unassign", authMiddleware, taskController.unassignTask);

// Task comments
router.post("/:taskId/comments", authMiddleware, taskController.addComment);
router.get("/:taskId/comments", authMiddleware, taskController.getComments);
router.patch("/:taskId/comments/:commentId", authMiddleware, taskController.updateComment);
router.delete("/:taskId/comments/:commentId", authMiddleware, taskController.deleteComment);

// Get Task By Id
router.get("/:taskId", authMiddleware, taskController.getTaskById);

// Update Task By Id
router.patch("/:taskId", authMiddleware, taskController.patchTask);

// Delete Task By Id
router.delete("/:taskId", authMiddleware, taskController.deleteTask);

module.exports = router;
