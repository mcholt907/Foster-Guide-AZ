"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { Lang } from "../../lib/i18n";
import type { AgeBandKey } from "../../lib/prefs";
import { tt } from "../../lib/i18n-teen";
import { WHO_IN_YOUR_CASE } from "../../data/court";

const ROLE_BG: Record<string, string> = {
  "#2A7F8E": "bg-emerald-50",
  "#1B3A5C": "bg-indigo-50",
  "#D97706": "bg-amber-50",
};

const ROLE_ACCENT: Record<string, string> = {
  "#2A7F8E": "text-emerald-700",
  "#1B3A5C": "text-indigo-700",
  "#D97706": "text-amber-700",
};

interface TeamTeenProps {
  lang: Lang;
  band: AgeBandKey;
}

export function TeamTeen({ lang, band }: TeamTeenProps) {
  const [openId, setOpenId] = useState<string | null>(null);
  const reduce = useReducedMotion();

  return (
    <div className="max-w-[1100px] mx-auto px-6 sm:px-12 py-10 sm:py-20">
      <div className="mb-12">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600 mb-4">
          {tt("team.hero.tag", lang)}
        </p>
        <h1 className="text-4xl sm:text-6xl font-black text-[#1e293b] mb-4 tracking-[-0.05em] leading-[0.95]">
          {tt("team.hero.title", lang)}
        </h1>
        <p className="text-slate-500 text-lg font-bold max-w-2xl leading-relaxed">
          {tt("team.hero.subtitle", lang)}
        </p>
      </div>

      <div className="flex flex-col gap-5">
        {WHO_IN_YOUR_CASE.map((member, idx) => {
          const isOpen = openId === member.id;
          const bgClass = ROLE_BG[member.color] ?? "bg-slate-50";
          const accentClass = ROLE_ACCENT[member.color] ?? "text-slate-700";
          const title = lang === "es" ? (member.title_es ?? member.title) : member.title;
          const role  = lang === "es" ? (member.role_es  ?? member.role)  : member.role;
          const what  = lang === "es" ? (member.what_es  ?? member.what)  : member.what;
          const tip   = lang === "es" ? (member.tip_es   ?? member.tip)   : member.tip;
          const teenTip = band === "10-12" ? undefined : member.teen_tips?.[band]?.[lang];

          return (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: reduce ? 0 : idx * 0.05, duration: reduce ? 0 : 0.35 }}
              className={`rounded-[2rem] border border-white shadow-[0_20px_50px_rgba(0,0,0,0.03)] overflow-hidden ${bgClass}`}
            >
              <button
                type="button"
                onClick={() => setOpenId(isOpen ? null : member.id)}
                className="w-full flex items-center justify-between px-8 py-6 text-left hover:bg-white/50 transition-colors"
                aria-expanded={isOpen}
              >
                <div className="flex flex-col gap-1">
                  <h3 className={`text-xl font-black tracking-tight ${accentClass}`}>{title}</h3>
                  <p className="text-slate-500 text-xs font-bold tracking-wide uppercase">{lang === "es" ? (member.aka_es ?? member.aka) : member.aka}</p>
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
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{tt("team.label.role", lang)}</p>
                        <p className="text-slate-700 font-medium leading-relaxed">{role}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{tt("team.label.what", lang)}</p>
                        <p className="text-slate-700 font-medium leading-relaxed">{what}</p>
                      </div>
                      {(teenTip || tip) && (
                        <div className={`rounded-2xl bg-white/70 p-5 border border-white`}>
                          <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-1">{tt("team.label.tip", lang)}</p>
                          <p className="text-slate-700 font-semibold leading-relaxed">{teenTip ?? tip}</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
