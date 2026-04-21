# Teen Prototype Pages — Wire Up Design

**Date:** 2026-04-20
**Status:** Approved (design only — implementation plan to follow)
**Scope:** Wire the five teen prototype components from `app/src/components/*Teen.tsx` into the production `web/` app for age bands `13-15`, `16-17`, and `18-21`. Additionally port `/rights`, `/resources`, and `/future` to the same teen visual system. The `10-12` band is untouched.

## Summary of brainstorm decisions

| # | Question | Answer |
| --- | --- | --- |
| 1 | Design system alignment | **A** — Full prototype fidelity (Inter font, dark navy sidebar, cream bg, sophisticated copy), teens bypass the shared `[lang]/layout.tsx` chrome. |
| 2 | Navigation coverage for non-prototype routes | **C** — Also port `/rights`, `/resources`, `/future` to teen styling for one cohesive teen experience. |
| 3 | Bilingual content | **A** — Full EN + ES parity at launch. All new strings ship with ES translations in the same PR. |
| 4 | Age-band differentiation within "teen" | **D** — One teen variant for all three bands; string-level copy swaps for band-specific tips/framing. Page structure identical across bands. |
| 5 | Animations | **A** — Install `framer-motion` in `web/` and port motion code 1:1 from the prototypes. |

---

## 1. Architecture

**Two parallel visual systems coexisting under the same routes.** The `10-12` band keeps the current Outfit-font / teal-gradient system under the existing `web/src/app/[lang]/layout.tsx` shell. For `13-15` / `16-17` / `18-21`, every page returns a **TeenShell** component that uses `fixed inset-0 z-50` to fully cover the shared layout — the same pattern the current `/setup` page already uses. The global `SideNav` / `BottomNav` stay mounted but are visually covered; no Next.js route groups or layout forking needed.

Each page file dispatches at render time based on `usePrefs()`:

```tsx
const [prefs, loaded] = usePrefs();
if (!loaded) return null;
if (prefs.ageBand === "10-12") return <Page1012 />;
return <TeenShell active="team" lang={lang}><TeamPageTeen /></TeenShell>;
```

This keeps all 8 page files in place (`page.tsx`, `team/`, `case/`, `wellness/`, `ask/`, `rights/`, `resources/`, `future/`), preserves SSG via `generateStaticParams`, and gives a single source of truth for which route shows which variant.

**Onboarding gate stays.** Each teen page still calls `useOnboardingGate(lang)` at the top — users without prefs get bounced to `/setup` (unchanged).

**Why not route groups?** `/[lang]/(teen)/team` and `/[lang]/(kids)/team` would compile to the same URL, and Next.js does not support URL-level branching by runtime state. The fixed-overlay approach is the established pattern in this codebase and side-steps that.

---

## 2. TeenShell component

**New file:** `web/src/components/TeenShell.tsx`. Encapsulates the dark-sidebar-plus-mobile-header chrome that repeats across every teen page in the prototype. All 8 teen pages render inside it.

**Props:**

```ts
interface TeenShellProps {
  active:
    | "dashboard" | "case" | "team" | "wellness" | "answers"
    | "rights" | "resources" | "future";
  lang: Lang;
  children: React.ReactNode;
}
```

**Owned elements:**

- **Outer container** — `fixed inset-0 z-50` full-viewport, `font-['Inter',_sans-serif]`, bg `#FDFBF7`, overflow-y auto on main.
- **Desktop sidebar** (`hidden md:flex w-[300px]`) — dark navy `#1a2f44`, emerald accents:
  - Logo block: welcome icon + "FosterHub" wordmark + "Arizona" micro-caps.
  - Nav items (in order): Dashboard, My Case Explained, My Advocates, Mental Health, Search Portal, Know Your Rights, Resources, My Future.
  - Active indicator: `framer-motion` `layoutId="nav-pill"` emerald pill on the left edge; morphs between items on navigation.
  - Footer: "Command Center" card with age band + language badge (dynamic from `prefs.ageBand` and `lang`).
