# TeenShell Persistent-Layout Refactor — Design

**Date:** 2026-05-08
**Status:** Approved (ready for implementation plan)
**Scope:** `web/` (Next.js production app)

## Problem

[`TeenShell`](../../../web/src/components/TeenShell.tsx) is rendered by each teen-band page individually — every page file reads the user's age band from prefs and, for teens, wraps its body in `<TeenShell active="…">`. TeenShell positions itself as `fixed inset-0 z-50`, so it overlays the 10-12 chrome that the server layout already rendered. Result: every navigation between teen sections fully unmounts and remounts the side nav, mobile header, and bottom nav. The bottom nav's `scrollLeft` resets to `0` on each mount, which is why navigating to Rights / Resources / Future used to animate across the bar (now suppressed via `behavior: "auto"` — but the underlying remount is still wasteful and visually jumpy).

Moving `TeenShell` into a layout-level wrapper makes it persist across child route changes. The shell renders once per `/[lang]/` visit; subsequent navigations only swap the inner content. The bottom-nav scroll state survives, the side nav stops re-rendering, and Next.js can transition pages without re-running shell mount logic.

## Goal

A persistent shell for teen-band users on app routes, owned by a single client component (`BandShell`) that the server layout wraps around `children`. Each teen page becomes a plain content component — no `<TeenShell>` wrapper.

## Current architecture

```text
[lang]/layout.tsx (Server Component)
├─ <LangSync>
├─ skip-link
├─ <SideNav>           ← from components/BottomNav.tsx, band-aware (filters items by 10-12 vs teen)
├─ <main>{children}<LegalFooter/></main>
└─ <BottomNav>         ← from components/BottomNav.tsx, band-aware (same)

Each teen page (e.g. rights/page.tsx, Client Component):
- reads band from useOnboardingGate
- if 10-12 → renders `<Rights1012>`
- else     → renders `<TeenShell active="rights"><RightsTeen/></TeenShell>`
                        ↑ this is fixed inset-0 z-50, OVERLAYING the layout's chrome
                          (so teen users have two nav bars rendered, with the bottom one hidden behind TeenShell)
```

