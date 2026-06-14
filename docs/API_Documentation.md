# REST API Documentation

This document specifies the REST API endpoints of the Asset Management System (AMS), highlighting route actions, auth constraints, request structures, and JSON payloads.

---

## 1. Global Settings
- **Base API URL**: `http://localhost:5000/api`
- **Response Format**: All responses return a JSON payload. Successful queries return `success: true`.
- **Headers**:
  - `Content-Type: application/json`
  - `Authorization: Bearer <JWT_Token>` (Required for all endpoints unless marked as Public)

---

## 2. Authentication Endpoint Routes

### 2.1 User Login
- **URL**: `/auth/login`
- **Method**: `POST`
- **Access**: Public
- **Request Body**:
  ```json
  {
    "email": "admin@example.com",
    "password": "secure_password"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "token": "eyJhbGciOiJIUzI1Ni...",
    "user": {
      "user_id": "uuid-user-111",
      "name": "Admin User",
      "email": "admin@example.com",
      "role": "Admin",
      "department": "IT"
    }
  }
  ```

### 2.2 Verify Session (Current User)
- **URL**: `/auth/me`
- **Method**: `GET`
- **Access**: User & Admin (Authenticated)
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "user": {
      "user_id": "uuid-user-111",
      "name": "Admin User",
      "email": "admin@example.com",
      "role": "Admin",
      "department": "IT"
    }
  }
  ```

---

## 3. User Management Endpoints (Admin Only)

### 3.1 Fetch All Users
- **URL**: `/users`
- **Method**: `GET`
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "users": [
      {
        "user_id": "uuid-user-111",
        "name": "Jane Doe",
        "email": "jane@company.com",
        "role": "Admin",
        "department": "IT",
        "designation": "Manager",
        "phone": "+919999999999"
      }
    ]
  }
  ```

### 3.2 Fetch User by ID
- **URL**: `/users/:id`
- **Method**: `GET`

### 3.3 Register User
- **URL**: `/users`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "name": "John Smith",
    "email": "john.smith@company.com",
    "password": "user_password",
    "role": "User",
    "department": "HR",
    "designation": "Recruiter",
    "phone": "+919876543210"
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "success": true,
    "message": "User created"
  }
  ```

### 3.4 Modify User Details
- **URL**: `/users/:id`
- **Method**: `PUT`
- **Request Body**: Partial user fields.

### 3.5 Delete User Account
- **URL**: `/users/:id`
- **Method**: `DELETE`

---

## 4. Asset Inventory Endpoints (Admin Only)

### 4.1 Fetch All Assets
- **URL**: `/assets`
- **Method**: `GET`
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "assets": [
      {
        "asset_id": "uuid-asset-222",
        "asset_code": "AST-001",
        "asset_name": "ThinkPad T14",
        "category": "Laptops",
        "brand": "Lenovo",
        "model": "Gen 4",
        "serial_number": "SN87654321",
        "purchase_date": "2026-03-15",
        "purchase_cost": 1200.00,
        "vendor_name": "Lenovo Outlet",
        "status": "Available",
        "warranty_expiry": "2029-03-15",
        "description": "Developer asset"
      }
    ]
  }
  ```

### 4.2 Fetch Asset by ID
- **URL**: `/assets/:id`
- **Method**: `GET`

### 4.3 Add New Asset
- **URL**: `/assets`
- **Method**: `POST`
- **Request Body**: Asset registration details.
- **Response (201 Created)**:
  ```json
  {
    "success": true,
    "message": "Asset created"
  }
  ```

### 4.4 Modify Asset Information
- **URL**: `/assets/:id`
- **Method**: `PUT`
- **Request Body**: Partial asset fields.

### 4.5 Delete Asset Record
- **URL**: `/assets/:id`
- **Method**: `DELETE`

---

## 5. Asset Allocation Endpoints (Admin Only)

### 5.1 Fetch All Assignments
- **URL**: `/assignments`
- **Method**: `GET`
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "assignments": [
      {
        "assignment_id": "uuid-assign-333",
        "asset_id": "uuid-asset-222",
        "user_id": "uuid-user-444",
        "assigned_date": "2026-06-14",
        "return_date": null,
        "status": "Assigned",
        "asset_name": "ThinkPad T14",
        "asset_code": "AST-001",
        "user_name": "John Smith"
      }
    ]
  }
  ```

### 5.2 Assign Asset to User
- **URL**: `/assignments`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "asset_id": "uuid-asset-222",
    "user_id": "uuid-user-444",
    "assigned_date": "2026-06-14"
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "success": true,
    "message": "Asset assigned"
  }
  ```

### 5.3 Return Asset
- **URL**: `/assignments/:id/return`
- **Method**: `PUT`
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Asset returned"
  }
  ```

---

## 6. Dashboard Endpoints (Admin Only)

### 6.1 Get Summary Metrics
- **URL**: `/dashboard/stats`
- **Method**: `GET`
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "stats": {
      "totalAssets": 1,
      "assignedAssets": 1,
      "availableAssets": 0,
      "maintenanceAssets": 0,
      "totalUsers": 1
    }
  }
  ```

### 6.2 Get Status Distributions (Pie Chart)
- **URL**: `/dashboard/status-chart`
- **Method**: `GET`

### 6.3 Get Category Frequencies (Bar Chart)
- **URL**: `/dashboard/category-chart`
- **Method**: `GET`

### 6.4 Get Recent System Updates
- **URL**: `/dashboard/recent-activity`
- **Method**: `GET`

---

## 7. Health & Diagnosis

### 7.1 Server Diagnostics
- **URL**: `/health`
- **Method**: `GET`
- **Access**: Public
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "AMS API Running"
  }
  ```
