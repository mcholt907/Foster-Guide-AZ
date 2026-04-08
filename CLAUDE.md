# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

FosterHub AZ helps Arizona foster youth (ages 10–21) navigate rights, court processes, resources, and transition planning. The repository contains three separate applications:

| Directory | Purpose | Status |
| --------- | ------- | ------ |
| `app/` | React + Vite prototype with real RAG-powered AI chat (Claude Haiku) | Local dev / reference |
| `web/` | Next.js 16 PWA — the live production website | **Active — deployed to fosterhubaz.com** |
| `preview/` | Original click-through prototype (no backend, scripted AI) | Legacy / demo only |

**The primary working directory for new development is `web/`.** The `app/` prototype is a useful reference for content, data, and component logic. The `preview/` directory is legacy and should not be modified.

## Production URLs

- <https://fosterhubaz.com> — root redirects to `/en`
- <https://www.fosterhubaz.com> — same
- Hosted on Render (`fosterhub-web` web service), auto-deploys from `master`

---

## Web App (`web/`) — Primary Codebase

### Commands

```bash
cd web

npm run dev       # start dev server (http://localhost:3000/en)
npm run build     # type-check + production build
npm run lint      # ESLint
npm run preview   # serve the production build locally
```

### Structure

```text
web/
  src/
    app/
      layout.tsx              — root layout (metadata, favicon, PWA)
      page.tsx                — language-select screen (first screen users see)
      [lang]/
        layout.tsx            — lang layout (SideNav + BottomNav wrapper)
        page.tsx              — Home screen
        setup/page.tsx        — onboarding (age band, county, tribal)
        rights/page.tsx       — Your Rights (A.R.S. §8-529) + FAQPage JSON-LD
        case/page.tsx         — My Case (dependency court stages)
        future/page.tsx       — My Future Plan (EFC/ETV/docs)
        resources/page.tsx    — Find Resources (filterable directory)
        wellness/page.tsx     — Wellness Check-In
        ask/page.tsx          — Find Answers (static browse + Fuse.js fuzzy search; no backend)
    components/
      BottomNav.tsx           — floating pill nav (persistent labels, solid teal
                                active pill, warm stone inactive, teal-tinted shadow)
      ui.tsx                  — shared primitives: Card, Modal, PrimaryButton,
                                Chip, SectionTitle, Divider, ScreenHero,
                                SafeNotice, StatCite
    lib/
      i18n.ts                 — all UI strings (EN + ES); plain-language, youth voice
      prefs.ts                — usePrefs() hook (localStorage, cross-component sync)
      useOnboardingGate.ts    — redirect to /setup if onboarding not complete
      chat.ts                 — typed API client for the RAG backend (dead code — no longer used)
    data/
      constants.ts            — COUNTIES, AGE_BANDS, CRISIS_PINS (+ lastVerified)
      rights.ts               — RIGHTS chunks (A.R.S. §8-529), ESCALATION_STEPS
      court.ts                — COURT_STAGES, WHO_IN_YOUR_CASE (caregiver card
                                includes House Manager / group home staff)
      resources.ts            — RESOURCES directory (39 entries, + lastVerified)
      docs.ts                 — IMPORTANT_DOCS (documents youth need, + lastVerified)
      questions.ts            — Q&A entries (QUESTIONS, TOPIC_CONFIG, RESOURCE_LINK_CATEGORIES); Fuse.js search source for Find Answers page
    public/
      favicon.svg             — browser tab icon
      icons/icon-192.svg      — PWA home screen icon (192px)
      icons/icon-512.svg      — PWA splash icon (512px)
      manifest.webmanifest    — PWA manifest
scripts/
  validate-content.ts         — URL, phone, date, and citation format checks
  check-staleness.ts          — risk-tiered SLA staleness detection
  reverify-content.ts         — auto-reverify URLs + phone numbers; auto-corrects redirects
  generate-freshness-report.ts — markdown freshness report generator
  check-legislation.ts        — monitors AZ statutes on the watchlist
  watchlist.json              — legislative watchlist (§8-529, §8-514.06, §8-521, etc.)
  ingest-review.ts            — content ingestion review helper
.github/workflows/
  link-check.yml              — Lychee link checker (on PR + weekly)
  content-validation.yml      — runs validate-content.ts (on PR)
  staleness-check.yml         — runs check-staleness.ts (weekly)
  auto-reverify.yml           — runs reverify-content.ts (monthly)
  legislative-watch.yml       — runs check-legislation.ts (weekly)
  freshness-report.yml        — generates freshness report (monthly)
  ingest-review.yml           — content ingestion review (on PR)
.lychee.toml                  — link checker configuration
docs/
  freshness-report.md         — current content freshness status
  reverification-report.md    — last auto-reverification run results
```

