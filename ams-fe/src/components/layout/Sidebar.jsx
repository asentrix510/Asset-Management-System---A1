import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaBoxOpen,
  FaTruck,
  FaTools,
  FaChartBar,
  FaCog,
  FaBars,
  FaClipboardList,
  FaHistory,
} from "react-icons/fa";

const menuItems = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: <FaTachometerAlt />,
  },
  {
    name: "Users",
    path: "/users",
    icon: <FaUsers />,
  },
  {
    name: "Assets",
    path: "/assets",
    icon: <FaBoxOpen />,
  },
  {
    name: "Assignments",
    path: "/assignments",
    icon: <FaClipboardList />,
  },
  {
    name: "Vendors",
    path: "/vendors",
    icon: <FaTruck />,
  },
  {
    name: "Maintenance",
    path: "/maintenance",
    icon: <FaTools />,
  },
  {
    name: "Reports",
    path: "/reports",
    icon: <FaChartBar />,
  },
  {
    name: "Settings",
    path: "/settings",
    icon: <FaCog />,
  },
  {
  name: "Audit Trail",
  path: "/audit",
  icon: <FaHistory />,
},
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`${
        collapsed ? "w-16" : "w-64"
      } bg-slate-900 text-white min-h-screen flex flex-col transition-all duration-300 flex-shrink-0`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
        {!collapsed && (
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/30">
              <span className="text-white font-black text-sm">A</span>
            </div>
            <div className="min-w-0">
              <p className="font-bold text-white text-sm leading-tight">AMS</p>
              <p className="text-xs text-slate-400 truncate">Asset Management</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mx-auto shadow-lg shadow-blue-500/30">
            <span className="text-white font-black text-sm">A</span>
          </div>
        )}
        {!collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <FaBars className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Expand button when collapsed */}
      {collapsed && (
        <button
          onClick={() => setCollapsed(false)}
          className="mx-auto mt-3 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
        >
          <FaBars className="w-4 h-4" />
        </button>
      )}

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 mt-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            title={collapsed ? item.name : undefined}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium group ${
                isActive
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              } ${collapsed ? "justify-center" : ""}`
            }
          >
            <span className="text-base flex-shrink-0">{item.icon}</span>
            {!collapsed && <span>{item.name}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-slate-700/50">
          <p className="text-xs text-slate-500 text-center">v1.0.0 · AMS System</p>
        </div>
      )}
    </aside>
  );
}