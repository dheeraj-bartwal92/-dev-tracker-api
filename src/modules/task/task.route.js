const express = require("express");
const taskController = require("./task.controller");
const { authMiddleware } = require("../../middleware/auth.middleware");
const router = express.Router();

// Create Task
router.post("/", authMiddleware, taskController.createTask)
// Get Task By Id
router.get("/:taskId", authMiddleware, taskController.getTaskById)

// Get All Tasks By ProjectId
router.get("/project/:projectId", authMiddleware, taskController.getTaskByProjectId)

// Update Task By Id
router.patch("/:taskId", authMiddleware, taskController.patchTask)

// Delete Task By Id
router.delete("/:taskId", authMiddleware, taskController.deleteTask)