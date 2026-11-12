"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Phone, MessageSquare, Zap, ArrowRight, LifeBuoy, Sparkles } from "lucide-react";
import type { Lang } from "../../lib/i18n";
import { tt, type TeenStringKey } from "../../lib/i18n-teen";
import { th } from "../../lib/i18n-help";
import type { AgeBandKey } from "../../lib/prefs";
import { FeelingCheckIn } from "../FeelingCheckIn";
import { CRISIS_CONTACTS, crisisActions, type CrisisAction, type CrisisContact } from "../../data/constants";

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

// Numbers and tap-to-call / tap-to-text links come from CRISIS_PINS in
// data/constants.ts. Teen-voice name/description overrides are optional.
const TEEN_COPY: Partial<Record<CrisisContact["id"], { nameKey: TeenStringKey; descKey: TeenStringKey }>> = {
  "988":         { nameKey: "wellness.support.988.name",  descKey: "wellness.support.988.desc" },
  "crisis-text": { nameKey: "wellness.support.text.name", descKey: "wellness.support.text.desc" },
  dcs:           { nameKey: "wellness.support.dcs.name",  descKey: "wellness.support.dcs.desc" },
};

function actionLabel(a: CrisisAction, lang: Lang): string {
  if (a.kind === "tel") return th("help.call", lang, { n: a.display });
  if (a.keyword) return th("help.text_keyword", lang, { k: a.keyword, n: a.display });
  return th("help.text", lang, { n: a.display });
}

interface WellnessTeenProps {
  lang: Lang;
  /** Teen age band; picks check-in wording. Defaults to the 13-15 voice. */
  band?: Exclude<AgeBandKey, "10-12">;
}

