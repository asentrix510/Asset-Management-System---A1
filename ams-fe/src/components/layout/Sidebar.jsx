import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Package,
  ClipboardList,
  Truck,
  Wrench,
  BarChart2,
  Settings as SettingsIcon,
  History,
  Menu
} from "lucide-react";

const menuItems = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: <LayoutDashboard className="w-4.5 h-4.5" />,
  },
  {
    name: "Users",
    path: "/users",
    icon: <Users className="w-4.5 h-4.5" />,
  },
  {
    name: "Assets",
    path: "/assets",
    icon: <Package className="w-4.5 h-4.5" />,
  },
  {
    name: "Assignments",
    path: "/assignments",
    icon: <ClipboardList className="w-4.5 h-4.5" />,
  },
  {
    name: "Vendors",
    path: "/vendors",
    icon: <Truck className="w-4.5 h-4.5" />,
  },
  {
    name: "Maintenance",
    path: "/maintenance",
    icon: <Wrench className="w-4.5 h-4.5" />,
  },
  {
    name: "Reports",
    path: "/reports",
    icon: <BarChart2 className="w-4.5 h-4.5" />,
  },
  {
    name: "Settings",
    path: "/settings",
    icon: <SettingsIcon className="w-4.5 h-4.5" />,
  },
  {
    name: "Audit Trail",
    path: "/audit",
    icon: <History className="w-4.5 h-4.5" />,
  },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`${
        collapsed ? "w-16" : "w-64"
      } bg-slate-950 text-slate-100 min-h-screen flex flex-col transition-all duration-300 shrink-0 border-r border-slate-900`}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-900">
        {!collapsed && (
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20">
              <span className="text-white font-black text-base">A</span>
            </div>
            <div className="min-w-0">
              <p className="font-black text-sm tracking-wide leading-none text-white">AMS</p>
              <p className="text-[9px] font-bold text-slate-500 mt-1 uppercase tracking-wider">Asset Management</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="w-9 h-9 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto shadow-lg shadow-blue-500/20 select-none">
            <span className="text-white font-black text-base">A</span>
          </div>
        )}
        {!collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            className="p-1.5 rounded-lg text-slate-550 hover:text-slate-200 hover:bg-slate-900 transition-colors cursor-pointer"
            title="Collapse Sidebar"
          >
            <Menu className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Expand button when collapsed */}
      {collapsed && (
        <button
          onClick={() => setCollapsed(false)}
          className="mx-auto mt-4 p-1.5 rounded-lg text-slate-550 hover:text-slate-200 hover:bg-slate-900 transition-colors cursor-pointer"
          title="Expand Sidebar"
        >
          <Menu className="w-4 h-4" />
        </button>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 mt-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            title={collapsed ? item.name : undefined}
            className={({ isActive }) =>
              `flex items-center gap-3.5 px-3.5 py-3 rounded-xl transition-all duration-200 text-sm font-semibold group cursor-pointer ${
                isActive
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/20 scale-[1.02]"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
              } ${collapsed ? "justify-center" : ""}`
            }
          >
            {({ isActive }) => (
              <>
                <span className={`transition-transform duration-200 group-hover:scale-110 flex-shrink-0 ${isActive ? "text-white" : "text-slate-400 group-hover:text-slate-200"}`}>
                  {item.icon}
                </span>
                {!collapsed && <span>{item.name}</span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-slate-900 select-none">
          <p className="text-[10px] font-bold text-slate-600 text-center uppercase tracking-widest">v1.0.0 · AMS Admin</p>
        </div>
      )}
    </aside>
  );
}