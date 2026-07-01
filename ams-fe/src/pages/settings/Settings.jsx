import { useState, useEffect } from "react";
import {
  Building2,
  Sliders,
  Lock,
  Bell,
  User,
  Database,
  Save,
  Download,
  Upload,
  AlertTriangle,
  Check,
  X,
  ChevronRight
} from "lucide-react";

/* ─────────────────────────────────────────
   Helpers
 ───────────────────────────────────────── */
const STORAGE_KEY = "ams_settings";

const DEFAULTS = {
  // Organisation
  org_name: "My Organisation",
  org_email: "",
  org_phone: "",
  org_address: "",
  org_timezone: "Asia/Kolkata",
  org_currency: "INR",

  // Asset Rules
  asset_code_prefix: "AST",
  depreciation_rate: "20",
  depreciation_method: "Straight-Line",
  useful_life_years: "5",
  low_stock_threshold: "5",

  // Security
  session_timeout: "30",
  max_login_attempts: "5",
  password_min_length: "8",
  allow_remember_me: true,

  // Notifications
  notify_assignment: true,
  notify_maintenance: true,
  notify_warranty: true,
  notify_low_stock: false,
  warranty_alert_days: "30",

  // Profile
  admin_name: "",
  admin_email: "",
  admin_phone: "",
};

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : { ...DEFAULTS };
  } catch {
    return { ...DEFAULTS };
  }
}

function save(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

/* ─────────────────────────────────────────
   Sub-components
 ───────────────────────────────────────── */
function SectionCard({ title, icon: Icon, children }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden select-none">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-50 bg-slate-50/30">
        <Icon className="w-5 h-5 text-indigo-500" />
        <h2 className="text-base font-bold text-slate-800 tracking-tight">{title}</h2>
      </div>
      <div className="p-6 space-y-6">{children}</div>
    </div>
  );
}

function Field({ label, hint, children }) {
  return (
    <div className="flex flex-col md:flex-row md:items-start gap-2 md:gap-6 pb-2">
      <div className="md:w-64 shrink-0">
        <p className="text-sm font-semibold text-slate-700">{label}</p>
        {hint && <p className="text-xs text-slate-400 mt-1 leading-relaxed">{hint}</p>}
      </div>
      <div className="flex-1 w-full">{children}</div>
    </div>
  );
}

const inputClass =
  "w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white text-slate-950 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 shadow-sm";

const selectClass =
  "w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white text-slate-950 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 shadow-sm cursor-pointer";

function TextInput({ value, onChange, placeholder, type = "text" }) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={inputClass}
    />
  );
}

