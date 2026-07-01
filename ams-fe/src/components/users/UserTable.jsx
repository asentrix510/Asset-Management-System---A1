import { Edit2, Trash2 } from "lucide-react";

export default function UserTable({ users, onDelete, onViewDetails, onEdit, currentUserRole }) {
  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const getAvatarBg = (id) => {
    const gradients = [
      "from-blue-500 to-indigo-600",
      "from-purple-500 to-indigo-600",
      "from-teal-500 to-emerald-600",
      "from-rose-500 to-pink-600",
      "from-amber-500 to-orange-600",
    ];
    // simple hash to choose gradient consistently
    const index = id ? id.charCodeAt(0) % gradients.length : 0;
    return gradients[index];
  };

  if (!users?.length) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-10 text-center select-none">
        <p className="text-slate-400 text-sm font-semibold">No users registered.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100/80 shadow-sm overflow-hidden select-none">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/70 border-b border-slate-100 text-2xs font-extrabold text-slate-400 uppercase tracking-wider">
              <th className="px-6 py-4">Employee</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Department</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-xs">
            {users.map((user) => (
              <tr key={user.user_id} className="hover:bg-slate-50/30 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${getAvatarBg(user.user_id)} flex items-center justify-center text-[10px] font-black text-white shadow-sm shrink-0`}>
                      {getInitials(user.name)}
                    </div>
                    <div className="min-w-0">
                      <button
                        onClick={() => onViewDetails && onViewDetails(user)}
                        className="hover:underline hover:text-indigo-600 focus:outline-none transition-colors text-left font-bold text-slate-800 cursor-pointer"
                      >
                        {user.name}
                      </button>
                      <p className="text-[10px] text-slate-400 mt-0.5">{user.designation || "No Title"}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-500 font-semibold">{user.email}</td>
                <td className="px-6 py-4 text-slate-500 font-semibold">{user.department || "—"}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                      user.role === "SuperAdmin"
                        ? "bg-amber-50 text-amber-700 border-amber-200"
                        : user.role === "Admin"
                        ? "bg-indigo-50 text-indigo-700 border-indigo-100"
                        : "bg-slate-50 text-slate-600 border-slate-100"
                    }`}
                  >
                    {user.role?.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    {(user.role === "User" || currentUserRole === "SuperAdmin") && (
                    <button
                      onClick={() => onEdit && onEdit(user)}
                      className="p-1.5 bg-slate-50 text-slate-555 hover:text-indigo-650 hover:bg-indigo-50 rounded-lg border border-slate-100 hover:border-indigo-100 transition-colors cursor-pointer"
                      title="Edit Employee Profile"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    )}
                    {/* Show delete only if: target is not SuperAdmin AND (target is User OR current user is SuperAdmin) */}
                    {user.role !== "SuperAdmin" && (user.role === "User" || currentUserRole === "SuperAdmin") && (
                    <button
                      onClick={() => onDelete(user.user_id)}
                      className="p-1.5 bg-slate-50 text-slate-555 hover:text-rose-650 hover:bg-rose-50 rounded-lg border border-slate-100 hover:border-rose-100 transition-colors cursor-pointer"
                      title="Delete User"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}