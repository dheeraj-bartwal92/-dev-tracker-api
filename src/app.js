require("dotenv").config();
const express = require("express");
const authRoutes = require("./modules/auth/auth.routes");
const projectRoutes = require("./modules/projects/project.route");
const taskRoutes = require("./modules/task/task.route");
const errorMiddleware = require("./middleware/error.middleware");
const setupSwagger = require("./config/swagger");

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
setupSwagger(app);

app.use(errorMiddleware);

module.exports = app;
