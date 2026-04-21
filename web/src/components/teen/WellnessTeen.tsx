"use client";

import { motion } from "framer-motion";
import { Phone } from "lucide-react";
import type { Lang } from "../../lib/i18n";
import { tt } from "../../lib/i18n-teen";

const GROUNDING = [
  { n: 5, nounKey: "wellness.grounding.1.noun", icon: "👁️" },
  { n: 4, nounKey: "wellness.grounding.2.noun", icon: "✋" },
  { n: 3, nounKey: "wellness.grounding.3.noun", icon: "👂" },
  { n: 2, nounKey: "wellness.grounding.4.noun", icon: "👃" },
  { n: 1, nounKey: "wellness.grounding.5.noun", icon: "👅" },
] as const;

const TOOLS = [
  { id: "breathe", img: "/wellness/breathing.png", titleKey: "wellness.tool.breathe.title", descKey: "wellness.tool.breathe.desc", color: "bg-sky-50", accent: "text-sky-700" },
  { id: "journal", img: "/wellness/journal.png",   titleKey: "wellness.tool.journal.title", descKey: "wellness.tool.journal.desc", color: "bg-emerald-50", accent: "text-emerald-700" },
  { id: "move",    img: "/wellness/music.png",     titleKey: "wellness.tool.move.title",    descKey: "wellness.tool.move.desc",    color: "bg-amber-50",  accent: "text-amber-700" },
] as const;

const SUPPORT = [
  { id: "988",   nameKey: "wellness.support.988.name",  descKey: "wellness.support.988.desc",  labelKey: "wellness.support.988.label",  href: "tel:988" },
  { id: "text",  nameKey: "wellness.support.text.name", descKey: "wellness.support.text.desc", labelKey: "wellness.support.text.label", href: "sms:741741" },
  { id: "dcs",   nameKey: "wellness.support.dcs.name",  descKey: "wellness.support.dcs.desc",  labelKey: "wellness.support.dcs.label",  href: "tel:18887672445" },
] as const;

interface WellnessTeenProps { lang: Lang; }

export function WellnessTeen({ lang }: WellnessTeenProps) {
  return (
    <div className="max-w-[1100px] mx-auto px-6 sm:px-12 py-10 sm:py-20 space-y-20">
      {/* Hero */}
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-pink-600 mb-4">{tt("wellness.hero.tag", lang)}</p>
        <h1 className="text-4xl sm:text-6xl font-black text-[#1e293b] mb-4 tracking-[-0.05em] leading-[0.95]">{tt("wellness.hero.title", lang)}</h1>
        <p className="text-slate-500 text-lg font-bold max-w-2xl leading-relaxed">{tt("wellness.hero.subtitle", lang)}</p>
      </div>

      {/* Grounding */}
      <section>
        <h2 className="text-3xl font-black tracking-[-0.03em] text-[#1e293b] mb-3">{tt("wellness.grounding.heading", lang)}</h2>
        <p className="text-slate-500 font-medium mb-8 max-w-2xl">{tt("wellness.grounding.intro", lang)}</p>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {GROUNDING.map((g, idx) => (
            <motion.div
              key={g.n}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06, duration: 0.3 }}
              className="rounded-2xl bg-white border border-slate-100 shadow-sm p-5 text-center"
            >
              <div className="text-3xl mb-2">{g.icon}</div>
              <div className="text-3xl font-black text-pink-600">{g.n}</div>
              <div className="text-xs text-slate-500 font-semibold mt-1">{tt(g.nounKey as Parameters<typeof tt>[0], lang)}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Tools */}
      <section>
        <h2 className="text-3xl font-black tracking-[-0.03em] text-[#1e293b] mb-6">{tt("wellness.tools.heading", lang)}</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {TOOLS.map((t, idx) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08, duration: 0.35 }}
              className={`rounded-[2rem] p-8 ${t.color} border border-white shadow-[0_20px_50px_rgba(0,0,0,0.03)]`}
            >
              <div className="w-16 h-16 rounded-2xl bg-white mb-6 flex items-center justify-center overflow-hidden shadow-sm">
                <img src={t.img} alt="" className="w-full h-full object-cover" />
              </div>
              <h3 className={`font-black text-xl ${t.accent} tracking-tight mb-3`}>{tt(t.titleKey, lang)}</h3>
              <p className="text-slate-700 font-medium leading-relaxed">{tt(t.descKey, lang)}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Support */}
      <section>
        <h2 className="text-3xl font-black tracking-[-0.03em] text-[#1e293b] mb-6">{tt("wellness.support.heading", lang)}</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {SUPPORT.map((s) => (
            <div key={s.id} className="rounded-[2rem] bg-white border border-slate-100 shadow-sm p-8 flex flex-col">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mb-5">
                <Phone size={20} strokeWidth={2.5} />
              </div>
              <h3 className="font-black text-lg text-[#1e293b] tracking-tight mb-2">{tt(s.nameKey, lang)}</h3>
              <p className="text-slate-600 text-sm font-medium leading-relaxed mb-6 flex-1">{tt(s.descKey, lang)}</p>
              <a
                href={s.href}
                className="w-full py-4 rounded-xl bg-rose-500 text-white font-black text-xs uppercase tracking-[0.2em] text-center shadow-lg shadow-rose-200 hover:bg-rose-600 transition-colors"
              >
                {tt(s.labelKey, lang)}
              </a>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
