"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Phone, MessageSquare, Zap, ArrowRight, LifeBuoy, Sparkles } from "lucide-react";
import type { Lang } from "../../lib/i18n";
import { tt, type TeenStringKey } from "../../lib/i18n-teen";

const GROUNDING = [
  { n: 5, nounKey: "wellness.grounding.1.noun" as TeenStringKey, icon: "👁️" },
  { n: 4, nounKey: "wellness.grounding.2.noun" as TeenStringKey, icon: "✋" },
  { n: 3, nounKey: "wellness.grounding.3.noun" as TeenStringKey, icon: "👂" },
  { n: 2, nounKey: "wellness.grounding.4.noun" as TeenStringKey, icon: "👃" },
  { n: 1, nounKey: "wellness.grounding.5.noun" as TeenStringKey, icon: "👅" },
];

const TOOLS = [
  { id: "breathe", icon: "🌬️", titleKey: "wellness.tool.breathe.title" as TeenStringKey, descKey: "wellness.tool.breathe.desc" as TeenStringKey },
  { id: "journal", icon: "📓", titleKey: "wellness.tool.journal.title" as TeenStringKey, descKey: "wellness.tool.journal.desc" as TeenStringKey },
  { id: "move",    icon: "🎧", titleKey: "wellness.tool.move.title"    as TeenStringKey, descKey: "wellness.tool.move.desc"    as TeenStringKey },
];

const SUPPORT = [
  { id: "988",  nameKey: "wellness.support.988.name"  as TeenStringKey, descKey: "wellness.support.988.desc"  as TeenStringKey, labelKey: "wellness.support.988.label"  as TeenStringKey, href: "tel:988",          kind: "tel" as const },
  { id: "text", nameKey: "wellness.support.text.name" as TeenStringKey, descKey: "wellness.support.text.desc" as TeenStringKey, labelKey: "wellness.support.text.label" as TeenStringKey, href: "sms:741741",       kind: "sms" as const },
  { id: "dcs",  nameKey: "wellness.support.dcs.name"  as TeenStringKey, descKey: "wellness.support.dcs.desc"  as TeenStringKey, labelKey: "wellness.support.dcs.label"  as TeenStringKey, href: "tel:18887672445", kind: "tel" as const },
];

interface WellnessTeenProps {
  lang: Lang;
}

