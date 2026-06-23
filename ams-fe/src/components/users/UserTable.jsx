export default function UserTable({ users, onDelete }) {
  if (!users?.length) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-10 text-center">
        <p className="text-slate-400 text-sm">No users found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3.5">Name</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3.5">Email</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3.5">Department</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3.5">Role</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3.5">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {users.map((user) => (
              <tr key={user.user_id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-5 py-3.5 font-medium text-slate-800">{user.name}</td>
                <td className="px-5 py-3.5 text-slate-500">{user.email}</td>
                <td className="px-5 py-3.5 text-slate-500">{user.department || "—"}</td>
                <td className="px-5 py-3.5">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      user.role === "Admin"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <button
                    onClick={() => onDelete(user.user_id)}
                    className="text-xs font-semibold text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}