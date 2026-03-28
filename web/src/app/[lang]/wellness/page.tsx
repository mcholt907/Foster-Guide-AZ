"use client";
// wellness
import { useState } from "react";
import { useParams } from "next/navigation";
import { HeartPulse, Phone, MessageSquare } from "lucide-react";
import type { Lang } from "../../../lib/i18n";
import { useOnboardingGate } from "../../../lib/useOnboardingGate";
import { CRISIS_PINS } from "../../../data/constants";
import { ScreenHero, SafeNotice } from "../../../components/ui";

const GROUNDING_STEPS_EN = [
  { n: 5, sense: "things you can see", icon: "👁️" },
  { n: 4, sense: "things you can touch", icon: "✋" },
  { n: 3, sense: "things you can hear", icon: "👂" },
  { n: 2, sense: "things you can smell", icon: "👃" },
  { n: 1, sense: "thing you can taste", icon: "👅" },
];

const GROUNDING_STEPS_ES = [
  { n: 5, sense: "cosas que puedes ver", icon: "👁️" },
  { n: 4, sense: "cosas que puedes tocar", icon: "✋" },
  { n: 3, sense: "cosas que puedes escuchar", icon: "👂" },
  { n: 2, sense: "cosas que puedes oler", icon: "👃" },
  { n: 1, sense: "cosa que puedes saborear", icon: "👅" },
];

const COPING_TOOLS_EN = [
  {
    id: "breathe",
    emoji: "🌬️",
    title: "Box breathing",
    desc: "Breathe in for 4 counts, hold for 4, out for 4, hold for 4. Repeat 3 times. Your body will slow down.",
  },
  {
    id: "journal",
    emoji: "📓",
    title: "3-line journal",
    desc: "Write 3 lines: what happened, how I felt, one thing I'm grateful for. Any time, any day.",
  },
  {
    id: "move",
    emoji: "🎵",
    title: "Move your body",
    desc: "Even 5 minutes of walking, stretching, or dancing to one song can shift how you feel.",
  },
];

const COPING_TOOLS_ES = [
  {
    id: "breathe",
    emoji: "🌬️",
    title: "Respiración en caja",
    desc: "Inhala 4 tiempos, sostén 4, exhala 4, sostén 4. Repite 3 veces. Tu cuerpo se calmará.",
  },
  {
    id: "journal",
    emoji: "📓",
    title: "Diario de 3 líneas",
    desc: "Escribe 3 líneas: qué pasó, cómo me sentí, una cosa por la que estoy agradecido.",
  },
  {
    id: "move",
    emoji: "🎵",
    title: "Mueve tu cuerpo",
    desc: "Incluso 5 minutos de caminar, estirarte o bailar una canción pueden cambiar cómo te sientes.",
  },
];

