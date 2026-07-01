const db = require("../config/db");
const { logAudit } = require("../services/auditService");

exports.getMaintenanceRecords =
  async (req, res) => {
    try {
      const [records] =
        await db.query(
          `
          SELECT
            m.*,
            a.asset_name,
            a.asset_code
          FROM maintenance m
          JOIN assets a
            ON m.asset_id = a.asset_id
          ORDER BY m.created_at DESC
          `
        );

      res.json({
        success: true,
        records,
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

exports.getMaintenanceById =
  async (req, res) => {
    try {
      const { id } =
        req.params;

      const [record] =
        await db.query(
          `
          SELECT *
          FROM maintenance
          WHERE maintenance_id = ?
          `,
          [id]
        );

      if (!record.length) {
        return res
          .status(404)
          .json({
            success: false,
            message:
              "Maintenance record not found",
          });
      }

      res.json({
        success: true,
        record:
          record[0],
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

exports.createMaintenance =
  async (req, res) => {
    try {
      const {
        asset_id,
        issue_description,
        maintenance_date,
        cost,
        status,
        remarks,
      } = req.body;

      if (cost != null && Number(cost) < 0) {
        return res.status(400).json({ success: false, message: "Maintenance cost cannot be negative" });
      }

      if (maintenance_date && new Date(maintenance_date) > new Date()) {
        return res.status(400).json({ success: false, message: "Maintenance date cannot be in the future" });
      }

      const [result] =
        await db.query(
          `
          INSERT INTO maintenance (
            asset_id,
            issue_description,
            maintenance_date,
            cost,
            status,
            remarks
          )
          VALUES (?, ?, ?, ?, ?, ?)
          `,
          [
            asset_id,
            issue_description,
            maintenance_date,
            cost,
            status,
            remarks,
          ]
        );

      await db.query(
        `
        UPDATE assets
        SET status = 'Maintenance'
        WHERE asset_id = ?
        `,
        [asset_id]
      );

      await logAudit({
        user_id: req.user.userId,
        action: "MAINTENANCE_CREATE",
        module_name: "MAINTENANCE",
        record_id: result.insertId,
        description: `Created maintenance record`,
      });
      await db.query(
  `
  INSERT INTO notifications
  (
    title,
    message,
    type
  )
  VALUES (?, ?, ?)
  `,
  [
    "Maintenance Created",
    `Asset sent for maintenance`,
    "Maintenance",
  ]
);
      res.status(201).json({
        success: true,
        message:
          "Maintenance record created",
        maintenanceId:
          result.insertId,
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

exports.updateMaintenance =
  async (req, res) => {
    try {
      const { id } =
        req.params;

      const {
        asset_id,
        issue_description,
        maintenance_date,
        cost,
        status,
        remarks,
      } = req.body;

      if (cost != null && Number(cost) < 0) {
        return res.status(400).json({ success: false, message: "Maintenance cost cannot be negative" });
      }

      if (maintenance_date && new Date(maintenance_date) > new Date()) {
        return res.status(400).json({ success: false, message: "Maintenance date cannot be in the future" });
      }

      await db.query(
        `
        UPDATE maintenance
        SET
          asset_id = ?,
          issue_description = ?,
          maintenance_date = ?,
          cost = ?,
          status = ?,
          remarks = ?
        WHERE maintenance_id = ?
        `,
        [
          asset_id,
          issue_description,
          maintenance_date,
          cost,
          status,
          remarks,
          id,
        ]
      );

      if (
        status ===
        "Completed"
      ) {
        await db.query(
          `
          UPDATE assets
          SET status = 'Available'
          WHERE asset_id = ?
          `,
          [asset_id]
        );
      }

      await logAudit({
        user_id: req.user.userId,
        action: "MAINTENANCE_UPDATE",
        module_name: "MAINTENANCE",
        record_id: id,
        description: `Updated maintenance record`,
      });

      res.json({
        success: true,
        message:
          "Maintenance updated",
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

exports.deleteMaintenance =
  async (req, res) => {
    try {
      const { id } =
        req.params;

      await db.query(
        `
        DELETE FROM maintenance
        WHERE maintenance_id = ?
        `,
        [id]
      );

      await logAudit({
        user_id: req.user.userId,
        action: "MAINTENANCE_DELETE",
        module_name: "MAINTENANCE",
        record_id: id,
        description: `Deleted maintenance record`,
      });

      res.json({
        success: true,
        message:
          "Maintenance record deleted",
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