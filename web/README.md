# Foster Guide AZ Web

Production Next.js 16 PWA for Foster Guide AZ. This app serves bilingual (`/en`, `/es`) youth-friendly content about rights, case process, resources, wellness, and transition planning.

## Contributor Guide

Repository-wide contribution standards are documented in [`../AGENTS.md`](../AGENTS.md).

## Getting Started

```bash
cd web
npm install
npm run dev
```

Open `http://localhost:3000/en`.

## Scripts

- `npm run dev` — start local dev server.
- `npm run build` — create production build.
- `npm run start` — run the production build locally.

## Project Structure

- `src/app/` — App Router pages and layouts.
- `src/components/` — shared UI components.
- `src/data/` — curated rights/resources/content datasets.
- `src/lib/` — hooks, i18n helpers, and client utilities.
- `public/` — static assets and PWA icons.

## Content & Quality Workflow

When content changes touch links, phone numbers, or dates, run repository scripts from the project root:

```bash
npx ts-node scripts/validate-content.ts
npx ts-node scripts/check-staleness.ts
```

Keep EN/ES copy aligned and preserve plain-language, youth-facing tone.
