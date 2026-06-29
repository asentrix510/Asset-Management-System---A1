# Phase 9: Audit Trail

This phase implements a comprehensive audit logging system that records all significant actions performed across the system. Every create, update, and delete operation on assets, users, vendors, and maintenance records is automatically logged with the acting user, action type, module, and a human-readable description.

## 1. Database Schema

### The `audit_logs` Table
```sql
CREATE TABLE IF NOT EXISTS `audit_logs` (
  `audit_id`    INT          NOT NULL AUTO_INCREMENT,
  `user_id`     CHAR(36)     DEFAULT NULL,
  `action`      VARCHAR(100) NOT NULL,
  `module_name` VARCHAR(100) NOT NULL,
  `record_id`   VARCHAR(100) DEFAULT NULL,
  `description` TEXT,
  `created_at`  TIMESTAMP    NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`audit_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL
);
```

- **`audit_id`**: Auto-incrementing primary key.
- **`user_id`**: The user who performed the action (set to `NULL` on user deletion via `ON DELETE SET NULL`).
- **`action`**: Action identifier (e.g., `ASSET_CREATE`, `VENDOR_UPDATE`, `USER_DELETE`, `LOGIN`).
- **`module_name`**: Module where the action occurred (e.g., `ASSETS`, `USERS`, `VENDORS`, `MAINTENANCE`).
- **`record_id`**: The ID of the affected record.
- **`description`**: Human-readable description of what happened.

---

## 2. Backend Implementation

### Audit Service (`auditService.js`)
A reusable utility function `logAudit()` that inserts an audit record. Called by all controllers after successful operations.

```javascript
async function logAudit({ user_id, action, module_name, record_id, description }) {
  await db.query(
    `INSERT INTO audit_logs (user_id, action, module_name, record_id, description)
     VALUES (?, ?, ?, ?, ?)`,
    [user_id, action, module_name, record_id, description]
  );
}
```

### Tracked Actions
| Module      | Action               | Trigger                        |
|-------------|----------------------|--------------------------------|
| ASSETS      | ASSET_CREATE         | New asset registered           |
| ASSETS      | ASSET_UPDATE         | Asset details modified         |
| ASSETS      | ASSET_DELETE         | Asset record removed           |
| ASSETS      | ASSET_ASSIGNED       | Asset assigned to user         |
| ASSETS      | ASSET_RETURNED       | Asset returned from user       |
| USERS       | USER_CREATE          | New user registered            |
| USERS       | USER_UPDATE          | User details modified          |
| USERS       | USER_DELETE          | User account removed           |
| VENDORS     | VENDOR_CREATE        | New vendor registered          |
| VENDORS     | VENDOR_UPDATE        | Vendor details modified        |
| VENDORS     | VENDOR_DELETE        | Vendor record removed          |
| MAINTENANCE | MAINTENANCE_CREATE   | Maintenance record created     |
| MAINTENANCE | MAINTENANCE_UPDATE   | Maintenance record updated     |
| MAINTENANCE | MAINTENANCE_DELETE   | Maintenance record removed     |
| AUTH        | LOGIN                | User logged into the system    |

### Dashboard Endpoint
- **`GET /api/dashboard/audit`** — Fetch all audit logs with user names (Admin only).
  - **SQL**:
    ```sql
    SELECT a.*, u.name AS user_name
    FROM audit_logs a
    LEFT JOIN users u ON a.user_id = u.user_id
    ORDER BY a.created_at DESC
    ```

---

## 3. Frontend Integration

Exposed at `/audit` in the browser application.

### Page Component (`Audit.jsx`)
- **Audit Log Table**: Full-width table displaying timestamp, user name, action (color-coded badge), module, record ID, and description.
- **Action Badges**: Each action type has a distinct color for quick visual scanning:
  - Create actions → Green
  - Update actions → Blue/Indigo
  - Delete actions → Red/Rose
  - Login → Slate/Grey
  - Assign/Return → Violet/Slate
- **Chronological Order**: Logs are displayed in reverse chronological order (newest first).