### Architecture

- **Next.js 16** App Router with `generateStaticParams` for EN/ES routes
- **Tailwind CSS v4** for all styling — no CSS modules
- **lucide-react** for icons
- **framer-motion** not used in web (pure CSS transitions)
- Language from URL segment: `/en/*` or `/es/*`
- User prefs (ageBand, county, tribal, onboardingDone) in `localStorage` key `fgaz_prefs_v2`
- No router state — all navigation via Next.js `Link` and `router.push`
- **No backend dependency** — the Find Answers page (`/ask`) uses client-side Fuse.js search over `data/questions.ts`; `NEXT_PUBLIC_API_URL` and `lib/chat.ts` are unused and can be removed
- Canonical URLs use `www.fosterhubaz.com`; root `/` redirects server-side to `/en`
- Per-page `hreflang` alternate links on all `[lang]` layouts
- `sitemap.ts` generates static sitemap (no onboarding-gated paths)

### Age-Band Gating

Four bands: `10-12`, `13-15`, `16-17`, `18-21`. Content complexity adapts per band.

- **10-12**: Resources nav item and page are hidden (redirect to home)
- My Future Plan card hidden for 10-12 and 13-15 on Home screen
- All other screens adapt copy/content per band

### Key Patterns

- `useOnboardingGate(lang)` — call at top of every page; redirects to `/setup` if not onboarded
- `usePrefs()` — returns `[prefs, loaded, patch, reset]`; dispatches `fgaz-prefs-updated` custom event so all component instances (including SideNav) stay in sync
- `SafeNotice` — disclaimer component shown at the bottom of Rights, Case, Future, Resources, Wellness pages
- `ScreenHero` — standard gradient hero banner (3-stop: teal → `#1a5f7e` → navy); `tracking-tighter` on titles, `tracking-wide` on subtitles
- Cards use ambient `shadow-*` (not `ring-1 ring-black/5`); inner stacked cards use `ring-slate-200`

### Content Freshness

All entries in `web/src/data/resources.ts`, `constants.ts`, and `docs.ts` carry a `lastVerified` date. When adding or editing entries, always set `lastVerified` to today's date (ISO format: `YYYY-MM-DD`).

CI enforces freshness via GitHub Actions:

- **PRs**: `content-validation.yml` (format/citation checks) + `link-check.yml` (Lychee)
- **Weekly**: `staleness-check.yml`, `legislative-watch.yml`
- **Monthly**: `auto-reverify.yml`, `freshness-report.yml`

To run content checks locally:

```bash
npx ts-node scripts/validate-content.ts
npx ts-node scripts/check-staleness.ts
```

### Language & Tone

All user-facing copy must be **plain language, youth voice** — speak to "you" directly, avoid acronyms (spell out EFC/ETV on first use), avoid legal jargon. Max 6th-grade reading level. See `web/src/lib/i18n.ts` for EN + ES string conventions.

---

## App Prototype (`app/`) — Reference Only

> **Note:** The `fosterhub-api` Render service (Express RAG backend in `server/`) has been suspended. The production web app no longer calls it — Find Answers is fully static. The `server/` code remains in the repo as a reference if AI chat is ever reintroduced.

### Dev Commands (local reference use only)

```bash
cd server && npm run dev   # RAG backend (needs ANTHROPIC_API_KEY in server/.env)
cd app && npm run dev      # React prototype (http://localhost:5173)
```

### Key Files

- `app/src/FosterGuideAZPrototype.tsx` — entire frontend (monolithic component)
- `server/src/routes/chat.ts` — RAG chat endpoint
- `server/src/data/` — rights.ts, court.ts, resources.ts
- `server/src/rag/` — retriever.ts (lunr BM25), prompt.ts, claude.ts

---

## Design System

- **Primary:** deep teal `#2A7F8E`
- **Secondary:** warm navy `#1B3A5C`
- **Accent:** warm amber `#D97706`
- **Background:** warm off-white `#F5F2EE`
- **Never use:** red, bright yellow, pure black backgrounds, neon
- Typography: serif headings, humanist sans body, max 6th-grade reading level
- Icon/logo: house with amber heart on teal rounded background (`/icons/icon-192.svg`)

## Privacy

Zero PII. No sign-up. localStorage only (prefs, nothing personal). No analytics SDKs.
