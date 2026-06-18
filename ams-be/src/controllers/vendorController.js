const db = require("../config/db");
const { logAudit } = require("../services/auditService");

exports.getVendors = async (req, res) => {
  try {
    const [vendors] = await db.query(
      `SELECT *
       FROM vendors
       ORDER BY vendor_id DESC`
    );

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

exports.getVendorById = async (req, res) => {
  try {
    const { id } = req.params;

    const [vendor] = await db.query(
      `SELECT *
       FROM vendors
       WHERE vendor_id = ?`,
      [id]
    );

    if (!vendor.length) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    res.json({
      success: true,
      vendor: vendor[0],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.createVendor = async (req, res) => {
  try {
    const {
      vendor_name,
      contact_person,
      email,
      phone,
      address,
    } = req.body;

    const [result] = await db.query(
      `
      INSERT INTO vendors (
        vendor_name,
        contact_person,
        email,
        phone,
        address
      )
      VALUES (?, ?, ?, ?, ?)
      `,
      [
        vendor_name,
        contact_person,
        email,
        phone,
        address,
      ]
    );

    const vendorId = result.insertId;

    await logAudit({
      user_id: req.user.userId,
      action: "VENDOR_CREATE",
      module_name: "VENDORS",
      record_id: vendorId,
      description: `Created vendor ${vendor_name}`,
    });

    res.status(201).json({
      success: true,
      message: "Vendor created successfully",
      vendorId,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.updateVendor = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      vendor_name,
      contact_person,
      email,
      phone,
      address,
    } = req.body;

    await db.query(
      `
      UPDATE vendors
      SET
        vendor_name = ?,
        contact_person = ?,
        email = ?,
        phone = ?,
        address = ?
      WHERE vendor_id = ?
      `,
      [
        vendor_name,
        contact_person,
        email,
        phone,
        address,
        id,
      ]
    );

    await logAudit({
      user_id: req.user.userId,
      action: "VENDOR_UPDATE",
      module_name: "VENDORS",
      record_id: id,
      description: `Updated vendor ${id}`,
    });

    res.json({
      success: true,
      message: "Vendor updated successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.deleteVendor = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query(
      `
      DELETE FROM vendors
      WHERE vendor_id = ?
      `,
      [id]
    );

    await logAudit({
      user_id: req.user.userId,
      action: "VENDOR_DELETE",
      module_name: "VENDORS",
      record_id: id,
      description: `Deleted vendor ${id}`,
    });

    res.json({
      success: true,
      message: "Vendor deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};