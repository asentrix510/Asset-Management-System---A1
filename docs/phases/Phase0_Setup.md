# Phase 0: System Setup & Monorepo Initialization

This phase focuses on initializing the monorepo structure, installing initial dependencies, locking versions, and validating connections between the components.

## 1. Monorepo Configuration

The project is structured as an npm-based monorepo consisting of a React frontend and an Express backend.

### Workspace Configuration (`package.json`)
```json
{
  "name": "ams-monorepo",
  "version": "1.0.0",
  "private": true,
  "workspaces": [
    "ams-fe",
    "ams-be"
  ],
  "scripts": {
    "dev:frontend": "npm run dev --workspace=ams-fe",
    "dev:backend": "npm run dev --workspace=ams-be"
  }
}
```

### Folder Directory Layout
```
/
├── package.json
├── package-lock.json
├── README.md
├── docs/                      # Project documentation
│   └── phases/                # Phase-by-phase feature documentation
├── ams-be/                    # Node.js + Express backend
│   ├── src/
│   │   ├── config/            # DB & mail config
│   │   ├── controllers/       # API controllers
│   │   ├── database/          # SQL schema & seeds
│   │   ├── middleware/        # Express request middlewares
│   │   ├── models/            # Database queries/models
│   │   ├── routes/            # Express router mapping
│   │   ├── services/          # Supporting services
│   │   ├── utils/             # Helper utilities
│   │   ├── app.js
│   │   └── server.js
│   └── .env
└── ams-fe/                    # React + Vite frontend
    ├── src/
    │   ├── api/               # Axios services
    │   ├── components/        # UI components
    │   ├── context/           # React context providers (Auth)
    │   ├── pages/             # Route-level pages
    │   ├── routes/            # React Router configurations
    │   ├── index.css
    │   ├── main.jsx
    │   └── App.jsx
    └── .env
```

---

## 2. Dependencies & Versions

The project runs on **Node.js (v22.16.0)** and **npm (v10.9.2)** with **MySQL (v8.0+)**.

### Backend Core Dependencies
- `express`: REST API framework
- `mysql2`: Database driver supporting connection pools and promises
- `dotenv`: Environment configuration management
- `cors`: Cross-Origin Resource Sharing middleware
- `nodemon` (dev): Automatic server restarter on save

### Frontend Core Dependencies
- `react` & `react-dom` (v19): Modern rendering engine
- `vite` (v8): Blazing fast build tooling
- `react-router-dom`: Frontend client routing
- `axios`: Client HTTP requests
- `tailwindcss` (v4): Styling framework
- `recharts`: Chart rendering engine for analytics dashboard

---

## 3. Environment Variables Setup

### Backend Environment Configuration (`ams-be/.env`)
Create a file named `.env` in the `ams-be` folder:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=ams_db
JWT_SECRET=your_jwt_secret_key
```

### Frontend Environment Configuration (`ams-fe/.env`)
Create a file named `.env` in the `ams-fe` folder:
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 4. Verification Check

To spin up the local development environment:
1. Install all dependencies from root:
   ```bash
   npm install
   ```
2. Start the backend:
   ```bash
   npm run dev:backend
   ```
3. Start the frontend:
   ```bash
   npm run dev:frontend
   ```
4. Verify the API health check endpoint:
   - Request: `GET http://localhost:5000/api/health`
   - Response: `{"success": true, "message": "AMS API Running"}`
