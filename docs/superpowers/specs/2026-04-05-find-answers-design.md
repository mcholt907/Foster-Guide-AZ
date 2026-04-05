# Find Answers — Design Spec

**Date:** 2026-04-05
**Status:** Approved — ready for implementation planning
**Route:** `/[lang]/ask` (unchanged)
**Replaces:** Live AI chat ("Ask Compass") page

---

## Goal

Replace the live AI chat interface with a fully static, offline-capable "Find Answers" page that helps foster youth quickly find plain-language answers to their most important questions — without needing to know what to ask, without talking to a bot, and without a backend API call.

---

## Voice & Tone (non-negotiable)

Every word on this page — Compass's intro, topic labels, question text, answers, empty states, error states — must:

- **Speak to "you"** directly. Not "foster youth may..." — "You have the right to..."
- **Sound like a trusted friend**, not a legal document or a school worksheet.
- **Be age-appropriate per band.** A 10-year-old and a 20-year-old are in completely different places in life. The language, complexity, and topics reflect that.
- **Lead with empathy.** Acknowledge that this stuff is hard and confusing before giving the answer.
- **Max 6th-grade reading level** for all age bands. Simpler for 10–12.
- **No jargon without an immediate plain-language follow-up.** If "permanency hearing" appears in an answer, the next sentence explains what it actually means in plain words.

---

## Page Structure

```
ScreenHero (teal gradient)
  Title: "Find Answers"
  Subtitle: [age-band-specific — see below]

Compass intro card
  Avatar | "Hi, I'm Compass"
  [age-band-specific greeting — see below]

Search bar
  Placeholder: "Search for anything…"
  Clears to browse mode on ✕

Topic chips  [filtered by age band]
  Scrollable horizontal row
  Active chip: solid teal pill
  Inactive: white pill with ring

Question list  [filtered by active topic OR search results]
  Each row: question text + › chevron
  Tapping opens the answer panel

Answer panel  (slide-in or modal)
  ‹ Back link (returns to previous topic/search)
  Question as heading
  Answer (plain language, "you" voice)
  Citation chips (A.R.S. refs where applicable)
  "Related questions" row (from relatedIds)
  Optional CTA: "Find resources near you" (links to /resources with filter)

SafeNotice (bottom of page, same as other pages)
```

---

## Age-Band Tailoring

### Compass intro subtitles (ScreenHero)

| Band | EN | ES |
|------|----|----|
| 10–12 | "You have rights. Here's what they mean for you." | "Tienes derechos. Aquí está lo que significan para ti." |
| 13–15 | "Your rights, your case, your voice — find real answers." | "Tus derechos, tu caso, tu voz — encuentra respuestas reales." |
| 16–17 | "Get answers about your rights, your case, and what comes next." | "Encuentra respuestas sobre tus derechos, tu caso y lo que viene." |
| 18–21 | "You've got questions about life after care. Here are real answers." | "Tienes preguntas sobre la vida después del cuidado. Aquí hay respuestas reales." |

### Compass greeting card body

| Band | EN | ES |
|------|----|----|
| 10–12 | "Hi, I'm Compass. Being in foster care can feel really confusing. I'm here to explain things in plain language — just tap a topic or search for what's on your mind." | "Hola, soy Compass. El cuidado adoptivo puede sentirse muy confuso. Estoy aquí para explicarte las cosas en palabras simples — solo toca un tema o busca lo que tienes en mente." |
| 13–15 | "Hi, I'm Compass. You deserve to know what's happening in your case and what rights you have. Pick a topic or search for anything — I'll give you straight answers." | "Hola, soy Compass. Mereces saber qué está pasando en tu caso y qué derechos tienes. Elige un tema o busca lo que quieras — te daré respuestas claras." |
| 16–17 | "Hi, I'm Compass. There's a lot happening right now — court, turning 18, figuring out what's next. Pick a topic below or search for what's on your mind." | "Hola, soy Compass. Hay mucho pasando ahora mismo — el tribunal, cumplir 18, descubrir qué sigue. Elige un tema o busca lo que tienes en mente." |
| 18–21 | "Hi, I'm Compass. You're navigating a lot right now. Whether it's housing, benefits, or just figuring out your options — you're not alone. Search or browse below." | "Hola, soy Compass. Estás manejando mucho ahora mismo. Ya sea vivienda, beneficios, o simplemente descubrir tus opciones — no estás solo/a. Busca o navega abajo." |

### Topic chips per age band

| Band | Topics shown |
|------|-------------|
| 10–12 | My Rights · My Case · Staying Safe · Who's in My Corner |
| 13–15 | My Rights · My Case · Court & Hearings · Staying Safe · Who's in My Corner |
| 16–17 | My Rights · My Case · Court & Hearings · Documents · Housing · Turning 18 |
| 18–21 | My Rights · Documents · Housing · Money & Benefits · Turning 18 · School & Work |

---

## Data Structure

New file: `web/src/data/questions.ts`

