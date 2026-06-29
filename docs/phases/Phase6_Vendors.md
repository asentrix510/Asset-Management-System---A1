# Phase 6: Vendor Management (Master Vendor Table)

This phase introduces the centralized Master Vendor Table — a definitive registry of all suppliers, contractors, and manufacturers that the organization interacts with. It serves as a single source of truth for vendor data across procurement, finance, and asset tracking.

## 1. Database Schema

### The `vendors` Table
```sql
CREATE TABLE IF NOT EXISTS `vendors` (
  `vendor_id`      INT           NOT NULL AUTO_INCREMENT,
  `vendor_name`    VARCHAR(255)  NOT NULL,
  `contact_person` VARCHAR(255)  DEFAULT NULL,
  `email`          VARCHAR(255)  DEFAULT NULL,
  `phone`          VARCHAR(20)   DEFAULT NULL,
  `address`        TEXT,
  `created_at`     TIMESTAMP     NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`     TIMESTAMP     NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`vendor_id`)
);
```

- **`vendor_id`**: Auto-incrementing integer primary key.
- **`vendor_name`**: Required name of the supplier.
- **`contact_person`**: Point-of-contact representative.
- **`email`**: Vendor email address.
- **`phone`**: Vendor phone number.
- **`address`**: Full office/corporate address.

---

## 2. Backend API

### Controller (`vendorController.js`)
Manages all CRUD operations for vendor records with audit logging on create, update, and delete.

### Endpoints
1. **`GET /api/vendors`** — Fetch all vendors, ordered by most recent.
   - **Response**: `{ success: true, vendors: [...] }`

2. **`GET /api/vendors/:id`** — Fetch a single vendor by ID.
   - **Response**: `{ success: true, vendor: {...} }`

3. **`POST /api/vendors`** — Register a new vendor.
   - **Request Body**:
     ```json
     {
       "vendor_name": "Dell Technologies",
       "contact_person": "John Smith",
       "email": "sales@dell.com",
       "phone": "+91 9876543210",
       "address": "Corporate HQ, Bangalore"
     }
     ```
   - **Response**: `{ success: true, message: "Vendor created successfully", vendorId: 1 }`
   - **Side Effect**: Creates `VENDOR_CREATE` audit log entry.

4. **`PUT /api/vendors/:id`** — Update an existing vendor record.
   - **Side Effect**: Creates `VENDOR_UPDATE` audit log entry.

5. **`DELETE /api/vendors/:id`** — Delete a vendor record.
   - **Side Effect**: Creates `VENDOR_DELETE` audit log entry.

### Route Configuration (`vendorRoutes.js`)
All vendor routes are protected by `authMiddleware` and `roleMiddleware("Admin")`, restricting access to admin users only.

---

## 3. Frontend Integration

Exposed at `/vendors` in the browser application.

### API Wrapper (`vendorApi.js`)
- `getVendors()` — Fetch all vendors.
- `createVendor(vendorData)` — Register a new vendor.
- `updateVendor(id, vendorData)` — Update vendor details.
- `deleteVendor(id)` — Remove a vendor record.

### Page Component (`Vendors.jsx`)
- **Master Vendor Table Header**: Displays the page title "Master Vendor Table" with a description of its purpose as a centralized vendor registry.
- **Info Banner**: Highlights that the table serves as a "Single Source of Truth" across procurement, finance, and asset tracking.
- **Vendor Registration Form**: Inline form with fields for vendor name, contact person, email, phone, and address. Supports both create and edit modes.
- **Filter Bar**: Dropdown to filter by specific vendor name + free-text search across name, contact, email, and phone fields. Shows filtered count and a "Clear filters" link.
- **Vendor Table (`VendorTable.jsx`)**: Tabular display of all vendors with row index, vendor name, contact person, email, phone, and action buttons (edit/delete).

### Form Component (`VendorForm.jsx`)
- Icon-labeled fields using lucide-react icons (Truck, User, Mail, Phone, MapPin).
- Auto-populates when editing an existing vendor via `initialData` prop.
- Clears form on successful creation.
