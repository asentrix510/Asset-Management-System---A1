import { useAuth } from "../../context/AuthContext";
import { FaBell, FaSignOutAlt, FaUserCircle } from "react-icons/fa";

export default function Navbar({ pageTitle }) {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white border-b border-slate-100 h-16 flex items-center justify-between px-6 sticky top-0 z-10">
      <div>
        <h2 className="text-lg font-bold text-slate-800">
          {pageTitle || "Dashboard"}
        </h2>
      </div>

      <div className="flex items-center gap-3">
        {/* Notification bell */}
        <button className="relative p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
          <FaBell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User info */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-slate-100">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <FaUserCircle className="text-blue-600 w-5 h-5" />
          </div>
          <div className="hidden sm:block text-right">
            <p className="text-sm font-semibold text-slate-800 leading-tight">
              {user?.name}
            </p>
            <p className="text-xs text-slate-400">{user?.role}</p>
          </div>

          <button
            onClick={logout}
            title="Logout"
            className="ml-1 p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
          >
            <FaSignOutAlt className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}