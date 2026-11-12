"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  BookOpen,
  CalendarCheck,
  ClipboardList,
  FileText,
  FolderOpen,
  GraduationCap,
  HeartPulse,
  Home,
  IdCard,
  MessageCircle,
  Sparkles,
  Sprout,
  Undo2,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import type { Lang } from "../../lib/i18n";
import type { AgeBandKey } from "../../lib/prefs";
import { tt, ttBand } from "../../lib/i18n-teen";
import { IMPORTANT_DOCS } from "../../data/docs";
import { FUTURE_BANDS, FUTURE_LABELS, type FutureIcon, type TeenBand } from "../../data/future";

interface FutureTeenProps {
  lang: Lang;
  band: AgeBandKey;
}

const ICONS: Record<FutureIcon, LucideIcon> = {
  school: BookOpen,
  star: Sparkles,
  plan: ClipboardList,
  skills: Wrench,
  later: Sprout,
  meeting: CalendarCheck,
  id: IdCard,
  health: HeartPulse,
  home: Home,
  return: Undo2,
  tuition: GraduationCap,
  papers: FolderOpen,
};

export function FutureTeen({ lang, band }: FutureTeenProps) {
  const teenBand: TeenBand = band === "10-12" ? "13-15" : band;
  const content = FUTURE_BANDS[teenBand];
  const reduce = useReducedMotion();

  return (
    <div className="max-w-[1100px] mx-auto px-6 sm:px-12 py-10 sm:py-20 space-y-16">
      {/* Hero */}
      <div>
        <p className="text-xs font-black uppercase tracking-[0.4em] text-emerald-700 mb-4">{tt("future.hero.tag", lang)}</p>
        <h1 className="text-4xl sm:text-6xl font-black text-[#1e293b] mb-4 tracking-[-0.05em] leading-[0.95]">{tt("future.hero.title", lang)}</h1>
        <p className="text-slate-500 text-lg font-bold max-w-2xl leading-relaxed">{content.subtitle[lang]}</p>
      </div>

      {/* Band-specific framing banner */}
      <div className="rounded-2xl bg-gradient-to-r from-emerald-50 to-sky-50 border border-white p-6 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
          <GraduationCap size={20} strokeWidth={2.5} aria-hidden="true" />
        </div>
        <p className="text-[#1e293b] font-black text-base">{ttBand("future.banner", band, lang)}</p>
      </div>

      {/* Band-specific cards */}
      <section>
        <h2 className="text-3xl font-black tracking-[-0.03em] text-[#1e293b] mb-3">{content.cardsHeading[lang]}</h2>
        <p className="text-slate-600 font-medium mb-8 max-w-2xl">{content.cardsIntro[lang]}</p>
        <div className="grid md:grid-cols-2 gap-4">
          {content.cards.map((c, idx) => {
            const Icon = ICONS[c.icon];
            return (
              <motion.div
                key={c.id}
                initial={{ y: 10 }}
                animate={{ y: 0 }}
                transition={{ delay: reduce ? 0 : Math.min(idx, 10) * 0.04, duration: reduce ? 0 : 0.3 }}
                className="rounded-2xl bg-white border border-slate-100 p-6 shadow-sm"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                    <Icon size={20} strokeWidth={2.25} aria-hidden="true" />
                  </div>
                  <h3 className="font-black text-[#1e293b] text-lg leading-snug pt-1.5">{c.title[lang]}</h3>
                </div>
                <p className="text-slate-700 text-[15px] font-medium leading-relaxed">{c.body[lang]}</p>
                {c.tryThis && (
                  <div className="mt-4 rounded-xl bg-sky-50 p-4">
                    <p className="text-xs font-black uppercase tracking-widest text-sky-800 mb-1">{FUTURE_LABELS.tryThis[lang]}</p>
                    <p className="text-slate-700 text-sm font-medium leading-relaxed">{c.tryThis[lang]}</p>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </section>

      {content.showPrograms && (
        <>
          {/* Extended Foster Care */}
          <section>
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
                <Home size={22} strokeWidth={2.5} aria-hidden="true" />
              </div>
              <h2 className="text-3xl font-black tracking-[-0.03em] text-[#1e293b]">{tt("future.efc.heading", lang)}</h2>
            </div>
            <p className="text-slate-700 text-base font-medium leading-relaxed max-w-3xl">{tt("future.efc.body", lang)}</p>
          </section>

          {/* Education and Training Voucher */}
          <section>
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                <GraduationCap size={22} strokeWidth={2.5} aria-hidden="true" />
              </div>
              <h2 className="text-3xl font-black tracking-[-0.03em] text-[#1e293b]">{tt("future.etv.heading", lang)}</h2>
            </div>
            <p className="text-slate-700 text-base font-medium leading-relaxed max-w-3xl mb-4">{tt("future.etv.body", lang)}</p>
            {/* The "when" text is a sentence, not a date, so let it wrap. */}
            <div className="max-w-xl rounded-2xl bg-amber-50 border border-amber-100 px-5 py-4">
              <p className="text-xs font-black uppercase tracking-widest text-amber-800 mb-1">{tt("future.etv.deadline.label", lang)}</p>
              <p className="font-bold text-slate-800 leading-snug">{tt("future.etv.deadline", lang)}</p>
            </div>
          </section>
        </>
      )}

      {/* Documents */}
      {content.showDocs ? (
        <section>
          <div className="flex items-center gap-4 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
              <FileText size={22} strokeWidth={2.5} aria-hidden="true" />
            </div>
            <h2 className="text-3xl font-black tracking-[-0.03em] text-[#1e293b]">{tt("future.docs.heading", lang)}</h2>
          </div>
          <p className="text-slate-600 font-medium mb-8 max-w-2xl">{tt("future.docs.intro", lang)}</p>
          <div className="grid md:grid-cols-2 gap-4">
            {IMPORTANT_DOCS.map((d, idx) => {
              const label = lang === "es" ? d.label_es : d.label;
              const why = lang === "es" ? d.why_es : d.why;
              const steps = lang === "es" ? d.steps_es : d.steps;
              const contact = lang === "es" ? d.contact_es : d.contact;
              return (
                <motion.div
                  key={d.id}
                  initial={{ y: 10 }}
                  animate={{ y: 0 }}
                  transition={{ delay: reduce ? 0 : Math.min(idx, 10) * 0.04, duration: reduce ? 0 : 0.3 }}
                  className="rounded-2xl bg-white border border-slate-100 p-6 shadow-sm"
                >
                  {d.ifApplies && (
                    <p className="inline-block rounded-full bg-sky-50 px-3 py-1 text-xs font-bold text-sky-800 mb-2">
                      {FUTURE_LABELS.ifApplies[lang]}
                    </p>
                  )}
                  <h3 className="font-black text-[#1e293b] text-base mb-2">{label}</h3>
                  <p className="text-slate-600 text-sm font-medium leading-relaxed mb-3">{why}</p>
                  <div className="rounded-xl bg-amber-50 p-4 mb-3">
                    <p className="text-xs font-black uppercase tracking-widest text-amber-800 mb-2">{tt("future.docs.howto", lang)}</p>
                    <ol className="space-y-1.5">
                      {steps.map((s, i) => (
                        <li key={i} className="flex gap-2 text-slate-700 text-sm font-medium leading-relaxed">
                          <span className="font-black text-amber-800 shrink-0">{i + 1}.</span>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                  <p className="text-sm font-bold text-slate-600">
                    <span className="text-xs uppercase tracking-widest text-slate-600">{tt("future.docs.contact", lang)}: </span>
                    {contact}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </section>
      ) : (
        content.docsNote && (
          <section className="rounded-2xl bg-amber-50 border border-amber-100 p-6 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-white text-amber-700 flex items-center justify-center shrink-0">
              <FileText size={20} strokeWidth={2.5} aria-hidden="true" />
            </div>
            <div>
              <h2 className="font-black text-[#1e293b] text-lg mb-1">{FUTURE_LABELS.docsLater[lang]}</h2>
              <p className="text-slate-700 text-[15px] font-medium leading-relaxed max-w-2xl">{content.docsNote[lang]}</p>
            </div>
          </section>
        )
      )}

      {/* Who to ask */}
      <section className="rounded-3xl bg-[#1a2f44] p-6 sm:p-10">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-12 h-12 rounded-2xl bg-white/10 text-emerald-300 flex items-center justify-center shrink-0">
            <MessageCircle size={22} strokeWidth={2.5} aria-hidden="true" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-[-0.03em] text-white">{content.askHeading[lang]}</h2>
        </div>
        <p className="text-slate-200 font-medium mb-6 max-w-2xl">{content.askIntro[lang]}</p>
        <ul className="grid sm:grid-cols-2 gap-3">
          {content.ask.map((a) => (
            <li key={a.who.en} className="rounded-2xl bg-white/10 p-4">
              <p className="font-black text-white">{a.who[lang]}</p>
              <p className="text-slate-200 text-sm font-medium leading-relaxed mt-1">{a.why[lang]}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
