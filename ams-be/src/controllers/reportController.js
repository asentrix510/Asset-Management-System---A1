const db = require("../config/db");

exports.getAssetReport = async (req, res) => {
  try {
    const [assets] = await db.query(`
      SELECT *
      FROM assets
      ORDER BY created_at DESC
    `);

    res.json({
      success: true,
      assets,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.getAssignmentReport = async (req, res) => {
  try {
    const [assignments] = await db.query(`
      SELECT
        aa.*,
        a.asset_name,
        a.asset_code,
        u.name AS user_name
      FROM asset_assignments aa
      JOIN assets a
        ON aa.asset_id = a.asset_id
      JOIN users u
        ON aa.user_id = u.user_id
      ORDER BY aa.created_at DESC
    `);

    res.json({
      success: true,
      assignments,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.getMaintenanceReport = async (req, res) => {
  try {
    const [maintenance] = await db.query(`
      SELECT
        m.*,
        a.asset_name,
        a.asset_code
      FROM maintenance m
      JOIN assets a
        ON m.asset_id = a.asset_id
      ORDER BY m.created_at DESC
    `);

    res.json({
      success: true,
      maintenance,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.getVendorReport = async (req, res) => {
  try {
    const [vendors] = await db.query(`
      SELECT *
      FROM vendors
      ORDER BY vendor_id DESC
    `);

    res.json({
      success: true,
      vendors,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.getAuditReport = async (req, res) => {
  try {
    const [logs] = await db.query(`
      SELECT
        a.*,
        u.name AS user_name
      FROM audit_logs a
      LEFT JOIN users u
        ON a.user_id = u.user_id
      ORDER BY a.created_at DESC
    `);

    res.json({
      success: true,
      logs,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};