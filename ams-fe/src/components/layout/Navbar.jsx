import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../context/NotificationContext";
import { FaBell, FaSignOutAlt, FaUserCircle, FaTrash, FaCheck } from "react-icons/fa";

export default function Navbar({ pageTitle }) {
  const { user, logout } = useAuth();
  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    deleteNotification,
  } = useNotifications();

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

  return (
    <header className="bg-white border-b border-slate-100 h-16 flex items-center justify-between px-6 sticky top-0 z-10">
      <div>
        <h2 className="text-lg font-bold text-slate-800">
          {pageTitle || "Dashboard"}
        </h2>
      </div>

      <div className="flex items-center gap-3">
        {/* Notification bell */}
        <div className="relative" ref={panelRef}>
          <button
            onClick={() => setOpen((prev) => !prev)}
            className="relative p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            title="Notifications"
          >
            <FaBell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[16px] h-4 bg-red-500 rounded-full text-white text-[10px] font-bold flex items-center justify-center px-0.5">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>

          {/* Dropdown panel */}
          {open && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                <span className="font-semibold text-slate-800 text-sm">
                  Notifications
                </span>
                {unreadCount > 0 && (
                  <span className="text-xs bg-red-100 text-red-600 font-semibold px-2 py-0.5 rounded-full">
                    {unreadCount} unread
                  </span>
                )}
              </div>

              {/* List */}
              <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
                {loading ? (
                  <div className="py-8 text-center text-slate-400 text-sm">
                    Loading...
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="py-8 text-center text-slate-400 text-sm">
                    No notifications
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.notification_id}
                      className={`flex items-start gap-3 px-4 py-3 transition-colors ${
                        n.is_read ? "bg-white" : "bg-blue-50"
                      }`}
                    >
                      {/* Dot indicator */}
                      <div className="mt-1.5 flex-shrink-0">
                        {!n.is_read ? (
                          <span className="w-2 h-2 rounded-full bg-blue-500 block" />
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-slate-200 block" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-800 truncate">
                          {n.title}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                          {n.message}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-1">
                          {new Date(n.created_at).toLocaleString()}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-1 flex-shrink-0">
                        {!n.is_read && (
                          <button
                            onClick={() => markAsRead(n.notification_id)}
                            title="Mark as read"
                            className="p-1 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-100 transition-colors"
                          >
                            <FaCheck className="w-3 h-3" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(n.notification_id)}
                          title="Delete"
                          className="p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <FaTrash className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

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