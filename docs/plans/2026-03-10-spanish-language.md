# Spanish Language Experience Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Compass fully bilingual (English/Spanish) so that a user who selects Español at onboarding receives AI responses, static content, and all UI copy in Spanish.

**Architecture:** Three-layer approach: (1) backend wires `language` through the RAG pipeline so Claude always responds in the user's language; (2) backend knowledge chunks get `text_es` fields so retrieved context is served in Spanish; (3) frontend gets a lightweight `t()` i18n helper covering all static UI strings and structured content (RIGHTS tiers, COURT_STAGES descriptions). No third-party i18n library needed — the app is small enough for a single `UI_STRINGS` constant.

**Tech Stack:** TypeScript, Express, lunr (existing), React 19, Tailwind CSS v4. No new dependencies.

---

## Chunk 1: Backend — Wire Language Through the Chat Pipeline

This chunk makes the AI respond in Spanish. No new translations needed yet — Claude is natively bilingual and will respond in Spanish when instructed. This is the smallest change that gives Spanish speakers a real experience.

**Files:**
- Modify: `server/src/types/index.ts` (add `text_es` to `KnowledgeChunk`)
- Modify: `server/src/rag/prompt.ts` (accept `language`, add Spanish tone instructions)
- Modify: `server/src/rag/retriever.ts` (accept `language`, return `text_es` when available)
- Modify: `server/src/routes/chat.ts` (pass `language` to `retrieve()` and `buildPrompt()`)
- Modify: `server/src/middleware/crisis.ts` (add Spanish crisis patterns + bilingual response)
- Test: `server/src/rag/prompt.test.ts` (new)
- Test: `server/src/middleware/crisis.test.ts` (new)

### Task 1: Add `text_es` to KnowledgeChunk type

**Files:**
- Modify: `server/src/types/index.ts:33-39`

- [ ] **Step 1: Write a failing test for type shape**

```typescript
// server/src/types/index.test.ts (new file)
import { describe, it, expect } from 'vitest'
import type { KnowledgeChunk } from './index.js'

describe('KnowledgeChunk', () => {
  it('accepts text_es field', () => {
    const chunk: KnowledgeChunk = {
      id: 'test',
      text: 'English text',
      text_es: 'Spanish text',
      citation: 'A.R.S. §8-529',
      tags: ['rights'],
      ageBands: ['16-17'],
    }
    expect(chunk.text_es).toBe('Spanish text')
  })

  it('text_es is optional', () => {
    const chunk: KnowledgeChunk = {
      id: 'test',
      text: 'English text',
      citation: 'A.R.S. §8-529',
      tags: ['rights'],
      ageBands: ['16-17'],
    }
    expect(chunk.text_es).toBeUndefined()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd server && npm test
```
Expected: TS compile error — `text_es` does not exist on `KnowledgeChunk`

- [ ] **Step 3: Add `text_es` to the type**

```typescript
// server/src/types/index.ts — modify KnowledgeChunk
export interface KnowledgeChunk {
  id: string
  text: string        // English text to index and retrieve
  text_es?: string    // Spanish translation — if absent, falls back to English
  citation: string
  tags: string[]
  ageBands: AgeBand[]
}
```

- [ ] **Step 4: Run tests to verify passing**

```bash
cd server && npm test
```
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add server/src/types/index.ts server/src/types/index.test.ts
git commit -m "feat(types): add optional text_es field to KnowledgeChunk"
```

---

### Task 2: Update `buildPrompt()` to accept `language` and add Spanish tone instructions

**Files:**
- Modify: `server/src/rag/prompt.ts`
- Create: `server/src/rag/prompt.test.ts`

- [ ] **Step 1: Write failing tests**

```typescript
// server/src/rag/prompt.test.ts
import { describe, it, expect } from 'vitest'
import { buildPrompt } from './prompt.js'

const mockChunks = [{
  id: 'r1',
  text: 'You have the right to participate in your case plan.',
  text_es: 'Tienes el derecho de participar en tu plan de caso.',
  citation: 'A.R.S. §8-529(A)(7)',
  tags: ['rights'],
  ageBands: ['13-15' as const],
}]

describe('buildPrompt', () => {
  it('returns English prompt when language is en', () => {
    const prompt = buildPrompt('What are my rights?', '13-15', mockChunks, 'en')
    expect(prompt).toContain('Answer in English')
    expect(prompt).toContain('You have the right to participate')
  })

  it('returns Spanish prompt when language is es', () => {
    const prompt = buildPrompt('¿Cuáles son mis derechos?', '13-15', mockChunks, 'es')
    expect(prompt).toContain('Responde en español')
    expect(prompt).toContain('Tienes el derecho de participar')
  })

  it('falls back to English text_es when text_es is missing', () => {
    const chunksNoEs = [{ ...mockChunks[0], text_es: undefined }]
    const prompt = buildPrompt('¿Cuáles son mis derechos?', '13-15', chunksNoEs, 'es')
    expect(prompt).toContain('You have the right to participate')
  })
})
```

- [ ] **Step 2: Run tests to confirm failure**

```bash
cd server && npm test -- prompt
```
Expected: FAIL — `buildPrompt` expects 3 args, not 4

- [ ] **Step 3: Update `buildPrompt()` to accept and use `language`**

```typescript
// server/src/rag/prompt.ts — full replacement

import type { AgeBand, KnowledgeChunk, Language } from '../types/index.js'

