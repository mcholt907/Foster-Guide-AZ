"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronLeft, Phone, MessageSquare, HeartPulse } from "lucide-react";
import type { Lang } from "../../../lib/i18n";
import { useOnboardingGate } from "../../../lib/useOnboardingGate";
import { usePrefs } from "../../../lib/prefs";
import { CRISIS_PINS } from "../../../data/constants";
import { TeenShell } from "../../../components/TeenShell";
import { WellnessTeen } from "../../../components/teen/WellnessTeen";

const GROUNDING_STEPS = [
  { n: 5, senseEn: "things you can see",  senseEs: "cosas que puedes ver",   icon: "👁️" },
  { n: 4, senseEn: "things you can touch", senseEs: "cosas que puedes tocar", icon: "✋" },
  { n: 3, senseEn: "things you can hear",  senseEs: "cosas que puedes oír",   icon: "👂" },
  { n: 2, senseEn: "things you can smell", senseEs: "cosas que puedes oler",  icon: "👃" },
  { n: 1, senseEn: "thing you can taste",  senseEs: "cosa que puedes saborear",icon: "👅" },
];

const COPING_TOOLS = [
  {
    id: "breathe",
    img: "/wellness/breathing.png",
    titleEn: "Box breathing",
    titleEs: "Respiración cuadrada",
    descEn: "Breathe in for 4 counts, hold for 4, out for 4, hold for 4. Repeat 3 times. Your body will slow down.",
    descEs: "Inhala por 4 tiempos, mantén por 4, exhala por 4, mantén por 4. Repite 3 veces. Tu cuerpo se calmará.",
  },
  {
    id: "journal",
    img: "/wellness/journal.png",
    titleEn: "3-line journal",
    titleEs: "Diario de 3 líneas",
    descEn: "Write 3 lines: what happened, how I felt, one thing I'm grateful for. Any time, any day.",
    descEs: "Escribe 3 líneas: qué pasó, cómo me sentí, una cosa por la que estoy agradecido. En cualquier momento.",
  },
  {
    id: "move",
    img: "/wellness/music.png",
    titleEn: "Move your body",
    titleEs: "Mueve tu cuerpo",
    descEn: "Even 5 minutes of walking, stretching, or dancing to one song can shift how you feel.",
    descEs: "Incluso 5 minutos de caminar, estirarte o bailar una canción puede cambiar cómo te sientes.",
  },
];

export default function WellnessPage() {
  const { lang: rawLang } = useParams<{ lang: string }>();
  const lang: Lang = rawLang === "es" ? "es" : "en";
  const prefs = useOnboardingGate(lang);
  const [, loaded] = usePrefs();

  if (!loaded) return null;
  if (!prefs.ageBand) return null;
  if (prefs.ageBand === "10-12") return <Wellness1012 lang={lang} />;

  return (
    <TeenShell active="wellness" lang={lang}>
      <WellnessTeen lang={lang} />
    </TeenShell>
  );
}

