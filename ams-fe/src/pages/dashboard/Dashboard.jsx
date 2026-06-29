import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  getDashboardStats,
  getStatusChart,
  getCategoryChart,
  getRecentActivity,
} from "../../api/dashboardApi";
import {
  Package,
  UserCheck,
  CheckCircle2,
  Wrench,
  Users,
  History,
  ArrowRight,
  TrendingUp
} from "lucide-react";
import AssetStatusChart from "../../components/dashboard/AssetStatusChart";
import AssetCategoryChart from "../../components/dashboard/AssetCategoryChart";

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const statsData = await getDashboardStats();
        const statusChart = await getStatusChart();
        const categoryChart = await getCategoryChart();
        const recentActivity = await getRecentActivity();

        setStatusData(statusChart.data);
        setStatusData(statusChart.data || []);
        setCategoryData(categoryChart.data || []);
        setActivities(recentActivity.activities || []);

        setStats([
          {
            title: "Total Assets",
            value: statsData.stats.totalAssets,
            icon: <Package className="w-5 h-5 text-blue-600" />,
            light: "bg-blue-50/60 ring-4 ring-blue-50/25",
          },
          {
            title: "Assigned Assets",
            value: statsData.stats.assignedAssets,
            icon: <UserCheck className="w-5 h-5 text-violet-600" />,
            light: "bg-violet-50/60 ring-4 ring-violet-50/25",
          },
          {
            title: "Available Assets",
            value: statsData.stats.availableAssets,
            icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
            light: "bg-emerald-50/60 ring-4 ring-emerald-50/25",
          },
          {
            title: "In Maintenance",
            value: statsData.stats.maintenanceAssets,
            icon: <Wrench className="w-5 h-5 text-amber-600" />,
            light: "bg-amber-50/60 ring-4 ring-amber-50/25",
          },
          {
            title: "Total Users",
            value: statsData.stats.totalUsers,
            icon: <Users className="w-5 h-5 text-rose-600" />,
            light: "bg-rose-50/60 ring-4 ring-rose-50/25",
          }
        ]);
      } catch (error) {
        console.error("Dashboard error:", error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div>
      {/* Welcome Admin Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 rounded-3xl p-8 text-white shadow-lg shadow-indigo-500/10 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        <div className="absolute left-1/3 bottom-0 w-60 h-60 bg-indigo-500/10 rounded-full blur-2xl -ml-20 -mb-20 pointer-events-none"></div>

        <div className="relative z-10">
          <h1 className="text-3xl font-black tracking-tight">System Console</h1>
          <p className="text-indigo-100/90 text-sm mt-1.5 font-medium max-w-lg">
            Welcome back, <span className="font-bold">{user?.name?.split(" ")[0]}</span>. Analyze active devices, system health metrics, and employee requests.
          </p>
        </div>

        <div className="relative z-10 flex gap-2.5 shrink-0 bg-white/10 backdrop-blur-md border border-white/10 px-4 py-3 rounded-2xl">
          <TrendingUp className="w-5 h-5 text-indigo-200 mt-0.5" />
          <div>
            <p className="text-[10px] text-indigo-200 font-extrabold uppercase tracking-wider">Status</p>
            <p className="text-xs font-bold mt-0.5">AMS Core Active</p>
          </div>
        </div>
      </div>

      {/* Stats Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-5 mb-8">
        {stats.map((item) => (
          <div
            key={item.title}
            className="bg-white rounded-2xl shadow-sm border border-slate-100/80 p-5 flex items-center gap-4 hover:-translate-y-1 hover:shadow-md transition-all duration-300 group"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.light} transition-transform duration-300 group-hover:scale-105`}>
              {item.icon}
            </div>

            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {item.title}
              </p>

              <p className="text-2xl font-black text-slate-900 mt-1 leading-none">
                {item.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Panels */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h3 className="text-sm font-bold text-slate-800 tracking-tight mb-4 select-none">
            Asset Status Distribution
          </h3>
          <AssetStatusChart data={statusData} />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h3 className="text-sm font-bold text-slate-800 tracking-tight mb-4 select-none">
            Asset Category Breakdown
          </h3>
          <AssetCategoryChart data={categoryData} />
        </div>
      </div>

      {/* Recent Activity Log */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <div className="flex items-center justify-between mb-5 select-none">
          <h3 className="text-sm font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <History className="w-4 h-4 text-indigo-500" />
            Recent Activity Logs
          </h3>
          <span className="text-[10px] font-extrabold bg-slate-100 border border-slate-200/60 px-2.5 py-1 rounded-full text-slate-500">
            LOG COUNTER: {activities.length}
          </span>
        </div>

        <div className="divide-y divide-slate-50">
          {activities.length > 0 ? (
            activities.map((activity, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0 group/item"
              >
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shrink-0"></span>

                  <p className="text-xs font-semibold text-slate-700 leading-normal">
                    {activity.asset_name}{" "}
                    <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded border border-slate-200/50 font-bold ml-1.5 uppercase font-sans">
                      {activity.status}
                    </span>
                  </p>
                </div>

                <span className="text-[10px] text-slate-400 font-semibold">
                  {new Date(activity.updated_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </span>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-400 text-center py-6 font-semibold">
              No recent activity records registered.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}