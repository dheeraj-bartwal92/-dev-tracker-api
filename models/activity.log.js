const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema({
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true
    },

    task: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task"
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    action: {
        type: String,
        required: true
    },

    metadata: {
      type: Object
    }
}, { timestamps: true })

module.exports = mongoose.model("ActivityLog", activityLogSchema);

