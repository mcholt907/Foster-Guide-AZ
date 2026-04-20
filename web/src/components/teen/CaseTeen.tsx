"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck, Scale, Calendar, Zap, ChevronDown, ChevronUp,
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

const COLOR_BG: Record<TeenColorTheme, string> = {
  emerald: "bg-emerald-50", indigo: "bg-indigo-50", blue: "bg-blue-50",
  rose: "bg-rose-50",       amber: "bg-amber-50",   cyan: "bg-cyan-50",   slate: "bg-slate-50",
};
const COLOR_TEXT: Record<TeenColorTheme, string> = {
  emerald: "text-emerald-700", indigo: "text-indigo-700", blue: "text-blue-700",
  rose: "text-rose-700",       amber: "text-amber-700",   cyan: "text-cyan-700",   slate: "text-slate-700",
};

interface CaseTeenProps {
  lang: Lang;
  band: AgeBandKey;
}

export function CaseTeen({ lang, band }: CaseTeenProps) {
  const [openStage, setOpenStage] = useState<string | null>(null);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const teenBand = (band === "10-12" ? "13-15" : band) as "13-15" | "16-17" | "18-21";

  return (
    <div className="max-w-[1100px] mx-auto px-6 sm:px-12 py-10 sm:py-20">
      {/* Hero */}
      <div className="mb-14">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600 mb-4">
          {tt("case.hero.tag", lang)}
        </p>
        <h1 className="text-4xl sm:text-6xl font-black text-[#1e293b] mb-4 tracking-[-0.05em] leading-[0.95]">
          {tt("case.hero.title", lang)}
        </h1>
        <p className="text-slate-500 text-lg font-bold max-w-2xl leading-relaxed">
          {tt("case.hero.subtitle", lang)}
        </p>
      </div>

      {/* Stages */}
      <div className="flex flex-col gap-5 mb-20">
        {CASE_STAGES_TEEN.map((stage, idx) => {
          const isOpen = openStage === stage.id;
          const Icon = STAGE_ICONS[stage.id] ?? ShieldCheck;
          const bg = COLOR_BG[stage.color];
          const textColor = COLOR_TEXT[stage.color];

          return (
            <motion.div
              key={stage.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06, duration: 0.35 }}
              className={`rounded-[2rem] border border-white shadow-[0_20px_50px_rgba(0,0,0,0.03)] overflow-hidden ${bg}`}
            >
              <button
                type="button"
                onClick={() => setOpenStage(isOpen ? null : stage.id)}
                className="w-full flex items-center gap-6 px-8 py-6 text-left hover:bg-white/50 transition-colors"
                aria-expanded={isOpen}
              >
                <div className={`w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-sm ${textColor}`}>
                  <Icon size={24} strokeWidth={2.5} />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stage.subtitle[lang]}</p>
                  <h3 className={`text-2xl font-black tracking-tight ${textColor}`}>{stage.title[lang]}</h3>
                </div>
                {isOpen ? <ChevronUp size={22} className="text-slate-400" /> : <ChevronDown size={22} className="text-slate-400" />}
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-8 pb-8 space-y-5">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{tt("case.label.what", lang)}</p>
                        <p className="text-slate-700 font-medium leading-relaxed">{stage.what[lang]}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{tt("case.label.teen", lang)}</p>
                        <p className="text-slate-700 font-medium leading-relaxed">{stage.teen[teenBand][lang]}</p>
                      </div>
                      <div className="rounded-2xl bg-white/70 p-5 border border-white">
                        <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-1">{tt("case.label.insight", lang)}</p>
                        <p className="text-slate-700 font-semibold leading-relaxed">{stage.insight[teenBand][lang]}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{tt("case.label.next", lang)}</p>
                        <p className="text-slate-700 font-medium leading-relaxed">{stage.next[lang]}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* FAQs */}
      <h2 className="text-3xl font-black tracking-[-0.03em] text-[#1e293b] mb-6">{tt("case.faqs.heading", lang)}</h2>
      <div className="flex flex-col gap-3">
        {CASE_FAQS_TEEN.map((faq, i) => {
          const isOpen = openFAQ === i;
          return (
            <div key={i} className="rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden">
              <button
                type="button"
                onClick={() => setOpenFAQ(isOpen ? null : i)}
                className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-slate-50 transition-colors"
                aria-expanded={isOpen}
              >
                <span className="font-black text-[#1e293b] text-base">{faq.q[lang]}</span>
                {isOpen ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 text-slate-700 font-medium leading-relaxed">{faq.a[lang]}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
