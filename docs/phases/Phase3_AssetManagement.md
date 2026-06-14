# Phase 3: Asset Management

This phase covers inventory tracking, enabling Admins to record new assets, modify current asset info, remove asset records, and filter the overall inventory.

## 1. Database Schema

The `assets` table tracks the metadata of physical items:

```sql
CREATE TABLE assets (
    asset_id CHAR(36) PRIMARY KEY,
    asset_code VARCHAR(50) UNIQUE NOT NULL,
    asset_name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    brand VARCHAR(50),
    model VARCHAR(50),
    serial_number VARCHAR(100) UNIQUE,
    purchase_date DATE,
    purchase_cost DECIMAL(10,2),
    vendor_name VARCHAR(100),
    status ENUM('Available','Assigned','Maintenance','Retired') DEFAULT 'Available',
    warranty_expiry DATE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

- **`status`**: Tracked using values (`Available`, `Assigned`, `Maintenance`, `Retired`).
- **`asset_id`**: Automatically populated using UUID (v4).

---

## 2. Backend API Endpoints

All endpoints are mapped inside `assetRoutes.js` and managed via `assetController.js`.

### API Routes
- **`GET /api/assets`**: Fetches all recorded assets, ordered by creation date.
  - **Response (200 OK)**:
    ```json
    {
      "success": true,
      "assets": [
        {
          "asset_id": "uuid-123",
          "asset_code": "AST-001",
          "asset_name": "MacBook Pro",
          "category": "Laptops",
          "brand": "Apple",
          "model": "M3 Pro",
          "serial_number": "SN12345",
          "purchase_date": "2026-01-01",
          "purchase_cost": 2500.00,
          "vendor_name": "Apple Inc.",
          "status": "Available",
          "warranty_expiry": "2029-01-01",
          "description": "Developer Laptop"
        }
      ]
    }
    ```
- **`GET /api/assets/:id`**: Fetches detail of a single asset.
- **`POST /api/assets`**: Inserts a new asset into the database.
  - **Request Body**: Full asset object details (e.g. `asset_code`, `asset_name`, `category`, etc.).
  - **Response (201 Created)**:
    ```json
    {
      "success": true,
      "message": "Asset created"
    }
    ```
- **`PUT /api/assets/:id`**: Updates specific details of an asset.
  - **Response (200 OK)**:
    ```json
    {
      "success": true,
      "message": "Asset updated"
    }
    ```
- **`DELETE /api/assets/:id`**: Removes an asset from database.
  - **Response (200 OK)**:
    ```json
    {
      "success": true,
      "message": "Asset deleted"
    }
    ```

---

## 3. Frontend Integration

The asset view resides at `/assets` on the client.

### API Wrappers (`assetApi.js`)
Wraps Axios requests to backend routes:
- `getAssets()`
- `getAssetById(id)`
- `createAsset(data)`
- `updateAsset(id, data)`
- `deleteAsset(id)`

### Page Component (`Assets.jsx`)
Handles client-side states for assets listing, current editing selection (`editingAsset`), search strings (`search`), and active filters (`statusFilter`).
- **Search Logic**: Combines `asset_name`, `asset_code`, and `category` fields into a unified string, filtering matches case-insensitively.
- **Status Filter**: Dropdown filtering entries according to states (`All`, `Available`, `Assigned`, `Maintenance`, `Retired`).
- **Submit Handlers**: Dispatches edits to `updateAsset` or new entries to `createAsset`, reloading list upon success.

### Sub-Components
- **`AssetForm.jsx`**: Layout containing fields to capture Code, Name, Category, and Status. Handles loading details when in editing mode.
- **`AssetTable.jsx`**: Lists assets in a structured table. Color-coded badges are rendered for asset status states:
  - `Available`: Green badge
  - `Assigned`: Blue badge
  - `Maintenance`: Yellow badge
  - `Retired`: Red badge
- Action buttons trigger callbacks to initiate edits (`onEdit`) or request deletions (`onDelete`).
