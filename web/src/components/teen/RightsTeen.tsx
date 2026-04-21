"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Shield, Scale, ArrowRight, MessageSquare, Sparkles,
  AlertTriangle, Phone,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Lang } from "../../lib/i18n";
import type { AgeBandKey } from "../../lib/prefs";
import { tt } from "../../lib/i18n-teen";
import { RIGHTS, ESCALATION_STEPS } from "../../data/rights";

type Theme = { primary: string; light: string; accent: string; shadow: string };

const THEMES: Record<string, Theme> = {
  emerald: { primary: "#115e59", light: "rgba(209, 250, 229, 0.4)", accent: "#34d399", shadow: "rgba(17, 94, 89, 0.15)" },
  indigo:  { primary: "#4338ca", light: "rgba(238, 242, 255, 0.5)", accent: "#818cf8", shadow: "rgba(67, 56, 202, 0.15)" },
  amber:   { primary: "#b45309", light: "rgba(255, 251, 235, 0.5)", accent: "#fbbf24", shadow: "rgba(180, 83, 9, 0.15)" },
  rose:    { primary: "#be123c", light: "rgba(255, 241, 242, 0.5)", accent: "#fb7185", shadow: "rgba(190, 18, 60, 0.15)" },
  violet:  { primary: "#6d28d9", light: "rgba(245, 243, 255, 0.5)", accent: "#a78bfa", shadow: "rgba(109, 40, 217, 0.15)" },
};

const THEME_ORDER: (keyof typeof THEMES)[] = ["emerald", "indigo", "amber", "rose", "violet"];

const ESCALATION_ICONS: LucideIcon[] = [MessageSquare, Shield, Phone, Scale];

interface RightsTeenProps {
  lang: Lang;
  band: AgeBandKey;
}