function SelectInput({ value, onChange, options }) {
  return (
    <select
      value={value}
      onChange={onChange}
      className={selectClass}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

function Toggle({ checked, onChange, label }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none w-fit">
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={onChange}
        />
        <div
          className={`w-11 h-6 rounded-full transition-colors duration-250 ${
            checked ? "bg-indigo-600" : "bg-slate-200"
          }`}
        />
        <div
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-250 ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </div>
      <span className="text-sm font-medium text-slate-700">{label}</span>
    </label>
  );
}

function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-xl text-sm font-semibold transition-all ${
        type === "success"
          ? "bg-emerald-600 text-white"
          : "bg-red-500 text-white"
      }`}
    >
      {type === "success" ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
      {message}
    </div>
  );
}

/* ─────────────────────────────────────────
   Tab definitions
 ───────────────────────────────────────── */
const TABS = [
  { id: "org", label: "Organisation", icon: Building2 },
  { id: "assets", label: "Asset Rules", icon: Sliders },
  { id: "security", label: "Security", icon: Lock },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "profile", label: "My Profile", icon: User },
  { id: "backup", label: "Backup & Reset", icon: Database },
];

/* ─────────────────────────────────────────
   Main Component
 ───────────────────────────────────────── */
export default function Settings() {
  const [activeTab, setActiveTab] = useState("org");
  const [form, setForm] = useState(load);
  const [toast, setToast] = useState(null);

  const set = (key) => (e) =>
    setForm((prev) => ({
      ...prev,
      [key]: e.target.type === "checkbox" ? e.target.checked : e.target.value,
    }));

  const handleSave = () => {
    save(form);
    setToast({ message: "Settings saved successfully.", type: "success" });
  };

  const handleReset = () => {
    if (
      !window.confirm(
        "Reset all settings to defaults? This cannot be undone."
      )
    )
      return;
    const fresh = { ...DEFAULTS };
    setForm(fresh);
    save(fresh);
    setToast({ message: "Settings reset to defaults.", type: "success" });
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(form, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ams_settings_${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setToast({ message: "Settings exported.", type: "success" });
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const imported = JSON.parse(ev.target.result);
        const merged = { ...DEFAULTS, ...imported };
        setForm(merged);
        save(merged);
        setToast({ message: "Settings imported successfully.", type: "success" });
      } catch {
        setToast({ message: "Invalid settings file.", type: "error" });
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 select-none animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Settings</h1>
          <p className="text-slate-500 text-sm mt-1">
            Centralised configuration for your AMS
          </p>
        </div>
        <button
          onClick={handleSave}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md shadow-indigo-500/10 transition-all cursor-pointer"
        >
          <Save className="w-4 h-4" /> Save Settings
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Tabs */}
        <div className="md:w-56 shrink-0 flex flex-row md:flex-col gap-1 overflow-x-auto pb-2 md:pb-0">
          {TABS.map((tab) => {
            const TabIcon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all text-left whitespace-nowrap cursor-pointer ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/15"
                    : "bg-slate-100 text-slate-500 hover:bg-slate-150 hover:text-slate-800"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <TabIcon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                  <span>{tab.label}</span>
                </div>
                {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-80 hidden md:block" />}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="flex-1 space-y-6">

          {/* ── Organisation ── */}
          {activeTab === "org" && (
            <SectionCard title="Organisation Details" icon={Building2}>
              <Field label="Organisation Name" hint="Displayed across the system">
                <TextInput value={form.org_name} onChange={set("org_name")} placeholder="e.g. Acme Corp" />
              </Field>
              <Field label="Official Email" hint="Used in system-generated emails">
                <TextInput type="email" value={form.org_email} onChange={set("org_email")} placeholder="admin@acme.com" />
              </Field>
              <Field label="Phone Number">
                <TextInput value={form.org_phone} onChange={set("org_phone")} placeholder="+91 98765 43210" />
              </Field>
              <Field label="Address">
                <textarea
                  value={form.org_address}
                  onChange={set("org_address")}
                  rows={3}
                  placeholder="Full office address…"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 shadow-sm resize-none bg-white placeholder-slate-400"
                />
              </Field>
              <Field label="Timezone">
                <SelectInput
                  value={form.org_timezone}
                  onChange={set("org_timezone")}
                  options={[
                    { value: "Asia/Kolkata", label: "Asia/Kolkata (IST)" },
                    { value: "UTC", label: "UTC" },
                    { value: "America/New_York", label: "America/New_York (EST)" },
                    { value: "Europe/London", label: "Europe/London (GMT)" },
                    { value: "Asia/Dubai", label: "Asia/Dubai (GST)" },
                    { value: "Asia/Singapore", label: "Asia/Singapore (SGT)" },
                  ]}
                />
              </Field>
              <Field label="Currency">
                <SelectInput
                  value={form.org_currency}
                  onChange={set("org_currency")}
                  options={[
                    { value: "INR", label: "₹ INR – Indian Rupee" },
                    { value: "USD", label: "$ USD – US Dollar" },
                    { value: "EUR", label: "€ EUR – Euro" },
                    { value: "GBP", label: "£ GBP – British Pound" },
                    { value: "AED", label: "AED – UAE Dirham" },
                    { value: "SGD", label: "S$ SGD – Singapore Dollar" },
                  ]}
                />
              </Field>
            </SectionCard>
          )}

          {/* ── Asset Rules ── */}
          {activeTab === "assets" && (
            <SectionCard title="Asset Management Rules" icon={Sliders}>
              <Field label="Asset Code Prefix" hint="Prepended to auto-generated asset codes">
                <TextInput value={form.asset_code_prefix} onChange={set("asset_code_prefix")} placeholder="e.g. AST" />
              </Field>
              <Field label="Depreciation Method">
                <SelectInput
                  value={form.depreciation_method}
                  onChange={set("depreciation_method")}
                  options={[
                    { value: "Straight-Line", label: "Straight-Line" },
                    { value: "Declining-Balance", label: "Declining Balance" },
                    { value: "Sum-of-Years", label: "Sum-of-Years Digits" },
                  ]}
                />
              </Field>
              <Field label="Annual Depreciation Rate (%)" hint="Used when calculating asset current value">
                <TextInput type="number" value={form.depreciation_rate} onChange={set("depreciation_rate")} placeholder="20" />
              </Field>
              <Field label="Default Useful Life (Years)">
                <TextInput type="number" value={form.useful_life_years} onChange={set("useful_life_years")} placeholder="5" />
              </Field>
              <Field label="Low Stock Threshold" hint="Alert when available assets drop below this count">
                <TextInput type="number" value={form.low_stock_threshold} onChange={set("low_stock_threshold")} placeholder="5" />
              </Field>
            </SectionCard>
          )}

          {/* ── Security ── */}
          {activeTab === "security" && (
            <SectionCard title="Security Policies" icon={Lock}>
              <Field label="Session Timeout (minutes)" hint="Automatically log out inactive users">
                <TextInput type="number" value={form.session_timeout} onChange={set("session_timeout")} placeholder="30" />
              </Field>
              <Field label="Max Login Attempts" hint="Lock account after this many failed attempts">
                <TextInput type="number" value={form.max_login_attempts} onChange={set("max_login_attempts")} placeholder="5" />
              </Field>
              <Field label="Minimum Password Length">
                <TextInput type="number" value={form.password_min_length} onChange={set("password_min_length")} placeholder="8" />
              </Field>
              <Field label="Remember Me" hint="Allow users to stay logged in across sessions">
                <Toggle checked={form.allow_remember_me} onChange={set("allow_remember_me")} label="Allow Remember Me" />
              </Field>
            </SectionCard>
          )}

          {/* ── Notifications ── */}
          {activeTab === "notifications" && (
            <SectionCard title="Notification Preferences" icon={Bell}>
              <Field label="Asset Assignment" hint="Notify when an asset is assigned or returned">
                <Toggle checked={form.notify_assignment} onChange={set("notify_assignment")} label="Enable Notifications" />
              </Field>
              <Field label="Maintenance Alerts" hint="Notify when maintenance is scheduled or overdue">
                <Toggle checked={form.notify_maintenance} onChange={set("notify_maintenance")} label="Enable Notifications" />
              </Field>
              <Field label="Warranty Expiry Alerts">
                <Toggle checked={form.notify_warranty} onChange={set("notify_warranty")} label="Enable Notifications" />
              </Field>
              <Field label="Warranty Alert Lead Time (days)" hint="How many days before expiry to send alerts">
                <TextInput type="number" value={form.warranty_alert_days} onChange={set("warranty_alert_days")} placeholder="30" />
              </Field>
              <Field label="Low Stock Alerts" hint="Notify when available assets fall below threshold">
                <Toggle checked={form.notify_low_stock} onChange={set("notify_low_stock")} label="Enable Notifications" />
              </Field>
            </SectionCard>
          )}

          {/* ── Profile ── */}
          {activeTab === "profile" && (
            <SectionCard title="Administrator Profile" icon={User}>
              <Field label="Full Name">
                <TextInput value={form.admin_name} onChange={set("admin_name")} placeholder="John Smith" />
              </Field>
              <Field label="Email Address">
                <TextInput type="email" value={form.admin_email} onChange={set("admin_email")} placeholder="john@company.com" />
              </Field>
              <Field label="Phone">
                <TextInput value={form.admin_phone} onChange={set("admin_phone")} placeholder="+91 98765 43210" />
              </Field>
              <div className="pt-4 border-t border-slate-100">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-4">Change Password</p>
                <div className="space-y-4">
                  <Field label="Current Password">
                    <TextInput type="password" value="" onChange={() => {}} placeholder="••••••••" />
                  </Field>
                  <Field label="New Password">
                    <TextInput type="password" value="" onChange={() => {}} placeholder="••••••••" />
                  </Field>
                  <Field label="Confirm New Password">
                    <TextInput type="password" value="" onChange={() => {}} placeholder="••••••••" />
                  </Field>
                </div>
                <p className="text-xs text-slate-400 mt-4 leading-relaxed italic">
                  Password changes are handled by the authentication system and are not persisted here.
                </p>
              </div>
            </SectionCard>
          )}

          {/* ── Backup & Reset ── */}
          {activeTab === "backup" && (
            <div className="space-y-6">
              <SectionCard title="Export Settings" icon={Download}>
                <Field label="Download Configuration" hint="Save all current settings to a JSON file">
                  <button
                    onClick={handleExport}
                    className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" /> Export settings.json
                  </button>
                </Field>
              </SectionCard>

              <SectionCard title="Import Settings" icon={Upload}>
                <Field label="Upload Configuration" hint="Restore settings from a previously exported JSON file">
                  <label className="flex items-center gap-2 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all w-fit shadow-sm">
                    <Upload className="w-3.5 h-3.5" /> Choose File
                    <input type="file" accept=".json" onChange={handleImport} className="hidden" />
                  </label>
                </Field>
              </SectionCard>

              <SectionCard title="Reset to Defaults" icon={AlertTriangle}>
                <Field
                  label="Factory Reset"
                  hint="Clears all saved settings and restores factory defaults. This action cannot be undone."
                >
                  <button
                    onClick={handleReset}
                    className="flex items-center gap-2 bg-rose-50 hover:bg-rose-100 border border-rose-250 text-rose-600 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
                  >
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-500" /> Reset All Settings
                  </button>
                </Field>
              </SectionCard>
            </div>
          )}

          {/* Save bar at bottom of content */}
          <div className="flex justify-end pt-2">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-indigo-500/10 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" /> Save Settings
            </button>
          </div>

        </div>
      </div>

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}