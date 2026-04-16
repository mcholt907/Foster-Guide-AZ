# Start Over — Full Reset

**Date:** 2026-04-16  
**Status:** Approved

---

## Summary

Allow users to reset all onboarding preferences and return to the language picker from any home screen. Prevents accidental resets with a lightweight inline confirmation. No new routes or components required.

---

## Behavior

Triggering "Start over" always does two things in sequence:

1. Call `reset()` from `usePrefs()` — removes `fgaz_prefs_v2` from localStorage and fires the `fgaz-prefs-updated` sync event
2. `router.push('/')` — navigates to the root language picker

---

## Surfaces

### Surface 1 — Mobile: settings chip on the home screen

**Location:** `web/src/app/[lang]/page.tsx`

**10–12 band (`Dashboard1012` component):**

The existing display-only "Ages 10–12 · English" pill becomes interactive. Two local state variables manage the interaction: `chipOpen: boolean` (whether the confirm card is visible).

- **Idle:** `📍 Ages 10–12 · English` — slate text, white/50 bg, passive pill
- **Tapped:** pill turns green (`bg-[#136d41] text-white`), inline confirm card slides in below the heading (no scrim, no modal, no portal)

Confirm card copy:
> *"This clears your age group and language. You'll start fresh from the beginning."*
> `↩ Yes, start over` (green solid button) &nbsp;·&nbsp; `Never mind` (text link)

Confirming: call `reset()` then `router.push('/')`.  
Dismissing: set `chipOpen = false`, pill returns to idle.

**13–21 bands (ScreenHero `onStartOver`):**

The `ScreenHero` component already renders a "Start over" button when `onStartOver` is provided. Currently it only routes to `/[lang]/setup` without clearing prefs. Change the `onStartOver` handler in `page.tsx` to:

```ts
onStartOver={() => { reset(); router.push('/'); }}
```

No change to the `ScreenHero` component itself.

---

### Surface 2 — Desktop: SideNav footer

**Location:** `web/src/components/BottomNav.tsx` (`SideNav` function)

Below the existing "No sign-up · Nothing stored" line, add a `↩ Start over` link in the same `text-white/35` style.

Two local state variables: `confirmOpen: boolean`.

- **Idle:** `↩ Start over` — faint white link, same styling as the privacy note above it
- **Clicked:** that line swaps inline to: `Reset? ` **Yes** (white/70) · **No** (white/35) — no modal

Confirming: `reset()` + `router.push('/')`.  
Declining: `confirmOpen = false`, link returns to idle.

`reset()` and `router.push` require the component to be a client component and use `usePrefs()` and `useRouter()`. `SideNav` is already `"use client"` and in the same file as `BottomNav`.

---

### Surface 3 — App prototype

**Location:** `app/src/components/DashboardPrototype.tsx`

Add a small `↩ Start over` text link in the footer section (below the 988 crisis card). Tapping calls the `onNavigate('onboarding')` prop — no localStorage involvement since the app prototype has no persistent state.

Copy: `↩ Start over` — `text-xs text-slate-400 underline`

---

## What Does NOT Change

- Inner pages (case, wellness, ask, team) — no "start over" surface
- Language switcher links at the bottom of each page — unchanged
- `ScreenHero` component signature — unchanged (handler changes at the call site only)
- No new routes, pages, or components

---

## Files Changed

| File | Change |
|------|--------|
| `web/src/app/[lang]/page.tsx` | Make chip interactive (10–12); fix `onStartOver` to call `reset()` (13–21) |
| `web/src/components/BottomNav.tsx` | Add inline "Start over" with confirm to `SideNav` footer |
| `app/src/components/DashboardPrototype.tsx` | Add `↩ Start over` link in footer |
