const db = require("../config/db");

const Asset = {
  getAll: async () => {
    const [rows] = await db.query(`
      SELECT *
      FROM assets
      ORDER BY created_at DESC
    `);

    return rows;
  },

  getById: async (id) => {
    const [rows] = await db.query(
      `
      SELECT *
      FROM assets
      WHERE asset_id = ?
      `,
      [id]
    );

    return rows[0];
  },

  create: async (data) => {
    const [result] = await db.query(
      `
      INSERT INTO assets (
        asset_id,
        asset_code,
        asset_name,
        category,
        brand,
        model,
        serial_number,
        purchase_date,
        purchase_cost,
        vendor_name,
        status,
        warranty_expiry,
        description,
        image_path,
        invoice_path
      )
      VALUES (
        UUID(),
        ?,?,?,?,?,?,?,?,?,?,?,?,?,?
      )
      `,
      [
        data.asset_code,
        data.asset_name,
        data.category,
        data.brand,
        data.model,
        data.serial_number,
        data.purchase_date,
        data.purchase_cost,
        data.vendor_name,
        data.status,
        data.warranty_expiry,
        data.description,
        data.image_path || null,
        data.invoice_path || null,
      ]
    );

    return result;
  },

  update: async (id, data) => {
    const [result] = await db.query(
      `
      UPDATE assets
      SET
        asset_code=?,
        asset_name=?,
        category=?,
        brand=?,
        model=?,
        serial_number=?,
        purchase_date=?,
        purchase_cost=?,
        vendor_name=?,
        status=?,
        warranty_expiry=?,
        description=?,
        image_path=?,
        invoice_path=?
      WHERE asset_id=?
      `,
      [
        data.asset_code,
        data.asset_name,
        data.category,
        data.brand,
        data.model,
        data.serial_number,
        data.purchase_date,
        data.purchase_cost,
        data.vendor_name,
        data.status,
        data.warranty_expiry,
        data.description,
        data.image_path !== undefined ? data.image_path : null,
        data.invoice_path !== undefined ? data.invoice_path : null,
        id,
      ]
    );

    return result;
  },

  delete: async (id) => {
    const [result] = await db.query(
      `
      DELETE FROM assets
      WHERE asset_id=?
      `,
      [id]
    );

    return result;
  },
};

module.exports = Asset;