export function WellnessTeen({ lang, band = "13-15" }: WellnessTeenProps) {
  const [active, setActive] = useState(false);
  const [step, setStep] = useState(0);
  const reduce = useReducedMotion();

  const startRef = useRef<HTMLButtonElement>(null);

  const current = GROUNDING[step];
  const start = () => { setStep(0); setActive(true); };
  // Closing hands focus back to the button that opened the exercise.
  const close = () => {
    setActive(false);
    setStep(0);
    requestAnimationFrame(() => startRef.current?.focus());
  };
  const next = () => {
    if (step < GROUNDING.length - 1) setStep((s) => s + 1);
    else close();
  };
  // Escape closes; Tab stays inside the overlay while it is open.
  const onOverlayKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") { close(); return; }
    if (e.key !== "Tab") return;
    const btns = e.currentTarget.querySelectorAll<HTMLElement>("button");
    if (btns.length === 0) return;
    const first = btns[0];
    const last = btns[btns.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
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
            role="dialog"
            aria-modal="true"
            aria-labelledby="grounding-step"
            onKeyDown={onOverlayKeyDown}
            className="fixed inset-0 z-[100] bg-[#1a2f44]/95 backdrop-blur-3xl flex flex-col items-center justify-center p-10 text-center"
          >
            <div className="max-w-xl w-full" aria-live="polite">
              <motion.div
                key={step}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: reduce ? 0 : 0.3 }}
                className="mb-12"
              >
                <div className="text-8xl sm:text-9xl mb-12" aria-hidden="true">{current.icon}</div>
                <div className="text-6xl sm:text-8xl font-black text-white mb-6 tracking-tighter" aria-hidden="true">{current.n}</div>
                <h2 id="grounding-step" className="text-2xl sm:text-4xl font-bold text-sky-300 tracking-tight leading-tight">
                  {tt("wellness.grounding.prompt", lang, { n: String(current.n), noun: tt(current.nounKey, lang) })}
                </h2>
              </motion.div>

              <div className="flex justify-center gap-3 mb-16" aria-hidden="true">
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
                autoFocus
                className="w-full sm:w-80 bg-white text-[#1a2f44] font-black text-lg py-6 rounded-3xl shadow-2xl hover:bg-sky-50 active:scale-95 transition-all"
              >
                {step < GROUNDING.length - 1 ? tt("wellness.grounding.next", lang) : tt("wellness.grounding.finish", lang)}
              </button>
              <button
                type="button"
                onClick={close}
                className="mt-6 min-h-11 px-4 text-white/80 font-bold hover:text-white transition-colors uppercase tracking-widest text-xs"
              >
                {tt("wellness.grounding.close", lang)}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero */}
      <div className="mb-10 md:mb-14">
        <p className="text-xs font-black uppercase tracking-[0.4em] text-pink-700 mb-4">{tt("wellness.hero.tag", lang)}</p>
        <h1 className="text-4xl sm:text-6xl font-black text-[#1e293b] mb-6 tracking-[-0.05em] leading-[0.9]">
          {tt("wellness.hero.title", lang)}
        </h1>
        <p className="text-slate-500 text-lg sm:text-xl font-medium max-w-2xl leading-[1.6] tracking-tight border-l-[3px] border-slate-200 pl-8">
          {tt("wellness.hero.subtitle", lang)}
        </p>
      </div>

      {/* How are you feeling? — nothing is stored (React state only) */}
      <FeelingCheckIn lang={lang} band={band} className="mb-14 md:mb-24" />

      {/* Immersive grounding hero card */}
      <div className="mb-24 group">
        <div className="relative bg-[#1a2f44] rounded-[2.5rem] sm:rounded-[3.5rem] p-8 sm:p-14 overflow-hidden border border-[#2a4563] shadow-[0_24px_80px_rgba(0,0,0,0.15)]">
          <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 blur-[100px] rounded-full translate-x-1/3 -translate-y-1/3" aria-hidden="true" />
          <div className="absolute -left-12 -bottom-12 w-64 h-64 bg-emerald-500/5 blur-[80px] rounded-full" />

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-12 md:gap-20">
            <div className="w-40 sm:w-60 h-40 sm:h-60 rounded-[3rem] bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-md text-[120px] sm:text-[160px] group-hover:scale-105 transition-transform duration-500" aria-hidden="true">
              🧘
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center gap-3 mb-4 justify-center md:justify-start">
                <Zap size={18} className="text-sky-400 fill-sky-400" aria-hidden="true" />
                <span className="text-sky-400 font-black text-xs uppercase tracking-[0.35em]">
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
                ref={startRef}
                onClick={start}
                className="px-10 py-5 rounded-2xl bg-sky-400 text-[#1a2f44] font-black text-lg shadow-[0_12px_44px_rgba(56,189,248,0.4)] hover:bg-white transition-all hover:scale-105 active:scale-95 inline-flex items-center gap-3"
              >
                {tt("wellness.grounding.cta", lang)} <ArrowRight size={20} strokeWidth={3} aria-hidden="true" />
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
            <div className="w-24 h-24 rounded-[2rem] bg-slate-50 border border-slate-100 flex items-center justify-center mb-8 text-5xl group-hover:bg-sky-50 transition-colors duration-500" aria-hidden="true">
              {t.icon}
            </div>
            <h3 className="text-xl font-black text-[#1e293b] mb-4 tracking-tight">{tt(t.titleKey, lang)}</h3>
            <p className="text-slate-600 text-sm font-medium leading-relaxed">{tt(t.descKey, lang)}</p>
          </motion.div>
        ))}
      </div>

      {/* Support Network */}
      <section className="mt-20 grid lg:grid-cols-12 gap-16 items-start">
        <div className="lg:col-span-4 lg:sticky lg:top-10">
          <span className="text-xs font-black uppercase tracking-[0.4em] text-slate-600 mb-6 block">
            {tt("wellness.support.kicker", lang)}
          </span>
          <h2 className="text-4xl font-black text-[#1e293b] tracking-tight mb-6 leading-[0.95]">
            {tt("wellness.support.heading", lang)}
          </h2>
          <p className="text-slate-500 font-medium text-lg leading-relaxed mb-10">
            {tt("wellness.support.body", lang)}
          </p>
          <div className="p-8 rounded-[2rem] bg-sky-50/50 border border-sky-100/50 flex gap-5 items-start">
            <LifeBuoy size={24} className="text-sky-700 mt-1 shrink-0" aria-hidden="true" />
            <p className="text-sky-800 text-sm font-bold leading-relaxed">
              {tt("wellness.support.note", lang)}
            </p>
          </div>
        </div>

        <div className="lg:col-span-8 flex flex-col gap-6">
          {CRISIS_CONTACTS.map((c, idx) => {
            const actions = crisisActions(c, lang);
            const copy = TEEN_COPY[c.id];
            const HeadIcon = actions[0]?.kind === "sms" ? MessageSquare : Phone;
            return (
              <motion.div
                key={c.id}
                initial={{ x: 20 }}
                whileInView={{ x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: reduce ? 0 : idx * 0.1, duration: reduce ? 0 : 0.4 }}
                className="bg-white rounded-[2.5rem] p-8 sm:p-10 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-slate-100 group flex flex-col sm:flex-row items-center gap-6 sm:gap-8 text-center sm:text-left"
              >
                <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100 group-hover:bg-sky-900 group-hover:text-white transition-all">
                  <HeadIcon size={24} aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-black text-[#1e293b] mb-2 tracking-tight">
                    {copy ? tt(copy.nameKey, lang) : lang === "es" ? c.name_es : c.name}
                  </h3>
                  <p className="text-slate-600 text-sm font-bold leading-relaxed max-w-md">
                    {copy ? tt(copy.descKey, lang) : lang === "es" ? c.desc_es : c.desc}
                  </p>
                </div>
                <div className="flex flex-col gap-2 w-full sm:w-auto shrink-0">
                  {actions.map((a) => {
                    const Icon = a.kind === "sms" ? MessageSquare : Phone;
                    return (
                      <a
                        key={a.href}
                        href={a.href}
                        className="min-h-[48px] px-6 py-3 rounded-xl bg-slate-900 text-white font-black text-sm tracking-wide hover:bg-[#2A7F8E] transition-colors shadow-[0_8px_20px_rgba(0,0,0,0.1)] inline-flex items-center justify-center gap-2 whitespace-nowrap"
                      >
                        <Icon size={16} strokeWidth={2.5} aria-hidden="true" />
                        {actionLabel(a, lang)}
                      </a>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}

          {/* Motivational quote */}
          <div className="mt-8 p-12 rounded-[3.5rem] bg-gradient-to-br from-[#1a2f44] to-[#122b46] text-white flex flex-col sm:flex-row items-center gap-10 overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2" />
            <div className="w-24 h-24 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center shrink-0 backdrop-blur-md group-hover:rotate-12 transition-transform duration-500">
              <Sparkles size={40} className="text-sky-300" aria-hidden="true" />
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
