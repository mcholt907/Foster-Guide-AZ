"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Shield, ChevronDown, ChevronUp, User, Scale, School } from "lucide-react";
import type { Lang } from "../../../lib/i18n";
import { t } from "../../../lib/i18n";
import { useOnboardingGate } from "../../../lib/useOnboardingGate";
import type { AgeBandKey } from "../../../lib/prefs";
import { RIGHTS } from "../../../data/rights";
import { ScreenHero, SafeNotice } from "../../../components/ui";
import { RightsTeen, RIGHT_ICONS } from "../../../components/teen/RightsTeen";
import { tr } from "../../../lib/i18n-rights";

type RightsTab = "what" | "how" | "ignored";

const WRONG_STEPS = [
  { icon: User, who: "wrong.1.who", what: "wrong.1.what" },
  { icon: Scale, who: "wrong.2.who", what: "wrong.2.what" },
  { icon: School, who: "wrong.3.who", what: "wrong.3.what" },
] as const;

export default function RightsPage() {
  const { lang: rawLang } = useParams<{ lang: string }>();
  const lang: Lang = rawLang === "es" ? "es" : "en";
  const prefs = useOnboardingGate(lang);

  // Default to the 13-15 teen variant when prefs aren't set yet (first-time
  // visitors, search engines). Avoids returning blank HTML on SSR.
  const band: AgeBandKey = prefs.ageBand ?? "13-15";
  if (band === "10-12") return <Rights1012 lang={lang} />;

  return <RightsTeen lang={lang} band={band} />;
}

function Rights1012({ lang }: { lang: Lang }) {
  const [openRight, setOpenRight] = useState<string | null>(RIGHTS[0]?.id ?? null);
  const [activeTab, setActiveTab] = useState<Record<string, RightsTab>>({});

  const band: AgeBandKey = "10-12";

  function getTab(id: string): RightsTab {
    return activeTab[id] ?? "what";
  }
  function setTab(id: string, tab: RightsTab) {
    setActiveTab((prev) => ({ ...prev, [id]: tab }));
  }

  return (
    <div className="pb-8">
      <ScreenHero
        icon={Shield}
        title={tr("hero.title", lang)}
        subtitle={tr("hero.subtitle", lang)}
        gradient="from-[#2A7F8E] via-[#1a5f7e] to-[#1B3A5C]"
        lang={lang}
      />

      {/* Rights cards */}
      <p className="mt-4 px-1 text-sm font-medium text-slate-600">{tr("list.hint", lang)}</p>
      <div className="mt-2 grid gap-3">
        {RIGHTS.map((right) => {
          const isOpen = openRight === right.id;
          const tier = right.tiers[band];
          const tab = getTab(right.id);
          const Icon = RIGHT_ICONS[right.id] ?? Shield;

          return (
            <div
              key={right.id}
              className="rounded-3xl bg-white/95 shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden"
            >
              {/* Header */}
              <button
                onClick={() => setOpenRight(isOpen ? null : right.id)}
                aria-expanded={isOpen}
                className="w-full flex items-center justify-between gap-3 px-4 py-4 text-left"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="shrink-0 flex h-10 w-10 items-center justify-center rounded-2xl bg-[#2A7F8E]/10 text-[#2A7F8E]">
                    <Icon className="h-5 w-5" strokeWidth={2.25} aria-hidden="true" />
                  </span>
                  <div className="text-base font-semibold text-[#1B3A5C] leading-snug">
                    {lang === "es" ? right.title_es : right.title}
                  </div>
                </div>
                {isOpen ? (
                  <ChevronUp className="h-5 w-5 text-[#2A7F8E] stroke-[2] shrink-0" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-[#2A7F8E] stroke-[2] shrink-0" />
                )}
              </button>

              {/* Expanded content */}
              {isOpen && (
                <div className="border-t border-slate-100">
                  {/* Tabs */}
                  <div className="flex border-b border-slate-100">
                    {(["what", "how", "ignored"] as RightsTab[]).map((tabKey) => (
                      <button
                        key={tabKey}
                        onClick={() => setTab(right.id, tabKey)}
                        className={
                          "flex-1 py-2.5 text-xs font-semibold transition-colors " +
                          (tab === tabKey
                            ? "text-[#2A7F8E] border-b-2 border-[#2A7F8E]"
                            : "text-slate-400 hover:text-slate-600")
                        }
                      >
                        {tabKey === "what"
                          ? t("rights_tab_what", lang)
                          : tabKey === "how"
                          ? t("rights_tab_how", lang)
                          : tr("tab.ignored", lang)}
                      </button>
                    ))}
                  </div>

                  {/* Tab body */}
                  <div className="px-4 py-4">
                    {tab === "what" && (
                      <div>
                        <p className="text-sm text-slate-700 leading-relaxed">
                          {lang === "es" ? tier.plain_es : tier.plain}
                        </p>
                        <div className="mt-3 rounded-2xl bg-[#2A7F8E]/8 p-3">
                          <div className="text-xs font-semibold text-[#2A7F8E] mb-1">
                            {tr("example", lang)}
                          </div>
                          <p className="text-sm sm:text-xs text-slate-600 leading-relaxed">
                            {lang === "es" ? tier.example_es : tier.example}
                          </p>
                        </div>
                      </div>
                    )}
                    {tab === "how" && (
                      <p className="text-sm text-slate-700 leading-relaxed">
                        {lang === "es" ? tier.howToAsk_es : tier.howToAsk}
                      </p>
                    )}
                    {tab === "ignored" && (
                      <p className="text-sm text-slate-700 leading-relaxed">
                        {lang === "es" ? tier.ifIgnored_es : tier.ifIgnored}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Who to tell — simplified for 10-12 */}
      <div className="mt-4 rounded-3xl bg-white/95 p-4 shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
        <div className="text-base font-semibold text-[#1B3A5C] mb-3">
          {tr("wrong.title", lang)}
        </div>
        <div className="grid gap-3">
          {WRONG_STEPS.map((step) => (
            <div key={step.who} className="flex items-start gap-3">
              <span className="shrink-0 mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl bg-[#2A7F8E]/10 text-[#2A7F8E]">
                <step.icon className="h-[18px] w-[18px]" strokeWidth={2.25} aria-hidden="true" />
              </span>
              <div>
                <div className="text-sm font-semibold text-slate-900">{tr(step.who, lang)}</div>
                <div className="mt-0.5 text-sm text-slate-600 leading-snug">{tr(step.what, lang)}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 rounded-2xl bg-[#2A7F8E]/8 p-3">
          <p className="text-sm text-[#1B3A5C] leading-relaxed">{tr("wrong.note", lang)}</p>
        </div>
      </div>

      <div className="mt-4">
        <SafeNotice lang={lang} />
      </div>
    </div>
  );
}
