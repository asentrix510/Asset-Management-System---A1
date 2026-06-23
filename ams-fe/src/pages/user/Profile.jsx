import { useEffect, useState } from "react";
import { getMyProfile, updateMyProfile } from "../../api/portalApi";

const inputClass =
  "w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition";

const readonlyClass =
  "w-full px-4 py-2.5 text-sm border border-slate-100 rounded-xl bg-slate-50 text-slate-500 cursor-not-allowed";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ name: "", phone: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    getMyProfile()
      .then((r) => {
        setProfile(r.data.user);
        setForm({ name: r.data.user.name || "", phone: r.data.user.phone || "" });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateMyProfile(form);
      setProfile((prev) => ({ ...prev, ...form }));
      setToast({ msg: "Profile updated successfully.", type: "success" });
    } catch {
      setToast({ msg: "Failed to update profile.", type: "error" });
    } finally {
      setSaving(false);
      setTimeout(() => setToast(null), 3000);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20 text-slate-400 text-sm">Loading…</div>;
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-900">My Profile</h1>
        <p className="text-slate-500 text-sm mt-1">
          View your account details. You can update your name and phone number.
        </p>
      </div>

      {/* Avatar + role card */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 mb-6 flex items-center gap-5">
        <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-3xl font-black text-white">
          {profile?.name?.[0]?.toUpperCase() || "U"}
        </div>
        <div>
          <p className="text-white font-bold text-lg">{profile?.name}</p>
          <p className="text-blue-200 text-sm">{profile?.email}</p>
          <div className="flex gap-2 mt-2 flex-wrap">
            {profile?.department && (
              <span className="bg-white/20 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full">
                {profile.department}
              </span>
            )}
            {profile?.designation && (
              <span className="bg-white/20 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full">
                {profile.designation}
              </span>
            )}
            <span className="bg-white/10 text-blue-100 text-xs font-semibold px-2.5 py-0.5 rounded-full">
              {profile?.role}
            </span>
          </div>
        </div>
      </div>

      {/* Editable fields */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6">
        <h2 className="text-sm font-bold text-slate-800 mb-5">Edit Details</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Full Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Phone Number</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="+91 9999999999"
              className={inputClass}
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors shadow-lg shadow-blue-500/20"
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </form>
      </div>

      {/* Read-only admin-controlled fields */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h2 className="text-sm font-bold text-slate-800 mb-1">Administrator-Controlled Fields</h2>
        <p className="text-xs text-slate-400 mb-5">These fields can only be changed by your administrator.</p>
        <div className="space-y-4">
          {[
            ["Email Address", profile?.email],
            ["Department", profile?.department || "—"],
            ["Designation", profile?.designation || "—"],
            ["Role", profile?.role],
          ].map(([label, value]) => (
            <div key={label}>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">{label}</label>
              <input value={value} readOnly className={readonlyClass} />
            </div>
          ))}
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-xl text-sm font-semibold z-50 ${
            toast.type === "success" ? "bg-emerald-600 text-white" : "bg-red-500 text-white"
          }`}
        >
          {toast.type === "success" ? "✓" : "✕"} {toast.msg}
        </div>
      )}
    </div>
  );
}
