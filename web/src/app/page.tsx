"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RootPage() {
  const [selected, setSelected] = useState<"en" | "es" | null>(null);
  const router = useRouter();

  function handleNext() {
    if (selected) router.push(`/${selected}/setup`);
  }

  return (
    <div className="flex min-h-svh flex-col justify-center px-4 pb-8 pt-4 max-w-lg mx-auto">
      {/* Hero banner */}
      <div className="mb-5 rounded-3xl bg-gradient-to-br from-[#2A7F8E] to-[#1B3A5C] p-6 shadow-md">
        <img src="/icons/icon-192.svg" className="mb-5 h-12 w-12 rounded-2xl shadow-md" alt="" aria-hidden="true" />
        <div className="text-xl font-semibold text-white/90 leading-snug mb-1">
          {selected === "es" ? "Este lugar es para ti." : "This place is for you."}
        </div>
        <div className="text-2xl font-bold text-white leading-snug">
          {selected === "es" ? "Bienvenido a FosterHub AZ" : "Welcome to FosterHub AZ"}
        </div>
        <div className="mt-3 text-sm text-white/75 leading-relaxed">
          {selected === "es"
            ? "El cuidado adoptivo puede ser confuso y abrumador. Este es un espacio tranquilo y seguro para encontrar respuestas reales, conocer tus derechos y descubrir tus próximos pasos."
            : "Foster care can be confusing and overwhelming. This is a calm, safe space to find real answers, learn your rights, and figure out your next steps."}
        </div>
        <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium text-white/80">
          <span>🔒</span>
          {selected === "es" ? "Sin registro · Nada se guarda" : "No sign-up · Nothing is saved"}
        </div>
      </div>

      {/* Step card */}
      <div className="rounded-3xl bg-white/85 p-5 shadow-sm ring-1 ring-black/5">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm font-semibold text-[#1B3A5C]">
            {selected === "es" ? "¿Qué idioma prefieres?" : "What language do you prefer?"}
          </div>
          {/* 4-dot indicator — step 0 */}
          <div className="flex gap-1.5 items-center">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={
                  "h-2 rounded-full transition-all duration-300 " +
                  (i === 0 ? "w-6 bg-[#2A7F8E]" : "w-2 bg-slate-200")
                }
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setSelected("en")}
            className={
              "rounded-3xl py-5 px-4 text-center ring-1 transition-all " +
              (selected === "en"
                ? "bg-[#1B3A5C] ring-[#1B3A5C] shadow-sm"
                : "bg-white ring-black/10 hover:ring-black/20")
            }
          >
            <div className={`text-lg font-bold ${selected === "en" ? "text-white" : "text-slate-900"}`}>
              English
            </div>
          </button>
          <button
            onClick={() => setSelected("es")}
            className={
              "rounded-3xl py-5 px-4 text-center ring-1 transition-all " +
              (selected === "es"
                ? "bg-[#1B3A5C] ring-[#1B3A5C] shadow-sm"
                : "bg-white ring-black/10 hover:ring-black/20")
            }
          >
            <div className={`text-lg font-bold ${selected === "es" ? "text-white" : "text-slate-900"}`}>
              Español
            </div>
          </button>
        </div>

        <div className="mt-4">
          <button
            onClick={handleNext}
            disabled={!selected}
            className={
              "w-full rounded-2xl px-4 py-3 text-sm font-semibold transition-all " +
              (selected
                ? "bg-[#1B3A5C] text-white hover:bg-[#152e49] shadow-sm"
                : "bg-slate-100 text-slate-400 cursor-not-allowed")
            }
          >
            {selected === "es" ? "Siguiente" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
