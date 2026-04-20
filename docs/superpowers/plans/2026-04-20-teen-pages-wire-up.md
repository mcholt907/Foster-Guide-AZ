# Teen Prototype Pages — Wire Up Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wire the five teen prototype components (`app/src/components/*Teen.tsx`) into the production `web/` app for age bands `13-15` / `16-17` / `18-21`, and port `/rights` `/resources` `/future` to the same teen visual system. `10-12` is untouched.

**Architecture:** Add a full-viewport `TeenShell` (fixed overlay, dark navy sidebar, emerald accents, Inter font) rendered by each page when `prefs.ageBand !== "10-12"`. Keep the existing `[lang]/layout.tsx` chrome for 10-12. New teen-only strings live in `web/src/lib/i18n-teen.ts`; age-band-specific tips and case-stage narratives live in `web/src/data/court.ts` as typed per-band maps. Reuse existing `web/public/` image assets (already shipped).

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind v4, `framer-motion` (new dep), `lucide-react`, Google `Inter` font via `next/font/google`.

**Spec:** [docs/superpowers/specs/2026-04-20-teen-pages-wire-up-design.md](../specs/2026-04-20-teen-pages-wire-up-design.md)

**Testing approach:** The `web/` project has no unit-test framework. Each task that changes code ends with `npm run build` (TypeScript + Next.js production build) and, where UI changes are non-trivial, `npm run dev` plus manual browser verification. Commit after each task so the history is bisectable if Render (auto-deploy on `master`) reports a regression.

---

## File Structure

**New files:**
- `web/src/lib/i18n-teen.ts` — `TEEN_STRINGS` table + `tt()` / `ttBand()` helpers.
- `web/src/components/TeenShell.tsx` — shared dark-sidebar chrome, desktop + mobile, for all teen pages.
- `web/src/components/teen/` — page-body components extracted for reuse across test/dev (`DashboardTeen.tsx`, `TeamTeen.tsx`, `CaseTeen.tsx`, `WellnessTeen.tsx`, `AskTeen.tsx`, `RightsTeen.tsx`, `ResourcesTeen.tsx`, `FutureTeen.tsx`).

**Modified files:**
- `web/package.json` — add `framer-motion`.
- `web/src/app/layout.tsx` — add `Inter` font (used only by `TeenShell`; Outfit stays on `body`).
- `web/src/data/court.ts` — add `CASE_STAGES_TEEN`, `CASE_FAQS_TEEN` exports; add optional `teen_tips` map to `WHO_IN_YOUR_CASE` entries.
- `web/src/app/[lang]/page.tsx` — teen branch dispatches to `<TeenShell active="dashboard">`.
- `web/src/app/[lang]/team/page.tsx` — teen branch.
- `web/src/app/[lang]/case/page.tsx` — teen branch.
- `web/src/app/[lang]/wellness/page.tsx` — teen branch.
- `web/src/app/[lang]/ask/page.tsx` — teen branch.
- `web/src/app/[lang]/rights/page.tsx` — teen branch.
- `web/src/app/[lang]/resources/page.tsx` — teen branch (note: existing redirects for 10-12 users are preserved).
- `web/src/app/[lang]/future/page.tsx` — teen branch.

**Untouched:**
- `/setup` onboarding.
- 10-12 page variants (`Dashboard1012` stays; 10-12 branches in all other pages stay).
- `app/` prototype.
- `server/` backend.

---

## Task 1: Install framer-motion and add Inter font

**Files:**
- Modify: `web/package.json`
- Modify: `web/src/app/layout.tsx`

- [ ] **Step 1: Install framer-motion**

From the repo root:

```bash
cd web && npm install framer-motion
```

Expected: adds `"framer-motion": "^12.x.x"` to `package.json` dependencies and updates `package-lock.json`.

- [ ] **Step 2: Verify install succeeded**

```bash
cd web && node -e "console.log(require('framer-motion/package.json').version)"
```

Expected: prints a version string (e.g., `12.x.x`).

- [ ] **Step 3: Add Inter font to root layout**

Edit `web/src/app/layout.tsx`. Replace the existing `Outfit` font import block with both Outfit and Inter so the teen shell has access to Inter via a CSS variable:

```tsx
import type { Metadata, Viewport } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"], display: "swap", variable: "--font-outfit" });
const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" });
```

Then update the `<html>` element to include both variables:

```tsx
<html lang="en" className={`h-full ${outfit.variable} ${inter.variable} ${outfit.className}`}>
```

The `body` continues to default to Outfit (via `outfit.className`). Teen pages will set `font-['var(--font-inter)']` inline to switch.

- [ ] **Step 4: Verify build**

```bash
cd web && npm run build
```

Expected: build completes with 0 TypeScript errors. All existing routes prerender.

- [ ] **Step 5: Commit**

```bash
cd "/c/Users/farkh/OneDrive/Documents/Foster Guide AZ"
git add web/package.json web/package-lock.json web/src/app/layout.tsx
git commit -m "chore(web): install framer-motion and add Inter font for teen shell"
```

---

## Task 2: Create `i18n-teen.ts` helper with nav/shell strings

**Files:**
- Create: `web/src/lib/i18n-teen.ts`

- [ ] **Step 1: Create the file with helpers + initial strings**

Create `web/src/lib/i18n-teen.ts`:

```ts
import type { Lang } from "./i18n";
import type { AgeBandKey } from "./prefs";

export const TEEN_STRINGS = {
  // ── Sidebar / nav ───────────────────────────────────────────────────────
  "nav.dashboard":           { en: "Dashboard",              es: "Inicio" },
  "nav.case":                { en: "My Case Explained",      es: "Mi Caso Explicado" },
  "nav.team":                { en: "My Advocates",           es: "Mis Defensores" },
  "nav.wellness":            { en: "Mental Health",          es: "Salud Mental" },
  "nav.answers":             { en: "Search Portal",          es: "Portal de Búsqueda" },
  "nav.rights":              { en: "Know Your Rights",       es: "Conoce Tus Derechos" },
  "nav.resources":           { en: "Resources",              es: "Recursos" },
  "nav.future":              { en: "My Future",              es: "Mi Futuro" },
  "shell.brand":             { en: "FosterHub",              es: "FosterHub" },
  "shell.brand_sub":         { en: "Arizona",                es: "Arizona" },
  "shell.command_center":    { en: "Command Center",         es: "Centro de Comando" },
  "shell.band_language.en":  { en: "Ages {band} · English",  es: "Edades {band} · Inglés" },
  "shell.band_language.es":  { en: "Ages {band} · Spanish",  es: "Edades {band} · Español" },
  "shell.start_over":        { en: "↩ Start over",           es: "↩ Empezar de nuevo" },
  "shell.start_over_confirm":{ en: "This clears your preferences. Continue?",
                               es: "Esto borra tus preferencias. ¿Continuar?" },
  "shell.start_over_yes":    { en: "Yes, start over",        es: "Sí, empezar de nuevo" },
  "shell.start_over_no":     { en: "Cancel",                 es: "Cancelar" },
  "shell.footer_tagline":    { en: "Arizona Youth Services", es: "Servicios para Jóvenes de Arizona" },
} as const;

export type TeenStringKey = keyof typeof TEEN_STRINGS;

export function tt(key: TeenStringKey, lang: Lang, vars?: Record<string, string>): string {
  const template = TEEN_STRINGS[key][lang];
  return vars ? template.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "") : template;
}

export function ttBand(keyBase: string, band: AgeBandKey, lang: Lang): string {
  const suffix = band.replace("-", "");
  return tt(`${keyBase}.${suffix}` as TeenStringKey, lang);
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd web && npm run build
```

Expected: 0 TS errors. (The file is not yet imported by any page, so the production build output is identical to Task 1.)

- [ ] **Step 3: Commit**

```bash
cd "/c/Users/farkh/OneDrive/Documents/Foster Guide AZ"
git add web/src/lib/i18n-teen.ts
git commit -m "feat(web): add i18n-teen helper with tt/ttBand and shell/nav strings"
```

---

## Task 3: Create `TeenShell.tsx` — desktop sidebar

**Files:**
- Create: `web/src/components/TeenShell.tsx`

- [ ] **Step 1: Create the shell with desktop sidebar only**

Create `web/src/components/TeenShell.tsx`:

```tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Home as HomeIcon, FolderOpen, Users, HeartPulse, HelpCircle,
  Shield, MapPin, Sparkles, Menu, X,
} from "lucide-react";
import type { Lang } from "../lib/i18n";
import { tt, type TeenStringKey } from "../lib/i18n-teen";
import { usePrefs } from "../lib/prefs";

export type TeenNavId =
  | "dashboard" | "case" | "team" | "wellness" | "answers"
  | "rights" | "resources" | "future";

interface TeenShellProps {
  active: TeenNavId;
  lang: Lang;
  children: React.ReactNode;
}

interface NavItem {
  id: TeenNavId;
  icon: typeof HomeIcon;
  href: string;
  labelKey: TeenStringKey;
}

const NAV_ITEMS: NavItem[] = [
  { id: "dashboard", icon: HomeIcon,    href: "",            labelKey: "nav.dashboard" },
  { id: "case",      icon: FolderOpen,  href: "/case",       labelKey: "nav.case" },
  { id: "team",      icon: Users,       href: "/team",       labelKey: "nav.team" },
  { id: "wellness",  icon: HeartPulse,  href: "/wellness",   labelKey: "nav.wellness" },
  { id: "answers",   icon: HelpCircle,  href: "/ask",        labelKey: "nav.answers" },
  { id: "rights",    icon: Shield,      href: "/rights",     labelKey: "nav.rights" },
  { id: "resources", icon: MapPin,      href: "/resources",  labelKey: "nav.resources" },
  { id: "future",    icon: Sparkles,    href: "/future",     labelKey: "nav.future" },
];

export function TeenShell({ active, lang, children }: TeenShellProps) {
  const router = useRouter();
  const [, , , reset] = usePrefs();
  const [confirmReset, setConfirmReset] = useState(false);

  function handleStartOver() {
    reset();
    router.push("/");
  }

  return (
    <div
      className="fixed inset-0 z-50 flex w-full bg-[#FDFBF7] text-[#2d3748] overflow-x-hidden selection:bg-emerald-100/80"
      style={{ fontFamily: "var(--font-inter), Inter, system-ui, sans-serif" }}
    >
      {/* Desktop sidebar */}
      <aside className="w-[300px] bg-[#1a2f44] text-white flex-shrink-0 hidden md:flex flex-col relative z-30 shadow-[4px_0_24px_rgba(0,0,0,0.05)]">
        <div className="p-10 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white shadow-[0_8px_20px_rgba(255,255,255,0.15)] rounded-2xl flex items-center justify-center overflow-hidden">
              <img src="/onboarding/welcome_icon.png" alt="" className="w-full h-full object-cover scale-[1.1] translate-y-1" />
            </div>
            <div className="flex flex-col text-left">
              <span className="font-black text-xl leading-tight tracking-tight">{tt("shell.brand", lang)}</span>
              <span className="text-[10px] uppercase tracking-[0.3em] text-emerald-400 font-black">{tt("shell.brand_sub", lang)}</span>
            </div>
          </div>
        </div>

        <nav className="flex flex-col px-6 gap-2 flex-1">
          {NAV_ITEMS.map((item) => {
            const isActive = item.id === active;
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                href={`/${lang}${item.href}`}
                className={`flex items-center gap-4 px-5 py-4 rounded-[1.25rem] transition-all duration-500 group relative ${
                  isActive
                    ? "bg-gradient-to-r from-white/15 to-transparent text-white font-bold shadow-[0_4px_12px_rgba(0,0,0,0.1)]"
                    : "text-slate-400 hover:bg-white/5 hover:text-white font-medium"
                }`}
              >
                <Icon size={20} className={`shrink-0 transition-all duration-300 group-hover:scale-110 ${isActive ? "text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]" : ""}`} />
                <span className="text-[15.5px] tracking-tight">{tt(item.labelKey, lang)}</span>
                {isActive && <motion.div layoutId="nav-pill" className="absolute left-0 w-1.5 h-8 bg-emerald-400 rounded-r-full shadow-[0_0_12px_rgba(52,211,153,0.8)]" />}
              </Link>
            );
          })}
        </nav>

        {/* Footer: band+lang badge + start-over */}
        <div className="p-8">
          <TeenShellFooter lang={lang} confirmReset={confirmReset} setConfirmReset={setConfirmReset} handleStartOver={handleStartOver} />
        </div>
      </aside>

      {/* Main content area */}
      <main className="flex-1 overflow-y-auto relative w-full pb-24 md:pb-0 scroll-smooth">
        {children}
      </main>
    </div>
  );
}

function TeenShellFooter({
  lang, confirmReset, setConfirmReset, handleStartOver,
}: {
  lang: Lang;
  confirmReset: boolean;
  setConfirmReset: (v: boolean) => void;
  handleStartOver: () => void;
}) {
  const [prefs] = usePrefs();
  const band = prefs.ageBand ?? "13-15";
  const langKey: TeenStringKey = lang === "es" ? "shell.band_language.es" : "shell.band_language.en";

  return (
    <div className="w-full p-6 rounded-[2rem] bg-gradient-to-br from-white/5 to-transparent border border-white/10 relative overflow-hidden group">
      <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-emerald-500/10 blur-2xl rounded-full" />
      <Shield size={20} className="text-emerald-400 mb-3" />
      <p className="text-white text-[13px] font-black leading-relaxed mb-1 tracking-tight">{tt("shell.command_center", lang)}</p>
      <p className="text-slate-400 text-[10px] leading-relaxed font-bold opacity-80 uppercase tracking-widest">
        {tt(langKey, lang, { band })}
      </p>

      {!confirmReset ? (
        <button
          type="button"
          onClick={() => setConfirmReset(true)}
          className="mt-4 text-[11px] text-slate-400 underline hover:text-white transition-colors"
        >
          {tt("shell.start_over", lang)}
        </button>
      ) : (
        <div className="mt-4 space-y-2">
          <p className="text-[11px] text-slate-300 leading-relaxed">{tt("shell.start_over_confirm", lang)}</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleStartOver}
              className="flex-1 text-[11px] font-bold bg-emerald-500 text-white rounded-xl py-2 hover:bg-emerald-600 transition"
            >
              {tt("shell.start_over_yes", lang)}
            </button>
            <button
              type="button"
              onClick={() => setConfirmReset(false)}
              className="flex-1 text-[11px] font-bold bg-white/10 text-white rounded-xl py-2 hover:bg-white/20 transition"
            >
              {tt("shell.start_over_no", lang)}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
```

Note: this import of `Shield` in the footer uses the same `Shield` already imported at the top of the file — no duplicate import.

- [ ] **Step 2: Verify build**

```bash
cd web && npm run build
```

Expected: 0 TypeScript errors. `TeenShell` is not yet used, so SSG output is unchanged.

- [ ] **Step 3: Commit**

```bash
cd "/c/Users/farkh/OneDrive/Documents/Foster Guide AZ"
git add web/src/components/TeenShell.tsx
git commit -m "feat(web): add TeenShell component with desktop sidebar + start-over"
```

---

## Task 4: Add mobile header + full-screen drawer to `TeenShell`

**Files:**
- Modify: `web/src/components/TeenShell.tsx`

- [ ] **Step 1: Add mobile header and drawer state**

In `TeenShell.tsx`, add state for the mobile drawer inside the `TeenShell` component, near the existing `confirmReset` state:

```tsx
const [drawerOpen, setDrawerOpen] = useState(false);
```

- [ ] **Step 2: Insert the mobile header + drawer before the `<main>` element**

In the return, immediately before `<main className="flex-1 ...`, insert:

```tsx
{/* Mobile top header */}
<header className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-xl border-b border-slate-100">
  <div className="flex items-center gap-3">
    <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center overflow-hidden shadow-lg border border-white/20">
      <img src="/onboarding/welcome_icon.png" alt="" className="w-full h-full object-cover scale-[1.1] translate-y-1" />
    </div>
    <span className="font-black text-[#1e293b] tracking-tight text-lg">{tt("shell.brand", lang)} AZ</span>
  </div>
  <button
    type="button"
    onClick={() => setDrawerOpen(true)}
    aria-label="Open menu"
    className="w-10 h-10 flex items-center justify-center bg-slate-50 text-slate-500 rounded-xl"
  >
    <Menu size={20} />
  </button>
</header>

{/* Mobile drawer */}
{drawerOpen && (
  <div className="md:hidden fixed inset-0 z-50 bg-[#1a2f44] text-white flex flex-col">
    <div className="flex items-center justify-between p-6 border-b border-white/10">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center overflow-hidden">
          <img src="/onboarding/welcome_icon.png" alt="" className="w-full h-full object-cover scale-[1.1] translate-y-1" />
        </div>
        <div className="flex flex-col">
          <span className="font-black text-lg tracking-tight">{tt("shell.brand", lang)}</span>
          <span className="text-[10px] uppercase tracking-[0.3em] text-emerald-400 font-black">{tt("shell.brand_sub", lang)}</span>
        </div>
      </div>
      <button
        type="button"
        onClick={() => setDrawerOpen(false)}
        aria-label="Close menu"
        className="w-10 h-10 flex items-center justify-center text-white/70 hover:text-white"
      >
        <X size={22} />
      </button>
    </div>
    <nav className="flex flex-col px-4 gap-2 flex-1 pt-4">
      {NAV_ITEMS.map((item) => {
        const isActive = item.id === active;
        const Icon = item.icon;
        return (
          <Link
            key={item.id}
            href={`/${lang}${item.href}`}
            onClick={() => setDrawerOpen(false)}
            className={`flex items-center gap-4 px-5 py-4 rounded-[1.25rem] transition-all ${
              isActive
                ? "bg-white/15 text-white font-bold"
                : "text-slate-300 hover:bg-white/5 hover:text-white font-medium"
            }`}
          >
            <Icon size={22} className={isActive ? "text-emerald-400" : ""} />
            <span className="text-base tracking-tight">{tt(item.labelKey, lang)}</span>
          </Link>
        );
      })}
    </nav>
    <div className="p-6">
      <TeenShellFooter lang={lang} confirmReset={confirmReset} setConfirmReset={setConfirmReset} handleStartOver={handleStartOver} />
    </div>
  </div>
)}
```

Add top padding to `<main>` so the mobile header doesn't cover content:

```tsx
<main className="flex-1 overflow-y-auto relative w-full pt-20 md:pt-0 pb-24 md:pb-0 scroll-smooth">
  {children}
</main>
```

- [ ] **Step 3: Verify build**

```bash
cd web && npm run build
```

Expected: 0 TS errors.

- [ ] **Step 4: Commit**

```bash
cd "/c/Users/farkh/OneDrive/Documents/Foster Guide AZ"
git add web/src/components/TeenShell.tsx
git commit -m "feat(web): add mobile header and drawer to TeenShell"
```

---

## Task 5: Add floating mobile bottom nav to `TeenShell`

**Files:**
- Modify: `web/src/components/TeenShell.tsx`

- [ ] **Step 1: Add a bottom nav for primary items only**

In `TeenShell.tsx`, near the top of the file (after `NAV_ITEMS`), declare a filtered list of primary items shown on the mobile bottom nav:

```tsx
const MOBILE_BOTTOM_IDS: TeenNavId[] = ["dashboard", "case", "team", "wellness", "answers"];
```

In the return, immediately after the closing `</main>` tag, add:

```tsx
{/* Mobile floating bottom nav */}
<nav className="md:hidden fixed bottom-4 left-4 right-4 z-40 bg-[#1a2f44] rounded-[1.5rem] shadow-[0_12px_40px_rgba(26,47,68,0.4)] px-3 py-2 flex justify-around">
  {NAV_ITEMS.filter((it) => MOBILE_BOTTOM_IDS.includes(it.id)).map((item) => {
    const isActive = item.id === active;
    const Icon = item.icon;
    return (
      <Link
        key={item.id}
        href={`/${lang}${item.href}`}
        className={`flex flex-col items-center gap-1 px-3 py-2 rounded-2xl transition-colors ${
          isActive ? "bg-white/10 text-emerald-400" : "text-slate-400"
        }`}
      >
        <Icon size={20} />
        <span className="text-[10px] font-bold tracking-tight whitespace-nowrap">
          {tt(item.labelKey, lang)}
        </span>
      </Link>
    );
  })}
</nav>
```

- [ ] **Step 2: Verify build**

```bash
cd web && npm run build
```

Expected: 0 TS errors.

- [ ] **Step 3: Commit**

```bash
cd "/c/Users/farkh/OneDrive/Documents/Foster Guide AZ"
git add web/src/components/TeenShell.tsx
git commit -m "feat(web): add floating mobile bottom nav to TeenShell"
```

---

## Task 6: Extend `court.ts` — add `teen_tips` to `WHO_IN_YOUR_CASE`

**Files:**
- Modify: `web/src/data/court.ts`

- [ ] **Step 1: Extend the `WHO_IN_YOUR_CASE` entries with optional `teen_tips`**

In `web/src/data/court.ts`, add a `teen_tips` field to each entry. Place it immediately after the existing `tip_es` field in each object. Full additions below — keep all other fields unchanged.

For the `caseworker` entry:

```ts
teen_tips: {
  "13-15": {
    en: "Your caseworker's number should always be in your phone. If they don't visit monthly, that's a problem you can raise.",
    es: "El número de tu trabajador/a de casos debe estar siempre en tu teléfono. Si no te visita cada mes, eso es algo que puedes reportar.",
  },
  "16-17": {
    en: "Ask your caseworker in writing about your transition plan. You're entitled to one at 16 — make sure it's being built.",
    es: "Pídele a tu trabajador/a de casos por escrito sobre tu plan de transición. Tienes derecho a uno a los 16 — asegúrate de que lo estén desarrollando.",
  },
  "18-21": {
    en: "Even if you've signed out, your caseworker can still connect you to extended services. Keep the line open.",
    es: "Aunque hayas salido del cuidado, tu trabajador/a de casos aún puede conectarte con servicios extendidos. Mantén el contacto.",
  },
},
```

For the `judge` entry:

```ts
teen_tips: {
  "13-15": {
    en: "Judges want to hear from you — it's not weird to speak up. Your attorney can ask for you, or you can ask to speak directly.",
    es: "Los jueces quieren escucharte — no es raro hablar. Tu abogado/a puede pedirlo por ti, o tú puedes pedir hablar directamente.",
  },
  "16-17": {
    en: "At this age the judge weighs your input heavily. Come to hearings ready with specific requests — school, placement, contact with siblings.",
    es: "A esta edad, el juez considera mucho tu opinión. Llega a las audiencias con peticiones específicas — escuela, colocación, contacto con hermanos.",
  },
  "18-21": {
    en: "If you're in extended care, the judge still oversees your case. You can request hearings to address services that aren't working.",
    es: "Si estás en cuidado extendido, el juez aún supervisa tu caso. Puedes pedir audiencias para tratar servicios que no están funcionando.",
  },
},
```

For the `attorney` entry:

```ts
teen_tips: {
  "13-15": {
    en: "Your attorney works for you, not your parents and not DCS. If you don't know who they are, your caseworker has to tell you.",
    es: "Tu abogado/a trabaja para ti, no para tus padres ni para DCS. Si no sabes quién es, tu trabajador/a de casos tiene que decírtelo.",
  },
  "16-17": {
    en: "Ask your attorney to walk you through every court document before you sign or agree to anything. That's their job.",
    es: "Pídele a tu abogado/a que te explique cada documento del tribunal antes de firmar o aceptar algo. Ese es su trabajo.",
  },
  "18-21": {
    en: "Your attorney may change if you enter extended care. Get the new attorney's contact info at the transition hearing.",
    es: "Tu abogado/a puede cambiar si entras al cuidado extendido. Obtén la información de contacto del nuevo abogado en la audiencia de transición.",
  },
},
```

For the `CASA` entry:

```ts
teen_tips: {
  "13-15": {
    en: "A CASA volunteer can be someone you see outside of court — a steady adult who's not your caseworker and not related to you.",
    es: "Un voluntario/a CASA puede ser alguien que ves fuera del tribunal — un adulto constante que no es tu trabajador/a de casos ni pariente.",
  },
  "16-17": {
    en: "If your CASA hasn't talked with you about your long-term plan, ask them to. That's what they're there for.",
    es: "Si tu CASA no ha hablado contigo sobre tu plan a largo plazo, pídeselo. Para eso están.",
  },
  "18-21": {
    en: "CASA typically ends when your case closes. If you had one and want to stay in touch, ask — many volunteers stay connected informally.",
    es: "CASA generalmente termina cuando tu caso se cierra. Si tuviste uno/a y quieres mantenerte en contacto, pregunta — muchos voluntarios se mantienen en contacto informalmente.",
  },
},
```

For the `foster_parent` / `caregiver` entry:

```ts
teen_tips: {
  "13-15": {
    en: "Your caregiver is responsible for your day-to-day needs. If something basic isn't happening — food, a bed, school transport — tell your caseworker.",
    es: "Tu cuidador/a es responsable de tus necesidades diarias. Si algo básico no está pasando — comida, una cama, transporte a la escuela — dile a tu trabajador/a de casos.",
  },
  "16-17": {
    en: "Caregivers can help you learn adult skills — cooking, banking, driving. Ask. It's a normal teenager thing to expect.",
    es: "Los cuidadores pueden ayudarte a aprender habilidades de adulto — cocinar, banca, manejar. Pide. Es algo normal que un/a adolescente debe esperar.",
  },
  "18-21": {
    en: "If you're staying with a former caregiver in extended care, you're technically a 'young adult in care' — your relationship is different.",
    es: "Si estás con un/a ex-cuidador/a en cuidado extendido, técnicamente eres un/a 'adulto joven en cuidado' — tu relación es diferente.",
  },
},
```

For the `supervisor` entry (if present in the file):

```ts
teen_tips: {
  "13-15": {
    en: "A supervisor is your caseworker's boss. If something isn't being handled, this is who you call next.",
    es: "Un supervisor/a es el jefe/a de tu trabajador/a de casos. Si algo no se está manejando, es a quien llamas después.",
  },
  "16-17": {
    en: "Write things down before calling a supervisor. Dates, what you asked for, what happened. It helps everyone.",
    es: "Escribe las cosas antes de llamar a un supervisor/a. Fechas, lo que pediste, lo que pasó. Ayuda a todos.",
  },
  "18-21": {
    en: "If you disagree with a supervisor's decision, the next step is the DCS Ombudsman. Your attorney can help you file.",
    es: "Si no estás de acuerdo con la decisión de un supervisor/a, el siguiente paso es el Defensor/a del Pueblo de DCS. Tu abogado/a puede ayudarte a presentar el caso.",
  },
},
```

For the `GAL` (Guardian ad Litem) entry (if present):

```ts
teen_tips: {
  "13-15": {
    en: "A GAL is an attorney who represents your 'best interest' — sometimes different from what you want. Your own attorney is separate.",
    es: "Un GAL es un abogado/a que representa tu 'mejor interés' — a veces diferente de lo que tú quieres. Tu propio/a abogado/a es separado.",
  },
  "16-17": {
    en: "Ask the GAL to explain what 'best interest' means for your specific case. They should be able to tell you clearly.",
    es: "Pídele al GAL que te explique qué significa 'mejor interés' para tu caso específico. Debe poder decírtelo claramente.",
  },
  "18-21": {
    en: "At 18+, you typically have your own attorney directly — the GAL role often ends. Confirm with your attorney.",
    es: "A los 18+, usualmente tienes tu propio/a abogado/a directamente — el rol de GAL a menudo termina. Confirma con tu abogado/a.",
  },
},
```

**Verify extension of the existing type/shape.** If there is a TypeScript type declaring `WHO_IN_YOUR_CASE` entries, add the optional field:

```ts
teen_tips?: {
  "13-15": { en: string; es: string };
  "16-17": { en: string; es: string };
  "18-21": { en: string; es: string };
};
```

- [ ] **Step 2: Verify build**

```bash
cd web && npm run build
```

Expected: 0 TS errors. Output unchanged (the new field is not yet consumed).

- [ ] **Step 3: Verify content validation still passes**

```bash
cd "/c/Users/farkh/OneDrive/Documents/Foster Guide AZ"
npx ts-node scripts/validate-content.ts
```

