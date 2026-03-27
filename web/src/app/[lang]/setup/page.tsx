"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import type { Lang } from "../../../lib/i18n";
import { t } from "../../../lib/i18n";
import { usePrefs } from "../../../lib/prefs";
import { COUNTIES, AGE_BANDS } from "../../../data/constants";
import { Divider } from "../../../components/ui";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function SetupPage() {
  const { lang: rawLang } = useParams<{ lang: string }>();
  const lang: Lang = rawLang === "es" ? "es" : "en";
  const router = useRouter();
  const [,, patch] = usePrefs();

  const [step, setStep] = useState(0);
  const [ageBand, setAgeBand] = useState<string | null>(null);
  const [county, setCounty] = useState<string | null>(null);
  const [tribal, setTribal] = useState<boolean | null>(null);

  const isReady =
    step === 0 ? !!ageBand
    : step === 1 ? !!county
    : step === 2 ? tribal !== null
    : true;

  function handleDone() {
    patch({
      ageBand: ageBand as "10-12" | "13-15" | "16-17" | "18-21" | null,
      county,
      tribal: tribal ?? false,
      onboardingDone: true,
    });
    router.push(`/${lang}`);
  }

  return (
    <div className="pb-8">
      {/* Hero banner */}
      <div className="mb-5 rounded-3xl bg-gradient-to-br from-[#2A7F8E] to-[#1B3A5C] p-6 shadow-md">
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 shadow-md">
          <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
            <circle cx="12" cy="12" r="4" fill="white" />
            <path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.93 4.93l1.77 1.77M17.3 17.3l1.77 1.77M4.93 19.07l1.77-1.77M17.3 6.7l1.77-1.77" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <div className="text-2xl font-bold text-white leading-snug">
          {lang === "es" ? <>Bienvenido a<br />FosterHub AZ</> : <>Welcome to<br />FosterHub AZ</>}
        </div>
        <div className="mt-2 text-sm text-white/80 leading-relaxed">
          {t("onboarding_welcome_subtitle", lang)}
        </div>
      </div>

      {/* Step card */}
      <div className="rounded-3xl bg-white/85 p-5 shadow-sm ring-1 ring-black/5">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm font-semibold text-[#1B3A5C]">
            {step === 0
              ? t("onboarding_step_age", lang)
              : step === 1
                ? t("onboarding_step_county", lang)
                : t("onboarding_step_tribal", lang)}
          </div>
          {/* 4-dot indicator — step 0 (language) is already done */}
          <div className="flex gap-1.5 items-center">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={
                  "h-2 rounded-full transition-all duration-300 " +
                  (i === 0
                    ? "w-2 bg-[#2A7F8E]/35"          // language step: completed
                    : i === step + 1
                      ? "w-6 bg-[#2A7F8E]"           // current step (offset by 1)
                      : i < step + 1
                        ? "w-2 bg-[#2A7F8E]/35"      // past step
                        : "w-2 bg-slate-200")         // future step
                }
              />
            ))}
          </div>
        </div>

        {/* Step 0: Age band */}
        {step === 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {AGE_BANDS.map((b) => {
              const descKey =
                b.id === "10-12" ? "age_band_10_12_desc"
                : b.id === "13-15" ? "age_band_13_15_desc"
                : b.id === "16-17" ? "age_band_16_17_desc"
                : "age_band_18_21_desc";
              return (
                <button
                  key={b.id}
                  onClick={() => { setAgeBand(b.id); setStep(1); }}
                  className={
                    "rounded-3xl p-4 text-left ring-1 transition-all " +
                    (ageBand === b.id
                      ? "bg-[#1B3A5C] ring-[#1B3A5C] shadow-sm"
                      : "bg-white ring-black/10 hover:ring-black/20")
                  }
                >
                  <div className={`text-base font-bold ${ageBand === b.id ? "text-white" : "text-slate-900"}`}>{b.label}</div>
                  <div className={`mt-0.5 text-xs ${ageBand === b.id ? "text-white/70" : "text-slate-500"}`}>
                    {t(descKey as Parameters<typeof t>[0], lang)}
                  </div>
                </button>
              );
            })}
          </div>
        ) : null}

        {/* Step 1: County */}
        {step === 1 ? (
          <div>
            <div className="text-xs text-slate-500 mb-3">{t("onboarding_county_hint", lang)}</div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => { setCounty("Unknown"); setStep(2); }}
                className={
                  "col-span-2 rounded-2xl px-3 py-2.5 text-center text-sm font-semibold ring-1 transition-all " +
                  (county === "Unknown"
                    ? "bg-[#1B3A5C] ring-[#1B3A5C] text-white"
                    : "bg-white ring-black/10 text-slate-500 hover:ring-black/20")
                }
              >
                {t("onboarding_county_unknown", lang)}
              </button>
              {COUNTIES.map((c) => (
                <button
                  key={c}
                  onClick={() => { setCounty(c); setStep(2); }}
                  className={
                    "rounded-2xl px-3 py-2.5 text-left text-sm font-semibold ring-1 transition-all " +
                    (county === c
                      ? "bg-[#1B3A5C] ring-[#1B3A5C] text-white"
                      : "bg-white ring-black/10 text-slate-700 hover:ring-black/20")
                  }
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {/* Step 2: Tribal */}
        {step === 2 ? (
          <div>
            <div className="text-xs text-slate-500 mb-3">{t("onboarding_tribal_hint", lang)}</div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setTribal(true)}
                className={
                  "rounded-3xl p-4 text-left ring-1 transition-all " +
                  (tribal === true
                    ? "bg-[#1B3A5C] ring-[#1B3A5C] shadow-sm"
                    : "bg-white ring-black/10 hover:ring-black/20")
                }
              >
                <div className={`text-sm font-bold ${tribal === true ? "text-white" : "text-slate-900"}`}>
                  {t("onboarding_tribal_yes", lang)}
                </div>
              </button>
              <button
                onClick={() => setTribal(false)}
                className={
                  "rounded-3xl p-4 text-left ring-1 transition-all " +
                  (tribal === false
                    ? "bg-[#1B3A5C] ring-[#1B3A5C] shadow-sm"
                    : "bg-white ring-black/10 hover:ring-black/20")
                }
              >
                <div className={`text-sm font-bold ${tribal === false ? "text-white" : "text-slate-900"}`}>
                  {t("onboarding_tribal_no", lang)} / {t("onboarding_tribal_not_sure", lang)}
                </div>
              </button>
            </div>
          </div>
        ) : null}

        <Divider />
        <div className="flex gap-3">
          <button
            onClick={() => setStep((s) => clamp(s - 1, 0, 2))}
            disabled={step === 0}
            className={
              "flex-1 rounded-2xl px-4 py-3 text-sm font-semibold ring-1 transition-all " +
              (step === 0
                ? "bg-slate-50 text-slate-300 ring-slate-200 cursor-not-allowed"
                : "bg-white text-slate-700 ring-black/10 hover:bg-slate-50")
            }
          >
            {t("onboarding_btn_back", lang)}
          </button>
          <button
            onClick={() => {
              if (!isReady) return;
              if (step < 2) setStep((s) => s + 1);
              else handleDone();
            }}
            disabled={!isReady}
            className={
              "flex-1 rounded-2xl px-4 py-3 text-sm font-semibold transition-all " +
              (isReady
                ? "bg-[#1B3A5C] text-white hover:bg-[#152e49] shadow-sm"
                : "bg-slate-100 text-slate-400 cursor-not-allowed")
            }
          >
            {step < 2 ? t("onboarding_btn_next", lang) : t("onboarding_btn_start", lang)}
          </button>
        </div>
      </div>

      {/* Language switcher at bottom */}
      <div className="mt-4 text-center text-xs text-slate-400">
        {lang === "es" ? (
          <a href="/en/setup" className="underline hover:text-slate-600">Switch to English</a>
        ) : (
          <a href="/es/setup" className="underline hover:text-slate-600">Cambiar a Español</a>
        )}
      </div>
    </div>
  );
}
