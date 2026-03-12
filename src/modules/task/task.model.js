const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters"],
      maxlength: [200, "Title cannot exceed 200 characters"]
    },

    description: {
      type: String,
      trim: true,
      maxlength: [2000, "Description cannot exceed 2000 characters"]
    },

    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true
    },

    assignee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },

    status: {
      type: String,
      enum: {
        values: ["todo", "in-progress", "on-hold", "done"],
        message: "{VALUE} is not supported"
      },
      default: "todo",
      index: true
    },

    priority: {
      type: String,
      enum: {
        values: ["low", "medium", "high", "critical", "blocker"],
        message: "{VALUE} is not supported"
      },
      default: "medium"
    },

    type: {
      type: String,
      enum: {
        values: ["bug", "story", "epic", "task"],
        message: "{VALUE} is not supported"
      },
      default: "task"
    },

    dueDate: {
      type: Date
    },

    comments: [
      {
        body: {
          type: String,
          required: [true, "Comment body is required"],
          trim: true,
          minlength: [1, "Comment cannot be empty"],
          maxlength: [2000, "Comment cannot exceed 2000 characters"]
        },
        author: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true
        }
      }
    ]
  },
  {
    timestamps: true
  }
);


taskSchema.index({ project: 1, status: 1 });
taskSchema.index({ assignee: 1 });

module.exports = mongoose.model("Task", taskSchema);
