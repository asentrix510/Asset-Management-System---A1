require("dotenv").config();
const db = require("./src/config/db");

async function main() {
  try {
    console.log("Starting Asset uploads database migration...");

    // Add columns if they do not exist
    console.log("Adding image_path and invoice_path columns to assets table...");
    try {
      await db.query(`
        ALTER TABLE \`assets\`
        ADD COLUMN \`image_path\` varchar(500) DEFAULT NULL AFTER \`description\`,
        ADD COLUMN \`invoice_path\` varchar(500) DEFAULT NULL AFTER \`image_path\`
      `);
      console.log("Columns successfully added!");
    } catch (err) {
      if (err.code === "ER_DUP_COLUMNNAME") {
        console.log("Columns already exist, migration skipped.");
      } else {
        throw err;
      }
    }

    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

main();
