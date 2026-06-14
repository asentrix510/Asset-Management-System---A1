const express = require("express");

const router = express.Router();

const {
  getDashboardStats,
  getStatusChart,
  getCategoryChart,
  getRecentActivity,
} = require("../controllers/dashboardController");

const authMiddleware = require(
  "../middleware/authMiddleware"
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