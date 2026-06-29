import { useEffect, useState } from "react";
import { getMyAssets } from "../../api/portalApi";
import {
  Laptop,
  Tv,
  Wifi,
  Printer,
  Smartphone,
  Package,
  Calendar,
  Tag,
  Cpu,
  Layers,
  Award,
  Truck,
  Info,
  ShieldCheck,
  ShieldAlert,
  FileText,
  Armchair
} from "lucide-react";

const STATUS_COLORS = {
  Available: "bg-emerald-50 text-emerald-700 border-emerald-100",
  Assigned: "bg-blue-50 text-blue-700 border-blue-100",
  Maintenance: "bg-amber-50 text-amber-700 border-amber-100",
  Retired: "bg-rose-50 text-rose-700 border-rose-100",
};

// Resolves a category to a specific lucide icon
const getCategoryIcon = (category) => {
  const cat = category?.toLowerCase() || "";
  if (cat.includes("laptop")) return <Laptop className="w-5 h-5 text-blue-600" />;
  if (cat.includes("monitor")) return <Tv className="w-5 h-5 text-indigo-600" />;
  if (cat.includes("router")) return <Wifi className="w-5 h-5 text-cyan-600" />;
  if (cat.includes("printer")) return <Printer className="w-5 h-5 text-amber-600" />;
  if (cat.includes("mobile") || cat.includes("phone") || cat.includes("tab")) {
    return <Smartphone className="w-5 h-5 text-emerald-600" />;
  }
  if (cat.includes("furniture") || cat.includes("chair") || cat.includes("desk")) {
    return <Armchair className="w-5 h-5 text-rose-600" />;
  }
  return <Package className="w-5 h-5 text-slate-600" />;
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
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">My Assets</h1>
          <p className="text-slate-500 text-sm mt-1">
            Browse and view details for all computing hardware and office assets currently or previously assigned to you.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        {["Active", "Returned", "All"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
              filter === f
                ? "bg-slate-900 text-white shadow-md shadow-slate-950/20"
                : "bg-white text-slate-500 border border-slate-200/80 hover:bg-slate-50 hover:text-slate-700"
            }`}
          >
            {f === "Active" ? "Active Assignments" : f === "Returned" ? "Returned History" : "All Records"}
          </button>
        ))}
        <span className="ml-auto text-xs font-bold text-slate-400 bg-slate-100 border border-slate-200/60 px-3 py-1.5 rounded-xl select-none">
          {filtered.length} Asset{filtered.length !== 1 ? "s" : ""} Found
        </span>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-100/80 shadow-sm p-20 flex items-center justify-center text-slate-400 text-sm font-semibold">
          <svg className="animate-spin w-5 h-5 mr-3 text-indigo-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Loading asset details...
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-16 text-center max-w-xl mx-auto">
          <p className="text-5xl mb-4 select-none">📦</p>
          <h3 className="text-slate-800 font-extrabold text-lg">No assets found</h3>
          <p className="text-slate-400 text-sm mt-2">
            You currently have no {filter === "Active" ? "active" : filter === "Returned" ? "returned" : "registered"} asset assignments. Contact your administrator if this is an error.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filtered.map((a) => {
            const isWarrantyExpired = a.warranty_expiry && new Date(a.warranty_expiry) < new Date();
            return (
              <div
                key={a.assignment_id}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
              >
                {/* Card Header Banner */}
                <div className="px-6 py-5 bg-slate-50/50 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white border border-slate-200/80 flex items-center justify-center shadow-sm shrink-0">
                      {getCategoryIcon(a.category)}
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-slate-800 tracking-tight leading-tight">{a.asset_name}</h3>
                      <p className="text-[11px] text-slate-400 font-mono mt-1 font-semibold tracking-wide">{a.asset_code}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap shrink-0">
                    <span className={`px-3 py-1 rounded-full text-2xs font-extrabold border ${STATUS_COLORS[a.asset_status] || "bg-slate-50 text-slate-600 border-slate-100"}`}>
                      STATUS: {a.asset_status?.toUpperCase()}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-2xs font-extrabold border ${a.assignment_status === "Returned" ? "bg-slate-100 text-slate-500 border-slate-200" : "bg-blue-50 text-blue-700 border-blue-200"}`}>
                      {a.assignment_status === "Returned" ? "RETURNED" : "ACTIVE ASSIGNMENT"}
                    </span>
                  </div>
                </div>

                {/* Card Spec Details */}
                <div className="p-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { icon: <Tag className="w-3.5 h-3.5" />, label: "Category", value: a.category },
                      { icon: <Cpu className="w-3.5 h-3.5" />, label: "Brand", value: a.brand || "—" },
                      { icon: <Layers className="w-3.5 h-3.5" />, label: "Model", value: a.model || "—" },
                      { icon: <Award className="w-3.5 h-3.5" />, label: "Serial No.", value: a.serial_number ? <span className="font-mono text-xs">{a.serial_number}</span> : "—" },
                      { icon: <Truck className="w-3.5 h-3.5" />, label: "Vendor", value: a.vendor_name || "—" },
                      { icon: <Calendar className="w-3.5 h-3.5" />, label: "Purchase Date", value: fmt(a.purchase_date) },
                      { icon: <span className="text-xs font-bold leading-none select-none">₹</span>, label: "Cost", value: fmtCost(a.purchase_cost) },
                      {
                        icon: isWarrantyExpired ? <ShieldAlert className="w-3.5 h-3.5 text-rose-500" /> : <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />,
                        label: "Warranty Expiry",
                        value: (
                          <span className={`font-semibold ${isWarrantyExpired ? "text-rose-600" : "text-slate-800"}`}>
                            {fmt(a.warranty_expiry)} {isWarrantyExpired && <span className="text-[10px] bg-rose-50 border border-rose-100 px-1.5 py-0.5 rounded-full font-bold ml-1">EXPIRED</span>}
                          </span>
                        )
                      },
                      { icon: <Calendar className="w-3.5 h-3.5" />, label: "Assigned On", value: fmt(a.assigned_date) },
                      a.return_date ? { icon: <Calendar className="w-3.5 h-3.5 text-rose-500" />, label: "Returned On", value: fmt(a.return_date) } : null,
                    ].filter(Boolean).map((spec) => (
                      <div key={spec.label} className="bg-slate-50/50 border border-slate-100/50 rounded-xl p-3 flex items-start gap-2.5">
                        <div className="mt-0.5 bg-white border border-slate-100 w-6.5 h-6.5 rounded-lg flex items-center justify-center shrink-0 text-slate-400 shadow-sm">
                          {spec.icon}
                        </div>
                        <div className="min-w-0">
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider leading-none">{spec.label}</p>
                          <p className="text-xs font-bold text-slate-700 mt-1 truncate">{spec.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Device Notes */}
                  {a.description && (
                    <div className="mt-5 bg-slate-50/80 border border-slate-100/80 rounded-xl p-4 flex items-start gap-3">
                      <div className="bg-indigo-50 border border-indigo-100/50 p-1.5 rounded-lg text-indigo-500 shrink-0">
                        <Info className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Administrator Notes / Specifications</p>
                        <p className="text-xs text-slate-600 font-medium mt-1 leading-relaxed">{a.description}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