const TONE_BY_BAND: Record<AgeBand, string> = {
  '10-12': `
- Write like you're a kind older sibling who wants to help.
- Use simple words — nothing harder than 4th-grade level. Short sentences only.
- Always start by saying something warm that shows you understand what they're going through.
- Say "you" a lot. Make them feel seen and not alone.
- Never use legal terms without explaining them in the same sentence using everyday words.
- Example opening: "That's a really important question. Here's what you should know..."`.trim(),

  '13-15': `
- Write like a trusted adult who takes them seriously and explains things clearly.
- Use plain, everyday language — 6th-grade level. No jargon without an explanation right after.
- Acknowledge upfront that navigating the foster care system is genuinely hard.
- Be warm and direct. Give them real, useful steps they can actually take.
- Example opening: "Great question — this comes up a lot. Here's what's going on and what you can do..."`.trim(),

  '16-17': `
- Speak to them as a capable young person who deserves straight answers.
- Be warm but real — acknowledge that their situation may feel overwhelming or unfair.
- Use clear language with concrete action steps, names of programs, and phone numbers.
- Validate that asking questions and knowing their rights is smart and brave.
- Example opening: "You deserve to know this. Here's the full picture..."`.trim(),

  '18-21': `
- Treat them as a capable adult who has been through a lot and needs real information.
- Be warm, direct, and complete. Include deadlines, program names, and specific next steps.
- Acknowledge the challenges of aging out — it's a genuinely hard transition.
- Example opening: "Here's everything you need to know about this..."`.trim(),
}

const TONE_BY_BAND_ES: Record<AgeBand, string> = {
  '10-12': `
- Escribe como un hermano mayor amable que quiere ayudar.
- Usa palabras sencillas — nivel de 4º grado o menos. Oraciones cortas.
- Comienza con algo cálido que muestre que entiendes lo que están viviendo.
- Di "tú" mucho. Haz que se sientan vistos y no solos.
- No uses términos legales sin explicarlos enseguida con palabras del día a día.
- Ejemplo de inicio: "Esa es una pregunta muy importante. Esto es lo que debes saber..."`.trim(),

  '13-15': `
- Escribe como un adulto de confianza que los toma en serio y explica las cosas con claridad.
- Usa un lenguaje sencillo y cotidiano — nivel de 6º grado. Sin jerga sin explicación inmediata.
- Reconoce desde el principio que navegar el sistema de cuidado adoptivo es genuinamente difícil.
- Sé cálido y directo. Dales pasos reales y útiles que puedan tomar.
- Ejemplo de inicio: "Buena pregunta — esto surge mucho. Esto es lo que pasa y lo que puedes hacer..."`.trim(),

  '16-17': `
- Háblales como a un joven capaz que merece respuestas directas.
- Sé cálido pero real — reconoce que su situación puede sentirse abrumadora o injusta.
- Usa lenguaje claro con pasos de acción concretos, nombres de programas y números de teléfono.
- Valida que hacer preguntas y conocer sus derechos es inteligente y valiente.
- Ejemplo de inicio: "Mereces saber esto. Aquí está el panorama completo..."`.trim(),

  '18-21': `
- Trátales como a un adulto capaz que ha pasado por mucho y necesita información real.
- Sé cálido, directo y completo. Incluye plazos, nombres de programas y próximos pasos específicos.
- Reconoce los desafíos de cumplir 18 — es una transición genuinamente difícil.
- Ejemplo de inicio: "Aquí está todo lo que necesitas saber sobre esto..."`.trim(),
}

