"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, ChevronDown, ChevronUp } from "lucide-react";
import type { Lang } from "../../lib/i18n";
import type { AgeBandKey } from "../../lib/prefs";
import { tt } from "../../lib/i18n-teen";
import { RIGHTS, ESCALATION_STEPS } from "../../data/rights";

const COLOR_CYCLE = ["bg-emerald-50", "bg-indigo-50", "bg-amber-50", "bg-rose-50", "bg-cyan-50"];
const TEXT_CYCLE = ["text-emerald-700", "text-indigo-700", "text-amber-700", "text-rose-700", "text-cyan-700"];

interface RightsTeenProps {
  lang: Lang;
  band: AgeBandKey;
}

export function RightsTeen({ lang, band }: RightsTeenProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="max-w-[1100px] mx-auto px-6 sm:px-12 py-10 sm:py-20 space-y-16">
      {/* Hero */}
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600 mb-4">{tt("rights.hero.tag", lang)}</p>
        <h1 className="text-4xl sm:text-6xl font-black text-[#1e293b] mb-4 tracking-[-0.05em] leading-[0.95]">{tt("rights.hero.title", lang)}</h1>
        <p className="text-slate-500 text-lg font-bold max-w-2xl leading-relaxed mb-6">{tt("rights.hero.subtitle", lang)}</p>
        <span className="inline-block rounded-full bg-[#1a2f44] text-white font-black text-[11px] uppercase tracking-[0.2em] px-4 py-2">
          {tt("rights.citation", lang)}
        </span>
      </div>

      {/* Rights */}
      <div className="flex flex-col gap-4">
        {RIGHTS.map((r, idx) => {
          const isOpen = openId === r.id;
          const bg = COLOR_CYCLE[idx % COLOR_CYCLE.length];
          const textColor = TEXT_CYCLE[idx % TEXT_CYCLE.length];
          const tier = r.tiers[band];
          const title = lang === "es" ? r.title_es : r.title;
          const plain = lang === "es" ? tier.plain_es : tier.plain;
          const example = lang === "es" ? tier.example_es : tier.example;
          const howToAsk = lang === "es" ? tier.howToAsk_es : tier.howToAsk;
          const ifIgnored = lang === "es" ? tier.ifIgnored_es : tier.ifIgnored;

          return (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(idx, 12) * 0.04, duration: 0.3 }}
              className={`rounded-[2rem] border border-white shadow-[0_20px_50px_rgba(0,0,0,0.03)] overflow-hidden ${bg}`}
            >
              <button
                type="button"
                onClick={() => setOpenId(isOpen ? null : r.id)}
                className="w-full flex items-center gap-5 px-7 py-5 text-left hover:bg-white/50 transition-colors"
                aria-expanded={isOpen}
              >
                <div className={`w-11 h-11 rounded-2xl bg-white flex items-center justify-center shadow-sm ${textColor}`}>
                  <Shield size={18} strokeWidth={2.5} />
                </div>
                <div className="flex-1">
                  <h3 className={`text-lg font-black tracking-tight ${textColor}`}>{title}</h3>
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mt-1">{r.citation}</p>
                </div>
                {isOpen ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
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
                    <div className="px-7 pb-7 space-y-5">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{tt("rights.label.what", lang)}</p>
                        <p className="text-slate-700 font-medium leading-relaxed whitespace-pre-line">{plain}</p>
                      </div>
                      <div className="rounded-2xl bg-white/70 p-4">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{tt("rights.label.example", lang)}</p>
                        <p className="text-slate-700 font-medium leading-relaxed whitespace-pre-line">{example}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{tt("rights.label.how", lang)}</p>
                        <p className="text-slate-700 font-medium leading-relaxed whitespace-pre-line">{howToAsk}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{tt("rights.label.ignored", lang)}</p>
                        <p className="text-slate-700 font-medium leading-relaxed whitespace-pre-line">{ifIgnored}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Escalation ladder */}
      <section>
        <h2 className="text-3xl font-black tracking-[-0.03em] text-[#1e293b] mb-3">{tt("rights.escalation.heading", lang)}</h2>
        <p className="text-slate-500 font-medium mb-8 max-w-2xl">{tt("rights.escalation.intro", lang)}</p>
        <ol className="flex flex-col gap-3">
          {ESCALATION_STEPS.map((s) => {
            const who = lang === "es" ? s.who_es : s.who;
            const what = lang === "es" ? s.what_es : s.what;
            return (
              <li key={s.step} className="rounded-2xl bg-white border border-slate-100 p-6 flex gap-5 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-[#1a2f44] text-white flex items-center justify-center font-black shrink-0">{s.step}</div>
                <div>
                  <h4 className="font-black text-[#1e293b] text-base mb-1">{who}</h4>
                  <p className="text-slate-600 text-sm font-medium leading-relaxed">{what}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </section>
    </div>
  );
}
