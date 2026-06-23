import { useEffect, useState } from "react";
import { getMyMaintenance } from "../../api/portalApi";

const STATUS_COLORS = {
  Pending: "bg-yellow-50 text-yellow-700",
  "In Progress": "bg-blue-50 text-blue-700",
  Completed: "bg-emerald-50 text-emerald-700",
};

function fmt(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export default function MyMaintenance() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    getMyMaintenance()
      .then((r) => setRecords(r.data.records || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === "All"
    ? records
    : records.filter((r) => r.status === filter);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-900">My Maintenance</h1>
        <p className="text-slate-500 text-sm mt-1">
          Maintenance history for assets that have been assigned to you.
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {["All", "Pending", "In Progress", "Completed"].map((f) => (
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
          <p className="text-4xl mb-3">🔧</p>
          <p className="text-slate-700 font-semibold">No maintenance records</p>
          <p className="text-slate-400 text-sm mt-1">No records found for the selected filter.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="px-5 py-3">#</th>
                <th className="px-5 py-3">Asset</th>
                <th className="px-5 py-3">Issue</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Cost</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((r, i) => (
                <tr key={r.maintenance_id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-4 text-xs text-slate-400">{i + 1}</td>
                  <td className="px-5 py-4">
                    <p className="text-sm font-semibold text-slate-800">{r.asset_name}</p>
                    <p className="text-xs text-slate-400 font-mono">{r.asset_code}</p>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-600 max-w-[200px]">{r.issue_description}</td>
                  <td className="px-5 py-4 text-sm text-slate-600">{fmt(r.maintenance_date)}</td>
                  <td className="px-5 py-4 text-sm text-slate-600">
                    {r.cost ? `₹${Number(r.cost).toLocaleString("en-IN")}` : "—"}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[r.status] || "bg-slate-100 text-slate-600"}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-500">{r.remarks || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