export function buildPrompt(
  userMessage: string,
  ageBand: AgeBand,
  chunks: KnowledgeChunk[],
  language: Language = 'en'
): string {
  const isSpanish = language === 'es'
  const toneInstruction = isSpanish ? TONE_BY_BAND_ES[ageBand] : TONE_BY_BAND[ageBand]
  const languageInstruction = isSpanish
    ? 'Responde en español. Si citas una fuente, mantén la referencia legal en inglés (ej. A.R.S. §8-529) pero explica el contenido en español.'
    : 'Answer in English.'

  const contextBlock =
    chunks.length > 0
      ? chunks
          .map((c) => {
            const text = isSpanish && c.text_es ? c.text_es : c.text
            return `[Source: ${c.citation}]\n${text}`
          })
          .join('\n\n')
      : isSpanish
        ? 'No se encontró contenido específico de la base de conocimientos para esta consulta.'
        : 'No specific knowledge base content found for this query.'

  const compassName = isSpanish ? 'Compass' : 'Compass'
  const intro = isSpanish
    ? `Eres ${compassName} — un asistente para jóvenes en cuidado adoptivo en Arizona. Tu trabajo es dar información clara, compasiva y honesta a jóvenes que navegan un sistema complicado. Muchos de ellos se sienten asustados, confundidos o solos. Tu tono siempre debe sentirse cálido y humano, nunca robótico o frío.`
    : `You are ${compassName} — a helper for young people in Arizona foster care. Your job is to give clear, caring, honest information to youth who are navigating a complicated system. Many of them feel scared, confused, or alone. Your tone should always feel warm and human, never robotic or cold.`

  const rules = isSpanish
    ? `REGLAS:
- Responde SOLO preguntas sobre cuidado adoptivo en Arizona, derechos de jóvenes, el proceso del tribunal de dependencia, recursos y temas relacionados.
- Comienza tu respuesta con una frase cálida y empática que reconozca la pregunta o la situación — antes de dar cualquier información.
- Usa "tú" en todo momento. Escribe directamente a la persona, no sobre ella.
- Cada afirmación legal o factual DEBE citar una fuente de la base de conocimientos. Formato: (Fuente: <cita>)
- Si algo no está en la base de conocimientos, sé honesto: di que no tienes esa información, luego indícales al 211 Arizona (llamar o enviar mensaje de texto al 211) o a su trabajador de casos.
- NO des consejos legales ni médicos. Compartes información, no orientación profesional.
- Usa - para listas con viñetas. Usa **negrita** para las palabras o pasos más importantes. NO uses encabezados # o ##.
- Sé conciso. No te repitas. Termina de forma natural — no necesitas despedida.
- NO termines con un párrafo de descargo. En cambio, si el tema involucra decisiones legales o médicas, incorpora una breve línea como: "*Para tu situación específica, habla con tu abogado o trabajador de casos.*"`
    : `RULES:
- Answer ONLY questions about Arizona foster care, youth rights, the dependency court process, resources, and related topics.
- Start your response with a warm, empathetic sentence that acknowledges the question or the situation — before giving any information.
- Use "you" throughout. Write directly to the person, not about them.
- Every factual or legal claim MUST cite a source from the knowledge base. Format: (Source: <citation>)
- If something isn't in the knowledge base, be honest: say you don't have that info, then point them to 211 Arizona (call or text 211) or their caseworker.
- Do NOT provide legal or medical advice. You share information, not professional guidance.
- Use - for bullet lists. Use **bold** for the most important words or steps. Do NOT use # or ## headings.
- Keep it concise. Don't repeat yourself. End naturally — no sign-off needed.
- Do NOT end with a disclaimer paragraph. Instead, if the topic involves legal or medical decisions, weave in one brief line like: "*For your specific situation, talk to your attorney or caseworker.*"`

  const kbLabel = isSpanish ? 'BASE DE CONOCIMIENTOS' : 'KNOWLEDGE BASE'
  const questionLabel = isSpanish ? 'PREGUNTA' : 'QUESTION'
  const answerLabel = isSpanish ? 'Respuesta' : 'Answer'
  const toneHeader = isSpanish
    ? 'INSTRUCCIONES DE TONO PARA EL GRUPO DE EDAD DE ESTE USUARIO'
    : "TONE INSTRUCTIONS FOR THIS USER'S AGE GROUP"

  return `${intro}

${languageInstruction}

${toneHeader}:
${toneInstruction}

${rules}

${kbLabel}:
${contextBlock}

${questionLabel}: ${userMessage}

${answerLabel}:`
}
```

- [ ] **Step 4: Run tests to confirm passing**

```bash
cd server && npm test -- prompt
```
Expected: PASS (all 3 tests)

- [ ] **Step 5: Commit**

```bash
git add server/src/rag/prompt.ts server/src/rag/prompt.test.ts
git commit -m "feat(rag): add Spanish language support to buildPrompt"
```

---

### Task 3: Update `retriever.ts` to accept `language` parameter

**Files:**
- Modify: `server/src/rag/retriever.ts`
- Create: `server/src/rag/retriever.test.ts`

Note: lunr indexes English text only. For Spanish users, we retrieve using English index (citation keywords, program names, and cognates still match) but return `text_es` when available. This is a sound MVP trade-off — Claude handles bilingual queries well.

- [ ] **Step 1: Write failing test**

```typescript
// server/src/rag/retriever.test.ts
import { describe, it, expect } from 'vitest'
import { retrieve } from './retriever.js'

describe('retrieve', () => {
  it('returns English text for en language', () => {
    const results = retrieve('siblings contact visit', '13-15', 5, 'en')
    expect(results.length).toBeGreaterThan(0)
    // All returned chunks should have text field
    results.forEach(c => expect(c.text).toBeTruthy())
  })

  it('returns results for es language (English index, Spanish-capable Claude)', () => {
    // Retrieval still works for es — index is English but cognates/citations match
    const results = retrieve('siblings contact visit', '13-15', 5, 'es')
    expect(results.length).toBeGreaterThan(0)
  })

  it('accepts language parameter without error', () => {
    expect(() => retrieve('rights', '16-17', 3, 'es')).not.toThrow()
    expect(() => retrieve('rights', '16-17', 3, 'en')).not.toThrow()
  })
})
```

- [ ] **Step 2: Run tests to confirm failure**

```bash
cd server && npm test -- retriever
```
Expected: FAIL — `retrieve` doesn't accept 4th argument

- [ ] **Step 3: Update `retriever.ts` to accept optional `language` parameter**

```typescript
// server/src/rag/retriever.ts — full replacement
import lunr from 'lunr'
import { ALL_CHUNKS } from './chunks.js'
import type { AgeBand, KnowledgeChunk, Language } from '../types/index.js'

const index = lunr(function () {
  this.ref('id')
  this.field('text', { boost: 2 })
  this.field('tags')
  this.field('citation')

  ALL_CHUNKS.forEach((chunk) => {
    this.add({
      id: chunk.id,
      text: chunk.text,
      tags: chunk.tags.join(' '),
      citation: chunk.citation,
    })
  })
})

const chunkById = new Map<string, KnowledgeChunk>(
  ALL_CHUNKS.map((c) => [c.id, c])
)

export function retrieve(
  query: string,
  ageBand: AgeBand,
  maxResults = 5,
  _language: Language = 'en'   // reserved — index is English; language used by prompt layer
): KnowledgeChunk[] {
  let results: lunr.Index.Result[]
  try {
    results = index.search(query)
  } catch {
    return []
  }

  return results
    .map((r) => chunkById.get(r.ref))
    .filter((c): c is KnowledgeChunk => c !== undefined && c.ageBands.includes(ageBand))
    .slice(0, maxResults)
}
```

- [ ] **Step 4: Run tests to confirm passing**

```bash
cd server && npm test -- retriever
```
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add server/src/rag/retriever.ts server/src/rag/retriever.test.ts
git commit -m "feat(rag): add language param to retrieve() for future bilingual index"
```

---

### Task 4: Wire `language` through `chat.ts` route

