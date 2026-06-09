import {
  FaBoxOpen,
  FaUsers,
  FaCheckCircle,
  FaWrench,
} from "react-icons/fa";

const stats = [
  {
    title: "Total Assets",
    value: 124,
    icon: <FaBoxOpen />,
    color: "bg-blue-500",
    light: "bg-blue-50 text-blue-600",
  },
  {
    title: "Assigned Assets",
    value: 83,
    icon: <FaUsers />,
    color: "bg-violet-500",
    light: "bg-violet-50 text-violet-600",
  },
  {
    title: "Available Assets",
    value: 32,
    icon: <FaCheckCircle />,
    color: "bg-emerald-500",
    light: "bg-emerald-50 text-emerald-600",
  },
  {
    title: "Under Maintenance",
    value: 9,
    icon: <FaWrench />,
    color: "bg-amber-500",
    light: "bg-amber-50 text-amber-600",
  },
];

export default function Dashboard() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-900">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Overview of your asset management system</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {stats.map((item) => (
          <div
            key={item.title}
            className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex items-center gap-4 hover:shadow-md transition-shadow"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${item.light}`}>
              {item.icon}
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                {item.title}
              </p>
              <p className="text-3xl font-black text-slate-900 mt-0.5">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Placeholder recent activity */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h3 className="text-base font-bold text-slate-800 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {[
            { text: "Asset #A-045 assigned to John Doe", time: "2 min ago" },
            { text: "Maintenance ticket #M-012 created", time: "1 hr ago" },
            { text: "New user Sarah added to system", time: "3 hr ago" },
            { text: "Vendor Acme Corp updated contract", time: "Yesterday" },
          ].map((a, i) => (
            <div key={i} className="flex items-center justify-between py-2.5 border-b border-slate-50 last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                <p className="text-sm text-slate-700">{a.text}</p>
              </div>
              <span className="text-xs text-slate-400 flex-shrink-0 ml-4">{a.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}