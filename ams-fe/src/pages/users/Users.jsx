import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import UserForm from "../../components/users/UserForm";
import UserTable from "../../components/users/UserTable";
import { getUsers, createUser, deleteUser } from "../../api/userApi";
import { FaUserPlus, FaUsers } from "react-icons/fa";

export default function Users() {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const loadUsers = async () => {
    const response = await getUsers(token);
    setUsers(response.data.users);
  };

  useEffect(() => { loadUsers(); }, []);

  const handleCreate = async (data) => {
    await createUser(token, data);
    loadUsers();
    setShowForm(false);
  };

  const handleDelete = async (id) => {
    await deleteUser(token, id);
    loadUsers();
  };

  return (
    <div>
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

      {showForm && (
        <div className="mb-6">
          <UserForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
        </div>
      )}

      <UserTable users={users} onDelete={handleDelete} />
    </div>
  );
}