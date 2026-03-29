"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Shield, ChevronDown, ChevronUp } from "lucide-react";
import type { Lang } from "../../../lib/i18n";
import { t } from "../../../lib/i18n";
import { useOnboardingGate } from "../../../lib/useOnboardingGate";
import type { AgeBandKey } from "../../../lib/prefs";
import { RIGHTS, ESCALATION_STEPS } from "../../../data/rights";
import { ScreenHero, SafeNotice } from "../../../components/ui";

type RightsTab = "what" | "how" | "ignored";

export default function RightsPage() {
  const { lang: rawLang } = useParams<{ lang: string }>();
  const lang: Lang = rawLang === "es" ? "es" : "en";
  const prefs = useOnboardingGate(lang);

  const [openRight, setOpenRight] = useState<string | null>("participate");
  const [activeTab, setActiveTab] = useState<Record<string, RightsTab>>({});

  const band = (prefs.ageBand ?? "13-15") as AgeBandKey;

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
        title={lang === "es" ? "Conoce tus derechos" : "Know Your Rights"}
        subtitle={
          lang === "es"
            ? "Tus derechos bajo la ley de Arizona — en palabras simples."
            : "Your rights under Arizona law — in plain words."
        }
        gradient="from-[#2A7F8E] via-[#1a5f7e] to-[#1B3A5C]"
        lang={lang}
      />

      {/* Rights cards */}
      <div className="mt-4 grid gap-3">
        {RIGHTS.map((right) => {
          const isOpen = openRight === right.id;
          const tier = right.tiers[band];
          const tab = getTab(right.id);

          return (
            <div
              key={right.id}
              className="rounded-3xl bg-white/95 shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden"
            >
              {/* Header */}
              <button
                onClick={() => setOpenRight(isOpen ? null : right.id)}
                className="w-full flex items-center justify-between px-4 py-4 text-left"
              >
                <div>
                  <div className="text-base font-semibold text-[#1B3A5C]">
                    {lang === "es"
                      ? right.id === "participate"
                        ? "Tener voz en tu caso"
                        : right.id === "privacy"
                        ? "Tu privacidad y comunicación"
                        : "Ver a tus hermanos y hermanas"
                      : right.title}
                  </div>
                  {band !== "10-12" && (
                    <div className="mt-0.5 text-xs text-[#2A7F8E] font-medium">
                      {right.citation}
                    </div>
                  )}
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
                          : band === "10-12"
                            ? (lang === "es" ? "Si nadie escucha" : "If nobody listens")
                            : t("rights_tab_ignored", lang)}
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
                            {lang === "es" ? "💬 Por ejemplo" : "💬 For example"}
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

      {/* Escalation ladder — simplified for 10-12, full for older */}
      {band === "10-12" ? (
        <div className="mt-4 rounded-3xl bg-white/95 p-4 shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">📣</span>
            <div className="text-base font-semibold text-[#1B3A5C]">
              {lang === "es" ? "Si sientes que algo está mal" : "If something feels wrong"}
            </div>
          </div>
          <div className="grid gap-3">
            {[
              {
                emoji: "👤",
                who: "Tell your caseworker",
                who_es: "Dile a tu trabajador/a de casos",
                what: "They should help fix it. Tell them clearly what you need.",
                what_es: "Deben ayudarte a resolverlo. Diles claramente lo que necesitas.",
              },
              {
                emoji: "📋",
                who: "Tell your lawyer",
                who_es: "Dile a tu abogado/a",
                what: "Your lawyer's only job is to speak up for you. Tell them if something isn't right.",
                what_es: "El único trabajo de tu abogado es hablar por ti. Dile si algo no está bien.",
              },
              {
                emoji: "🏫",
                who: "Tell a trusted adult",
                who_es: "Dile a un adulto de confianza",
                what: "A teacher, school counselor, or another grown-up you trust can help you ask.",
                what_es: "Un maestro, consejero escolar u otro adulto de confianza puede ayudarte a pedir.",
              },
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-xl shrink-0 mt-0.5">{step.emoji}</span>
                <div>
                  <div className="text-sm font-semibold text-slate-900">
                    {lang === "es" ? step.who_es : step.who}
                  </div>
                  <div className="mt-0.5 text-sm sm:text-xs text-slate-500 leading-snug">
                    {lang === "es" ? step.what_es : step.what}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 rounded-2xl bg-[#2A7F8E]/8 p-3">
            <p className="text-sm sm:text-xs text-[#1B3A5C] leading-relaxed">
              {lang === "es"
                ? "💙 No tienes que resolver esto solo/a. Pedir ayuda siempre está bien."
                : "💙 You don't have to figure this out alone. Asking for help is always okay."}
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-4 rounded-3xl bg-white/95 p-4 shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">📣</span>
            <div className="text-base font-semibold text-[#1B3A5C]">
              {t("rights_escalation_title", lang)}
            </div>
          </div>
          <div className="grid gap-3">
            {ESCALATION_STEPS.map((step) => (
              <div key={step.step} className="flex items-start gap-3">
                <div className="mt-0.5 h-6 w-6 rounded-full bg-[#2A7F8E] flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-white">{step.step}</span>
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-900">
                    {lang === "es" ? step.who_es : step.who}
                  </div>
                  <div className="mt-0.5 text-sm sm:text-xs text-slate-500 leading-snug">
                    {lang === "es" ? step.what_es : step.what}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4">
        <SafeNotice lang={lang} />
      </div>
    </div>
  );
}
