import { Link } from "react-router-dom";
import { Globe, Sparkles, Map, Shield, ArrowRight, Star, Zap, Clock } from "lucide-react";
import useAuth from "../hooks/useAuth";

/* ── Floating destination pill ─────────────────────────────────────────── */
const Pill = ({ label, emoji, style }) => (
  <div className="glass rounded-full px-3 py-1.5 text-xs font-medium text-slate-300 flex items-center gap-1.5 animate-float" style={style}>
    <span>{emoji}</span>{label}
  </div>
);

/* ── Feature card ───────────────────────────────────────────────────────── */
const FeatureCard = ({ icon: Icon, color, title, desc, delay }) => (
  <div className="animate-fade-up group relative bg-slate-900/60 border border-white/[0.07] rounded-2xl p-6 card-hover overflow-hidden"
    style={{ animationDelay: delay }}>
    {/* Subtle corner glow */}
    <div className={`absolute -top-6 -right-6 w-20 h-20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${color}`} />
    <div className={`relative w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${color} bg-opacity-10`}>
      <Icon size={20} className="text-current" />
    </div>
    <h3 className="font-semibold text-white mb-2 text-sm">{title}</h3>
    <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
  </div>
);

/* ── Stat ───────────────────────────────────────────────────────────────── */
const Stat = ({ value, label }) => (
  <div className="text-center">
    <div className="font-display text-3xl text-white mb-1">{value}</div>
    <div className="text-xs text-slate-500 uppercase tracking-widest">{label}</div>
  </div>
);

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="mesh-bg min-h-screen">

      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section className="relative flex flex-col items-center text-center px-4 pt-20 pb-16 overflow-hidden">

        {/* Grid overlay */}
        <div className="pointer-events-none absolute inset-0"
          style={{ backgroundImage:"linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px)", backgroundSize:"4rem 4rem" }} />

        {/* Floating pills — purely decorative */}
        <div className="pointer-events-none hidden lg:block">
          <div className="absolute top-24 left-[8%]"><Pill emoji="🗼" label="Paris"    style={{ animationDelay:"0s"    }} /></div>
          <div className="absolute top-40 left-[4%]"><Pill emoji="🏯" label="Kyoto"    style={{ animationDelay:"0.5s"  }} /></div>
          <div className="absolute top-24 right-[8%]"><Pill emoji="🏝️" label="Bali"   style={{ animationDelay:"1s"    }} /></div>
          <div className="absolute top-44 right-[5%]"><Pill emoji="🌆" label="NYC"     style={{ animationDelay:"1.5s"  }} /></div>
          <div className="absolute top-64 left-[10%]"><Pill emoji="🦁" label="Safari"  style={{ animationDelay:"0.8s"  }} /></div>
          <div className="absolute top-64 right-[10%]"><Pill emoji="🗽" label="Dubai"   style={{ animationDelay:"0.3s"  }} /></div>
        </div>

        {/* Badge */}
        <div className="animate-fade-up inline-flex items-center gap-2 glass text-teal-300 text-xs font-medium px-4 py-2 rounded-full mb-7 border border-teal-500/20">
          <Sparkles size={12} className="text-teal-400" />
          Powered by Google Gemini 2.0 Flash
          <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-pulse" />
        </div>

        {/* Headline */}
        <h1 className="animate-fade-up font-display text-5xl sm:text-6xl lg:text-7xl text-white leading-[1.1] max-w-4xl mb-6"
          style={{ animationDelay: "0.1s" }}>
          Your perfect trip,<br />
          <span className="text-shimmer italic">designed by AI</span>
        </h1>

        <p className="animate-fade-up text-slate-400 text-lg max-w-xl leading-relaxed mb-10"
          style={{ animationDelay: "0.2s" }}>
          Describe your dream destination. TravelGen AI crafts a complete, 
          day-by-day itinerary — activities, dining, budget — in seconds.
        </p>

        {/* CTAs */}
        <div className="animate-fade-up flex flex-wrap items-center justify-center gap-3"
          style={{ animationDelay: "0.3s" }}>
          <Link to={isAuthenticated ? "/planner" : "/signup"}
            className="btn-teal inline-flex items-center gap-2 px-6 py-3 text-sm">
            {isAuthenticated ? "Plan a new trip" : "Start for free"}
            <ArrowRight size={15} />
          </Link>
          {!isAuthenticated && (
            <Link to="/login"
              className="text-sm text-slate-400 hover:text-white px-6 py-3 rounded-xl border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all">
              Log in
            </Link>
          )}
        </div>

        {/* Stats row */}
        <div className="animate-fade-up mt-16 flex items-center justify-center gap-10 sm:gap-16 flex-wrap"
          style={{ animationDelay: "0.4s" }}>
          <Stat value="150+" label="Destinations" />
          <div className="w-px h-8 bg-white/10" />
          <Stat value="30s"  label="Generation time" />
          <div className="w-px h-8 bg-white/10" />
          <Stat value="100%" label="Personalized" />
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 pb-10">
        <div className="divider mb-14" />

        <div className="text-center mb-10 animate-fade-up">
          <p className="text-xs text-teal-400 uppercase tracking-widest font-medium mb-3">Why TravelGen</p>
          <h2 className="font-display text-3xl text-white">Everything a travel planner does,<br />
            <span className="text-slate-400 italic">in seconds</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 stagger">
          <FeatureCard icon={Sparkles} color="text-teal-400 bg-teal-400"
            title="AI-Crafted Itineraries"
            desc="Gemini Pro generates a full day-by-day plan tailored to your budget, pace, and interests."
            delay="0s" />
          <FeatureCard icon={Map} color="text-sky-400 bg-sky-400"
            title="Morning to Evening"
            desc="Every day is broken into morning, afternoon, and evening activities with time estimates and costs."
            delay="0.1s" />
          <FeatureCard icon={Shield} color="text-violet-400 bg-violet-400"
            title="Saved Forever"
            desc="All generated trips are saved to your profile. View, revisit, and delete them any time."
            delay="0.2s" />
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 pb-24">
        <div className="divider mb-14" />

        <div className="text-center mb-10">
          <p className="text-xs text-teal-400 uppercase tracking-widest font-medium mb-3">How it works</p>
          <h2 className="font-display text-3xl text-white">Three steps to your perfect trip</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 stagger">
          {[
            { icon: Globe,    num:"01", title:"Pick a destination", desc:"Enter where you want to go and how many days you have."  },
            { icon: Zap,      num:"02", title:"Set your preferences", desc:"Choose your budget, pace, interests, and who you're traveling with." },
            { icon: Clock,    num:"03", title:"Get your itinerary", desc:"AI builds a complete plan with activities, food, and budget in ~30 seconds." },
          ].map(({ icon: Icon, num, title, desc }) => (
            <div key={num} className="animate-fade-up flex flex-col items-center text-center">
              <div className="relative mb-4">
                <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center">
                  <Icon size={22} className="text-teal-400" />
                </div>
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-teal-500 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-950">
                  {num.slice(1)}
                </span>
              </div>
              <h3 className="font-semibold text-white text-sm mb-1">{title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* Final CTA */}
        <div className="text-center mt-14">
          <Link to={isAuthenticated ? "/planner" : "/signup"}
            className="btn-teal inline-flex items-center gap-2 px-8 py-3.5 text-sm">
            <Sparkles size={15} />
            {isAuthenticated ? "Plan a trip now" : "Create free account"}
          </Link>
        </div>
      </section>

    </div>
  );
};

export default HomePage;