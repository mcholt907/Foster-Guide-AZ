"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Lock, CheckCircle2, ArrowRight } from "lucide-react";
import type { Lang } from "../../../lib/i18n";
import { t } from "../../../lib/i18n";
import { usePrefs } from "../../../lib/prefs";
import { COUNTIES } from "../../../data/constants";

const AGE_OPTIONS = [
  { id: "10-12", labelEn: "10–12", labelEs: "10–12", descEn: "Learn the basics",                          descEs: "Aprende lo básico" },
  { id: "13-15", labelEn: "13–15", labelEs: "13–15", descEn: "Your rights + court",                       descEs: "Tus derechos + la corte" },
  { id: "16-17", labelEn: "16–17", labelEs: "16–17", descEn: "Planning ahead",                            descEs: "Planificando el futuro" },
  { id: "18-21", labelEn: "18–21", labelEs: "18–21", descEn: "Staying in care past 18 + what's next",    descEs: "Permanecer en cuidado después de los 18" },
] as const;

// Dot 0 = language (always done), dots 1-3 = age/county/tribal
function ProgressDots({ step }: { step: number }) {
  return (
    <div className="flex gap-1.5 items-center">
      {[0, 1, 2, 3].map((i) => {
        const dotStep = i; // dot 0 = language, dot 1 = age, dot 2 = county, dot 3 = tribal
        const isActive = dotStep === step + 1; // step 0 → dot 1, step 1 → dot 2, step 2 → dot 3
        return (
          <div
            key={i}
            className={
              "h-2 rounded-full transition-all duration-300 " +
              (isActive ? "w-6 bg-[#115e59]" : "w-2 bg-slate-200")
            }
          />
        );
      })}
    </div>
  );
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
    : tribal !== null;

  function handleNext() {
    if (!isReady) return;
    if (step === 0) {
      if (ageBand === "10-12") {
        patch({ ageBand: "10-12", county: null, tribal: false, onboardingDone: true });
        router.push(`/${lang}`);
      } else {
        setStep(1);
      }
    } else if (step === 1) {
      setStep(2);
    } else {
      patch({
        ageBand: ageBand as "10-12" | "13-15" | "16-17" | "18-21" | null,
        county,
        tribal: tribal ?? false,
        onboardingDone: true,
      });
      router.push(`/${lang}`);
    }
  }

  function handleBack() {
    if (step > 0) setStep((s) => s - 1);
    else router.push("/");
  }

  const stepQuestion =
    step === 0
      ? t("onboarding_step_age", lang)
      : step === 1
        ? t("onboarding_step_county", lang)
        : t("onboarding_step_tribal", lang);

  const nextLabel =
    step === 2 ? t("onboarding_btn_start_over", lang) : t("onboarding_btn_next", lang);

  return (
    <div className="fixed inset-0 z-50 bg-[#FDF9F3] text-[#35322d] font-['Outfit',_sans-serif] flex justify-center items-center overflow-y-auto">
      <div className="w-full max-w-[480px] max-h-full flex flex-col overflow-y-auto">

        {/* Top area — icon + headline */}
        <div className="px-6 pt-12 pb-6 flex flex-col items-center relative z-10 w-full text-center">

          <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-white shadow-lg border-[6px] border-white flex justify-center items-center overflow-hidden mb-6">
            <Image
              src="/onboarding/welcome_icon.png"
              alt=""
              aria-hidden="true"
              width={320}
              height={320}
              priority
              className="w-full h-full object-cover scale-[1.15] translate-y-2"
            />
          </div>

          <div className="text-[#136d41] font-extrabold text-[11px] mb-4 uppercase tracking-[0.2em] bg-[#136d41]/10 px-4 py-1.5 rounded-full">
            FosterHub AZ
          </div>

          <h2 className="text-4xl sm:text-[2.75rem] font-extrabold text-[#115e59] mb-4 leading-[1.1]">
            {lang === "es" ? "Este lugar es\npara ti." : "This place is\nfor you."}
          </h2>

          <p className="text-slate-600 font-medium text-[16px] sm:text-lg leading-relaxed max-w-sm mb-6 px-2">
            {lang === "es"
              ? "El cuidado adoptivo puede ser confuso. Este es un espacio tranquilo y seguro para encontrar respuestas reales y conocer tus derechos."
              : "Foster care can be confusing and overwhelming. This is a calm, safe space to find real answers and learn your rights."}
          </p>

          <div className="bg-[#e0f2fe] rounded-full px-5 py-2.5 flex items-center justify-center gap-2 text-[13px] font-bold text-[#0c4a6e] shadow-sm border border-[#bae6fd]">
            <Lock size={14} className="text-[#0284c7]" />
            {lang === "es" ? "Sin registro • Nada se guarda" : "No sign-up • Nothing is saved"}
          </div>
        </div>

        {/* Bottom drawer */}
        <div className="bg-white rounded-t-[2.5rem] px-6 sm:px-8 pt-8 pb-10 shadow-[0_-15px_40px_-15px_rgba(0,0,0,0.05)] flex flex-col">

          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[1.35rem] sm:text-2xl font-extrabold text-[#35322d]">
              {stepQuestion}
            </h3>
            <ProgressDots step={step} />
          </div>

          {/* ── Step 0: Age ── */}
          {step === 0 && (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-8">
              {AGE_OPTIONS.map((opt) => {
                const isSelected = ageBand === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setAgeBand(opt.id)}
                    className={`relative flex flex-col justify-center items-center text-center transition-all duration-300 ease-out border-[3px] rounded-[1.5rem] p-3 sm:p-4 min-h-[110px] ${
                      isSelected
                        ? "bg-gradient-to-br from-[#E6F8EA] to-[#D5F2DB] border-[#136d41] shadow-md scale-[1.02]"
                        : "bg-slate-50 border-transparent shadow-sm hover:bg-slate-100 hover:scale-[1.01]"
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-3 right-3 bg-white rounded-full p-0.5 shadow-sm">
                        <CheckCircle2 size={16} className="fill-[#136d41] text-white" />
                      </div>
                    )}
                    <span className={`font-extrabold text-2xl tracking-tight mb-1 ${isSelected ? "text-[#115e59]" : "text-[#35322d]"}`}>
                      {lang === "es" ? opt.labelEs : opt.labelEn}
                    </span>
                    <span className={`text-xs font-medium leading-tight px-1 ${isSelected ? "text-[#136d41]" : "text-slate-500"}`}>
                      {lang === "es" ? opt.descEs : opt.descEn}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* ── Step 1: County ── */}
          {step === 1 && (
            <div className="mb-8">
              <p className="text-xs text-slate-500 mb-3">
                {lang === "es" ? "Esto nos ayuda a mostrarte recursos locales." : "This helps us show you local resources."}
              </p>
              <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
                <button
                  onClick={() => { setCounty("Unknown"); setStep(2); }}
                  className={`col-span-2 rounded-2xl px-3 py-2.5 text-center text-sm font-semibold ring-1 transition-all ${
                    county === "Unknown"
                      ? "bg-[#115e59] ring-[#115e59] text-white"
                      : "bg-white ring-black/10 text-slate-500 hover:ring-black/20"
                  }`}
                >
                  {lang === "es" ? "No lo sé / No aplica" : "I don't know / Not sure"}
                </button>
                {COUNTIES.map((c) => (
                  <button
                    key={c}
                    onClick={() => { setCounty(c); setStep(2); }}
                    className={`rounded-2xl px-3 py-2.5 text-left text-sm font-semibold ring-1 transition-all ${
                      county === c
                        ? "bg-[#115e59] ring-[#115e59] text-white"
                        : "bg-white ring-black/10 text-slate-700 hover:ring-black/20"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Step 2: Tribal ── */}
          {step === 2 && (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-8">
              {[
                { val: true,  labelEn: "Yes",       labelEs: "Sí",      descEn: "I have tribal connections",    descEs: "Tengo conexiones tribales" },
                { val: false, labelEn: "No / Not sure", labelEs: "No / No sé", descEn: "I don't have any tribal connections", descEs: "No tengo conexiones tribales" },
              ].map((opt) => {
                const isSelected = tribal === opt.val;
                return (
                  <button
                    key={String(opt.val)}
                    onClick={() => setTribal(opt.val)}
                    className={`relative flex flex-col justify-center items-center text-center transition-all duration-300 ease-out border-[3px] rounded-[1.5rem] p-3 sm:p-4 min-h-[110px] ${
                      isSelected
                        ? "bg-gradient-to-br from-[#E6F8EA] to-[#D5F2DB] border-[#136d41] shadow-md scale-[1.02]"
                        : "bg-slate-50 border-transparent shadow-sm hover:bg-slate-100 hover:scale-[1.01]"
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-3 right-3 bg-white rounded-full p-0.5 shadow-sm">
                        <CheckCircle2 size={16} className="fill-[#136d41] text-white" />
                      </div>
                    )}
                    <span className={`font-extrabold text-xl tracking-tight mb-1 ${isSelected ? "text-[#115e59]" : "text-[#35322d]"}`}>
                      {lang === "es" ? opt.labelEs : opt.labelEn}
                    </span>
                    <span className={`text-xs font-medium leading-tight px-1 ${isSelected ? "text-[#136d41]" : "text-slate-500"}`}>
                      {lang === "es" ? opt.descEs : opt.descEn}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Navigation buttons — hidden on county step (auto-advances on click) */}
          {step !== 1 && (
            <div className="flex items-stretch gap-3 mb-6">
              <button
                onClick={handleBack}
                className="px-6 py-4 rounded-[1.5rem] font-bold text-[16px] text-slate-500 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                {lang === "es" ? "Atrás" : "Back"}
              </button>
              <button
                onClick={handleNext}
                disabled={!isReady}
                className={`flex-1 py-4 rounded-[1.5rem] font-extrabold text-[16px] flex items-center justify-center gap-2 transition-all duration-300 ${
                  isReady
                    ? "bg-[#136d41] text-white hover:bg-[#0f5c35] shadow-md hover:shadow-lg"
                    : "bg-slate-100 text-slate-400 cursor-not-allowed"
                }`}
              >
                {nextLabel}
                {isReady && <ArrowRight size={20} strokeWidth={3} />}
              </button>
            </div>
          )}

          {/* County step back button */}
          {step === 1 && (
            <div className="mb-6">
              <button
                onClick={() => setStep(0)}
                className="w-full px-6 py-4 rounded-[1.5rem] font-bold text-[16px] text-slate-500 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                {lang === "es" ? "Atrás" : "Back"}
              </button>
            </div>
          )}

          {/* Language switcher */}
          <div className="text-center">
            {lang === "es" ? (
              <Link href="/en/setup" className="text-[#64748b] text-[13px] font-medium hover:text-[#115e59] underline decoration-2 underline-offset-4 transition-colors">
                Switch to English
              </Link>
            ) : (
              <Link href="/es/setup" className="text-[#64748b] text-[13px] font-medium hover:text-[#115e59] underline decoration-2 underline-offset-4 transition-colors">
                Cambiar a Español
              </Link>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