The "10-12 chrome" name in this doc refers to the `SideNav` + `BottomNav` exported by [`components/BottomNav.tsx`](../../../web/src/components/BottomNav.tsx) — not because they're 10-12-only, but because they're the band that sees them today. The components themselves filter items based on `prefs.ageBand` ([BottomNav.tsx:26-32](../../../web/src/components/BottomNav.tsx#L26-L32) and [82-88](../../../web/src/components/BottomNav.tsx#L82-L88)). Teen users currently see them only on informational routes (setup, privacy, terms, accessibility) where no page renders TeenShell to overlay them.

`TeenShell` therefore mounts on every teen-band route change and unmounts on every navigation away. Layout chrome (SideNav, BottomNav) re-renders on every route change too because the layout is a Server Component — even though it doesn't unmount, its children re-execute.

## Target architecture

```text
[lang]/layout.tsx (Server Component, unchanged metadata duties)
├─ <LangSync>
├─ skip-link
└─ <BandShell lang>{children}</BandShell>   ← new client component, owns chrome decision

BandShell decides chrome from pathname + band, and renders EXACTLY ONE chrome
(never both — this is the cleanup; today the layout always rendered SideNav+BottomNav
and TeenShell overlaid them):

├─ informational route (/setup, /privacy, /terms, /accessibility)
│    → SideNav + main + BottomNav + LegalFooter (preserves today's behavior; teen users still see this on these routes)
├─ band === "10-12" on app route
│    → SideNav + main + BottomNav + LegalFooter
└─ teen band on app route
     → <TeenShell>{children}</TeenShell>
        ↑ mounted ONCE per /[lang]/ visit; persists across child route changes

Each teen page (e.g. rights/page.tsx):
- reads band from useOnboardingGate (still keeps its own `?? "13-15"` fallback for content choice)
- if 10-12 → renders `<Rights1012>`
- else     → renders `<RightsTeen lang band />` directly (no TeenShell wrapper)
```

The `active` prop is no longer drilled through every page; `TeenShell` derives it internally from `usePathname()` via a small shared helper.

Both `BandShell` (chrome decision) and the page (content decision) read from the same `usePrefs` source, which has cross-instance sync via a custom event ([prefs.ts:50](../../../web/src/lib/prefs.ts#L50)). They always agree on band, so there's no scenario where BandShell shows TeenShell chrome while the page renders 10-12 content (or vice versa).

## Chrome decisions

| Route                                        | Band 10-12  | Band teen   | Notes |
| -------------------------------------------- | ----------- | ----------- | ----- |
| `/`                                          | 10-12       | TeenShell   | Home: same band switch in the page body, just no shell wrapper |
| `/case`, `/team`, `/wellness`, `/ask`        | 10-12       | TeenShell   | Bottom-nav-visible routes |
| `/rights`, `/resources`, `/future`           | 10-12       | TeenShell   | Hidden-three routes |
| `/setup`                                     | 10-12       | 10-12       | Onboarding flow; preserves current behavior |
| `/privacy`, `/terms`, `/accessibility`       | 10-12       | 10-12       | Informational; preserves current behavior |

The "preserves current behavior" rows matter — today, teen users hitting `/setup` etc. see the 10-12 chrome because no page wraps them in TeenShell. We replicate that exactly.

### Special case: resources page redirect

[`resources/page.tsx`](../../../web/src/app/[lang]/resources/page.tsx) has a `useEffect` that bounces 10-12 users home (lines 22-24). This is intentional content gating — 10-12 don't get a resources page — and pre-dates this refactor. **Preserve verbatim.** The redirect is in the page body, not in TeenShell or the layout, so removing the `<TeenShell>` wrapper from the page leaves the redirect logic untouched.

## SSR / hydration

`BandShell` is a client component but renders during SSR. It calls `useOnboardingGate(lang)` which returns `prefs.ageBand = null` on the server (no localStorage). Per PR #9, we default the band to `"13-15"` when null, so SSR HTML on app routes always reflects the teen TeenShell chrome — same posture as today.

Hydration mismatch risk for actual 10-12 users: on first paint they would see teen chrome, then BandShell's effect-driven prefs read flips them to 10-12 chrome. This flash already exists today (the same per-page band switch causes the same flicker); the refactor neither introduces nor fixes it.

## Active-section derivation

A small helper, kept independent of TeenShell:

```ts
// web/src/lib/teenNav.ts
import type { TeenNavId } from "../components/TeenShell";
export function activeFromPathname(pathname: string, lang: string): TeenNavId {
  const tail = pathname.replace(`/${lang}`, "").replace(/^\/+/, "").split("/")[0] ?? "";
  if (tail === "" ) return "dashboard";
  if (tail === "ask") return "answers";
  if (
    tail === "case" || tail === "team" || tail === "wellness" ||
    tail === "rights" || tail === "resources" || tail === "future"
  ) return tail;
  return "dashboard";
}
```

`TeenShell`, `BandShell`, and `useSwipeNav` all derive `active` from this helper, keeping a single source of truth.

## Files

### New (2)

- `web/src/components/BandShell.tsx` — client component (~80 lines). Reads pathname + band, picks chrome, renders children inside the chosen wrapper. Owns the JSX currently inlined in `[lang]/layout.tsx` for the 10-12 chrome.
- `web/src/lib/teenNav.ts` — shared `activeFromPathname` helper (~15 lines).

### Edited (10)

- `web/src/app/[lang]/layout.tsx` — strip the 10-12 chrome (`SideNav`, `<main>`, `<BottomNav>`, `LegalFooter`); wrap `children` in `<BandShell lang>`. Server component status, `generateStaticParams`, and `generateMetadata` stay put.
- `web/src/components/TeenShell.tsx` — drop the `active` prop from `TeenShellProps`; derive internally via `usePathname()` + `activeFromPathname`. Update `useSwipeNav` call to pass the derived id.
- 8 page files drop the `<TeenShell active="…">` wrapper and return their inner content directly:
  - `web/src/app/[lang]/page.tsx`
  - `web/src/app/[lang]/case/page.tsx`
  - `web/src/app/[lang]/team/page.tsx`
  - `web/src/app/[lang]/wellness/page.tsx`
  - `web/src/app/[lang]/ask/page.tsx`
  - `web/src/app/[lang]/rights/page.tsx`
  - `web/src/app/[lang]/resources/page.tsx`
  - `web/src/app/[lang]/future/page.tsx`

Total: 12 files touched.

## Out of scope (YAGNI)

- Removing the hamburger drawer. Now that the bottom nav holds all 8 sections, the drawer is mostly redundant for navigation, but it still hosts the Start Over flow and footer links. Keep it for v1.
- Animating page transitions (e.g. `motion.div` page wrappers). Out of scope.
- Dynamic-import of TeenShell to avoid shipping it on informational routes. See "Risks & notes" for the bundle implication. Defer until/unless lighthouse flags it.

## Free wins (callouts)

These are behaviors that improve as a side effect of persistence, not separate work items — but worth flagging for the verification pass.

- **Desktop active-pill animation.** The `<motion.div layoutId="nav-pill">` at [TeenShell.tsx:98](../../../web/src/components/TeenShell.tsx#L98) currently does **not** animate between active items because TeenShell remounts on every navigation. Once persistent, that animation will start working — confirm visually in `/en` desktop view.
- **Persistent SideNav + BottomNav state for 10-12 users too.** The 10-12 chrome moves from a Server-Component layout child (re-renders on every navigation) into a Client-Component child of BandShell (persists). Side benefit: SideNav's "Start over?" confirm state and any other internal state will survive navigation for 10-12 users.
- **Bottom-nav scroll position survives.** This is the original motivation — confirmed under the verification section.

## Verification

- `npm run build` and `npm run lint` clean.
- Manual smoke on each route in `/en` and `/es`:
  - 10-12 band: `/setup`, `/`, `/case`, `/team`, `/wellness`, `/ask`, `/privacy`, `/terms`, `/accessibility` — unchanged.
  - Teen bands: dashboard, case, team, wellness, ask, rights, resources, future — TeenShell renders with correct active highlight.
- The whole point: in mobile emulation, navigate Dashboard → Case → Rights → Resources and confirm the bottom nav does **not** reset / jump on each step. Active item stays where you left it (or moves smoothly into view).
- Swipe nav still works; tap targets unchanged; hamburger drawer still opens.
- iOS edge-back gesture still wins over swipe (unchanged from existing useSwipeNav behavior).
- Search engines see SSR HTML for all routes — confirm by viewing source on `/en` and `/en/rights` in a non-JS browser or `curl`.

## Risks & notes

- **JSX fidelity.** The exact JSX for the 10-12 chrome (skip-link positioning, `<main>` padding, footer placement) needs to come over to BandShell verbatim. Any subtle change here could shift desktop layout for 10-12 users. Mitigation: copy the JSX exactly; verify visually on `/en` (10-12 band) before and after.
- **Unknown routes.** BandShell needs to handle the case where `usePathname()` returns paths outside our taxonomy (e.g. future routes we add). Default to 10-12 chrome / `dashboard` active to fail safe. The shared `activeFromPathname` returns `"dashboard"` for unknown routes — TeenShell mounted on, e.g., a not-yet-defined route would highlight Dashboard. Acceptable for the routes we have today.
- **Bundle implication on informational routes.** Today `/setup`, `/privacy`, `/terms`, `/accessibility` don't load TeenShell. After the refactor, BandShell statically imports TeenShell, so those routes ship TeenShell + its framer-motion / lucide deps (~10-15 KB gzipped). Acceptable; can be mitigated with a `dynamic(... { ssr: true })` import inside BandShell if it shows up in lighthouse scores.
- **Drawer / "Start over" prompt state persistence.** TeenShell holds local state for the hamburger drawer (`drawerOpen`) and the Start Over confirm (`confirmReset`). Today they reset on every navigation because TeenShell remounts. After persistence they survive — drawer Links already have `onClick={() => setDrawerOpen(false)}` so taps close the drawer cleanly, but if a user opens the Start Over confirm and then navigates without dismissing it, the prompt persists across pages. Acceptable v1 behavior; revisit if it confuses anyone.
- **Layout-persistence assumption.** The whole refactor depends on Next.js 16 persisting a Client-Component child of a Server-Component layout across child route changes within the same dynamic segment (`/[lang]/...`). This is standard App Router behavior, but worth a one-time empirical confirmation during implementation: navigate `/en` → `/en/case` and verify in React DevTools that BandShell + TeenShell are the same instances (no remount).
- **Page/chrome band consistency on hydration.** During the brief window between SSR HTML and `usePrefs` reading localStorage, both BandShell (chrome) and the page (content) see `ageBand: null` and apply their own `?? "13-15"` fallback. They always agree because they read the same source. The same fallback already exists in pages today, so this is unchanged behavior.

## Appendix: pre-implementation audit (2026-05-08)

Done during the spec review. Findings folded into the sections above; recorded here so a future reader doesn't have to re-do the work.

| Question | Verified | Source |
| --- | --- | --- |
| `[lang]/layout.tsx` is a Server Component with `generateMetadata` and `generateStaticParams` | yes | the file |
| All 8 teen page files wrap content in `<TeenShell active="…">` for teen bands | yes | home, case, team, wellness, ask, rights, resources, future — all match |
| Each teen page falls back to `prefs.ageBand ?? "13-15"` for SSR-friendly default | yes | every page |
| `useOnboardingGate(lang)` returns `prefs` directly (single value, not the `[prefs, loaded, …]` tuple) | yes | `useOnboardingGate.ts` |
| `usePrefs` syncs across instances via a custom event | yes | [`prefs.ts:50`](../../../web/src/lib/prefs.ts#L50) |
| `BottomNav` and `SideNav` are band-aware (filter items based on `prefs.ageBand`) and rendered for everyone today | yes | [`BottomNav.tsx:26-32`](../../../web/src/components/BottomNav.tsx#L26-L32), [`82-88`](../../../web/src/components/BottomNav.tsx#L82-L88) |
| `resources/page.tsx` has a `useEffect` redirect for 10-12 users | yes | [`resources/page.tsx:22-24`](../../../web/src/app/[lang]/resources/page.tsx#L22-L24) |
| No other teen page has router-level redirects | yes | scanned all 8 |
| TeenShell has no remount-dependent side effects (focus management, etc.) | yes | scanned the file |
