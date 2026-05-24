import { Sparkles, Globe } from "lucide-react";
import TripForm from "../components/planner/TripForm";

const PlannerPage = () => (
  <div className="min-h-screen mesh-bg px-4 py-12">
    <div className="max-w-6xl mx-auto">

      {/* Header */}
      <div className="text-center mb-10 animate-fade-up">
        <div className="inline-flex items-center gap-2 glass border border-teal-500/20 text-teal-300 text-xs px-4 py-2 rounded-full mb-5">
          <Sparkles size={12} className="text-teal-400" />
          AI Itinerary Generator
          <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-pulse" />
        </div>
        <h1 className="font-display text-4xl sm:text-5xl text-white mb-3">
          Where are you headed?
        </h1>
        <p className="text-slate-400 text-base max-w-lg mx-auto">
          Fill in your preferences — Gemini AI will build a complete itinerary tailored to you.
        </p>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        {/* Form */}
        <div className="animate-fade-up" style={{ animationDelay:"0.1s" }}>
          <TripForm />
        </div>

        {/* Sidebar hint card */}
        <div className="hidden lg:flex flex-col gap-4 animate-fade-up" style={{ animationDelay:"0.2s" }}>
          <div className="glass border border-white/[0.07] rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Globe size={15} className="text-teal-400" />
              <span className="text-xs font-semibold text-white uppercase tracking-widest">What you'll get</span>
            </div>
            {[
              { emoji:"🗓️", label:"Day-by-day plan",        desc:"Morning, afternoon & evening" },
              { emoji:"💰", label:"Budget breakdown",       desc:"Per category cost estimate"   },
              { emoji:"🍽️", label:"Food recommendations",  desc:"Tailored to your diet"        },
              { emoji:"💡", label:"Local insider tips",     desc:"5 practical destination tips" },
              { emoji:"⏱️", label:"Time estimates",        desc:"For each activity"            },
            ].map(({ emoji, label, desc }) => (
              <div key={label} className="flex items-center gap-3 py-2.5 border-b border-white/[0.04] last:border-0">
                <span className="text-base">{emoji}</span>
                <div>
                  <p className="text-xs font-medium text-white">{label}</p>
                  <p className="text-xs text-slate-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Generation time note */}
          <div className="glass border border-amber-500/20 rounded-2xl p-4">
            <p className="text-xs text-amber-400 font-medium mb-1">⏳ Generation takes ~30 seconds</p>
            <p className="text-xs text-slate-400 leading-relaxed">
              Gemini is building a fully personalized plan. Don't close or refresh the page.
            </p>
          </div>
        </div>
      </div>

    </div>
  </div>
);

export default PlannerPage;