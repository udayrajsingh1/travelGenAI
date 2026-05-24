import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Wallet, Users, Zap, Heart, UtensilsCrossed,
         Loader2, AlertCircle, Sparkles } from "lucide-react";
import api from "../../services/api";

/* ── Option data ─────────────────────────────────────────────────────── */
const BUDGETS = [
  { value:"budget",   label:"Budget",   emoji:"💸", sub:"Hostels & street food"   },
  { value:"moderate", label:"Moderate", emoji:"✈️",  sub:"3-star hotels & cafes"   },
  { value:"luxury",   label:"Luxury",   emoji:"💎", sub:"5-star & fine dining"    },
];
const TRAVELERS = [
  { value:"solo",   label:"Solo",   emoji:"🧍" },
  { value:"couple", label:"Couple", emoji:"👫" },
  { value:"family", label:"Family", emoji:"👨‍👩‍👧" },
  { value:"group",  label:"Group",  emoji:"👥" },
];
const PACES = [
  { value:"relaxed", label:"Relaxed", sub:"Slow & easy" },
  { value:"active",  label:"Active",  sub:"Balanced"    },
  { value:"packed",  label:"Packed",  sub:"Max it out"  },
];
const INTERESTS = [
  "Adventure","Food & Dining","History & Culture",
  "Nature","Nightlife","Shopping","Art & Museums",
  "Photography","Wellness & Spa","Sports",
];
const DIETARY = [
  "none","vegetarian","vegan","halal","kosher","gluten-free","nut allergy",
];

/* ── UI helpers ─────────────────────────────────────────────────────── */
const Section = ({ icon: Icon, title, children }) => (
  <div className="glass border border-white/[0.07] rounded-2xl p-5">
    <div className="flex items-center gap-2 mb-4">
      <Icon size={14} className="text-teal-400" />
      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">{title}</span>
    </div>
    {children}
  </div>
);

const Opt = ({ selected, onClick, children, full }) => (
  <button type="button" onClick={onClick}
    className={`text-left px-3.5 py-2.5 rounded-xl text-sm font-medium border transition-all duration-150
      ${full ? "w-full" : ""}
      ${selected
        ? "bg-teal-500/20 border-teal-500/60 text-teal-300"
        : "bg-white/[0.03] border-white/[0.07] text-slate-300 hover:bg-white/[0.06] hover:border-white/10"
      }`}>
    {children}
  </button>
);

