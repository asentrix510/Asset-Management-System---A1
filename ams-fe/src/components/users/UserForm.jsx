import { useState } from "react";

const inputClass =
  "w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition";

export default function UserForm({ onSubmit, onCancel }) {
  const [form, setForm] = useState({
    name: "",
    department: "",
    designation: "",
    phone: "",
    email: "",
    password: "",
    role: "User",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
      <h3 className="text-base font-bold text-slate-800 mb-5">Create New User</h3>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Full Name</label>
            <input name="name" placeholder="John Doe" onChange={handleChange} className={inputClass} required />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Email</label>
            <input name="email" type="email" placeholder="john@company.com" onChange={handleChange} className={inputClass} required />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Department</label>
            <input name="department" placeholder="IT" onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Designation</label>
            <input name="designation" placeholder="Engineer" onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Phone</label>
            <input name="phone" placeholder="+91 9999999999" onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Password</label>
            <input name="password" type="password" placeholder="••••••••" onChange={handleChange} className={inputClass} required />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Role</label>
            <select name="role" onChange={handleChange} className={inputClass}>
              <option value="User">User</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors shadow-lg shadow-blue-500/20"
          >
            Create User
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="text-sm font-medium text-slate-500 hover:text-slate-700 px-4 py-2.5 rounded-xl hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}