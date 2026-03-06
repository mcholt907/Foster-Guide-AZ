# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

FosterGuide AZ is a click-through prototype — a self-contained React app with no backend, no real AI, and no PII. It helps Arizona foster youth (ages 10–21) navigate rights, court processes, resources, and transition planning. The "AI chat" feature is a scripted simulator for demo/storytelling purposes only.

## Repository Structure

All source code lives in `preview/` — this is the only working directory for development:

```
preview/
  src/
    FosterGuideAZPrototype.tsx  — the entire app (single large component file)
    App.tsx                     — shell that mounts FosterGuideAZPrototype
    main.tsx                    — Vite entry point
    index.css / App.css         — global styles
```

## Commands

All commands must be run from `preview/`:

```bash
cd preview

npm run dev       # start dev server with HMR
npm run build     # type-check + production build (tsc -b && vite build)
npm run lint      # ESLint
npm run preview   # serve the production build locally
```

## Architecture

The entire application is a single monolithic component in `FosterGuideAZPrototype.tsx`. It uses:

- **React 19** with hooks (`useState`, `useEffect`, `useMemo`, `useRef`)
- **Tailwind CSS v4** (via `@tailwindcss/postcss`) for all styling — no CSS modules
- **framer-motion** for page/panel transitions (`AnimatePresence`, `motion`)
- **lucide-react** for icons

### Data Model

All data is hardcoded at the top of `FosterGuideAZPrototype.tsx` as `const` arrays:

- `COUNTIES` — all 15 AZ counties
- `AGE_BANDS` — four bands (`10-12`, `13-15`, `16-17`, `18-21`) that gate content complexity
- `PATHWAYS` — the 7 entry-point journeys a user selects on onboarding
- `DEMO_PERSONAS` — 4 preset demo profiles (Maria, Jaylen, Destiny, Andre)
- `CRISIS_PINS` — always-visible crisis hotlines
- `RESOURCES` — filterable list of AZ-specific organizations with `categories`, `counties`, `ages`, `spanish` fields
- `RIGHTS` — foster youth rights with `tiers` keyed by age band (plain-language + example per tier)
- `COURT_STAGES` — the 4 court hearing types with plain-language descriptions

### Personalization

User context (language, age band, county, tribal indicator, pathway) is stored in local React state only. Content is filtered and adapted based on these selections — the `readingTone()` helper maps age band to a reading-level label, and `RIGHTS` data uses per-tier content keyed by age band string.

### Navigation

The app uses a tab-based navigation pattern managed by a `currentTab` state string. Panels are animated in/out using `AnimatePresence`. There is no router — all navigation is pure state.

### Reusable UI Primitives

Small shared components are defined within the same file: `Card`, `Modal`, `PrimaryButton`, `Chip`, `SectionTitle`, `Divider`. These accept standard React props and use Tailwind utility classes directly.