**Files:**
- Modify: `server/src/routes/chat.ts:26-45`

- [ ] **Step 1: Write a failing integration test**

```typescript
// server/src/routes/chat.test.ts (new)
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock Claude to avoid API calls in tests
vi.mock('../rag/claude.js', () => ({
  generateResponse: vi.fn().mockResolvedValue('Mocked response'),
}))

import request from 'supertest'
import app from '../index.js'  // We'll need to export app — see note below

describe('POST /api/chat', () => {
  it('passes language=es to the pipeline without error', async () => {
    const res = await request(app).post('/api/chat').send({
      message: '¿Cuáles son mis derechos?',
      ageBand: '13-15',
      language: 'es',
    })
    expect(res.status).toBe(200)
    expect(res.body.reply).toBeTruthy()
  })

  it('defaults to en when language omitted', async () => {
    const res = await request(app).post('/api/chat').send({
      message: 'What are my rights?',
      ageBand: '13-15',
    })
    expect(res.status).toBe(200)
    expect(res.body.reply).toBeTruthy()
  })
})
```

> **Note on `app` export**: `server/src/index.ts` likely starts the server in the same file. Check if `app` is exported; if not, refactor slightly to `export const app = express()` before `app.listen()`. This is needed for supertest.

- [ ] **Step 2: Check if `app` is exported from `server/src/index.ts`**

```bash
grep -n "export" server/src/index.ts
```
If not exported, add `export { app }` before `app.listen()`.

- [ ] **Step 3: Install supertest if needed**

```bash
cd server && npm install --save-dev supertest @types/supertest
```

- [ ] **Step 4: Run tests to confirm failure**

```bash
cd server && npm test -- routes/chat
```
Expected: FAIL (language not wired through)

- [ ] **Step 5: Update `chat.ts` to pass language to retrieve and buildPrompt**

```typescript
// server/src/routes/chat.ts — updated lines 25-45 (destructure + pass language)
  const { message, ageBand, language } = parsed.data

  // Crisis check first — always, before any AI call
  if (detectCrisis(message)) {
    const crisisReply = language === 'es'
      ? 'Soy una herramienta que proporciona información. No puedo brindarte el apoyo que necesitas ahora mismo. Aquí hay personas que pueden ayudarte — por favor comunícate con ellas.'
      : "I'm a tool that provides information. I'm not able to provide the kind of support you need right now. Here are people who can help you — please reach out to them."
    const response: ChatResponse = {
      reply: crisisReply,
      citations: [],
      isCrisis: true,
      crisisResources: CRISIS_RESOURCES,
    }
    res.json(response)
    return
  }

  // Retrieve relevant knowledge chunks
  const chunks = retrieve(message, ageBand, 5, language)

  // Build age-adaptive, language-aware prompt
  const prompt = buildPrompt(message, ageBand, chunks, language)
```

- [ ] **Step 6: Run tests to confirm passing**

```bash
cd server && npm test
```
Expected: All tests PASS

- [ ] **Step 7: Commit**

```bash
git add server/src/routes/chat.ts server/src/routes/chat.test.ts server/src/index.ts
git commit -m "feat(chat): wire language through retrieve and buildPrompt"
```

---

### Task 5: Add Spanish crisis detection patterns

**Files:**
- Modify: `server/src/middleware/crisis.ts`
- Create: `server/src/middleware/crisis.test.ts`

- [ ] **Step 1: Write failing tests**

```typescript
// server/src/middleware/crisis.test.ts
import { describe, it, expect } from 'vitest'
import { detectCrisis } from './crisis.js'

describe('detectCrisis — English', () => {
  it('detects suicide', () => expect(detectCrisis('I want to kill myself')).toBe(true))
  it('detects self-harm', () => expect(detectCrisis('I am cutting myself')).toBe(true))
  it('returns false for normal message', () => expect(detectCrisis('What are my rights?')).toBe(false))
})

describe('detectCrisis — Spanish', () => {
  it('detects suicidio', () => expect(detectCrisis('quiero suicidarme')).toBe(true))
  it('detects hacerme daño', () => expect(detectCrisis('quiero hacerme daño')).toBe(true))
  it('detects quitarme la vida', () => expect(detectCrisis('quiero quitarme la vida')).toBe(true))
  it('detects no quiero vivir', () => expect(detectCrisis('no quiero vivir más')).toBe(true))
  it('detects me están golpeando', () => expect(detectCrisis('me están golpeando en el hogar')).toBe(true))
  it('detects estoy en peligro', () => expect(detectCrisis('estoy en peligro')).toBe(true))
  it('detects no estoy seguro', () => expect(detectCrisis('no estoy seguro ahora mismo')).toBe(true))
  it('returns false for normal Spanish message', () => expect(detectCrisis('¿cuáles son mis derechos?')).toBe(false))
})
```

- [ ] **Step 2: Run tests to confirm Spanish patterns fail**

```bash
cd server && npm test -- crisis
```
Expected: English tests PASS, Spanish tests FAIL

- [ ] **Step 3: Add Spanish patterns to `crisis.ts`**

Add these patterns to `CRISIS_PATTERNS` array in `server/src/middleware/crisis.ts`:

```typescript
  // Spanish patterns
  /\bsuicid(io|arme|arse|arte)?\b/i,
  /\bquitarme\s+la\s+vida\b/i,
  /\bno\s+quiero\s+vivir\b/i,
  /\bhacerme\s+da[ñn]o\b/i,
  /\bda[ñn]arme\b/i,
  /\bcortarme\b/i,
  /\bme\s+est[áa]n?\s+(golpeando|pegando|abusando|maltratando)\b/i,
  /\bestoy\s+en\s+peligro\b/i,
  /\bno\s+estoy\s+segur[oa]\b/i,
  /\bayu[dh]a\s*(me|nos)?\s+ahora\b/i,
```

