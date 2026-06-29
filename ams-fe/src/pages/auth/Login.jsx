import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  Eye, EyeOff, Shield, User, AlertCircle, Loader2, Lock, Mail,
  Package, Users, Wrench, Store, LayoutDashboard
} from "lucide-react";
import api from "../../api/axios";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [tab, setTab] = useState("admin"); // "admin" | "user"
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [stats, setStats] = useState({
    totalAssets: 0,
    totalUsers: 0,
    maintenanceTickets: 0,
    totalVendors: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/dashboard/public-stats");
        if (response.data?.success) {
          setStats(response.data.stats);
        }
      } catch (err) {
        // Silently fail — stats are non-critical on login page
        console.error("Failed to fetch login stats:", err);
      }
    };
    fetchStats();
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleTabSwitch = (newTab) => {
    setTab(newTab);
    setError("");
    setFormData({ email: "", password: "" });
    setShowPassword(false);
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

  const statCards = [
    { label: "Total Assets", value: stats.totalAssets, icon: Package, color: "#818cf8" },
    { label: "Active Users", value: stats.totalUsers, icon: Users, color: "#67e8f9" },
    { label: "Maintenance", value: stats.maintenanceTickets, icon: Wrench, color: "#fbbf24" },
    { label: "Vendors", value: stats.totalVendors, icon: Store, color: "#34d399" },
  ];

  return (
    <div className="min-h-screen flex" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Google Font */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(3deg); }
        }
        @keyframes float-medium {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-2deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes count-up {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .login-animate-in {
          animation: slide-up 0.5s ease-out forwards;
        }
        .login-animate-in-delay {
          animation: slide-up 0.5s ease-out 0.1s forwards;
          opacity: 0;
        }
        .login-animate-in-delay-2 {
          animation: slide-up 0.5s ease-out 0.2s forwards;
          opacity: 0;
        }
        .stat-value {
          animation: count-up 0.6s ease-out 0.3s forwards;
          opacity: 0;
        }
      `}</style>

      {/* Left decorative panel */}
      <div
        className="hidden lg:flex w-1/2 flex-col items-center justify-center p-12 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 30%, #312e81 50%, #1e1b4b 70%, #0f172a 100%)",
          backgroundSize: "200% 200%",
          animation: "gradient-shift 12s ease infinite",
        }}
      >
        {/* Floating decorative orbs */}
        <div
          className="absolute top-20 left-16 w-64 h-64 rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, #818cf8 0%, transparent 70%)",
            animation: "float-slow 8s ease-in-out infinite",
          }}
        />
        <div
          className="absolute bottom-32 right-12 w-48 h-48 rounded-full opacity-15"
          style={{
            background: "radial-gradient(circle, #6366f1 0%, transparent 70%)",
            animation: "float-medium 6s ease-in-out infinite",
          }}
        />
        <div
          className="absolute top-1/2 left-1/3 w-32 h-32 rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, #a5b4fc 0%, transparent 70%)",
            animation: "pulse-glow 4s ease-in-out infinite",
          }}
        />

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        <div className="text-center relative z-10">
          {/* Icon-based logo */}
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
            style={{
              background: "linear-gradient(135deg, #6366f1 0%, #818cf8 100%)",
              boxShadow: "0 20px 40px rgba(99, 102, 241, 0.35)",
            }}
          >
            <LayoutDashboard className="w-10 h-10 text-white" />
          </div>
          <h1
            className="text-4xl font-black text-white tracking-tight mb-3"
            style={{ letterSpacing: "-0.03em" }}
          >
            AMS
          </h1>
          <p
            className="text-lg font-semibold"
            style={{ color: "#a5b4fc" }}
          >
            Asset Management System
          </p>
          <p
            className="text-sm mt-4 max-w-xs leading-relaxed mx-auto"
            style={{ color: "#94a3b8" }}
          >
            Manage your organization's assets, maintenance, vendors and reports all in one place.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-4 w-full max-w-sm relative z-10">
          {statCards.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.label}
                className="rounded-2xl p-5 text-center transition-all duration-300 hover:scale-105 cursor-default"
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  backdropFilter: "blur(12px)",
                }}
              >
                <div className="flex justify-center mb-2.5">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{
                      background: `${s.color}18`,
                      border: `1px solid ${s.color}30`,
                    }}
                  >
                    <Icon className="w-4.5 h-4.5" style={{ color: s.color }} />
                  </div>
                </div>
                <p className="text-2xl font-extrabold text-white stat-value">{s.value}</p>
                <p className="text-xs mt-1.5 font-medium" style={{ color: "#94a3b8" }}>{s.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right panel */}
      <div
        className="flex-1 flex items-center justify-center p-6"
        style={{ background: "linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)" }}
      >
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8 login-animate-in">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #6366f1, #818cf8)",
              }}
            >
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-800">AMS</span>
          </div>

          {/* Tab switcher */}
          <div
            className="flex rounded-2xl p-1.5 mb-8 login-animate-in"
            style={{ background: "#e2e8f0" }}
          >
            <button
              onClick={() => handleTabSwitch("admin")}
              className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                isAdmin
                  ? "text-white shadow-lg"
                  : "text-slate-500 hover:text-slate-700"
              }`}
              style={isAdmin ? {
                background: "linear-gradient(135deg, #6366f1, #4f46e5)",
                boxShadow: "0 4px 15px rgba(99, 102, 241, 0.35)",
              } : {}}
            >
              <Shield className="w-4 h-4" />
              Admin Login
            </button>
            <button
              onClick={() => handleTabSwitch("user")}
              className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                !isAdmin
                  ? "text-white shadow-lg"
                  : "text-slate-500 hover:text-slate-700"
              }`}
              style={!isAdmin ? {
                background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                boxShadow: "0 4px 15px rgba(59, 130, 246, 0.35)",
              } : {}}
            >
              <User className="w-4 h-4" />
              Employee Login
            </button>
          </div>

          <h2
            className="text-3xl font-black text-slate-900 mb-1 login-animate-in-delay"
            style={{ letterSpacing: "-0.02em" }}
          >
            {isAdmin ? "Admin Access" : "Employee Portal"}
          </h2>
          <p className="text-slate-500 mb-8 login-animate-in-delay">
            {isAdmin
              ? "Sign in to manage the Asset Management System"
              : "Sign in to view your assigned assets and profile"}
          </p>

          {/* Role hint */}
          <div
            className="text-xs font-semibold px-4 py-3 rounded-xl mb-6 flex items-center gap-2.5 login-animate-in-delay-2"
            style={isAdmin ? {
              background: "linear-gradient(135deg, #ede9fe, #f5f3ff)",
              color: "#6d28d9",
              border: "1px solid #ddd6fe",
            } : {
              background: "linear-gradient(135deg, #dbeafe, #eff6ff)",
              color: "#1d4ed8",
              border: "1px solid #bfdbfe",
            }}
          >
            {isAdmin ? (
              <>
                <Lock className="w-3.5 h-3.5 flex-shrink-0" />
                Only administrators can access this portal.
              </>
            ) : (
              <>
                <User className="w-3.5 h-3.5 flex-shrink-0" />
                Use the credentials provided by your administrator.
              </>
            )}
          </div>

          {error && (
            <div
              className="text-sm px-4 py-3 rounded-xl mb-6 flex items-center gap-2.5"
              style={{
                background: "linear-gradient(135deg, #fef2f2, #fff1f2)",
                color: "#dc2626",
                border: "1px solid #fecaca",
              }}
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Email address
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
                />
                <input
                  id="login-email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder={isAdmin ? "admin@company.com" : "employee@company.com"}
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200"
                  style={{
                    focusRingColor: isAdmin ? "#6366f1" : "#3b82f6",
                  }}
                  onFocus={(e) => {
                    e.target.style.boxShadow = isAdmin
                      ? "0 0 0 3px rgba(99, 102, 241, 0.15)"
                      : "0 0 0 3px rgba(59, 130, 246, 0.15)";
                    e.target.style.borderColor = isAdmin ? "#6366f1" : "#3b82f6";
                  }}
                  onBlur={(e) => {
                    e.target.style.boxShadow = "none";
                    e.target.style.borderColor = "#e2e8f0";
                  }}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
                />
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter your password"
                  className="w-full pl-11 pr-12 py-3.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200"
                  onFocus={(e) => {
                    e.target.style.boxShadow = isAdmin
                      ? "0 0 0 3px rgba(99, 102, 241, 0.15)"
                      : "0 0 0 3px rgba(59, 130, 246, 0.15)";
                    e.target.style.borderColor = isAdmin ? "#6366f1" : "#3b82f6";
                  }}
                  onBlur={(e) => {
                    e.target.style.boxShadow = "none";
                    e.target.style.borderColor = "#e2e8f0";
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all duration-200 cursor-pointer"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4.5 h-4.5" />
                  ) : (
                    <Eye className="w-4.5 h-4.5" />
                  )}
                </button>
              </div>
            </div>

            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="w-full disabled:opacity-60 text-white font-semibold py-3.5 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
              style={isAdmin ? {
                background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
                boxShadow: "0 8px 25px rgba(99, 102, 241, 0.3)",
              } : {
                background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                boxShadow: "0 8px 25px rgba(59, 130, 246, 0.3)",
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.transform = "translateY(-1px)";
                  e.target.style.boxShadow = isAdmin
                    ? "0 12px 30px rgba(99, 102, 241, 0.4)"
                    : "0 12px 30px rgba(59, 130, 246, 0.4)";
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = isAdmin
                  ? "0 8px 25px rgba(99, 102, 241, 0.3)"
                  : "0 8px 25px rgba(59, 130, 246, 0.3)";
              }}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin w-4 h-4" />
                  Signing in...
                </>
              ) : (
                `Sign in as ${isAdmin ? "Admin" : "Employee"}`
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-xs text-slate-400 mt-8 font-medium">
            Asset Management System v1.0
          </p>
        </div>
      </div>
    </div>
  );
}