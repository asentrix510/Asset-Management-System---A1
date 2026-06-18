const express = require("express");

const router = express.Router();

const {
  getDashboardStats,
  getStatusChart,
  getCategoryChart,
  getRecentActivity,
  getAuditLogs,
} = require("../controllers/dashboardController");

const authMiddleware = require(
  "../middleware/authMiddleware"
);

const roleMiddleware = require(
  "../middleware/roleMiddleware"
);

router.get(
  "/audit",
  authMiddleware,
  roleMiddleware("Admin"),
  getAuditLogs
);

router.get(
  "/stats",
  authMiddleware,
  getDashboardStats
);

router.get(
  "/status-chart",
  authMiddleware,
  getStatusChart
);

router.get(
  "/category-chart",
  authMiddleware,
  getCategoryChart
);

router.get(
  "/recent-activity",
  authMiddleware,
  getRecentActivity
);

module.exports = router;