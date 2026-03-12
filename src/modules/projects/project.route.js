const express = require("express");
const projectController = require("./project.controller");
const { authMiddleware } = require("../../middleware/auth.middleware");

const router = express.Router();

// Create project
router.post("/", authMiddleware, projectController.createProject);

// Get all projects of logged-in user
router.get("/", authMiddleware, projectController.getProjects);

// Update project
router.put("/:projectId", authMiddleware, projectController.updateProject);

// Delete project
router.delete("/:projectId", authMiddleware, projectController.deleteProject);

router.post("/:projectId/members", authMiddleware, projectController.addMember);

router.get("/:projectId/members", authMiddleware, projectController.getMembers)

router.delete("/:projectId/members/:userId", authMiddleware, projectController.removeMember);
module.exports = router;