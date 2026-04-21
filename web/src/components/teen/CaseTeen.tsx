"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  ShieldCheck, Scale, Calendar, Zap, Info, ArrowRight, Clock,
  ChevronDown, ChevronUp,
} from "lucide-react";
import type { Lang } from "../../lib/i18n";
import type { AgeBandKey } from "../../lib/prefs";
import { tt } from "../../lib/i18n-teen";
import { CASE_STAGES_TEEN, CASE_FAQS_TEEN, type TeenColorTheme } from "../../data/court";

const STAGE_ICONS: Record<string, typeof ShieldCheck> = {
  prelim: ShieldCheck,
  adjudication: Scale,
  review: Calendar,
  permanency: Zap,
};

type Theme = { primary: string; light: string; accent: string; shadow: string };

const THEMES: Record<TeenColorTheme, Theme> = {
  emerald: { primary: "#115e59", light: "rgba(209, 250, 229, 0.4)", accent: "#34d399", shadow: "rgba(17, 94, 89, 0.15)" },
  indigo:  { primary: "#4338ca", light: "rgba(238, 242, 255, 0.5)", accent: "#818cf8", shadow: "rgba(67, 56, 202, 0.15)" },
  blue:    { primary: "#1d4ed8", light: "rgba(239, 246, 255, 0.5)", accent: "#60a5fa", shadow: "rgba(29, 78, 216, 0.15)" },
  rose:    { primary: "#be123c", light: "rgba(255, 241, 242, 0.5)", accent: "#fb7185", shadow: "rgba(190, 18, 60, 0.15)" },
  amber:   { primary: "#b45309", light: "rgba(255, 251, 235, 0.5)", accent: "#fbbf24", shadow: "rgba(180, 83, 9, 0.15)" },
  cyan:    { primary: "#0891b2", light: "rgba(236, 254, 255, 0.5)", accent: "#22d3ee", shadow: "rgba(8, 145, 178, 0.15)" },
  slate:   { primary: "#334155", light: "rgba(248, 250, 252, 0.6)", accent: "#94a3b8", shadow: "rgba(51, 65, 85, 0.15)" },
};

interface CaseTeenProps {
  lang: Lang;
  band: AgeBandKey;
}

