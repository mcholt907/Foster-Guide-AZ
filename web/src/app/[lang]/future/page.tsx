"use client";

import { useParams } from "next/navigation";
import { BookOpen, Sprout, Star, Users, type LucideIcon } from "lucide-react";
import type { Lang } from "../../../lib/i18n";
import { useOnboardingGate } from "../../../lib/useOnboardingGate";
import type { AgeBandKey } from "../../../lib/prefs";
import { ScreenHero, SafeNotice } from "../../../components/ui";
import { FutureTeen } from "../../../components/teen/FutureTeen";
import { FUTURE_1012 } from "../../../data/future";

const ICONS_1012: Record<string, LucideIcon> = {
  school: BookOpen,
  likes: Star,
  "grown-ups": Users,
};

export default function FuturePage() {
  const { lang: rawLang } = useParams<{ lang: string }>();
  const lang: Lang = rawLang === "es" ? "es" : "en";
  const prefs = useOnboardingGate(lang);

  // Default to the 13-15 teen variant when prefs aren't set yet (first-time
  // visitors, search engines). Avoids returning blank HTML on SSR.
  const band: AgeBandKey = prefs.ageBand ?? "13-15";
  if (band === "10-12") return <Future1012 lang={lang} />;

  return <FutureTeen lang={lang} band={band} />;
}

function Future1012({ lang }: { lang: Lang }) {
  const c = FUTURE_1012;
  return (
    <div className="pb-8">
      <ScreenHero
        icon={Sprout}
        title={c.title[lang]}
        subtitle={c.subtitle[lang]}
        gradient="from-[#D97706] to-[#b45309]"
        lang={lang}
      />

      <div className="mt-4 rounded-3xl bg-white/95 p-5 shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
        <p className="text-base text-slate-700 leading-relaxed">{c.intro[lang]}</p>
      </div>

      <div className="mt-4 space-y-3">
        {c.cards.map((card) => {
          const Icon = ICONS_1012[card.id] ?? Star;
          return (
            <div key={card.id} className="rounded-3xl bg-white/95 p-5 shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-2xl bg-[#E3F1F3] text-[#2A7F8E] flex items-center justify-center shrink-0">
                  <Icon size={20} strokeWidth={2.25} aria-hidden="true" />
                </div>
                <h2 className="text-lg font-bold text-[#1B3A5C]">{card.title[lang]}</h2>
              </div>
              <p className="text-base text-slate-700 leading-relaxed">{card.body[lang]}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-4 rounded-3xl bg-[#E3F1F3] p-5">
        <p className="text-base font-semibold text-[#1B3A5C] leading-relaxed">{c.closing[lang]}</p>
      </div>

      <div className="mt-4">
        <SafeNotice lang={lang} />
      </div>
    </div>
  );
}
