
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Globe, LogOut, LayoutDashboard, Sparkles } from "lucide-react";
import useAuth from "../../hooks/useAuth";

const NavLink = ({ to, children, icon: Icon }) => {
  const location = useLocation();
  const active = location.pathname === to;
  return (
    <Link to={to}
      className={`relative flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg transition-all duration-200
        ${active ? "text-white bg-white/5" : "text-slate-400 hover:text-white hover:bg-white/5"}`}
    >
      {Icon && <Icon size={14} />}
      {children}
      {active && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-[2px] bg-teal-400 rounded-full" />}
    </Link>
  );
};

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate("/"); };
  const initials = user?.name
    ? user.name.split(" ").map(n => n[0]).slice(0,2).join("").toUpperCase()
    : "U";

  return (
    <header className="sticky top-0 z-50 glass border-b border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between py-3">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="relative w-8 h-8">
              <div className="absolute inset-0 bg-teal-500 rounded-lg rotate-6 opacity-30 group-hover:rotate-12 transition-transform duration-300" />
              <div className="relative w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
                <Globe size={16} className="text-slate-950" strokeWidth={2.5} />
              </div>
            </div>
            <span className="font-display text-lg text-white tracking-tight">
              Travel<span className="text-teal-400">Gen</span>
            </span>
          </Link>

          <div className="flex items-center gap-1">
            {isAuthenticated ? (
              <>
                <NavLink to="/planner"   icon={Sparkles}>New Trip</NavLink>
                <NavLink to="/dashboard" icon={LayoutDashboard}>Dashboard</NavLink>
                <div className="w-px h-5 bg-white/10 mx-2" />
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-slate-950 font-bold text-xs">
                    {initials}
                  </div>
                  <span className="text-sm text-slate-300 hidden sm:block font-medium">
                    {user?.name?.split(" ")[0]}
                  </span>
                </div>
                <button onClick={handleLogout}
                  className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-red-400 px-3 py-1.5 rounded-lg hover:bg-red-950/20 transition-all ml-1">
                  <LogOut size={14} />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm text-slate-400 hover:text-white px-4 py-1.5 rounded-lg hover:bg-white/5 transition-all">
                  Log in
                </Link>
                <Link to="/signup" className="btn-teal text-sm px-4 py-1.5 ml-1 inline-flex items-center gap-1.5">
                  <Sparkles size={13} /> Get started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;