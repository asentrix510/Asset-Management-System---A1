# Phase 2: User Management

This phase delivers user management, permitting Admins to add new users, view user lists, and delete user accounts.

## 1. Database Schema

The `users` table is defined as follows:

```sql
CREATE TABLE users (
    user_id CHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    department VARCHAR(100),
    designation VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('Admin','User') NOT NULL
);
```

- **`user_id`**: Generated automatically as a UUID (v4) upon creation via the `UUID()` function in MySQL.
- **`password`**: Stored as a bcrypt hash.
- **`role`**: Restricts actions (Admin vs User).

---

## 2. Backend API Endpoints

All user management endpoints are defined in `userRoutes.js` and protected by authentication (`authMiddleware`) and authorization (`authorize('Admin')`) filters.

### API Routes
- **`GET /api/users`**: Retrieves list of all users.
  - **Response (200 OK)**:
    ```json
    {
      "success": true,
      "users": [
        {
          "user_id": "uuid-1",
          "name": "Admin User",
          "department": "IT",
          "designation": "Manager",
          "phone": "+919999999999",
          "email": "admin@example.com",
          "role": "Admin"
        }
      ]
    }
    ```
- **`GET /api/users/:id`**: Retrieves details of a specific user.
  - **Response (200 OK)**:
    ```json
    {
      "success": true,
      "user": { ... }
    }
    ```
- **`POST /api/users`**: Registers a new user.
  - **Request Body**:
    ```json
    {
      "name": "John Doe",
      "department": "Finance",
      "designation": "Analyst",
      "phone": "+919876543210",
      "email": "john.doe@example.com",
      "password": "user_password",
      "role": "User"
    }
    ```
  - **Processing**: Hashes password using `bcrypt.hash(password, 10)` before insertion.
  - **Response (201 Created)**:
    ```json
    {
      "success": true,
      "message": "User created"
    }
    ```
- **`PUT /api/users/:id`**: Updates user information (role, designation, phone, email, name, department).
  - **Request Body**: Partial user payload.
  - **Response (200 OK)**:
    ```json
    {
      "success": true,
      "message": "User updated"
    }
    ```
- **`DELETE /api/users/:id`**: Deletes a user from the system.
  - **Response (200 OK)**:
    ```json
    {
      "success": true,
      "message": "User deleted"
    }
    ```

---

## 3. Frontend Integration

The user interface resides under `/users` on the client.

### API Wrappers (`userApi.js`)
Consolidates requests to endpoints:
- `getUsers(token)`
- `createUser(token, userData)`
- `deleteUser(token, id)`

### Page Component (`Users.jsx`)
- Controls loading state and keeps local state of the user list.
- Toggles creation modal display (`showForm`).
- Initiates callbacks for additions (`handleCreate`) and removals (`handleDelete`).

### Components
- **`UserForm.jsx`**: Responsive modal form featuring input fields (Full Name, Email, Department, Designation, Phone, Password, and Role selection). Form elements feature validation triggers.
- **`UserTable.jsx`**: Renders all registered users in a list detailing name, email, department, role (indicated with color badges), and action buttons (e.g. Delete).
