import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Globe, Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";
import useAuth from "../hooks/useAuth";

const LoginPage = () => {
  const { login }   = useAuth();
  const navigate    = useNavigate();
  const location    = useLocation();
  const from        = location.state?.from?.pathname || "/dashboard";

  const [formData, setFormData] = useState({ email:"", password:"" });
  const [showPw, setShowPw]     = useState(false);
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const handleChange = (e) => {
    setFormData(p => ({ ...p, [e.target.name]: e.target.value }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(formData.email, formData.password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password.");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen mesh-bg flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm animate-fade-up">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-9 h-9 bg-teal-500 rounded-xl flex items-center justify-center">
            <Globe size={18} className="text-slate-950" strokeWidth={2.5} />
          </div>
          <span className="font-display text-xl text-white">TravelGen</span>
        </Link>

        <div className="glass border border-white/[0.07] rounded-2xl p-7 shadow-2xl">
          <h1 className="font-display text-2xl text-white mb-1">Welcome back</h1>
          <p className="text-slate-400 text-sm mb-6">
            No account? <Link to="/signup" className="text-teal-400 hover:text-teal-300">Sign up free</Link>
          </p>

          {error && (
            <div className="flex items-center gap-2 bg-red-950/40 border border-red-800/60 text-red-300 text-sm rounded-xl px-4 py-3 mb-5">
              <AlertCircle size={15} className="shrink-0" />{error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Email address</label>
              <input type="email" name="email" value={formData.email}
                onChange={handleChange} placeholder="alex@example.com"
                required autoComplete="email" className="input-field" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Password</label>
              <div className="relative">
                <input type={showPw ? "text" : "password"} name="password"
                  value={formData.password} onChange={handleChange}
                  placeholder="Your password" required autoComplete="current-password"
                  className="input-field pr-10" />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="btn-teal w-full py-3 text-sm flex items-center justify-center gap-2 mt-2 disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? <><Loader2 size={15} className="animate-spin" /> Logging in…</> : "Log in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;