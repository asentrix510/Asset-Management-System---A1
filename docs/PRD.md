# Product Requirements Document (PRD)

## 1. Project Overview & Vision
The **Asset Management System (AMS)** is a web-based corporate tool designed to track, manage, and audit physical assets (e.g. laptops, monitors, office equipment) throughout their operational lifecycle—from acquisition and allocation to maintenance and eventual retirement.

By centralizing asset tracking, the system replaces scattered spreadsheets, minimizes lost inventory, projects asset depreciation, and ensures accountability across company departments.

---

## 2. Target Audience & User Roles
The system distinguishes two primary types of users:
1. **Admin (IT Managers & Administrators)**:
   - Full read/write access across all system modules.
   - Responsible for registering assets, onboarding users, allocating equipment, managing vendors, scheduling maintenance, generating inventory reports, and performing database backups.
2. **User (General Employees)**:
   - Read-only access to their profile and their own assigned assets.
   - Ability to scan QR codes on items to view asset information or report a maintenance issue.

---

## 3. Core Feature Requirements

### Phase 1: Authentication & Authorization
- Secure JWT-based authentication for backend REST endpoints.
- Password encryption using `bcrypt` (10 rounds).
- Frontend route protection preventing unauthorized users from accessing admin routes.

### Phase 2: User Management
- Admin console to register, list, update, and delete users.
- Attributes: Name, Email, Department, Designation, Phone, Password, and Role (Admin/User).

### Phase 3: Asset Inventory Management
- Centralized database tracking hardware attributes: Asset Code, Name, Category, Brand, Model, Serial Number, Purchase Cost, Purchase Date, Warranty Expiration, Vendor Name, Status, and Description.
- Color-coded status states: `Available` (green), `Assigned` (blue), `Maintenance` (yellow), and `Retired` (red).
- Filtering/Search by name, code, category, and status.

### Phase 4: Asset Assignment (Allocation)
- Assign `Available` assets to users.
- Track assigned dates, return dates, and assignment history.
- Automate status transitions: assigning an asset updates its status to `Assigned`; returning it restores it to `Available`.

### Phase 5: Dashboard Analytics
- Key metric cards: Total Assets, Assigned Assets, Available Assets, Under Maintenance, and Total Users.
- Graphical charts: Asset status distributions (Pie Chart) and category frequencies (Bar Chart) powered by `recharts`.
- Real-time activity feed highlighting the latest asset updates.

---

## 4. Technical Stack
- **Frontend**: React (v19), Vite (v8), Tailwind CSS (v4), Axios, Recharts, React Router Dom (v7)
- **Backend**: Node.js, Express (v5), MySQL (v8) via `mysql2` driver
- **Infrastructure**: Environment configurations via `dotenv`


---

## 5. Non-Functional Requirements
- **Security**: JWT session tokens saved securely; prepared statements used in SQL to prevent SQL Injection; passwords hashed.
- **Usability**: Clean UI design utilizing slate themes, harmonious color coding, and responsive grids for mobile, tablet, and desktop monitors.
- **Reliability**: MySQL connection pools ensuring stable database sessions under concurrent operations.