function Wellness1012({ lang }: { lang: Lang }) {
  const [groundingActive, setGroundingActive] = useState(false);
  const [groundingStep, setGroundingStep] = useState(0);

  function startGrounding() {
    setGroundingStep(0);
    setGroundingActive(true);
  }

  function nextGroundingStep() {
    if (groundingStep < GROUNDING_STEPS.length - 1) {
      setGroundingStep((s) => s + 1);
    } else {
      setGroundingActive(false);
      setGroundingStep(0);
    }
  }

  const currentStep = GROUNDING_STEPS[groundingStep];

  return (
    <div className="font-['Outfit',_sans-serif] pb-8">

      {/* Sticky header */}
      <div className="-mx-4 px-4 py-4 flex items-center gap-3 sticky top-0 bg-[#FFF9F3]/90 backdrop-blur-md z-30">
        <Link
          href={`/${lang}`}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition-colors shrink-0"
          aria-label={lang === "es" ? "Volver" : "Back to home"}
        >
          <ChevronLeft size={20} className="text-slate-600" />
        </Link>
        <div className="w-8 h-8 flex items-center justify-center bg-[#E1EAF4] rounded-full shrink-0">
          <HeartPulse size={16} className="text-[#1B3A5C]" />
        </div>
        <h1 className="text-lg font-bold text-[#1B3A5C] tracking-tight flex-1">
          {lang === "es" ? "Chequeo de Bienestar" : "Wellness Check-In"}
        </h1>
      </div>

      <div className="space-y-5 pb-4">
        {/* Hero */}
        <div className="bg-gradient-to-br from-[#E1EAF4] to-[#C9DBEE] rounded-[32px] p-8 relative overflow-hidden border border-[#B3D6DB]/20">
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <h2 className="text-2xl font-bold text-[#1B3A5C]">
              {lang === "es" ? "Chequeo de Bienestar" : "Wellness Check-In"}
            </h2>
            <p className="text-[#2C5F8E] text-sm leading-relaxed px-4">
              {lang === "es" ? "Herramientas para cuando todo se siente abrumador." : "Tools for when things feel overwhelming."}
            </p>
          </div>
        </div>

        {/* 5-4-3-2-1 Grounding */}
        <div className="bg-white rounded-[24px] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center shadow-inner shrink-0 overflow-hidden border border-blue-100">
              <img src="/wellness/grounding.png" alt="Grounding" className="w-14 h-14 object-contain scale-[1.2]" />
            </div>
            <div className="pt-2">
              <div className="text-base font-bold text-[#1B3A5C]">
                {lang === "es" ? "Ejercicio de Anclaje 5-4-3-2-1" : "5-4-3-2-1 Grounding Exercise"}
              </div>
              <div className="text-sm text-gray-500 mt-1 leading-snug">
                {lang === "es" ? "Ayuda a calmar tu mente en menos de 2 minutos." : "Helps calm your mind in under 2 minutes."}
              </div>
            </div>
          </div>
          <div className="mt-5">
            {!groundingActive ? (
              <button
                onClick={startGrounding}
                className="w-full rounded-full bg-[#1B3A5C] px-4 py-4 text-[15px] font-semibold text-white shadow-md hover:bg-[#122b46] active:scale-[0.98] transition-all"
              >
                {lang === "es" ? "Comenzar ejercicio" : "Start exercise"}
              </button>
            ) : (
              <div className="rounded-[20px] bg-[#E1EAF4] p-6 text-center shadow-inner">
                <div className="text-6xl mb-4 drop-shadow-sm">{currentStep.icon}</div>
                <div className="text-4xl font-black text-[#1B3A5C] mb-2">{currentStep.n}</div>
                <div className="text-base text-[#2C5F8E] font-medium mb-6">
                  {lang === "es"
                    ? `Nombra ${currentStep.n} ${currentStep.senseEs}`
                    : `Name ${currentStep.n} ${currentStep.senseEn}`}
                </div>
                <div className="flex justify-center gap-2 mb-6">
                  {GROUNDING_STEPS.map((_, i) => (
                    <div
                      key={i}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        i === groundingStep ? "w-6 bg-[#1B3A5C]" : i < groundingStep ? "w-2 bg-[#1B3A5C]/40" : "w-2 bg-[#B3D6DB]"
                      }`}
                    />
                  ))}
                </div>
                <button
                  onClick={nextGroundingStep}
                  className="w-full rounded-full bg-[#1B3A5C] px-6 py-3.5 text-[15px] font-semibold text-white shadow-md hover:bg-[#122b46] transition-all active:scale-[0.98]"
                >
                  {groundingStep < GROUNDING_STEPS.length - 1
                    ? (lang === "es" ? "Siguiente →" : "Next Step →")
                    : (lang === "es" ? "Terminado ✓" : "Finished ✓")}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Coping tools */}
        <div className="grid gap-3">
          {COPING_TOOLS.map((tool) => (
            <div key={tool.id} className="rounded-[24px] bg-white p-5 shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-transparent hover:border-blue-50 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 shrink-0 bg-gray-50 rounded-full flex items-center justify-center overflow-hidden border border-gray-100">
                  <img src={tool.img} alt={lang === "es" ? tool.titleEs : tool.titleEn} className="w-12 h-12 object-contain scale-[1.2]" />
                </div>
                <div className="pt-1">
                  <div className="text-[15px] font-bold text-[#1B3A5C] mb-1">
                    {lang === "es" ? tool.titleEs : tool.titleEn}
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed pr-2">
                    {lang === "es" ? tool.descEs : tool.descEn}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Crisis contacts */}
        <div className="mt-6 rounded-[28px] bg-blue-50/50 p-6 border border-blue-100">
          <div className="flex items-center gap-3 mb-5">
            <div className="text-xl shrink-0 bg-white w-8 h-8 rounded-full flex items-center justify-center shadow-sm">💙</div>
            <div className="text-[15px] font-bold text-[#1B3A5C]">
              {lang === "es" ? "No estás solo — personas reales que se preocupan" : "You're not alone — real people who care"}
            </div>
          </div>
          <div className="grid gap-3">
            {CRISIS_PINS.map((c) => (
              <div key={c.name} className="rounded-[20px] bg-white p-4 shadow-sm">
                <div className="text-[15px] font-bold text-gray-800 mb-0.5">{c.name}</div>
                <div className="text-xs text-gray-500 mb-3">{lang === "es" ? c.how_es : c.how}</div>
                <div className="flex gap-2">
                  {c.url.startsWith("tel:") ? (
                    <a href={c.url} className="flex items-center gap-1.5 rounded-full bg-[#E1EAF4] hover:bg-[#C9DBEE] px-4 py-2 text-[13px] font-bold text-[#1B3A5C] transition-colors">
                      <Phone className="h-4 w-4" />
                      {lang === "es" ? "Llamar" : "Call"}
                    </a>
                  ) : c.url.startsWith("sms:") ? (
                    <a href={c.url} className="flex items-center gap-1.5 rounded-full bg-[#E1EAF4] hover:bg-[#C9DBEE] px-4 py-2 text-[13px] font-bold text-[#1B3A5C] transition-colors">
                      <MessageSquare className="h-4 w-4" />
                      {lang === "es" ? "Texto" : "Text"}
                    </a>
                  ) : (
                    <a href={c.url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 rounded-full bg-gray-100 hover:bg-gray-200 px-4 py-2 text-[13px] font-bold text-gray-600 transition-colors">
                      {lang === "es" ? "Abrir" : "Open"}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reminder */}
        <div className="rounded-[24px] bg-[#E6F8EA] p-5 shadow-sm">
          <div className="flex items-start gap-4 text-[#1A4226]">
            <span className="text-2xl shrink-0 bg-white/50 w-10 h-10 rounded-full flex items-center justify-center">🌱</span>
            <p className="text-[14px] font-medium leading-relaxed pt-1">
              {lang === "es"
                ? "Lo que sientes tiene sentido dado lo que has vivido. Pedir ayuda es una fortaleza, no una debilidad."
                : "What you feel makes sense given what you've been through. Reaching out is a strength, not a weakness."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