export function RightsTeen({ lang, band }: RightsTeenProps) {
  const [openId, setOpenId] = useState<string>(RIGHTS[0].id);
  const reduce = useReducedMotion();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const active = scrollRef.current?.querySelector('[data-active="true"]');
    if (active) (active as HTMLElement).scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [openId]);

  const activeIdx = Math.max(0, RIGHTS.findIndex((r) => r.id === openId));
  const active = RIGHTS[activeIdx] ?? RIGHTS[0];
  const themeKey = THEME_ORDER[activeIdx % THEME_ORDER.length];
  const theme = THEMES[themeKey];

  const tier = active.tiers[band];
  const title = lang === "es" ? active.title_es : active.title;
  const plain = lang === "es" ? tier.plain_es : tier.plain;
  const example = lang === "es" ? tier.example_es : tier.example;
  const howToAsk = lang === "es" ? tier.howToAsk_es : tier.howToAsk;
  const ifIgnored = lang === "es" ? tier.ifIgnored_es : tier.ifIgnored;

  return (
    <div className="max-w-[1240px] mx-auto px-6 sm:px-12 py-10 sm:py-20">
      {/* Background blob */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-50/40 rounded-full blur-[140px] -z-10 translate-x-1/4 -translate-y-1/4" />

      {/* Hero */}
      <div className="mb-14 md:mb-20">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600 mb-4">{tt("rights.hero.tag", lang)}</p>
        <h1 className="text-4xl sm:text-6xl font-black text-[#1e293b] mb-6 tracking-[-0.05em] leading-[0.9]">
          {tt("rights.hero.title", lang)}
        </h1>
        <p className="text-slate-500 text-lg sm:text-xl font-medium max-w-2xl leading-[1.6] tracking-tight border-l-[3px] border-emerald-100 pl-8 mb-8">
          {tt("rights.hero.subtitle", lang)}
        </p>
        <span className="inline-flex items-center gap-2 rounded-full bg-[#1a2f44] text-white font-black text-[11px] uppercase tracking-[0.2em] px-5 py-2.5">
          <Scale size={14} strokeWidth={2.5} /> {tt("rights.citation", lang)}
        </span>
      </div>

      {/* Master-detail */}
      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-10">
        {/* Rights list */}
        <div className="lg:col-span-4 -mx-6 px-6 md:mx-0 md:px-0">
          <div
            ref={scrollRef}
            className="flex lg:flex-col gap-3.5 overflow-x-auto lg:overflow-x-visible pb-6 md:pb-0 snap-x lg:max-h-[700px] lg:pr-2"
          >
            {RIGHTS.map((r, idx) => {
              const isActive = openId === r.id;
              const rThemeKey = THEME_ORDER[idx % THEME_ORDER.length];
              const rTheme = THEMES[rThemeKey];
              const shortTitle = lang === "es" ? r.title_es : r.title;
              return (
                <motion.button
                  key={r.id}
                  type="button"
                  data-active={isActive}
                  onClick={() => setOpenId(r.id)}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: reduce ? 0 : idx * 0.05, duration: reduce ? 0 : 0.3 }}
                  className={`snap-center flex-shrink-0 w-[240px] lg:w-auto flex items-start gap-4 p-5 rounded-[1.5rem] transition-all duration-300 text-left relative group ${
                    isActive
                      ? "bg-white scale-[1.02] z-10 border-2"
                      : "bg-white/40 backdrop-blur border-2 border-transparent hover:bg-white hover:border-slate-200"
                  }`}
                  style={isActive ? { boxShadow: `0 12px 44px ${rTheme.shadow}`, borderColor: `${rTheme.primary}20` } : {}}
                >
                  <div
                    className="w-11 h-11 rounded-[1.1rem] flex items-center justify-center shrink-0 transition-all duration-300"
                    style={
                      isActive
                        ? { backgroundColor: rTheme.primary, color: "white", boxShadow: `0 8px 16px ${rTheme.shadow}` }
                        : { backgroundColor: "rgba(241, 245, 249, 0.8)", color: "#64748b" }
                    }
                  >
                    <Shield size={18} strokeWidth={isActive ? 2.5 : 2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">{r.citation}</p>
                    <p
                      className="text-[15px] font-black tracking-tight leading-tight"
                      style={{ color: isActive ? rTheme.primary : "#334155" }}
                    >
                      {shortTitle}
                    </p>
                  </div>
                  {isActive && (
                    <motion.div layoutId="rights-arrow" className="ml-auto hidden lg:block mt-1">
                      <ArrowRight size={18} style={{ color: rTheme.accent }} />
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Detail card */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={openId}
              initial={{ opacity: 0, x: 20, scale: 0.98 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -20, scale: 0.98 }}
              transition={{ duration: reduce ? 0 : 0.35 }}
              className="bg-white rounded-[2.5rem] sm:rounded-[3.5rem] p-8 sm:p-14 border border-white relative overflow-hidden"
              style={{ boxShadow: `0 32px 80px ${theme.shadow.replace("0.15", "0.1")}` }}
            >
              <div
                className="absolute left-0 top-0 bottom-0 w-[6px] sm:w-[8px] rounded-r-full"
                style={{ background: `linear-gradient(to bottom, ${theme.accent}, ${theme.primary})` }}
              />
              <div
                className="absolute top-0 right-0 w-64 h-64 rounded-bl-[100%] pointer-events-none -z-0"
                style={{ backgroundColor: theme.light }}
              />

              {/* Header */}
              <div className="flex items-start justify-between mb-10 relative z-10 gap-4">
                <div className="max-w-xl">
                  <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 mb-3">{active.citation}</p>
                  <h2 className="text-2xl sm:text-4xl font-black text-[#1e293b] tracking-tighter leading-tight">
                    {title}
                  </h2>
                </div>
                <div
                  className="shrink-0 w-16 h-16 sm:w-20 sm:h-20 bg-white/70 backdrop-blur-xl rounded-[1.75rem] flex items-center justify-center border border-white relative"
                  style={{ color: theme.primary }}
                >
                  <div className="absolute inset-0 rounded-[1.75rem] blur-xl -z-10" style={{ backgroundColor: theme.light }} />
                  <Shield size={32} strokeWidth={1.75} />
                </div>
              </div>

              {/* What it means — hero paragraph */}
              <div className="mb-10 relative z-10">
                <span className="uppercase tracking-[0.25em] text-[10px] font-black mb-3 block" style={{ color: theme.primary }}>
                  {tt("rights.label.what", lang)}
                </span>
                <p className="text-[#1e293b] text-base sm:text-xl font-bold leading-[1.6] tracking-tight">
                  {plain}
                </p>
              </div>

              {/* 2-col: Example + How to use */}
              <div className="grid sm:grid-cols-2 gap-5 mb-6 relative z-10">
                <div
                  className="p-6 rounded-[1.75rem] border"
                  style={{ backgroundColor: theme.light, borderColor: `${theme.primary}15` }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles size={14} style={{ color: theme.primary }} strokeWidth={2.5} />
                    <span className="uppercase tracking-[0.25em] text-[10px] font-black" style={{ color: theme.primary }}>
                      {tt("rights.label.example", lang)}
                    </span>
                  </div>
                  <p className="text-[#1e293b] text-[14.5px] font-medium leading-[1.7] whitespace-pre-line">
                    {example}
                  </p>
                </div>

                <div className="p-6 rounded-[1.75rem] bg-sky-50/60 border border-sky-100">
                  <div className="flex items-center gap-2 mb-3">
                    <MessageSquare size={14} className="text-sky-600" strokeWidth={2.5} />
                    <span className="uppercase tracking-[0.25em] text-[10px] font-black text-sky-700">
                      {tt("rights.label.how", lang)}
                    </span>
                  </div>
                  <p className="text-[#0c4a6e] text-[14.5px] font-medium leading-[1.7] whitespace-pre-line">
                    {howToAsk}
                  </p>
                </div>
              </div>

              {/* If it's ignored — action callout */}
              <div className="relative z-10 p-6 rounded-[1.75rem] bg-rose-50/70 border border-rose-100 flex gap-5 items-start">
                <div className="shrink-0 bg-rose-100 text-rose-600 p-2.5 rounded-xl ring-4 ring-white">
                  <AlertTriangle size={20} strokeWidth={2.5} />
                </div>
                <div className="flex-1">
                  <span className="uppercase tracking-[0.25em] text-[10px] font-black text-rose-700 mb-2 block">
                    {tt("rights.label.ignored", lang)}
                  </span>
                  <p className="text-[#881337] text-[14.5px] font-bold leading-[1.7] whitespace-pre-line">
                    {ifIgnored}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Escalation ladder */}
      <section className="pt-20 md:pt-32 border-t border-slate-200/80 mt-20">
        <div className="max-w-2xl mb-14">
          <div className="w-12 h-1 bg-emerald-400 rounded-full mb-8" />
          <h2 className="text-3xl sm:text-4xl font-black text-[#1e293b] tracking-[-0.05em] mb-4 leading-[0.95]">
            {tt("rights.escalation.heading", lang)}
          </h2>
          <p className="text-slate-500 font-medium text-base sm:text-lg leading-relaxed tracking-tight">
            {tt("rights.escalation.intro", lang)}
          </p>
        </div>

        <ol className="relative grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {ESCALATION_STEPS.map((s, idx) => {
            const who = lang === "es" ? s.who_es : s.who;
            const what = lang === "es" ? s.what_es : s.what;
            const Icon = ESCALATION_ICONS[idx] ?? Shield;
            return (
              <motion.li
                key={s.step}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: reduce ? 0 : idx * 0.08, duration: reduce ? 0 : 0.4 }}
                className="relative bg-white rounded-[2rem] p-7 border border-slate-100 shadow-[0_12px_32px_rgba(0,0,0,0.03)] flex flex-col"
              >
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-11 h-11 rounded-[1rem] bg-[#1a2f44] text-white flex items-center justify-center shrink-0 relative">
                    <Icon size={18} strokeWidth={2.5} />
                    <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-emerald-400 text-[#1a2f44] text-[11px] font-black flex items-center justify-center ring-2 ring-white">
                      {s.step}
                    </span>
                  </div>
                </div>
                <h4 className="font-black text-[#1e293b] text-[17px] mb-3 tracking-tight leading-tight">{who}</h4>
                <p className="text-slate-500 text-sm font-medium leading-[1.7]">{what}</p>
              </motion.li>
            );
          })}
        </ol>
      </section>
    </div>
  );
}
