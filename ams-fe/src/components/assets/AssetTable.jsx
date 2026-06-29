import { Link } from "react-router-dom";
import {
  Laptop,
  Tv,
  Wifi,
  Printer,
  Smartphone,
  Package,
  Armchair,
  Eye,
  Edit2,
  Trash2
} from "lucide-react";

const STATUS_STYLES = {
  Available: "bg-emerald-50 text-emerald-700 border-emerald-100",
  Assigned: "bg-blue-50 text-blue-700 border-blue-100",
  Maintenance: "bg-amber-50 text-amber-700 border-amber-100",
  Retired: "bg-rose-50 text-rose-700 border-rose-100",
};

const getCategoryIcon = (category) => {
  const cat = category?.toLowerCase() || "";
  if (cat.includes("laptop")) return <Laptop className="w-4 h-4 text-blue-600" />;
  if (cat.includes("monitor")) return <Tv className="w-4 h-4 text-indigo-600" />;
  if (cat.includes("router")) return <Wifi className="w-4 h-4 text-cyan-600" />;
  if (cat.includes("printer")) return <Printer className="w-4 h-4 text-amber-600" />;
  if (cat.includes("mobile") || cat.includes("phone") || cat.includes("tab")) {
    return <Smartphone className="w-4 h-4 text-emerald-600" />;
  }
  if (cat.includes("furniture") || cat.includes("chair") || cat.includes("desk")) {
    return <Armchair className="w-4 h-4 text-rose-600" />;
  }
  return <Package className="w-4 h-4 text-slate-500" />;
};

function formatDate(d) {
  if (!d) return "—";
  const date = new Date(d);
  if (isNaN(date.getTime())) return d;
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

function fmtCost(cost) {
  if (cost == null || cost === "") return "—";
  return `₹${Number(cost).toLocaleString("en-IN")}`;
}

export default function AssetTable({ assets, onDelete, onEdit }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100/80 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[960px] text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/70 text-2xs font-extrabold text-slate-400 uppercase tracking-wider select-none">
              <th className="px-5 py-4 w-28">Asset Code</th>
              <th className="px-5 py-4">Hardware Info</th>
              <th className="px-5 py-4">Category</th>
              <th className="px-5 py-4">Vendor</th>
              <th className="px-5 py-4">Purchase Date</th>
              <th className="px-5 py-4">Cost</th>
              <th className="px-5 py-4">Warranty</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-50 text-xs">
            {assets.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  className="px-6 py-12 text-center text-slate-400 font-semibold"
                >
                  No assets found in database.
                </td>
              </tr>
            ) : (
              assets.map((asset) => (
                <tr
                  key={asset.asset_id}
                  className="hover:bg-slate-50/30 transition-colors"
                >
                  <td className="px-5 py-4 font-mono font-bold text-slate-500">
                    {asset.asset_code}
                  </td>

                  <td className="px-5 py-4">
                    <p className="font-bold text-slate-800">{asset.asset_name}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{asset.brand} · {asset.model || "N/A"}</p>
                  </td>

                  <td className="px-5 py-4 font-semibold text-slate-600">
                    <span className="inline-flex items-center gap-1.5">
                      {getCategoryIcon(asset.category)}
                      {asset.category}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-slate-500 font-medium truncate max-w-[120px]">
                    {asset.vendor_name || "—"}
                  </td>

                  <td className="px-5 py-4 text-slate-500 font-semibold">
                    {formatDate(asset.purchase_date)}
                  </td>

                  <td className="px-5 py-4 font-bold text-slate-700">
                    {fmtCost(asset.purchase_cost)}
                  </td>

                  <td className="px-5 py-4 text-slate-500 font-semibold">
                    {formatDate(asset.warranty_expiry)}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                        STATUS_STYLES[asset.status] ||
                        "bg-slate-50 text-slate-600 border-slate-100"
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        asset.status === "Available" ? "bg-emerald-500" :
                        asset.status === "Assigned" ? "bg-blue-500" :
                        asset.status === "Maintenance" ? "bg-amber-500 animate-pulse" : "bg-rose-500"
                      }`}></span>
                      {asset.status}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <Link
                        to={`/assets/${asset.asset_id}`}
                        className="p-1.5 bg-slate-50 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg border border-slate-100 hover:border-blue-100 transition-colors cursor-pointer"
                        title="View Asset Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>

                      <button
                        onClick={() => onEdit(asset)}
                        className="p-1.5 bg-slate-50 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg border border-slate-100 hover:border-amber-100 transition-colors cursor-pointer"
                        title="Edit Asset"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onDelete(asset.asset_id)}
                        className="p-1.5 bg-slate-50 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-slate-100 hover:border-rose-100 transition-colors cursor-pointer"
                        title="Delete Asset"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}