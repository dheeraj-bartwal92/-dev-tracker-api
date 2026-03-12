require("dotenv").config();
const express = require("express");
const authRoutes = require("./modules/auth/auth.routes")
const projectRoutes = require("./modules/projects/project.route")
const errorMiddleware = require("./middleware/error.middleware")

const app = express();
app.use(express.json())
app.use(errorMiddleware)
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks",)
module.exports = app