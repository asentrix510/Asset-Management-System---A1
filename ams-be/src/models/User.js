const db = require("../config/db");

const User = {
  getAll: async () => {
    const [rows] = await db.query(`
      SELECT
        user_id,
        name,
        department,
        designation,
        phone,
        email,
        role
      FROM users
      ORDER BY name
    `);

    return rows;
  },

  getById: async (id) => {
    const [rows] = await db.query(
      `
      SELECT
        user_id,
        name,
        department,
        designation,
        phone,
        email,
        role
      FROM users
      WHERE user_id = ?
    `,
      [id]
    );

    return rows[0];
  },

  create: async (userData) => {
    const [result] = await db.query(
      `
      INSERT INTO users (
        user_id,
        name,
        department,
        designation,
        phone,
        email,
        password,
        role
      )
      VALUES (
        UUID(),
        ?,?,?,?,?,?,?
      )
    `,
      [
        userData.name,
        userData.department,
        userData.designation,
        userData.phone,
        userData.email,
        userData.password,
        userData.role,
      ]
    );

    return result;
  },

  update: async (id, userData) => {
    const [result] = await db.query(
      `
      UPDATE users
      SET
        name=?,
        department=?,
        designation=?,
        phone=?,
        email=?,
        role=?
      WHERE user_id=?
    `,
      [
        userData.name,
        userData.department,
        userData.designation,
        userData.phone,
        userData.email,
        userData.role,
        id,
      ]
    );

    return result;
  },

  delete: async (id) => {
    const [result] = await db.query(
      "DELETE FROM users WHERE user_id=?",
      [id]
    );

    return result;
  },
};

module.exports = User;