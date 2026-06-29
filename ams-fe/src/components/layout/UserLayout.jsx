import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  LayoutDashboard,
  Package,
  Wrench,
  User,
  LogOut,
  Briefcase,
  UserCheck
} from "lucide-react";

const NAV = [
  { to: "/user/dashboard", icon: <LayoutDashboard className="w-4.5 h-4.5" />, label: "Dashboard" },
  { to: "/user/my-assets", icon: <Package className="w-4.5 h-4.5" />, label: "My Assets" },
  { to: "/user/my-maintenance", icon: <Wrench className="w-4.5 h-4.5" />, label: "My Maintenance" },
  { to: "/user/profile", icon: <User className="w-4.5 h-4.5" />, label: "Profile" },
];

function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <aside className="w-64 shrink-0 bg-slate-950 text-slate-100 min-h-screen flex flex-col border-r border-slate-900">
      {/* Brand Header */}
      <div className="px-6 py-5 border-b border-slate-900">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <span className="text-white font-black text-lg">A</span>
          </div>
          <div>
            <p className="text-white font-black text-sm tracking-wide leading-none">AMS</p>
            <p className="text-slate-500 text-[10px] font-bold mt-1 uppercase tracking-wider">Employee Portal</p>
          </div>
        </div>
      </div>

      {/* User Badge Profile info */}
      <div className="px-4 py-5 border-b border-slate-900">
        <div className="bg-slate-900/50 border border-slate-900 rounded-2xl p-4 flex flex-col items-center text-center shadow-inner">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-500 via-indigo-500 to-violet-600 flex items-center justify-center text-lg font-black text-white shadow-md ring-4 ring-slate-950 mb-3 select-none">
            {getInitials(user?.name)}
          </div>
          <p className="text-slate-100 text-sm font-bold truncate max-w-full leading-tight">{user?.name}</p>
          <p className="text-slate-500 text-xs truncate max-w-full mt-0.5">{user?.email}</p>
          {user?.department && (
            <span className="inline-flex items-center gap-1 mt-2.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[9px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              <Briefcase className="w-2.5 h-2.5" />
              {user.department}
            </span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-5 space-y-1.5">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer group ${
                isActive
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/20 scale-[1.02]"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className={`transition-transform duration-200 group-hover:scale-110 ${isActive ? "text-white" : "text-slate-400 group-hover:text-slate-200"}`}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer Sign Out */}
      <div className="px-3 pb-5">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold text-slate-400 hover:bg-rose-950/20 hover:text-rose-400 transition-all duration-200 cursor-pointer group"
        >
          <LogOut className="w-4.5 h-4.5 text-slate-400 group-hover:text-rose-400 transition-transform duration-200 group-hover:-translate-x-0.5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}

export default function UserLayout({ children }) {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen bg-slate-50/50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header bar */}
        <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-8 shrink-0 shadow-sm shadow-slate-100/40">
          <p className="text-sm text-slate-500 font-medium">
            Welcome back, <span className="font-bold text-slate-800">{user?.name}</span>
          </p>
          <span className="inline-flex items-center gap-1 bg-indigo-50/60 text-indigo-700 text-[10px] font-bold px-3 py-1.5 rounded-full border border-indigo-100/50 shadow-sm shadow-indigo-50/10">
            <UserCheck className="w-3 h-3" />
            EMPLOYEE PORTAL
          </span>
        </header>
        
        {/* Main Content Area */}
        <main className="flex-1 p-8 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
