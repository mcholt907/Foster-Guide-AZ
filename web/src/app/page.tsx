"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Lock, ArrowRight, CheckCircle2 } from "lucide-react";

export default function RootPage() {
  const [selected, setSelected] = useState<"en" | "es" | null>(null);
  const router = useRouter();

  function handleNext() {
    if (selected) router.push(`/${selected}/setup`);
  }

  return (
    <div className="min-h-svh bg-[#FDF9F3] text-[#35322d] font-['Outfit',_sans-serif] flex justify-center items-center">
      <div className="w-full max-w-[480px] min-h-svh max-h-svh overflow-y-auto shadow-2xl bg-[#FDF9F3] relative flex flex-col overflow-x-hidden">

        {/* Top area — icon + headline */}
        <div className="px-6 pt-[clamp(1rem,3vh,3rem)] pb-[clamp(0.5rem,1.5vh,1.5rem)] flex flex-col items-center relative z-10 w-full text-center flex-1 justify-center">

          <div className="w-[clamp(6rem,18vh,12rem)] h-[clamp(6rem,18vh,12rem)] rounded-full bg-white shadow-lg border-[6px] border-white flex justify-center items-center overflow-hidden mb-[clamp(0.75rem,2vh,1.5rem)] relative shrink-0">
            <Image
              src="/onboarding/welcome_icon.png"
              alt="Welcome"
              width={384}
              height={384}
              priority
              className="w-full h-full object-cover scale-[1.15] translate-y-2"
            />
          </div>

          <div className="text-[#136d41] font-extrabold text-[11px] mb-[clamp(0.5rem,1.5vh,1rem)] uppercase tracking-[0.2em] bg-[#136d41]/10 px-4 py-1.5 rounded-full">
            FosterHub AZ
          </div>

          <h2 className="text-[clamp(1.75rem,5vh,2.75rem)] font-extrabold text-[#115e59] mb-[clamp(0.5rem,1.5vh,1rem)] leading-[1.1]">
            {selected === "es" ? "Este lugar es\npara ti." : "This place is\nfor you."}
          </h2>

          <p className="text-slate-600 font-medium text-[clamp(0.9rem,1.8vh,1.125rem)] leading-relaxed max-w-sm mb-[clamp(0.75rem,2vh,1.5rem)] px-2">
            {selected === "es"
              ? "El cuidado adoptivo puede ser confuso. Este es un espacio tranquilo y seguro para encontrar respuestas reales y conocer tus derechos."
              : "Foster care can be confusing and overwhelming. This is a calm, safe space to find real answers and learn your rights."}
          </p>

          <div className="bg-[#e0f2fe] rounded-full px-5 py-2.5 flex items-center justify-center gap-2 text-[13px] font-bold text-[#0c4a6e] shadow-sm border border-[#bae6fd]">
            <Lock size={14} className="text-[#0284c7]" />
            {selected === "es" ? "Sin registro • Nada se guarda" : "No sign-up • Nothing is saved"}
          </div>
        </div>

        {/* Bottom drawer — language selection */}
        <div className="bg-white rounded-t-[2.5rem] px-8 pt-[clamp(1rem,2.5vh,2rem)] pb-[clamp(1rem,3vh,2.5rem)] shadow-[0_-15px_40px_-15px_rgba(0,0,0,0.05)] relative z-20 flex flex-col shrink-0">

          <div className="flex items-center justify-between mb-[clamp(0.75rem,2vh,1.5rem)]">
            <h3 className="text-2xl font-extrabold text-[#35322d]">
              {selected === "es" ? "Elige tu idioma" : "Select language"}
            </h3>
            <div className="flex gap-1.5">
              <div className="w-8 h-2 rounded-full bg-[#136d41]" />
              <div className="w-2 h-2 rounded-full bg-slate-200" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-[clamp(0.75rem,2vh,1.5rem)]">
            <button
              onClick={() => setSelected("en")}
              className={`relative aspect-[5/3] rounded-[2rem] p-4 flex flex-col justify-center items-center text-center transition-all duration-300 ease-out border-[3px] ${
                selected === "en"
                  ? "bg-gradient-to-br from-[#fffdf5] to-[#fff4cc] border-[#fbbf24] shadow-sm scale-[1.02]"
                  : "bg-slate-50 border-transparent shadow-sm hover:bg-slate-100"
              }`}
            >
              {selected === "en" && (
                <div className="absolute top-3 right-3 bg-white rounded-full p-0.5 shadow-sm">
                  <CheckCircle2 size={22} className="fill-[#f59e0b] text-white" />
                </div>
              )}
              <span className={`font-extrabold text-2xl tracking-tight ${selected === "en" ? "text-[#78350f]" : "text-slate-500"}`}>
                English
              </span>
              {selected === "en" && (
                <span className="text-xs font-bold mt-1 text-[#b45309] opacity-80 uppercase tracking-wider">Selected</span>
              )}
            </button>

            <button
              onClick={() => setSelected("es")}
              className={`relative aspect-[5/3] rounded-[2rem] p-4 flex flex-col justify-center items-center text-center transition-all duration-300 ease-out border-[3px] ${
                selected === "es"
                  ? "bg-gradient-to-br from-[#f0f9ff] to-[#e0f2fe] border-[#38bdf8] shadow-sm scale-[1.02]"
                  : "bg-slate-50 border-transparent shadow-sm hover:bg-slate-100"
              }`}
            >
              {selected === "es" && (
                <div className="absolute top-3 right-3 bg-white rounded-full p-0.5 shadow-sm">
                  <CheckCircle2 size={22} className="fill-[#0284c7] text-white" />
                </div>
              )}
              <span className={`font-extrabold text-2xl tracking-tight ${selected === "es" ? "text-[#0c4a6e]" : "text-slate-500"}`}>
                Español
              </span>
              {selected === "es" && (
                <span className="text-xs font-bold mt-1 text-[#0284c7] opacity-80 uppercase tracking-wider">Seleccionado</span>
              )}
            </button>
          </div>

          <div className="h-[clamp(56px,8vh,72px)]">
            {selected && (
              <button
                onClick={handleNext}
                className="w-full h-full rounded-[2rem] font-extrabold text-xl flex items-center justify-center gap-3 transition-colors duration-300 bg-[#136d41] text-white shadow-md hover:bg-[#0f5c35]"
              >
                {selected === "es" ? "Continuar" : "Continue"} <ArrowRight size={24} strokeWidth={3} />
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
