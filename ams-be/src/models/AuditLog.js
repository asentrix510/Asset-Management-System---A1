const db = require("../config/db");

const AuditLog = {
    create: async ({
        user_id,
        action,
        module_name,
        record_id,
        description
    }) => {
        const [result] = await db.execute(
            `
            INSERT INTO audit_logs
            (
                user_id,
                action,
                module_name,
                record_id,
                description
            )
            VALUES (?, ?, ?, ?, ?)
            `,
            [
                user_id,
                action,
                module_name,
                record_id,
                description
            ]
        );

        return result;
    },

    getAll: async () => {
        const [rows] = await db.execute(
            `
            SELECT
                a.*,
                u.name AS user_name
            FROM audit_logs a
            LEFT JOIN users u
                ON a.user_id = u.user_id
            ORDER BY a.created_at DESC
            `
        );

        return rows;
    }
};

module.exports = AuditLog;