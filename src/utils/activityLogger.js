const ActivityLog = require("../modules/activity/activity.model");


exports.logActivity = async ({ projectId, taskId, userId, action, metadata }) => {
     await ActivityLog.create({
        project: projectId,
        user: userId,
        task: taskId,
        action,
        metadata
     })
}