export default function WellnessPage() {
  const { lang: rawLang } = useParams<{ lang: string }>();
  const lang: Lang = rawLang === "es" ? "es" : "en";
  useOnboardingGate(lang);

  const [groundingActive, setGroundingActive] = useState(false);
  const [groundingStep, setGroundingStep] = useState(0);

  const groundingSteps = lang === "es" ? GROUNDING_STEPS_ES : GROUNDING_STEPS_EN;
  const copingTools = lang === "es" ? COPING_TOOLS_ES : COPING_TOOLS_EN;

  function startGrounding() {
    setGroundingStep(0);
    setGroundingActive(true);
  }

  function nextGroundingStep() {
    if (groundingStep < groundingSteps.length - 1) {
      setGroundingStep((s) => s + 1);
    } else {
      setGroundingActive(false);
      setGroundingStep(0);
    }
  }

  const currentStep = groundingSteps[groundingStep];

  return (
    <div className="pb-8">
      <ScreenHero
        icon={HeartPulse}
        title={lang === "es" ? "Chequeo de bienestar" : "Wellness Check-In"}
        subtitle={
          lang === "es"
            ? "Herramientas para cuando todo se siente abrumador."
            : "Tools for when things feel overwhelming."
        }
        gradient="from-[#2A7F8E] to-[#1B3A5C]"
        lang={lang}
      />

      {/* 5-4-3-2-1 Grounding */}
      <div className="mt-4 rounded-3xl bg-white/85 p-4 ring-1 ring-black/5 shadow-sm">
        <div className="flex items-center gap-3 mb-1">
          <span className="text-2xl">🧘</span>
          <div>
            <div className="text-base font-semibold text-[#1B3A5C]">
              {lang === "es" ? "Ejercicio de conexión 5-4-3-2-1" : "5-4-3-2-1 Grounding Exercise"}
            </div>
            <div className="text-sm sm:text-xs text-slate-500">
              {lang === "es"
                ? "Ayuda a calmar tu mente en menos de 2 minutos."
                : "Helps calm your mind in under 2 minutes."}
            </div>
          </div>
        </div>

        <div className="mt-3">
          {!groundingActive ? (
            <button
              onClick={startGrounding}
              className="w-full rounded-2xl bg-[#2A7F8E] px-4 py-3 text-sm font-semibold text-white hover:bg-[#236d7a] active:scale-[0.99] transition-all"
            >
              {lang === "es" ? "Comenzar ejercicio" : "Start exercise"}
            </button>
          ) : (
            <div className="rounded-2xl bg-[#2A7F8E]/8 p-5 text-center">
              <div className="text-5xl mb-3">{currentStep.icon}</div>
              <div className="text-3xl font-bold text-[#2A7F8E] mb-1">{currentStep.n}</div>
              <div className="text-sm text-[#1B3A5C] font-medium mb-4">
                {lang === "es" ? "Nombra " : "Name "}{currentStep.n}{" "}{currentStep.sense}
              </div>
              {/* Step dots */}
              <div className="flex justify-center gap-1.5 mb-4">
                {groundingSteps.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 rounded-full transition-all ${
                      i === groundingStep ? "w-4 bg-[#2A7F8E]" : i < groundingStep ? "w-1.5 bg-[#2A7F8E]/40" : "w-1.5 bg-slate-200"
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={nextGroundingStep}
                className="rounded-2xl bg-[#2A7F8E] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#236d7a] transition-colors"
              >
                {groundingStep < groundingSteps.length - 1
                  ? lang === "es" ? "Siguiente →" : "Next →"
                  : lang === "es" ? "¡Terminé ✓" : "Done ✓"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Coping tools */}
      <div className="mt-3 grid gap-3">
        {copingTools.map((tool) => (
          <div key={tool.id} className="rounded-3xl bg-white/85 p-4 ring-1 ring-black/5 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="text-2xl shrink-0">{tool.emoji}</span>
              <div>
                <div className="text-sm font-semibold text-[#1B3A5C]">{tool.title}</div>
                <p className="mt-0.5 text-sm sm:text-xs text-slate-500 leading-relaxed">{tool.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Crisis contacts */}
      <div className="mt-4 rounded-3xl bg-white/85 p-4 ring-1 ring-black/5 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl">💙</span>
          <div className="text-sm font-semibold text-[#1B3A5C]">
            {lang === "es" ? "No estás solo/a — aquí hay personas que pueden ayudar" : "You're not alone — real people who care"}
          </div>
        </div>
        <div className="grid gap-2">
          {CRISIS_PINS.map((c) => (
            <div key={c.name} className="rounded-2xl bg-slate-50/80 p-3 ring-1 ring-black/5">
              <div className="text-sm font-semibold text-slate-900">{c.name}</div>
              <div className="mt-0.5 text-sm sm:text-xs text-slate-500">{lang === "es" ? c.how_es : c.how}</div>
              <div className="mt-2 flex gap-2">
                {c.url.startsWith("tel:") ? (
                  <a
                    href={c.url}
                    className="flex items-center gap-1.5 rounded-xl bg-[#2A7F8E]/10 px-3 py-1.5 text-xs font-semibold text-[#2A7F8E]"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    {lang === "es" ? "Llamar" : "Call"}
                  </a>
                ) : c.url.startsWith("sms:") ? (
                  <a
                    href={c.url}
                    className="flex items-center gap-1.5 rounded-xl bg-[#2A7F8E]/10 px-3 py-1.5 text-xs font-semibold text-[#2A7F8E]"
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                    {lang === "es" ? "Mensaje" : "Text"}
                  </a>
                ) : (
                  <a
                    href={c.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600"
                  >
                    {lang === "es" ? "Abrir" : "Open"}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reminder */}
      <div className="mt-4 rounded-3xl bg-[#2A7F8E]/8 p-4 ring-1 ring-[#2A7F8E]/20">
        <div className="flex items-start gap-3">
          <span className="text-xl shrink-0 mt-0.5">🌱</span>
          <p className="text-sm text-[#1B3A5C] leading-relaxed">
            {lang === "es"
              ? "Lo que sientes tiene sentido dado lo que has vivido. Pedir ayuda es una fortaleza, no una debilidad."
              : "What you feel makes sense given what you've been through. Reaching out is a strength, not a weakness."}
          </p>
        </div>
      </div>

      <div className="mt-4">
        <SafeNotice lang={lang} />
      </div>
    </div>
  );
}