/* ── Main ────────────────────────────────────────────────────────────── */
const TripForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    destination:"", duration:5,
    budgetTier:"moderate", travelers:"couple",
    travelPace:"active", interests:["Food & Dining","History & Culture"],
    dietaryRestrictions:"none",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const set   = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const toggle = (interest) =>
    setForm(p => ({
      ...p,
      interests: p.interests.includes(interest)
        ? p.interests.filter(i => i !== interest)
        : [...p.interests, interest],
    }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.destination.trim()) return setError("Please enter a destination");
    setError(""); setLoading(true);
    try {
      const { data } = await api.post("/ai/generate", form);
      navigate(`/trips/${data.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Generation failed. Check your API key.");
      setLoading(false);
    }
  };

  /* ── Loading overlay ─────────────────────────────────────────────── */
  if (loading) return (
    <div className="glass border border-white/[0.07] rounded-2xl flex flex-col items-center justify-center py-24 px-8 text-center">
      <div className="relative w-16 h-16 mb-6">
        <div className="absolute inset-0 border-2 border-teal-500/30 rounded-full" />
        <div className="absolute inset-0 border-2 border-teal-400 border-t-transparent rounded-full animate-spin" />
        <div className="absolute inset-3 border-2 border-teal-600 border-b-transparent rounded-full animate-spin" style={{ animationDirection:"reverse", animationDuration:"0.8s" }} />
        <Sparkles size={18} className="absolute inset-0 m-auto text-teal-400" />
      </div>
      <p className="font-display text-xl text-white mb-2">Building your itinerary…</p>
      <p className="text-slate-400 text-sm max-w-xs leading-relaxed">
        Gemini is personalizing a complete plan for <strong className="text-white">{form.destination}</strong>. 
        This usually takes 15–30 seconds.
      </p>
      <div className="mt-6 flex gap-1">
        {[0,1,2].map(i => (
          <div key={i} className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce"
            style={{ animationDelay:`${i*0.15}s` }} />
        ))}
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="flex items-center gap-2 bg-red-950/40 border border-red-800/60 text-red-300 text-sm rounded-xl px-4 py-3">
          <AlertCircle size={15} className="shrink-0" />{error}
        </div>
      )}

      {/* Destination + duration */}
      <Section icon={MapPin} title="Destination & Duration">
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_100px] gap-3">
          <div>
            <label className="block text-xs text-slate-500 mb-1.5">Where to?</label>
            <input type="text" value={form.destination}
              onChange={e => { set("destination", e.target.value); setError(""); }}
              placeholder="e.g. Kyoto, Japan  ·  Bali  ·  New York City"
              className="input-field" required />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1.5">Days</label>
            <input type="number" value={form.duration}
              onChange={e => set("duration", e.target.value)}
              min={1} max={30} className="input-field" />
          </div>
        </div>
      </Section>

      {/* Budget */}
      <Section icon={Wallet} title="Budget Tier">
        <div className="grid grid-cols-3 gap-2.5">
          {BUDGETS.map(({ value, label, emoji, sub }) => (
            <Opt key={value} selected={form.budgetTier === value} onClick={() => set("budgetTier", value)}>
              <div className="text-base mb-0.5">{emoji}</div>
              <div className="font-semibold text-sm">{label}</div>
              <div className={`text-[11px] font-normal mt-0.5 ${form.budgetTier === value ? "text-teal-400/70" : "text-slate-500"}`}>{sub}</div>
            </Opt>
          ))}
        </div>
      </Section>

      {/* Travelers + Pace */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Section icon={Users} title="Traveling As">
          <div className="grid grid-cols-2 gap-2">
            {TRAVELERS.map(({ value, label, emoji }) => (
              <Opt key={value} selected={form.travelers === value} onClick={() => set("travelers", value)}>
                <span className="mr-1.5">{emoji}</span>{label}
              </Opt>
            ))}
          </div>
        </Section>
        <Section icon={Zap} title="Travel Pace">
          <div className="flex flex-col gap-2">
            {PACES.map(({ value, label, sub }) => (
              <Opt key={value} selected={form.travelPace === value} onClick={() => set("travelPace", value)} full>
                <div className="flex items-center justify-between">
                  <span>{label}</span>
                  <span className={`text-[11px] font-normal ${form.travelPace === value ? "text-teal-400/70" : "text-slate-500"}`}>{sub}</span>
                </div>
              </Opt>
            ))}
          </div>
        </Section>
      </div>

      {/* Interests */}
      <Section icon={Heart} title="Interests">
        <div className="flex flex-wrap gap-2">
          {INTERESTS.map(i => (
            <button key={i} type="button" onClick={() => toggle(i)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                form.interests.includes(i)
                  ? "bg-teal-500/20 border-teal-500/60 text-teal-300"
                  : "bg-white/[0.03] border-white/[0.07] text-slate-400 hover:border-white/10 hover:text-slate-300"
              }`}>
              {i}
            </button>
          ))}
        </div>
      </Section>

      {/* Dietary */}
      <Section icon={UtensilsCrossed} title="Dietary Restrictions">
        <select value={form.dietaryRestrictions} onChange={e => set("dietaryRestrictions", e.target.value)}
          className="input-field">
          {DIETARY.map(d => (
            <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>
          ))}
        </select>
      </Section>

      {/* Submit */}
      <button type="submit"
        className="btn-teal w-full py-4 text-sm flex items-center justify-center gap-2 rounded-2xl">
        <Sparkles size={16} />
        Generate My Itinerary
      </button>
    </form>
  );
};

export default TripForm;