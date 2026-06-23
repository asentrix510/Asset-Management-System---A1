import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import UserForm from "../../components/users/UserForm";
import UserTable from "../../components/users/UserTable";
import { getUsers, createUser, deleteUser, updateUser } from "../../api/userApi";
import { FaUserPlus } from "react-icons/fa";

export default function Users() {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null); // { msg, type }
  const [selectedUser, setSelectedUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const loadUsers = async () => {
    try {
      const response = await getUsers(token);
      setUsers(response.data.users || []);
    } catch (err) {
      console.error("Failed to load users:", err);
    }
  };

  useEffect(() => { loadUsers(); }, []);

  const handleCreate = async (data) => {
    setLoading(true);
    try {
      await createUser(token, data);
      await loadUsers();
      setShowForm(false);
      showToast("User created successfully.");
    } catch (err) {
      const msg =
        err?.response?.data?.message || "Failed to create user. Please try again.";
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user? This cannot be undone.")) return;
    try {
      await deleteUser(token, id);
      await loadUsers();
      showToast("User deleted.");
    } catch (err) {
      showToast(err?.response?.data?.message || "Failed to delete user.", "error");
    }
  };

  const handleEditSubmit = async (data) => {
    setLoading(true);
    try {
      await updateUser(token, editingUser.user_id, data);
      await loadUsers();
      setEditingUser(null);
      showToast("User updated successfully.");
    } catch (err) {
      const msg =
        err?.response?.data?.message || "Failed to update user. Please try again.";
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Users</h1>
          <p className="text-slate-500 text-sm mt-1">Manage system users and their access</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-lg shadow-blue-500/20"
        >
          <FaUserPlus className="w-4 h-4" />
          Add User
        </button>
      </div>

      {/* Form */}
      {showForm && !editingUser && (
        <div className="mb-6">
          <UserForm
            onSubmit={handleCreate}
            onCancel={() => setShowForm(false)}
            loading={loading}
          />
        </div>
      )}

      {/* Edit Form */}
      {editingUser && (
        <div className="mb-6">
          <UserForm
            onSubmit={handleEditSubmit}
            onCancel={() => setEditingUser(null)}
            loading={loading}
            initialData={editingUser}
          />
        </div>
      )}

      <UserTable
        users={users}
        onDelete={handleDelete}
        onViewDetails={setSelectedUser}
        onEdit={(user) => {
          setShowForm(false);
          setEditingUser(user);
        }}
      />

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-2xl border border-slate-100 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-800">User Information</h3>
              <button
                onClick={() => setSelectedUser(null)}
                className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {/* Profile Overview Card */}
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-lg font-black uppercase">
                  {selectedUser.name?.charAt(0) || "?"}
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900">{selectedUser.name}</h4>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold mt-1 ${
                    selectedUser.role === "Admin"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-slate-100 text-slate-600"
                  }`}>
                    {selectedUser.role}
                  </span>
                </div>
              </div>

              {/* Fields Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">User ID</span>
                  <span className="text-sm font-medium text-slate-700 block select-all break-all">{selectedUser.user_id}</span>
                </div>
                <div>
                  <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Email Address</span>
                  <span className="text-sm font-medium text-slate-700 block break-all">{selectedUser.email}</span>
                </div>
                <div>
                  <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Phone</span>
                  <span className="text-sm font-medium text-slate-700 block">{selectedUser.phone || "—"}</span>
                </div>
                <div>
                  <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Department</span>
                  <span className="text-sm font-medium text-slate-700 block">{selectedUser.department || "—"}</span>
                </div>
                <div>
                  <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Designation</span>
                  <span className="text-sm font-medium text-slate-700 block">{selectedUser.designation || "—"}</span>
                </div>
              </div>

              {/* Password Section */}
              <div className="pt-2 border-t border-slate-100 space-y-3">
                <div>
                  <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Actual Password</span>
                  <div className="flex items-center gap-2 p-2.5 bg-slate-50 border border-slate-100 rounded-xl">
                    <span className="text-sm font-semibold text-slate-700 select-all break-all flex-1 font-mono">
                      {selectedUser.plain_password || "— (Hashed/Created prior to migration)"}
                    </span>
                    {selectedUser.plain_password && (
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(selectedUser.plain_password);
                          showToast("Password copied to clipboard!");
                        }}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-2.5 py-1.5 rounded-lg border border-blue-100 transition-colors whitespace-nowrap"
                      >
                        Copy Password
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Password Hash (Bcrypt)</span>
                  <div className="flex items-center gap-2 p-2 bg-slate-50/50 border border-slate-100/50 rounded-xl">
                    <code className="text-xs text-slate-500 select-all break-all flex-1 pr-2 font-mono">
                      {selectedUser.password || "—"}
                    </code>
                    {selectedUser.password && (
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(selectedUser.password);
                          showToast("Password hash copied to clipboard!");
                        }}
                        className="text-xs text-slate-400 hover:text-slate-600 px-2 py-1 rounded transition-colors whitespace-nowrap"
                      >
                        Copy Hash
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex justify-end">
              <button
                onClick={() => setSelectedUser(null)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-xl text-sm font-semibold transition-all ${
            toast.type === "error"
              ? "bg-red-500 text-white"
              : "bg-emerald-600 text-white"
          }`}
        >
          <span>{toast.type === "error" ? "✕" : "✓"}</span>
          {toast.msg}
        </div>
      )}
    </div>
  );
}