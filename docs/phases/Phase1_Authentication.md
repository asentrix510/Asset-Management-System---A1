# Phase 1: Authentication & Authorization

This phase establishes the security backbone of the Asset Management System, implementing JSON Web Token (JWT) based authentication, password hashing, and role-based route protection.

## 1. Database Specifications for Authentication

Authentication relies on the `users` table, which holds credentials and roles:
- `email` (VARCHAR, Unique): Serving as the unique identifier for logging in.
- `password` (VARCHAR, Hashed): Stored using `bcrypt` (10 salt rounds) for password safety.
- `role` (ENUM('Admin', 'User')): Distinguishes admins (who manage assets and users) from general users.

---

## 2. Backend Authentication Logic

### Endpoints
1. **`POST /api/auth/login`**: Authenticates user credentials.
   - **Request Body**:
     ```json
     { "email": "admin@example.com", "password": "secure_password" }
     ```
   - **Processing**:
     1. Queries database for the user by email.
     2. Uses `bcrypt.compare` to verify password correctness.
     3. Signs a JWT with `{ userId: user.user_id, role: user.role }`, set to expire in 7 days.
   - **Response (200 OK)**:
     ```json
     {
       "success": true,
       "token": "eyJhbGciOi...",
       "user": {
         "user_id": "uuid-string",
         "name": "Jane Doe",
         "email": "admin@example.com",
         "role": "Admin",
         "department": "IT"
       }
     }
     ```

2. **`GET /api/auth/me`**: Fetches details of the currently logged-in user.
   - **Headers**: `Authorization: Bearer <token>`
   - **Response (200 OK)**:
     ```json
     {
       "success": true,
       "user": {
         "user_id": "uuid-string",
         "name": "Jane Doe",
         "email": "admin@example.com",
         "role": "Admin",
         "department": "IT"
       }
     }
     ```

---

## 3. Middlewares

### Authentication Middleware (`authMiddleware.js`)
Intercepts incoming requests, extracts the Bearer token from the `Authorization` header, and verifies it against `JWT_SECRET`. If valid, it assigns the decoded payload to `req.user` and calls `next()`. Otherwise, it returns `401 Unauthorized`.

### Role Authorization Middleware (`roleMiddleware.js`)
Curries accepted roles (e.g., `authorize('Admin')`) and checks `req.user.role`. If the user's role isn't inside the authorized list, it returns `403 Access Denied`.

---

## 4. Frontend Integration

### Auth State Management (`AuthContext.jsx`)
Exposes state and auth functions globally:
- `user`: Authenticated user object or `null`.
- `token`: Stored JWT string.
- `loading`: Boolean indicating if automatic token verification is underway.
- `isAuthenticated`: Boolean helper indicating session active.
- `login(email, password)`: Function making login request, saving token & user info in `localStorage`.
- `logout()`: Function flushing token & user info from `localStorage` and state.

On initial boot, a `useEffect` triggers to verify the existing token against `/api/auth/me`. If verification fails, it logs the user out.

### Axios Interceptor (`axios.js`)
Configures a request interceptor to automatically inject the JWT token into the headers of every outgoing API request:
```javascript
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("ams_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Route Protection (`AdminRoute.jsx`)
Guards admin-only screens by wrapping them inside the router configuration:
- Displays a styled spinner if `loading` is true.
- Redirects to `/` (Login) if the user is unauthenticated or has a role other than `Admin`.
