import { useEffect, useState } from "react";
import { getMyAssets } from "../../api/portalApi";

const STATUS_COLORS = {
  Available: "bg-emerald-50 text-emerald-700",
  Assigned: "bg-blue-50 text-blue-700",
  Maintenance: "bg-amber-50 text-amber-700",
  Retired: "bg-red-50 text-red-700",
};

function fmt(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}
function fmtCost(c) {
  if (c == null || c === "") return "—";
  return `₹${Number(c).toLocaleString("en-IN")}`;
}

export default function MyAssets() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("Active"); // "All" | "Active" | "Returned"

  useEffect(() => {
    getMyAssets()
      .then((r) => setAssignments(r.data.assignments || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = assignments.filter((a) => {
    if (filter === "Active") return a.assignment_status !== "Returned";
    if (filter === "Returned") return a.assignment_status === "Returned";
    return true;
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-900">My Assets</h1>
        <p className="text-slate-500 text-sm mt-1">Assets assigned to you by the administrator.</p>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-5">
        {["Active", "Returned", "All"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              filter === f
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                : "bg-white text-slate-500 border border-slate-200 hover:border-blue-300"
            }`}
          >
            {f}
          </button>
        ))}
        <span className="ml-auto self-center text-xs text-slate-400">
          {filtered.length} record{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl p-12 text-center text-slate-400 text-sm">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center">
          <p className="text-4xl mb-3">📦</p>
          <p className="text-slate-700 font-semibold">No assets found</p>
          <p className="text-slate-400 text-sm mt-1">No {filter.toLowerCase()} assignments for you.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((a) => (
            <div key={a.assignment_id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <p className="text-base font-bold text-slate-900">{a.asset_name}</p>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">{a.asset_code}</p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[a.asset_status] || "bg-slate-100 text-slate-600"}`}>
                    {a.asset_status}
                  </span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${a.assignment_status === "Returned" ? "bg-slate-100 text-slate-500" : "bg-blue-50 text-blue-700"}`}>
                    {a.assignment_status === "Returned" ? "Returned" : "Active Assignment"}
                  </span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {[
                  ["Category", a.category],
                  ["Brand", a.brand || "—"],
                  ["Model", a.model || "—"],
                  ["Serial No.", a.serial_number || "—"],
                  ["Vendor", a.vendor_name || "—"],
                  ["Purchase Date", fmt(a.purchase_date)],
                  ["Purchase Cost", fmtCost(a.purchase_cost)],
                  ["Warranty Expiry", fmt(a.warranty_expiry)],
                  ["Assigned On", fmt(a.assigned_date)],
                  a.return_date ? ["Returned On", fmt(a.return_date)] : null,
                ].filter(Boolean).map(([label, value]) => (
                  <div key={label} className="bg-slate-50 rounded-xl p-3">
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{label}</p>
                    <p className="text-sm font-semibold text-slate-800 mt-0.5">{value}</p>
                  </div>
                ))}
              </div>

              {a.description && (
                <div className="mt-3 bg-slate-50 rounded-xl p-3">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1">Notes</p>
                  <p className="text-sm text-slate-600">{a.description}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
