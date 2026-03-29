"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Gavel, ChevronDown, ChevronUp, Users } from "lucide-react";
import type { Lang } from "../../../lib/i18n";
import { useOnboardingGate } from "../../../lib/useOnboardingGate";
import type { AgeBandKey } from "../../../lib/prefs";
import { COURT_STAGES, WHO_IN_YOUR_CASE } from "../../../data/court";
import { ScreenHero, SafeNotice } from "../../../components/ui";

export default function CasePage() {
  const { lang: rawLang } = useParams<{ lang: string }>();
  const lang: Lang = rawLang === "es" ? "es" : "en";
  const prefs = useOnboardingGate(lang);
  const band = (prefs.ageBand ?? "13-15") as AgeBandKey;

  const [openStage, setOpenStage] = useState<string | null>(null);
  const [openPerson, setOpenPerson] = useState<string | null>(null);
  const [showWho, setShowWho] = useState(true);

  return (
    <div className="pb-8">
      <ScreenHero
        icon={Gavel}
        title={lang === "es" ? "Mi caso explicado" : "My Case Explained"}
        subtitle={
          lang === "es"
            ? "Qué significan tus audiencias y cómo prepararte."
            : "What your hearings mean and how to prepare."
        }
        gradient="from-[#2A7F8E] via-[#1a5f7e] to-[#1B3A5C]"
        lang={lang}
      />

      {/* Who's in your case */}
      <div className="mt-4 rounded-3xl bg-white/95 shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden">
        <button
          onClick={() => setShowWho((v) => !v)}
          className="w-full flex items-center gap-3 px-4 py-4 text-left"
        >
          <div className="rounded-2xl bg-[#2A7F8E]/10 p-2">
            <Users className="h-5 w-5 text-[#2A7F8E]" />
          </div>
          <div className="flex-1">
            <div className="text-base font-semibold text-[#1B3A5C]">
              {lang === "es" ? "¿Quién está en tu caso?" : "Who's in your case?"}
            </div>
            <div className="text-sm sm:text-xs text-slate-500">
              {lang === "es"
                ? "Las personas en el tribunal y lo que hacen"
                : "The people in court and what they do"}
            </div>
          </div>
          {showWho ? (
            <ChevronUp className="h-5 w-5 text-[#2A7F8E] stroke-[2] shrink-0" />
          ) : (
            <ChevronDown className="h-5 w-5 text-[#2A7F8E] stroke-[2] shrink-0" />
          )}
        </button>

        {showWho && (
          <div className="border-t border-slate-100 px-4 py-3 grid gap-2">
            {WHO_IN_YOUR_CASE.map((person) => {
              const isOpen = openPerson === person.id;
              return (
                <div
                  key={person.id}
                  className="rounded-2xl bg-slate-50/80 ring-1 ring-slate-200 overflow-hidden"
                >
                  <button
                    onClick={() => setOpenPerson(isOpen ? null : person.id)}
                    className="w-full flex items-center gap-3 px-3 py-3 text-left"
                  >
                    <span className="text-lg">{person.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-slate-900">
                        {lang === "es" ? person.title_es : person.title}
                      </div>
                      <div className="text-sm sm:text-xs text-slate-400">
                        {lang === "es" ? person.role_es : person.role}
                      </div>
                    </div>
                    {isOpen ? (
                      <ChevronUp className="h-4 w-4 text-[#2A7F8E] stroke-[2] shrink-0" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-[#2A7F8E] stroke-[2] shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="border-t border-slate-100 px-3 py-3 grid gap-2">
                      <p className="text-sm sm:text-xs text-slate-600 leading-relaxed">
                        {lang === "es" ? person.what_es : person.what}
                      </p>
                      <div className="rounded-xl bg-white p-2.5 ring-1 ring-slate-200">
                        <span className="text-xs font-semibold text-[#D97706]">
                          {lang === "es" ? "Consejo: " : "Tip: "}
                        </span>
                        <span className="text-sm sm:text-xs text-slate-600">
                          {lang === "es" ? person.tip_es : person.tip}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Court timeline */}
      <div className="mt-4">
        <div className="text-sm font-semibold text-[#1B3A5C] mb-3 px-1">
          {lang === "es" ? "Las audiencias, explicadas" : "The hearings, explained"}
        </div>
        <div className="grid gap-3">
          {COURT_STAGES.map((stage, idx) => {
            const isOpen = openStage === stage.id;
            return (
              <div
                key={stage.id}
                className="rounded-3xl bg-white/95 shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden"
              >
                <button
                  onClick={() => setOpenStage(isOpen ? null : stage.id)}
                  className="w-full flex items-center gap-3 px-4 py-4 text-left"
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#1B3A5C] text-xs font-bold text-white">
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-[#1B3A5C] leading-snug">
                      {band === "10-12"
                        ? (lang === "es" ? stage.title_es : stage.title).replace(/\s*\(.*?\)/, "").trim()
                        : (lang === "es" ? stage.title_es : stage.title)}
                    </div>
                  </div>
                  {isOpen ? (
                    <ChevronUp className="h-5 w-5 text-[#2A7F8E] stroke-[2] shrink-0" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-[#2A7F8E] stroke-[2] shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="border-t border-slate-100 px-4 py-4 grid gap-3">
                    <div>
                      <div className="text-xs font-semibold text-slate-400 mb-1">
                        {lang === "es" ? "Qué pasa" : "What happens"}
                      </div>
                      <p className="text-sm text-slate-700 leading-relaxed">
                        {lang === "es" ? stage.what_es : stage.what}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-[#D97706]/8 p-3">
                      <div className="text-xs font-semibold text-[#D97706] mb-1">
                        {lang === "es" ? "✏️ Para ti" : "✏️ For you"}
                      </div>
                      <p className="text-sm sm:text-xs text-slate-600 leading-relaxed">
                        {lang === "es" ? stage.youth_es : stage.youth}
                      </p>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-400 mb-1">
                        {lang === "es" ? "Qué sigue" : "What's next"}
                      </div>
                      <p className="text-sm sm:text-xs text-slate-600 leading-relaxed">
                        {lang === "es" ? stage.next_es : stage.next}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4">
        <SafeNotice lang={lang} />
      </div>
    </div>
  );
}
