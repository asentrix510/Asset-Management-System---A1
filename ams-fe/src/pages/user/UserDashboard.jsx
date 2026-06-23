import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getMyAssets, getMyMaintenance } from "../../api/portalApi";
import { Link } from "react-router-dom";

function StatCard({ icon, label, value, color, to }) {
  const inner = (
    <div className={`bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex items-center gap-5 hover:shadow-md transition-shadow`}>
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-black text-slate-900">{value}</p>
        <p className="text-sm text-slate-500 mt-0.5">{label}</p>
      </div>
    </div>
  );
  return to ? <Link to={to}>{inner}</Link> : inner;
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
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-900">
          Welcome, {user?.name?.split(" ")[0]} 👋
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Here's a summary of your assigned assets and activity.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-slate-400 text-sm">Loading…</div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <StatCard icon="📦" label="Assets Assigned to Me" value={activeAssets.length} color="bg-blue-50" to="/user/my-assets" />
            <StatCard icon="🔧" label="Maintenance Records" value={maintenance.length} color="bg-amber-50" to="/user/my-maintenance" />
            <StatCard icon="⚠️" label="Pending Maintenance" value={pendingMaint.length} color="bg-red-50" />
          </div>

          {/* Recent assets */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-800">Currently Assigned Assets</h2>
              <Link to="/user/my-assets" className="text-xs text-blue-600 font-semibold hover:underline">View all</Link>
            </div>
            {activeAssets.length === 0 ? (
              <p className="text-slate-400 text-sm text-center py-6">No assets currently assigned to you.</p>
            ) : (
              <div className="space-y-3">
                {activeAssets.slice(0, 5).map((a) => (
                  <div key={a.assignment_id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{a.asset_name}</p>
                      <p className="text-xs text-slate-400">{a.asset_code} · {a.category}</p>
                    </div>
                    <span className="text-xs bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full font-semibold">{a.asset_status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Profile info */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-800">My Profile</h2>
              <Link to="/user/profile" className="text-xs text-blue-600 font-semibold hover:underline">Edit</Link>
            </div>
            <div className="grid sm:grid-cols-2 gap-y-3 text-sm">
              {[
                ["Name", user?.name],
                ["Email", user?.email],
                ["Department", user?.department || "—"],
                ["Designation", user?.designation || "—"],
              ].map(([k, v]) => (
                <div key={k} className="flex gap-2">
                  <span className="text-slate-400 w-28 shrink-0">{k}</span>
                  <span className="font-semibold text-slate-800">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
