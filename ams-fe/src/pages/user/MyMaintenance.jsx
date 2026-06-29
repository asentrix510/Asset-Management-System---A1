import { useEffect, useState } from "react";
import { getMyMaintenance } from "../../api/portalApi";
import {
  Laptop,
  Tv,
  Wifi,
  Printer,
  Smartphone,
  Package,
  Wrench,
  Armchair
} from "lucide-react";

// Resolves a category to a specific lucide icon
const getCategoryIcon = (category) => {
  const cat = category?.toLowerCase() || "";
  if (cat.includes("laptop")) return <Laptop className="w-4 h-4 text-blue-500" />;
  if (cat.includes("monitor")) return <Tv className="w-4 h-4 text-indigo-500" />;
  if (cat.includes("router")) return <Wifi className="w-4 h-4 text-cyan-500" />;
  if (cat.includes("printer")) return <Printer className="w-4 h-4 text-amber-500" />;
  if (cat.includes("mobile") || cat.includes("phone") || cat.includes("tab")) {
    return <Smartphone className="w-4 h-4 text-emerald-500" />;
  }
  if (cat.includes("furniture") || cat.includes("chair") || cat.includes("desk")) {
    return <Armchair className="w-4 h-4 text-rose-500" />;
  }
  return <Package className="w-4 h-4 text-slate-500" />;
};

const getStatusBadge = (status) => {
  let color = "bg-slate-50 text-slate-600 border-slate-100";
  let dotColor = "bg-slate-400";
  if (status === "Open") {
    color = "bg-yellow-50 text-yellow-700 border-yellow-100";
    dotColor = "bg-yellow-500 animate-pulse";
  } else if (status === "In Progress") {
    color = "bg-blue-50 text-blue-700 border-blue-100";
    dotColor = "bg-blue-500 animate-pulse";
  } else if (status === "Completed") {
    color = "bg-emerald-50 text-emerald-700 border-emerald-100";
    dotColor = "bg-emerald-500";
  }
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`}></span>
      {status}
    </span>
  );
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
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">My Maintenance</h1>
        <p className="text-slate-500 text-sm mt-1">
          Review repair progress, maintenance logs, and troubleshooting operations for hardware assets currently or ever assigned to you.
        </p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        {["All", "Open", "In Progress", "Completed"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
              filter === f
                ? "bg-slate-900 text-white shadow-md shadow-slate-950/20"
                : "bg-white text-slate-500 border border-slate-200/80 hover:bg-slate-50 hover:text-slate-700"
            }`}
          >
            {f === "All" ? "All Logs" : f}
          </button>
        ))}
        <span className="ml-auto text-xs font-bold text-slate-400 bg-slate-100 border border-slate-200/60 px-3 py-1.5 rounded-xl select-none">
          {filtered.length} Record{filtered.length !== 1 ? "s" : ""} Found
        </span>
      </div>

      {/* Logs Table Area */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-100/80 shadow-sm p-20 flex items-center justify-center text-slate-400 text-sm font-semibold font-sans">
          <svg className="animate-spin w-5 h-5 mr-3 text-indigo-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Loading maintenance records...
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-16 text-center max-w-xl mx-auto">
          <p className="text-5xl mb-4 select-none">🔧</p>
          <h3 className="text-slate-800 font-extrabold text-lg">No maintenance logs found</h3>
          <p className="text-slate-400 text-sm mt-2">
            No maintenance records match your active selection criteria.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[768px] text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100 text-2xs font-extrabold text-slate-400 uppercase tracking-wider select-none">
                  <th className="px-6 py-4 w-12 text-center">#</th>
                  <th className="px-6 py-4">Asset Details</th>
                  <th className="px-6 py-4 w-2/5">Issue Description</th>
                  <th className="px-6 py-4">Reported Date</th>
                  <th className="px-6 py-4">Service Cost</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-xs">
                {filtered.map((r, i) => (
                  <tr key={r.maintenance_id} className="hover:bg-slate-50/40 transition-colors">
                    <td className="px-6 py-4 text-center font-bold text-slate-400 font-mono">{i + 1}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                          {getCategoryIcon(r.category)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-850 truncate">{r.asset_name}</p>
                          <p className="text-[10px] text-slate-400 font-mono mt-0.5">{r.asset_code}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium leading-relaxed">{r.issue_description}</td>
                    <td className="px-6 py-4 text-slate-500 font-semibold">{fmt(r.maintenance_date)}</td>
                    <td className="px-6 py-4 font-bold text-slate-700">
                      {r.cost ? `₹${Number(r.cost).toLocaleString("en-IN")}` : <span className="text-slate-350 font-normal">—</span>}
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(r.status)}</td>
                    <td className="px-6 py-4 text-slate-500 font-medium italic max-w-[200px] truncate" title={r.remarks || ""}>
                      {r.remarks || <span className="text-slate-300 not-italic">—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
