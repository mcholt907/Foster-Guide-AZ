# Start Over — Full Reset Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wire the existing `reset()` function from `usePrefs()` into three UI surfaces so users can clear all onboarding prefs and return to the language picker.

**Architecture:** All three changes are purely additive — local state + existing `reset()` + `router.push('/')`. No new routes, components, or data. The inline confirm pattern (no modal/sheet) is used on all surfaces to prevent accidental resets.

**Tech Stack:** Next.js 16 App Router, React hooks (`useState`), `usePrefs()` (already in `web/src/lib/prefs.ts`), `useRouter` from `next/navigation`.

---

### Task 1: Fix 13–21 `onStartOver` to actually clear prefs

**Files:**
- Modify: `web/src/app/[lang]/page.tsx`

Currently `onStartOver` only navigates to `/setup` without clearing localStorage. This task wires `reset()` into that call site.

- [ ] **Step 1: Add `usePrefs` import and destructure `reset` in `HomePage`**

In `web/src/app/[lang]/page.tsx`, change line 12:
```tsx
import type { AgeBandKey } from "../../lib/prefs";
```
to:
```tsx
import { usePrefs } from "../../lib/prefs";
import type { AgeBandKey } from "../../lib/prefs";
```

Then inside `HomePage`, add `reset` after the existing hooks (around line 177):
```tsx
export default function HomePage() {
  const { lang: rawLang } = useParams<{ lang: string }>();
  const lang: Lang = rawLang === "es" ? "es" : "en";
  const router = useRouter();
  const prefs = useOnboardingGate(lang);
  const [,,, reset] = usePrefs();   // ← add this line
```

- [ ] **Step 2: Update `onStartOver` to call `reset()` before routing**

Change the `ScreenHero` call (around line 203):
```tsx
// Before
onStartOver={() => router.push(`/${lang}/setup`)}

// After
onStartOver={() => { reset(); router.push('/'); }}
```

- [ ] **Step 3: Verify build passes**

```bash
cd web && npm run build
```
Expected: `✓ Compiled successfully` with 0 errors.

- [ ] **Step 4: Commit**

```bash
git add web/src/app/[lang]/page.tsx
git commit -m "fix(home): start-over calls reset() and returns to language picker"
```

---

### Task 2: Make the 10–12 settings chip interactive with inline confirm

**Files:**
- Modify: `web/src/app/[lang]/page.tsx` — `Dashboard1012` component

- [ ] **Step 1: Add `useState` to the React import**

Change line 5:
```tsx
// Before
import { useMemo } from "react";

// After
import { useState, useMemo } from "react";
```

- [ ] **Step 2: Add hooks and `chipOpen` state to `Dashboard1012`**

Replace the opening of the `Dashboard1012` function:
```tsx
// Before
function Dashboard1012({ lang }: { lang: Lang }) {
  return (

// After
function Dashboard1012({ lang }: { lang: Lang }) {
  const router = useRouter();
  const [,,, reset] = usePrefs();
  const [chipOpen, setChipOpen] = useState(false);

  return (
```

- [ ] **Step 3: Replace the passive chip with an interactive button + inline confirm card**

Find and replace the entire "Header" section inside `Dashboard1012` (the `<div className="pt-8 pb-6">` block):

```tsx
      {/* Header */}
      <div className="pt-8 pb-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-[#136d41] leading-tight">
          {lang === "es" ? "¿Qué necesitas hoy?" : "What do you need today?"}
        </h1>
        <button
          onClick={() => setChipOpen((o) => !o)}
          className={`flex items-center gap-2 mt-3 w-fit px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm border transition-colors ${
            chipOpen
              ? "bg-[#136d41] text-white border-[#136d41]"
              : "bg-white/50 text-slate-500 border-slate-100 hover:bg-white/80"
          }`}
        >
          <span className={chipOpen ? "text-white/80" : "text-slate-400"}>📍</span>
          <span>{lang === "es" ? "10–12 años · Español" : "Ages 10–12 · English"}</span>
        </button>

        {chipOpen && (
          <div className="mt-3 bg-white rounded-[20px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.08)] border-2 border-[#fbbf24]">
            <p className="text-sm font-semibold text-[#35322d] mb-1">
              {lang === "es" ? "¿Cambiar configuración?" : "Change your settings?"}
            </p>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              {lang === "es"
                ? "Esto borra tu grupo de edad e idioma. Empezarás de nuevo desde el principio."
                : "This clears your age group and language. You'll start fresh from the beginning."}
            </p>
            <button
              onClick={() => { reset(); router.push('/'); }}
              className="w-full rounded-full bg-[#136d41] px-4 py-3 text-sm font-bold text-white shadow-sm hover:bg-[#0f5c35] transition-colors mb-2"
            >
              ↩ {lang === "es" ? "Sí, empezar de nuevo" : "Yes, start over"}
            </button>
            <button
              onClick={() => setChipOpen(false)}
              className="w-full text-center text-xs font-semibold text-slate-400 hover:text-slate-600 py-1 transition-colors"
            >
              {lang === "es" ? "Cancelar" : "Never mind"}
            </button>
          </div>
        )}
      </div>
```

- [ ] **Step 4: Verify build passes**

```bash
cd web && npm run build
```
Expected: `✓ Compiled successfully` with 0 errors.

- [ ] **Step 5: Commit**

```bash
git add web/src/app/[lang]/page.tsx
git commit -m "feat(home): 10-12 chip opens inline start-over confirm card"
```

---

### Task 3: Add "Start over" to the desktop SideNav footer

