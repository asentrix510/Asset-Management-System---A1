require("dotenv").config();
const db = require("../config/db");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");

async function main() {
  console.log("Starting database seeding process...");

  try {
    // 1. Disable Foreign Key Checks
    await db.query("SET FOREIGN_KEY_CHECKS = 0");
    console.log("Foreign key checks disabled.");

    // 2. Truncate Tables
    const tables = [
      "audit_logs",
      "notifications",
      "maintenance",
      "asset_assignments",
      "assets",
      "users",
      "vendors"
    ];
    for (const table of tables) {
      await db.query(`TRUNCATE TABLE \`${table}\``);
      console.log(`Truncated table: ${table}`);
    }

    // 3. Hash Passwords
    const hashPassword = async (pwd) => {
      return await bcrypt.hash(pwd, 10);
    };

    const adminHash = await hashPassword("admin123");
    const userHash1 = await hashPassword("123456");
    const userHash2 = await hashPassword("asdfgh");
    const defaultHash = await hashPassword("password123");

    // 4. Seed Users
    const users = [
      {
        user_id: "1097bcad-6266-11f1-bebd-28c5c8d8b7e0",
        name: "System Administrator",
        department: "IT",
        designation: "Administrator",
        phone: "9999999999",
        email: "admin@ams.com",
        password: adminHash,
        plain_password: "admin123",
        role: "Admin"
      },
      {
        user_id: "252013c2-6ed6-11f1-9e21-28c5c8d8b7e0",
        name: "Snehanshu Kar",
        department: "IT",
        designation: "Sr. IT Engineer",
        phone: "+918260885057",
        email: "asentrix510@gmail.com",
        password: userHash1,
        plain_password: "123456",
        role: "User"
      },
      {
        user_id: "59cd3e8a-7127-11f1-9aa6-28c5c8d8b7e0",
        name: "Ramesh Kumar Patra",
        department: "Electrical",
        designation: "Sr. Power Engineer",
        phone: "+918904904091",
        email: "rmp@gmail.com",
        password: userHash2,
        plain_password: "asdfgh",
        role: "User"
      },
      {
        user_id: "bc242d41-63c9-11f1-bebd-28c5c8d8b7e0",
        name: "John Doe",
        department: "IT",
        designation: "Jr. IT Engineer",
        phone: "+918260885057",
        email: "karsnehanshu@gmail.com",
        password: userHash1,
        plain_password: "123456",
        role: "User"
      },
      {
        user_id: uuidv4(),
        name: "Sarah Jenkins",
        department: "HR",
        designation: "HR Associate",
        phone: "+919876500111",
        email: "sarah.hr@ams.com",
        password: defaultHash,
        plain_password: "password123",
        role: "User"
      },
      {
        user_id: uuidv4(),
        name: "James Carter",
        department: "HR",
        designation: "HR Manager",
        phone: "+919876500112",
        email: "hr_manager@ams.com",
        password: defaultHash,
        plain_password: "password123",
        role: "Admin"
      },
      {
        user_id: uuidv4(),
        name: "Sophia Martinez",
        department: "Finance",
        designation: "Accountant",
        phone: "+919876500222",
        email: "john.finance@ams.com",
        password: defaultHash,
        plain_password: "password123",
        role: "User"
      },
      {
        user_id: uuidv4(),
        name: "Robert Vance",
        department: "Finance",
        designation: "Finance Manager",
        phone: "+919876500223",
        email: "finance_lead@ams.com",
        password: defaultHash,
        plain_password: "password123",
        role: "Admin"
      },
      {
        user_id: uuidv4(),
        name: "Michael Scott",
        department: "Sales",
        designation: "Sales Representative",
        phone: "+919876500333",
        email: "alice.sales@ams.com",
        password: defaultHash,
        plain_password: "password123",
        role: "User"
      },
      {
        user_id: uuidv4(),
        name: "Dwight Schrute",
        department: "Operations",
        designation: "Operations Coordinator",
        phone: "+919876500444",
        email: "charlie.ops@ams.com",
        password: defaultHash,
        plain_password: "password123",
        role: "User"
      },
      {
        user_id: uuidv4(),
        name: "Pam Beesly",
        department: "Administration",
        designation: "Office Administrator",
        phone: "+919876500555",
        email: "pam.admin@ams.com",
        password: defaultHash,
        plain_password: "password123",
        role: "User"
      },
      {
        user_id: uuidv4(),
        name: "Jim Halpert",
        department: "Engineering",
        designation: "Software Engineer",
        phone: "+919876500666",
        email: "bob.engineer@ams.com",
        password: defaultHash,
        plain_password: "password123",
        role: "User"
      }
    ];

    for (const u of users) {
      await db.query(
        `INSERT INTO users (user_id, name, department, designation, phone, email, password, plain_password, role)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [u.user_id, u.name, u.department, u.designation, u.phone, u.email, u.password, u.plain_password, u.role]
      );
    }
    console.log(`Successfully seeded ${users.length} users.`);

    // 5. Seed Vendors
    const vendors = [
      {
        vendor_id: 2,
        vendor_name: "Dell Technologies",
        contact_person: "John Smith",
        email: "sales@dell.com",
        phone: "+919876543210",
        address: "Bangalore, Karnataka, India"
      },
      {
        vendor_id: 3,
        vendor_name: "Apple India",
        contact_person: "Priya Nair",
        email: "retail@apple.com",
        phone: "+919123456789",
        address: "Mumbai, Maharashtra, India"
      },
      {
        vendor_id: 4,
        vendor_name: "Nova Technologies",
        contact_person: "Dave",
        email: "contact@nova.com",
        phone: "+918888888888",
        address: "Noida, UP, India"
      },
      {
        vendor_id: 5,
        vendor_name: "Office Depot",
        contact_person: "Mark",
        email: "sales@officedepot.com",
        phone: "+917777777777",
        address: "Chennai, Tamil Nadu, India"
      },
      {
        vendor_id: 6,
        vendor_name: "HP Store",
        contact_person: "Rajesh",
        email: "support@hp.com",
        phone: "+916666666666",
        address: "Hyderabad, Telangana, India"
      },
      {
        vendor_id: 7,
        vendor_name: "Logitech India",
        contact_person: "Anita",
        email: "logistics@logitech.com",
        phone: "+915555555555",
        address: "Gurgaon, Haryana, India"
      }
    ];

    for (const v of vendors) {
      await db.query(
        `INSERT INTO vendors (vendor_id, vendor_name, contact_person, email, phone, address)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [v.vendor_id, v.vendor_name, v.contact_person, v.email, v.phone, v.address]
      );
    }
    console.log(`Successfully seeded ${vendors.length} vendors.`);

    // Helper map of user email to UUID
    const userMap = {};
    users.forEach(u => {
      userMap[u.email] = u.user_id;
    });

    // 6. Seed Assets
    const assets = [
      {
        asset_id: "091f3ea3-6eca-11f1-9e21-28c5c8d8b7e0",
        asset_code: "MON002",
        asset_name: "Asus ROG Swift",
        category: "Monitor",
        brand: "Asus",
        model: "ROG Swift",
        serial_number: "SN-123",
        purchase_date: "2026-06-24",
        purchase_cost: 75000.00,
        vendor_name: "Nova Technologies",
        status: "Assigned",
        warranty_expiry: "2026-09-12",
        description: "Asus ROG Swift Gaming Laptop/Monitor for unrivaled precision and seamless experience"
      },
      {
        asset_id: "2573b566-655c-11f1-bebd-28c5c8d8b7e0",
        asset_code: "MON001",
        asset_name: "Acer A93",
        category: "Monitor",
        brand: "Acer",
        model: "A93",
        serial_number: "SN-MON-001",
        purchase_date: "2025-06-11",
        purchase_cost: 15000.00,
        vendor_name: "Nova Technologies",
        status: "Available",
        warranty_expiry: "2027-06-11",
        description: "Acer full HD standard office monitor"
      },
      {
        asset_id: "36915e93-63cc-11f1-bebd-28c5c8d8b7e0",
        asset_code: "LAP001",
        asset_name: "Dell Latitude 5420",
        category: "Laptop",
        brand: "Dell",
        model: "Latitude 5420",
        serial_number: "DL123456",
        purchase_date: "2026-01-11",
        purchase_cost: 65000.00,
        vendor_name: "Dell Technologies",
        status: "Assigned",
        warranty_expiry: "2029-01-10",
        description: "Development Laptop for engineers"
      },
      {
        asset_id: "fca76db5-6a5a-11f1-9e21-28c5c8d8b7e0",
        asset_code: "ROU001",
        asset_name: "Tenda D65260 Router",
        category: "Router",
        brand: "Tenda",
        model: "D65260",
        serial_number: "SN-ROU-001",
        purchase_date: "2026-06-17",
        purchase_cost: 4500.00,
        vendor_name: "Nova Technologies",
        status: "Assigned",
        warranty_expiry: "2027-06-17",
        description: "High speed wireless office router"
      },
      {
        asset_id: "0787ee1e-63cd-11f1-bebd-28c5c8d8b7e0",
        asset_code: "PRI001",
        asset_name: "HP LaserJet Pro",
        category: "Printer",
        brand: "HP",
        model: "LaserJet Pro",
        serial_number: "SN-HP-PRI-01",
        purchase_date: "2025-12-09",
        purchase_cost: 15000.00,
        vendor_name: "HP Store",
        status: "Maintenance",
        warranty_expiry: "2026-12-09",
        description: "Heavy duty printing asset for Admin and HR requirements"
      },
      {
        asset_id: uuidv4(),
        asset_code: "LAP002",
        asset_name: "MacBook Pro M2",
        category: "Laptop",
        brand: "Apple",
        model: "MacBook Pro 14",
        serial_number: "AP-MBP-14-02",
        purchase_date: "2026-02-15",
        purchase_cost: 120000.00,
        vendor_name: "Apple India",
        status: "Assigned",
        warranty_expiry: "2028-02-15",
        description: "Apple MacBook Pro with M2 processor for engineering leads"
      },
      {
        asset_id: uuidv4(),
        asset_code: "LAP003",
        asset_name: "Lenovo ThinkPad X1 Carbon",
        category: "Laptop",
        brand: "Lenovo",
        model: "ThinkPad X1",
        serial_number: "LE-TPX1-03",
        purchase_date: "2026-03-10",
        purchase_cost: 95000.00,
        vendor_name: "Nova Technologies",
        status: "Available",
        warranty_expiry: "2028-03-10",
        description: "Business laptop for general staff"
      },
      {
        asset_id: uuidv4(),
        asset_code: "LAP004",
        asset_name: "MacBook Air M1",
        category: "Laptop",
        brand: "Apple",
        model: "MacBook Air 13",
        serial_number: "AP-MBA-13-04",
        purchase_date: "2025-08-20",
        purchase_cost: 80000.00,
        vendor_name: "Apple India",
        status: "Assigned",
        warranty_expiry: "2027-08-20",
        description: "Lightweight laptop for HR recruitment"
      },
      {
        asset_id: "542a8b92-8db4-11f1-bebd-28c5c8d8b7e0",
        asset_code: "LAP005",
        asset_name: "Dell XPS 15",
        category: "Laptop",
        brand: "Dell",
        model: "XPS 15 9520",
        serial_number: "DL-XPS15-05",
        purchase_date: "2025-11-20",
        purchase_cost: 110000.00,
        vendor_name: "Dell Technologies",
        status: "Maintenance",
        warranty_expiry: "2027-11-20",
        description: "Developer XPS laptop with 32GB RAM"
      },
      {
        asset_id: uuidv4(),
        asset_code: "MON003",
        asset_name: "Samsung 27 inch Curved Monitor",
        category: "Monitor",
        brand: "Samsung",
        model: "C27F390",
        serial_number: "SA-MON-27-03",
        purchase_date: "2026-04-05",
        purchase_cost: 22000.00,
        vendor_name: "Nova Technologies",
        status: "Assigned",
        warranty_expiry: "2028-04-05",
        description: "Samsung Curved desktop monitor"
      },
      {
        asset_id: uuidv4(),
        asset_code: "MON004",
        asset_name: "LG 34 inch UltraWide Monitor",
        category: "Monitor",
        brand: "LG",
        model: "34WN750",
        serial_number: "LG-MON-34-04",
        purchase_date: "2026-05-18",
        purchase_cost: 35000.00,
        vendor_name: "Nova Technologies",
        status: "Available",
        warranty_expiry: "2028-05-18",
        description: "UltraWide monitor for multitasking and spreadsheet view"
      },
      {
        asset_id: uuidv4(),
        asset_code: "ROU002",
        asset_name: "Cisco ISR 1100 Router",
        category: "Router",
        brand: "Cisco",
        model: "ISR 1100",
        serial_number: "CS-ROU-1100-02",
        purchase_date: "2026-01-20",
        purchase_cost: 25000.00,
        vendor_name: "Nova Technologies",
        status: "Available",
        warranty_expiry: "2029-01-20",
        description: "Enterprise firewall and gateway router"
      },
      {
        asset_id: uuidv4(),
        asset_code: "PRI002",
        asset_name: "Epson EcoTank L3250",
        category: "Printer",
        brand: "Epson",
        model: "EcoTank L3250",
        serial_number: "EP-PRI-3250-02",
        purchase_date: "2026-03-22",
        purchase_cost: 18000.00,
        vendor_name: "HP Store",
        status: "Available",
        warranty_expiry: "2028-03-22",
        description: "Color printing scanner and copier"
      },
      {
        asset_id: uuidv4(),
        asset_code: "MOB001",
        asset_name: "iPhone 14 Pro",
        category: "Mobile",
        brand: "Apple",
        model: "iPhone 14 Pro 256GB",
        serial_number: "AP-MOB-14P-01",
        purchase_date: "2026-01-05",
        purchase_cost: 100000.00,
        vendor_name: "Apple India",
        status: "Assigned",
        warranty_expiry: "2027-01-05",
        description: "Testing device for iOS engineers"
      },
      {
        asset_id: uuidv4(),
        asset_code: "MOB002",
        asset_name: "Samsung Galaxy S23",
        category: "Mobile",
        brand: "Samsung",
        model: "Galaxy S23 128GB",
        serial_number: "SA-MOB-S23-02",
        purchase_date: "2026-02-18",
        purchase_cost: 75000.00,
        vendor_name: "Nova Technologies",
        status: "Available",
        warranty_expiry: "2027-02-18",
        description: "Testing device for Android developers"
      },
      {
        asset_id: uuidv4(),
        asset_code: "TAB001",
        asset_name: "iPad Air 5th Gen",
        category: "Mobile",
        brand: "Apple",
        model: "iPad Air M1",
        serial_number: "AP-TAB-AIR-01",
        purchase_date: "2026-03-14",
        purchase_cost: 55000.00,
        vendor_name: "Apple India",
        status: "Assigned",
        warranty_expiry: "2028-03-14",
        description: "Demonstration device for Sales representatives"
      },
      {
        asset_id: uuidv4(),
        asset_code: "ACC001",
        asset_name: "Logitech MX Master 3S Mouse",
        category: "Accessory",
        brand: "Logitech",
        model: "MX Master 3S",
        serial_number: "LT-ACC-MXM-01",
        purchase_date: "2026-04-12",
        purchase_cost: 9000.00,
        vendor_name: "Logitech India",
        status: "Assigned",
        warranty_expiry: "2027-04-12",
        description: "Ergonomic professional designer mouse"
      },
      {
        asset_id: uuidv4(),
        asset_code: "ACC002",
        asset_name: "Logitech MX Keys Keyboard",
        category: "Accessory",
        brand: "Logitech",
        model: "MX Keys",
        serial_number: "LT-ACC-MXK-02",
        purchase_date: "2026-04-12",
        purchase_cost: 12000.00,
        vendor_name: "Logitech India",
        status: "Assigned",
        warranty_expiry: "2027-04-12",
        description: "Wireless mechanical key structure keyboard"
      },
      {
        asset_id: uuidv4(),
        asset_code: "ACC003",
        asset_name: "Apple Magic Mouse 2",
        category: "Accessory",
        brand: "Apple",
        model: "Magic Mouse 2",
        serial_number: "AP-ACC-MM2-03",
        purchase_date: "2026-05-01",
        purchase_cost: 8000.00,
        vendor_name: "Apple India",
        status: "Available",
        warranty_expiry: "2027-05-01",
        description: "Rechargeable Bluetooth Apple mouse"
      },
      {
        asset_id: uuidv4(),
        asset_code: "ACC004",
        asset_name: "Bose QuietComfort 45 Headphones",
        category: "Accessory",
        brand: "Bose",
        model: "QC45",
        serial_number: "BS-ACC-QC45-04",
        purchase_date: "2026-02-12",
        purchase_cost: 28000.00,
        vendor_name: "Nova Technologies",
        status: "Assigned",
        warranty_expiry: "2027-02-12",
        description: "Active Noise Cancelling headphones for focal support tasks"
      },
      {
        asset_id: uuidv4(),
        asset_code: "FUR001",
        asset_name: "Ergonomic Office Chair",
        category: "Furniture",
        brand: "Featherlite",
        model: "Astro Mesh",
        serial_number: "FL-FUR-CHR-01",
        purchase_date: "2025-10-10",
        purchase_cost: 15000.00,
        vendor_name: "Office Depot",
        status: "Assigned",
        warranty_expiry: "2028-10-10",
        description: "Mesh-back office chair with lumbar adjustment support"
      },
      {
        asset_id: uuidv4(),
        asset_code: "FUR002",
        asset_name: "Standing Desk",
        category: "Furniture",
        brand: "Featherlite",
        model: "Rise Up",
        serial_number: "FL-FUR-DSK-02",
        purchase_date: "2025-10-10",
        purchase_cost: 25000.00,
        vendor_name: "Office Depot",
        status: "Assigned",
        warranty_expiry: "2028-10-10",
        description: "Motorized dual-motor height adjustable desk"
      },
      {
        asset_id: uuidv4(),
        asset_code: "FUR003",
        asset_name: "Executive Desk",
        category: "Furniture",
        brand: "Featherlite",
        model: "Signature Wood",
        serial_number: "FL-FUR-DSK-03",
        purchase_date: "2025-10-12",
        purchase_cost: 35000.00,
        vendor_name: "Office Depot",
        status: "Available",
        warranty_expiry: "2028-10-12",
        description: "Wooden desk for manager cabins"
      },
      {
        asset_id: uuidv4(),
        asset_code: "FUR004",
        asset_name: "Ergonomic Chair Lite",
        category: "Furniture",
        brand: "Featherlite",
        model: "Optima",
        serial_number: "FL-FUR-CHR-04",
        purchase_date: "2025-10-12",
        purchase_cost: 12000.00,
        vendor_name: "Office Depot",
        status: "Available",
        warranty_expiry: "2028-10-12",
        description: "Standard staff room ergonomic seating chair"
      }
    ];

    for (const a of assets) {
      await db.query(
        `INSERT INTO assets (asset_id, asset_code, asset_name, category, brand, model, serial_number, purchase_date, purchase_cost, vendor_name, status, warranty_expiry, description)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [a.asset_id, a.asset_code, a.asset_name, a.category, a.brand, a.model, a.serial_number, a.purchase_date, a.purchase_cost, a.vendor_name, a.status, a.warranty_expiry, a.description]
      );
    }
    console.log(`Successfully seeded ${assets.length} assets.`);

    // Helper map of asset code to UUID
    const assetMap = {};
    assets.forEach(a => {
      assetMap[a.asset_code] = a.asset_id;
    });

    // 7. Seed Asset Assignments
    const assignments = [
      // Active Assignments
      {
        assignment_id: uuidv4(),
        asset_id: assetMap["MON002"],
        user_id: userMap["rmp@gmail.com"],
        assigned_date: "2026-06-26",
        return_date: null,
        status: "Assigned"
      },
      {
        assignment_id: "e97e8e52-60e6-4124-8812-821925d064d1",
        asset_id: assetMap["ROU001"],
        user_id: userMap["karsnehanshu@gmail.com"],
        assigned_date: "2026-06-18",
        return_date: null,
        status: "Assigned"
      },
      {
        assignment_id: "2fb32026-2aa6-41ce-a731-f0288b6e7660",
        asset_id: assetMap["LAP001"],
        user_id: userMap["asentrix510@gmail.com"],
        assigned_date: "2026-06-11",
        return_date: null,
        status: "Assigned"
      },
      {
        assignment_id: uuidv4(),
        asset_id: assetMap["LAP002"],
        user_id: userMap["bob.engineer@ams.com"],
        assigned_date: "2026-02-16",
        return_date: null,
        status: "Assigned"
      },
      {
        assignment_id: uuidv4(),
        asset_id: assetMap["LAP004"],
        user_id: userMap["sarah.hr@ams.com"],
        assigned_date: "2025-08-21",
        return_date: null,
        status: "Assigned"
      },
      {
        assignment_id: uuidv4(),
        asset_id: assetMap["MON003"],
        user_id: userMap["karsnehanshu@gmail.com"],
        assigned_date: "2026-04-06",
        return_date: null,
        status: "Assigned"
      },
      {
        assignment_id: uuidv4(),
        asset_id: assetMap["MOB001"],
        user_id: userMap["finance_lead@ams.com"],
        assigned_date: "2026-01-06",
        return_date: null,
        status: "Assigned"
      },
      {
        assignment_id: uuidv4(),
        asset_id: assetMap["TAB001"],
        user_id: userMap["alice.sales@ams.com"],
        assigned_date: "2026-03-15",
        return_date: null,
        status: "Assigned"
      },
      {
        assignment_id: uuidv4(),
        asset_id: assetMap["ACC001"],
        user_id: userMap["asentrix510@gmail.com"],
        assigned_date: "2026-04-13",
        return_date: null,
        status: "Assigned"
      },
      {
        assignment_id: uuidv4(),
        asset_id: assetMap["ACC002"],
        user_id: userMap["asentrix510@gmail.com"],
        assigned_date: "2026-04-13",
        return_date: null,
        status: "Assigned"
      },
      {
        assignment_id: uuidv4(),
        asset_id: assetMap["ACC004"],
        user_id: userMap["charlie.ops@ams.com"],
        assigned_date: "2026-02-13",
        return_date: null,
        status: "Assigned"
      },
      {
        assignment_id: uuidv4(),
        asset_id: assetMap["FUR001"],
        user_id: userMap["john.finance@ams.com"],
        assigned_date: "2025-10-11",
        return_date: null,
        status: "Assigned"
      },
      {
        assignment_id: uuidv4(),
        asset_id: assetMap["FUR002"],
        user_id: userMap["john.finance@ams.com"],
        assigned_date: "2025-10-11",
        return_date: null,
        status: "Assigned"
      },
      // Historical (Returned) Assignments
      {
        assignment_id: "e93f9613-514d-4c35-bfcd-28db5c8c5107",
        asset_id: assetMap["PRI001"],
        user_id: userMap["admin@ams.com"],
        assigned_date: "2026-01-01",
        return_date: "2026-06-15",
        status: "Returned"
      },
      {
        assignment_id: "a9037f42-816d-481f-a25d-c5d765b35012",
        asset_id: assetMap["MON001"],
        user_id: userMap["karsnehanshu@gmail.com"],
        assigned_date: "2026-05-01",
        return_date: "2026-06-10",
        status: "Returned"
      },
      {
        assignment_id: "78632566-09ea-49b7-9200-612c215e5505",
        asset_id: assetMap["ROU001"],
        user_id: userMap["karsnehanshu@gmail.com"],
        assigned_date: "2026-06-01",
        return_date: "2026-06-17",
        status: "Returned"
      }
    ];

    for (const a of assignments) {
      await db.query(
        `INSERT INTO asset_assignments (assignment_id, asset_id, user_id, assigned_date, return_date, status)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [a.assignment_id, a.asset_id, a.user_id, a.assigned_date, a.return_date, a.status]
      );
    }
    console.log(`Successfully seeded ${assignments.length} asset assignments.`);

    // 8. Seed Maintenance records
    const maintenance = [
      {
        asset_id: assetMap["PRI001"],
        issue_description: "Paper jam and fuser error in printer roller unit",
        maintenance_date: "2026-06-15",
        cost: 2000.00,
        status: "Open",
        remarks: "Replacement parts requested from HP service center"
      },
      {
        asset_id: assetMap["LAP005"],
        issue_description: "Battery swell causing trackpad displacement",
        maintenance_date: "2026-06-20",
        cost: 8500.00,
        status: "In Progress",
        remarks: "Sent to Dell authorized repairs at Bangalore"
      },
      {
        asset_id: assetMap["MON002"],
        issue_description: "Flickering Display screen over HDMI connection",
        maintenance_date: "2026-05-10",
        cost: 4500.00,
        status: "Completed",
        remarks: "Replaced faulty monitor interface port and tested OK"
      },
      {
        asset_id: assetMap["ROU001"],
        issue_description: "Frequent disconnections and corrupted firmware",
        maintenance_date: "2026-04-12",
        cost: 0.00,
        status: "Completed",
        remarks: "Performed clean flash of stable firmware v2.4"
      }
    ];

    for (const m of maintenance) {
      await db.query(
        `INSERT INTO maintenance (asset_id, issue_description, maintenance_date, cost, status, remarks)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [m.asset_id, m.issue_description, m.maintenance_date, m.cost, m.status, m.remarks]
      );
    }
    console.log(`Successfully seeded ${maintenance.length} maintenance records.`);

    // 9. Seed Notifications
    const notifications = [
      {
        user_id: null,
        title: "Asset Sent For Maintenance",
        message: "Epson LaserJet Pro PRI001 has been sent to repairs.",
        type: "Maintenance",
        is_read: 0
      },
      {
        user_id: userMap["asentrix510@gmail.com"],
        title: "Asset Assigned",
        message: "Dell Latitude 5420 (LAP001) has been successfully assigned to you.",
        type: "Assignment",
        is_read: 0
      },
      {
        user_id: userMap["karsnehanshu@gmail.com"],
        title: "Asset Returned",
        message: "Tenda D65260 (ROU001) return request registered successfully.",
        type: "Return",
        is_read: 1
      },
      {
        user_id: userMap["rmp@gmail.com"],
        title: "Asset Assigned",
        message: "Asus ROG Swift MON002 has been successfully assigned to you.",
        type: "Assignment",
        is_read: 1
      },
      {
        user_id: null,
        title: "Warranty Nearing Expiry",
        message: "Apple iPad Air (TAB001) warranty expires in less than 90 days.",
        type: "Warranty",
        is_read: 0
      }
    ];

    for (const n of notifications) {
      await db.query(
        `INSERT INTO notifications (user_id, title, message, type, is_read)
         VALUES (?, ?, ?, ?, ?)`,
        [n.user_id, n.title, n.message, n.type, n.is_read]
      );
    }
    console.log(`Successfully seeded ${notifications.length} notifications.`);

    // 10. Seed Audit Logs
    const auditLogs = [
      {
        user_id: userMap["admin@ams.com"],
        action: "LOGIN",
        module_name: "AUTH",
        record_id: userMap["admin@ams.com"],
        description: "System Administrator logged into the system dashboard"
      },
      {
        user_id: userMap["admin@ams.com"],
        action: "ASSET_CREATE",
        module_name: "ASSETS",
        record_id: assetMap["MON002"],
        description: "Created asset entry: Asus ROG Swift (MON002)"
      },
      {
        user_id: userMap["admin@ams.com"],
        action: "ASSET_ASSIGNED",
        module_name: "ASSIGNMENTS",
        record_id: "2fb32026-2aa6-41ce-a731-f0288b6e7660",
        description: "Assigned asset LAP001 to user Snehanshu Kar"
      },
      {
        user_id: userMap["asentrix510@gmail.com"],
        action: "LOGIN",
        module_name: "AUTH",
        record_id: userMap["asentrix510@gmail.com"],
        description: "Snehanshu Kar logged into user portal"
      },
      {
        user_id: userMap["admin@ams.com"],
        action: "MAINTENANCE_CREATE",
        module_name: "MAINTENANCE",
        record_id: null,
        description: "Sent HP LaserJet Pro PRI001 for servicing"
      }
    ];

    for (const log of auditLogs) {
      await db.query(
        `INSERT INTO audit_logs (user_id, action, module_name, record_id, description)
         VALUES (?, ?, ?, ?, ?)`,
        [log.user_id, log.action, log.module_name, log.record_id, log.description]
      );
    }
    console.log(`Successfully seeded ${auditLogs.length} audit logs.`);

    console.log("Database seeding completed successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Database seeding failed:", err);
    process.exit(1);
  } finally {
    // 11. Re-enable Foreign Key Checks
    await db.query("SET FOREIGN_KEY_CHECKS = 1");
    console.log("Foreign key checks re-enabled.");
  }
}

main();
