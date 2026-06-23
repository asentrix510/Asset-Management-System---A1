import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const NAV = [
  { to: "/user/dashboard", icon: "🏠", label: "Dashboard" },
  { to: "/user/my-assets", icon: "📦", label: "My Assets" },
  { to: "/user/my-maintenance", icon: "🔧", label: "My Maintenance" },
  { to: "/user/profile", icon: "👤", label: "Profile" },
];

function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <aside className="w-60 shrink-0 bg-gradient-to-b from-slate-900 to-slate-800 min-h-screen flex flex-col">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-black text-base">A</span>
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-tight">AMS</p>
            <p className="text-slate-400 text-[10px]">Employee Portal</p>
          </div>
        </div>
      </div>

      {/* User badge */}
      <div className="px-4 py-4 border-b border-white/10">
        <div className="bg-white/5 rounded-xl px-3 py-2.5">
          <p className="text-white text-xs font-semibold truncate">{user?.name}</p>
          <p className="text-slate-400 text-[10px] truncate">{user?.email}</p>
          {user?.department && (
            <span className="inline-block mt-1.5 bg-blue-500/20 text-blue-300 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
              {user.department}
            </span>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                isActive
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/30"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`
            }
          >
            <span className="text-base">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-5">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all"
        >
          <span className="text-base">🚪</span>
          Sign Out
        </button>
      </div>
    </aside>
  );
}

export default function UserLayout({ children }) {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-14 bg-white border-b border-slate-100 flex items-center justify-between px-6 shrink-0">
          <p className="text-sm text-slate-500">
            Welcome back, <span className="font-semibold text-slate-800">{user?.name}</span>
          </p>
          <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full border border-blue-100">
            Employee
          </span>
        </header>
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
