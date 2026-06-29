import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getMyAssets, getMyMaintenance } from "../../api/portalApi";
import { Link } from "react-router-dom";
import {
  Laptop,
  Tv,
  Wifi,
  Printer,
  Smartphone,
  Package,
  Wrench,
  AlertTriangle,
  Mail,
  User,
  Shield,
  ArrowRight,
  Monitor,
  Activity,
  Armchair,
  Briefcase
} from "lucide-react";

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

function StatCard({ icon, label, value, colorClass, ringColorClass, to }) {
  const inner = (
    <div className="bg-white rounded-2xl border border-slate-100/80 shadow-sm p-6 flex items-center gap-5 hover:-translate-y-1 hover:shadow-md transition-all duration-300 group">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl ${colorClass} ${ringColorClass} transition-transform duration-300 group-hover:scale-105`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-black text-slate-900 leading-none">{value}</p>
        <p className="text-xs font-semibold text-slate-400 mt-1.5 uppercase tracking-wide">{label}</p>
      </div>
      {to && (
        <ArrowRight className="w-4 h-4 text-slate-300 ml-auto transition-transform duration-300 group-hover:translate-x-1 group-hover:text-slate-400" />
      )}
    </div>
  );
  return to ? <Link to={to} className="block">{inner}</Link> : inner;
}

export default function UserDashboard() {
  const { user } = useAuth();
  const [assets, setAssets] = useState([]);
  const [maintenance, setMaintenance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getMyAssets(), getMyMaintenance()])
      .then(([a, m]) => {
        setAssets(a.data.assignments || []);
        setMaintenance(m.data.records || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const activeAssets = assets.filter((a) => a.assignment_status !== "Returned");
  const pendingMaint = maintenance.filter((m) => m.status !== "Completed");

  return (
    <div>
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 rounded-3xl p-8 text-white shadow-lg shadow-indigo-500/10 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        <div className="absolute left-1/3 bottom-0 w-60 h-60 bg-indigo-500/10 rounded-full blur-2xl -ml-20 -mb-20 pointer-events-none"></div>
        
        <div className="relative z-10">
          <h1 className="text-3xl font-black tracking-tight">Welcome back, {user?.name?.split(" ")[0]}! 👋</h1>
          <p className="text-indigo-100/90 text-sm mt-1.5 font-medium max-w-lg">
            Here is a quick overview of your active devices, hardware assignments, and pending maintenance reports.
          </p>
        </div>
        
        <div className="relative z-10 flex gap-3 shrink-0">
          <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl px-5 py-3 text-center min-w-[90px]">
            <p className="text-[10px] text-indigo-200 font-extrabold uppercase tracking-widest">Devices</p>
            <p className="text-xl font-black mt-0.5">{activeAssets.length}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl px-5 py-3 text-center min-w-[90px]">
            <p className="text-[10px] text-indigo-200 font-extrabold uppercase tracking-widest">Pending</p>
            <p className="text-xl font-black mt-0.5">{pendingMaint.length}</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-100/80 shadow-sm p-20 flex items-center justify-center text-slate-400 text-sm font-semibold">
          <svg className="animate-spin w-5 h-5 mr-3 text-indigo-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Loading dashboard data...
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
            <StatCard
              icon={<Package className="w-6 h-6 text-blue-600" />}
              label="Devices Assigned"
              value={activeAssets.length}
              colorClass="bg-blue-50/60"
              ringColorClass="ring-4 ring-blue-50/20"
              to="/user/my-assets"
            />
            <StatCard
              icon={<Wrench className="w-6 h-6 text-indigo-600" />}
              label="Maintenance Logs"
              value={maintenance.length}
              colorClass="bg-indigo-50/60"
              ringColorClass="ring-4 ring-indigo-50/20"
              to="/user/my-maintenance"
            />
            <StatCard
              icon={<AlertTriangle className="w-6 h-6 text-rose-600" />}
              label="Open Issues"
              value={pendingMaint.length}
              colorClass="bg-rose-50/60"
              ringColorClass="ring-4 ring-rose-50/20"
            />
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left/Middle: Recent active assets list */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-base font-bold text-slate-800 tracking-tight">Active Hardware</h2>
                  <Link
                    to="/user/my-assets"
                    className="text-xs text-indigo-600 hover:text-indigo-700 font-bold flex items-center gap-1 group/link"
                  >
                    View all
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/link:translate-x-0.5" />
                  </Link>
                </div>
                {activeAssets.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-3xl mb-2">📦</p>
                    <p className="text-slate-500 text-sm font-semibold">No assets currently assigned.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-50">
                    {activeAssets.slice(0, 4).map((a) => (
                      <div key={a.assignment_id} className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0 group/item">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center transition-transform duration-300 group-hover/item:scale-105">
                            {getCategoryIcon(a.category)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-800 group-hover/item:text-indigo-600 transition-colors">{a.asset_name}</p>
                            <p className="text-xs text-slate-400 font-mono mt-0.5">{a.asset_code} · <span className="font-sans font-semibold text-slate-500">{a.category}</span></p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          <span className="text-xs bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full font-bold border border-emerald-100/40">
                            {a.asset_status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right: Quick Profile info */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-base font-bold text-slate-800 tracking-tight">Employment Info</h2>
                  <Link
                    to="/user/profile"
                    className="text-xs text-indigo-600 hover:text-indigo-700 font-bold flex items-center gap-1 group/link"
                  >
                    Details
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/link:translate-x-0.5" />
                  </Link>
                </div>
                <div className="space-y-4">
                  {[
                    { icon: <User className="w-4 h-4 text-slate-400" />, label: "Full Name", value: user?.name },
                    { icon: <Mail className="w-4 h-4 text-slate-400" />, label: "Email Address", value: user?.email },
                    { icon: <Briefcase className="w-4 h-4 text-slate-400" />, label: "Department", value: user?.department || "—" },
                    { icon: <Shield className="w-4 h-4 text-slate-400" />, label: "Designation", value: user?.designation || "—" },
                  ].map((field) => (
                    <div key={field.label} className="bg-slate-50/50 border border-slate-100 rounded-xl p-3 flex items-start gap-3">
                      <div className="mt-0.5 bg-white w-7 h-7 rounded-lg border border-slate-100 flex items-center justify-center shrink-0">
                        {field.icon}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide leading-none">{field.label}</p>
                        <p className="text-xs font-bold text-slate-700 mt-1 truncate">{field.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
