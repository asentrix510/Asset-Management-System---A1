import QRCodeGenerator from "./QRCodeGenerator";

const STATUS_COLORS = {
  Available: "bg-emerald-100 text-emerald-700",
  Assigned: "bg-blue-100 text-blue-700",
  Maintenance: "bg-amber-100 text-amber-700",
  Retired: "bg-red-100 text-red-700",
};

function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between py-2.5 border-b border-slate-50 last:border-0">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-sm font-medium text-slate-800">{value || "—"}</span>
    </div>
  );
}

export default function AssetDetails({ asset, depreciation }) {
  if (!asset) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-slate-400">
        Asset not found
      </div>
    );
  }

  const statusColor = STATUS_COLORS[asset.status] || "bg-slate-100 text-slate-600";

  const deprPercent = depreciation?.depreciation_percent ?? 0;
  const barColor =
    deprPercent >= 80 ? "bg-red-500" :
    deprPercent >= 50 ? "bg-amber-500" :
    "bg-emerald-500";

  return (
    <div className="grid lg:grid-cols-3 gap-6">

      {/* Asset Info */}
      <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-base font-bold text-slate-800 mb-4">Asset Information</h2>
        <div>
          <InfoRow label="Asset Code" value={asset.asset_code} />
          <InfoRow label="Asset Name" value={asset.asset_name} />
          <InfoRow label="Category" value={asset.category} />
          <InfoRow label="Brand" value={asset.brand} />
          <InfoRow label="Model" value={asset.model} />
          <InfoRow label="Serial No." value={asset.serial_number} />
          <InfoRow label="Vendor" value={asset.vendor_name} />
          <InfoRow label="Purchase Date" value={asset.purchase_date ? new Date(asset.purchase_date).toLocaleDateString() : null} />
          <InfoRow label="Warranty Expiry" value={asset.warranty_expiry ? new Date(asset.warranty_expiry).toLocaleDateString() : null} />
          <div className="flex justify-between py-2.5">
            <span className="text-sm text-slate-500">Status</span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusColor}`}>
              {asset.status}
            </span>
          </div>
        </div>
      </div>

      {/* Depreciation Card */}
      <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-base font-bold text-slate-800 mb-4">Depreciation</h2>

        {!depreciation ? (
          <p className="text-sm text-slate-400">No depreciation data available.</p>
        ) : (
          <div className="space-y-5">
            {/* Current value highlight */}
            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <p className="text-xs text-blue-500 font-semibold uppercase tracking-wide mb-1">
                Current Value
              </p>
              <p className="text-3xl font-black text-blue-700">
                ₹{depreciation.current_value.toLocaleString()}
              </p>
              {depreciation.is_fully_depreciated && (
                <span className="mt-1 inline-block text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-semibold">
                  Fully Depreciated
                </span>
              )}
            </div>

            {/* Depreciation bar */}
            <div>
              <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                <span>Depreciated</span>
                <span className="font-semibold">{deprPercent}%</span>
              </div>
              <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${barColor}`}
                  style={{ width: `${Math.min(deprPercent, 100)}%` }}
                />
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-xs text-slate-500">Purchase Cost</p>
                <p className="text-sm font-bold text-slate-800 mt-0.5">
                  ₹{depreciation.purchase_cost.toLocaleString()}
                </p>
              </div>
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-xs text-slate-500">Depreciated By</p>
                <p className="text-sm font-bold text-slate-800 mt-0.5">
                  ₹{depreciation.depreciation_amount.toLocaleString()}
                </p>
              </div>
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-xs text-slate-500">Years in Use</p>
                <p className="text-sm font-bold text-slate-800 mt-0.5">
                  {depreciation.years_elapsed} yrs
                </p>
              </div>
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-xs text-slate-500">Useful Life</p>
                <p className="text-sm font-bold text-slate-800 mt-0.5">
                  {depreciation.useful_life_years} yrs
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* QR Code */}
      <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center">
        <h2 className="text-base font-bold text-slate-800 mb-4 self-start">QR Code</h2>
        <QRCodeGenerator assetId={asset.asset_id} />
      </div>

    </div>
  );
}