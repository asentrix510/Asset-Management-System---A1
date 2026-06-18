import QRCodeGenerator from "./QRCodeGenerator";

export default function AssetDetails({
  asset,
}) {
  if (!asset) {
    return (
      <div className="bg-white p-6 rounded-xl shadow">
        Asset not found
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-6">
          Asset Information
        </h2>

        <div className="space-y-3">
          <p>
            <strong>Asset Code:</strong>{" "}
            {asset.asset_code}
          </p>

          <p>
            <strong>Asset Name:</strong>{" "}
            {asset.asset_name}
          </p>

          <p>
            <strong>Category:</strong>{" "}
            {asset.category}
          </p>

         <p>
  <strong>Status:</strong>

  <span
    className={`ml-2 px-3 py-1 rounded-full text-sm
      ${
        asset.status ===
        "Available"
          ? "bg-green-100 text-green-700"
          : ""
      }
      ${
        asset.status ===
        "Assigned"
          ? "bg-blue-100 text-blue-700"
          : ""
      }
      ${
        asset.status ===
        "Maintenance"
          ? "bg-yellow-100 text-yellow-700"
          : ""
      }
      ${
        asset.status ===
        "Retired"
          ? "bg-red-100 text-red-700"
          : ""
      }
    `}
  >
    {asset.status}
  </span>
</p>
          <p>
            <strong>Brand:</strong>{" "}
            {asset.brand}
          </p>

          <p>
            <strong>Model:</strong>{" "}
            {asset.model}
          </p>

          <p>
            <strong>Serial Number:</strong>{" "}
            {asset.serial_number}
          </p>

          <p>
            <strong>Vendor:</strong>{" "}
            {asset.vendor_name}
          </p>

          <p>
            <strong>Purchase Date:</strong>{" "}
            {asset.purchase_date}
          </p>

          <p>
            <strong>Warranty Expiry:</strong>{" "}
            {asset.warranty_expiry}
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow flex justify-center">
        <QRCodeGenerator
          assetId={asset.asset_id}
        />
      </div>
    </div>
  );
}