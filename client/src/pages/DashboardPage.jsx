import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MapPin, Calendar, Wallet, Users, Trash2, Heart,
         Plus, Loader2, AlertCircle, Globe, Sparkles, ArrowRight } from "lucide-react";
import api from "../services/api";
import useAuth from "../hooks/useAuth";

/* ── Skeleton loader card ─────────────────────────────────────────────── */
const SkeletonCard = () => (
  <div className="bg-slate-900/60 border border-white/[0.06] rounded-2xl p-5 animate-pulse">
    <div className="h-4 bg-slate-800 rounded w-3/4 mb-2" />
    <div className="h-3 bg-slate-800 rounded w-1/2 mb-4" />
    <div className="flex gap-2 mb-4">
      <div className="h-6 w-16 bg-slate-800 rounded-full" />
      <div className="h-6 w-12 bg-slate-800 rounded-full" />
    </div>
    <div className="h-px bg-slate-800 mb-3" />
    <div className="flex justify-between">
      <div className="h-3 w-20 bg-slate-800 rounded" />
      <div className="h-3 w-16 bg-slate-800 rounded" />
    </div>
  </div>
);

/* ── Budget tier badge ────────────────────────────────────────────────── */
const BUDGET_STYLES = {
  budget:   "text-emerald-400 bg-emerald-950/50 border-emerald-800/60",
  moderate: "text-amber-400   bg-amber-950/50   border-amber-800/60",
  luxury:   "text-violet-400  bg-violet-950/50  border-violet-800/60",
};

/* ── Trip card ────────────────────────────────────────────────────────── */
const TripCard = ({ trip, onDelete, onFavorite }) => {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Delete "${trip.title || trip.destination}"?`)) return;
    setDeleting(true);
    await onDelete(trip._id);
  };

  return (
    <div className="group bg-slate-900/60 border border-white/[0.07] rounded-2xl p-5 card-hover animate-fade-up flex flex-col">
      {/* Top */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white text-sm leading-snug line-clamp-2 mb-1">
            {trip.title || `${trip.destination} Trip`}
          </h3>
          <div className="flex items-center gap-1 text-slate-500 text-xs">
            <MapPin size={11} />
            <span className="truncate">{trip.destination}</span>
          </div>
        </div>
        <button onClick={() => onFavorite(trip._id)}
          className={`shrink-0 p-1.5 rounded-lg transition-all ${
            trip.isFavorited ? "text-red-400 bg-red-950/30" : "text-slate-700 hover:text-red-400 hover:bg-red-950/20"
          }`}>
          <Heart size={14} fill={trip.isFavorited ? "currentColor" : "none"} />
        </button>
      </div>

      {/* Pills */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        <span className={`text-[11px] px-2.5 py-1 rounded-full border font-medium ${BUDGET_STYLES[trip.budgetTier] || "text-slate-400 bg-slate-800 border-slate-700"}`}>
          {trip.budgetTier}
        </span>
        <span className="text-[11px] px-2.5 py-1 rounded-full border border-white/10 text-slate-400 bg-white/5 flex items-center gap-1">
          <Calendar size={10} />{trip.duration}d
        </span>
        <span className="text-[11px] px-2.5 py-1 rounded-full border border-white/10 text-slate-400 bg-white/5 flex items-center gap-1">
          <Users size={10} />{trip.travelers}
        </span>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Footer */}
      <div className="divider mb-3" />
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-slate-600">
          {new Date(trip.createdAt).toLocaleDateString("en-US", { month:"short", day:"numeric", year:"numeric" })}
        </span>
        <div className="flex items-center gap-1">
          <Link to={`/trips/${trip._id}`}
            className="inline-flex items-center gap-1 text-xs text-teal-400 hover:text-teal-300 px-2.5 py-1 rounded-lg hover:bg-teal-950/30 transition-all font-medium">
            View <ArrowRight size={11} />
          </Link>
          <button onClick={handleDelete} disabled={deleting}
            className="p-1.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-950/20 transition-all disabled:opacity-40">
            {deleting ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── Empty state ─────────────────────────────────────────────────────── */
const EmptyState = () => (
  <div className="col-span-full flex flex-col items-center justify-center py-24 text-center animate-fade-up">
    <div className="relative mb-6">
      <div className="w-20 h-20 bg-slate-900 border border-white/10 rounded-2xl flex items-center justify-center animate-float">
        <Globe size={36} className="text-slate-700" />
      </div>
      <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-teal-500 rounded-lg flex items-center justify-center">
        <Plus size={14} className="text-slate-950" />
      </div>
    </div>
    <h3 className="font-display text-xl text-white mb-2">No trips yet</h3>
    <p className="text-slate-400 text-sm mb-6 max-w-xs">
      Generate your first AI-powered itinerary — it takes less than 30 seconds.
    </p>
    <Link to="/planner"
      className="btn-teal inline-flex items-center gap-2 px-5 py-2.5 text-sm">
      <Sparkles size={14} /> Plan your first trip
    </Link>
  </div>
);

/* ── Main ────────────────────────────────────────────────────────────── */
const DashboardPage = () => {
  const { user }                    = useAuth();
  const [trips, setTrips]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");
  const [filter, setFilter]         = useState("all"); // "all" | "favorited"

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/trips");
        setTrips(data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load trips");
      } finally { setLoading(false); }
    })();
  }, []);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/trips/${id}`);
      setTrips(p => p.filter(t => t._id !== id));
    } catch (err) { alert(err.response?.data?.message || "Delete failed"); }
  };

  const handleFavorite = async (id) => {
    setTrips(p => p.map(t => t._id === id ? { ...t, isFavorited: !t.isFavorited } : t));
    try { await api.put(`/trips/${id}/favorite`); }
    catch { setTrips(p => p.map(t => t._id === id ? { ...t, isFavorited: !t.isFavorited } : t)); }
  };

  const visible = filter === "favorited" ? trips.filter(t => t.isFavorited) : trips;
  const hour    = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="min-h-screen mesh-bg px-4 py-10">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 animate-fade-up">
          <div>
            <p className="text-xs text-teal-400 uppercase tracking-widest font-medium mb-1">{greeting}</p>
            <h1 className="font-display text-3xl text-white">
              {user?.name?.split(" ")[0]}'s trips
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              {trips.length} saved {trips.length === 1 ? "itinerary" : "itineraries"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Filter tabs */}
            <div className="flex glass border border-white/[0.07] rounded-xl p-1 gap-1">
              {["all","favorited"].map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${
                    filter === f ? "bg-teal-500 text-slate-950" : "text-slate-400 hover:text-white"
                  }`}>
                  {f}
                </button>
              ))}
            </div>
            <Link to="/planner"
              className="btn-teal inline-flex items-center gap-1.5 px-4 py-2 text-sm">
              <Plus size={14} /> New trip
            </Link>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 text-red-300 bg-red-950/30 border border-red-800/50 rounded-xl px-5 py-4 mb-6">
            <AlertCircle size={16} />{error}
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            : visible.length === 0
              ? <EmptyState />
              : visible.map(trip => (
                  <TripCard key={trip._id} trip={trip}
                    onDelete={handleDelete} onFavorite={handleFavorite} />
                ))
          }
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;