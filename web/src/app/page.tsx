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
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 shadow-md">
          <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
            <circle cx="12" cy="12" r="4" fill="white" />
            <path
              d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.93 4.93l1.77 1.77M17.3 17.3l1.77 1.77M4.93 19.07l1.77-1.77M17.3 6.7l1.77-1.77"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div className="text-2xl font-bold text-white leading-snug">
          {selected === "es" ? (
            <>Bienvenido a<br />Compass</>
          ) : (
            <>Welcome to<br />Compass</>
          )}
        </div>
        <div className="mt-2 text-sm text-white/80 leading-relaxed">
          {selected === "es"
            ? "Mereces respuestas reales. Este es un lugar seguro para encontrarlas — sin registro, nada guardado."
            : "You deserve real answers. This is a safe place to find them — no sign-up, nothing stored."}
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
