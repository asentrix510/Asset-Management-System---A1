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
        password,
        plain_password,
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
        password,
        plain_password,
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
        plain_password,
        role
      )
      VALUES (
        UUID(),
        ?,?,?,?,?,?,?,?
      )
    `,
      [
        userData.name,
        userData.department,
        userData.designation,
        userData.phone,
        userData.email,
        userData.password,
        userData.plain_password,
        userData.role,
      ]
    );

    return result;
  },

  update: async (id, userData) => {
    let query = `
      UPDATE users
      SET
        name=?,
        department=?,
        designation=?,
        phone=?,
        email=?,
        role=?
    `;
    const params = [
      userData.name,
      userData.department,
      userData.designation,
      userData.phone,
      userData.email,
      userData.role,
    ];

    if (userData.password) {
      query += `, password=?, plain_password=?`;
      params.push(userData.password, userData.plain_password);
    }

    query += ` WHERE user_id=?`;
    params.push(id);

    const [result] = await db.query(query, params);
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