export function CaseTeen({ lang, band }: CaseTeenProps) {
  const [openId, setOpenId] = useState<string>(CASE_STAGES_TEEN[0].id);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const teenBand = (band === "10-12" ? "13-15" : band) as "13-15" | "16-17" | "18-21";
  const reduce = useReducedMotion();

  const active = CASE_STAGES_TEEN.find((s) => s.id === openId) ?? CASE_STAGES_TEEN[0];
  const theme = THEMES[active.color];
  const ActiveIcon = STAGE_ICONS[active.id] ?? ShieldCheck;

  return (
    <div className="max-w-[1240px] mx-auto px-6 sm:px-12 py-10 sm:py-20">
      {/* Hero */}
      <div className="mb-14 md:mb-20">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600 mb-4">
          {tt("case.hero.tag", lang)}
        </p>
        <h1 className="text-4xl sm:text-6xl font-black text-[#1e293b] mb-6 tracking-[-0.05em] leading-[0.9]">
          {tt("case.hero.title", lang)}
        </h1>
        <p className="text-slate-500 text-lg sm:text-xl font-medium max-w-2xl leading-[1.6] tracking-tight border-l-[3px] border-slate-200 pl-8">
          {tt("case.hero.subtitle", lang)}
        </p>
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-12">
        {/* Stage nav */}
        <div className="lg:col-span-4 space-y-3 -mx-6 px-6 md:mx-0 md:px-0 flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible pb-6 md:pb-0 snap-x">
          {CASE_STAGES_TEEN.map((stage, idx) => {
            const isActive = openId === stage.id;
            const st = THEMES[stage.color];
            const Icon = STAGE_ICONS[stage.id] ?? ShieldCheck;
            const stageNum = String(idx + 1).padStart(2, "0");
            return (
              <motion.button
                key={stage.id}
                type="button"
                onClick={() => setOpenId(stage.id)}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: reduce ? 0 : idx * 0.05, duration: reduce ? 0 : 0.3 }}
                className={`snap-center flex-shrink-0 w-[260px] lg:w-full flex items-center gap-5 p-5 rounded-[1.5rem] transition-all duration-300 text-left border-2 group ${
                  isActive
                    ? "bg-white shadow-[0_12px_44px_rgba(0,0,0,0.04)] z-10"
                    : "bg-transparent border-transparent text-slate-400 hover:bg-white/60"
                }`}
                style={isActive ? { borderColor: `${st.primary}15` } : {}}
              >
                <div
                  className="w-11 h-11 rounded-[1.1rem] flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105"
                  style={{
                    backgroundColor: isActive ? st.primary : "rgba(241, 245, 249, 0.8)",
                    color: isActive ? "white" : "currentColor",
                    boxShadow: isActive ? `0 8px 16px ${st.shadow}` : undefined,
                  }}
                >
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-0.5">
                    {lang === "es" ? "Etapa" : "Stage"} {stageNum}
                  </span>
                  <span className={`text-[15.5px] font-black tracking-tight leading-none ${isActive ? "text-slate-900" : ""}`}>
                    {stage.title[lang]}
                  </span>
                </div>
                {isActive && (
                  <motion.div layoutId="case-arrow" className="ml-auto hidden lg:block">
                    <ArrowRight size={18} style={{ color: st.accent }} />
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Stage detail card */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={openId}
              initial={{ opacity: 0, scale: 0.98, x: 10 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.98, x: -10 }}
              transition={{ duration: reduce ? 0 : 0.35 }}
              className="bg-white rounded-[2.5rem] sm:rounded-[3.5rem] p-8 sm:p-14 border border-white relative overflow-hidden min-h-[600px]"
              style={{ boxShadow: `0 32px 80px ${theme.shadow.replace("0.15", "0.08")}` }}
            >
              <div
                className="absolute left-0 top-0 bottom-0 w-[6px] rounded-r-full"
                style={{ background: `linear-gradient(to bottom, ${theme.accent}, ${theme.primary})` }}
              />
              <div
                className="absolute top-0 right-0 w-80 h-80 rounded-bl-full pointer-events-none opacity-20"
                style={{ backgroundColor: theme.light }}
              />

              <div className="relative z-10">
                <h2 className="text-3xl sm:text-4xl font-black text-[#1e293b] mb-2 tracking-tighter">
                  {active.title[lang]}
                </h2>
                <p className="text-slate-400 text-[11px] font-bold uppercase tracking-[0.2em] mb-12">
                  {active.subtitle[lang]}
                </p>

                <div className="space-y-12">
                  {/* What */}
                  <div className="flex gap-6 items-start">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-slate-100 bg-white shadow-sm"
                      style={{ color: theme.primary }}
                    >
                      <Info size={20} />
                    </div>
                    <div>
                      <h4 className="text-[12px] font-black uppercase tracking-widest text-slate-400 mb-2">
                        {tt("case.label.what", lang)}
                      </h4>
                      <p className="text-[#1e293b] text-base sm:text-lg font-medium leading-[1.8] tracking-tight max-w-2xl">
                        {active.what[lang]}
                      </p>
                    </div>
                  </div>

                  {/* Teen perspective */}
                  <div className="flex gap-6 items-start">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-slate-100 bg-white shadow-sm text-amber-500">
                      <Zap size={20} />
                    </div>
                    <div>
                      <h4 className="text-[12px] font-black uppercase tracking-widest text-[#b45309] opacity-70 mb-2">
                        {tt("case.label.teen", lang)}
                      </h4>
                      <p className="text-[#334155] text-base sm:text-lg font-medium leading-[1.8] tracking-tight max-w-2xl">
                        {active.teen[teenBand][lang]}
                      </p>
                    </div>
                  </div>

                  {/* Insight */}
                  <div
                    className="p-8 rounded-[2rem] border relative overflow-hidden"
                    style={{ backgroundColor: theme.light, borderColor: `${theme.primary}10` }}
                  >
                    <div className="flex gap-5 items-start relative z-10">
                      <div
                        className="mt-1 w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-white"
                        style={{ color: theme.primary }}
                      >
                        <ArrowRight size={18} strokeWidth={3} />
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-[0.25em] mb-2 block opacity-70" style={{ color: theme.primary }}>
                          {tt("case.label.insight", lang)}
                        </span>
                        <p className="text-base sm:text-lg font-black leading-tight tracking-tight" style={{ color: theme.primary }}>
                          {active.insight[teenBand][lang]}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Next */}
                  <div className="pt-10 border-t border-slate-50 flex items-center gap-4 text-slate-400 font-bold text-xs uppercase tracking-widest">
                    <Clock size={16} /> {tt("case.label.next", lang)}: {active.next[lang]}
                  </div>
                </div>

                {/* Decorative active-icon (screen-readers ignore) */}
                <div className="absolute top-8 right-8 opacity-10 pointer-events-none hidden sm:block" aria-hidden>
                  <ActiveIcon size={120} style={{ color: theme.primary }} />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* FAQs */}
      <section className="mt-24 sm:mt-40 max-w-3xl mx-auto py-20 border-t border-slate-100">
        <div className="text-center mb-16">
          <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mb-8" />
          <h2 className="text-3xl sm:text-4xl font-black text-[#1e293b] tracking-tight mb-4">
            {tt("case.faqs.heading", lang)}
          </h2>
        </div>

        <div className="space-y-4">
          {CASE_FAQS_TEEN.map((faq, idx) => {
            const isOpen = openFAQ === idx;
            return (
              <div
                key={idx}
                className={`transition-all duration-300 rounded-[1.75rem] border ${
                  isOpen
                    ? "bg-white shadow-[0_20px_48px_rgba(0,0,0,0.03)] border-slate-200"
                    : "bg-transparent border-transparent hover:bg-slate-50"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenFAQ(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between px-8 py-6 text-left"
                  aria-expanded={isOpen}
                >
                  <span className={`text-[17px] font-black pr-6 tracking-tight leading-tight ${isOpen ? "text-slate-900" : "text-slate-500"}`}>
                    {faq.q[lang]}
                  </span>
                  <div className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center ${
                    isOpen ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-400"
                  }`}>
                    {isOpen ? <ChevronUp size={16} strokeWidth={3} /> : <ChevronDown size={16} strokeWidth={3} />}
                  </div>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-8 pb-8 pt-2">
                        <p className="text-slate-500 text-base leading-relaxed tracking-tight font-medium">
                          {faq.a[lang]}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