- [ ] **Step 4: Run tests to confirm all passing**

```bash
cd server && npm test -- crisis
```
Expected: All PASS

- [ ] **Step 5: Commit**

```bash
git add server/src/middleware/crisis.ts server/src/middleware/crisis.test.ts
git commit -m "feat(crisis): add Spanish language crisis detection patterns"
```

---

## Chunk 2: Backend — Translate Knowledge Chunks

Add `text_es` to all 48 knowledge chunks (22 rights + 13 court + 13 resource/transition chunks). The Spanish text should preserve legal citations in English (e.g. `A.R.S. §8-529`) while translating surrounding content. Maximum 6th-grade reading level in Spanish.

> **Translation philosophy:** Use plain, accessible Mexican Spanish (the dominant dialect in AZ — 39.4% of AZ foster youth are Hispanic). Avoid Castilian idioms. Preserve proper nouns (DCS, CASA, GAL, EFC, ETV, ICWA, 211) in English.

### Task 6: Translate rights.ts chunks

**Files:**
- Modify: `server/src/data/rights.ts`

- [ ] **Step 1: Add `text_es` to all 22 rights chunks**

Open `server/src/data/rights.ts`. For each chunk, add `text_es` after the `text` field. Example:

```typescript
  {
    id: 'right-dignity',
    text: 'You have the right to be treated with dignity, respect, and consideration as a person in foster care. No one can treat you as less because you are in the system.',
    text_es: 'Tienes el derecho de ser tratado con dignidad, respeto y consideración como persona en cuidado adoptivo. Nadie puede tratarte como menos por estar en el sistema.',
    citation: 'A.R.S. §8-529(A)(1)',
    tags: ['rights', 'safety', 'dignity'],
    ageBands: ['10-12', '13-15', '16-17', '18-21'],
  },
```

Complete translations for all 22 chunks. Key terms to preserve in English: DCS, CASA, GAL, caseworker, Ombudsman, DCS hotline, ALWAYS. Key terms to translate: foster care → cuidado adoptivo, case plan → plan de caso, sibling → hermano/hermana, placement → colocación, attorney → abogado.

- [ ] **Step 2: Spot-check by running server and sending a Spanish request**

```bash
cd server && npm run dev
# In another terminal:
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"¿Cuáles son mis derechos?","ageBand":"13-15","language":"es"}'
```
Expected: JSON with `reply` in Spanish, `citations` array populated

- [ ] **Step 3: Commit**

```bash
git add server/src/data/rights.ts
git commit -m "feat(data): add Spanish translations to rights knowledge chunks"
```

---

### Task 7: Translate court.ts chunks

**Files:**
- Modify: `server/src/data/court.ts`

- [ ] **Step 1: Add `text_es` to all 13 court chunks**

Same pattern as rights. Preserve proper nouns: TDM, PPH, ICWA, GAL, DCS. Translate: dependency → dependencia, hearing → audiencia, petition → petición, judge → juez, removal → remoción/separación (use "separación" — more trauma-informed).

Example:
```typescript
  {
    id: 'court-pph',
    text: 'Stage 3 — Preliminary Protective Hearing (PPH). Within 5–7 days of removal, the court holds this first hearing...',
    text_es: 'Etapa 3 — Audiencia Preliminar de Protección (PPH). Dentro de los 5 a 7 días después de la separación, el tribunal celebra esta primera audiencia. El juez decide si DCS tuvo buenas razones para separarte y si debes seguir en cuidado adoptivo mientras continúa el caso. Aquí se nombra tu GAL o abogado. Tienes derecho a asistir.',
    citation: 'A.R.S. §8-824',
    tags: ['court', 'PPH', 'preliminary protective hearing', 'hearing', 'GAL', 'judge', 'stage 3'],
    ageBands: ['10-12', '13-15', '16-17', '18-21'],
  },
```

- [ ] **Step 2: Spot-check**

```bash
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"¿Qué pasa en la primera audiencia?","ageBand":"14-15","language":"es"}'
```

- [ ] **Step 3: Commit**

```bash
git add server/src/data/court.ts
git commit -m "feat(data): add Spanish translations to court knowledge chunks"
```

---

### Task 8: Translate resources.ts and transition chunks

**Files:**
- Modify: `server/src/data/resources.ts`

- [ ] **Step 1: Add `text_es` to all chunks**

Resource chunks describe programs (EFC, ETV, AHCCCS, etc.). Translate descriptions but keep program names, phone numbers, and acronyms in English.

Example:
```typescript
  {
    id: 'transition-efc',
    text: 'Extended Foster Care (EFC) lets youth stay in foster care after their 18th birthday until age 21...',
    text_es: 'El Cuidado Adoptivo Extendido (EFC) permite que los jóvenes permanezcan en cuidado adoptivo después de cumplir 18 años hasta los 21...',
    citation: 'A.R.S. §8-521.02',
    tags: ['transition', 'EFC', 'extended care', '18+'],
    ageBands: ['16-17', '18-21'],
  },
```

- [ ] **Step 2: Commit**

```bash
git add server/src/data/resources.ts
git commit -m "feat(data): add Spanish translations to resources and transition chunks"
```

---

## Chunk 3: Frontend — i18n Infrastructure

This chunk adds a `t()` translation helper and `UI_STRINGS` constant to the frontend, then applies it to all nav, onboarding, and Home screen text. Future chunks apply to remaining screens.