Expected: no new errors (our changes don't affect URL/phone/citation formats).

- [ ] **Step 4: Commit**

```bash
git add web/src/data/court.ts
git commit -m "feat(web): add per-band teen_tips to WHO_IN_YOUR_CASE entries"
```

---

## Task 7: Extend `court.ts` — add `CASE_STAGES_TEEN` + `CASE_FAQS_TEEN`

**Files:**
- Modify: `web/src/data/court.ts`

- [ ] **Step 1: Append new exports to `court.ts`**

Add at the bottom of `web/src/data/court.ts`:

```ts
// ─────────────────────────────────────────────────────────────────────────
// Teen case stages — shown on /case for ageBand != "10-12"
// ─────────────────────────────────────────────────────────────────────────

export type TeenColorTheme = "emerald" | "indigo" | "blue" | "rose" | "amber" | "cyan" | "slate";

export interface CaseStageTeen {
  id: string;
  title:    { en: string; es: string };
  subtitle: { en: string; es: string };
  color:    TeenColorTheme;
  what:     { en: string; es: string };
  teen:     Record<"13-15" | "16-17" | "18-21", { en: string; es: string }>;
  insight:  Record<"13-15" | "16-17" | "18-21", { en: string; es: string }>;
  next:     { en: string; es: string };
}

export const CASE_STAGES_TEEN: CaseStageTeen[] = [
  {
    id: "prelim",
    title:    { en: "First Safety Hearing", es: "Primera Audiencia de Seguridad" },
    subtitle: { en: "Preliminary Protective Hearing", es: "Audiencia Protectora Preliminar" },
    color:    "emerald",
    what: {
      en: "The judge checks if you're safe and decides what happens right away — usually within just a few days of coming into care.",
      es: "El juez verifica si estás seguro/a y decide qué pasa de inmediato — generalmente a los pocos días de entrar al cuidado.",
    },
    teen: {
      "13-15": {
        en: "This hearing moves fast. Your lawyer's main job is to make sure you end up in the safest, least restrictive place possible.",
        es: "Esta audiencia se mueve rápido. El trabajo principal de tu abogado/a es asegurarse de que termines en el lugar más seguro y menos restrictivo posible.",
      },
      "16-17": {
        en: "This is often a fast-paced hearing. Your lawyer's primary job is to ensure you are in the safest, least restrictive placement possible.",
        es: "A menudo es una audiencia rápida. El trabajo principal de tu abogado/a es asegurar que estés en la colocación más segura y menos restrictiva posible.",
      },
      "18-21": {
        en: "If you're coming back into care as a young adult, this hearing sets your extended care placement. Know your options before it starts.",
        es: "Si regresas al cuidado como adulto joven, esta audiencia establece tu colocación en cuidado extendido. Conoce tus opciones antes de que empiece.",
      },
    },
    insight: {
      "13-15": {
        en: "Before it starts, tell your lawyer where you'd like to live. A relative, a friend's family, someone you already know — your preference matters.",
        es: "Antes de que empiece, dile a tu abogado/a dónde te gustaría vivir. Un pariente, la familia de un amigo, alguien que ya conoces — tu preferencia importa.",
      },
      "16-17": {
        en: "Before it starts, tell your lawyer exactly where you want to live. Even if it's with a relative or a friend's family, they need to advocate for your preference.",
        es: "Antes de que empiece, dile a tu abogado/a exactamente dónde quieres vivir. Incluso si es con un pariente o la familia de un amigo, necesitan abogar por tu preferencia.",
      },
      "18-21": {
        en: "Ask about Independent Living Services up front — they exist and you're eligible. Don't wait for someone to bring it up.",
        es: "Pregunta por los Servicios de Vida Independiente desde el principio — existen y eres elegible. No esperes a que alguien lo mencione.",
      },
    },
    next: {
      en: "Dates for the next hearings are set.",
      es: "Se fijan las fechas de las próximas audiencias.",
    },
  },
  {
    id: "adjudication",
    title:    { en: "The Facts Hearing", es: "La Audiencia de Hechos" },
    subtitle: { en: "Adjudication", es: "Adjudicación" },
    color:    "indigo",
    what: {
      en: "The court decides if the concerns in your case are proven and whether the state (DCS) needs to stay involved.",
      es: "El tribunal decide si las preocupaciones en tu caso están probadas y si el estado (DCS) necesita seguir involucrado.",
    },
    teen: {
      "13-15": {
        en: "If the judge decides your case is 'dependent,' the court stays in charge of decisions about where you live and what help you get.",
        es: "Si el juez decide que tu caso es 'dependiente,' el tribunal sigue a cargo de las decisiones sobre dónde vives y qué ayuda recibes.",
      },
      "16-17": {
        en: "This is a critical legal milestone. If the judge 'adjudicates' you dependent, the court gains authority over where you live and what services you receive.",
        es: "Este es un hito legal crítico. Si el juez te 'adjudica' dependiente, el tribunal gana autoridad sobre dónde vives y qué servicios recibes.",
      },
      "18-21": {
        en: "If you voluntarily entered extended care, there's no adjudication — but reviews of your plan still happen. This stage looks different for you.",
        es: "Si entraste voluntariamente al cuidado extendido, no hay adjudicación — pero las revisiones de tu plan aún ocurren. Esta etapa se ve diferente para ti.",
      },
    },
    insight: {
      "13-15": {
        en: "Ask your lawyer: 'What does this mean for my school?' and 'Will I be able to see my siblings?' Those are legal questions they can answer.",
        es: "Pregúntale a tu abogado/a: '¿Qué significa esto para mi escuela?' y '¿Podré ver a mis hermanos/as?' Son preguntas legales que pueden responder.",
      },
      "16-17": {
        en: "Ask your lawyer: 'How does this decision affect my school stability and my right to work?' If you're 16+, your education plan should be a priority.",
        es: "Pregúntale a tu abogado/a: '¿Cómo afecta esta decisión mi estabilidad escolar y mi derecho a trabajar?' Si tienes 16+, tu plan educativo debe ser prioridad.",
      },
      "18-21": {
        en: "Ask about your Educational and Training Voucher (ETV) eligibility now. The deadline to apply each year is real.",
        es: "Pregunta sobre tu elegibilidad para el Vale Educativo y de Capacitación (ETV) ahora. La fecha límite anual para aplicar es real.",
      },
    },
    next: {
      en: "Your case plan and services get reviewed and updated.",
      es: "Tu plan de caso y servicios se revisan y actualizan.",
    },
  },
  {
    id: "review",
    title:    { en: "The Check-In Hearing", es: "La Audiencia de Seguimiento" },
    subtitle: { en: "Review Hearing", es: "Audiencia de Revisión" },
    color:    "blue",
    what: {
      en: "The judge checks in on how your plan is going, how your family is doing, and what needs to change.",
      es: "El juez revisa cómo va tu plan, cómo está tu familia, y qué necesita cambiar.",
    },
    teen: {
      "13-15": {
        en: "These hearings happen a few times a year. They're where the judge gets a current picture of your life — school, home, health.",
        es: "Estas audiencias pasan varias veces al año. Es donde el juez obtiene una imagen actual de tu vida — escuela, hogar, salud.",
      },
      "16-17": {
        en: "As a teen, these are your best opportunities to update the judge on your progress toward independence.",
        es: "Como adolescente, estas son tus mejores oportunidades para actualizar al juez sobre tu progreso hacia la independencia.",
      },
      "18-21": {
        en: "Reviews in extended care focus on whether services are actually working. Bring specific examples — good and bad.",
        es: "Las revisiones en cuidado extendido se centran en si los servicios realmente funcionan. Trae ejemplos específicos — buenos y malos.",
      },
    },
    insight: {
      "13-15": {
        en: "Bring 1 or 2 specific updates: something going well (a class, a friendship) and something that isn't (a missed appointment, a tough placement). Real stuff is useful.",
        es: "Trae 1 o 2 actualizaciones específicas: algo que va bien (una clase, una amistad) y algo que no (una cita perdida, una colocación difícil). Lo real es útil.",
      },
      "16-17": {
        en: "Come with 1–2 specific updates: what's working (like a job or a school club) and what isn't (like needing more driver's ed). Documenting these makes them real for the court.",
        es: "Llega con 1–2 actualizaciones específicas: qué funciona (como un trabajo o un club escolar) y qué no (como necesitar más clases de manejo). Documentar esto lo hace real para el tribunal.",
      },
      "18-21": {
        en: "If a service provider isn't showing up or a skill you need isn't being taught, say so on the record. The judge can order changes.",
        es: "Si un proveedor de servicios no aparece o una habilidad que necesitas no se está enseñando, dilo en el registro. El juez puede ordenar cambios.",
      },
    },
    next: {
      en: "More check-ins are scheduled, or you move toward a long-term plan.",
      es: "Se programan más seguimientos, o avanzas hacia un plan a largo plazo.",
    },
  },
  {
    id: "permanency",
    title:    { en: "Long-Term Plan Hearing", es: "Audiencia del Plan a Largo Plazo" },
    subtitle: { en: "Permanency Hearing", es: "Audiencia de Permanencia" },
    color:    "rose",
    what: {
      en: "The judge discusses the long-term plan for your future — like going home, guardianship, or transitioning to adulthood.",
      es: "El juez discute el plan a largo plazo para tu futuro — como regresar a casa, tutela, o la transición a la adultez.",
    },
    teen: {
      "13-15": {
        en: "This hearing asks the question: what's the permanent plan? Going home, a relative taking guardianship, adoption, or another long-term path.",
        es: "Esta audiencia pregunta: ¿cuál es el plan permanente? Regresar a casa, un pariente tomando tutela, adopción, u otro camino a largo plazo.",
      },
      "16-17": {
        en: "For older youth, this hearing is essentially your 'launch plan.' It's where the court formalizes what happens when you turn 18.",
        es: "Para jóvenes mayores, esta audiencia es esencialmente tu 'plan de lanzamiento.' Es donde el tribunal formaliza qué pasa cuando cumples 18.",
      },
      "18-21": {
        en: "This is where extended care is set up, renewed, or closed. Know which of these is on the agenda before you walk in.",
        es: "Aquí es donde el cuidado extendido se establece, se renueva, o se cierra. Sabe cuál de estos está en la agenda antes de entrar.",
      },
    },
    insight: {
      "13-15": {
        en: "Tell your lawyer what kind of home you want long-term — even if it feels early. Having that on the record matters for years.",
        es: "Dile a tu abogado/a qué tipo de hogar quieres a largo plazo — aunque se sienta temprano. Tenerlo en el registro importa por años.",
      },
      "16-17": {
        en: "Arizona law requires a transition plan for all youth 16 and older. If your hearing doesn't mention 'Independent Living' or 'Extended Care' options, remind your attorney to bring it up.",
        es: "La ley de Arizona requiere un plan de transición para todos los jóvenes de 16 años o más. Si tu audiencia no menciona 'Vida Independiente' o 'Cuidado Extendido,' recuérdale a tu abogado/a que lo mencione.",
      },
      "18-21": {
        en: "Once you sign into extended care, you can sign out anytime. You can also come back in (once) before 21. Know your options.",
        es: "Una vez que firmas para entrar al cuidado extendido, puedes firmar para salir en cualquier momento. También puedes regresar (una vez) antes de los 21. Conoce tus opciones.",
      },
    },
    next: {
      en: "Everyone takes final steps toward your long-term plan.",
      es: "Todos toman los pasos finales hacia tu plan a largo plazo.",
    },
  },
];

// ─────────────────────────────────────────────────────────────────────────
// Teen case FAQs
// ─────────────────────────────────────────────────────────────────────────

export interface CaseFAQTeen {
  q: { en: string; es: string };
  a: { en: string; es: string };
}

export const CASE_FAQS_TEEN: CaseFAQTeen[] = [
  {
    q: {
      en: "Do I have to go to court?",
      es: "¿Tengo que ir a la corte?",
    },
    a: {
      en: "Usually yes — but your lawyer will tell you what to expect ahead of time. You won't be alone. Your lawyer goes with you, and being present is the best way to ensure your 'best interests' match your actual wishes.",
      es: "Usualmente sí — pero tu abogado/a te dirá qué esperar con anticipación. No estarás solo/a. Tu abogado/a va contigo, y estar presente es la mejor manera de asegurar que tus 'mejores intereses' coincidan con tus deseos reales.",
    },
  },
  {
    q: {
      en: "Can I talk to the judge?",
      es: "¿Puedo hablar con el juez?",
    },
    a: {
      en: "Yes. You can speak up at hearings through your lawyer, or ask to speak directly to the judge. Most judges want to hear from you — it helps them make better decisions about your life.",
      es: "Sí. Puedes hablar en las audiencias a través de tu abogado/a, o pedir hablar directamente con el juez. La mayoría de los jueces quieren escucharte — les ayuda a tomar mejores decisiones sobre tu vida.",
    },
  },
  {
    q: {
      en: "What if I don't understand what's happening?",
      es: "¿Qué pasa si no entiendo lo que está pasando?",
    },
    a: {
      en: "Stop and ask your lawyer to explain it — that's literally their job. You should understand every decision being made in your case. 'What does that mean?' is a fine question any time.",
      es: "Detente y pídele a tu abogado/a que te explique — literalmente ese es su trabajo. Debes entender cada decisión que se toma en tu caso. '¿Qué significa eso?' es una pregunta buena en cualquier momento.",
    },
  },
  {
    q: {
      en: "How many hearings will there be?",
      es: "¿Cuántas audiencias habrá?",
    },
    a: {
      en: "Every case is different. Some end in a few months, others take years. Your lawyer can give you a realistic timeline for your specific case and what triggers the next hearing.",
      es: "Cada caso es diferente. Algunos terminan en unos meses, otros toman años. Tu abogado/a puede darte un cronograma realista para tu caso específico y qué activa la siguiente audiencia.",
    },
  },
];
```

- [ ] **Step 2: Verify build**

```bash
cd web && npm run build
```

Expected: 0 TS errors.

- [ ] **Step 3: Commit**

```bash
cd "/c/Users/farkh/OneDrive/Documents/Foster Guide AZ"
git add web/src/data/court.ts
git commit -m "feat(web): add CASE_STAGES_TEEN and CASE_FAQS_TEEN data"
```

---

## Task 8: Add dashboard strings to `i18n-teen.ts` + create `DashboardTeen` body component

**Files:**
- Modify: `web/src/lib/i18n-teen.ts`
- Create: `web/src/components/teen/DashboardTeen.tsx`

- [ ] **Step 1: Append dashboard strings to `TEEN_STRINGS`**

In `web/src/lib/i18n-teen.ts`, add these entries to the `TEEN_STRINGS` object (keep existing entries; order doesn't matter):

```ts
  // ── Dashboard ───────────────────────────────────────────────────────────
  "dashboard.greeting.morning":    { en: "Good morning.", es: "Buenos días." },
  "dashboard.greeting.subtitle":   {
    en: "Welcome to your secure command center. {date}.",
    es: "Bienvenido/a a tu centro de comando seguro. {date}.",
  },
  "dashboard.privacy.label":       { en: "Privacy First",              es: "Privacidad primero" },
  "dashboard.privacy.body":        { en: "No data is ever saved or tracked.",
                                     es: "Nunca se guardan ni se rastrean datos." },
  "dashboard.section.label":       { en: "Command Control",            es: "Control de Comando" },

  "dashboard.tile.team.title":     { en: "Your Advocates",             es: "Tus Defensores" },
  "dashboard.tile.team.desc":      { en: "Direct lines to your judge, lawyer, and caseworker.",
                                     es: "Líneas directas a tu juez, abogado/a y trabajador/a de casos." },
  "dashboard.tile.team.cta":       { en: "Open Portal",                es: "Abrir Portal" },

  "dashboard.tile.case.title":     { en: "Legal Roadmap",              es: "Hoja de Ruta Legal" },
  "dashboard.tile.case.desc":      { en: "Timeline of your hearings and next legal maneuvers.",
                                     es: "Cronograma de tus audiencias y próximas acciones legales." },
  "dashboard.tile.case.cta":       { en: "View Timeline",              es: "Ver Cronograma" },

  "dashboard.tile.wellness.title": { en: "Mindful Hub",                es: "Centro de Bienestar" },
  "dashboard.tile.wellness.desc":  { en: "Daily grounding tools and mental health resources.",
                                     es: "Herramientas diarias de equilibrio y recursos de salud mental." },
  "dashboard.tile.wellness.cta":   { en: "Start Session",              es: "Iniciar Sesión" },

  "dashboard.tile.answers.title":  { en: "Knowledge Hub",              es: "Centro de Conocimiento" },
  "dashboard.tile.answers.desc":   { en: "Searchable database for rights, laws, and next steps.",
                                     es: "Base de datos de búsqueda para derechos, leyes y próximos pasos." },
  "dashboard.tile.answers.cta":    { en: "Search Portal",              es: "Portal de Búsqueda" },

  "dashboard.tip.heading":         { en: "Strategic Tip",              es: "Consejo Estratégico" },
  "dashboard.tip.cta":             { en: "Learn your rights",          es: "Conoce tus derechos" },
  "dashboard.tip.1315": {
    en: "Bring written questions to every meeting with your lawyer. They work for you — your questions shape what they fight for.",
    es: "Trae preguntas escritas a cada reunión con tu abogado/a. Trabajan para ti — tus preguntas determinan por qué luchan.",
  },
  "dashboard.tip.1617": {
    en: "Did you know you can request a private meeting with your judge before your next hearing?",
    es: "¿Sabías que puedes pedir una reunión privada con tu juez antes de tu próxima audiencia?",
  },
  "dashboard.tip.1821": {
    en: "Ask your caseworker about extended foster care. It's voluntary, you can still use it, and it comes with housing support.",
    es: "Pregúntale a tu trabajador/a de casos sobre el cuidado extendido. Es voluntario, aún puedes usarlo, e incluye apoyo de vivienda.",
  },

  "dashboard.crisis.title":        { en: "Crisis Support",             es: "Apoyo en Crisis" },
  "dashboard.crisis.body":         { en: "If you're feeling overwhelmed or need immediate help, 988 is available 24/7.",
                                     es: "Si te sientes abrumado/a o necesitas ayuda inmediata, el 988 está disponible 24/7." },
  "dashboard.crisis.cta":          { en: "Call or Text 988",           es: "Llama o envía mensaje al 988" },
```

- [ ] **Step 2: Create the dashboard body component**

Create `web/src/components/teen/DashboardTeen.tsx`:

```tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Shield, ChevronRight, Compass, Phone } from "lucide-react";
import type { Lang } from "../../lib/i18n";
import { tt, ttBand, type TeenStringKey } from "../../lib/i18n-teen";
import type { AgeBandKey } from "../../lib/prefs";

interface DashboardTeenProps {
  lang: Lang;
  band: AgeBandKey;
}

interface Tile {
  id: "team" | "case" | "wellness" | "answers";
  href: string;
  img: string;
  titleKey: TeenStringKey;
  descKey: TeenStringKey;
  ctaKey: TeenStringKey;
  bgColor: string;   // tile icon bg
  textColor: string; // heading color
  accentColor: string; // CTA accent color
  hoverBlobColor: string; // background blob on hover
}

const TILES: Tile[] = [
  {
    id: "team", href: "/team", img: "/avatars/group_avatar.png",
    titleKey: "dashboard.tile.team.title", descKey: "dashboard.tile.team.desc", ctaKey: "dashboard.tile.team.cta",
    bgColor: "bg-[#fff4cc] mix-blend-multiply", textColor: "text-[#78350f]", accentColor: "text-amber-600", hoverBlobColor: "bg-amber-50",
  },
  {
    id: "case", href: "/case", img: "/dashboard/case.png",
    titleKey: "dashboard.tile.case.title", descKey: "dashboard.tile.case.desc", ctaKey: "dashboard.tile.case.cta",
    bgColor: "bg-[#e0f2fe]", textColor: "text-[#0369a1]", accentColor: "text-sky-600", hoverBlobColor: "bg-sky-50",
  },
  {
    id: "wellness", href: "/wellness", img: "/dashboard/wellness.png",
    titleKey: "dashboard.tile.wellness.title", descKey: "dashboard.tile.wellness.desc", ctaKey: "dashboard.tile.wellness.cta",
    bgColor: "bg-[#fce7f3]", textColor: "text-[#be185d]", accentColor: "text-pink-600", hoverBlobColor: "bg-pink-50",
  },
  {
    id: "answers", href: "/ask", img: "/dashboard/rights.png",
    titleKey: "dashboard.tile.answers.title", descKey: "dashboard.tile.answers.desc", ctaKey: "dashboard.tile.answers.cta",
    bgColor: "bg-[#dcfce7]", textColor: "text-[#15803d]", accentColor: "text-emerald-600", hoverBlobColor: "bg-emerald-50",
  },
];

export function DashboardTeen({ lang, band }: DashboardTeenProps) {
  const today = new Date().toLocaleDateString(lang === "es" ? "es-US" : "en-US", {
    weekday: "long", month: "long", day: "numeric",
  });

  return (
    <>
      {/* Background blob */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-sky-50/40 rounded-full blur-[140px] -z-10 translate-x-1/4 -translate-y-1/4 shadow-inner" />

      <div className="max-w-[1240px] mx-auto px-6 sm:px-12 py-10 sm:py-20">
        {/* Hero */}
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <h1 className="text-4xl sm:text-6xl font-black text-[#1e293b] mb-4 tracking-[-0.05em] leading-[0.9]">
              {tt("dashboard.greeting.morning", lang)}
            </h1>
            <p className="text-slate-400 text-lg font-bold tracking-tight">
              {tt("dashboard.greeting.subtitle", lang, { date: today })}
            </p>
          </div>
          <div className="bg-emerald-50/50 border border-emerald-100 px-6 py-4 rounded-2xl flex items-center gap-4">
            <div className="w-10 h-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center shrink-0">
              <Shield size={18} strokeWidth={3} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600">{tt("dashboard.privacy.label", lang)}</p>
              <p className="text-[13px] font-bold text-emerald-800 leading-tight">{tt("dashboard.privacy.body", lang)}</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-16 items-start">
          {/* Tiles */}
          <div className="lg:col-span-8 flex flex-col gap-10">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">{tt("dashboard.section.label", lang)}</h3>
            <div className="grid sm:grid-cols-2 gap-8">
              {TILES.map((tile, idx) => (
                <motion.div
                  key={tile.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08, duration: 0.4 }}
                >
                  <Link
                    href={`/${lang}${tile.href}`}
                    className="block bg-white p-10 rounded-[2.5rem] shadow-[0_24px_64px_rgba(0,0,0,0.02)] border border-white flex flex-col items-start gap-8 group hover:shadow-[0_32px_80px_rgba(0,0,0,0.1)] hover:-translate-y-2 transition-all text-left overflow-hidden relative"
                  >
                    <div className={`absolute top-0 right-0 w-32 h-32 ${tile.hoverBlobColor} rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity`} />
                    <div className={`w-16 h-16 ${tile.bgColor} rounded-[1.5rem] flex items-center justify-center overflow-hidden shadow-sm group-hover:scale-110 transition-transform`}>
                      <img src={tile.img} alt="" className="w-full h-full object-cover scale-[1.2]" />
                    </div>
                    <div className="flex flex-col gap-2 relative z-10">
                      <h4 className={`text-2xl font-black ${tile.textColor} tracking-tight leading-none`}>{tt(tile.titleKey, lang)}</h4>
                      <p className="text-slate-400 text-sm font-bold leading-relaxed">{tt(tile.descKey, lang)}</p>
                    </div>
                    <div className={`w-full pt-6 border-t border-slate-50 flex items-center justify-between ${tile.accentColor} font-black text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all`}>
                      {tt(tile.ctaKey, lang)} <ChevronRight size={14} strokeWidth={3} />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Side column */}
          <div className="lg:col-span-4 sticky top-10 flex flex-col gap-8">
            {/* Strategic Tip */}
            <div className="bg-[#1a2f44] text-white p-10 rounded-[2.5rem] shadow-[0_24px_80px_rgba(0,0,0,0.15)] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/5 blur-3xl rounded-full" />
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 bg-white shadow-[0_12px_24px_rgba(255,255,255,0.1)] rounded-2xl flex items-center justify-center shrink-0">
                  <Compass size={20} className="text-[#1a2f44]" strokeWidth={3} />
                </div>
                <h4 className="font-black text-lg tracking-tight">{tt("dashboard.tip.heading", lang)}</h4>
              </div>
              <p className="text-slate-100 text-base font-bold leading-relaxed mb-6">
                {ttBand("dashboard.tip", band, lang)}
              </p>
              <Link
                href={`/${lang}/ask`}
                className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                {tt("dashboard.tip.cta", lang)} <ChevronRight size={14} strokeWidth={3} />
              </Link>
            </div>

            {/* Crisis */}
            <div className="bg-rose-50 rounded-[2.5rem] p-10 border border-rose-100/50 shadow-sm flex flex-col items-center text-center group">
              <div className="w-20 h-20 bg-white rounded-[2rem] shadow-sm flex items-center justify-center mb-8 rotate-3 group-hover:rotate-0 transition-all">
                <Phone size={32} className="text-rose-500" />
              </div>
              <h5 className="font-black text-rose-900 mb-4 tracking-tight text-xl">{tt("dashboard.crisis.title", lang)}</h5>
              <p className="text-rose-700/60 text-sm font-bold leading-relaxed mb-10">{tt("dashboard.crisis.body", lang)}</p>
              <a
                href="tel:988"
                className="w-full py-5 rounded-2xl bg-rose-500 text-white font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-rose-200 hover:bg-rose-600 hover:-translate-y-1 active:translate-y-0 transition-all"
              >
                {tt("dashboard.crisis.cta", lang)}
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
```

- [ ] **Step 3: Verify build**

```bash
cd web && npm run build
```

Expected: 0 TS errors.

- [ ] **Step 4: Commit**

```bash
cd "/c/Users/farkh/OneDrive/Documents/Foster Guide AZ"
git add web/src/lib/i18n-teen.ts web/src/components/teen/DashboardTeen.tsx
git commit -m "feat(web): add teen dashboard body component + dashboard strings"
```

---

## Task 9: Wire the teen dashboard into `[lang]/page.tsx`

**Files:**
- Modify: `web/src/app/[lang]/page.tsx`

- [ ] **Step 1: Add the teen branch to the default export**

Open `web/src/app/[lang]/page.tsx`. The existing `HomePage` default export currently dispatches `10-12` to `Dashboard1012` and falls through to a legacy `FEATURE_CARDS` grid for older bands. Replace the fall-through so older bands render `<TeenShell>` instead.

At the top of the file, add imports:

```tsx
import { TeenShell } from "../../components/TeenShell";
import { DashboardTeen } from "../../components/teen/DashboardTeen";
```

In the `HomePage` default export, replace everything after `if (prefs.ageBand === "10-12") return <Dashboard1012 lang={lang} />;` with:

```tsx
  const band = prefs.ageBand as AgeBandKey;
  return (
    <TeenShell active="dashboard" lang={lang}>
      <DashboardTeen lang={lang} band={band} />
    </TeenShell>
  );
```

Delete the remaining legacy code that built `FEATURE_CARDS` / `ScreenHero` / etc. for older bands. Also delete any imports that became unused (check `ScreenHero`, `AGE_BANDS`, `t`, unused icons). `useOnboardingGate(lang)` and `usePrefs()` stay.

- [ ] **Step 2: Verify build**

```bash
cd web && npm run build
```

Expected: 0 TS errors. `/[lang]` route still prerenders.

- [ ] **Step 3: Manual smoke test**

```bash
cd web && npm run dev
```

Open three browser tabs:
- Tab 1 — open the app at `http://localhost:3000/en`. Open DevTools console and run:
  ```js
  localStorage.setItem("fgaz_prefs_v2", JSON.stringify({ageBand:"13-15",county:"Maricopa",tribal:false,onboardingDone:true}));
  location.reload();
  ```
  Expected: dark sidebar appears on the left, "Good morning." greeting, 4 tiles, Strategic Tip reading "Bring written questions to every meeting with your lawyer…".
- Tab 2 — same URL, different band:
  ```js
  localStorage.setItem("fgaz_prefs_v2", JSON.stringify({ageBand:"16-17",county:"Maricopa",tribal:false,onboardingDone:true}));
  location.reload();
  ```
  Expected: Strategic Tip changes to "Did you know you can request a private meeting with your judge…".
- Tab 3 — 10-12 band:
  ```js
  localStorage.setItem("fgaz_prefs_v2", JSON.stringify({ageBand:"10-12",county:"Maricopa",tribal:false,onboardingDone:true}));
  location.reload();
  ```
  Expected: the original 10-12 dashboard (green palette, image tiles) renders unchanged.

Also visit `/es` with each band to verify Spanish strings render.

- [ ] **Step 4: Commit**

```bash
cd "/c/Users/farkh/OneDrive/Documents/Foster Guide AZ"
git add web/src/app/[lang]/page.tsx
git commit -m "feat(web): wire teen dashboard for ageBand 13-15 / 16-17 / 18-21"
```

---

## Task 10: Port Team page (`/[lang]/team`)

**Files:**
- Modify: `web/src/lib/i18n-teen.ts`
- Create: `web/src/components/teen/TeamTeen.tsx`
- Modify: `web/src/app/[lang]/team/page.tsx`

- [ ] **Step 1: Append team strings to `TEEN_STRINGS`**

```ts
  // ── Team page ───────────────────────────────────────────────────────────
  "team.hero.tag":       { en: "Your Advocates",               es: "Tus Defensores" },
  "team.hero.title":     { en: "Meet your team.",              es: "Conoce a tu equipo." },
  "team.hero.subtitle":  { en: "Every person listed here has a defined role in your case. Knowing who does what makes it easier to get answers.",
                           es: "Cada persona aquí tiene un rol definido en tu caso. Saber quién hace qué hace que sea más fácil obtener respuestas." },
  "team.label.aka":      { en: "Also called",                  es: "También conocido/a como" },
  "team.label.role":     { en: "Their role",                   es: "Su rol" },
  "team.label.what":     { en: "What they do",                 es: "Qué hacen" },
  "team.label.tip":      { en: "Pro tip",                      es: "Consejo clave" },
  "team.expand":         { en: "Expand",                       es: "Expandir" },
  "team.collapse":       { en: "Collapse",                     es: "Colapsar" },
```

- [ ] **Step 2: Create `TeamTeen.tsx`**

Create `web/src/components/teen/TeamTeen.tsx`:

```tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { Lang } from "../../lib/i18n";
import type { AgeBandKey } from "../../lib/prefs";
import { tt } from "../../lib/i18n-teen";
import { WHO_IN_YOUR_CASE } from "../../data/court";

const ROLE_BG: Record<string, string> = {
  "#2A7F8E": "bg-emerald-50",
  "#1B3A5C": "bg-indigo-50",
  "#D97706": "bg-amber-50",
};

const ROLE_ACCENT: Record<string, string> = {
  "#2A7F8E": "text-emerald-700",
  "#1B3A5C": "text-indigo-700",
  "#D97706": "text-amber-700",
};

interface TeamTeenProps {
  lang: Lang;
  band: AgeBandKey;
}

export function TeamTeen({ lang, band }: TeamTeenProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="max-w-[1100px] mx-auto px-6 sm:px-12 py-10 sm:py-20">
      <div className="mb-12">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600 mb-4">
          {tt("team.hero.tag", lang)}
        </p>
        <h1 className="text-4xl sm:text-6xl font-black text-[#1e293b] mb-4 tracking-[-0.05em] leading-[0.95]">
          {tt("team.hero.title", lang)}
        </h1>
        <p className="text-slate-500 text-lg font-bold max-w-2xl leading-relaxed">
          {tt("team.hero.subtitle", lang)}
        </p>
      </div>

      <div className="flex flex-col gap-5">
        {WHO_IN_YOUR_CASE.map((member, idx) => {
          const isOpen = openId === member.id;
          const bgClass = ROLE_BG[member.color] ?? "bg-slate-50";
          const accentClass = ROLE_ACCENT[member.color] ?? "text-slate-700";
          const title = lang === "es" ? (member.title_es ?? member.title) : member.title;
          const role  = lang === "es" ? (member.role_es  ?? member.role)  : member.role;
          const what  = lang === "es" ? (member.what_es  ?? member.what)  : member.what;
          const tip   = lang === "es" ? (member.tip_es   ?? member.tip)   : member.tip;
          const teenTip = member.teen_tips?.[band]?.[lang];

          return (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05, duration: 0.35 }}
              className={`rounded-[2rem] border border-white shadow-[0_20px_50px_rgba(0,0,0,0.03)] overflow-hidden ${bgClass}`}
            >
              <button
                type="button"
                onClick={() => setOpenId(isOpen ? null : member.id)}
                className="w-full flex items-center justify-between px-8 py-6 text-left hover:bg-white/50 transition-colors"
                aria-expanded={isOpen}
              >
                <div className="flex flex-col gap-1">
                  <h3 className={`text-xl font-black tracking-tight ${accentClass}`}>{title}</h3>
                  <p className="text-slate-500 text-xs font-bold tracking-wide uppercase">{tt("team.label.aka", lang)}: {member.short ?? title}</p>
                </div>
                {isOpen ? <ChevronUp size={22} className="text-slate-400" /> : <ChevronDown size={22} className="text-slate-400" />}
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-8 pb-8 space-y-5">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{tt("team.label.role", lang)}</p>
                        <p className="text-slate-700 font-medium leading-relaxed">{role}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{tt("team.label.what", lang)}</p>
                        <p className="text-slate-700 font-medium leading-relaxed">{what}</p>
                      </div>
                      {(teenTip || tip) && (
                        <div className={`rounded-2xl bg-white/70 p-5 border border-white`}>
                          <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-1">{tt("team.label.tip", lang)}</p>
                          <p className="text-slate-700 font-semibold leading-relaxed">{teenTip ?? tip}</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Rewire the team page**

Replace `web/src/app/[lang]/team/page.tsx` entirely:

```tsx
"use client";

import { useParams } from "next/navigation";
import type { Lang } from "../../../lib/i18n";
import { useOnboardingGate } from "../../../lib/useOnboardingGate";
import { usePrefs } from "../../../lib/prefs";
import type { AgeBandKey } from "../../../lib/prefs";
import { TeenShell } from "../../../components/TeenShell";
import { TeamTeen } from "../../../components/teen/TeamTeen";
// NOTE: keep importing the existing 10-12 team component if one exists.
// If the current team page handles 10-12 inline, extract that branch into
// a Team1012 component in the same file or leave the branch inline here.

export default function TeamPage() {
  const { lang: rawLang } = useParams<{ lang: string }>();
  const lang: Lang = rawLang === "es" ? "es" : "en";
  const prefs = useOnboardingGate(lang);
  const [, loaded] = usePrefs();

  if (!loaded) return null;

  if (prefs.ageBand === "10-12") {
    // Keep the existing 10-12 team view. If the current file inlined it, move
    // that JSX into this branch unchanged.
    return <Team1012 lang={lang} />;
  }

  const band = prefs.ageBand as AgeBandKey;
  return (
    <TeenShell active="team" lang={lang}>
      <TeamTeen lang={lang} band={band} />
    </TeenShell>
  );
}

function Team1012({ lang }: { lang: Lang }) {
  // Paste the existing 10-12 team rendering from the prior version of this
  // file here — its JSX, imports (that are still needed), and any helpers.
  // No changes to the 10-12 experience.
  // For reference: the existing team page was ~300 LOC and relied on
  // WHO_IN_YOUR_CASE from data/court.ts with simple image+chevron cards.
  return (
    <div>{/* ← existing 10-12 JSX preserved verbatim */}</div>
  );
}
```

**Important:** before editing, copy the existing file's JSX and imports into a scratch buffer. Paste the 10-12 JSX into the `Team1012` function body, keeping every existing class name, image path, and string unchanged. The teen branch is an addition, not a replacement.

- [ ] **Step 4: Verify build**

```bash
cd web && npm run build
```

Expected: 0 TS errors. `/en/team` and `/es/team` prerender.

- [ ] **Step 5: Manual smoke test**

```bash
cd web && npm run dev
```

In DevTools console, cycle through bands (10-12, 13-15, 16-17, 18-21) and navigate to `/en/team` and `/es/team`. Expected:
- 10-12: unchanged from before.
- 13+: dark sidebar, "Meet your team." hero, expandable cards. The `teen_tips` text in each expanded card varies per band.

- [ ] **Step 6: Commit**

```bash
cd "/c/Users/farkh/OneDrive/Documents/Foster Guide AZ"
git add web/src/lib/i18n-teen.ts web/src/components/teen/TeamTeen.tsx web/src/app/[lang]/team/page.tsx
git commit -m "feat(web): wire teen Team page for 13+ with per-band advocate tips"
```

---

## Task 11: Port Case page (`/[lang]/case`)

**Files:**
- Modify: `web/src/lib/i18n-teen.ts`
- Create: `web/src/components/teen/CaseTeen.tsx`
- Modify: `web/src/app/[lang]/case/page.tsx`

- [ ] **Step 1: Append case strings to `TEEN_STRINGS`**

```ts
  // ── Case page ───────────────────────────────────────────────────────────
  "case.hero.tag":        { en: "Legal Roadmap",                 es: "Hoja de Ruta Legal" },
  "case.hero.title":      { en: "How your case moves.",          es: "Cómo avanza tu caso." },
  "case.hero.subtitle":   { en: "Four main hearings shape most dependency cases. Here's what each one is for, and how to walk in prepared.",
                            es: "Cuatro audiencias principales estructuran la mayoría de los casos de dependencia. Aquí está para qué sirve cada una, y cómo entrar preparado/a." },
  "case.label.what":      { en: "What happens",                  es: "Qué pasa" },
  "case.label.teen":      { en: "For you specifically",          es: "Para ti específicamente" },
  "case.label.insight":   { en: "Pro tip",                       es: "Consejo clave" },
  "case.label.next":      { en: "What happens next",             es: "Qué pasa después" },
  "case.faqs.heading":    { en: "Common Questions",              es: "Preguntas Frecuentes" },
```

- [ ] **Step 2: Create `CaseTeen.tsx`**

```tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck, Scale, Calendar, Zap, ChevronDown, ChevronUp,
} from "lucide-react";
import type { Lang } from "../../lib/i18n";
import type { AgeBandKey } from "../../lib/prefs";
import { tt } from "../../lib/i18n-teen";
import { CASE_STAGES_TEEN, CASE_FAQS_TEEN, type TeenColorTheme } from "../../data/court";

const STAGE_ICONS: Record<string, typeof ShieldCheck> = {
  prelim: ShieldCheck,
  adjudication: Scale,
  review: Calendar,
  permanency: Zap,
};

const COLOR_BG: Record<TeenColorTheme, string> = {
  emerald: "bg-emerald-50", indigo: "bg-indigo-50", blue: "bg-blue-50",
  rose: "bg-rose-50",       amber: "bg-amber-50",   cyan: "bg-cyan-50",   slate: "bg-slate-50",
};
const COLOR_TEXT: Record<TeenColorTheme, string> = {
  emerald: "text-emerald-700", indigo: "text-indigo-700", blue: "text-blue-700",
  rose: "text-rose-700",       amber: "text-amber-700",   cyan: "text-cyan-700",   slate: "text-slate-700",
};

interface CaseTeenProps {
  lang: Lang;
  band: AgeBandKey;
}

export function CaseTeen({ lang, band }: CaseTeenProps) {
  const [openStage, setOpenStage] = useState<string | null>(null);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  return (
    <div className="max-w-[1100px] mx-auto px-6 sm:px-12 py-10 sm:py-20">
      {/* Hero */}
      <div className="mb-14">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600 mb-4">
          {tt("case.hero.tag", lang)}
        </p>
        <h1 className="text-4xl sm:text-6xl font-black text-[#1e293b] mb-4 tracking-[-0.05em] leading-[0.95]">
          {tt("case.hero.title", lang)}
        </h1>
        <p className="text-slate-500 text-lg font-bold max-w-2xl leading-relaxed">
          {tt("case.hero.subtitle", lang)}
        </p>
      </div>

      {/* Stages */}
      <div className="flex flex-col gap-5 mb-20">
        {CASE_STAGES_TEEN.map((stage, idx) => {
          const isOpen = openStage === stage.id;
          const Icon = STAGE_ICONS[stage.id] ?? ShieldCheck;
          const bg = COLOR_BG[stage.color];
          const textColor = COLOR_TEXT[stage.color];

          return (
            <motion.div
              key={stage.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06, duration: 0.35 }}
              className={`rounded-[2rem] border border-white shadow-[0_20px_50px_rgba(0,0,0,0.03)] overflow-hidden ${bg}`}
            >
              <button
                type="button"
                onClick={() => setOpenStage(isOpen ? null : stage.id)}
                className="w-full flex items-center gap-6 px-8 py-6 text-left hover:bg-white/50 transition-colors"
                aria-expanded={isOpen}
              >
                <div className={`w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-sm ${textColor}`}>
                  <Icon size={24} strokeWidth={2.5} />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stage.subtitle[lang]}</p>
                  <h3 className={`text-2xl font-black tracking-tight ${textColor}`}>{stage.title[lang]}</h3>
                </div>
                {isOpen ? <ChevronUp size={22} className="text-slate-400" /> : <ChevronDown size={22} className="text-slate-400" />}
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-8 pb-8 space-y-5">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{tt("case.label.what", lang)}</p>
                        <p className="text-slate-700 font-medium leading-relaxed">{stage.what[lang]}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{tt("case.label.teen", lang)}</p>
                        <p className="text-slate-700 font-medium leading-relaxed">{stage.teen[band][lang]}</p>
                      </div>
                      <div className="rounded-2xl bg-white/70 p-5 border border-white">
                        <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-1">{tt("case.label.insight", lang)}</p>
                        <p className="text-slate-700 font-semibold leading-relaxed">{stage.insight[band][lang]}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{tt("case.label.next", lang)}</p>
                        <p className="text-slate-700 font-medium leading-relaxed">{stage.next[lang]}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* FAQs */}
      <h2 className="text-3xl font-black tracking-[-0.03em] text-[#1e293b] mb-6">{tt("case.faqs.heading", lang)}</h2>
      <div className="flex flex-col gap-3">
        {CASE_FAQS_TEEN.map((faq, i) => {
          const isOpen = openFAQ === i;
          return (
            <div key={i} className="rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden">
              <button
                type="button"
                onClick={() => setOpenFAQ(isOpen ? null : i)}
                className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-slate-50 transition-colors"
                aria-expanded={isOpen}
              >
                <span className="font-black text-[#1e293b] text-base">{faq.q[lang]}</span>
                {isOpen ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 text-slate-700 font-medium leading-relaxed">{faq.a[lang]}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Rewire `/case/page.tsx` with band dispatch**

Open `web/src/app/[lang]/case/page.tsx`. Rename the existing default export body to `Case1012` (preserving all its JSX, imports, helpers, and state). Create a new default export that dispatches:

```tsx
"use client";

import { useParams } from "next/navigation";
import type { Lang } from "../../../lib/i18n";
import { useOnboardingGate } from "../../../lib/useOnboardingGate";
import { usePrefs } from "../../../lib/prefs";
import type { AgeBandKey } from "../../../lib/prefs";
import { TeenShell } from "../../../components/TeenShell";
import { CaseTeen } from "../../../components/teen/CaseTeen";

export default function CasePage() {
  const { lang: rawLang } = useParams<{ lang: string }>();
  const lang: Lang = rawLang === "es" ? "es" : "en";
  const prefs = useOnboardingGate(lang);
  const [, loaded] = usePrefs();

  if (!loaded) return null;
  if (prefs.ageBand === "10-12") return <Case1012 lang={lang} />;

  const band = prefs.ageBand as AgeBandKey;
  return (
    <TeenShell active="case" lang={lang}>
      <CaseTeen lang={lang} band={band} />
    </TeenShell>
  );
}

function Case1012({ lang }: { lang: Lang }) {
  // Paste the previous /case page JSX here verbatim.
  return <div>{/* ← existing JSX */}</div>;
}
```

- [ ] **Step 4: Verify build + manual test**

```bash
cd web && npm run build
cd web && npm run dev
```

Expected: build clean. In dev, `/en/case` at band `13-15` shows "How your case moves." hero + 4 expandable stages with blue/indigo/emerald/rose theming; the "For you specifically" and "Pro tip" sections change when toggling to `16-17` and `18-21`. 10-12 branch visually identical to prior.

- [ ] **Step 5: Commit**

```bash
cd "/c/Users/farkh/OneDrive/Documents/Foster Guide AZ"
git add web/src/lib/i18n-teen.ts web/src/components/teen/CaseTeen.tsx web/src/app/[lang]/case/page.tsx
git commit -m "feat(web): wire teen Case page with 4 stages + FAQs + per-band insights"
```

---

## Task 12: Port Wellness page (`/[lang]/wellness`)

**Files:**
- Modify: `web/src/lib/i18n-teen.ts`
- Create: `web/src/components/teen/WellnessTeen.tsx`
- Modify: `web/src/app/[lang]/wellness/page.tsx`

- [ ] **Step 1: Append wellness strings**

```ts
  // ── Wellness page ───────────────────────────────────────────────────────
  "wellness.hero.tag":           { en: "Mindful Hub",                      es: "Centro de Bienestar" },
  "wellness.hero.title":         { en: "One moment at a time.",            es: "Un momento a la vez." },
  "wellness.hero.subtitle":      { en: "Tools that actually help when a day gets heavy. Try one. See what shifts.",
                                   es: "Herramientas que realmente ayudan cuando un día se pone pesado. Prueba una. Mira qué cambia." },
  "wellness.grounding.heading":  { en: "5-4-3-2-1 Grounding",              es: "Conexión 5-4-3-2-1" },
  "wellness.grounding.intro":    { en: "When your thoughts race: name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, 1 you can taste.",
                                   es: "Cuando tus pensamientos corren: nombra 5 cosas que ves, 4 que puedes tocar, 3 que escuchas, 2 que hueles, 1 que saboreas." },
  "wellness.grounding.1.noun":   { en: "things you can see",               es: "cosas que puedes ver" },
  "wellness.grounding.2.noun":   { en: "things you can touch",             es: "cosas que puedes tocar" },
  "wellness.grounding.3.noun":   { en: "things you can hear",              es: "cosas que puedes escuchar" },
  "wellness.grounding.4.noun":   { en: "things you can smell",             es: "cosas que puedes oler" },
  "wellness.grounding.5.noun":   { en: "thing you can taste",              es: "cosa que puedes saborear" },
  "wellness.tools.heading":      { en: "Coping Tools",                     es: "Herramientas de Afrontamiento" },
  "wellness.tool.breathe.title": { en: "Box Breathing",                    es: "Respiración en Caja" },
  "wellness.tool.breathe.desc":  { en: "Breathe in for 4 counts, hold for 4, out for 4, hold for 4. Repeat 3 times to signal to your nervous system that you are safe.",
                                   es: "Inhala durante 4 cuentas, retén 4, exhala 4, retén 4. Repite 3 veces para indicarle a tu sistema nervioso que estás a salvo." },
  "wellness.tool.journal.title": { en: "3-Line Journaling",                es: "Diario de 3 Líneas" },
  "wellness.tool.journal.desc":  { en: "Write 3 lines: what happened, how you felt, and one thing you're grateful for. This helps move thoughts from your head to the page.",
                                   es: "Escribe 3 líneas: qué pasó, cómo te sentiste, y una cosa por la que estás agradecido/a. Esto ayuda a mover pensamientos de tu cabeza a la página." },
  "wellness.tool.move.title":    { en: "Change Your Scenery",              es: "Cambia Tu Escenario" },
  "wellness.tool.move.desc":     { en: "Even 5 minutes of walking or listening to one specific song can physically shift your brain away from a loop of stress.",
                                   es: "Incluso 5 minutos caminando o escuchando una canción específica pueden cambiar físicamente tu cerebro fuera de un bucle de estrés." },
  "wellness.support.heading":    { en: "Support Network",                  es: "Red de Apoyo" },
  "wellness.support.988.name":   { en: "988 Suicide & Crisis Lifeline",    es: "Línea 988 de Crisis y Suicidio" },
  "wellness.support.988.desc":   { en: "Call or text 988 for 24/7 confidential support. You don't have to be in 'crisis' to reach out — you just need someone to talk to.",
                                   es: "Llama o envía mensaje al 988 para apoyo confidencial 24/7. No tienes que estar en 'crisis' para llamar — solo necesitas alguien con quien hablar." },
  "wellness.support.988.label":  { en: "Call 988",                         es: "Llama al 988" },
  "wellness.support.text.name":  { en: "Crisis Text Line",                 es: "Línea de Texto de Crisis" },
  "wellness.support.text.desc":  { en: "Text HOME to 741741. Best for when you need to talk but aren't in a place where you can speak out loud.",
                                   es: "Envía HOME al 741741. Mejor cuando necesitas hablar pero no estás en un lugar donde puedas hacerlo en voz alta." },
  "wellness.support.text.label": { en: "Text 741741",                      es: "Envía al 741741" },
  "wellness.support.dcs.name":   { en: "AZ DCS SOS-CHILD",                 es: "AZ DCS SOS-CHILD" },
  "wellness.support.dcs.desc":   { en: "1-888-767-2445. Use this if you are currently feeling unsafe or if there is an emergency in your placement.",
                                   es: "1-888-767-2445. Úsalo si te sientes inseguro/a en este momento o hay una emergencia en tu colocación." },
  "wellness.support.dcs.label":  { en: "Contact SOS",                      es: "Contactar SOS" },
```

- [ ] **Step 2: Create `WellnessTeen.tsx`**

```tsx
"use client";

import { motion } from "framer-motion";
import { Phone } from "lucide-react";
import type { Lang } from "../../lib/i18n";
import { tt } from "../../lib/i18n-teen";

const GROUNDING = [
  { n: 5, nounKey: "wellness.grounding.1.noun", icon: "👁️" },
  { n: 4, nounKey: "wellness.grounding.2.noun", icon: "✋" },
  { n: 3, nounKey: "wellness.grounding.3.noun", icon: "👂" },
  { n: 2, nounKey: "wellness.grounding.4.noun", icon: "👃" },
  { n: 1, nounKey: "wellness.grounding.5.noun", icon: "👅" },
] as const;

const TOOLS = [
  { id: "breathe", img: "/wellness/breathing.png", titleKey: "wellness.tool.breathe.title", descKey: "wellness.tool.breathe.desc", color: "bg-sky-50", accent: "text-sky-700" },
  { id: "journal", img: "/wellness/journal.png",   titleKey: "wellness.tool.journal.title", descKey: "wellness.tool.journal.desc", color: "bg-emerald-50", accent: "text-emerald-700" },
  { id: "move",    img: "/wellness/music.png",     titleKey: "wellness.tool.move.title",    descKey: "wellness.tool.move.desc",    color: "bg-amber-50",  accent: "text-amber-700" },
] as const;

const SUPPORT = [
  { id: "988",   nameKey: "wellness.support.988.name",  descKey: "wellness.support.988.desc",  labelKey: "wellness.support.988.label",  href: "tel:988" },
  { id: "text",  nameKey: "wellness.support.text.name", descKey: "wellness.support.text.desc", labelKey: "wellness.support.text.label", href: "sms:741741" },
  { id: "dcs",   nameKey: "wellness.support.dcs.name",  descKey: "wellness.support.dcs.desc",  labelKey: "wellness.support.dcs.label",  href: "tel:18887672445" },
] as const;

interface WellnessTeenProps { lang: Lang; }

export function WellnessTeen({ lang }: WellnessTeenProps) {
  return (
    <div className="max-w-[1100px] mx-auto px-6 sm:px-12 py-10 sm:py-20 space-y-20">
      {/* Hero */}
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-pink-600 mb-4">{tt("wellness.hero.tag", lang)}</p>
        <h1 className="text-4xl sm:text-6xl font-black text-[#1e293b] mb-4 tracking-[-0.05em] leading-[0.95]">{tt("wellness.hero.title", lang)}</h1>
        <p className="text-slate-500 text-lg font-bold max-w-2xl leading-relaxed">{tt("wellness.hero.subtitle", lang)}</p>
      </div>

      {/* Grounding */}
      <section>
        <h2 className="text-3xl font-black tracking-[-0.03em] text-[#1e293b] mb-3">{tt("wellness.grounding.heading", lang)}</h2>
        <p className="text-slate-500 font-medium mb-8 max-w-2xl">{tt("wellness.grounding.intro", lang)}</p>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {GROUNDING.map((g, idx) => (
            <motion.div
              key={g.n}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06, duration: 0.3 }}
              className="rounded-2xl bg-white border border-slate-100 shadow-sm p-5 text-center"
            >
              <div className="text-3xl mb-2">{g.icon}</div>
              <div className="text-3xl font-black text-pink-600">{g.n}</div>
              <div className="text-xs text-slate-500 font-semibold mt-1">{tt(g.nounKey as Parameters<typeof tt>[0], lang)}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Tools */}
      <section>
        <h2 className="text-3xl font-black tracking-[-0.03em] text-[#1e293b] mb-6">{tt("wellness.tools.heading", lang)}</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {TOOLS.map((t, idx) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08, duration: 0.35 }}
              className={`rounded-[2rem] p-8 ${t.color} border border-white shadow-[0_20px_50px_rgba(0,0,0,0.03)]`}
            >
              <div className="w-16 h-16 rounded-2xl bg-white mb-6 flex items-center justify-center overflow-hidden shadow-sm">
                <img src={t.img} alt="" className="w-full h-full object-cover" />
              </div>
              <h3 className={`font-black text-xl ${t.accent} tracking-tight mb-3`}>{tt(t.titleKey, lang)}</h3>
              <p className="text-slate-700 font-medium leading-relaxed">{tt(t.descKey, lang)}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Support */}
      <section>
        <h2 className="text-3xl font-black tracking-[-0.03em] text-[#1e293b] mb-6">{tt("wellness.support.heading", lang)}</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {SUPPORT.map((s) => (
            <div key={s.id} className="rounded-[2rem] bg-white border border-slate-100 shadow-sm p-8 flex flex-col">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mb-5">
                <Phone size={20} strokeWidth={2.5} />
              </div>
              <h3 className="font-black text-lg text-[#1e293b] tracking-tight mb-2">{tt(s.nameKey, lang)}</h3>
              <p className="text-slate-600 text-sm font-medium leading-relaxed mb-6 flex-1">{tt(s.descKey, lang)}</p>
              <a
                href={s.href}
                className="w-full py-4 rounded-xl bg-rose-500 text-white font-black text-xs uppercase tracking-[0.2em] text-center shadow-lg shadow-rose-200 hover:bg-rose-600 transition-colors"
              >
                {tt(s.labelKey, lang)}
              </a>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
```

- [ ] **Step 3: Rewire `/wellness/page.tsx`**

Same pattern as Task 11: rename existing body to `Wellness1012` and dispatch on band:

```tsx
"use client";

import { useParams } from "next/navigation";
import type { Lang } from "../../../lib/i18n";
import { useOnboardingGate } from "../../../lib/useOnboardingGate";
import { usePrefs } from "../../../lib/prefs";
import { TeenShell } from "../../../components/TeenShell";
import { WellnessTeen } from "../../../components/teen/WellnessTeen";

export default function WellnessPage() {
  const { lang: rawLang } = useParams<{ lang: string }>();
  const lang: Lang = rawLang === "es" ? "es" : "en";
  const prefs = useOnboardingGate(lang);
  const [, loaded] = usePrefs();

  if (!loaded) return null;
  if (prefs.ageBand === "10-12") return <Wellness1012 lang={lang} />;

  return (
    <TeenShell active="wellness" lang={lang}>
      <WellnessTeen lang={lang} />
    </TeenShell>
  );
}

function Wellness1012({ lang }: { lang: Lang }) {
  // Paste the previous /wellness page JSX here verbatim.
  return <div>{/* ← existing JSX */}</div>;
}
```

- [ ] **Step 4: Verify build + manual test**

```bash
cd web && npm run build
cd web && npm run dev
```

Expected: `/en/wellness` at band `13+` shows the dark sidebar + "One moment at a time." hero + 5-4-3-2-1 grounding grid + 3 tool cards + 3 support cards. 10-12 unchanged.

- [ ] **Step 5: Commit**

```bash
cd "/c/Users/farkh/OneDrive/Documents/Foster Guide AZ"
git add web/src/lib/i18n-teen.ts web/src/components/teen/WellnessTeen.tsx web/src/app/[lang]/wellness/page.tsx
git commit -m "feat(web): wire teen Wellness page with grounding, tools, and support network"
```

---

## Task 13: Port Find Answers page (`/[lang]/ask`)

**Files:**
- Modify: `web/src/lib/i18n-teen.ts`
- Create: `web/src/components/teen/AskTeen.tsx`
- Modify: `web/src/app/[lang]/ask/page.tsx`

- [ ] **Step 1: Append ask strings**

```ts
  // ── Ask / Search Portal ─────────────────────────────────────────────────
  "ask.hero.tag":        { en: "Search Portal",                    es: "Portal de Búsqueda" },
  "ask.hero.title":      { en: "Find what you need.",              es: "Encuentra lo que necesitas." },
  "ask.hero.subtitle":   { en: "Searchable answers about your rights, your case, and what comes next. Start typing or pick a category.",
                           es: "Respuestas que puedes buscar sobre tus derechos, tu caso, y lo que sigue. Empieza a escribir o elige una categoría." },
  "ask.search.placeholder":{ en: "Search answers…",                es: "Buscar respuestas…" },
  "ask.chip.all":        { en: "All",                              es: "Todos" },
  "ask.no_results":      { en: "No answers match your search. Try a different word, or pick a category above.",
                           es: "Ningún resultado coincide. Prueba otra palabra o elige una categoría." },
```

- [ ] **Step 2: Create `AskTeen.tsx`**

```tsx
"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown, ChevronUp, X } from "lucide-react";
import Fuse from "fuse.js";
import type { Lang } from "../../lib/i18n";
import type { AgeBandKey } from "../../lib/prefs";
import { tt } from "../../lib/i18n-teen";
import { QUESTIONS, TOPIC_CONFIG, type QAEntry, type QACategory } from "../../data/questions";

interface AskTeenProps {
  lang: Lang;
  band: AgeBandKey;
}

export function AskTeen({ lang, band }: AskTeenProps) {
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState<QACategory | "all">("all");
  const [openId, setOpenId] = useState<string | null>(null);

  // Band-gated questions
  const bandQuestions = useMemo(
    () => QUESTIONS.filter((q) => q.ageBands.includes(band)),
    [band]
  );

  // Fuse index scoped to band
  const fuse = useMemo(
    () => new Fuse(bandQuestions, {
      keys: [`question.${lang}`, `answer.${lang}`],
      threshold: 0.35,
      includeScore: false,
    }),
    [bandQuestions, lang]
  );

  const results = useMemo(() => {
    const base = query.trim()
      ? fuse.search(query).map((r) => r.item)
      : bandQuestions;
    return activeCat === "all" ? base : base.filter((q) => q.category === activeCat);
  }, [query, activeCat, bandQuestions, fuse]);

  const cats: QACategory[] = Array.from(new Set(bandQuestions.map((q) => q.category)));

  return (
    <div className="max-w-[1100px] mx-auto px-6 sm:px-12 py-10 sm:py-20 space-y-10">
      {/* Hero */}
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600 mb-4">{tt("ask.hero.tag", lang)}</p>
        <h1 className="text-4xl sm:text-6xl font-black text-[#1e293b] mb-4 tracking-[-0.05em] leading-[0.95]">{tt("ask.hero.title", lang)}</h1>
        <p className="text-slate-500 text-lg font-bold max-w-2xl leading-relaxed">{tt("ask.hero.subtitle", lang)}</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={tt("ask.search.placeholder", lang)}
          className="w-full pl-14 pr-12 py-5 rounded-2xl bg-white border border-slate-100 shadow-sm text-base font-semibold text-[#1e293b] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="Clear"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Category chips */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setActiveCat("all")}
          className={`px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-widest transition-colors ${
            activeCat === "all" ? "bg-[#1a2f44] text-white" : "bg-white border border-slate-200 text-slate-500 hover:bg-slate-50"
          }`}
        >
          {tt("ask.chip.all", lang)}
        </button>
        {cats.map((c) => {
          const cfg = TOPIC_CONFIG[c];
          const label = cfg ? (lang === "es" ? cfg.labelEs : cfg.labelEn) : c;
          const isActive = activeCat === c;
          return (
            <button
              key={c}
              type="button"
              onClick={() => setActiveCat(c)}
              className={`px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-widest transition-colors ${
                isActive ? "bg-[#1a2f44] text-white" : "bg-white border border-slate-200 text-slate-500 hover:bg-slate-50"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Results */}
      {results.length === 0 ? (
        <div className="rounded-2xl bg-white border border-slate-100 p-8 text-center text-slate-500 font-medium">
          {tt("ask.no_results", lang)}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {results.map((q: QAEntry, idx) => {
            const isOpen = openId === q.id;
            return (
              <motion.div
                key={q.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(idx, 12) * 0.03, duration: 0.3 }}
                className="rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : q.id)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-slate-50 transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="font-black text-[#1e293b] text-base pr-4">{q.question[lang]}</span>
                  {isOpen ? <ChevronUp size={18} className="text-slate-400 shrink-0" /> : <ChevronDown size={18} className="text-slate-400 shrink-0" />}
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 text-slate-700 font-medium leading-relaxed whitespace-pre-line">
                        {q.answer[lang]}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Rewire `/ask/page.tsx`**

```tsx
"use client";

import { useParams } from "next/navigation";
import type { Lang } from "../../../lib/i18n";
import { useOnboardingGate } from "../../../lib/useOnboardingGate";
import { usePrefs } from "../../../lib/prefs";
import type { AgeBandKey } from "../../../lib/prefs";
import { TeenShell } from "../../../components/TeenShell";
import { AskTeen } from "../../../components/teen/AskTeen";

export default function AskPage() {
  const { lang: rawLang } = useParams<{ lang: string }>();
  const lang: Lang = rawLang === "es" ? "es" : "en";
  const prefs = useOnboardingGate(lang);
  const [, loaded] = usePrefs();

  if (!loaded) return null;
  if (prefs.ageBand === "10-12") return <Ask1012 lang={lang} />;

  const band = prefs.ageBand as AgeBandKey;
  return (
    <TeenShell active="answers" lang={lang}>
      <AskTeen lang={lang} band={band} />
    </TeenShell>
  );
}

function Ask1012({ lang }: { lang: Lang }) {
  // Paste the previous /ask page JSX here verbatim.
  return <div>{/* ← existing JSX */}</div>;
}
```

- [ ] **Step 4: Verify build + manual test**

```bash
cd web && npm run build
cd web && npm run dev
```

Expected: `/en/ask` at band `16-17` shows the teen shell + search bar + category chips + expandable Q&A cards; results are filtered to questions whose `ageBands` includes `16-17`. Search "rights" filters further.

- [ ] **Step 5: Commit**

```bash
cd "/c/Users/farkh/OneDrive/Documents/Foster Guide AZ"
git add web/src/lib/i18n-teen.ts web/src/components/teen/AskTeen.tsx web/src/app/[lang]/ask/page.tsx
git commit -m "feat(web): wire teen Ask page with band-filtered Fuse search"
```

---

## Task 14: Port Rights page (`/[lang]/rights`) — teen-style

**Files:**
- Modify: `web/src/lib/i18n-teen.ts`
- Create: `web/src/components/teen/RightsTeen.tsx`
- Modify: `web/src/app/[lang]/rights/page.tsx`

- [ ] **Step 1: Append rights strings**

```ts
  // ── Rights page ─────────────────────────────────────────────────────────
  "rights.hero.tag":        { en: "Legal Protections",       es: "Protecciones Legales" },
  "rights.hero.title":      { en: "Your rights under AZ law.",
                              es: "Tus derechos bajo la ley de AZ." },
  "rights.hero.subtitle":   { en: "Arizona statute A.R.S. §8-529 guarantees these rights to every foster youth. They're not favors — they're yours.",
                              es: "El estatuto de Arizona A.R.S. §8-529 garantiza estos derechos a cada joven en cuidado adoptivo. No son favores — son tuyos." },
  "rights.citation":        { en: "A.R.S. §8-529",            es: "A.R.S. §8-529" },
  "rights.label.what":      { en: "What it means",            es: "Qué significa" },
  "rights.label.how":       { en: "How to use it",            es: "Cómo usarlo" },
  "rights.escalation.heading": { en: "If a right is being ignored",
                                 es: "Si un derecho está siendo ignorado" },
  "rights.escalation.intro":   { en: "Start with your caseworker. If that doesn't work, go up the ladder — it exists for a reason.",
                                 es: "Empieza con tu trabajador/a de casos. Si eso no funciona, sube la escalera — existe por una razón." },
```

- [ ] **Step 2: Create `RightsTeen.tsx`**

Inspect `web/src/data/rights.ts` to confirm field names: it exports `RIGHTS` (array of `{ id, title, title_es, what, what_es, how?, how_es?, ... }`) and `ESCALATION_STEPS` (ordered list with `{ step, title, title_es, detail, detail_es }`). If field names differ, adapt the component below.

```tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, ChevronDown, ChevronUp } from "lucide-react";
import type { Lang } from "../../lib/i18n";
import { tt } from "../../lib/i18n-teen";
import { RIGHTS, ESCALATION_STEPS } from "../../data/rights";

const COLOR_CYCLE = ["bg-emerald-50", "bg-indigo-50", "bg-amber-50", "bg-rose-50", "bg-cyan-50"];
const TEXT_CYCLE  = ["text-emerald-700", "text-indigo-700", "text-amber-700", "text-rose-700", "text-cyan-700"];

interface RightsTeenProps { lang: Lang; }

export function RightsTeen({ lang }: RightsTeenProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="max-w-[1100px] mx-auto px-6 sm:px-12 py-10 sm:py-20 space-y-16">
      {/* Hero */}
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600 mb-4">{tt("rights.hero.tag", lang)}</p>
        <h1 className="text-4xl sm:text-6xl font-black text-[#1e293b] mb-4 tracking-[-0.05em] leading-[0.95]">{tt("rights.hero.title", lang)}</h1>
        <p className="text-slate-500 text-lg font-bold max-w-2xl leading-relaxed mb-6">{tt("rights.hero.subtitle", lang)}</p>
        <span className="inline-block rounded-full bg-[#1a2f44] text-white font-black text-[11px] uppercase tracking-[0.2em] px-4 py-2">
          {tt("rights.citation", lang)}
        </span>
      </div>

      {/* Rights */}
      <div className="flex flex-col gap-4">
        {RIGHTS.map((r, idx) => {
          const isOpen = openId === r.id;
          const bg = COLOR_CYCLE[idx % COLOR_CYCLE.length];
          const textColor = TEXT_CYCLE[idx % TEXT_CYCLE.length];
          const title = lang === "es" ? (r.title_es ?? r.title) : r.title;
          const what = lang === "es" ? (r.what_es ?? r.what) : r.what;
          const how = lang === "es" ? (r.how_es ?? r.how) : r.how;

          return (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(idx, 12) * 0.04, duration: 0.3 }}
              className={`rounded-[2rem] border border-white shadow-[0_20px_50px_rgba(0,0,0,0.03)] overflow-hidden ${bg}`}
            >
              <button
                type="button"
                onClick={() => setOpenId(isOpen ? null : r.id)}
                className="w-full flex items-center gap-5 px-7 py-5 text-left hover:bg-white/50 transition-colors"
                aria-expanded={isOpen}
              >
                <div className={`w-11 h-11 rounded-2xl bg-white flex items-center justify-center shadow-sm ${textColor}`}>
                  <Shield size={18} strokeWidth={2.5} />
                </div>
                <div className="flex-1">
                  <h3 className={`text-lg font-black tracking-tight ${textColor}`}>{title}</h3>
                </div>
                {isOpen ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="px-7 pb-7 space-y-5">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{tt("rights.label.what", lang)}</p>
                        <p className="text-slate-700 font-medium leading-relaxed whitespace-pre-line">{what}</p>
                      </div>
                      {how && (
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{tt("rights.label.how", lang)}</p>
                          <p className="text-slate-700 font-medium leading-relaxed whitespace-pre-line">{how}</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Escalation ladder */}
      <section>
        <h2 className="text-3xl font-black tracking-[-0.03em] text-[#1e293b] mb-3">{tt("rights.escalation.heading", lang)}</h2>
        <p className="text-slate-500 font-medium mb-8 max-w-2xl">{tt("rights.escalation.intro", lang)}</p>
        <ol className="flex flex-col gap-3">
          {ESCALATION_STEPS.map((s, i) => {
            const title = lang === "es" ? (s.title_es ?? s.title) : s.title;
            const detail = lang === "es" ? (s.detail_es ?? s.detail) : s.detail;
            return (
              <li key={i} className="rounded-2xl bg-white border border-slate-100 p-6 flex gap-5 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-[#1a2f44] text-white flex items-center justify-center font-black shrink-0">{i + 1}</div>
                <div>
                  <h4 className="font-black text-[#1e293b] text-base mb-1">{title}</h4>
                  <p className="text-slate-600 text-sm font-medium leading-relaxed">{detail}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </section>
    </div>
  );
}
```

- [ ] **Step 3: Rewire `/rights/page.tsx`**

```tsx
"use client";

import { useParams } from "next/navigation";
import type { Lang } from "../../../lib/i18n";
import { useOnboardingGate } from "../../../lib/useOnboardingGate";
import { usePrefs } from "../../../lib/prefs";
import { TeenShell } from "../../../components/TeenShell";
import { RightsTeen } from "../../../components/teen/RightsTeen";

export default function RightsPage() {
  const { lang: rawLang } = useParams<{ lang: string }>();
  const lang: Lang = rawLang === "es" ? "es" : "en";
  const prefs = useOnboardingGate(lang);
  const [, loaded] = usePrefs();

  if (!loaded) return null;
  if (prefs.ageBand === "10-12") return <Rights1012 lang={lang} />;

  return (
    <TeenShell active="rights" lang={lang}>
      <RightsTeen lang={lang} />
    </TeenShell>
  );
}

function Rights1012({ lang }: { lang: Lang }) {
  // Paste the previous /rights page JSX here verbatim.
  return <div>{/* ← existing JSX */}</div>;
}
```

- [ ] **Step 4: Verify build + manual test**

```bash
cd web && npm run build
cd web && npm run dev
```

- [ ] **Step 5: Commit**

```bash
cd "/c/Users/farkh/OneDrive/Documents/Foster Guide AZ"
git add web/src/lib/i18n-teen.ts web/src/components/teen/RightsTeen.tsx web/src/app/[lang]/rights/page.tsx
git commit -m "feat(web): wire teen Rights page with A.R.S. §8-529 + escalation ladder"
```

---

## Task 15: Port Resources page (`/[lang]/resources`) — teen-style

**Files:**
- Modify: `web/src/lib/i18n-teen.ts`
- Create: `web/src/components/teen/ResourcesTeen.tsx`
- Modify: `web/src/app/[lang]/resources/page.tsx`

- [ ] **Step 1: Append resources strings**

```ts
  // ── Resources page ──────────────────────────────────────────────────────
  "resources.hero.tag":        { en: "Directory",                         es: "Directorio" },
  "resources.hero.title":      { en: "Real support, near you.",           es: "Apoyo real, cerca de ti." },
  "resources.hero.subtitle":   { en: "Vetted Arizona organizations that help with housing, benefits, school, mental health, and more. Every listing is verified.",
                                 es: "Organizaciones de Arizona verificadas que ayudan con vivienda, beneficios, escuela, salud mental y más. Cada listado está verificado." },
  "resources.search.placeholder":{ en: "Search resources…",               es: "Buscar recursos…" },
  "resources.chip.all":        { en: "All categories",                    es: "Todas las categorías" },
  "resources.no_results":      { en: "No resources match. Try another category or clear the search.",
                                 es: "Ningún recurso coincide. Prueba otra categoría o borra la búsqueda." },
  "resources.verified":        { en: "Last verified",                     es: "Última verificación" },
  "resources.call":            { en: "Call",                              es: "Llamar" },
  "resources.visit":           { en: "Visit site",                        es: "Visitar sitio" },
```

- [ ] **Step 2: Create `ResourcesTeen.tsx`**

Inspect `web/src/data/resources.ts` to confirm field names. Expected shape: each entry has `{ id, name, name_es?, category, description, description_es?, phone?, url?, lastVerified }`. Adapt the component if field names differ:

```tsx
"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Phone, ExternalLink, X } from "lucide-react";
import Fuse from "fuse.js";
import type { Lang } from "../../lib/i18n";
import { tt } from "../../lib/i18n-teen";
import { RESOURCES } from "../../data/resources";

interface ResourcesTeenProps { lang: Lang; }

export function ResourcesTeen({ lang }: ResourcesTeenProps) {
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState<string | "all">("all");

  const cats = useMemo(() => Array.from(new Set(RESOURCES.map((r) => r.category))), []);

  const fuse = useMemo(
    () => new Fuse(RESOURCES, {
      keys: ["name", "name_es", "description", "description_es", "category"],
      threshold: 0.35,
    }),
    []
  );

  const results = useMemo(() => {
    const base = query.trim() ? fuse.search(query).map((r) => r.item) : RESOURCES;
    return activeCat === "all" ? base : base.filter((r) => r.category === activeCat);
  }, [query, activeCat, fuse]);

  return (
    <div className="max-w-[1100px] mx-auto px-6 sm:px-12 py-10 sm:py-20 space-y-10">
      {/* Hero */}
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600 mb-4">{tt("resources.hero.tag", lang)}</p>
        <h1 className="text-4xl sm:text-6xl font-black text-[#1e293b] mb-4 tracking-[-0.05em] leading-[0.95]">{tt("resources.hero.title", lang)}</h1>
        <p className="text-slate-500 text-lg font-bold max-w-2xl leading-relaxed">{tt("resources.hero.subtitle", lang)}</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={tt("resources.search.placeholder", lang)}
          className="w-full pl-14 pr-12 py-5 rounded-2xl bg-white border border-slate-100 shadow-sm text-base font-semibold text-[#1e293b] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
        />
        {query && (
          <button type="button" onClick={() => setQuery("")} aria-label="Clear" className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">
            <X size={18} />
          </button>
        )}
      </div>

      {/* Chips */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setActiveCat("all")}
          className={`px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-widest transition-colors ${
            activeCat === "all" ? "bg-[#1a2f44] text-white" : "bg-white border border-slate-200 text-slate-500 hover:bg-slate-50"
          }`}
        >
          {tt("resources.chip.all", lang)}
        </button>
        {cats.map((c) => {
          const isActive = activeCat === c;
          return (
            <button
              key={c}
              type="button"
              onClick={() => setActiveCat(c)}
              className={`px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-widest transition-colors ${
                isActive ? "bg-[#1a2f44] text-white" : "bg-white border border-slate-200 text-slate-500 hover:bg-slate-50"
              }`}
            >
              {c}
            </button>
          );
        })}
      </div>

      {/* Results */}
      {results.length === 0 ? (
        <div className="rounded-2xl bg-white border border-slate-100 p-8 text-center text-slate-500 font-medium">
          {tt("resources.no_results", lang)}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {results.map((r, idx) => {
            const name = lang === "es" ? (r.name_es ?? r.name) : r.name;
            const desc = lang === "es" ? (r.description_es ?? r.description) : r.description;
            return (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(idx, 12) * 0.03, duration: 0.3 }}
                className="rounded-[1.75rem] bg-white border border-slate-100 p-6 shadow-sm flex flex-col"
              >
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 mb-2">{r.category}</p>
                <h3 className="font-black text-[#1e293b] text-lg tracking-tight mb-2">{name}</h3>
                <p className="text-slate-600 text-sm font-medium leading-relaxed mb-5 flex-1">{desc}</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {r.phone && (
                    <a href={`tel:${r.phone.replace(/\D/g, "")}`} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500 text-white font-bold text-[12px] hover:bg-rose-600 transition">
                      <Phone size={14} /> {tt("resources.call", lang)}
                    </a>
                  )}
                  {r.url && (
                    <a href={r.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1a2f44] text-white font-bold text-[12px] hover:opacity-90 transition">
                      <ExternalLink size={14} /> {tt("resources.visit", lang)}
                    </a>
                  )}
                </div>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">{tt("resources.verified", lang)}: {r.lastVerified}</p>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Rewire `/resources/page.tsx`**

Resources is currently hidden for 10-12 (per spec: "10-12: Resources nav item and page are hidden (redirect to home)"). Preserve that behavior:

```tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import type { Lang } from "../../../lib/i18n";
import { useOnboardingGate } from "../../../lib/useOnboardingGate";
import { usePrefs } from "../../../lib/prefs";
import { TeenShell } from "../../../components/TeenShell";
import { ResourcesTeen } from "../../../components/teen/ResourcesTeen";

export default function ResourcesPage() {
  const router = useRouter();
  const { lang: rawLang } = useParams<{ lang: string }>();
  const lang: Lang = rawLang === "es" ? "es" : "en";
  const prefs = useOnboardingGate(lang);
  const [, loaded] = usePrefs();

  useEffect(() => {
    if (loaded && prefs.ageBand === "10-12") router.replace(`/${lang}`);
  }, [loaded, prefs.ageBand, lang, router]);

  if (!loaded) return null;
  if (prefs.ageBand === "10-12") return null;

  return (
    <TeenShell active="resources" lang={lang}>
      <ResourcesTeen lang={lang} />
    </TeenShell>
  );
}
```

- [ ] **Step 4: Verify build + manual test**

```bash
cd web && npm run build
cd web && npm run dev
```

Expected: at `13+`, `/en/resources` renders 39 cards filterable by search + category chips. At `10-12`, the route redirects to `/en`.

- [ ] **Step 5: Commit**

```bash
cd "/c/Users/farkh/OneDrive/Documents/Foster Guide AZ"
git add web/src/lib/i18n-teen.ts web/src/components/teen/ResourcesTeen.tsx web/src/app/[lang]/resources/page.tsx
git commit -m "feat(web): wire teen Resources page with Fuse search + category chips"
```

---

## Task 16: Port Future page (`/[lang]/future`) — teen-style

**Files:**
- Modify: `web/src/lib/i18n-teen.ts`
- Create: `web/src/components/teen/FutureTeen.tsx`
- Modify: `web/src/app/[lang]/future/page.tsx`

- [ ] **Step 1: Append future strings (includes per-band framing)**

```ts
  // ── Future page ─────────────────────────────────────────────────────────
  "future.hero.tag":          { en: "Launch Plan",                        es: "Plan de Lanzamiento" },
  "future.hero.title":        { en: "What's ahead.",                      es: "Lo que viene." },
  "future.hero.subtitle":     { en: "Documents, benefits, and housing options that become part of your story at 16, 17, and 18. Start here.",
                                es: "Documentos, beneficios y opciones de vivienda que se vuelven parte de tu historia a los 16, 17 y 18. Empieza aquí." },
  "future.banner.1315":       { en: "These come up later — good to know now.",
                                es: "Esto viene después — bueno saberlo ahora." },
  "future.banner.1617":       { en: "Start preparing now.",
                                es: "Empieza a prepararte ahora." },
  "future.banner.1821":       { en: "What applies right now.",
                                es: "Lo que aplica ahora mismo." },
  "future.docs.heading":      { en: "Documents You'll Need",              es: "Documentos que Necesitarás" },
  "future.docs.intro":        { en: "When you age out, these pieces of paper matter. Start collecting now — it's easier than scrambling later.",
                                es: "Cuando salgas del sistema, estos papeles importan. Empieza a juntarlos ahora — es más fácil que buscarlos después." },
  "future.efc.heading":       { en: "Extended Foster Care (EFC)",         es: "Cuidado Adoptivo Extendido (EFC)" },
  "future.efc.body":          { en: "In Arizona you can voluntarily stay in foster care until 21 for housing, monthly stipend, and an extended support team. It's not automatic — you have to sign in. Ask your caseworker about EFC at 17.5.",
                                es: "En Arizona puedes quedarte voluntariamente en cuidado adoptivo hasta los 21 para vivienda, estipendio mensual, y un equipo de apoyo extendido. No es automático — tienes que inscribirte. Pregúntale a tu trabajador/a de casos sobre EFC a los 17 años y medio." },
  "future.etv.heading":       { en: "Education and Training Voucher (ETV)",
                                es: "Vale Educativo y de Capacitación (ETV)" },
  "future.etv.body":          { en: "Up to $5,000/year for college, trade school, or certification programs. You apply each year, and the state deadline matters. Apply early; funds are limited.",
                                es: "Hasta $5,000 al año para universidad, escuela técnica, o programas de certificación. Aplicas cada año, y la fecha límite del estado importa. Aplica temprano; los fondos son limitados." },
  "future.etv.deadline.label":{ en: "Current cycle deadline",              es: "Fecha límite del ciclo actual" },
  "future.etv.deadline":      { en: "July 31, 2026",                       es: "31 de julio, 2026" },
```

- [ ] **Step 2: Create `FutureTeen.tsx`**

Inspect `web/src/data/docs.ts` for `IMPORTANT_DOCS` field names. Expected shape: each entry has `{ id, name, name_es?, why, why_es?, howToGet?, howToGet_es?, lastVerified }`. Adapt if needed.

```tsx
"use client";

import { motion } from "framer-motion";
import { FileText, GraduationCap, Home } from "lucide-react";
import type { Lang } from "../../lib/i18n";
import type { AgeBandKey } from "../../lib/prefs";
import { tt, ttBand } from "../../lib/i18n-teen";
import { IMPORTANT_DOCS } from "../../data/docs";

interface FutureTeenProps {
  lang: Lang;
  band: AgeBandKey;
}

export function FutureTeen({ lang, band }: FutureTeenProps) {
  return (
    <div className="max-w-[1100px] mx-auto px-6 sm:px-12 py-10 sm:py-20 space-y-16">
      {/* Hero */}
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600 mb-4">{tt("future.hero.tag", lang)}</p>
        <h1 className="text-4xl sm:text-6xl font-black text-[#1e293b] mb-4 tracking-[-0.05em] leading-[0.95]">{tt("future.hero.title", lang)}</h1>
        <p className="text-slate-500 text-lg font-bold max-w-2xl leading-relaxed">{tt("future.hero.subtitle", lang)}</p>
      </div>

      {/* Band-specific framing banner */}
      <div className="rounded-2xl bg-gradient-to-r from-emerald-50 to-sky-50 border border-white p-6 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
          <GraduationCap size={20} strokeWidth={2.5} />
        </div>
        <p className="text-[#1e293b] font-black text-base">{ttBand("future.banner", band, lang)}</p>
      </div>

      {/* Documents */}
      <section>
        <div className="flex items-center gap-4 mb-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <FileText size={22} strokeWidth={2.5} />
          </div>
          <h2 className="text-3xl font-black tracking-[-0.03em] text-[#1e293b]">{tt("future.docs.heading", lang)}</h2>
        </div>
        <p className="text-slate-500 font-medium mb-8 max-w-2xl">{tt("future.docs.intro", lang)}</p>
        <div className="grid md:grid-cols-2 gap-4">
          {IMPORTANT_DOCS.map((d, idx) => {
            const name = lang === "es" ? (d.name_es ?? d.name) : d.name;
            const why = lang === "es" ? (d.why_es ?? d.why) : d.why;
            const howToGet = lang === "es" ? (d.howToGet_es ?? d.howToGet) : d.howToGet;
            return (
              <motion.div
                key={d.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(idx, 10) * 0.04, duration: 0.3 }}
                className="rounded-2xl bg-white border border-slate-100 p-6 shadow-sm"
              >
                <h3 className="font-black text-[#1e293b] text-base mb-2">{name}</h3>
                <p className="text-slate-600 text-sm font-medium leading-relaxed mb-3">{why}</p>
                {howToGet && (
                  <div className="rounded-xl bg-amber-50 p-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-amber-700 mb-1">How to get it</p>
                    <p className="text-slate-700 text-sm font-medium leading-relaxed">{howToGet}</p>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* EFC */}
      <section>
        <div className="flex items-center gap-4 mb-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
            <Home size={22} strokeWidth={2.5} />
          </div>
          <h2 className="text-3xl font-black tracking-[-0.03em] text-[#1e293b]">{tt("future.efc.heading", lang)}</h2>
        </div>
        <p className="text-slate-700 text-base font-medium leading-relaxed max-w-3xl">{tt("future.efc.body", lang)}</p>
      </section>

      {/* ETV */}
      <section>
        <div className="flex items-center gap-4 mb-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <GraduationCap size={22} strokeWidth={2.5} />
          </div>
          <h2 className="text-3xl font-black tracking-[-0.03em] text-[#1e293b]">{tt("future.etv.heading", lang)}</h2>
        </div>
        <p className="text-slate-700 text-base font-medium leading-relaxed max-w-3xl mb-4">{tt("future.etv.body", lang)}</p>
        <div className="inline-flex items-center gap-3 rounded-2xl bg-rose-50 border border-rose-100 px-5 py-3">
          <p className="text-[10px] font-black uppercase tracking-widest text-rose-700">{tt("future.etv.deadline.label", lang)}</p>
          <p className="font-black text-rose-900">{tt("future.etv.deadline", lang)}</p>
        </div>
      </section>
    </div>
  );
}
```

- [ ] **Step 3: Rewire `/future/page.tsx`**

```tsx
"use client";

import { useParams } from "next/navigation";
import type { Lang } from "../../../lib/i18n";
import { useOnboardingGate } from "../../../lib/useOnboardingGate";
import { usePrefs } from "../../../lib/prefs";
import type { AgeBandKey } from "../../../lib/prefs";
import { TeenShell } from "../../../components/TeenShell";
import { FutureTeen } from "../../../components/teen/FutureTeen";

export default function FuturePage() {
  const { lang: rawLang } = useParams<{ lang: string }>();
  const lang: Lang = rawLang === "es" ? "es" : "en";
  const prefs = useOnboardingGate(lang);
  const [, loaded] = usePrefs();

  if (!loaded) return null;
  // The spec says /future is hidden on the 10-12 home screen. If the current
  // page already redirects 10-12 users, preserve that behavior here.
  if (prefs.ageBand === "10-12") return <Future1012 lang={lang} />;

  const band = prefs.ageBand as AgeBandKey;
  return (
    <TeenShell active="future" lang={lang}>
      <FutureTeen lang={lang} band={band} />
    </TeenShell>
  );
}

function Future1012({ lang }: { lang: Lang }) {
  // Paste the previous /future page JSX here verbatim. If the prior page
  // redirected 10-12 users away, keep that redirect.
  return <div>{/* ← existing JSX */}</div>;
}
```

- [ ] **Step 4: Verify build + manual test**

```bash
cd web && npm run build
cd web && npm run dev
```

Expected: at `13+`, `/en/future` shows the band-specific banner ("These come up later" / "Start preparing now" / "What applies right now"), documents grid, EFC section, and ETV section with the July 2026 deadline highlighted.

- [ ] **Step 5: Commit**

```bash
cd "/c/Users/farkh/OneDrive/Documents/Foster Guide AZ"
git add web/src/lib/i18n-teen.ts web/src/components/teen/FutureTeen.tsx web/src/app/[lang]/future/page.tsx
git commit -m "feat(web): wire teen Future page with docs, EFC, and ETV sections"
```

---

## Task 17: Honor `prefers-reduced-motion` on prominent animations

**Files:**
- Modify: `web/src/components/teen/DashboardTeen.tsx`
- Modify: `web/src/components/teen/TeamTeen.tsx`
- Modify: `web/src/components/teen/CaseTeen.tsx`
- Modify: `web/src/components/teen/WellnessTeen.tsx`

- [ ] **Step 1: Add `useReducedMotion` in `DashboardTeen.tsx`**

At the top of `DashboardTeen.tsx`, change the import:

```tsx
import { motion, useReducedMotion } from "framer-motion";
```

Inside the component, above the JSX `return`:

```tsx
const reduce = useReducedMotion();
```

In each `motion.div` used on tiles, change the transition to respect the hook:

```tsx
transition={{ delay: reduce ? 0 : idx * 0.08, duration: reduce ? 0 : 0.4 }}
```

- [ ] **Step 2: Repeat in `TeamTeen.tsx`, `CaseTeen.tsx`, `WellnessTeen.tsx`**

Apply the same pattern to each file's entrance `motion.div` transitions — replace the `delay` and `duration` with conditional expressions that zero out when `reduce` is true.

AnimatePresence-based expand/collapse panels do not need the change (they are user-initiated and brief).

- [ ] **Step 3: Verify build**

```bash
cd web && npm run build
```

Expected: 0 TS errors.

- [ ] **Step 4: Manual test**

In macOS System Settings → Accessibility → Display → toggle "Reduce motion". Reload `/en/` at band `16-17`. Expected: tiles appear instantly without stagger/entrance effects. Toggle off and reload; entrance animations return.

- [ ] **Step 5: Commit**

```bash
cd "/c/Users/farkh/OneDrive/Documents/Foster Guide AZ"
git add web/src/components/teen/
git commit -m "feat(web): respect prefers-reduced-motion across teen pages"
```

---

## Task 18: Final verification and PR preparation

**Files:**
- None (verification only)

- [ ] **Step 1: Run content validation**

```bash
cd "/c/Users/farkh/OneDrive/Documents/Foster Guide AZ"
npx ts-node scripts/validate-content.ts
```

Expected: no new errors. (Our changes don't introduce new URLs or phone numbers except the one `sms:741741` and `tel:18887672445` which are existing patterns.)

- [ ] **Step 2: Final production build**

```bash
cd web && npm run build
```

Expected: 0 TS errors. All 10 routes appear in the SSG output under `/en/*` and `/es/*` (home, case, team, wellness, ask, rights, resources, future, setup, /).

- [ ] **Step 3: Manual test matrix**

Start `npm run dev` and walk through this matrix, one cell per band/lang combination:

|        | `10-12` | `13-15` | `16-17` | `18-21` |
| ------ | ------- | ------- | ------- | ------- |
| `/en`  | old UI  | TeenShell + Dashboard | TeenShell + Dashboard | TeenShell + Dashboard |
| `/en/team` | old UI | TeenShell + Team | TeenShell + Team | TeenShell + Team |
| `/en/case` | old UI | TeenShell + Case | TeenShell + Case | TeenShell + Case |
| `/en/wellness` | old UI | TeenShell + Wellness | same | same |
| `/en/ask` | old UI | TeenShell + Ask | TeenShell + Ask | TeenShell + Ask |
| `/en/rights` | old UI | TeenShell + Rights | same | same |
| `/en/resources` | redirect to `/en` | TeenShell + Resources | same | same |
| `/en/future` | old UI or redirect | TeenShell + Future | same | same |

For each TeenShell cell, confirm:
- Dashboard Strategic Tip reads correctly for that band.
- Case stages show band-specific "For you specifically" + "Pro tip" copy.
- Team cards show band-specific "Pro tip" when expanded.
- Future banner shows band-specific framing.
- Nav pill (left-edge emerald bar) morphs between nav items without flicker.

Repeat the whole matrix at `/es` to confirm Spanish content. Check a sample at 375 px mobile width for each band to verify hamburger drawer + bottom nav.

- [ ] **Step 4: Push and open PR**

```bash
cd "/c/Users/farkh/OneDrive/Documents/Foster Guide AZ"
git push origin HEAD
gh pr create --title "feat(web): wire teen prototype pages for 13+" --body "$(cat <<'EOF'
## Summary
- Wire up five teen prototype components (Dashboard, Team, Case, Wellness, Ask) as full-viewport teen experience for ageBand `13-15` / `16-17` / `18-21`
- Port `/rights`, `/resources`, `/future` to the same teen visual system
- New `TeenShell` component provides dark navy sidebar, mobile drawer, and floating bottom nav
- Per-band copy swaps for dashboard Strategic Tip, case insights, team advocate tips, and future page framing
- Full EN+ES parity via new `lib/i18n-teen.ts` (~450 string pairs)
- `framer-motion` installed and used for nav-pill morph, entrance staggers, and AnimatePresence expansions
- `10-12` band untouched

## Test plan
- [x] `cd web && npm run build` — 0 TS errors; all routes prerender under `/en/*` and `/es/*`
- [x] Manual band matrix: 10-12 renders old UI unchanged; 13+ renders TeenShell with correct per-band copy
- [x] `/es` parity verified
- [x] Mobile 375 px: hamburger drawer + bottom nav work; no horizontal scroll
- [x] Start-over clears prefs and returns to language picker
- [x] `prefers-reduced-motion` disables entrance animations
- [x] Existing content validation passes (`scripts/validate-content.ts`)

Spec: [docs/superpowers/specs/2026-04-20-teen-pages-wire-up-design.md](docs/superpowers/specs/2026-04-20-teen-pages-wire-up-design.md)
Plan: [docs/superpowers/plans/2026-04-20-teen-pages-wire-up.md](docs/superpowers/plans/2026-04-20-teen-pages-wire-up.md)

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

Expected: PR URL printed. Render auto-deploy triggers on merge; post-merge, verify the deployed site at https://fosterhubaz.com shows the teen UI for a 13+ persona.

---

## Self-review

**Spec coverage — every section in the spec maps to a task:**
- §1 Architecture (band dispatch, `fixed inset-0 z-50` overlay) → Tasks 9, 10, 11, 12, 13, 14, 15, 16
- §2 TeenShell component → Tasks 3, 4, 5
- §3 Page porting (5 existing + 3 new) → Tasks 8–16
- §4 i18n + data band swaps → Tasks 2, 6, 7, 8, 10, 11, 12, 13, 14, 15, 16
- §5 Assets (reuse existing `web/public/`) → no task needed; verified during dev test
- §6 Animations (framer-motion + reduced motion) → Tasks 1, 17
- §7 Testing plan → Tasks 9 step 3, 11 step 4, 17 step 4, 18 step 3 (full matrix)
- §8 Scope boundaries → honored throughout; tasks do not touch `/setup`, 10-12, `app/`, or `server/`
- §9 Rollout (one PR, no feature flag) → Task 18

**Placeholder scan:** No "TBD", "TODO", or unfilled stubs in any task's code. Band-specific string tables are fully populated with EN + ES. The `<Page1012>` bodies that say "paste existing JSX here verbatim" are a deliberate instruction to preserve the pre-existing 10-12 experience — not a content gap.

**Type consistency:** `TeenNavId` defined in Task 3 used consistently through all page tasks. `TeenStringKey` from Task 2 used throughout. `CaseStageTeen`, `CaseFAQTeen`, `TeenColorTheme` types defined in Task 7 consumed by Task 11. `tt()` and `ttBand()` signatures stable across tasks.

**Ambiguity check:** The one gray area is in Tasks 14, 15, 16 — field names in `data/rights.ts`, `data/resources.ts`, and `data/docs.ts` are unknown to this plan and the code examples use best-guess field names (`title_es`, `what_es`, `name_es`, `description_es`, `howToGet_es`, etc.). Each such task includes an "Inspect the file to confirm field names" step up front. If the real field names differ, the engineer adapts the 2-3 lines that reference them; the rest of the component is field-agnostic.

---

## Execution Handoff

**Plan complete and saved to [docs/superpowers/plans/2026-04-20-teen-pages-wire-up.md](docs/superpowers/plans/2026-04-20-teen-pages-wire-up.md). Two execution options:**

**1. Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration.

**2. Inline Execution** — I execute tasks in this session, batch execution with checkpoints for review.

**Which approach?**
