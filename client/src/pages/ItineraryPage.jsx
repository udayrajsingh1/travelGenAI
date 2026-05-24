import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { MapPin, Calendar, Wallet, Users, Clock, Sun, Sunset, Moon,
         Lightbulb, ArrowLeft, Loader2, AlertCircle, IndianRupee,
         Star, Bookmark, Share2 } from "lucide-react";
import api from "../services/api";

/* ── Budget bar ──────────────────────────────────────────────────────── */
const BudgetBar = ({ label, value, total, color }) => {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div>
      <div className="flex justify-between text-xs mb-1.5">
        <span className="text-slate-400">{label}</span>
        <span className="text-white font-medium">₹{value?.toLocaleString()}</span>
      </div>
      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all duration-700`}
          style={{ width:`${pct}%` }} />
      </div>
    </div>
  );
};

/* ── Budget card ─────────────────────────────────────────────────────── */
const BudgetCard = ({ b }) => {
  if (!b) return null;
  return (
    <div className="glass border border-white/[0.07] rounded-2xl p-5">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <IndianRupee size={15} className="text-teal-400" />
          <span className="text-xs font-semibold text-white uppercase tracking-widest">Budget</span>
        </div>
        <div className="text-right">
          <div className="font-display text-2xl text-teal-400">₹{b.total?.toLocaleString()}</div>
          <div className="text-[11px] text-slate-500">{b.currency || "INR"} total</div>
        </div>
      </div>
      <div className="space-y-3">
        <BudgetBar label="🏨 Accommodation" value={b.accommodation} total={b.total} color="bg-teal-500" />
        <BudgetBar label="🍽️ Food"          value={b.food}          total={b.total} color="bg-sky-500" />
        <BudgetBar label="🎯 Activities"    value={b.activities}    total={b.total} color="bg-violet-500" />
        <BudgetBar label="🚌 Transport"     value={b.transport}     total={b.total} color="bg-amber-500" />
      </div>
      {b.notes && <p className="text-[11px] text-slate-500 mt-4 italic leading-relaxed">{b.notes}</p>}
    </div>
  );
};

/* ── Activity card ───────────────────────────────────────────────────── */
const ActivityCard = ({ a }) => (
  <div className="group bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.07] hover:border-teal-500/20 rounded-xl p-4 transition-all duration-200">
    <div className="flex items-start justify-between gap-3 mb-2">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        {a.time && (
          <span className="flex items-center gap-1 text-[11px] text-teal-400 shrink-0 font-medium">
            <Clock size={10} />{a.time}
          </span>
        )}
        <h4 className="text-sm font-semibold text-white leading-snug">{a.name}</h4>
      </div>
      <span className={`text-[11px] shrink-0 px-2 py-0.5 rounded-full font-medium ${
        a.estimatedCost === 0
          ? "text-emerald-400 bg-emerald-950/50 border border-emerald-800/50"
          : "text-slate-400 bg-white/5 border border-white/[0.07]"
      }`}>
        {a.estimatedCost === 0 ? "Free" : `₹${a.estimatedCost}`}
      </span>
    </div>
    <p className="text-xs text-slate-400 leading-relaxed mb-2">{a.description}</p>
    {a.tips && (
      <div className="flex items-start gap-1.5 text-[11px] text-amber-400/80 bg-amber-950/20 border border-amber-900/30 rounded-lg px-2.5 py-2">
        <Lightbulb size={11} className="mt-0.5 shrink-0" />{a.tips}
      </div>
    )}
  </div>
);

/* ── Time slot block ─────────────────────────────────────────────────── */
const TimeSlot = ({ icon: Icon, label, activities, dotColor }) => {
  if (!activities?.length) return null;
  return (
    <div>
      <div className={`flex items-center gap-2 mb-3 ${dotColor}`}>
        <Icon size={14} />
        <span className="text-[11px] font-bold uppercase tracking-widest">{label}</span>
        <span className="text-[11px] opacity-50">({activities.length})</span>
      </div>
      <div className="space-y-2.5 pl-4 border-l border-white/[0.05]">
        {activities.map((a, i) => <ActivityCard key={i} a={a} />)}
      </div>
    </div>
  );
};

/* ── Day card ────────────────────────────────────────────────────────── */
const DayCard = ({ d, isActive }) => (
  <div id={`day-${d.day}`}
    className={`rounded-2xl overflow-hidden border transition-all duration-300 ${
      isActive
        ? "border-teal-500/30 shadow-[0_0_30px_rgba(45,212,191,0.06)]"
        : "border-white/[0.07]"
    } glass`}>
    <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.05]">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 ${
        isActive ? "bg-teal-500 text-slate-950" : "bg-white/5 text-slate-400 border border-white/10"
      }`}>{d.day}</div>
      <div>
        <p className="text-[11px] text-slate-500 uppercase tracking-widest">Day {d.day}</p>
        <h3 className="text-sm font-semibold text-white">{d.theme}</h3>
      </div>
    </div>
    <div className="p-5 space-y-7">
      <TimeSlot icon={Sun}    label="Morning"   activities={d.morning}   dotColor="text-amber-400" />
      <TimeSlot icon={Sunset} label="Afternoon" activities={d.afternoon} dotColor="text-orange-400" />
      <TimeSlot icon={Moon}   label="Evening"   activities={d.evening}   dotColor="text-indigo-400" />
    </div>
  </div>
);