- **Mobile top header** (`md:hidden`) — sticky, `bg-white/80 backdrop-blur-xl`, brand on the left, hamburger on the right. The hamburger opens a full-screen drawer mirroring the desktop nav items.
- **Mobile bottom nav** — floating pill with the 5 primary items (Dashboard, Case, Advocates, Wellness, Answers). The 3 secondary items (Rights, Resources, Future) live in the hamburger drawer. Rationale: 8 items is too many for a bottom nav at mobile widths.

**Not owned** — page-specific content (hero greetings, titles, body). Those live in each page.

**Navigation:** items use Next.js `<Link href={`/${lang}/case`}>` (not the prototype's `onNavigate` callback).

**Start over:** the `↩ Start over` link at the bottom of the prototype sidebar wires to `usePrefs()`'s `reset()` + `router.push("/")` — matches existing `/setup` start-over behavior.

**Spanish:** all sidebar labels translated via the new `tt()` helper (see §4). Active-band-plus-language badge localized.

**Why one shared shell not per-page sidebars:** The prototypes each copy-paste their own sidebar. Consolidating into one component keeps the nav pill's `layoutId` animation working across page transitions, reduces ~200 LOC of chrome per page to ~20 LOC of shell usage, and gives one place to update labels/items later.

---

## 3. Page porting plan

Each page below has the same shape: render `<TeenShell>`, place page-specific hero/content, wire data from `web/src/data/*` where it exists, add new strings via `tt()` where it doesn't.

### 3.1 Ported from existing prototypes (5)

#### Dashboard — `web/src/app/[lang]/page.tsx` (teen branch)

Source: `app/src/components/DashboardTeen.tsx`.

- "Good morning." greeting + `new Date()` formatted date, privacy badge on the right.
- Four tiles (Team / Case / Wellness / Answers) in a 2×2 grid with emerald-accent entrance animations and hover lift.
- Right sticky column: "Strategic Tip" card (band-specific copy) + Crisis Support (`tel:988`) + Start over link.
- **Band variations (per Q4 D):** the Strategic Tip string swaps by band via `ttBand("dashboard.tip", band, lang)`:
  - `13-15`: "Bring your questions to your lawyer — they work for you."
  - `16-17`: prototype's original "request a private meeting with your judge before your next hearing."
  - `18-21`: "Ask your caseworker about extended foster care — it's voluntary and you can still use it."

#### My Team / Advocates — `web/src/app/[lang]/team/page.tsx`

Source: `app/src/components/MeetYourTeamTeen.tsx`.

- Data: **existing** `WHO_IN_YOUR_CASE` in `web/src/data/court.ts` (already EN+ES). The prototype's inline `WHO_IN_YOUR_CASE` array is dropped; we use the real dataset.
- Expandable cards with color themes from the prototype (`ROLE_THEMES`: emerald / indigo / blue / rose / amber / cyan / slate). Ported as a typed object in `TeenShell.tsx` or `lib/teen-role-themes.ts`.
- **Band variations:** `tip` per card has an optional `teen_tips` map keyed by band — falls back to the current `tip` / `tip_es` when absent.

#### My Case Explained — `web/src/app/[lang]/case/page.tsx`

Source: `app/src/components/MyCaseExplainedTeen.tsx`.

- Four stages (Prelim / Adjudication / Review / Permanency) with emerald / indigo / blue / rose theming.
- FAQs accordion below.
- **Data:** a new `CASE_STAGES_TEEN` export in `web/src/data/court.ts` (alongside existing `COURT_STAGES`). Each row has `{ id, title{en,es}, subtitle{en,es}, color, what{en,es}, teen: { "13-15": {en,es}, ... }, insight: { "13-15": {en,es}, ... }, next{en,es} }`. FAQs added as `CASE_FAQS_TEEN` with the same shape.
- **Band variations:** each stage's `teen` narrative + `insight` swap per band.

#### Wellness / Mental Health — `web/src/app/[lang]/wellness/page.tsx`

Source: `app/src/components/WellnessTeen.tsx`.

- Grounding 5-4-3-2-1 (static content, identical for all bands).
- Three coping-tool cards (Box Breathing, 3-Line Journaling, Change Your Scenery) — static.
- Support Network: 988 / Crisis Text / DCS SOS-CHILD — uses existing `CRISIS_PINS` from `web/src/data/constants.ts`.
- **Band variations:** none; wellness copy is universal.

#### Find Answers / Search Portal — `web/src/app/[lang]/ask/page.tsx`

Source: `app/src/components/FindAnswersTeen.tsx`.

- Data: **existing** `QUESTIONS` + `TOPIC_CONFIG` from `web/src/data/questions.ts` (EN+ES, already age-band-gated via `ageBands: [...]`).
- The prototype's cross-repo import `../../../web/src/data/questions` is replaced with a clean path alias from the web project.
- Filter: `q.ageBands.includes(prefs.ageBand)` (replaces the prototype's hardcoded `16-17 || 18-21`).
- **Band variations:** natural via `ageBands`. The `answer1012` field is not consulted (we are serving 13+).

### 3.2 New ports — no prototype exists (3)

These inherit the prototype's visual language (Inter font, dark sidebar, emerald accents, sophisticated copy with uppercase micro-caps section labels) but content is adapted from the current web pages.

#### Know Your Rights — `web/src/app/[lang]/rights/page.tsx`

- Data: existing `RIGHTS` chunks + `ESCALATION_STEPS` from `web/src/data/rights.ts`.
- Layout: stacked expandable cards, one per right, each with a color theme from the same `ROLE_THEMES` palette. Top "Your Legal Protections" hero + A.R.S. §8-529 citation chip. Escalation ladder as a separate section below ("If a right is ignored: caseworker → supervisor → ombudsman → court").
- **Band variations:** existing text works for all teen bands; no swap needed.

#### Find Resources — `web/src/app/[lang]/resources/page.tsx`

- Data: existing `RESOURCES` directory (39 entries) from `web/src/data/resources.ts`.
- Layout: search bar + category filter chips at top, list of resource cards below. Each card: name, one-line description, `tel:` phone, external website, `lastVerified` date in micro-caps. Category chips styled like prototype's "Command Center" micro-caps.
- **Band variations:** chip order can surface band-relevant categories by default (e.g., 18-21 → "Housing" / "Employment" highlighted first). No content differences.

#### My Future Plan — `web/src/app/[lang]/future/page.tsx`

- Data: existing `IMPORTANT_DOCS` from `web/src/data/docs.ts` + EFC/ETV copy from the current `future/page.tsx`.
- Layout: three sections — "Documents You'll Need" (checklist of IDs/records), "Staying in Care After 18" (EFC explainer), "Education Support" (ETV explainer). Prototype-style card treatment.
- **Band variations:** framing banner at top of the page swaps per band — `13-15`: "These come up later — good to know now." `16-17`: "Start preparing now." `18-21`: "What applies right now."

### 3.3 What's not porting

- `/setup` onboarding stays as-is (Outfit/teal, drawer pattern). Users complete setup first, then enter teen shell.
- `10-12` pages stay unchanged.
- Legacy `/app/` prototype is unaffected.

---

## 4. i18n strategy and age-band content swap

**New file:** `web/src/lib/i18n-teen.ts`. Keeps teen-only strings out of the existing `i18n.ts` to prevent that file from doubling in size. Same `{ en, es }` shape as today.

```ts
import type { Lang } from "./i18n";
import type { AgeBandKey } from "./prefs";

export const TEEN_STRINGS = {
  "dashboard.greeting.morning":  { en: "Good morning.",         es: "Buenos días."         },
  "dashboard.greeting.subtitle": { en: "Welcome to your secure command center. {date}.",
                                   es: "Bienvenido/a a tu centro de comando seguro. {date}." },
  "dashboard.privacy.label":     { en: "Privacy First",          es: "Privacidad primero"   },
  "dashboard.privacy.body":      { en: "No data is ever saved or tracked.",
                                   es: "Nunca se guardan ni se rastrean datos."             },
  "nav.dashboard":               { en: "Dashboard",              es: "Inicio"               },
  "nav.case":                    { en: "My Case Explained",      es: "Mi Caso Explicado"    },
  // ...~400 keys total
} as const;

export function tt(
  key: keyof typeof TEEN_STRINGS,
  lang: Lang,
  vars?: Record<string, string>,
): string {
  const template = TEEN_STRINGS[key][lang];
  return vars ? template.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "") : template;
}

export function ttBand(keyBase: string, band: AgeBandKey, lang: Lang): string {
  const suffix = band.replace("-", "");  // "13-15" → "1315"
  return tt(`${keyBase}.${suffix}` as keyof typeof TEEN_STRINGS, lang);
}
```

**Band-variant strings use suffixed keys** — e.g., `dashboard.tip.1315`, `dashboard.tip.1617`, `dashboard.tip.1821`. `ttBand()` resolves to the right one at call time.

**Data-driven band variations live in the data files, not `i18n-teen.ts`.** For case stages and team tips, the swap is per-row, not per-page, so it is cleaner as a typed field on the record. The `"..."` below are schema illustrations, not TODO markers — the implementation plan will fill them with concrete copy:

```ts
// web/src/data/court.ts — extends existing entries
export const WHO_IN_YOUR_CASE = [
  {
    id: "caseworker",
    // ... existing fields ...
    teen_tips: {  // optional — all three keys required when present
      "13-15": { en: "...", es: "..." },
      "16-17": { en: "...", es: "..." },
      "18-21": { en: "...", es: "..." },
    },
  },
  // ...
];

// web/src/data/court.ts — NEW export
export const CASE_STAGES_TEEN = [
  {
    id: "prelim",
    title:    { en: "First Safety Hearing",           es: "Primera Audiencia de Seguridad"     },
    subtitle: { en: "Preliminary Protective Hearing", es: "Audiencia Protectora Preliminar"   },
    color:    "emerald",
    what:     { en: "...", es: "..." },   // shared across bands
    teen: {
      "13-15": { en: "...", es: "..." },
      "16-17": { en: "...", es: "..." },
      "18-21": { en: "...", es: "..." },
    },
    insight: {
      "13-15": { en: "...", es: "..." },
      "16-17": { en: "...", es: "..." },
      "18-21": { en: "...", es: "..." },
    },
    next: { en: "...", es: "..." },
  },
  // 3 more stages
];
```

**Spanish translation workflow (Q3 Option A).** All ES strings written inline as part of the initial work, following conventions already established in `web/src/lib/i18n.ts`:

- Second-person singular "tú" (not "usted").
- Plain language, 6th-grade reading level, youth voice.
- Gendered adjectives referring to the user use inclusive `/a` form (e.g., "bienvenido/a", "tratado/a").
- Legal terms match current usage across `i18n.ts` / `court.ts` / `rights.ts` — no competing translations for the same AZ statute term.

Every ES string ships in the PR alongside its EN counterpart. Review happens in the PR diff.

**Utility scope.** `tt()` is used only by `TeenShell` and teen pages. The 10-12 pages and onboarding continue to use the existing `t()`. No cross-pollination.

**Volume estimate.** ~120 nav/shell/dashboard + ~60 team + ~50 case + ~40 wellness + ~40 ask + ~60 rights/resources/future + ~80 data-embedded band variants = **~450 string pairs** (~900 lines of `{ en, es }`).

---

## 5. Assets

All prototype images already exist under `web/public/` from the visual refresh shipped on 2026-04-20:

| Prototype path | `web/public/` path | Action |
| --- | --- | --- |
| `app/src/assets/onboarding/welcome_icon.png` | `onboarding/welcome_icon.png` | Reuse |
| `app/src/assets/avatars/*.png` | `avatars/*.png` | Reuse |
| `app/src/assets/dashboard/*.png` | `dashboard/*.png` | Reuse |
| `app/src/assets/wellness/*.png` | `wellness/*.png` | Reuse |
| `app/src/assets/my_case/*_icon.png` | `my_case/*.png` | Reuse |

No new binary assets need to ship. Prototype `import welcomeIcon from "../assets/..."` becomes `<img src="/onboarding/welcome_icon.png" />` in Next.js — string paths, not bundled imports.

---

## 6. Animations (framer-motion, Q5 option A)

- **Install:** `npm install framer-motion` in `web/`. Current major (~12.x) supports React 19 + Next 16.
- **`"use client"`** on every teen page and on `TeenShell` — framer-motion uses browser APIs.
- **`layoutId="nav-pill"`** on the active-nav-item emerald indicator in `TeenShell` — ports directly; the pill morphs between items as the user navigates within the shell.
- **`AnimatePresence`** wraps expandable card sections in Case / Team / FAQ / Ask — mounted/unmounted chevron-expand panels.
- **`motion.div`** entrance staggers on dashboard tiles and list items (ports `initial`, `animate`, `transition` props unchanged from the prototypes).
- **Reduced motion:** use `useReducedMotion()` from framer-motion on the 4–5 most prominent entrance animations to zero-out `duration` when the OS signals prefers-reduced-motion. Standard accessibility hygiene; no `LazyMotion` wrapper needed at this scope.

---

## 7. Testing plan

Manual, focused — no new automated test infrastructure.

1. **Build passes.** `cd web && npm run build` succeeds with 0 TS errors; all 8 teen routes appear in the SSG output under both `/en/*` and `/es/*`.
2. **Band dispatch.** With `localStorage.fgaz_prefs_v2` seeded to each of the four bands in turn, the correct variant renders at `/en/` and each subroute. `10-12` sees the old shell; `13+` sees `TeenShell`.
3. **Onboarding gate.** Clearing localStorage and visiting `/en/case` redirects to `/en/setup`.
4. **Language swap.** On any teen page, navigating `/en/case` ↔ `/es/case` shows translated content; no EN fallback leaks.
5. **Band-specific copy.** On each teen page, confirm the 3 band variants produce 3 different tip/insight strings.
6. **Nav coverage.** From the teen sidebar, every one of the 8 items navigates correctly; the `layoutId` pill morphs between items.
7. **Mobile.** At 375 px width, the teen shell shows mobile header + hamburger drawer + floating bottom nav; no horizontal scroll.
8. **Visual regression on 10-12.** Confirm the 10-12 dashboard and all 10-12-facing pages are visually unchanged (no leakage from teen CSS).
9. **Start over.** The "↩ Start over" link in the teen sidebar calls `reset()` and returns to `/` language picker.
10. **Lighthouse pass.** Teen dashboard scores ≥ 90 on mobile performance; framer-motion does not regress LCP.

---

## 8. Scope boundaries / non-goals

- **Not touching:** `/setup` onboarding (stays Outfit/teal), the 10-12 pages, legacy `/app/` prototype, `server/` backend.
- **Not adding:** route groups, server-side band detection, auth, analytics, storybook.
- **Not porting:** `AgeSelectionPrototype.tsx` / `LanguageSelectionPrototype.tsx` from `app/` — onboarding is out of scope.

---

## 9. Rollout

**One PR.** Size is large (~15 new files, ~3000 LOC including ES strings) but the work is internally cohesive — partial rollout would ship a broken teen experience. PR description lists the 8 routes, screenshots of each at each band, and ES samples for reviewer to spot-check.

**No feature flag.** Band dispatch happens at render time and `10-12` is the default for new users without prefs. Existing 13+ users see the new UI the moment the PR merges; 10-12 users see no change.

---

## 10. Open questions

None outstanding. Proceed to implementation plan.