```ts
export interface QAEntry {
  id: string;
  question:   { en: string; es: string };
  answer:     { en: string; es: string };
  category:   QACategory;
  ageBands:   AgeBand[];          // which bands see this entry
  citations?: string[];           // e.g. ["A.R.S. §8-529"]
  relatedIds?: string[];          // IDs of related QAEntry items
}

export type QACategory =
  | "rights"
  | "case"
  | "court"
  | "safety"
  | "corner"      // "Who's in My Corner"
  | "documents"
  | "housing"
  | "turning18"
  | "benefits"
  | "school";

export type AgeBand = "10-12" | "13-15" | "16-17" | "18-21";
```

**Target volume:** ~50–60 entries at launch, covering the highest-frequency questions from each topic area. Each entry needs both EN and ES answers written in full (not machine-translated).

### Sample entries (illustrative — not final copy)

```ts
{
  id: "q-what-are-my-rights",
  question: {
    en: "What rights do I have in foster care?",
    es: "¿Qué derechos tengo en el cuidado adoptivo?"
  },
  answer: {
    en: "You have 22 legal rights under Arizona law (A.R.S. §8-529). These aren't just rules — they're guarantees that belong to you. Some of the big ones: you have the right to be treated with respect, to know what's in your case plan, to see your siblings (unless a judge says otherwise), and to keep your own belongings. If any of these feel like they're being ignored, you can ask your caseworker, then their supervisor, then the DCS ombudsman.",
    es: "Tienes 22 derechos legales bajo la ley de Arizona (A.R.S. §8-529). Estos no son solo reglas — son garantías que te pertenecen. Algunos de los más importantes: tienes derecho a ser tratado/a con respeto, a saber qué hay en tu plan de caso, a ver a tus hermanos (a menos que un juez diga lo contrario) y a conservar tus pertenencias."
  },
  category: "rights",
  ageBands: ["10-12", "13-15", "16-17", "18-21"],
  citations: ["A.R.S. §8-529"],
  relatedIds: ["q-rights-ignored", "q-case-plan"]
}
```

---

## Search Behavior

- **Library:** Fuse.js (client-side fuzzy search, no backend)
- **Indexed fields:** `question.en` + `answer.en` (or `es` depending on `lang`)
- **Filtered before indexing:** only entries matching the user's `ageBand`
- **Threshold:** 0.4 (permissive enough for typos, tight enough to avoid irrelevant results)
- **Result limit:** 8 results max
- **Empty state message:**
  - EN: "No results for '[query]' — try a different word, or browse the topics below."
  - ES: "Sin resultados para '[query]' — prueba otra palabra, o navega los temas abajo."
- Typing activates search mode and hides topic chips. Clearing the input returns to browse mode with the previously active chip still selected.

---

## Answer Panel

- Opens using the existing `Modal` component from `ui.tsx` — consistent with the rest of the app
- **Back link** (or modal close) returns to previous topic or search results — component state is sufficient, no browser history manipulation
- **Citation chips** are informational only (not links)
- **"Find resources near you" CTA** appears only when the answer's category has a matching resource category (e.g., `housing`, `benefits`). Links to `/[lang]/resources` — user arrives on a fresh resources page and can apply the filter themselves. URL-param-based pre-filtering is out of scope for this spec.
- **Related questions** shows up to 3 entries from `relatedIds`, filtered to the user's age band

---

## Navigation & Routing

- Route stays `/[lang]/ask` — no redirect needed
- `nav_ask` i18n key updated: `"Ask"` → `"Find Answers"` (EN) / `"Encontrar Respuestas"` (ES)
- Page `<title>` and meta description updated to match (youth-voice SEO, consistent with other pages)
- `useOnboardingGate(lang)` stays at the top of the page as-is

---

## What Is Removed

- `sendChatMessage` import and all chat state (`messages`, `loading`, `error`, `input`)
- The textarea input and Send button
- The "typing" loading indicator
- Crisis banner (crisis pins remain on the Home page; SafeNotice at bottom of this page is sufficient)
- Dependency on the `server/` backend for this page

---

## What Is Kept

- Compass avatar, name, and friendly intro (rewritten per age band)
- `ScreenHero` with teal gradient
- `SafeNotice` at the bottom
- `useOnboardingGate` guard
- Bilingual EN/ES (all strings in `i18n.ts` or inline per pattern)

---

## Files Touched

| File | Change |
|------|--------|
| `web/src/data/questions.ts` | **New** — ~50–60 Q&A entries |
| `web/src/app/[lang]/ask/page.tsx` | **Rewrite** — replace chat UI with Find Answers UI |
| `web/src/app/[lang]/ask/layout.tsx` | Update `<title>` and meta description |
| `web/src/lib/i18n.ts` | Update `nav_ask`, add search/empty-state strings, Compass intros |
| `web/package.json` | Add `fuse.js` dependency |

---

*Spec written from brainstorming session — approved by user 2026-04-05.*
