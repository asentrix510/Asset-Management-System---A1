const db = require("../config/db");
const bcrypt = require("bcryptjs");

/**
 * GET /api/portal/me
 * Returns the currently logged-in user's profile.
 */
exports.getMyProfile = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT user_id, name, email, phone, department, designation, role
       FROM users WHERE user_id = ?`,
      [req.user.userId]
    );
    if (!rows.length) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.json({ success: true, user: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * PUT /api/portal/me
 * Allows the user to update their own name and phone only.
 */
exports.updateMyProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;
    await db.query(
      `UPDATE users SET name = ?, phone = ? WHERE user_id = ?`,
      [name, phone, req.user.userId]
    );
    res.json({ success: true, message: "Profile updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * GET /api/portal/my-assets
 * Returns all active (non-returned) assignments for the logged-in user,
 * joined with full asset details.
 */
exports.getMyAssets = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT
         aa.assignment_id,
         aa.assigned_date,
         aa.return_date,
         aa.status AS assignment_status,
         a.asset_id,
         a.asset_code,
         a.asset_name,
         a.category,
         a.brand,
         a.model,
         a.serial_number,
         a.status AS asset_status,
         a.purchase_date,
         a.purchase_cost,
         a.warranty_expiry,
         a.vendor_name,
         a.description
       FROM asset_assignments aa
       JOIN assets a ON aa.asset_id = a.asset_id
       WHERE aa.user_id = ?
       ORDER BY aa.assigned_date DESC`,
      [req.user.userId]
    );
    res.json({ success: true, assignments: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * GET /api/portal/my-maintenance
 * Returns maintenance records for assets ever assigned to the logged-in user.
 */
exports.getMyMaintenance = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT
         m.maintenance_id,
         m.issue_description,
         m.maintenance_date,
         m.cost,
         m.status,
         m.remarks,
         m.created_at,
         a.asset_id,
         a.asset_code,
         a.asset_name,
         a.category
       FROM maintenance m
       JOIN assets a ON m.asset_id = a.asset_id
       WHERE a.asset_id IN (
         SELECT asset_id FROM asset_assignments WHERE user_id = ?
       )
       ORDER BY m.created_at DESC`,
      [req.user.userId]
    );
    res.json({ success: true, records: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
