"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  UserCircle2, Scale, Briefcase, HeartHandshake, Shield, Users,
  Home as HomeIcon, Info, ChevronDown, ChevronUp, ArrowRight,
} from "lucide-react";
import type { Lang } from "../../lib/i18n";
import type { AgeBandKey } from "../../lib/prefs";
import { tt } from "../../lib/i18n-teen";
import { WHO_IN_YOUR_CASE } from "../../data/court";

type Theme = { primary: string; light: string; accent: string; shadow: string };

const THEMES: Record<string, Theme> = {
  emerald: { primary: "#115e59", light: "rgba(209, 250, 229, 0.4)", accent: "#34d399", shadow: "rgba(17, 94, 89, 0.15)" },
  indigo:  { primary: "#4338ca", light: "rgba(238, 242, 255, 0.5)", accent: "#818cf8", shadow: "rgba(67, 56, 202, 0.15)" },
  amber:   { primary: "#b45309", light: "rgba(255, 251, 235, 0.5)", accent: "#fbbf24", shadow: "rgba(180, 83, 9, 0.15)" },
  teal:    { primary: "#0f766e", light: "rgba(204, 251, 241, 0.4)", accent: "#2dd4bf", shadow: "rgba(15, 118, 110, 0.15)" },
  rose:    { primary: "#be123c", light: "rgba(255, 241, 242, 0.5)", accent: "#fb7185", shadow: "rgba(190, 18, 60, 0.15)" },
  violet:  { primary: "#6d28d9", light: "rgba(245, 243, 255, 0.5)", accent: "#a78bfa", shadow: "rgba(109, 40, 217, 0.15)" },
  slate:   { primary: "#334155", light: "rgba(248, 250, 252, 0.6)", accent: "#94a3b8", shadow: "rgba(51, 65, 85, 0.15)" },
};

const HEX_TO_THEME: Record<string, keyof typeof THEMES> = {
  "#2A7F8E": "teal",
  "#1B3A5C": "indigo",
  "#D97706": "amber",
  "#059669": "emerald",
  "#7c3aed": "violet",
};

const MEMBER_META: Record<string, { icon: typeof UserCircle2; short: { en: string; es: string } }> = {
  caseworker: { icon: UserCircle2,   short: { en: "Caseworker", es: "Trabajador/a" } },
  judge:      { icon: Scale,         short: { en: "Judge",      es: "Juez" } },
  attorney:   { icon: Briefcase,     short: { en: "Attorney",   es: "Abogado/a" } },
  casa:       { icon: HeartHandshake,short: { en: "CASA",       es: "CASA" } },
  caregiver:  { icon: HomeIcon,      short: { en: "Caregiver",  es: "Cuidador/a" } },
  gal:        { icon: Shield,        short: { en: "GAL",        es: "GAL" } },
  supervisor: { icon: Users,         short: { en: "Supervisor", es: "Supervisor" } },
};

const FAQS: { q: { en: string; es: string }; a: { en: string; es: string } }[] = [
  {
    q: { en: "Can I talk directly to the judge?",
         es: "¿Puedo hablar directamente con el juez?" },
    a: { en: "Yes — you have the right to address the judge. You can speak in court or request an in-chambers meeting. Your attorney can help you arrange it.",
         es: "Sí — tienes el derecho de dirigirte al juez. Puedes hablar en el tribunal o pedir una reunión en la cámara del juez. Tu abogado/a puede ayudarte." },
  },
  {
    q: { en: "Who should I contact if I feel unsafe?",
         es: "¿A quién contacto si me siento inseguro/a?" },
    a: { en: "Reach out to your caseworker, CASA, or attorney immediately. Their legal obligation is to make sure you're in a safe environment.",
         es: "Contacta a tu trabajador/a de casos, CASA o abogado/a de inmediato. Su obligación legal es asegurar que estés en un lugar seguro." },
  },
  {
    q: { en: "What if my placement isn't working out?",
         es: "¿Qué hago si mi ubicación no está funcionando?" },
    a: { en: "Tell your caseworker and attorney. They're obligated to listen and advocate for a transition plan if the placement isn't suitable.",
         es: "Dile a tu trabajador/a de casos y a tu abogado/a. Están obligados a escuchar y abogar por un cambio si la ubicación no es adecuada." },
  },
];

interface TeamTeenProps {
  lang: Lang;
  band: AgeBandKey;
}

