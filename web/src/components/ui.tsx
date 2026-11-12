"use client";

import React from "react";
import type { Lang } from "../lib/i18n";

// ─── Card ─────────────────────────────────────────────────────────────────────
export function Card({
  children,
  onClick,
  className = "",
  accentColor,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  accentColor?: string; // Tailwind class e.g. "bg-[#2A7F8E]"
}) {
  const clickable = !!onClick;
  if (accentColor) {
    return (
      <div
        onClick={onClick}
        className={
          "flex overflow-hidden rounded-[28px] bg-white/95 shadow-[0_8px_30px_rgb(0,0,0,0.06)] " +
          (clickable ? "cursor-pointer hover:shadow-md active:scale-[0.995] transition-all " : "") +
          className
        }
      >
        <div className={`w-1 shrink-0 ${accentColor}`} />
        <div className="flex-1 p-4">{children}</div>
      </div>
    );
  }
  return (
    <div
      onClick={onClick}
      className={
        "rounded-[28px] bg-white/95 p-4 shadow-[0_8px_30px_rgb(0,0,0,0.06)] " +
        (clickable ? "cursor-pointer hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] active:scale-[0.995] transition-all " : "") +
        className
      }
    >
      {children}
    </div>
  );
}

// ─── PrimaryButton ────────────────────────────────────────────────────────────
export function PrimaryButton({
  children,
  onClick,
  icon: Icon,
  variant = "default",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  icon?: React.ElementType;
  variant?: "default" | "amber" | "teal";
}) {
  const cls =
    variant === "amber"
      ? "bg-[#B45309] hover:bg-[#92400E] text-white"
      : variant === "teal"
        ? "bg-[#2A7F8E] hover:bg-[#236d7a] text-white"
        : "bg-[#1B3A5C] hover:bg-[#152e49] text-white";
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full min-h-11 rounded-2xl px-4 py-3.5 text-sm font-bold shadow-[0_4px_16px_rgb(0,0,0,0.1)] active:scale-[0.99] transition-all ${cls}`}
    >
      <span className="flex items-center justify-center gap-2">
        {Icon ? <Icon className="h-4 w-4" aria-hidden="true" /> : null}
        {children}
      </span>
    </button>
  );
}

// ─── Chip ─────────────────────────────────────────────────────────────────────
export function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-black/8 bg-white/70 px-2.5 py-1 text-xs text-slate-600 shadow-sm">
      {children}
    </span>
  );
}

// ─── SectionTitle ─────────────────────────────────────────────────────────────
export function SectionTitle({
  icon: Icon,
  title,
  subtitle,
  right,
  iconClassName,
}: {
  icon: React.ElementType;
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  iconClassName?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="flex items-start gap-3">
        <div className={`mt-0.5 rounded-2xl p-2 shadow-sm ring-1 ring-black/5 ${iconClassName ?? "bg-white/60"}`}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <div className="text-lg font-semibold leading-tight text-[#1B3A5C]">{title}</div>
          {subtitle ? <div className="mt-0.5 text-sm text-slate-600">{subtitle}</div> : null}
        </div>
      </div>
      {right}
    </div>
  );
}

// ─── Divider ─────────────────────────────────────────────────────────────────
export function Divider() {
  return <div className="my-3 h-px w-full bg-slate-200/70" />;
}

// ─── ScreenHero ───────────────────────────────────────────────────────────────
export function ScreenHero({
  title,
  subtitle,
  gradient,
  icon: Icon,
  right,
  onStartOver,
  lang,
}: {
  title: string;
  subtitle: string;
  gradient: string;
  icon: React.ElementType;
  right?: React.ReactNode;
  onStartOver?: () => void;
  lang?: Lang | null;
}) {
  return (
    <div className={`relative overflow-hidden rounded-[32px] bg-gradient-to-br ${gradient} p-6 shadow-lg shadow-black/10`}>
      <div aria-hidden="true" className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
      <div aria-hidden="true" className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-black/10 blur-2xl" />
      
      <div className="relative z-10 flex items-start justify-between mb-4">
        <div className="rounded-2xl bg-white/20 p-2.5 backdrop-blur-md shadow-sm">
          <Icon className="h-6 w-6 text-white" aria-hidden="true" />
        </div>
        {onStartOver ? (
          <button
            type="button"
            onClick={onStartOver}
            className="inline-flex min-h-11 items-center rounded-xl bg-black/20 px-3.5 py-1.5 text-sm font-bold tracking-wide text-white hover:bg-black/30 backdrop-blur-md transition-all shadow-sm"
          >
            {lang === "es" ? "Empezar de nuevo" : "Start over"}
          </button>
        ) : right}
      </div>
      <h1 className="relative z-10 text-[26px] font-extrabold tracking-tighter text-white leading-tight">{title}</h1>
      <div className="relative z-10 mt-2 text-[15px] font-medium text-white leading-relaxed tracking-wide max-w-sm">{subtitle}</div>
    </div>
  );
}

// ─── SafeNotice ───────────────────────────────────────────────────────────────
export function SafeNotice({ lang }: { lang?: Lang | null }) {
  return (
    <div className="rounded-2xl bg-white/60 p-3 text-sm text-slate-600 ring-1 ring-slate-200/80">
      <div className="font-semibold text-slate-700">
        {lang === "es" ? "Para que sepas" : "Just so you know"}
      </div>
      <div className="mt-1">
        {lang === "es"
          ? "Este sitio comparte información para ayudarte a entender tu situación — pero no puede dar consejos legales ni médicos. Para tu situación específica, habla con tu trabajador/a de casos, abogado/a o un adulto de confianza."
          : "This site shares information to help you understand your situation — but it can't give legal or medical advice. For your specific situation, talk to your caseworker, lawyer, or a trusted adult."}
      </div>
    </div>
  );
}

// ─── StatCite ─────────────────────────────────────────────────────────────────
export function StatCite({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-[#D97706]/25 bg-[#D97706]/10 px-2.5 py-1 text-xs text-[#9a5200]">
      {children}
    </span>
  );
}
