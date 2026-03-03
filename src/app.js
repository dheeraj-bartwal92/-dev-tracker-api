require("dotenv").config();
const express = require("express");
const authRoutes = require("./modules/auth/auth.routes")
const errorMiddleware = require("./middleware/error.middleware")

const app = express();
app.use(express.json())
app.use(errorMiddleware)
app.use("/api/auth", authRoutes)
module.exports = app