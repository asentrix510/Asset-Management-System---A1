# Phase 7: Maintenance Management

This phase implements a maintenance tracking module that allows admins to log, schedule, and manage repair or servicing records for assets. When a maintenance record is created, the associated asset's status is automatically updated to "Maintenance", and upon completion, it is restored to "Available".

## 1. Database Schema

### The `maintenance` Table
```sql
CREATE TABLE IF NOT EXISTS `maintenance` (
  `maintenance_id`    INT           NOT NULL AUTO_INCREMENT,
  `asset_id`          CHAR(36)      NOT NULL,
  `issue_description` TEXT          NOT NULL,
  `maintenance_date`  DATE          NOT NULL,
  `cost`              DECIMAL(10,2) DEFAULT '0.00',
  `status`            ENUM('Open','In Progress','Completed') DEFAULT 'Open',
  `remarks`           TEXT,
  `created_at`        TIMESTAMP     NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`        TIMESTAMP     NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`maintenance_id`),
  FOREIGN KEY (`asset_id`) REFERENCES `assets` (`asset_id`) ON DELETE CASCADE
);
```

- **`maintenance_id`**: Auto-incrementing primary key.
- **`asset_id`**: Foreign key referencing the asset under maintenance.
- **`issue_description`**: Detailed description of the problem or servicing required.
- **`maintenance_date`**: Scheduled or actual date of maintenance.
- **`cost`**: Cost of the maintenance work.
- **`status`**: Tracks progress — `Open`, `In Progress`, or `Completed`.
- **`remarks`**: Additional notes or observations.

---

## 2. Backend API

### Controller (`maintenanceController.js`)
Handles CRUD operations for maintenance records with automatic asset status transitions and audit logging.

### Endpoints
1. **`GET /api/maintenance`** — Fetch all maintenance records with joined asset details (`asset_name`, `asset_code`).
   - **SQL**:
     ```sql
     SELECT m.*, a.asset_name, a.asset_code
     FROM maintenance m
     JOIN assets a ON m.asset_id = a.asset_id
     ORDER BY m.created_at DESC
     ```
   - **Response**: `{ success: true, records: [...] }`

2. **`GET /api/maintenance/:id`** — Fetch a single maintenance record by ID.

3. **`POST /api/maintenance`** — Create a new maintenance record.
   - **Request Body**:
     ```json
     {
       "asset_id": "uuid-asset-222",
       "issue_description": "Screen flickering intermittently",
       "maintenance_date": "2026-06-20",
       "cost": 2500.00,
       "status": "Open",
       "remarks": "Sent to vendor for diagnosis"
     }
     ```
   - **Side Effects**:
     - Updates the associated asset's status to `Maintenance`.
     - Creates a `MAINTENANCE_CREATE` audit log entry.
     - Inserts a notification record of type `Maintenance`.

4. **`PUT /api/maintenance/:id`** — Update an existing maintenance record.
   - **Side Effects**:
     - If status is changed to `Completed`, the associated asset's status is restored to `Available`.
     - Creates a `MAINTENANCE_UPDATE` audit log entry.

5. **`DELETE /api/maintenance/:id`** — Delete a maintenance record.
   - **Side Effect**: Creates `MAINTENANCE_DELETE` audit log entry.

### Route Configuration (`maintenanceRoutes.js`)
All routes protected by `authMiddleware` and `roleMiddleware("Admin")`.

---

## 3. Frontend Integration

Exposed at `/maintenance` in the browser application.

### API Wrapper (`maintenanceApi.js`)
- `getMaintenanceRecords()` — Fetch all records.
- `createMaintenance(data)` — Create a new record.
- `updateMaintenance(id, data)` — Update an existing record.
- `deleteMaintenance(id)` — Remove a record.

### Page Component (`Maintenance.jsx`)
- **Maintenance Form**: Dropdown to select an asset (only non-retired assets shown), text fields for issue description, date picker, cost input, status selector, and remarks textarea.
- **Maintenance Table**: Tabular display of all records showing asset name, asset code, issue description, date, cost, status (color-coded badge), and action buttons.
- Supports inline editing by populating the form with existing record data.

### Status Color Coding
- `Open` — Yellow badge
- `In Progress` — Blue badge
- `Completed` — Green badge
