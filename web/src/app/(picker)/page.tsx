"use client";

import Image from "next/image";
import Link from "next/link";
import { Lock } from "lucide-react";
import { HelpNow } from "../../components/HelpNow";

export default function RootPage() {
  return (
    <div className="min-h-svh bg-[#FDF9F3] text-[#35322d] font-['Outfit',_sans-serif] flex justify-center items-center">
      <HelpNow lang="en" placement="top" />
      <main className="w-full max-w-[480px] min-h-svh max-h-svh overflow-y-auto shadow-2xl bg-[#FDF9F3] relative flex flex-col overflow-x-hidden">

        {/* Top area — icon + headline */}
        <div className="px-6 pt-16 pb-[clamp(0.5rem,1.5vh,1.5rem)] flex flex-col items-center relative z-10 w-full text-center flex-1 justify-center">

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

          <div className="text-[#136d41] font-extrabold text-xs mb-[clamp(0.5rem,1.5vh,1rem)] uppercase tracking-[0.2em] bg-[#136d41]/10 px-4 py-1.5 rounded-full">
            FosterHub AZ
          </div>

          <h1 className="text-[clamp(1.75rem,5vh,2.75rem)] font-extrabold text-[#115e59] mb-[clamp(0.5rem,1.5vh,1rem)] leading-[1.1]">
            {"This place is\nfor you."}
          </h1>

          <p className="text-slate-600 font-medium text-[clamp(0.9rem,1.8vh,1.125rem)] leading-relaxed max-w-sm mb-[clamp(0.75rem,2vh,1.5rem)] px-2">
            {"Foster care can be confusing and overwhelming. This is a calm, safe space to find real answers and learn your rights."}
          </p>

          <div className="bg-[#e0f2fe] rounded-full px-5 py-2.5 flex items-center justify-center gap-2 text-[13px] font-bold text-[#0c4a6e] shadow-sm border border-[#bae6fd]">
            <Lock size={14} className="text-[#0284c7]" />
            No sign-up • Nothing leaves your device
          </div>
        </div>

        {/* Bottom drawer — language selection */}
        <div className="bg-white rounded-t-[2.5rem] px-8 pt-[clamp(1rem,2.5vh,2rem)] pb-[clamp(1rem,3vh,2.5rem)] shadow-[0_-15px_40px_-15px_rgba(0,0,0,0.05)] relative z-20 flex flex-col shrink-0">

          <div className="flex items-center justify-between mb-[clamp(0.75rem,2vh,1.5rem)]">
            <h2 className="text-xl font-extrabold text-[#35322d]">
              <span lang="en">Pick a language</span> <span className="text-slate-500" aria-hidden="true">·</span> <span lang="es">Elige tu idioma</span>
            </h2>
            <div className="flex gap-1.5">
              <div className="w-8 h-2 rounded-full bg-[#136d41]" />
              <div className="w-2 h-2 rounded-full bg-slate-200" />
            </div>
          </div>

          {/* One tap picks the language and moves on. No "Continue" button. */}
          <div className="grid grid-cols-2 gap-4 mb-[clamp(0.5rem,1.5vh,1rem)]">
            <Link
              href="/en/setup"
              lang="en"
              className="aspect-[5/3] rounded-[2rem] p-4 flex flex-col justify-center items-center text-center transition-all duration-200 ease-out border-[3px] border-transparent bg-slate-50 shadow-sm hover:bg-[#fff4cc] hover:border-[#fbbf24] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#136d41]"
            >
              <span className="font-extrabold text-2xl tracking-tight text-[#35322d]">English</span>
            </Link>
            <Link
              href="/es/setup"
              lang="es"
              className="aspect-[5/3] rounded-[2rem] p-4 flex flex-col justify-center items-center text-center transition-all duration-200 ease-out border-[3px] border-transparent bg-slate-50 shadow-sm hover:bg-[#e0f2fe] hover:border-[#38bdf8] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#136d41]"
            >
              <span className="font-extrabold text-2xl tracking-tight text-[#35322d]">Español</span>
            </Link>
          </div>

        </div>
      </main>
    </div>
  );
}
