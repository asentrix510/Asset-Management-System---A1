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

// Public stats for login page (no auth required)
router.get(
  "/public-stats",
  async (req, res) => {
    try {
      const db = require("../config/db");

      const [totalAssets] = await db.query(
        `SELECT COUNT(*) AS total FROM assets`
      );
      const [totalUsers] = await db.query(
        `SELECT COUNT(*) AS total FROM users`
      );
      const [maintenance] = await db.query(
        `SELECT COUNT(*) AS total FROM maintenance`
      );
      const [vendors] = await db.query(
        `SELECT COUNT(*) AS total FROM vendors`
      );

      res.json({
        success: true,
        stats: {
          totalAssets: totalAssets[0].total,
          totalUsers: totalUsers[0].total,
          maintenanceTickets: maintenance[0].total,
          totalVendors: vendors[0].total,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  }
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