export function TeamTeen({ lang, band }: TeamTeenProps) {
  const [openId, setOpenId] = useState<string>(WHO_IN_YOUR_CASE[0].id);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const reduce = useReducedMotion();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const active = scrollRef.current?.querySelector('[data-active="true"]');
    if (active) (active as HTMLElement).scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [openId]);

  const active = WHO_IN_YOUR_CASE.find((m) => m.id === openId) ?? WHO_IN_YOUR_CASE[0];
  const themeKey = HEX_TO_THEME[active.color] ?? "slate";
  const theme = THEMES[themeKey];

  const title = lang === "es" ? (active.title_es ?? active.title) : active.title;
  const aka   = lang === "es" ? (active.aka_es ?? active.aka)     : active.aka;
  const role  = lang === "es" ? (active.role_es ?? active.role)   : active.role;
  const what  = lang === "es" ? (active.what_es ?? active.what)   : active.what;
  const tip   = lang === "es" ? (active.tip_es ?? active.tip)     : active.tip;
  const teenTip = band === "10-12" ? undefined : active.teen_tips?.[band]?.[lang];
  const Icon = MEMBER_META[active.id]?.icon ?? UserCircle2;

  return (
    <div className="max-w-[1240px] mx-auto px-6 sm:px-12 py-10 sm:py-20">
      {/* Hero */}
      <div className="mb-14 md:mb-20">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600 mb-4">{tt("team.hero.tag", lang)}</p>
        <h1 className="text-4xl sm:text-6xl font-black text-[#1e293b] mb-6 tracking-[-0.05em] leading-[0.9]">
          {tt("team.hero.title", lang)}
        </h1>
        <p className="text-slate-500 text-lg sm:text-xl font-medium max-w-2xl leading-[1.6] tracking-tight border-l-[3px] border-emerald-100 pl-8">
          {tt("team.hero.subtitle", lang)}
        </p>
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-10">
        {/* Role list */}
        <div className="lg:col-span-4 -mx-6 px-6 md:mx-0 md:px-0">
          <div
            ref={scrollRef}
            className="flex lg:flex-col gap-3.5 overflow-x-auto lg:overflow-x-visible pb-6 md:pb-0 snap-x lg:max-h-[700px] lg:pr-2"
          >
            {WHO_IN_YOUR_CASE.map((m, idx) => {
              const isActive = openId === m.id;
              const mThemeKey = HEX_TO_THEME[m.color] ?? "slate";
              const mTheme = THEMES[mThemeKey];
              const MIcon = MEMBER_META[m.id]?.icon ?? UserCircle2;
              const short = MEMBER_META[m.id]?.short[lang] ?? m.id;
              return (
                <motion.button
                  key={m.id}
                  type="button"
                  data-active={isActive}
                  onClick={() => setOpenId(m.id)}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: reduce ? 0 : idx * 0.05, duration: reduce ? 0 : 0.3 }}
                  className={`snap-center flex-shrink-0 flex items-center gap-4 p-5 rounded-[1.5rem] transition-all duration-300 text-left relative group ${
                    isActive
                      ? "bg-white scale-[1.02] z-10 border-2"
                      : "bg-white/40 backdrop-blur border-2 border-transparent hover:bg-white hover:border-slate-200"
                  }`}
                  style={isActive ? { boxShadow: `0 12px 44px ${mTheme.shadow}`, borderColor: `${mTheme.primary}20` } : {}}
                >
                  <div
                    className="w-11 h-11 sm:w-12 sm:h-12 rounded-[1.1rem] flex items-center justify-center shrink-0 transition-all duration-300"
                    style={
                      isActive
                        ? { backgroundColor: mTheme.primary, color: "white", boxShadow: `0 8px 16px ${mTheme.shadow}` }
                        : { backgroundColor: "rgba(241, 245, 249, 0.8)" }
                    }
                  >
                    <MIcon size={20} strokeWidth={isActive ? 2.5 : 2} />
                  </div>
                  <span className="text-[15.5px] font-black tracking-tight leading-none"
                        style={{ color: isActive ? mTheme.primary : "#334155" }}>
                    {short}
                  </span>
                  {isActive && (
                    <motion.div layoutId="team-arrow" className="ml-auto hidden lg:block">
                      <ArrowRight size={18} style={{ color: mTheme.accent }} />
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
              className="bg-white rounded-[2.5rem] sm:rounded-[3.5rem] p-8 sm:p-14 border border-white relative overflow-hidden flex flex-col min-h-[600px]"
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

              <div className="flex items-start justify-between mb-12 relative z-10 w-full">
                <div className="max-w-md">
                  <h2 className="text-2xl sm:text-3xl font-black text-[#1e293b] mb-3 tracking-tighter leading-tight">{title}</h2>
                  <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest">{aka}</p>
                </div>
                <div
                  className="shrink-0 w-16 h-16 sm:w-24 sm:h-24 bg-white/70 backdrop-blur-xl rounded-[2rem] flex items-center justify-center border border-white relative"
                  style={{ color: theme.primary }}
                >
                  <div className="absolute inset-0 rounded-[2rem] blur-xl -z-10" style={{ backgroundColor: theme.light }} />
                  <Icon size={40} strokeWidth={1.5} />
                </div>
              </div>

              <div className="mb-12 relative z-10">
                <div
                  className="relative p-6 sm:p-8 rounded-[1.5rem] border"
                  style={{ backgroundColor: theme.light, borderColor: `${theme.primary}10` }}
                >
                  <p className="text-base sm:text-lg font-black leading-tight tracking-tight" style={{ color: theme.primary }}>
                    {role}
                  </p>
                </div>
              </div>

              <div className="flex-1 space-y-12 relative z-10">
                <p className="text-[#1e293b] text-base sm:text-lg font-medium leading-[1.8] tracking-tight max-w-3xl">
                  {what}
                </p>

                {(teenTip || tip) && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: reduce ? 0 : 0.2 }}
                    className="p-6 sm:p-8 rounded-[2.5rem] bg-sky-50/40 border border-sky-200/30 relative overflow-hidden"
                  >
                    <div className="flex gap-5 items-start">
                      <div className="mt-1 shrink-0 bg-sky-100 text-sky-600 p-2 rounded-xl ring-4 ring-white">
                        <Info size={22} />
                      </div>
                      <div>
                        <span className="uppercase tracking-[0.25em] text-[10px] text-sky-600 font-black mb-1.5 block">
                          {tt("team.label.insight", lang)}
                        </span>
                        <p className="text-[#0c4a6e] text-[15px] sm:text-[16px] font-black leading-[1.6]">
                          {teenTip ?? tip}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* FAQ section */}
      <div className="flex flex-col lg:grid lg:grid-cols-2 gap-16 md:gap-24 items-start py-16 md:py-32 border-t border-slate-200/80 mt-10">
        <div>
          <div className="w-12 h-1 bg-emerald-400 rounded-full mb-8" />
          <h2 className="text-3xl sm:text-4xl font-black text-[#1e293b] tracking-[-0.05em] mb-6 leading-[0.95]">
            {tt("team.faqs.heading", lang)}
          </h2>
          <p className="text-slate-500 font-bold text-lg sm:text-xl leading-relaxed max-w-sm tracking-tight">
            {tt("team.faqs.subheading", lang)}
          </p>
        </div>

        <div className="space-y-5 w-full">
          {FAQS.map((faq, idx) => {
            const isOpen = openFAQ === idx;
            return (
              <div
                key={idx}
                className={`transition-all duration-300 rounded-[2rem] border ${
                  isOpen
                    ? "bg-white shadow-[0_20px_48px_rgba(0,0,0,0.06)] border-[#115e59]/20"
                    : "bg-white/40 backdrop-blur border-white/50 hover:border-slate-300"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenFAQ(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between px-8 py-7 text-left"
                  aria-expanded={isOpen}
                >
                  <span className={`text-base sm:text-lg font-black pr-6 tracking-tight leading-tight ${isOpen ? "text-[#115e59]" : "text-slate-700"}`}>
                    {faq.q[lang]}
                  </span>
                  <div className={`shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
                    isOpen ? "bg-[#115e59] text-white" : "bg-slate-100 text-slate-400"
                  }`}>
                    {isOpen ? <ChevronUp size={20} strokeWidth={3} /> : <ChevronDown size={20} strokeWidth={3} />}
                  </div>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-8 pb-10">
                        <div className="pt-6 border-t border-slate-50 text-sm sm:text-base font-medium leading-[1.7] text-slate-500 tracking-tight">
                          {faq.a[lang]}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
