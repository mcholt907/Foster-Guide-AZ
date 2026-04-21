"use client";

import { motion } from "framer-motion";
import { FileText, GraduationCap, Home } from "lucide-react";
import type { Lang } from "../../lib/i18n";
import type { AgeBandKey } from "../../lib/prefs";
import { tt, ttBand } from "../../lib/i18n-teen";
import { IMPORTANT_DOCS } from "../../data/docs";

interface FutureTeenProps {
  lang: Lang;
  band: AgeBandKey;
}

export function FutureTeen({ lang, band }: FutureTeenProps) {
  return (
    <div className="max-w-[1100px] mx-auto px-6 sm:px-12 py-10 sm:py-20 space-y-16">
      {/* Hero */}
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600 mb-4">{tt("future.hero.tag", lang)}</p>
        <h1 className="text-4xl sm:text-6xl font-black text-[#1e293b] mb-4 tracking-[-0.05em] leading-[0.95]">{tt("future.hero.title", lang)}</h1>
        <p className="text-slate-500 text-lg font-bold max-w-2xl leading-relaxed">{tt("future.hero.subtitle", lang)}</p>
      </div>

      {/* Band-specific framing banner */}
      <div className="rounded-2xl bg-gradient-to-r from-emerald-50 to-sky-50 border border-white p-6 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
          <GraduationCap size={20} strokeWidth={2.5} />
        </div>
        <p className="text-[#1e293b] font-black text-base">{ttBand("future.banner", band, lang)}</p>
      </div>

      {/* Documents */}
      <section>
        <div className="flex items-center gap-4 mb-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <FileText size={22} strokeWidth={2.5} />
          </div>
          <h2 className="text-3xl font-black tracking-[-0.03em] text-[#1e293b]">{tt("future.docs.heading", lang)}</h2>
        </div>
        <p className="text-slate-500 font-medium mb-8 max-w-2xl">{tt("future.docs.intro", lang)}</p>
        <div className="grid md:grid-cols-2 gap-4">
          {IMPORTANT_DOCS.map((d, idx) => {
            const label = lang === "es" ? d.label_es : d.label;
            const why = lang === "es" ? d.why_es : d.why;
            const steps = lang === "es" ? d.steps_es : d.steps;
            const contact = lang === "es" ? d.contact_es : d.contact;
            return (
              <motion.div
                key={d.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(idx, 10) * 0.04, duration: 0.3 }}
                className="rounded-2xl bg-white border border-slate-100 p-6 shadow-sm"
              >
                <h3 className="font-black text-[#1e293b] text-base mb-2">{label}</h3>
                <p className="text-slate-600 text-sm font-medium leading-relaxed mb-3">{why}</p>
                <div className="rounded-xl bg-amber-50 p-4 mb-3">
                  <p className="text-[10px] font-black uppercase tracking-widest text-amber-700 mb-2">{tt("future.docs.howto", lang)}</p>
                  <ol className="space-y-1.5">
                    {steps.map((s, i) => (
                      <li key={i} className="flex gap-2 text-slate-700 text-sm font-medium leading-relaxed">
                        <span className="font-black text-amber-700 shrink-0">{i + 1}.</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ol>
                </div>
                <p className="text-[11px] font-bold text-slate-500">
                  <span className="uppercase tracking-widest text-slate-400">{tt("future.docs.contact", lang)}: </span>
                  {contact}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* EFC */}
      <section>
        <div className="flex items-center gap-4 mb-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
            <Home size={22} strokeWidth={2.5} />
          </div>
          <h2 className="text-3xl font-black tracking-[-0.03em] text-[#1e293b]">{tt("future.efc.heading", lang)}</h2>
        </div>
        <p className="text-slate-700 text-base font-medium leading-relaxed max-w-3xl">{tt("future.efc.body", lang)}</p>
      </section>

      {/* ETV */}
      <section>
        <div className="flex items-center gap-4 mb-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <GraduationCap size={22} strokeWidth={2.5} />
          </div>
          <h2 className="text-3xl font-black tracking-[-0.03em] text-[#1e293b]">{tt("future.etv.heading", lang)}</h2>
        </div>
        <p className="text-slate-700 text-base font-medium leading-relaxed max-w-3xl mb-4">{tt("future.etv.body", lang)}</p>
        <div className="inline-flex items-center gap-3 rounded-2xl bg-rose-50 border border-rose-100 px-5 py-3">
          <p className="text-[10px] font-black uppercase tracking-widest text-rose-700">{tt("future.etv.deadline.label", lang)}</p>
          <p className="font-black text-rose-900">{tt("future.etv.deadline", lang)}</p>
        </div>
      </section>
    </div>
  );
}