The approach is intentionally minimal: no i18n library, just a typed constant and a one-liner helper. For a single-language toggle app this is the right complexity level.

**Files:**
- Modify: `app/src/FosterGuideAZPrototype.tsx`

### Task 9: Add `UI_STRINGS` constant and `t()` helper

**Files:**
- Modify: `app/src/FosterGuideAZPrototype.tsx` — add near top, after imports

- [ ] **Step 1: Add the `UI_STRINGS` constant and `t()` helper**

Insert after the `import` block, before `const COUNTIES`:

```typescript
// ─── i18n ─────────────────────────────────────────────────────────────────
type Lang = 'en' | 'es'

const UI_STRINGS = {
  // Onboarding
  onboarding_step_language:    { en: 'What language do you prefer?', es: '¿Qué idioma prefieres?' },
  onboarding_step_age:         { en: 'How old are you?',            es: '¿Cuántos años tienes?' },
  onboarding_step_county:      { en: 'What county do you live in?', es: '¿En qué condado vives?' },
  onboarding_step_tribal:      { en: 'Are you affiliated with a tribal nation?', es: '¿Estás afiliado a una nación tribal?' },
  onboarding_btn_next:         { en: 'Next',                        es: 'Siguiente' },
  onboarding_btn_start:        { en: "Let's go",                    es: 'Comenzar' },
  onboarding_btn_skip:         { en: 'Skip',                        es: 'Omitir' },
  onboarding_tribal_yes:       { en: 'Yes',                         es: 'Sí' },
  onboarding_tribal_no:        { en: 'No',                          es: 'No' },
  age_band_10_12_desc:         { en: 'Learn the basics',            es: 'Aprende lo básico' },
  age_band_13_15_desc:         { en: 'Your rights + court',         es: 'Tus derechos + tribunal' },
  age_band_16_17_desc:         { en: 'Planning ahead',              es: 'Planifica el futuro' },
  age_band_18_21_desc:         { en: 'Extended care + next steps',  es: 'Cuidado extendido + próximos pasos' },

  // Nav bar labels
  nav_home:      { en: 'Home',      es: 'Inicio' },
  nav_case:      { en: 'My Case',   es: 'Mi Caso' },
  nav_ask:       { en: 'Ask',       es: 'Preguntar' },
  nav_rights:    { en: 'My Rights', es: 'Mis Derechos' },
  nav_future:    { en: 'My Future', es: 'Mi Futuro' },
  nav_resources: { en: 'Resources', es: 'Recursos' },
  nav_wellness:  { en: 'Wellness',  es: 'Bienestar' },

  // Home screen
  home_greeting_morning:  { en: 'Good morning',   es: 'Buenos días' },
  home_greeting_afternoon: { en: 'Good afternoon', es: 'Buenas tardes' },
  home_greeting_evening:  { en: 'Good evening',   es: 'Buenas noches' },
  home_subtitle:          { en: 'Your guide through the Arizona foster care system.', es: 'Tu guía en el sistema de cuidado adoptivo de Arizona.' },
  home_crisis_title:      { en: 'Crisis & Safety Lines', es: 'Líneas de Crisis y Seguridad' },
  home_crisis_always_open: { en: 'Always open', es: 'Siempre disponibles' },

  // Rights screen
  rights_title:           { en: 'Your Rights', es: 'Tus Derechos' },
  rights_tab_what:        { en: 'What it means',    es: 'Qué significa' },
  rights_tab_how:         { en: 'How to ask for it', es: 'Cómo pedirlo' },
  rights_tab_ignored:     { en: "If it's being ignored", es: 'Si lo están ignorando' },
  rights_escalation_title: { en: 'If Your Rights Are Being Violated', es: 'Si Están Violando Tus Derechos' },

  // Case screen
  case_title:             { en: 'My Case', es: 'Mi Caso' },

  // Future screen
  future_title:           { en: 'My Future', es: 'Mi Futuro' },

  // Resources screen
  resources_title:        { en: 'Resources', es: 'Recursos' },
  resources_search_placeholder: { en: 'Search resources…', es: 'Buscar recursos…' },
  resources_spanish_label: { en: 'Spanish-speaking staff', es: 'Personal que habla español' },

  // Ask/Chat screen
  ask_title:              { en: 'Ask Compass', es: 'Pregúntale a Compass' },
  ask_placeholder:        { en: 'Type your question…', es: 'Escribe tu pregunta…' },
  ask_send:               { en: 'Send', es: 'Enviar' },
  ask_thinking:           { en: 'Thinking…', es: 'Pensando…' },
  ask_crisis_header:      { en: 'Here are people who can help you right now:', es: 'Aquí hay personas que pueden ayudarte ahora mismo:' },

  // Wellness screen
  wellness_title:         { en: 'Wellness Check-In', es: 'Chequeo de Bienestar' },

  // Common
  common_call:            { en: 'Call', es: 'Llamar' },
  common_text:            { en: 'Text', es: 'Mensaje' },
  common_website:         { en: 'Website', es: 'Sitio web' },
  common_learn_more:      { en: 'Learn more', es: 'Más información' },
} as const

type StringKey = keyof typeof UI_STRINGS

function t(key: StringKey, lang: Lang): string {
  return UI_STRINGS[key][lang]
}
```

- [ ] **Step 2: Read through `FosterGuideAZPrototype.tsx` to confirm no existing `t()` or `UI_STRINGS` declaration conflicts**

```bash
grep -n "function t\b\|const UI_STRINGS\|const t " app/src/FosterGuideAZPrototype.tsx | head -5
```
Expected: No matches.

- [ ] **Step 3: Verify the app still compiles (TypeScript type check)**

