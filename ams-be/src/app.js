const express = require("express");
const cors = require("cors");

const testRoute = require("./routes/testRoute");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require(
  "./routes/userRoutes"
);
const assetRoutes = require(
  "./routes/assetRoutes"
);
const dashboardRoutes =
  require(
    "./routes/dashboardRoutes"
  );
  const assignmentRoutes =
  require(
    "./routes/assignmentRoutes"
  );
  const vendorRoutes =
  require("./routes/vendorRoutes");
  const maintenanceRoutes =
  require(
    "./routes/maintenanceRoutes"
  );
const notificationRoutes =
  require(
    "./routes/notificationRoutes"
  );
const reportRoutes =
  require(
    "./routes/reportRoutes"
  );
const userPortalRoutes = require("./routes/userPortalRoutes");
const path = require("path");
const fs = require("fs");
const app = express();

app.use(cors());
app.use(express.json());

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
app.use("/uploads", express.static(uploadDir));

app.use("/api/test-db", testRoute);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use(
  "/api/assets",
  assetRoutes
);
app.use(
  "/api/dashboard",
  dashboardRoutes
);
app.use(
  "/api/assignments",
  assignmentRoutes
);
app.use(
  "/api/vendors",
  vendorRoutes
);
app.use(
  "/api/maintenance",
  maintenanceRoutes
);
app.use(
  "/api/notifications",
  notificationRoutes
);
app.use(
  "/api/reports",
  reportRoutes
);
app.use("/api/portal", userPortalRoutes);
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "AMS API Running",
  });
});

module.exports = app;