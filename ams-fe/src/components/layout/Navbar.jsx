import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../context/NotificationContext";
import {
  Bell,
  Check,
  Trash,
  LogOut,
  User,
  ShieldCheck,
  AlertTriangle,
  Wrench,
  UserCheck,
  CheckSquare
} from "lucide-react";

const getNotificationIcon = (type) => {
  const t = type?.toLowerCase() || "";
  if (t === "warranty") return <AlertTriangle className="w-3.5 h-3.5 text-yellow-600" />;
  if (t === "maintenance") return <Wrench className="w-3.5 h-3.5 text-amber-600" />;
  if (t === "assignment") return <UserCheck className="w-3.5 h-3.5 text-blue-600" />;
  if (t === "return") return <CheckSquare className="w-3.5 h-3.5 text-violet-600" />;
  return <Bell className="w-3.5 h-3.5 text-slate-500" />;
};

const getNotificationBg = (type) => {
  const t = type?.toLowerCase() || "";
  if (t === "warranty") return "bg-yellow-50 border-yellow-100";
  if (t === "maintenance") return "bg-amber-50 border-amber-100";
  if (t === "assignment") return "bg-blue-50 border-blue-100";
  if (t === "return") return "bg-violet-50 border-violet-100";
  return "bg-slate-50 border-slate-100";
};

export default function Navbar({ pageTitle }) {
  const { user, logout } = useAuth();
  const {
    notifications = [],
    unreadCount = 0,
    loading = false,
    markAsRead,
    deleteNotification,
  } = useNotifications() || {};

  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getInitials = (name) => {
    if (!name) return "A";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 h-16 flex items-center justify-between px-8 sticky top-0 z-20 shadow-sm shadow-slate-100/30 select-none">
      <div>
        <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
          {pageTitle || "Dashboard Overview"}
        </h2>
      </div>

      <div className="flex items-center gap-4">
        {/* Notification Panel Button */}
        <div className="relative" ref={panelRef}>
          <button
            onClick={() => setOpen((prev) => !prev)}
            className="relative p-2.5 rounded-xl text-slate-450 hover:text-slate-700 hover:bg-slate-100/60 transition-all cursor-pointer border border-transparent hover:border-slate-150"
            title="System Alerts & Notifications"
          >
            <Bell className="w-4.5 h-4.5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[18px] h-4.5 bg-rose-500 rounded-full text-white text-[9px] font-black flex items-center justify-center px-1 shadow-md shadow-rose-500/20">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          {open && (
            <div className="absolute right-0 mt-3.5 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              {/* Dropdown Header */}
              <div className="flex items-center justify-between px-4 py-3.5 bg-slate-50/60 border-b border-slate-100">
                <span className="font-extrabold text-slate-800 text-xs tracking-wide uppercase">
                  Alert Notifications
                </span>
                {unreadCount > 0 && (
                  <span className="text-[10px] bg-rose-50 text-rose-600 font-extrabold px-2.5 py-0.5 rounded-full border border-rose-100/55 animate-pulse">
                    {unreadCount} UNREAD
                  </span>
                )}
              </div>

              {/* Alerts List */}
              <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
                {loading ? (
                  <div className="py-12 flex items-center justify-center text-slate-400 text-xs font-semibold">
                    <svg className="animate-spin w-4 h-4 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Syncing alerts...
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 text-xs font-semibold">
                    No active notifications
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.notification_id}
                      className={`flex items-start gap-3 px-4 py-3.5 transition-colors duration-200 ${
                        n.is_read ? "bg-white" : "bg-blue-50/40"
                      }`}
                    >
                      {/* Icon wrapper based on notification type */}
                      <div className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 shadow-sm ${getNotificationBg(n.type)}`}>
                        {getNotificationIcon(n.type)}
                      </div>

                      {/* Content block */}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-850 truncate">
                          {n.title}
                        </p>
                        <p className="text-[11px] text-slate-500 mt-1 leading-normal font-medium line-clamp-2">
                          {n.message}
                        </p>
                        <p className="text-[9px] text-slate-400 mt-1.5 font-semibold">
                          {new Date(n.created_at).toLocaleString("en-IN", { hour: "numeric", minute: "numeric", hour12: true })} · {new Date(n.created_at).toLocaleDateString("en-IN")}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-1 shrink-0">
                        {!n.is_read && (
                          <button
                            onClick={() => markAsRead(n.notification_id)}
                            title="Mark as read"
                            className="p-1 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer border border-transparent hover:border-blue-100"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(n.notification_id)}
                          title="Delete Alert"
                          className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50/80 transition-colors cursor-pointer border border-transparent hover:border-rose-100"
                        >
                          <Trash className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Info Avatar block */}
        <div className="flex items-center gap-3 pl-4 border-l border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-xs font-black text-white shadow-md shadow-blue-500/10">
            {getInitials(user?.name)}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-bold text-slate-800 leading-tight">
              {user?.name}
            </p>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-indigo-500" />
              {user?.role}
            </p>
          </div>

          <button
            onClick={logout}
            title="Sign Out System"
            className="ml-2 p-2.5 rounded-xl text-slate-400 hover:text-rose-650 hover:bg-rose-50 transition-all duration-200 cursor-pointer border border-transparent hover:border-rose-100 group"
          >
            <LogOut className="w-4 h-4 text-slate-400 group-hover:text-rose-650 transition-transform duration-200 group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </header>
  );
}