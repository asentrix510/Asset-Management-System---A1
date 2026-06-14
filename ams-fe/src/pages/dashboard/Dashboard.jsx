import {
  FaBoxOpen,
  FaUsers,
  FaCheckCircle,
  FaWrench,
} from "react-icons/fa";

import {
  useEffect,
  useState,
} from "react";

import {
  getDashboardStats,
} from "../../api/dashboardApi";

export default function Dashboard() {
  const [stats, setStats] =
    useState([]);

  useEffect(() => {
    const fetchStats =
      async () => {
        try {
          const data =
            await getDashboardStats();

          setStats([
            {
              title:
                "Total Assets",
              value:
                data.stats
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
                data.stats
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
                data.stats
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
                data.stats
                  .maintenanceAssets,
              icon:
                <FaWrench />,
              light:
                "bg-amber-50 text-amber-600",
            },
          ]);
        } catch (error) {
          console.error(
            "Dashboard stats error:",
            error
          );
        }
      };

    fetchStats();
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

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
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

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h3 className="text-base font-bold text-slate-800 mb-4">
          Recent Activity
        </h3>

        <div className="space-y-3">
          {[
            {
              text:
                "Asset #A-045 assigned to John Doe",
              time:
                "2 min ago",
            },
            {
              text:
                "Maintenance ticket #M-012 created",
              time:
                "1 hr ago",
            },
            {
              text:
                "New user Sarah added to system",
              time:
                "3 hr ago",
            },
            {
              text:
                "Vendor Acme Corp updated contract",
              time:
                "Yesterday",
            },
          ].map((a, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-2.5 border-b border-slate-50 last:border-0"
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>

                <p className="text-sm text-slate-700">
                  {a.text}
                </p>
              </div>

              <span className="text-xs text-slate-400 flex-shrink-0 ml-4">
                {a.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}