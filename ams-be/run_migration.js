require("dotenv").config();
const db = require("./src/config/db");

async function main() {
  try {
    console.log("Starting SuperAdmin role migration...");

    // 1. Modify the role enum column to support SuperAdmin
    console.log("Modifying users table role column...");
    await db.query(`
      ALTER TABLE \`users\`
      MODIFY COLUMN \`role\` ENUM('Admin', 'User', 'SuperAdmin') NOT NULL
    `);
    console.log("Successfully modified role enum column.");

    // 2. Clean up any existing superadmin user to avoid duplication errors
    console.log("Checking for existing superadmin user...");
    await db.query("DELETE FROM `users` WHERE `email` = 'superadmin@ams.local'");

    // 3. Insert the SuperAdmin account
    console.log("Inserting SuperAdmin user account...");
    const uuidQuery = "SELECT UUID() AS uuid";
    const [uuidResult] = await db.query(uuidQuery);
    const userId = uuidResult[0].uuid;

    const insertQuery = `
      INSERT INTO \`users\` (
        \`user_id\`,
        \`name\`,
        \`department\`,
        \`designation\`,
        \`phone\`,
        \`email\`,
        \`password\`,
        \`plain_password\`,
        \`role\`
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      userId,
      "Super Admin",
      "Management",
      "System SuperAdmin",
      null,
      "superadmin@ams.local",
      "$2b$10$dj04X0t7rWjyMqFt4elxhuUqOWuP9yAPp2nK41vOS45VdozjXKl86", // SuperAdmin@AMS2026
      "SuperAdmin@AMS2026",
      "SuperAdmin"
    ];

    await db.query(insertQuery, params);
    console.log("SuperAdmin account successfully created!");
    console.log("Email: superadmin@ams.local");
    console.log("Password: SuperAdmin@AMS2026");

    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

main();
