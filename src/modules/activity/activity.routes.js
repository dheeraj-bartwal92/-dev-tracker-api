const express = require("express");
const activityController = require("./activity.controller");
const { authMiddleware } = require("../../middleware/auth.middleware");

const router = express.Router();

router.get(
  "/projects/:projectId/activity",
  authMiddleware,
  activityController.getProjectActivity
);