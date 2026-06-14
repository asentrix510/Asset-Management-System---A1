const db = require("../config/db");

exports.getDashboardStats =
  async (req, res) => {
    try {
      const [total] =
        await db.query(
          `SELECT COUNT(*) AS total
           FROM assets`
        );

      const [available] =
        await db.query(
          `SELECT COUNT(*) AS total
           FROM assets
           WHERE status='Available'`
        );

      const [assigned] =
        await db.query(
          `SELECT COUNT(*) AS total
           FROM assets
           WHERE status='Assigned'`
        );

      const [maintenance] =
        await db.query(
          `SELECT COUNT(*) AS total
           FROM assets
           WHERE status='Maintenance'`
        );

      const [users] =
        await db.query(
          `SELECT COUNT(*) AS total
           FROM users`
        );

      res.json({
        success: true,
        stats: {
          totalAssets:
            total[0].total,

          assignedAssets:
            assigned[0].total,

          availableAssets:
            available[0].total,

          maintenanceAssets:
            maintenance[0].total,

          totalUsers:
            users[0].total,
        },
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message:
          "Server error",
      });
    }
  };

exports.getStatusChart =
  async (req, res) => {
    try {
      const [data] =
        await db.query(
          `
          SELECT
            status,
            COUNT(*) AS count
          FROM assets
          GROUP BY status
        `
        );

      res.json({
        success: true,
        data,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message:
          "Server error",
      });
    }
  };

exports.getCategoryChart =
  async (req, res) => {
    try {
      const [data] =
        await db.query(
          `
          SELECT
            category,
            COUNT(*) AS count
          FROM assets
          GROUP BY category
        `
        );

      res.json({
        success: true,
        data,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message:
          "Server error",
      });
    }
  };

exports.getRecentActivity =
  async (req, res) => {
    try {
      const [activities] =
        await db.query(
          `
          SELECT
            asset_id,
            asset_name,
            status,
            updated_at
          FROM assets
          ORDER BY updated_at DESC
          LIMIT 10
        `
        );

      res.json({
        success: true,
        activities,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message:
          "Server error",
      });
    }
  };