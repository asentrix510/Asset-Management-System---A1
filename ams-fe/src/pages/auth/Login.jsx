import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [tab, setTab] = useState("admin"); // "admin" | "user"
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleTabSwitch = (newTab) => {
    setTab(newTab);
    setError("");
    setFormData({ email: "", password: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await login(formData.email, formData.password);
      const role = data?.user?.role;
      if (tab === "admin") {
        if (role !== "Admin") {
          setError("Access denied. Please use the Employee Login.");
          return;
        }
        navigate("/dashboard");
      } else {
        if (role !== "User") {
          setError("Access denied. Please use the Admin Login.");
          return;
        }
        navigate("/user/dashboard");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = tab === "admin";

  return (
    <div className="min-h-screen flex">
      {/* Left decorative panel */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex-col items-center justify-center p-12">
        <div className="text-center">
          <div className="w-20 h-20 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/30">
            <span className="text-white text-3xl font-black">A</span>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight mb-3">AMS</h1>
          <p className="text-blue-300 text-lg font-medium">Asset Management System</p>
          <p className="text-slate-400 text-sm mt-4 max-w-xs leading-relaxed">
            Manage your organization's assets, maintenance, vendors and reports all in one place.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-4 w-full max-w-sm">
          {[
            { label: "Total Assets", value: "124" },
            { label: "Active Users", value: "38" },
            { label: "Open Tickets", value: "9" },
            { label: "Vendors", value: "15" },
          ].map((s) => (
            <div key={s.label} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-white">{s.value}</p>
              <p className="text-xs text-slate-400 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center bg-slate-50 p-6">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-black text-lg">A</span>
            </div>
            <span className="text-xl font-bold text-slate-800">AMS</span>
          </div>

          {/* Tab switcher */}
          <div className="flex rounded-2xl bg-slate-200 p-1 mb-8">
            <button
              onClick={() => handleTabSwitch("admin")}
              className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${
                isAdmin
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              🔐 Admin Login
            </button>
            <button
              onClick={() => handleTabSwitch("user")}
              className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${
                !isAdmin
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              👤 Employee Login
            </button>
          </div>

          <h2 className="text-3xl font-black text-slate-900 mb-1">
            {isAdmin ? "Admin Access" : "Employee Portal"}
          </h2>
          <p className="text-slate-500 mb-8">
            {isAdmin
              ? "Sign in to manage the Asset Management System"
              : "Sign in to view your assigned assets and profile"}
          </p>

          {/* Role hint */}
          <div
            className={`text-xs font-semibold px-4 py-2.5 rounded-xl mb-6 border ${
              isAdmin
                ? "bg-violet-50 text-violet-700 border-violet-100"
                : "bg-blue-50 text-blue-700 border-blue-100"
            }`}
          >
            {isAdmin
              ? "🔒 Only administrators can access this portal."
              : "👥 Use the credentials provided by your administrator."}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-6 flex items-center gap-2">
              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Email address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder={isAdmin ? "admin@company.com" : "employee@company.com"}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full disabled:opacity-60 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg ${
                isAdmin
                  ? "bg-violet-600 hover:bg-violet-700 shadow-violet-500/25"
                  : "bg-blue-600 hover:bg-blue-700 shadow-blue-500/25"
              }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in...
                </>
              ) : (
                `Sign in as ${isAdmin ? "Admin" : "Employee"}`
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}