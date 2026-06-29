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

const STATUS_DOT = {
  Available: "bg-emerald-500",
  Assigned: "bg-blue-500",
  Maintenance: "bg-amber-500",
  Retired: "bg-slate-400",
};

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
            icon: <Package className="w-5 h-5" />,
            color: "text-blue-600",
            bg: "bg-blue-50",
          },
          {
            title: "Assigned",
            value: statsData.stats.assignedAssets,
            icon: <UserCheck className="w-5 h-5" />,
            color: "text-violet-600",
            bg: "bg-violet-50",
          },
          {
            title: "Available",
            value: statsData.stats.availableAssets,
            icon: <CheckCircle2 className="w-5 h-5" />,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
          },
          {
            title: "Maintenance",
            value: statsData.stats.maintenanceAssets,
            icon: <Wrench className="w-5 h-5" />,
            color: "text-amber-600",
            bg: "bg-amber-50",
          },
          {
            title: "Total Users",
            value: statsData.stats.totalUsers,
            icon: <Users className="w-5 h-5" />,
            color: "text-rose-600",
            bg: "bg-rose-50",
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
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl p-6 md:p-8 text-white mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Welcome back
          </h1>
          <p className="text-indigo-100 text-sm mt-1">
            Here's what's happening with your assets today.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white/15 px-4 py-2.5 rounded-xl text-sm font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          All systems operational
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
        {stats.map((item) => (
          <div
            key={item.title}
            className="bg-white rounded-xl border border-slate-200/60 p-5 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.bg} ${item.color}`}>
                {item.icon}
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900">{item.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{item.title}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-slate-200/60 p-6">
          <h3 className="text-sm font-semibold text-slate-800 mb-4">
            Asset Status
          </h3>
          <AssetStatusChart data={statusData} />
        </div>

        <div className="bg-white rounded-xl border border-slate-200/60 p-6">
          <h3 className="text-sm font-semibold text-slate-800 mb-4">
            Assets by Category
          </h3>
          <AssetCategoryChart data={categoryData} />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-slate-200/60 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
            <History className="w-4 h-4 text-slate-400" />
            Recent Activity
          </h3>
          <span className="text-xs text-slate-400 font-medium">
            {activities.length} records
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {activities.length > 0 ? (
            activities.map((activity, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
              >
                <div className="flex items-center gap-3">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${STATUS_DOT[activity.status] || "bg-slate-400"}`} />
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      {activity.asset_name}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {activity.status}
                    </p>
                  </div>
                </div>

                <span className="text-xs text-slate-400">
                  {new Date(activity.updated_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </span>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-400 text-center py-8">
              No recent activity
            </p>
          )}
        </div>
      </div>
    </div>
  );
}