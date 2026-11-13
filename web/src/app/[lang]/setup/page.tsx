"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Lock, ArrowLeft } from "lucide-react";
import type { Lang } from "../../../lib/i18n";
import { t } from "../../../lib/i18n";
import { usePrefs, type AgeBandKey } from "../../../lib/prefs";
import { tho } from "../../../lib/i18n-home";

const AGE_OPTIONS = [
  { id: "10-12", labelEn: "10–12", labelEs: "10–12", descEn: "Learn the basics",                          descEs: "Aprende lo básico" },
  { id: "13-15", labelEn: "13–15", labelEs: "13–15", descEn: "Your rights + court",                       descEs: "Tus derechos + la corte" },
  { id: "16-17", labelEn: "16–17", labelEs: "16–17", descEn: "Planning ahead",                            descEs: "Planificando el futuro" },
  { id: "18-21", labelEn: "18–21", labelEs: "18–21", descEn: "Staying in care past 18 + what's next",    descEs: "Permanecer en cuidado después de los 18" },
] as const;

// Setup asks one thing: age. County is asked on the Resources page and the
// tribal question on the Case and Team pages, where each one matters.
export default function SetupPage() {
  const { lang: rawLang } = useParams<{ lang: string }>();
  const lang: Lang = rawLang === "es" ? "es" : "en";
  const router = useRouter();
  const [,, patch] = usePrefs();

  // One tap picks the age and starts. No "Next" button.
  function choose(ageBand: AgeBandKey) {
    patch({ ageBand, onboardingDone: true });
    router.push(`/${lang}`);
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#FDF9F3] text-[#35322d] font-['Outfit',_sans-serif] flex justify-center items-center overflow-y-auto">
      <div className="w-full max-w-[480px] min-h-svh max-h-svh flex flex-col overflow-y-auto">

        {/* Top area — icon + headline */}
        <div className="px-6 pt-16 pb-[clamp(0.5rem,1.5vh,1.5rem)] flex flex-col items-center relative z-10 w-full text-center flex-1 justify-center">

          <div className="w-[clamp(5rem,16vh,10rem)] h-[clamp(5rem,16vh,10rem)] rounded-full bg-white shadow-lg border-[6px] border-white flex justify-center items-center overflow-hidden mb-[clamp(0.75rem,2vh,1.5rem)] shrink-0">
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

          <div className="text-[#136d41] font-extrabold text-xs mb-[clamp(0.5rem,1.5vh,1rem)] uppercase tracking-[0.2em] bg-[#136d41]/10 px-4 py-1.5 rounded-full">
            FosterHub AZ
          </div>

          <h1 className="text-[clamp(1.75rem,5vh,2.75rem)] font-extrabold text-[#115e59] mb-[clamp(0.5rem,1.5vh,1rem)] leading-[1.1]">
            {lang === "es" ? "Este lugar es\npara ti." : "This place is\nfor you."}
          </h1>


          <div className="bg-[#e0f2fe] rounded-full px-5 py-2.5 flex items-center justify-center gap-2 text-[13px] font-bold text-[#0c4a6e] shadow-sm border border-[#bae6fd]">
            <Lock size={14} className="text-[#0284c7]" />
            {lang === "es" ? "Sin registro • Se queda en tu dispositivo" : "No sign-up • Stays on your device"}
          </div>
        </div>

        {/* Bottom drawer */}
        <div className="bg-white rounded-t-[2.5rem] px-6 sm:px-8 pt-[clamp(1rem,2.5vh,2rem)] pb-[clamp(1rem,3vh,2.5rem)] shadow-[0_-15px_40px_-15px_rgba(0,0,0,0.05)] flex flex-col shrink-0">

          <div className="flex items-center justify-between mb-1">
            <h2 id="setup-age" className="text-[1.35rem] sm:text-2xl font-extrabold text-[#35322d]">
              {t("onboarding_step_age", lang)}
            </h2>
            <div className="flex gap-1.5 items-center" aria-hidden="true">
              <div className="h-2 w-2 rounded-full bg-slate-200" />
              <div className="h-2 w-6 rounded-full bg-[#115e59]" />
            </div>
          </div>
          <p className="text-sm font-medium text-slate-600 mb-[clamp(0.75rem,2vh,1.25rem)]">{tho("setup.age.hint", lang)}</p>

          <div role="group" aria-labelledby="setup-age" className="grid grid-cols-2 gap-3 sm:gap-4 mb-[clamp(1rem,3vh,1.5rem)]">
            {AGE_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => choose(opt.id)}
                className="flex flex-col justify-center items-center text-center transition-all duration-200 ease-out border-[3px] border-transparent rounded-[1.5rem] p-3 sm:p-4 min-h-[clamp(86px,11vh,110px)] bg-slate-50 shadow-sm hover:bg-[#E6F8EA] hover:border-[#136d41] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#136d41]"
              >
                <span className="font-extrabold text-2xl tracking-tight mb-1 text-[#35322d]">
                  {lang === "es" ? opt.labelEs : opt.labelEn}
                </span>
                <span className="text-xs font-medium leading-tight px-1 text-slate-600">
                  {lang === "es" ? opt.descEs : opt.descEn}
                </span>
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <Link href="/" className="inline-flex min-h-11 items-center gap-1.5 px-3 text-[#475569] text-sm font-bold hover:text-[#115e59] transition-colors">
              <ArrowLeft size={16} strokeWidth={2.5} aria-hidden="true" /> {tho("setup.back", lang)}
            </Link>
            {/* Language switcher */}
            <div>
            {lang === "es" ? (
              <Link href="/en/setup" lang="en" className="inline-flex min-h-11 items-center px-3 text-[#475569] text-sm font-medium hover:text-[#115e59] underline decoration-2 underline-offset-4 transition-colors">
                Switch to English
              </Link>
            ) : (
              <Link href="/es/setup" lang="es" className="inline-flex min-h-11 items-center px-3 text-[#475569] text-sm font-medium hover:text-[#115e59] underline decoration-2 underline-offset-4 transition-colors">
                Cambiar a Español
              </Link>
            )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
