import { useState } from "react";
import { User, Mail, Briefcase, Shield, Phone, Key, Plus, Save } from "lucide-react";

const inputClass =
  "w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white text-slate-950 placeholder-slate-450 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 shadow-sm";

const selectClass =
  "w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white text-slate-950 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 shadow-sm cursor-pointer";

export default function UserForm({ onSubmit, onCancel, loading = false, initialData = null, currentUserRole }) {
  const [form, setForm] = useState({
    name: initialData?.name || "",
    department: initialData?.department || "",
    designation: initialData?.designation || "",
    phone: initialData?.phone || "",
    email: initialData?.email || "",
    password: "",
    role: initialData?.role || "User",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const submissionData = { ...form };
    if (initialData && !submissionData.password) {
      delete submissionData.password;
    }
    onSubmit(submissionData);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 select-none">
      <h3 className="text-base font-bold text-slate-800 tracking-tight mb-5">
        {initialData ? `Edit Employee Profile` : "Register Employee"}
      </h3>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-400" />
              Full Name <span className="text-rose-500">*</span>
            </label>
            <input
              name="name"
              value={form.name}
              placeholder="e.g. John Doe"
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>
          
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              Corporate Email Address <span className="text-rose-500">*</span>
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              placeholder="e.g. john@company.com"
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-slate-400" />
              Assigned Department
            </label>
            <input
              name="department"
              value={form.department}
              placeholder="e.g. Engineering"
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-slate-400" />
              Corporate Designation
            </label>
            <input
              name="designation"
              value={form.designation}
              placeholder="e.g. Software Engineer"
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              Phone Number
            </label>
            <input
              name="phone"
              value={form.phone}
              placeholder="e.g. +91 9999999999"
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-slate-400" />
              Account Password {!initialData && <span className="text-rose-500">*</span>}
            </label>
            <input
              name="password"
              type="password"
              value={form.password}
              placeholder={initialData ? "Leave blank to keep unchanged" : "••••••••"}
              onChange={handleChange}
              className={inputClass}
              required={!initialData}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-slate-400" />
              System Role
            </label>
            {currentUserRole === "SuperAdmin" ? (
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className={selectClass}
              >
                <option value="User">User (Standard Access)</option>
                <option value="Admin">Admin (Full System Console)</option>
                <option value="SuperAdmin">SuperAdmin (Highest Privilege)</option>
              </select>
            ) : (
              <input
                type="text"
                name="role"
                value={form.role}
                readOnly
                disabled
                className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 text-slate-450 cursor-not-allowed"
              />
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-xs font-bold px-5 py-3 rounded-xl transition-all shadow-md shadow-indigo-500/10 cursor-pointer disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                {initialData ? "Saving Details..." : "Creating Account..."}
              </>
            ) : (
              <>
                {initialData ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                {initialData ? "Save Employee Profile" : "Register Employee"}
              </>
            )}
          </button>
          
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="text-xs font-bold text-slate-500 hover:text-slate-700 px-4 py-3 rounded-xl hover:bg-slate-100 transition-all cursor-pointer border border-transparent hover:border-slate-150"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}