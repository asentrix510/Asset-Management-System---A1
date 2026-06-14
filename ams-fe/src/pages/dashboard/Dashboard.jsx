import {
  FaBoxOpen,
  FaUsers,
  FaCheckCircle,
  FaWrench,
  FaUserFriends,
} from "react-icons/fa";

import {
  useEffect,
  useState,
} from "react";

import {
  getDashboardStats,
  getStatusChart,
  getCategoryChart,
  getRecentActivity,
} from "../../api/dashboardApi";

import AssetStatusChart from "../../components/dashboard/AssetStatusChart";
import AssetCategoryChart from "../../components/dashboard/AssetCategoryChart";

export default function Dashboard() {
  const [stats, setStats] =
    useState([]);

  const [statusData, setStatusData] =
    useState([]);

  const [categoryData, setCategoryData] =
    useState([]);

  const [activities, setActivities] =
    useState([]);

  useEffect(() => {
    const fetchDashboardData =
      async () => {
        try {
          const statsData =
            await getDashboardStats();

          const statusChart =
            await getStatusChart();

          const categoryChart =
            await getCategoryChart();

          const recentActivity =
            await getRecentActivity();

          setStatusData(
            statusChart.data
          );

          setCategoryData(
            categoryChart.data
          );

          setActivities(
            recentActivity.activities
          );

          setStats([
            {
              title:
                "Total Assets",
              value:
                statsData.stats
                  .totalAssets,
              icon:
                <FaBoxOpen />,
              light:
                "bg-blue-50 text-blue-600",
            },
            {
              title:
                "Assigned Assets",
              value:
                statsData.stats
                  .assignedAssets,
              icon:
                <FaUsers />,
              light:
                "bg-violet-50 text-violet-600",
            },
            {
              title:
                "Available Assets",
              value:
                statsData.stats
                  .availableAssets,
              icon:
                <FaCheckCircle />,
              light:
                "bg-emerald-50 text-emerald-600",
            },
            {
              title:
                "Under Maintenance",
              value:
                statsData.stats
                  .maintenanceAssets,
              icon:
                <FaWrench />,
              light:
                "bg-amber-50 text-amber-600",
            },
            {
              title: "Total Users",
              value: statsData.stats.totalUsers,
              icon: <FaUserFriends />,
              light: "bg-pink-50 text-pink-600",
            }
          ]);
        } catch (error) {
          console.error(
            "Dashboard error:",
            error
          );
        }
      };

    fetchDashboardData();
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-900">
          Dashboard
        </h1>

        <p className="text-slate-500 text-sm mt-1">
          Overview of your asset
          management system
        </p>
      </div>

      {/* Stats Cards */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-5 mb-8">
        {stats.map((item) => (
          <div
            key={item.title}
            className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex items-center gap-4 hover:shadow-md transition-shadow"
          >
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${item.light}`}
            >
              {item.icon}
            </div>

            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                {item.title}
              </p>

              <p className="text-3xl font-black text-slate-900 mt-0.5">
                {item.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
        <AssetStatusChart
          data={statusData}
        />

        <AssetCategoryChart
          data={categoryData}
        />
      </div>

      {/* Recent Activity */}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h3 className="text-base font-bold text-slate-800 mb-4">
          Recent Activity
        </h3>

        <div className="space-y-3">
          {activities.length >
            0 ? (
            activities.map(
              (activity) => (
                <div
                  key={
                    activity.asset_id
                  }
                  className="flex items-center justify-between py-2.5 border-b border-slate-50 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>

                    <p className="text-sm text-slate-700">
                      {
                        activity.asset_name
                      }{" "}
                      (
                      {
                        activity.status
                      }
                      )
                    </p>
                  </div>

                  <span className="text-xs text-slate-400">
                    {new Date(
                      activity.updated_at
                    ).toLocaleDateString()}
                  </span>
                </div>
              )
            )
          ) : (
            <p className="text-sm text-slate-500">
              No recent activity
              found
            </p>
          )}
        </div>
      </div>
    </div>
  );
}