```bash
cd app && npm run build -- --noEmit 2>&1 | head -30
```
Expected: No errors relating to `t` or `UI_STRINGS`.

- [ ] **Step 4: Commit**

```bash
git add app/src/FosterGuideAZPrototype.tsx
git commit -m "feat(i18n): add UI_STRINGS constant and t() helper to frontend"
```

---

### Task 10: Apply `t()` to onboarding and nav bar

**Files:**
- Modify: `app/src/FosterGuideAZPrototype.tsx` — `OnboardingFlow` component and `TabBar` component

- [ ] **Step 1: Replace hardcoded strings in `OnboardingFlow`**

In the `OnboardingFlow` component, replace all hardcoded English strings with `t(key, prefs.language ?? 'en')` calls. Key replacements:

```typescript
// Before:
"What language do you prefer?"
// After:
{t('onboarding_step_language', prefs.language ?? 'en')}

// Before (age band descriptions):
b.id === "10-12" ? "Learn the basics" : ...
// After:
b.id === "10-12"
  ? t('age_band_10_12_desc', prefs.language ?? 'en')
  : b.id === "13-15"
    ? t('age_band_13_15_desc', prefs.language ?? 'en')
    : b.id === "16-17"
      ? t('age_band_16_17_desc', prefs.language ?? 'en')
      : t('age_band_18_21_desc', prefs.language ?? 'en')

// Next/Start button:
{step < 3 ? t('onboarding_btn_next', lang) : t('onboarding_btn_start', lang)}
```

> Note: In step 0 (language selection), `prefs.language` may be null. Default to 'en' for all text in step 0.

- [ ] **Step 2: Replace hardcoded strings in `TabBar`**

```typescript
// Before:
{ id: "home", label: "Home", ... }
// After:
{ id: "home", label: t('nav_home', prefs.language ?? 'en'), ... }
// (repeat for all 6 tabs)
```

- [ ] **Step 3: Build to confirm no TS errors**

```bash
cd app && npm run build -- --noEmit 2>&1 | head -30
```
Expected: No errors.

- [ ] **Step 4: Manual smoke test — toggle language in onboarding**

Run `cd app && npm run dev`, open http://localhost:5173, select Español in step 0. Verify onboarding text switches to Spanish.

- [ ] **Step 5: Commit**

```bash
git add app/src/FosterGuideAZPrototype.tsx
git commit -m "feat(i18n): apply t() to onboarding flow and nav bar labels"
```

---

## Chunk 4: Frontend — Translate Static Screen Content

### Task 11: Apply `t()` to Home, Rights escalation, and Resources screens

**Files:**
- Modify: `app/src/FosterGuideAZPrototype.tsx` — `HomeScreen`, `RightsScreen`, `ResourcesScreen`

- [ ] **Step 1: Apply `t()` to `HomeScreen`**

Replace: greeting text, subtitle, "Crisis & Safety Lines" heading, "Always open" label, all hardcoded button labels (Call, Text, Website).

- [ ] **Step 2: Apply `t()` to `RightsScreen`**

Replace: "Your Rights" heading, Rights Hero subtitle (in `RIGHTS_HERO_SUBTITLE`), tab labels ("What it means", "How to ask for it", "If it's being ignored"), escalation section heading, escalation step descriptions.

The `RIGHTS_HERO_SUBTITLE` constant should become a bilingual object:
```typescript
const RIGHTS_HERO_SUBTITLE: Record<AgeBandKey, { en: string; es: string }> = {
  '10-12': {
    en: 'You have rights just by being in foster care. Here's what they mean for you.',
    es: 'Tienes derechos solo por estar en cuidado adoptivo. Aquí está lo que significan para ti.',
  },
  // ... etc
}
```

Then render: `{RIGHTS_HERO_SUBTITLE[prefs.ageBand ?? '13-15'][prefs.language ?? 'en']}`

- [ ] **Step 3: Apply `t()` to `ResourcesScreen`**

Replace: screen title, search placeholder, "Spanish-speaking staff" badge, filter chip labels, Call/Text/Website button labels.

- [ ] **Step 4: Build and smoke test**

```bash
cd app && npm run build -- --noEmit
```
Then open the app in Spanish and verify Rights and Resources screens render correctly.

- [ ] **Step 5: Commit**

```bash
git add app/src/FosterGuideAZPrototype.tsx
git commit -m "feat(i18n): translate Home, Rights, and Resources screen UI strings"
```

---

### Task 12: Translate RIGHTS tier content (static text in cards)

**Files:**
- Modify: `app/src/FosterGuideAZPrototype.tsx` — `RIGHTS` constant

The `RIGHTS` array has per-tier content (plain, example, howToAsk, ifIgnored). These need bilingual fields. Add `plain_es`, `example_es`, `howToAsk_es`, `ifIgnored_es` fields per tier.

The `RightCard` component then renders: `tier.plain_es ?? tier.plain` when language is 'es'. This graceful fallback means the app still works for any tier that hasn't been translated yet.

- [ ] **Step 1: Add bilingual fields to `RIGHTS` tiers for "participate" right**

Example structure:
```typescript
  "10-12": {
    plain: "The adults in your case are supposed to listen to what you need...",
    plain_es: "Los adultos en tu caso deben escuchar lo que necesitas y lo que es importante para ti. Tu voz importa.",
    example: "You can tell your caseworker what helps you feel safe...",
    example_es: "Puedes decirle a tu trabajador de casos lo que te ayuda a sentirte seguro — en casa, en la escuela, donde sea.",
    howToAsk: "Before your next meeting, make a list of the things that matter most to you...",
    howToAsk_es: "Antes de tu próxima reunión, haz una lista de las cosas que más te importan. Puedes dársela a tu trabajador de casos o pedirle a un adulto de confianza que te ayude a compartirla.",
    ifIgnored: "Tell your lawyer that your wishes weren't listened to...",
    ifIgnored_es: "Dile a tu abogado que no escucharon tus deseos. Tu abogado tiene que defender lo que quieres en la próxima audiencia — ese es su trabajo.",
  },
```

