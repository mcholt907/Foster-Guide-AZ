"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Shield, ChevronRight, Compass, Phone } from "lucide-react";
import type { Lang } from "../../lib/i18n";
import { tt, ttBand, type TeenStringKey } from "../../lib/i18n-teen";
import type { AgeBandKey } from "../../lib/prefs";

interface DashboardTeenProps {
  lang: Lang;
  band: AgeBandKey;
}

interface Tile {
  id: "team" | "case" | "wellness" | "answers";
  href: string;
  img: string;
  titleKey: TeenStringKey;
  descKey: TeenStringKey;
  ctaKey: TeenStringKey;
  bgColor: string;
  textColor: string;
  accentColor: string;
  hoverBlobColor: string;
}

const TILES: Tile[] = [
  {
    id: "team", href: "/team", img: "/avatars/group_avatar.png",
    titleKey: "dashboard.tile.team.title", descKey: "dashboard.tile.team.desc", ctaKey: "dashboard.tile.team.cta",
    bgColor: "bg-[#fff4cc] mix-blend-multiply", textColor: "text-[#78350f]", accentColor: "text-amber-600", hoverBlobColor: "bg-amber-50",
  },
  {
    id: "case", href: "/case", img: "/dashboard/case.png",
    titleKey: "dashboard.tile.case.title", descKey: "dashboard.tile.case.desc", ctaKey: "dashboard.tile.case.cta",
    bgColor: "bg-[#e0f2fe]", textColor: "text-[#0369a1]", accentColor: "text-sky-600", hoverBlobColor: "bg-sky-50",
  },
  {
    id: "wellness", href: "/wellness", img: "/dashboard/wellness.png",
    titleKey: "dashboard.tile.wellness.title", descKey: "dashboard.tile.wellness.desc", ctaKey: "dashboard.tile.wellness.cta",
    bgColor: "bg-[#fce7f3]", textColor: "text-[#be185d]", accentColor: "text-pink-600", hoverBlobColor: "bg-pink-50",
  },
  {
    id: "answers", href: "/ask", img: "/dashboard/rights.png",
    titleKey: "dashboard.tile.answers.title", descKey: "dashboard.tile.answers.desc", ctaKey: "dashboard.tile.answers.cta",
    bgColor: "bg-[#dcfce7]", textColor: "text-[#15803d]", accentColor: "text-emerald-600", hoverBlobColor: "bg-emerald-50",
  },
];

export function DashboardTeen({ lang, band }: DashboardTeenProps) {
  const today = new Date().toLocaleDateString(lang === "es" ? "es-US" : "en-US", {
    weekday: "long", month: "long", day: "numeric",
  });
  const reduce = useReducedMotion();

  return (
    <>
      {/* Background blob */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-sky-50/40 rounded-full blur-[140px] -z-10 translate-x-1/4 -translate-y-1/4 shadow-inner" />

      <div className="max-w-[1240px] mx-auto px-6 sm:px-12 py-10 sm:py-20">
        {/* Hero */}
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <h1 className="text-4xl sm:text-6xl font-black text-[#1e293b] mb-4 tracking-[-0.05em] leading-[0.9]">
              {tt("dashboard.greeting.morning", lang)}
            </h1>
            <p className="text-slate-400 text-lg font-bold tracking-tight">
              {tt("dashboard.greeting.subtitle", lang, { date: today })}
            </p>
          </div>
          <div className="bg-emerald-50/50 border border-emerald-100 px-6 py-4 rounded-2xl flex items-center gap-4">
            <div className="w-10 h-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center shrink-0">
              <Shield size={18} strokeWidth={3} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600">{tt("dashboard.privacy.label", lang)}</p>
              <p className="text-[13px] font-bold text-emerald-800 leading-tight">{tt("dashboard.privacy.body", lang)}</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-16 items-start">
          {/* Tiles */}
          <div className="lg:col-span-8 flex flex-col gap-10">
            <div className="grid sm:grid-cols-2 gap-8">
              {TILES.map((tile, idx) => (
                <motion.div
                  key={tile.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: reduce ? 0 : idx * 0.08, duration: reduce ? 0 : 0.4 }}
                >
                  <Link
                    href={`/${lang}${tile.href}`}
                    className="block bg-white p-10 rounded-[2.5rem] shadow-[0_24px_64px_rgba(0,0,0,0.02)] border border-white flex flex-col items-start gap-8 group hover:shadow-[0_32px_80px_rgba(0,0,0,0.1)] hover:-translate-y-2 transition-all text-left overflow-hidden relative"
                  >
                    <div className={`absolute top-0 right-0 w-32 h-32 ${tile.hoverBlobColor} rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity`} />
                    <div className={`w-16 h-16 ${tile.bgColor} rounded-[1.5rem] flex items-center justify-center overflow-hidden shadow-sm group-hover:scale-110 transition-transform`}>
                      <img src={tile.img} alt="" className="w-full h-full object-cover scale-[1.2]" />
                    </div>
                    <div className="flex flex-col gap-2 relative z-10">
                      <h4 className={`text-2xl font-black ${tile.textColor} tracking-tight leading-none`}>{tt(tile.titleKey, lang)}</h4>
                      <p className="text-slate-400 text-sm font-bold leading-relaxed">{tt(tile.descKey, lang)}</p>
                    </div>
                    <div className={`w-full pt-6 border-t border-slate-50 flex items-center justify-between ${tile.accentColor} font-black text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all`}>
                      {tt(tile.ctaKey, lang)} <ChevronRight size={14} strokeWidth={3} />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Side column */}
          <div className="lg:col-span-4 sticky top-10 flex flex-col gap-8">
            {/* Strategic Tip */}
            <div className="bg-[#1a2f44] text-white p-10 rounded-[2.5rem] shadow-[0_24px_80px_rgba(0,0,0,0.15)] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/5 blur-3xl rounded-full" />
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 bg-white shadow-[0_12px_24px_rgba(255,255,255,0.1)] rounded-2xl flex items-center justify-center shrink-0">
                  <Compass size={20} className="text-[#1a2f44]" strokeWidth={3} />
                </div>
                <h4 className="font-black text-lg tracking-tight">{tt("dashboard.tip.heading", lang)}</h4>
              </div>
              <p className="text-slate-100 text-base font-bold leading-relaxed mb-6">
                {ttBand("dashboard.tip", band, lang)}
              </p>
              <Link
                href={`/${lang}/ask`}
                className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                {tt("dashboard.tip.cta", lang)} <ChevronRight size={14} strokeWidth={3} />
              </Link>
            </div>

            {/* Crisis */}
            <div className="bg-rose-50 rounded-[2.5rem] p-10 border border-rose-100/50 shadow-sm flex flex-col items-center text-center group">
              <div className="w-20 h-20 bg-white rounded-[2rem] shadow-sm flex items-center justify-center mb-8 rotate-3 group-hover:rotate-0 transition-all">
                <Phone size={32} className="text-rose-500" />
              </div>
              <h5 className="font-black text-rose-900 mb-4 tracking-tight text-xl">{tt("dashboard.crisis.title", lang)}</h5>
              <p className="text-rose-700/60 text-sm font-bold leading-relaxed mb-10">{tt("dashboard.crisis.body", lang)}</p>
              <a
                href="tel:988"
                className="w-full py-5 rounded-2xl bg-rose-500 text-white font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-rose-200 hover:bg-rose-600 hover:-translate-y-1 active:translate-y-0 transition-all"
              >
                {tt("dashboard.crisis.cta", lang)}
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
