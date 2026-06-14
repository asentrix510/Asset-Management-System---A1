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