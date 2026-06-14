# Phase 5: Dashboard & Analytics

This phase builds the executive landing page (Dashboard), presenting aggregate counts of assets/users, visualization charts for status/category distribution, and a chronological activity log of recent inventory updates.

## 1. Backend API & Aggregations

The dashboard routes are mapped inside `dashboardRoutes.js` and managed via `dashboardController.js`. The calculations are computed directly on the MySQL server using aggregate functions.

### Endpoints
1. **`GET /api/dashboard/stats`**: Aggregates metric cards counts.
   - **SQL Queries**:
     - Total Assets: `SELECT COUNT(*) AS total FROM assets`
     - Available Assets: `SELECT COUNT(*) AS total FROM assets WHERE status='Available'`
     - Assigned Assets: `SELECT COUNT(*) AS total FROM assets WHERE status='Assigned'`
     - Under Maintenance: `SELECT COUNT(*) AS total FROM assets WHERE status='Maintenance'`
     - Total Users: `SELECT COUNT(*) AS total FROM users`
   - **Response (200 OK)**:
     ```json
     {
       "success": true,
       "stats": {
         "totalAssets": 10,
         "assignedAssets": 4,
         "availableAssets": 5,
         "maintenanceAssets": 1,
         "totalUsers": 3
       }
     }
     ```

2. **`GET /api/dashboard/status-chart`**: Returns status frequencies for pie chart.
   - **SQL Query**:
     ```sql
     SELECT status, COUNT(*) AS count
     FROM assets
     GROUP BY status
     ```
   - **Response (200 OK)**:
     ```json
     {
       "success": true,
       "data": [
         { "status": "Available", "count": 5 },
         { "status": "Assigned", "count": 4 },
         { "status": "Maintenance", "count": 1 }
       ]
     }
     ```

3. **`GET /api/dashboard/category-chart`**: Returns category counts for bar chart.
   - **SQL Query**:
     ```sql
     SELECT category, COUNT(*) AS count
     FROM assets
     GROUP BY category
     ```
   - **Response (200 OK)**:
     ```json
     {
       "success": true,
       "data": [
         { "category": "Laptops", "count": 6 },
         { "category": "Phones", "count": 3 },
         { "category": "Monitors", "count": 1 }
       ]
     }
     ```

4. **`GET /api/dashboard/recent-activity`**: Pulls recent system operations.
   - **SQL Query**:
     ```sql
     SELECT asset_id, asset_name, status, updated_at
     FROM assets
     ORDER BY updated_at DESC
     LIMIT 10
     ```
   - **Response (200 OK)**:
     ```json
     {
       "success": true,
       "activities": [
         {
           "asset_id": "uuid-123",
           "asset_name": "MacBook Pro M3",
           "status": "Assigned",
           "updated_at": "2026-06-14T12:00:00.000Z"
         }
       ]
     }
     ```

---

## 2. Frontend Integration

Exposed at `/dashboard` in the browser application.

### API Wrappers (`dashboardApi.js`)
Consolidates analytical network queries:
- `getDashboardStats()`
- `getStatusChart()`
- `getCategoryChart()`
- `getRecentActivity()`

### Page Component (`Dashboard.jsx`)
Fetches all endpoints concurrently within a `useEffect` hook, map-populating UI elements:
- **Metrics Grid**: Displays 5 cards (Total Assets, Assigned, Available, Under Maintenance, and Total Users). Features distinct styling profiles, color schemes, and descriptive icons.
- **Charts Container**: Arranges visualizations side-by-side.
- **Recent Activity Section**: Maps the most recent 10 asset modifications, formatting updating times into localized date strings.

### Visualization Components
- **`AssetStatusChart.jsx`**: Renders a circular `PieChart` using `recharts`. Contains cells mapped to static color variables corresponding to status tags:
  - `Available` -> Green (`#10B981`)
  - `Assigned` -> Blue (`#3B82F6`)
  - `Maintenance` -> Yellow (`#F59E0B`)
  - `Retired` -> Red (`#EF4444`)
  Includes automated chart tooltips and color legends.
- **`AssetCategoryChart.jsx`**: Renders a vertical `BarChart` detailing asset category distributions, complete with Cartesian grids, X/Y axes, and custom rounded bars.
- **`StatsCard.jsx`**: Sub-component helper wrapping title, value, icon, and background styles.
