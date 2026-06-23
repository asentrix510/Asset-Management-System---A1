import { Link } from "react-router-dom";

const STATUS_STYLES = {
  Available: "bg-green-100 text-green-700",
  Assigned: "bg-blue-100 text-blue-700",
  Maintenance: "bg-yellow-100 text-yellow-700",
  Retired: "bg-red-100 text-red-700",
};

function fmt(date) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString();
}

function fmtCost(cost) {
  if (cost == null || cost === "") return "—";
  return `₹${Number(cost).toLocaleString()}`;
}

export default function AssetTable({ assets, onDelete, onEdit }) {
  return (
    <div className="bg-white rounded-xl shadow overflow-x-auto">
      <table className="w-full min-w-[900px]">
        <thead>
          <tr className="border-b bg-slate-50 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <th className="p-3">Code</th>
            <th className="p-3">Name</th>
            <th className="p-3">Category</th>
            <th className="p-3">Vendor</th>
            <th className="p-3">Purchase Date</th>
            <th className="p-3">Cost</th>
            <th className="p-3">Warranty Expiry</th>
            <th className="p-3">Status</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>

        <tbody>
          {assets.length === 0 ? (
            <tr>
              <td
                colSpan={9}
                className="p-6 text-center text-slate-400 text-sm"
              >
                No assets found.
              </td>
            </tr>
          ) : (
            assets.map((asset) => (
              <tr
                key={asset.asset_id}
                className="border-b last:border-0 hover:bg-slate-50 transition-colors"
              >
                <td className="p-3 text-sm font-mono text-slate-700">
                  {asset.asset_code}
                </td>

                <td className="p-3 text-sm font-medium text-slate-800">
                  {asset.asset_name}
                </td>

                <td className="p-3 text-sm text-slate-600">
                  {asset.category}
                </td>

                <td className="p-3 text-sm text-slate-600">
                  {asset.vendor_name || "—"}
                </td>

                <td className="p-3 text-sm text-slate-600">
                  {fmt(asset.purchase_date)}
                </td>

                <td className="p-3 text-sm text-slate-600">
                  {fmtCost(asset.purchase_cost)}
                </td>

                <td className="p-3 text-sm text-slate-600">
                  {fmt(asset.warranty_expiry)}
                </td>

                <td className="p-3">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      STATUS_STYLES[asset.status] ||
                      "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {asset.status}
                  </span>
                </td>

                <td className="p-3 flex gap-2 flex-wrap">
                  <Link
                    to={`/assets/${asset.asset_id}`}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                  >
                    View
                  </Link>

                  <button
                    onClick={() => onEdit(asset)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => onDelete(asset.asset_id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}