"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Home as HomeIcon, FolderOpen, Users, HeartPulse, HelpCircle,
  Shield, MapPin, Sparkles, Menu, X,
} from "lucide-react";
import type { Lang } from "../lib/i18n";
import { tt, type TeenStringKey } from "../lib/i18n-teen";
import { usePrefs } from "../lib/prefs";

export type TeenNavId =
  | "dashboard" | "case" | "team" | "wellness" | "answers"
  | "rights" | "resources" | "future";

interface TeenShellProps {
  active: TeenNavId;
  lang: Lang;
  children: React.ReactNode;
}

interface NavItem {
  id: TeenNavId;
  icon: typeof HomeIcon;
  href: string;
  labelKey: TeenStringKey;
}

const NAV_ITEMS: NavItem[] = [
  { id: "dashboard", icon: HomeIcon,    href: "",            labelKey: "nav.dashboard" },
  { id: "case",      icon: FolderOpen,  href: "/case",       labelKey: "nav.case" },
  { id: "team",      icon: Users,       href: "/team",       labelKey: "nav.team" },
  { id: "wellness",  icon: HeartPulse,  href: "/wellness",   labelKey: "nav.wellness" },
  { id: "answers",   icon: HelpCircle,  href: "/ask",        labelKey: "nav.answers" },
  { id: "rights",    icon: Shield,      href: "/rights",     labelKey: "nav.rights" },
  { id: "resources", icon: MapPin,      href: "/resources",  labelKey: "nav.resources" },
  { id: "future",    icon: Sparkles,    href: "/future",     labelKey: "nav.future" },
];

export function TeenShell({ active, lang, children }: TeenShellProps) {
  const router = useRouter();
  const [, , , reset] = usePrefs();
  const [confirmReset, setConfirmReset] = useState(false);

  function handleStartOver() {
    reset();
    router.push("/");
  }

  return (
    <div
      className="fixed inset-0 z-50 flex w-full bg-[#FDFBF7] text-[#2d3748] overflow-x-hidden selection:bg-emerald-100/80"
      style={{ fontFamily: "var(--font-inter), Inter, system-ui, sans-serif" }}
    >
      {/* Desktop sidebar */}
      <aside className="w-[300px] bg-[#1a2f44] text-white flex-shrink-0 hidden md:flex flex-col relative z-30 shadow-[4px_0_24px_rgba(0,0,0,0.05)]">
        <div className="p-10 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white shadow-[0_8px_20px_rgba(255,255,255,0.15)] rounded-2xl flex items-center justify-center overflow-hidden">
              <img src="/onboarding/welcome_icon.png" alt="" className="w-full h-full object-cover scale-[1.1] translate-y-1" />
            </div>
            <div className="flex flex-col text-left">
              <span className="font-black text-xl leading-tight tracking-tight">{tt("shell.brand", lang)}</span>
              <span className="text-[10px] uppercase tracking-[0.3em] text-emerald-400 font-black">{tt("shell.brand_sub", lang)}</span>
            </div>
          </div>
        </div>

        <nav className="flex flex-col px-6 gap-2 flex-1">
          {NAV_ITEMS.map((item) => {
            const isActive = item.id === active;
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                href={`/${lang}${item.href}`}
                className={`flex items-center gap-4 px-5 py-4 rounded-[1.25rem] transition-all duration-500 group relative ${
                  isActive
                    ? "bg-gradient-to-r from-white/15 to-transparent text-white font-bold shadow-[0_4px_12px_rgba(0,0,0,0.1)]"
                    : "text-slate-400 hover:bg-white/5 hover:text-white font-medium"
                }`}
              >
                <Icon size={20} className={`shrink-0 transition-all duration-300 group-hover:scale-110 ${isActive ? "text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]" : ""}`} />
                <span className="text-[15.5px] tracking-tight">{tt(item.labelKey, lang)}</span>
                {isActive && <motion.div layoutId="nav-pill" className="absolute left-0 w-1.5 h-8 bg-emerald-400 rounded-r-full shadow-[0_0_12px_rgba(52,211,153,0.8)]" />}
              </Link>
            );
          })}
        </nav>

        {/* Footer: band+lang badge + start-over */}
        <div className="p-8">
          <TeenShellFooter lang={lang} confirmReset={confirmReset} setConfirmReset={setConfirmReset} handleStartOver={handleStartOver} />
        </div>
      </aside>

      {/* Main content area */}
      <main className="flex-1 overflow-y-auto relative w-full pb-24 md:pb-0 scroll-smooth">
        {children}
      </main>
    </div>
  );
}

function TeenShellFooter({
  lang, confirmReset, setConfirmReset, handleStartOver,
}: {
  lang: Lang;
  confirmReset: boolean;
  setConfirmReset: (v: boolean) => void;
  handleStartOver: () => void;
}) {
  const [prefs] = usePrefs();
  const band = prefs.ageBand ?? "13-15";
  const langKey: TeenStringKey = lang === "es" ? "shell.band_language.es" : "shell.band_language.en";

  return (
    <div className="w-full p-6 rounded-[2rem] bg-gradient-to-br from-white/5 to-transparent border border-white/10 relative overflow-hidden group">
      <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-emerald-500/10 blur-2xl rounded-full" />
      <Shield size={20} className="text-emerald-400 mb-3" />
      <p className="text-white text-[13px] font-black leading-relaxed mb-1 tracking-tight">{tt("shell.command_center", lang)}</p>
      <p className="text-slate-400 text-[10px] leading-relaxed font-bold opacity-80 uppercase tracking-widest">
        {tt(langKey, lang, { band })}
      </p>

      {!confirmReset ? (
        <button
          type="button"
          onClick={() => setConfirmReset(true)}
          className="mt-4 text-[11px] text-slate-400 underline hover:text-white transition-colors"
        >
          {tt("shell.start_over", lang)}
        </button>
      ) : (
        <div className="mt-4 space-y-2">
          <p className="text-[11px] text-slate-300 leading-relaxed">{tt("shell.start_over_confirm", lang)}</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleStartOver}
              className="flex-1 text-[11px] font-bold bg-emerald-500 text-white rounded-xl py-2 hover:bg-emerald-600 transition"
            >
              {tt("shell.start_over_yes", lang)}
            </button>
            <button
              type="button"
              onClick={() => setConfirmReset(false)}
              className="flex-1 text-[11px] font-bold bg-white/10 text-white rounded-xl py-2 hover:bg-white/20 transition"
            >
              {tt("shell.start_over_no", lang)}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