- [ ] **Step 2: Update `RightCard` component to use bilingual content**

```typescript
// In RightCard, when rendering the active tab content:
const lang = prefs?.language ?? 'en'  // RightCard needs to receive lang as prop

const displayText = {
  what: lang === 'es' ? (tier.plain_es ?? tier.plain) : tier.plain,
  how:  lang === 'es' ? (tier.howToAsk_es ?? tier.howToAsk) : tier.howToAsk,
  if:   lang === 'es' ? (tier.ifIgnored_es ?? tier.ifIgnored) : tier.ifIgnored,
}
```

Note: Add `lang: Lang` to the `RightCard` props interface and pass `prefs.language ?? 'en'` from the parent.

- [ ] **Step 3: Add bilingual fields to all remaining RIGHTS tiers** (privacy, siblings)

Follow the same pattern for all tiers of all three rights cards.

- [ ] **Step 4: Build and smoke test**

```bash
cd app && npm run build -- --noEmit
```
Open the app in Español, go to My Rights, expand a right, verify Spanish content renders.

- [ ] **Step 5: Commit**

```bash
git add app/src/FosterGuideAZPrototype.tsx
git commit -m "feat(i18n): add Spanish translations to RIGHTS tier content"
```

---

### Task 13: Translate COURT_STAGES, Ask/Chat screen, and Wellness screen

**Files:**
- Modify: `app/src/FosterGuideAZPrototype.tsx` — `COURT_STAGES`, `AskScreen`, `WellnessScreen`, `CaseScreen`

- [ ] **Step 1: Add bilingual fields to `COURT_STAGES`**

Each stage has `title`, `what`, `you` fields. Add `title_es`, `what_es`, `you_es`:

```typescript
const COURT_STAGES = [
  {
    id: 'investigation',
    title: 'Hotline & Investigation',
    title_es: 'Línea de emergencia e investigación',
    what: 'DCS receives a report and investigates...',
    what_es: 'DCS recibe un reporte e investiga...',
    you: 'A DCS Specialist visits your home...',
    you_es: 'Un especialista de DCS visita tu hogar...',
  },
  // ...
]
```

Render: `stage.title_es ?? stage.title` when language is 'es'.

- [ ] **Step 2: Apply `t()` to `AskScreen`**

Replace: "Ask Compass" heading, input placeholder, "Send" button, "Thinking…" indicator, crisis response header, suggested question list (translate or keep in English since they're example prompts that get sent to the AI).

> For suggested questions, keep them in the user's selected language so the AI receives Spanish queries and responds in Spanish.

Add Spanish suggested questions to `AskScreen`:
```typescript
const SUGGESTED_QUESTIONS_ES = [
  '¿Cuáles son mis derechos en el cuidado adoptivo?',
  '¿Qué pasa en una audiencia de dependencia?',
  '¿Qué es el EFC y cómo lo solicito?',
  '¿Puedo ver a mis hermanos si estamos en distintos hogares?',
]
```

- [ ] **Step 3: Apply `t()` to `WellnessScreen`**

Replace all hardcoded English strings with `t()` calls.

- [ ] **Step 4: Apply `t()` to `CaseScreen`**

Replace screen title, section headings, and hearing preparation questions.

- [ ] **Step 5: Final build and full smoke test**

```bash
cd app && npm run build
```
Expected: Build succeeds, zero TS errors.

Smoke test:
1. Open http://localhost:5173, select Español
2. Verify nav bar labels in Spanish
3. Go to My Rights — cards and tabs in Spanish
4. Go to My Case — court stages in Spanish
5. Go to Ask — type "¿Cuáles son mis derechos?" — AI responds in Spanish
6. Go to Resources — Spanish-speaking filter badge visible, UI strings in Spanish

- [ ] **Step 6: Commit**

```bash
git add app/src/FosterGuideAZPrototype.tsx
git commit -m "feat(i18n): translate COURT_STAGES, Ask, Wellness, and Case screens — Spanish experience complete"
```

---

## Post-Implementation Notes

### What's covered
- AI chat: Claude responds in Spanish with Spanish knowledge chunks
- Crisis detection: English + Spanish patterns
- All UI strings: onboarding, nav, all 6 screens
- All static content: RIGHTS tiers, COURT_STAGES, suggested questions

### Known limitations (out of scope for this plan)
- **Lunr retrieval is English-only**: Spanish queries still search an English index. This works because program names, citations, and cognates match. A future improvement is a bilingual lunr index using `lunr-languages`.
- **Wellness check-in emotional scale**: The emoji/label scale may need cultural adaptation (not just translation) for a later iteration.
- **COURT_STAGES `FutureScreen` content**: Document checklist items (birth certificate, SSN card, etc.) need translation in Task 13.
- **Resources directory descriptions**: The 39 resource entries in the frontend `RESOURCES` constant have English-only descriptions. These are lower priority since resource names and phone numbers stay in English.

### Testing this end-to-end
```bash
# 1. Start the server
cd server && ANTHROPIC_API_KEY=your_key npm run dev

# 2. Start the frontend
cd app && npm run dev

# 3. Open http://localhost:5173
# 4. Select Español at onboarding
# 5. Ask: "¿Qué derechos tengo como joven en cuidado adoptivo?"
# Expected: Spanish response citing A.R.S. §8-529
```