**Files:**
- Modify: `web/src/components/BottomNav.tsx` — `SideNav` function only

- [ ] **Step 1: Add `useState` and `useRouter` imports**

In `web/src/components/BottomNav.tsx`, change line 1:
```tsx
// Before
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// After
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
```

- [ ] **Step 2: Add `confirmOpen` state and `reset`/`router` inside `SideNav`**

Replace the opening of the `SideNav` function:
```tsx
// Before
export function SideNav({ lang }: { lang: Lang }) {
  const pathname = usePathname();
  const [prefs] = usePrefs();

// After
export function SideNav({ lang }: { lang: Lang }) {
  const pathname = usePathname();
  const router = useRouter();
  const [prefs,,, reset] = usePrefs();
  const [confirmOpen, setConfirmOpen] = useState(false);
```

- [ ] **Step 3: Replace the SideNav footer with the interactive version**

Find the Footer section at the bottom of `SideNav` (the `{/* Footer */}` comment block) and replace it entirely:

```tsx
      {/* Footer */}
      <div className="mx-5 h-px bg-white/10 mb-4" />
      <div className="px-5 pb-6">
        <div className="text-[10px] text-white/35 leading-relaxed tracking-wide mb-3">
          {lang === "es"
            ? "Sin registro · Nada guardado"
            : "No sign-up · Nothing stored"}
        </div>
        {!confirmOpen ? (
          <button
            onClick={() => setConfirmOpen(true)}
            className="text-[10px] text-white/35 hover:text-white/60 transition-colors tracking-wide"
          >
            ↩ {lang === "es" ? "Empezar de nuevo" : "Start over"}
          </button>
        ) : (
          <div className="text-[10px] text-white/50 tracking-wide flex items-center gap-2">
            <span>{lang === "es" ? "¿Resetear?" : "Reset?"}</span>
            <button
              onClick={() => { reset(); router.push('/'); }}
              className="text-white/70 hover:text-white font-bold transition-colors"
            >
              {lang === "es" ? "Sí" : "Yes"}
            </button>
            <span>·</span>
            <button
              onClick={() => setConfirmOpen(false)}
              className="text-white/35 hover:text-white/60 transition-colors"
            >
              {lang === "es" ? "No" : "No"}
            </button>
          </div>
        )}
      </div>
```

- [ ] **Step 4: Verify build passes**

```bash
cd web && npm run build
```
Expected: `✓ Compiled successfully` with 0 errors.

- [ ] **Step 5: Commit**

```bash
git add web/src/components/BottomNav.tsx
git commit -m "feat(sidenav): add inline start-over confirm to desktop sidebar footer"
```

---

### Task 4: Add "Start over" link to the app prototype dashboard

**Files:**
- Modify: `app/src/components/DashboardPrototype.tsx`

- [ ] **Step 1: Add the link below the 988 crisis card**

In `DashboardPrototype.tsx`, find the closing of the `{/* Safety Module */}` grid `</div>` and add the start-over link immediately after it:

```tsx
        {/* Safety Module */}
        <div className="px-6 grid gap-3">
          <a
            href="tel:988"
            className="bg-white rounded-[1.5rem] p-4 flex items-center gap-4 shadow-sm border border-black/5 hover:bg-slate-50 transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-[#fee2e2] flex shrink-0 items-center justify-center text-[#b91c1c]">
              <Phone size={20} />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-[#35322d]">988 Suicide & Crisis</h4>
              <p className="text-xs text-[#a09c98] mt-0.5">Call or text anytime</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#fee2e2] flex items-center justify-center text-[#b91c1c] shrink-0">
              <Phone size={16} />
            </div>
          </a>
        </div>

        {/* Start over */}
        <div className="px-6 mt-6 pb-4 text-center">
          <button
            onClick={() => onNavigate('onboarding')}
            className="text-xs text-slate-400 underline hover:text-slate-600 transition-colors"
          >
            ↩ Start over
          </button>
        </div>
```

- [ ] **Step 2: Verify app builds without errors**

```bash
cd app && npm run build
```
Expected: build completes with 0 TypeScript errors.

- [ ] **Step 3: Commit**

```bash
git add app/src/components/DashboardPrototype.tsx
git commit -m "feat(app): add start-over link to dashboard prototype footer"
```

---

## Manual Verification Checklist

After all tasks are complete, verify these flows in the browser:

**Web — 10–12 band (`http://localhost:3000/en`):**
- [ ] Set age to 10–12 via `/en/setup`, reach the dashboard
- [ ] Tap the "Ages 10–12 · English" chip — it turns green, confirm card appears
- [ ] Click "Never mind" — chip returns to passive state, card disappears
- [ ] Tap chip again, click "Yes, start over" — prefs clear, lands on `/` language picker
- [ ] Complete setup again and confirm the new prefs are saved correctly

**Web — 13–21 band:**
- [ ] Set age to 13–15 or 16–17, reach the dashboard
- [ ] Click "Start over" in the ScreenHero banner — prefs clear, lands on `/`

**Web — Desktop SideNav (`md:` breakpoint or wider):**
- [ ] "Start over" appears faintly in the sidebar footer
- [ ] Click it — swaps inline to "Reset? Yes · No"
- [ ] Click "No" — returns to "Start over" link
- [ ] Click "Yes" — prefs clear, lands on `/`

**App prototype (`http://localhost:5173`):**
- [ ] Complete onboarding, reach dashboard
- [ ] Click "↩ Start over" in footer — returns to language selection screen
