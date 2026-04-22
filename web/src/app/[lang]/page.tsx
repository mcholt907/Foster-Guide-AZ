"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Phone, HelpCircle, RefreshCw } from "lucide-react";
import type { Lang } from "../../lib/i18n";
import { t } from "../../lib/i18n";
import { useOnboardingGate } from "../../lib/useOnboardingGate";
import { usePrefs } from "../../lib/prefs";
import type { AgeBandKey } from "../../lib/prefs";
import { TeenShell } from "../../components/TeenShell";
import { DashboardTeen } from "../../components/teen/DashboardTeen";

// ── 10-12 tile dashboard ──────────────────────────────────────────────────────

function Dashboard1012({ lang }: { lang: Lang }) {
  const router = useRouter();
  const [,,, reset] = usePrefs();
  const [chipOpen, setChipOpen] = useState(false);

  return (
    <div className="pb-8">
      {/* Header */}
      <div className="pt-8 pb-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-[#136d41] leading-tight">
          {lang === "es" ? "¿Cómo podemos ayudarte hoy?" : "What can we help you with today?"}
        </h1>
        <button
          type="button"
          onClick={() => setChipOpen((o) => !o)}
          className={`flex items-center gap-1.5 mt-3 w-fit pl-3.5 pr-2.5 py-1.5 rounded-full text-xs font-semibold shadow-sm border transition-colors ${
            chipOpen
              ? "bg-[#136d41] text-white border-[#136d41]"
              : "bg-white/70 text-slate-500 border-slate-200 hover:bg-white hover:border-slate-300"
          }`}
        >
          <span>{lang === "es" ? "10–12 años · Español" : "Ages 10–12 · English"}</span>
          <RefreshCw size={12} className={`transition-transform ${chipOpen ? "rotate-180" : ""}`} />
        </button>

        {chipOpen && (
          <div className="mt-3 bg-white rounded-[20px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.08)] border-2 border-[#fbbf24]">
            <p className="text-sm font-semibold text-[#35322d] mb-1">
              {lang === "es" ? "¿Cambiar configuración?" : "Change your settings?"}
            </p>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              {lang === "es"
                ? "Esto borra tu grupo de edad e idioma. Empezarás de nuevo desde el principio."
                : "This clears your age group and language. You'll start fresh from the beginning."}
            </p>
            <button
              type="button"
              onClick={() => { reset(); router.push('/'); }}
              className="w-full rounded-full bg-[#136d41] px-4 py-3 text-sm font-bold text-white shadow-sm hover:bg-[#0f5c35] transition-colors mb-2"
            >
              ↩ {lang === "es" ? "Sí, empezar de nuevo" : "Yes, start over"}
            </button>
            <button
              type="button"
              onClick={() => setChipOpen(false)}
              className="w-full text-center text-xs font-semibold text-slate-400 hover:text-slate-600 py-1 transition-colors"
            >
              {lang === "es" ? "Cancelar" : "Never mind"}
            </button>
          </div>
        )}
      </div>

      {/* 2×2 tile grid */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {/* Meet Your Team */}
        <Link
          href={`/${lang}/team`}
          className="aspect-[4/3] bg-[#fff4cc] rounded-[2rem] p-5 flex flex-col justify-center gap-2 items-start text-left shadow-sm border border-black/5 hover:scale-[1.02] transition-transform active:scale-95"
        >
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-[1.5rem] flex items-center justify-center overflow-hidden mix-blend-multiply drop-shadow-sm">
            <Image src="/avatars/group_avatar.png" alt="" width={192} height={192} className="w-full h-full object-cover scale-[1.3] pt-2" />
          </div>
          <span className="font-bold text-[#78350f] text-lg leading-none">
            {lang === "es" ? "Mi equipo" : "My team"}
          </span>
        </Link>

        {/* My Case Explained */}
        <Link
          href={`/${lang}/case`}
          className="aspect-[4/3] bg-[#e0f2fe] rounded-[2rem] p-5 flex flex-col justify-center gap-2 items-start text-left shadow-sm border border-black/5 hover:scale-[1.02] transition-transform active:scale-95"
        >
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center overflow-hidden drop-shadow-sm">
            <Image src="/dashboard/case.png" alt="" width={192} height={192} className="w-full h-full object-cover scale-[1.2]" />
          </div>
          <span className="font-bold text-[#0c4a6e] text-lg leading-none">
            {lang === "es" ? "Mi caso explicado" : "My case explained"}
          </span>
        </Link>

        {/* Wellness Check-In */}
        <Link
          href={`/${lang}/wellness`}
          className="aspect-[4/3] bg-[#fce7f3] rounded-[2rem] p-5 flex flex-col justify-center gap-2 items-start text-left shadow-sm border border-black/5 hover:scale-[1.02] transition-transform active:scale-95"
        >
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center overflow-hidden drop-shadow-sm">
            <Image src="/dashboard/wellness.png" alt="" width={192} height={192} className="w-full h-full object-cover scale-[1.2]" />
          </div>
          <span className="font-bold text-[#831843] text-lg leading-none">
            {t("home_wellness_short", lang)}
          </span>
        </Link>

        {/* Find Answers */}
        <Link
          href={`/${lang}/ask`}
          className="aspect-[4/3] bg-[#dcfce7] rounded-[2rem] p-5 flex flex-col justify-center gap-2 items-start text-left shadow-sm border border-black/5 hover:scale-[1.02] transition-transform active:scale-95"
        >
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#bbf7d0] flex items-center justify-center drop-shadow-sm">
            <HelpCircle size={28} className="text-[#136d41]" />
          </div>
          <span className="font-bold text-[#14532d] text-lg leading-none">
            {t("home_find_answers", lang)}
          </span>
        </Link>
      </div>

      {/* Divider */}
      <div className="flex items-center justify-center mb-6">
        <div className="h-px bg-slate-200 flex-1" />
        <span className="px-3 text-[10px] font-bold tracking-widest text-[#a09c98] uppercase">
          {t("home_support_safety", lang)}
        </span>
        <div className="h-px bg-slate-200 flex-1" />
      </div>

      {/* Crisis line */}
      <a
        href="tel:988"
        className="bg-white rounded-[1.5rem] p-4 flex items-center gap-4 shadow-sm border border-black/5 hover:bg-slate-50 transition-colors"
      >
        <div className="w-12 h-12 rounded-full bg-[#fee2e2] flex shrink-0 items-center justify-center text-[#b91c1c]">
          <Phone size={20} />
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-[#35322d]">{t("home_988_title", lang)}</h4>
          <p className="text-xs text-[#a09c98] mt-0.5">
            {t("home_988_subtitle", lang)}
          </p>
        </div>
        <div className="w-10 h-10 rounded-full bg-[#fee2e2] flex items-center justify-center text-[#b91c1c] shrink-0">
          <Phone size={16} />
        </div>
      </a>

      {/* Language switcher */}
      <div className="mt-6 text-center text-xs text-slate-400">
        {lang === "es" ? (
          <Link href="/en" className="underline hover:text-slate-600">Switch to English</Link>
        ) : (
          <Link href="/es" className="underline hover:text-slate-600">Cambiar a Español</Link>
        )}
      </div>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────

export default function HomePage() {
  const { lang: rawLang } = useParams<{ lang: string }>();
  const lang: Lang = rawLang === "es" ? "es" : "en";
  const prefs = useOnboardingGate(lang);

  if (!prefs.ageBand) return null;
  if (prefs.ageBand === "10-12") {
    return <Dashboard1012 lang={lang} />;
  }

  const band = prefs.ageBand as AgeBandKey;
  return (
    <TeenShell active="dashboard" lang={lang}>
      <DashboardTeen lang={lang} band={band} />
    </TeenShell>
  );
}