export function WellnessTeen({ lang }: WellnessTeenProps) {
  const [active, setActive] = useState(false);
  const [step, setStep] = useState(0);
  const reduce = useReducedMotion();

  const current = GROUNDING[step];
  const start = () => { setStep(0); setActive(true); };
  const next = () => {
    if (step < GROUNDING.length - 1) setStep((s) => s + 1);
    else { setActive(false); setStep(0); }
  };

  return (
    <div className="max-w-[1240px] mx-auto px-6 sm:px-12 py-10 sm:py-20 overflow-visible">
      {/* Immersive overlay */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-[#1a2f44]/95 backdrop-blur-3xl flex flex-col items-center justify-center p-10 text-center"
          >
            <div className="max-w-xl w-full">
              <motion.div
                key={step}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: reduce ? 0 : 0.3 }}
                className="mb-12"
              >
                <div className="text-8xl sm:text-9xl mb-12">{current.icon}</div>
                <div className="text-6xl sm:text-8xl font-black text-white mb-6 tracking-tighter">{current.n}</div>
                <h3 className="text-2xl sm:text-4xl font-bold text-sky-300 tracking-tight leading-tight">
                  {tt("wellness.grounding.prompt", lang, { n: String(current.n), noun: tt(current.nounKey, lang) })}
                </h3>
              </motion.div>

              <div className="flex justify-center gap-3 mb-16">
                {GROUNDING.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      i === step ? "w-12 bg-sky-400 shadow-[0_0_12px_rgba(56,189,248,0.8)]"
                      : i < step ? "w-3 bg-sky-400/40"
                      : "w-3 bg-white/10"
                    }`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={next}
                className="w-full sm:w-80 bg-white text-[#1a2f44] font-black text-lg py-6 rounded-3xl shadow-2xl hover:bg-sky-50 active:scale-95 transition-all"
              >
                {step < GROUNDING.length - 1 ? tt("wellness.grounding.next", lang) : tt("wellness.grounding.finish", lang)}
              </button>
              <button
                type="button"
                onClick={() => setActive(false)}
                className="mt-8 text-white/40 font-bold hover:text-white/60 transition-colors uppercase tracking-widest text-xs"
              >
                {tt("wellness.grounding.close", lang)}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero */}
      <div className="mb-14 md:mb-24">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-pink-600 mb-4">{tt("wellness.hero.tag", lang)}</p>
        <h1 className="text-4xl sm:text-6xl font-black text-[#1e293b] mb-6 tracking-[-0.05em] leading-[0.9]">
          {tt("wellness.hero.title", lang)}
        </h1>
        <p className="text-slate-500 text-lg sm:text-xl font-medium max-w-2xl leading-[1.6] tracking-tight border-l-[3px] border-slate-200 pl-8">
          {tt("wellness.hero.subtitle", lang)}
        </p>
      </div>

      {/* Immersive grounding hero card */}
      <div className="mb-24 group">
        <div className="relative bg-[#1a2f44] rounded-[2.5rem] sm:rounded-[3.5rem] p-8 sm:p-14 overflow-hidden border border-[#2a4563] shadow-[0_24px_80px_rgba(0,0,0,0.15)]">
          <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 blur-[100px] rounded-full translate-x-1/3 -translate-y-1/3" />
          <div className="absolute -left-12 -bottom-12 w-64 h-64 bg-emerald-500/5 blur-[80px] rounded-full" />

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-12 md:gap-20">
            <div className="w-40 sm:w-60 h-40 sm:h-60 rounded-[3rem] bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-md text-[120px] sm:text-[160px] group-hover:scale-105 transition-transform duration-500">
              🧘
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center gap-3 mb-4 justify-center md:justify-start">
                <Zap size={18} className="text-sky-400 fill-sky-400" />
                <span className="text-sky-400 font-black text-[10px] uppercase tracking-[0.35em]">
                  {tt("wellness.grounding.tag", lang)}
                </span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-white mb-6 tracking-tight">
                {tt("wellness.grounding.title", lang)}
              </h2>
              <p className="text-slate-300 text-base sm:text-xl mb-12 max-w-xl font-medium leading-relaxed tracking-tight">
                {tt("wellness.grounding.body", lang)}
              </p>
              <button
                type="button"
                onClick={start}
                className="px-10 py-5 rounded-2xl bg-sky-400 text-[#1a2f44] font-black text-lg shadow-[0_12px_44px_rgba(56,189,248,0.4)] hover:bg-white transition-all hover:scale-105 active:scale-95 inline-flex items-center gap-3"
              >
                {tt("wellness.grounding.cta", lang)} <ArrowRight size={20} strokeWidth={3} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tools grid */}
      <div className="grid sm:grid-cols-3 gap-6 mb-32">
        {TOOLS.map((t) => (
          <motion.div
            key={t.id}
            whileHover={{ y: -8 }}
            className="bg-white rounded-[2.5rem] p-10 border border-slate-50 shadow-[0_12px_44px_rgba(0,0,0,0.02)] group flex flex-col items-center text-center"
          >
            <div className="w-24 h-24 rounded-[2rem] bg-slate-50 border border-slate-100 flex items-center justify-center mb-8 text-5xl group-hover:bg-sky-50 transition-colors duration-500">
              {t.icon}
            </div>
            <h3 className="text-xl font-black text-[#1e293b] mb-4 tracking-tight">{tt(t.titleKey, lang)}</h3>
            <p className="text-slate-400 text-sm font-medium leading-relaxed">{tt(t.descKey, lang)}</p>
          </motion.div>
        ))}
      </div>

      {/* Support Network */}
      <section className="mt-20 grid lg:grid-cols-12 gap-16 items-start">
        <div className="lg:col-span-4 lg:sticky lg:top-10">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 mb-6 block">
            {tt("wellness.support.kicker", lang)}
          </span>
          <h2 className="text-4xl font-black text-[#1e293b] tracking-tight mb-6 leading-[0.95]">
            {tt("wellness.support.heading", lang)}
          </h2>
          <p className="text-slate-500 font-medium text-lg leading-relaxed mb-10">
            {tt("wellness.support.body", lang)}
          </p>
          <div className="p-8 rounded-[2rem] bg-sky-50/50 border border-sky-100/50 flex gap-5 items-start">
            <LifeBuoy size={24} className="text-sky-500 mt-1 shrink-0" />
            <p className="text-sky-800 text-sm font-bold leading-relaxed">
              {tt("wellness.support.note", lang)}
            </p>
          </div>
        </div>

        <div className="lg:col-span-8 flex flex-col gap-6">
          {SUPPORT.map((c, idx) => {
            const PhoneIcon = c.kind === "sms" ? MessageSquare : Phone;
            return (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: reduce ? 0 : idx * 0.1, duration: reduce ? 0 : 0.4 }}
                className="bg-white rounded-[2.5rem] p-10 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-slate-100 group flex flex-col sm:flex-row items-center gap-8 text-center sm:text-left"
              >
                <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100 group-hover:bg-sky-900 group-hover:text-white transition-all">
                  <PhoneIcon size={24} />
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-black text-[#1e293b] mb-2 tracking-tight">{tt(c.nameKey, lang)}</h4>
                  <p className="text-slate-400 text-[13px] font-bold leading-relaxed max-w-md">{tt(c.descKey, lang)}</p>
                </div>
                <a
                  href={c.href}
                  className="px-8 py-4 rounded-xl bg-slate-900 text-white font-black text-xs uppercase tracking-widest hover:bg-sky-400 transition-all hover:scale-105 shadow-[0_8px_20px_rgba(0,0,0,0.1)] shrink-0"
                >
                  {tt(c.labelKey, lang)}
                </a>
              </motion.div>
            );
          })}

          {/* Motivational quote */}
          <div className="mt-8 p-12 rounded-[3.5rem] bg-gradient-to-br from-[#1a2f44] to-[#122b46] text-white flex flex-col sm:flex-row items-center gap-10 overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2" />
            <div className="w-24 h-24 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center shrink-0 backdrop-blur-md group-hover:rotate-12 transition-transform duration-500">
              <Sparkles size={40} className="text-sky-300" />
            </div>
            <p className="text-xl sm:text-2xl font-black leading-tight tracking-tight text-center sm:text-left italic">
              {tt("wellness.quote", lang)}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