/* ── Main page ───────────────────────────────────────────────────────── */
const ItineraryPage = () => {
  const { id }            = useParams();
  const [trip, setTrip]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeDay, setActiveDay] = useState(1);
  const observerRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(`/trips/${id}`);
        setTrip(data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load trip");
      } finally { setLoading(false); }
    })();
  }, [id]);

  /* Intersection observer to track which day is in view */
  useEffect(() => {
    if (!trip) return;
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActiveDay(Number(e.target.dataset.day)); }),
      { threshold: 0.3 }
    );
    trip.itinerary?.forEach(d => {
      const el = document.getElementById(`day-${d.day}`);
      if (el) { el.dataset.day = d.day; observer.observe(el); }
    });
    observerRef.current = observer;
    return () => observer.disconnect();
  }, [trip]);

  const scrollToDay = (n) => {
    document.getElementById(`day-${n}`)?.scrollIntoView({ behavior:"smooth", block:"start" });
  };

  if (loading) return (
    <div className="min-h-screen mesh-bg flex items-center justify-center">
      <Loader2 size={28} className="animate-spin text-teal-400" />
    </div>
  );

  if (error || !trip) return (
    <div className="min-h-screen mesh-bg flex flex-col items-center justify-center gap-4">
      <AlertCircle size={28} className="text-red-400" />
      <p className="text-red-300 text-sm">{error || "Trip not found"}</p>
      <Link to="/dashboard" className="text-teal-400 text-sm hover:underline">← Dashboard</Link>
    </div>
  );

  return (
    <div className="min-h-screen mesh-bg">
      <div className="max-w-6xl mx-auto px-4 py-10">

        {/* Back */}
        <Link to="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-white mb-6 transition-colors animate-fade-in">
          <ArrowLeft size={14} /> Dashboard
        </Link>

        {/* Hero */}
        <div className="glass border border-white/[0.07] rounded-2xl p-6 mb-6 animate-fade-up">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
            <div className="flex-1">
              <h1 className="font-display text-3xl sm:text-4xl text-white leading-snug mb-2">
                {trip.title}
              </h1>
              <p className="text-slate-400 text-sm leading-relaxed max-w-2xl">{trip.summary}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button className="p-2.5 glass border border-white/[0.07] rounded-xl text-slate-400 hover:text-white transition-colors">
                <Bookmark size={16} />
              </button>
              <button className="p-2.5 glass border border-white/[0.07] rounded-xl text-slate-400 hover:text-white transition-colors">
                <Share2 size={16} />
              </button>
            </div>
          </div>

          {/* Meta pills */}
          <div className="flex flex-wrap gap-2">
            {[
              { icon:MapPin,    val:trip.destination,            color:"text-teal-400"   },
              { icon:Calendar,  val:`${trip.duration} days`,     color:"text-sky-400"    },
              { icon:Wallet,    val:trip.budgetTier,             color:"text-violet-400" },
              { icon:Users,     val:trip.travelers,              color:"text-amber-400"  },
              ...(trip.bestTimeToVisit
                  ? [{ icon:Star, val:`Best: ${trip.bestTimeToVisit}`, color:"text-rose-400" }]
                  : []),
            ].map(({ icon:Icon, val, color }, i) => (
              <span key={i}
                className="flex items-center gap-1.5 text-xs text-slate-300 bg-white/[0.04] border border-white/[0.07] px-3 py-1.5 rounded-full">
                <Icon size={11} className={color} />{val}
              </span>
            ))}
          </div>
        </div>

        {/* Body: 3-col on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr_260px] gap-6">

          {/* ── Left: sticky day nav ─────────────────────────────── */}
          <div className="hidden lg:block">
            <div className="sticky top-20">
              <p className="text-[11px] text-slate-500 uppercase tracking-widest font-medium mb-3 pl-1">Days</p>
              <div className="flex flex-col gap-1">
                {trip.itinerary?.map(d => (
                  <button key={d.day} onClick={() => scrollToDay(d.day)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
                      activeDay === d.day
                        ? "bg-teal-500/15 border border-teal-500/30 text-teal-300"
                        : "text-slate-500 hover:text-slate-300 hover:bg-white/[0.03]"
                    }`}>
                    <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-[11px] font-bold shrink-0 ${
                      activeDay === d.day ? "bg-teal-500 text-slate-950" : "bg-white/5"
                    }`}>{d.day}</span>
                    <span className="text-xs truncate leading-snug">{d.theme}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── Center: day cards ────────────────────────────────── */}
          <div className="space-y-5 stagger">
            {trip.itinerary?.map(d => (
              <div key={d.day} className="animate-fade-up">
                <DayCard d={d} isActive={activeDay === d.day} />
              </div>
            ))}
          </div>

          {/* ── Right: budget + tips ─────────────────────────────── */}
          <div className="space-y-4">
            <div className="lg:sticky lg:top-20 space-y-4">
              <BudgetCard b={trip.budgetBreakdown} />
              {trip.localTips?.length > 0 && (
                <div className="glass border border-white/[0.07] rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Lightbulb size={14} className="text-amber-400" />
                    <span className="text-[11px] font-semibold text-white uppercase tracking-widest">Local Tips</span>
                  </div>
                  <ul className="space-y-3">
                    {trip.localTips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs text-slate-400 leading-relaxed">
                        <span className="w-4 h-4 shrink-0 rounded-full bg-amber-950/60 border border-amber-800/50 flex items-center justify-center text-amber-400 text-[10px] font-bold mt-0.5">
                          {i+1}
                        </span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ItineraryPage;