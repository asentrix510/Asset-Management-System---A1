require("dotenv").config();
const db = require("../config/db");

async function main() {
  try {
    console.log("Checking if plain_password column exists...");
    const [columns] = await db.query("SHOW COLUMNS FROM users LIKE 'plain_password'");
    if (columns.length === 0) {
      console.log("Adding plain_password column...");
      await db.query("ALTER TABLE users ADD COLUMN plain_password VARCHAR(255)");
      console.log("Column plain_password added successfully.");
    } else {
      console.log("Column plain_password already exists.");
    }
    process.exit(0);
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  }
}

main();
