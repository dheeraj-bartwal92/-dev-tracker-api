const ActivityLog = require("./activity.model");

exports.getProjectActivity = async ( projectId ) => {
    const logs = await ActivityLog.find({
        project: projectId
    }).populate("user", "name email")
    .sort({ createdAt: -1 }).lean()

    return logs
}