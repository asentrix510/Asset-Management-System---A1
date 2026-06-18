const AuditLog = require("../models/AuditLog");

const logAudit = async ({
    user_id,
    action,
    module_name,
    record_id,
    description
}) => {
    try {
        await AuditLog.create({
            user_id,
            action,
            module_name,
            record_id,
            description
        });
    } catch (error) {
        console.error("Audit Log Error:", error.message);
    }
};

module.exports = {
    logAudit
};