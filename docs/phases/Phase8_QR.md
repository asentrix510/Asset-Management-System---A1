# Phase 8: QR Code Generation

This phase adds offline-capable QR code generation for asset identification. Each asset can generate a QR code that encodes all key asset details as plain text. When scanned by any phone camera, the asset information is displayed directly — no URL, website, or internet connection is required.

## 1. Implementation Approach

Unlike URL-based QR codes that require a running server, AMS uses a **plain-text payload** approach:
- The QR code contains a formatted text block with all asset fields.
- Scanning with any smartphone camera displays the data as readable text.
- Works 100% offline — no internet, no server dependency.

---

## 2. Frontend Component

### QR Code Generator (`QRCodeGenerator.jsx`)
Uses the `qrcode.react` library (`QRCodeCanvas` component) to render QR codes client-side.

#### Plain-Text Payload Format
The `buildPlainTextPayload(asset)` function constructs the QR data:
```
=== ASSET CARD ===
Org    : Asset Management System
 
Code   : AST-001
Name   : ThinkPad T14
Cat.   : Laptops
Status : Available
Brand  : Lenovo
Model  : Gen 4
S/N    : SN87654321
Vendor : Lenovo Outlet
Purch. : 15/03/2026
Cost   : Rs. 1,200
Warr.  : 15/03/2029

=================
```

- The organisation name is dynamically read from `localStorage` settings (`ams_settings.org_name`).
- Optional fields (brand, model, serial number, vendor, cost, dates) are included only when present.
- Dates are formatted in `DD/MM/YYYY` locale format (en-IN).
- Costs are formatted as `Rs. X,XX,XXX` using Indian number formatting.

#### Component Features
- **QR Canvas**: Renders a 200x200 pixel QR code with medium error correction level (`level="M"`).
- **Asset Info Label**: Displays `{asset_code} — {asset_name}` below the QR code.
- **Download Button**: Exports the QR code as a PNG image file named `asset-{asset_code}.png`.
- **Offline Notice**: Informs users that scanning works without internet.

### Integration Points
- The QR code generator is embedded within the **Asset Details Page** (`AssetDetailsPage.jsx`), accessible from the asset table.
- Each asset row can navigate to its detail view where the QR code is available for download.

---

## 3. Dependencies
- **`qrcode.react`** (v4.2.0): React component for rendering QR codes to canvas elements.
- No backend changes required — QR generation is entirely client-side.
