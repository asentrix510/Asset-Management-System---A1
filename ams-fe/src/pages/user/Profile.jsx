import { useEffect, useState } from "react";
import { getMyProfile, updateMyProfile } from "../../api/portalApi";
import {
  User,
  Phone,
  Lock,
  Mail,
  Briefcase,
  Shield,
  Save,
  CheckCircle,
  XCircle,
  FileCheck
} from "lucide-react";

const inputClass =
  "w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 shadow-sm";

const readonlyClass =
  "w-full px-4 py-2.5 text-sm border border-slate-100 rounded-xl bg-slate-50 text-slate-400 font-semibold cursor-not-allowed select-none";

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
    return (
      <div className="bg-white rounded-2xl border border-slate-100/80 shadow-sm p-20 flex items-center justify-center text-slate-400 text-sm font-semibold">
        <svg className="animate-spin w-5 h-5 mr-3 text-indigo-600" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        Loading profile details...
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      {/* Header Title */}
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">My Profile</h1>
        <p className="text-slate-500 text-sm mt-1">
          Review your registered corporate information and update your name or phone number.
        </p>
      </div>

      {/* Hero Profile Card */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 rounded-3xl p-8 text-white shadow-lg shadow-indigo-500/10 mb-8 relative overflow-hidden flex flex-col sm:flex-row items-center sm:items-start gap-6">
        {/* Decorative backdrop */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        
        <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-3xl font-black text-white shadow-inner select-none shrink-0">
          {profile?.name?.[0]?.toUpperCase() || "U"}
        </div>
        <div className="text-center sm:text-left">
          <h2 className="text-2xl font-black tracking-tight">{profile?.name}</h2>
          <p className="text-indigo-100/90 text-sm mt-1 font-medium">{profile?.email}</p>
          <div className="flex justify-center sm:justify-start gap-2 mt-4 flex-wrap">
            {profile?.department && (
              <span className="bg-white/10 backdrop-blur-sm text-white text-[10px] font-extrabold px-3 py-1 rounded-full border border-white/15 uppercase tracking-wide">
                DEPT: {profile.department}
              </span>
            )}
            {profile?.designation && (
              <span className="bg-white/10 backdrop-blur-sm text-white text-[10px] font-extrabold px-3 py-1 rounded-full border border-white/15 uppercase tracking-wide">
                ROLE: {profile.designation}
              </span>
            )}
            <span className="bg-white/5 backdrop-blur-sm text-indigo-200 text-[10px] font-extrabold px-3 py-1 rounded-full border border-white/5 uppercase tracking-wide">
              {profile?.role} ACCOUNT
            </span>
          </div>
        </div>
      </div>

      {/* Details Forms Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Left Card: Editable details */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h3 className="text-sm font-bold text-slate-800 tracking-tight mb-5 flex items-center gap-2">
            <User className="w-4 h-4 text-indigo-500" />
            Editable Information
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                <User className="w-3 h-3 text-slate-400" />
                Full Name
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className={inputClass}
                required
                placeholder="Enter full name"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                <Phone className="w-3 h-3 text-slate-400" />
                Phone Number
              </label>
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
              className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-xs font-bold py-3 rounded-xl transition-all shadow-md shadow-indigo-500/20 cursor-pointer disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              {saving ? "Saving Changes…" : "Save Changes"}
            </button>
          </form>
        </div>

        {/* Right Card: Read-only admin fields */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800 tracking-tight mb-1.5 flex items-center gap-2">
              <Lock className="w-4 h-4 text-slate-400" />
              Security Locked Fields
            </h3>
            <p className="text-[11px] text-slate-400 leading-normal mb-5">
              These properties are controlled strictly by system administrators and cannot be altered locally.
            </p>
            <div className="space-y-4">
              {[
                { icon: <Mail className="w-3.5 h-3.5" />, label: "Corporate Email Address", value: profile?.email },
                { icon: <Briefcase className="w-3.5 h-3.5" />, label: "Assigned Department", value: profile?.department || "—" },
                { icon: <Shield className="w-3.5 h-3.5" />, label: "Corporate Designation", value: profile?.designation || "—" },
                { icon: <FileCheck className="w-3.5 h-3.5" />, label: "System Permission Role", value: `${profile?.role} Account` },
              ].map((field) => (
                <div key={field.label}>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                    {field.icon}
                    {field.label}
                  </label>
                  <input value={field.value} readOnly className={readonlyClass} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Toast popup */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-xs font-bold z-50 animate-bounce ${
            toast.type === "success" ? "bg-emerald-600 text-white" : "bg-red-500 text-white"
          }`}
        >
          {toast.type === "success" ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
          {toast.msg}
        </div>
      )}
    </div>
  );
}
