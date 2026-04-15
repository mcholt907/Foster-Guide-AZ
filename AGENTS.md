# Repository Guidelines

## Project Structure & Module Organization
This repository contains three TypeScript apps plus shared content tooling:
- `web/`: Next.js 16 production PWA (primary codebase).
- `server/`: Express + RAG backend reference (Vitest-enabled).
- `app/`: Vite React prototype/reference UI.
- `scripts/`: content validation, freshness, and legislation checks.
- `docs/`: generated reports and planning notes.
- `Context/`: product and research source material.

Prefer making new product changes in `web/src/` unless a task explicitly targets prototype/backend code.

## Build, Test, and Development Commands
Run commands from each app directory.
- `cd web && npm run dev` — start Next.js dev server (`localhost:3000`).
- `cd web && npm run build` — production build/type checks for web.
- `cd server && npm run dev` — run backend with `tsx watch`.
- `cd server && npm run test` — run backend unit tests (Vitest).
- `cd app && npm run dev` — start Vite prototype locally.
- `npx ts-node scripts/validate-content.ts` — validate links, phones, citations.
- `npx ts-node scripts/check-staleness.ts` — detect stale content by SLA rules.

## Coding Style & Naming Conventions
- Language: TypeScript across all apps.
- Indentation: 2 spaces; keep semicolon/quote style consistent with surrounding files.
- Components: PascalCase (`BottomNav.tsx`); hooks/utilities: camelCase (`useOnboardingGate.ts`).
- Route files follow framework conventions (`page.tsx`, `layout.tsx`, `sitemap.ts`).
- Keep copy plain-language and youth-facing; update EN/ES strings together where applicable.

## Testing Guidelines
- Framework: Vitest in `server/src/**` (`*.test.ts`).
- Add or update tests when changing server middleware, routes, types, or RAG logic.
- For content changes, run validation scripts in `scripts/` and update affected report docs when needed.

## Commit & Pull Request Guidelines
Follow Conventional Commit style seen in history:
- Examples: `feat(nav): ...`, `fix(seo): ...`, `docs: ...`, `chore: ...`.
- Keep subject lines imperative and scoped when useful.

PRs should include:
- concise summary of user-visible or data-impacting changes,
- linked issue/task (if available),
- screenshots/GIFs for UI updates (`web/` or `app/`),
- notes on validation run (tests/scripts).

## Security & Configuration Tips
- Never commit secrets; use local `.env` files (for example `server/.env`).
- Treat repository data as public-facing guidance: verify links, phone numbers, and statute references before merge.
