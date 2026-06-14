const db = require("../config/db");
const generateId = require(
  "../utils/generateId"
);
const AssetAssignment = {
  getAll: async () => {
    const [rows] =
      await db.query(`
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

    return rows;
  },

 create: async (data) => {
  const {
    asset_id,
    user_id,
    assigned_date,
  } = data;

  const assignment_id =
    generateId();

    await db.query(
      `
      INSERT INTO asset_assignments (
        assignment_id,
        asset_id,
        user_id,
        assigned_date
      )
      VALUES (?, ?, ?, ?)
      `,
      [
        assignment_id,
        asset_id,
        user_id,
        assigned_date,
      ]
    );

    await db.query(
      `
      UPDATE assets
      SET status='Assigned'
      WHERE asset_id=?
      `,
      [asset_id]
    );
  },

  returnAsset: async (
    assignmentId
  ) => {
    const [rows] =
      await db.query(
        `
        SELECT asset_id
        FROM asset_assignments
        WHERE assignment_id=?
        `,
        [assignmentId]
      );

    if (!rows.length) {
      throw new Error(
        "Assignment not found"
      );
    }

    const assetId =
      rows[0].asset_id;

    await db.query(
      `
      UPDATE asset_assignments
      SET
        status='Returned',
        return_date=CURDATE()
      WHERE assignment_id=?
      `,
      [assignmentId]
    );

    await db.query(
      `
      UPDATE assets
      SET status='Available'
      WHERE asset_id=?
      `,
      [assetId]
    );
  },
};

module.exports =
  AssetAssignment;