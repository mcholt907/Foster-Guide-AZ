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
          "flex overflow-hidden rounded-3xl bg-white/85 shadow-sm ring-1 ring-black/5 " +
          (clickable ? "cursor-pointer hover:shadow-md active:scale-[0.995] " : "") +
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
        "rounded-3xl bg-white/85 p-4 shadow-sm ring-1 ring-black/5 " +
        (clickable ? "cursor-pointer hover:shadow-md active:scale-[0.995] " : "") +
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
      ? "bg-[#D97706] hover:bg-[#c96a00] text-white"
      : variant === "teal"
        ? "bg-[#2A7F8E] hover:bg-[#236d7a] text-white"
        : "bg-[#1B3A5C] hover:bg-[#152e49] text-white";
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-2xl px-4 py-3 text-sm font-semibold shadow-sm active:scale-[0.99] transition-all ${cls}`}
    >
      <span className="flex items-center justify-center gap-2">
        {Icon ? <Icon className="h-4 w-4" /> : null}
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
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <div className="text-lg font-semibold leading-tight text-[#1B3A5C]">{title}</div>
          {subtitle ? <div className="mt-0.5 text-sm text-slate-500">{subtitle}</div> : null}
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
    <div className={`rounded-3xl bg-gradient-to-br ${gradient} p-5 shadow-md`}>
      <div className="flex items-start justify-between mb-3">
        <div className="rounded-2xl bg-white/15 p-2.5 backdrop-blur-sm">
          <Icon className="h-5 w-5 text-white" />
        </div>
        {onStartOver ? (
          <button
            onClick={onStartOver}
            className="rounded-xl bg-white/15 px-3 py-1.5 text-xs font-semibold text-white/90 hover:bg-white/25 transition-colors"
          >
            {lang === "es" ? "Empezar de nuevo" : "Start over"}
          </button>
        ) : right}
      </div>
      <h1 className="text-xl font-bold text-white leading-snug">{title}</h1>
      <div className="mt-1.5 text-sm text-white/80 leading-relaxed">{subtitle}</div>
    </div>
  );
}

// ─── SafeNotice ───────────────────────────────────────────────────────────────
export function SafeNotice({ lang }: { lang?: Lang | null }) {
  return (
    <div className="rounded-2xl bg-white/60 p-3 text-xs text-slate-500 ring-1 ring-slate-200/80">
      <div className="font-semibold text-slate-700">
        {lang === "es" ? "Para que sepas" : "Just so you know"}
      </div>
      <div className="mt-1">
        {lang === "es"
          ? "Comparto información para ayudarte a entender tu situación — pero no puedo dar consejos legales ni médicos. Para tu situación específica, habla con tu trabajador/a de casos, abogado/a o un adulto de confianza."
          : "I share information to help you understand your situation — but I can't give legal or medical advice. For your specific situation, talk to your caseworker, lawyer, or a trusted adult."}
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

// ─── Modal ────────────────────────────────────────────────────────────────────
export function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />
      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 bg-[#1B3A5C] px-4 py-3">
          <div className="text-sm font-semibold text-white">{title}</div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-white/70 hover:bg-white/10"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto p-4">{children}</div>
      </div>
    </div>
  );
}
