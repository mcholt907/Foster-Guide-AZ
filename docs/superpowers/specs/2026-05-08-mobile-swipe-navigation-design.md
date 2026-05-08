# Mobile Swipe Navigation — Design

**Date:** 2026-05-08
**Status:** Approved (ready for implementation plan)
**Scope:** `web/` (Next.js production app), teen shell only

## Problem

The teen shell ([TeenShell.tsx](../../../web/src/components/TeenShell.tsx)) exposes eight sections in its desktop side nav, but the mobile bottom nav only has room for five (Dashboard, My Case Explained, My Advocates, Mental Health, Search Portal). The remaining three — Know Your Rights, Resources, My Future — are reachable on mobile only via the hamburger drawer. Mobile users currently have to open the drawer for any non-bottom-nav section.

## Goal

Let mobile users swipe horizontally inside the main content area to move between sections in side-nav order. The hamburger drawer and bottom nav remain in place as fallbacks; nothing existing is removed or relocated.

## Scope

### In scope

- Touch swipe gesture handling on the main content area of `TeenShell`.
- All eight teen-shell sections, in the existing `NAV_ITEMS` order:
  `dashboard → case → team → wellness → answers → rights → resources → future`.
- Mobile/touch only (gesture handlers attached via touch events; desktop unaffected).

### Out of scope (YAGNI for v1)

- Live page-peek / carousel drag where the next page slides under the finger.
- Edge bounce or rubber-band animation when stopping at first/last.
- First-visit "swipe to explore" coachmark or hint.
- Swipe on the 10-12 dashboard (different shell, only 4 tiles, no parallel routes).
- Swipe on desktop (full side nav is already visible; no need).

## Interaction model

Snap-only — the route changes on `touchend` if the gesture qualifies as a deliberate horizontal swipe. Each page's existing framer-motion mount animation provides the visual transition. No mid-gesture animation.

### Gesture rules

| Rule | Value | Why |
| --- | --- | --- |
| Minimum horizontal distance | `\|dx\| ≥ 60px` | Filters taps and accidental drift. |
| Vertical-to-horizontal ratio | `\|dy\| < \|dx\| × 0.7` | Vertical scroll is never hijacked; the gesture must be clearly more horizontal than vertical. |
| Single touch only | `e.touches.length === 1` at start | Preserves pinch-zoom and other multi-touch gestures. |
| Edge-start ignored | start within 20px of left or right viewport edge → drop | iOS Safari's browser back-swipe wins. |
| Direction | swipe-left → next, swipe-right → previous | Standard mobile convention. |
| Edges | stop (no wrap) | Wrap-around is disorienting in nav contexts; matches iOS / Android tab-bar conventions. |

`touchstart` is attached with `{ passive: true }` so it never blocks scroll. We do not call `preventDefault()` on either event.

## Architecture

One new file, one edit.

### `web/src/lib/useSwipeNav.ts` (new)

Self-contained hook. Signature:

```ts
useSwipeNav({
  items: { id: string; href: string }[],
  currentId: string,
  lang: Lang,
}): React.RefObject<HTMLDivElement>
```

Responsibilities:

- Attach `touchstart` / `touchend` to the returned ref's element.
- Track gesture start `(x, y)` and apply the rules in the table above on `touchend`.
- On a qualifying swipe, compute the prev/next index from `items` and call `router.push` with `/${lang}` + `items[targetIdx].href`. If `targetIdx` is out of bounds, do nothing.
- On mount and when `currentId` changes, call `router.prefetch(...)` for the immediate prev and next routes. This keeps the swipe instant for Rights/Resources/Future, which aren't otherwise prefetched on mobile (their `<Link>` elements only render when the hamburger drawer is open).
- Clean up listeners on unmount.

The hook is generic over the items array — it has no awareness of teen-shell-specific identifiers. `TeenShell` remains the only file that owns the order.

### `web/src/components/TeenShell.tsx` (edit)

- Import `useSwipeNav`.
- Inside the component, call it with `NAV_ITEMS`, the current `active` id, and `lang`:

  ```ts
  const swipeRef = useSwipeNav({ items: NAV_ITEMS, currentId: active, lang });
  ```

- Attach `ref={swipeRef}` to the existing main-content `<div>` at [line 180](../../../web/src/components/TeenShell.tsx#L180).

No structural or styling changes to the shell.

## Accessibility

- Hamburger and bottom nav are unchanged; users who can't or don't swipe lose nothing.
- No keyboard-nav impact (the hook only reacts to touch events, never to pointer or keyboard input).
- `prefers-reduced-motion`: unaffected. The hook itself does not animate; page mount animations already respect `useReducedMotion`.
- Tap targets (links, buttons) inside the swipe area are unaffected — taps don't move 60px.

## Verification

Manual checks on mobile dev tools (or a real device):

- Swipe left through all 8 sections starting at Dashboard; each transition lands on the expected route in both `/en/*` and `/es/*`.
- Swipe right through all 8 sections starting at Future; same.
- At Dashboard, swipe right does nothing. At Future, swipe left does nothing.
- Vertical scroll inside any section works normally (e.g., scrolling the long Rights page).
- Tapping a `<Link>` or `<button>` inside the swipe area still works.
- Pinch-zoom still works.
- iOS edge-back gesture: start a swipe within ~20px of the left edge → browser back navigates, no in-app section change.
- Hamburger drawer still opens, closes, and routes correctly.
- Bottom nav still routes correctly.
- `npm run build` produces no new warnings or type errors.
