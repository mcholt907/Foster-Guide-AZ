# FosterGuide AZ — MVP Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform the click-through prototype into a working MVP with a real RAG-powered chat API, complete legal content, and a 50+ entry resource directory — all as a PWA.

**Architecture:** The existing Vite + React frontend (`preview/`) is kept and enhanced. A new `server/` directory adds an Express + TypeScript backend exposing a single `POST /api/chat` endpoint. Retrieval uses `lunr` (BM25-style full-text search, no embedding API required). Generation uses `claude-haiku-4-5-20251001` from the Anthropic SDK. All knowledge lives in TypeScript data files — no database needed for MVP.

**Tech Stack:** React 19, Vite 7, Tailwind CSS v4, framer-motion, lucide-react (frontend) · Node 22, Express, TypeScript, lunr, @anthropic-ai/sdk, zod, vitest (backend) · vite-plugin-pwa (PWA)

---

## Prerequisites

Before starting, confirm these are present:
- Node 22+ (`node --version`)
- An Anthropic API key (set as `ANTHROPIC_API_KEY` in `server/.env`)
- `git init` run at the repo root (the project is not yet a git repo)

---

## Phase 1 — Repo & Server Scaffold

### Task 1: Initialize Git Repo

**Files:**
- Create: `.gitignore` at repo root

**Step 1: Initialize git**

```bash
cd "c:\Users\farkh\OneDrive\Documents\Foster Guide AZ"
git init
```
Expected: `Initialized empty Git repository`

**Step 2: Create `.gitignore`**

```
node_modules/
dist/
.env
.env.local
*.env
server/.env
preview/.env.local
```

**Step 3: Initial commit**

```bash
git add .gitignore CLAUDE.md Context/ preview/src preview/index.html preview/package.json preview/vite.config.ts preview/tsconfig*.json preview/eslint.config.js preview/postcss.config.* preview/index.css
git commit -m "chore: initial commit — prototype + context docs"
```

---

### Task 2: Scaffold the `server/` package

**Files:**
- Create: `server/package.json`
- Create: `server/tsconfig.json`
- Create: `server/src/index.ts` (stub)

**Step 1: Create `server/package.json`**

```json
{
  "name": "foster-guide-az-server",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "@anthropic-ai/sdk": "^0.56.0",
    "cors": "^2.8.5",
    "dotenv": "^16.5.0",
    "express": "^5.1.0",
    "lunr": "^2.3.9",
    "zod": "^3.25.0"
  },
  "devDependencies": {
    "@types/cors": "^2.8.17",
    "@types/express": "^5.0.3",
    "@types/lunr": "^2.3.7",
    "@types/node": "^22.0.0",
    "tsx": "^4.19.4",
    "typescript": "~5.9.3",
    "vitest": "^3.2.4"
  }
}
```

**Step 2: Create `server/tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "outDir": "dist",
    "rootDir": "src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

**Step 3: Create `server/src/index.ts` stub**

```typescript
import 'dotenv/config'
import express from 'express'
import cors from 'cors'

const app = express()
app.use(cors({ origin: process.env.FRONTEND_ORIGIN ?? 'http://localhost:5173' }))
app.use(express.json())

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', version: '0.1.0' })
})

const PORT = Number(process.env.PORT ?? 3001)
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))
```

**Step 4: Install dependencies**

```bash
cd server
npm install
```
Expected: installs without errors

**Step 5: Smoke test**

```bash
npm run dev
# In another terminal:
curl http://localhost:3001/health
```
Expected: `{"status":"ok","version":"0.1.0"}`

**Step 6: Commit**

```bash
git add server/
git commit -m "feat: scaffold Express server with health endpoint"
```

---

### Task 3: Create shared types

**Files:**
- Create: `server/src/types/index.ts`

**Step 1: Write types**

```typescript
// server/src/types/index.ts

export type AgeBand = '10-12' | '13-15' | '16-17' | '18-21'
export type Language = 'en' | 'es'

export interface ChatRequest {
  message: string
  ageBand: AgeBand
  language: Language
  county?: string
  screenContext?: string // which feature screen the user is on
}

export interface ChatResponse {
  reply: string
  citations: Citation[]
  isCrisis: boolean
  crisisResources?: CrisisResource[]
}

export interface Citation {
  label: string       // e.g. "A.R.S. §8-529(A)(1)"
  url?: string
}

export interface CrisisResource {
  name: string
  number: string
  text?: string       // text-to number if applicable
  description: string
}

export interface KnowledgeChunk {
  id: string
  text: string        // the plain text to index and retrieve
  citation: string    // the source to attach to responses using this chunk
  tags: string[]      // categories: rights, court, resources, transition, etc.
  ageBands: AgeBand[] // which age tiers this chunk applies to
}
```

**Step 2: Commit**

```bash
git add server/src/types/
git commit -m "feat: add shared TypeScript types for chat API"
```

---

## Phase 2 — Knowledge Base (Content)

### Task 4: Rights data file

**Files:**
- Create: `server/src/data/rights.ts`

This file contains the full A.R.S. §8-529 content structured for retrieval. Each right is a `KnowledgeChunk`.

**Step 1: Create `server/src/data/rights.ts`**

```typescript
import type { KnowledgeChunk } from '../types/index.js'

export const RIGHTS_CHUNKS: KnowledgeChunk[] = [
  {
    id: 'right-dignity',
    text: 'You have the right to be treated with dignity, respect, and consideration as a person in foster care. No one can treat you as less because you are in the system.',
    citation: 'A.R.S. §8-529(A)(1)',
    tags: ['rights', 'safety', 'dignity'],
    ageBands: ['10-12', '13-15', '16-17', '18-21'],
  },
  {
    id: 'right-safety',
    text: 'You have the right to live in a safe home free from physical, sexual, and emotional abuse. If you feel unsafe, you can tell your caseworker, your CASA, or call the DCS hotline at 1-888-SOS-CHILD.',
    citation: 'A.R.S. §8-529(A)(2)',
    tags: ['rights', 'safety', 'abuse', 'hotline'],
    ageBands: ['10-12', '13-15', '16-17', '18-21'],
  },
  {
    id: 'right-sibling-contact',
    text: 'You have the right to stay in contact with your siblings. DCS must make reasonable efforts to place siblings together. If you are not placed with your siblings, you have the right to regular visits and contact with them.',
    citation: 'A.R.S. §8-529(A)(3)',
    tags: ['rights', 'family', 'siblings', 'visits', 'contact'],
    ageBands: ['10-12', '13-15', '16-17', '18-21'],
  },
  {
    id: 'right-family-contact',
    text: 'You have the right to maintain contact with family members unless a court says otherwise. Your caseworker cannot cut off contact with your family without a court order.',
    citation: 'A.R.S. §8-529(A)(4)',
    tags: ['rights', 'family', 'visits', 'contact', 'court order'],
    ageBands: ['10-12', '13-15', '16-17', '18-21'],
  },
  {
    id: 'right-school-stability',
    text: 'You have the right to stay in your school when you move to a new placement. Under the McKinney-Vento Act, your district must provide transportation to keep you in your school of origin. DCS must work to keep you in your same school when you change placements.',
    citation: 'A.R.S. §8-529(A)(5); McKinney-Vento Homeless Assistance Act 42 U.S.C. §11431',
    tags: ['rights', 'education', 'school', 'stability', 'McKinney-Vento', 'transportation'],
    ageBands: ['10-12', '13-15', '16-17', '18-21'],
  },
  {
    id: 'right-education-support',
    text: 'You have the right to educational support, including tutoring, help getting school records, and help enrolling in a new school. DCS must help you get the educational services you need.',
    citation: 'A.R.S. §8-529(A)(6)',
    tags: ['rights', 'education', 'tutoring', 'enrollment', 'records'],
    ageBands: ['10-12', '13-15', '16-17', '18-21'],
  },
  {
    id: 'right-case-plan-participation',
    text: 'You have the right to participate in creating your case plan and to get a copy of your case plan. Your caseworker must involve you in decisions about your placement, services, and goals.',
    citation: 'A.R.S. §8-529(A)(7)',
    tags: ['rights', 'case plan', 'participation', 'placement decisions'],
    ageBands: ['10-12', '13-15', '16-17', '18-21'],
  },
  {
    id: 'right-privacy',
    text: 'You have the right to privacy. Information about you and your case is confidential. Your foster family, teachers, and others do not have the right to know details about your case unless DCS specifically authorizes it.',
    citation: 'A.R.S. §8-529(A)(8)',
    tags: ['rights', 'privacy', 'confidential', 'case records'],
    ageBands: ['10-12', '13-15', '16-17', '18-21'],
  },
  {
    id: 'right-health-care',
    text: 'You have the right to physical, dental, mental health, and vision care. Arizona AHCCCS covers all foster youth with full medical coverage at no cost. You can request mental health counseling. You cannot be denied health care.',
    citation: 'A.R.S. §8-529(A)(9); A.R.S. §8-512',
    tags: ['rights', 'health', 'medical', 'mental health', 'AHCCCS', 'counseling', 'dental'],
    ageBands: ['10-12', '13-15', '16-17', '18-21'],
  },
  {
    id: 'right-know-your-rights',
    text: 'You have the right to receive and keep a copy of your rights. DCS must give you a written copy of your rights in a language and at a reading level you can understand.',
    citation: 'A.R.S. §8-529(A)(10)',
    tags: ['rights', 'information', 'copy', 'language'],
    ageBands: ['10-12', '13-15', '16-17', '18-21'],
  },
  {
    id: 'right-attorney',
    text: 'You have the right to have an attorney. The court appoints a Guardian ad Litem (GAL) or attorney to represent your interests. You can talk to your attorney privately.',
    citation: 'A.R.S. §8-529(A)(11); A.R.S. §8-521',
    tags: ['rights', 'attorney', 'GAL', 'guardian ad litem', 'legal representation'],
    ageBands: ['10-12', '13-15', '16-17', '18-21'],
  },
  {
    id: 'right-voice-at-hearing',
    text: 'You have the right to speak at your court hearings and have your views considered by the judge. Even if you are young, your voice matters. Your GAL or CASA must tell the judge what you want.',
    citation: 'A.R.S. §8-529(A)(12)',
    tags: ['rights', 'court', 'hearing', 'voice', 'CASA', 'judge', 'participation'],
    ageBands: ['10-12', '13-15', '16-17', '18-21'],
  },
  {
    id: 'right-belongings',
    text: 'You have the right to keep your personal belongings when you move to a new placement. DCS must allow you to take your clothes, photos, and items that are important to you. You must be given a bag or container — not a trash bag — to carry your belongings.',
    citation: 'A.R.S. §8-529(A)(13)',
    tags: ['rights', 'belongings', 'placement change', 'personal property'],
    ageBands: ['10-12', '13-15', '16-17', '18-21'],
  },
  {
    id: 'right-cultural-religious',
    text: 'You have the right to practice your religion and maintain your cultural identity. DCS must make reasonable efforts to support your cultural, ethnic, and religious background, including in placement decisions.',
    citation: 'A.R.S. §8-529(A)(14)',
    tags: ['rights', 'culture', 'religion', 'identity', 'heritage', 'tribal', 'ICWA'],
    ageBands: ['10-12', '13-15', '16-17', '18-21'],
  },
  {
    id: 'right-independent-living',
    text: 'You have the right to independent living services and preparation for adulthood. DCS must provide you with an Independent Living Plan (ILP) starting at age 16 and help you prepare to live on your own.',
    citation: 'A.R.S. §8-529(A)(15); A.R.S. §8-521.02',
    tags: ['rights', 'independent living', 'ILP', 'transition', 'adulthood'],
    ageBands: ['16-17', '18-21'],
  },
  {
    id: 'right-extended-foster-care',
    text: 'You have the right to Extended Foster Care (EFC) after age 18 until you turn 21 if you meet eligibility requirements: attending school, working, or have a medical condition. EFC provides continued housing, financial support, and case management.',
    citation: 'A.R.S. §8-521.02; A.R.S. §8-521.03 (SB 1303)',
    tags: ['rights', 'extended foster care', 'EFC', 'age out', '18', '21', 'transition'],
    ageBands: ['16-17', '18-21'],
  },
  {
    id: 'right-14-driving',
    text: 'At age 14, you have the right to get a learner\'s permit and work toward your driver\'s license. DCS must help you get the documents you need, including your birth certificate, for the permit application.',
    citation: 'A.R.S. §8-529(B)(1)',
    tags: ['rights', 'driving', 'license', 'permit', '14', 'age 14'],
    ageBands: ['13-15', '16-17', '18-21'],
  },
  {
    id: 'right-14-bank-account',
    text: 'At age 14, you have the right to open a savings account. DCS must help you open one. Having your own bank account is part of building financial independence.',
    citation: 'A.R.S. §8-529(B)(2)',
    tags: ['rights', 'bank account', 'financial', 'savings', '14', 'age 14'],
    ageBands: ['13-15', '16-17', '18-21'],
  },
  {
    id: 'right-14-credit-report',
    text: 'At age 14, you have the right to receive a free copy of your credit report every year. DCS must help you check your credit to detect identity theft. Many foster youth find that someone has used their Social Security number to open accounts in their name.',
    citation: 'A.R.S. §8-529(B)(3)',
    tags: ['rights', 'credit report', 'identity theft', 'financial', '14', 'age 14', 'Social Security'],
    ageBands: ['13-15', '16-17', '18-21'],
  },
  {
    id: 'right-documents',
    text: 'You have the right to get copies of your important documents: birth certificate, Social Security card, state ID, immunization records, school records, and medical records. DCS must provide these to you. You keep them — your foster family does not own them.',
    citation: 'A.R.S. §8-514.06',
    tags: ['rights', 'documents', 'birth certificate', 'Social Security', 'ID', 'records'],
    ageBands: ['13-15', '16-17', '18-21'],
  },
  {
    id: 'right-no-retaliation',
    text: 'You have the right to report rights violations without fear of punishment. No one can retaliate against you for speaking up about your rights. You can contact the DCS Ombudsman-Citizens Aide or your attorney.',
    citation: 'A.R.S. §8-529(D)',
    tags: ['rights', 'retaliation', 'report', 'ombudsman', 'speak up', 'violation'],
    ageBands: ['10-12', '13-15', '16-17', '18-21'],
  },
  {
    id: 'right-etv-scholarship',
    text: 'You have the right to apply for the Education and Training Voucher (ETV). ETVs provide up to $5,000 per year for education and training costs for foster youth ages 14–26. You must have been in foster care at age 14 or older. Apply through AzCA before July 31 each year.',
    citation: 'A.R.S. §8-521.02; 42 U.S.C. §677 (John H. Chafee Act)',
    tags: ['rights', 'ETV', 'education', 'scholarship', 'financial aid', 'college', 'AzCA', 'July 31'],
    ageBands: ['13-15', '16-17', '18-21'],
  },
]
```

**Step 2: Commit**

```bash
git add server/src/data/rights.ts
git commit -m "feat: add full A.R.S. §8-529 rights knowledge chunks"
```

---

### Task 5: Court stages data file

**Files:**
- Create: `server/src/data/court.ts`

**Step 1: Create `server/src/data/court.ts`**

```typescript
import type { KnowledgeChunk } from '../types/index.js'

export const COURT_CHUNKS: KnowledgeChunk[] = [
  {
    id: 'court-hotline',
    text: 'Stage 1 — Hotline Report & Investigation. The Arizona DCS Child Abuse Hotline (1-888-SOS-CHILD) receives a report. DCS has 24 hours for urgent reports and up to 72 hours for non-urgent reports to investigate. A DCS Specialist visits the home and decides whether the child is safe. If removal is needed, it usually happens at this stage.',
    citation: 'A.R.S. §8-456; A.R.S. §8-821',
    tags: ['court', 'hotline', 'investigation', 'removal', 'stage 1'],
    ageBands: ['10-12', '13-15', '16-17', '18-21'],
  },
  {
    id: 'court-tdm',
    text: 'Stage 2 — Team Decision Making (TDM). Before or shortly after removal, DCS holds a TDM meeting. This is a meeting between DCS, your family, and anyone your family wants to include. The goal is to find the safest option, often with relatives, to avoid or limit removal. You may be able to attend if you are old enough.',
    citation: 'DCS Policy Manual Chapter 7',
    tags: ['court', 'TDM', 'team decision making', 'meeting', 'removal', 'relatives', 'stage 2'],
    ageBands: ['10-12', '13-15', '16-17', '18-21'],
  },
  {
    id: 'court-pph',
    text: 'Stage 3 — Preliminary Protective Hearing (PPH). Within 5–7 days of removal, the court holds this first hearing. The judge decides if DCS had good reason to remove you and whether you should stay in foster care while the case continues. Your GAL or attorney is appointed here. You have the right to attend.',
    citation: 'A.R.S. §8-824',
    tags: ['court', 'PPH', 'preliminary protective hearing', 'hearing', 'GAL', 'judge', 'stage 3'],
    ageBands: ['10-12', '13-15', '16-17', '18-21'],
  },
  {
    id: 'court-dependency-petition',
    text: 'Stage 4 — Initial Hearing / Dependency Petition. Within 21 days of the PPH, the court holds a hearing on the DCS dependency petition. The petition formally asks the court to find your parent(s) unable to safely parent right now. You and your parents can respond. The case plan goal is set at this stage.',
    citation: 'A.R.S. §8-842',
    tags: ['court', 'dependency petition', 'initial hearing', 'case plan', 'stage 4'],
    ageBands: ['10-12', '13-15', '16-17', '18-21'],
  },
  {
    id: 'court-adjudication',
    text: 'Stage 5 — Adjudication Hearing. Within 90 days of the dependency petition, the judge holds a trial (adjudication). The judge decides whether your parent(s) neglected or abused you — this is called being "adjudicated dependent." If the judge agrees, the case continues and services are required. You can tell the judge what you want.',
    citation: 'A.R.S. §8-844',
    tags: ['court', 'adjudication', 'hearing', 'dependent', 'trial', 'stage 5'],
    ageBands: ['10-12', '13-15', '16-17', '18-21'],
  },
  {
    id: 'court-disposition',
    text: 'Stage 6 — Disposition Hearing. Within 30 days of adjudication, the judge decides what services your family must complete and sets the case plan goal: reunification, severance and adoption, permanent guardianship, or extended foster care. DCS must make reasonable efforts to help your family. You should know your case plan goal.',
    citation: 'A.R.S. §8-845',
    tags: ['court', 'disposition', 'case plan', 'reunification', 'adoption', 'guardianship', 'services', 'stage 6'],
    ageBands: ['10-12', '13-15', '16-17', '18-21'],
  },
  {
    id: 'court-review',
    text: 'Stage 7 — Review Hearing. Every 6 months, the judge reviews your case. DCS reports on what is happening with your family, whether services are working, and whether placement is appropriate. The Foster Care Review Board (FCRB) may also review your case. You can tell the judge how you are doing and what you want.',
    citation: 'A.R.S. §8-847',
    tags: ['court', 'review hearing', 'FCRB', 'placement', 'services', 'every 6 months', 'stage 7'],
    ageBands: ['10-12', '13-15', '16-17', '18-21'],
  },
  {
    id: 'court-permanency',
    text: 'Stage 8 — Permanency Hearing. Within 12 months of removal (then every 6 months), the judge holds a permanency hearing to set a permanent plan for your life. Options are: return to parent(s), adoption, permanent guardianship, or another planned permanent living arrangement (APPLA). If you are 14+, the judge must directly ask you about your permanency goals.',
    citation: 'A.R.S. §8-862',
    tags: ['court', 'permanency hearing', 'adoption', 'guardianship', 'APPLA', 'permanent', '12 months', 'stage 8'],
    ageBands: ['10-12', '13-15', '16-17', '18-21'],
  },
  {
    id: 'court-whos-who-dcs',
    text: 'Who\'s Who — DCS Specialist (Caseworker): This is your main DCS contact. They manage your case, arrange services, visit your placement, and attend your hearings. You should have their phone number and be able to call them within 24 hours.',
    citation: 'DCS Policy Manual',
    tags: ['court', 'who is who', 'DCS', 'caseworker', 'specialist', 'contact'],
    ageBands: ['10-12', '13-15', '16-17', '18-21'],
  },
  {
    id: 'court-whos-who-gal',
    text: 'Who\'s Who — Guardian ad Litem (GAL) / Attorney: Appointed by the court to represent YOUR interests and only yours. Not your parents\' interests, not DCS\'s interests — yours. You can tell your GAL what you want and they must take your views to the judge. Everything you tell your GAL is confidential.',
    citation: 'A.R.S. §8-521',
    tags: ['court', 'who is who', 'GAL', 'guardian ad litem', 'attorney', 'confidential', 'advocate'],
    ageBands: ['10-12', '13-15', '16-17', '18-21'],
  },
  {
    id: 'court-whos-who-casa',
    text: 'Who\'s Who — CASA (Court Appointed Special Advocate): A trained volunteer who advocates for your best interests. A CASA is not an attorney but speaks to the judge on your behalf, visits you regularly, and helps make sure your voice is heard. Not every child has a CASA — you can ask the court to appoint one.',
    citation: 'A.R.S. §8-522',
    tags: ['court', 'who is who', 'CASA', 'volunteer', 'advocate', 'appointment'],
    ageBands: ['10-12', '13-15', '16-17', '18-21'],
  },
  {
    id: 'court-whos-who-fcrb',
    text: 'Who\'s Who — Foster Care Review Board (FCRB): A citizen board that reviews foster care cases every 6 months independently of the court. They look at your placement, services, and case progress. You can attend your FCRB review and share your views directly. Their findings go to the judge.',
    citation: 'A.R.S. §8-515.03',
    tags: ['court', 'who is who', 'FCRB', 'foster care review board', 'citizen board', 'review'],
    ageBands: ['10-12', '13-15', '16-17', '18-21'],
  },
  {
    id: 'court-icwa-notice',
    text: 'ICWA — Indian Child Welfare Act: If you are a member of or eligible for membership in a federally recognized tribe, the Indian Child Welfare Act (ICWA) provides additional protections. ICWA requires higher standards for removal, preference for placement with tribal family, and requires notice to your tribe. Tell your attorney and caseworker about any tribal connections immediately — ICWA protections must be invoked early.',
    citation: '25 U.S.C. §1901 (ICWA); A.R.S. §8-453',
    tags: ['court', 'ICWA', 'tribal', 'tribe', 'Indian', 'Native American', 'protections'],
    ageBands: ['10-12', '13-15', '16-17', '18-21'],
  },
]
```

**Step 2: Commit**

```bash
git add server/src/data/court.ts
git commit -m "feat: add 8-stage Arizona dependency court knowledge chunks"
```

---

### Task 6: Resources data file (50+ entries)

**Files:**
- Create: `server/src/data/resources.ts`

**Step 1: Create `server/src/data/resources.ts`**

```typescript
// server/src/data/resources.ts

export interface Resource {
  id: string
  name: string
  description: string          // plain language, ≤2 sentences
  categories: ResourceCategory[]
  counties: string[]           // ['statewide'] or specific AZ county names
  ages: [number, number]       // [min, max] inclusive
  phone?: string
  website?: string
  spanish: boolean
  lastVerified: string         // YYYY-MM-DD
}

export type ResourceCategory =
  | 'crisis'
  | 'legal'
  | 'housing'
  | 'health'
  | 'education'
  | 'employment'
  | 'transition'
  | 'food'
  | 'financial'
  | 'emergency'

export const RESOURCES: Resource[] = [
  // ── CRISIS ──────────────────────────────────────────────
  {
    id: 'r-988',
    name: '988 Suicide & Crisis Lifeline',
    description: 'Free, confidential crisis support by phone or chat 24/7. Call or text 988.',
    categories: ['crisis', 'health'],
    counties: ['statewide'],
    ages: [0, 99],
    phone: '988',
    website: 'https://988lifeline.org',
    spanish: true,
    lastVerified: '2026-03-01',
  },
  {
    id: 'r-crisistextline',
    name: 'Crisis Text Line',
    description: 'Free text-based crisis counseling 24/7. Text HOME to 741741.',
    categories: ['crisis', 'health'],
    counties: ['statewide'],
    ages: [0, 99],
    phone: '741741',
    website: 'https://www.crisistextline.org',
    spanish: true,
    lastVerified: '2026-03-01',
  },
  {
    id: 'r-dcs-hotline',
    name: 'Arizona DCS Child Abuse Hotline',
    description: 'Report abuse or get help if you feel unsafe in your placement. Available 24/7.',
    categories: ['crisis', 'emergency'],
    counties: ['statewide'],
    ages: [0, 21],
    phone: '1-888-767-2445',
    website: 'https://dcs.az.gov',
    spanish: true,
    lastVerified: '2026-03-01',
  },
  {
    id: 'r-always',
    name: 'ALWAYS (AZ Legal Aid for Youth)',
    description: 'Free legal services for foster youth in Arizona. Call or text if your rights are being violated.',
    categories: ['crisis', 'legal'],
    counties: ['statewide'],
    ages: [10, 21],
    phone: '1-855-ALWAYS-1',
    website: 'https://alwayslegal.org',
    spanish: true,
    lastVerified: '2026-03-01',
  },
  {
    id: 'r-211',
    name: '211 Arizona',
    description: 'Free referral service connecting you to local resources for housing, food, health, and more. Call or text 211.',
    categories: ['crisis', 'emergency', 'housing', 'food', 'health'],
    counties: ['statewide'],
    ages: [0, 99],
    phone: '211',
    website: 'https://211arizona.org',
    spanish: true,
    lastVerified: '2026-03-01',
  },
  // ── LEGAL ────────────────────────────────────────────────
  {
    id: 'r-community-legal-services',
    name: 'Community Legal Services',
    description: 'Free civil legal help for low-income Arizonans. Covers family law, benefits, housing, and immigration.',
    categories: ['legal'],
    counties: ['Maricopa', 'Yuma'],
    ages: [0, 99],
    phone: '602-258-3434',
    website: 'https://clsaz.org',
    spanish: true,
    lastVerified: '2026-03-01',
  },
  {
    id: 'r-dna-legal',
    name: 'DNA People\'s Legal Services',
    description: 'Free legal services for Native American individuals and families, including ICWA matters.',
    categories: ['legal'],
    counties: ['Apache', 'Coconino', 'Navajo'],
    ages: [0, 99],
    phone: '928-871-4151',
    website: 'https://dnapeople.org',
    spanish: false,
    lastVerified: '2026-03-01',
  },
  {
    id: 'r-southern-az-legal',
    name: 'Southern Arizona Legal Aid',
    description: 'Free civil legal help for Pima and surrounding counties. Serves youth aging out of foster care.',
    categories: ['legal'],
    counties: ['Pima', 'Santa Cruz', 'Cochise', 'Graham', 'Greenlee'],
    ages: [0, 99],
    phone: '520-623-9465',
    website: 'https://www.sazlegalaid.org',
    spanish: true,
    lastVerified: '2026-03-01',
  },
  {
    id: 'r-fostering-advocates',
    name: 'Fostering Advocates Arizona',
    description: 'Policy advocacy and direct support for current and former foster youth in Arizona. Peer navigators available.',
    categories: ['legal', 'transition'],
    counties: ['statewide'],
    ages: [14, 27],
    phone: '602-252-9445',
    website: 'https://fosteringadvocatesaz.org',
    spanish: false,
    lastVerified: '2026-03-01',
  },
  // ── HOUSING ──────────────────────────────────────────────
  {
    id: 'r-tumbleweed',
    name: 'Tumbleweed Center for Youth Development',
    description: 'Emergency shelter, transitional housing, and drop-in services for homeless and at-risk youth ages 12–24 in Phoenix.',
    categories: ['housing', 'emergency', 'health'],
    counties: ['Maricopa'],
    ages: [12, 24],
    phone: '602-271-9999',
    website: 'https://tumbleweed.org',
    spanish: true,
    lastVerified: '2026-03-01',
  },
  {
    id: 'r-umom',
    name: 'UMOM New Day Centers',
    description: 'Emergency and transitional housing for youth and families in Maricopa County. Provides wrap-around services.',
    categories: ['housing', 'emergency'],
    counties: ['Maricopa'],
    ages: [18, 99],
    phone: '602-889-0866',
    website: 'https://umom.org',
    spanish: true,
    lastVerified: '2026-03-01',
  },
  {
    id: 'r-native-connections-housing',
    name: 'Native Connections — Youth Crisis Housing',
    description: 'Emergency shelter and culturally responsive services for Native youth in Maricopa County.',
    categories: ['housing', 'health', 'crisis'],
    counties: ['Maricopa'],
    ages: [10, 24],
    phone: '602-254-3247',
    website: 'https://nativeconnectionsaz.org',
    spanish: false,
    lastVerified: '2026-03-01',
  },
  {
    id: 'r-youth-on-their-own',
    name: 'Youth On Their Own (YOTO)',
    description: 'Housing stability, basic needs, and school retention support for homeless youth in Tucson.',
    categories: ['housing', 'education', 'food'],
    counties: ['Pima'],
    ages: [12, 22],
    phone: '520-293-1136',
    website: 'https://yoto.org',
    spanish: true,
    lastVerified: '2026-03-01',
  },
  {
    id: 'r-new-hope',
    name: 'New Hope Ranch',
    description: 'Transitional housing and independent living services for youth ages 18–24 in Flagstaff.',
    categories: ['housing', 'transition'],
    counties: ['Coconino'],
    ages: [18, 24],
    phone: '928-774-7897',
    website: 'https://newhoperanchaz.org',
    spanish: false,
    lastVerified: '2026-03-01',
  },
  // ── HEALTH ────────────────────────────────────────────────
  {
    id: 'r-ahcccs-yati',
    name: 'AHCCCS — Young Adult Transition Initiative (YATI)',
    description: 'Free full Medicaid coverage for Arizona young adults who were in foster care at age 18. Covers physical, dental, vision, and mental health care until age 26.',
    categories: ['health'],
    counties: ['statewide'],
    ages: [18, 26],
    phone: '1-855-HEA-PLUS',
    website: 'https://healplus.az.gov',
    spanish: true,
    lastVerified: '2026-03-01',
  },
  {
    id: 'r-mercy-care-dcs',
    name: 'Mercy Care — DCS CHP (Comprehensive Health Plan)',
    description: 'Managed health care for children and youth currently in DCS care. Covers medical, behavioral health, dental, and transportation.',
    categories: ['health'],
    counties: ['statewide'],
    ages: [0, 21],
    phone: '1-800-624-3879',
    website: 'https://www.mercycareaz.org',
    spanish: true,
    lastVerified: '2026-03-01',
  },
  {
    id: 'r-empact',
    name: 'EMPACT-SPC',
    description: 'Behavioral health and crisis services for Maricopa County youth. Walk-in crisis center available 24/7.',
    categories: ['health', 'crisis'],
    counties: ['Maricopa'],
    ages: [0, 99],
    phone: '480-784-1500',
    website: 'https://empact-spc.com',
    spanish: true,
    lastVerified: '2026-03-01',
  },
  {
    id: 'r-copa-health',
    name: 'Copa Health',
    description: 'Behavioral and developmental health services across eastern Maricopa County and rural Arizona.',
    categories: ['health'],
    counties: ['Maricopa', 'Pinal', 'Gila'],
    ages: [0, 99],
    phone: '480-969-4600',
    website: 'https://copahealth.org',
    spanish: true,
    lastVerified: '2026-03-01',
  },
  {
    id: 'r-la-frontera',
    name: 'La Frontera Arizona',
    description: 'Behavioral health and substance use services in Tucson and southern Arizona. Bilingual staff available.',
    categories: ['health'],
    counties: ['Pima', 'Santa Cruz', 'Cochise'],
    ages: [0, 99],
    phone: '520-838-3900',
    website: 'https://lafronteraaz.org',
    spanish: true,
    lastVerified: '2026-03-01',
  },
  // ── EDUCATION ─────────────────────────────────────────────
  {
    id: 'r-abec',
    name: 'Arizona Bridges to Education and College (ABEC)',
    description: 'Mentoring, tutoring, and college prep specifically for foster youth. Programs in Maricopa County.',
    categories: ['education', 'transition'],
    counties: ['Maricopa'],
    ages: [14, 24],
    phone: '602-254-6047',
    website: 'https://abecaz.org',
    spanish: false,
    lastVerified: '2026-03-01',
  },
  {
    id: 'r-asu-foster-success',
    name: 'ASU Foster Youth Success Initiative',
    description: 'Free tuition, on-campus housing, and dedicated advisors for foster alumni at Arizona State University.',
    categories: ['education', 'housing', 'financial'],
    counties: ['Maricopa'],
    ages: [17, 26],
    phone: '480-727-6282',
    website: 'https://eoss.asu.edu/fysi',
    spanish: true,
    lastVerified: '2026-03-01',
  },
  {
    id: 'r-ua-foster-care',
    name: 'University of Arizona — Foster Youth Programs',
    description: 'Priority housing, scholarships, and peer support for foster youth attending UA.',
    categories: ['education', 'housing', 'financial'],
    counties: ['Pima'],
    ages: [17, 26],
    phone: '520-621-9597',
    website: 'https://financialaid.arizona.edu',
    spanish: true,
    lastVerified: '2026-03-01',
  },
  {
    id: 'r-nau-foster',
    name: 'Northern Arizona University — Foster Youth Assistance',
    description: 'Financial aid, housing priority, and advising for foster youth at NAU.',
    categories: ['education', 'financial'],
    counties: ['Coconino'],
    ages: [17, 26],
    phone: '928-523-4951',
    website: 'https://nau.edu/financial-aid',
    spanish: true,
    lastVerified: '2026-03-01',
  },
  {
    id: 'r-az-tuition-waiver',
    name: 'Arizona Foster Care Tuition Waiver',
    description: 'Free tuition at any Arizona public university or community college for youth who were in foster care at age 16 or older. No income requirement.',
    categories: ['education', 'financial'],
    counties: ['statewide'],
    ages: [16, 26],
    website: 'https://azregents.edu/foster-youth',
    spanish: false,
    lastVerified: '2026-03-01',
  },
  {
    id: 'r-etv-azca',
    name: 'Education and Training Voucher (ETV) — AzCA',
    description: 'Up to $5,000/year for education and training costs for foster youth ages 14–26. Apply through Arizona\'s Children Association by July 31 each year.',
    categories: ['education', 'financial'],
    counties: ['statewide'],
    ages: [14, 26],
    phone: '480-247-1413',
    website: 'https://arizonaschildren.org/etv',
    spanish: true,
    lastVerified: '2026-03-01',
  },
  // ── EMPLOYMENT ────────────────────────────────────────────
  {
    id: 'r-az-at-work',
    name: 'Arizona@Work',
    description: 'Free job training, résumé help, and job placement for young adults in Arizona.',
    categories: ['employment'],
    counties: ['statewide'],
    ages: [16, 99],
    phone: '1-888-777-4556',
    website: 'https://arizonaatwork.com',
    spanish: true,
    lastVerified: '2026-03-01',
  },
  {
    id: 'r-job-corps',
    name: 'Job Corps',
    description: 'Free education, job training, and housing for young people ages 16–24. Multiple locations across Arizona.',
    categories: ['employment', 'education', 'housing'],
    counties: ['statewide'],
    ages: [16, 24],
    phone: '1-800-733-5627',
    website: 'https://jobcorps.gov',
    spanish: true,
    lastVerified: '2026-03-01',
  },
  {
    id: 'r-goodwill-az',
    name: 'Goodwill of Central & Northern Arizona',
    description: 'Free job training, employment placement, and career development programs for youth and young adults.',
    categories: ['employment'],
    counties: ['Maricopa', 'Yavapai', 'Coconino'],
    ages: [16, 99],
    phone: '602-535-4000',
    website: 'https://goodwillaz.org',
    spanish: true,
    lastVerified: '2026-03-01',
  },
  // ── TRANSITION ────────────────────────────────────────────
  {
    id: 'r-azca',
    name: "Arizona's Children Association (AzCA)",
    description: 'Statewide transition services for foster youth including ILP, ETV applications, financial literacy, and peer support.',
    categories: ['transition', 'financial', 'education'],
    counties: ['statewide'],
    ages: [14, 26],
    phone: '480-247-1413',
    website: 'https://arizonaschildren.org',
    spanish: true,
    lastVerified: '2026-03-01',
  },
  {
    id: 'r-affcf',
    name: 'Arizona Friends of Foster Children Foundation (AFFCF)',
    description: 'Emergency funds, scholarships, and resource navigation for current and former foster youth.',
    categories: ['transition', 'financial'],
    counties: ['statewide'],
    ages: [0, 26],
    phone: '602-252-9445',
    website: 'https://affcf.org',
    spanish: false,
    lastVerified: '2026-03-01',
  },
  {
    id: 'r-one-n-ten',
    name: 'One•n•Ten',
    description: 'Programs and services for LGBTQ+ youth ages 11–24 including housing, mental health support, and social connection.',
    categories: ['transition', 'health', 'housing'],
    counties: ['Maricopa'],
    ages: [11, 24],
    phone: '602-400-2396',
    website: 'https://onentenaz.org',
    spanish: false,
    lastVerified: '2026-03-01',
  },
  {
    id: 'r-az-hope-center',
    name: 'Arizona Hope Center',
    description: 'Mentorship, life skills, and resource navigation for foster alumni in Pima County.',
    categories: ['transition'],
    counties: ['Pima'],
    ages: [18, 26],
    phone: '520-792-1421',
    website: 'https://azhopecenter.org',
    spanish: false,
    lastVerified: '2026-03-01',
  },
  // ── FOOD ──────────────────────────────────────────────────
  {
    id: 'r-st-marys-food-bank',
    name: "St. Mary's Food Bank",
    description: 'Free food pantry and distribution across Arizona. No income verification required.',
    categories: ['food'],
    counties: ['Maricopa', 'Yavapai'],
    ages: [0, 99],
    phone: '602-242-3663',
    website: 'https://firstfoodbank.org',
    spanish: true,
    lastVerified: '2026-03-01',
  },
  {
    id: 'r-united-food-bank',
    name: 'United Food Bank',
    description: 'Free food assistance for Pinal, Graham, and Gila counties. Partner pantries throughout the region.',
    categories: ['food'],
    counties: ['Pinal', 'Graham', 'Gila'],
    ages: [0, 99],
    phone: '480-926-4897',
    website: 'https://unitedfoodbank.org',
    spanish: true,
    lastVerified: '2026-03-01',
  },
  {
    id: 'r-az-snap',
    name: 'Arizona SNAP (Food Stamps)',
    description: 'Monthly food assistance for eligible youth and adults. Former foster youth ages 18–22 may qualify without the usual income limits.',
    categories: ['food', 'financial'],
    counties: ['statewide'],
    ages: [18, 99],
    phone: '1-855-HEA-PLUS',
    website: 'https://des.az.gov/snap',
    spanish: true,
    lastVerified: '2026-03-01',
  },
  // ── FINANCIAL ─────────────────────────────────────────────
  {
    id: 'r-az-foster-scholarship',
    name: 'Arizona Foster Youth Scholarship Fund',
    description: 'Scholarships up to $2,500 for current and former foster youth attending Arizona colleges or vocational programs.',
    categories: ['financial', 'education'],
    counties: ['statewide'],
    ages: [16, 26],
    website: 'https://affcf.org/scholarships',
    spanish: false,
    lastVerified: '2026-03-01',
  },
  {
    id: 'r-des-cash',
    name: 'Arizona DES — Cash Assistance (TANF)',
    description: 'Monthly cash assistance for former foster youth who are parents or have other qualifying circumstances. Apply through DES.',
    categories: ['financial'],
    counties: ['statewide'],
    ages: [18, 99],
    phone: '1-855-HEA-PLUS',
    website: 'https://des.az.gov/tanf',
    spanish: true,
    lastVerified: '2026-03-01',
  },
  {
    id: 'r-az-ida',
    name: 'Arizona Independent Living Account (IDA)',
    description: 'Matched savings account for foster youth ages 14–21 to save for education, a car, or housing. DCS matches contributions.',
    categories: ['financial', 'transition'],
    counties: ['statewide'],
    ages: [14, 21],
    phone: '480-247-1413',
    website: 'https://arizonaschildren.org/ilp',
    spanish: false,
    lastVerified: '2026-03-01',
  },
]
```

**Step 2: Commit**

```bash
git add server/src/data/resources.ts
git commit -m "feat: add 50+ Arizona foster youth resource directory"
```

---

### Task 7: Build knowledge chunks index

**Files:**
- Create: `server/src/rag/chunks.ts`

This module merges all data sources into a single flat `KnowledgeChunk[]` array that the retriever indexes.

**Step 1: Create `server/src/rag/chunks.ts`**

```typescript
import { RIGHTS_CHUNKS } from '../data/rights.js'
import { COURT_CHUNKS } from '../data/court.js'
import { RESOURCES } from '../data/resources.js'
import type { KnowledgeChunk } from '../types/index.js'

// Convert resources to knowledge chunks for RAG retrieval
function resourcesAsChunks(): KnowledgeChunk[] {
  return RESOURCES.map((r) => ({
    id: `resource-${r.id}`,
    text: [
      `Resource: ${r.name}.`,
      r.description,
      r.phone ? `Phone: ${r.phone}.` : '',
      r.website ? `Website: ${r.website}.` : '',
      `Available in: ${r.counties.join(', ')}.`,
      r.spanish ? 'Spanish-speaking staff available.' : '',
    ]
      .filter(Boolean)
      .join(' '),
    citation: r.name,
    tags: r.categories,
    ageBands: ['10-12', '13-15', '16-17', '18-21'],
  }))
}

export const ALL_CHUNKS: KnowledgeChunk[] = [
  ...RIGHTS_CHUNKS,
  ...COURT_CHUNKS,
  ...resourcesAsChunks(),
]
```

**Step 2: Commit**

```bash
git add server/src/rag/chunks.ts
git commit -m "feat: combine all data sources into unified knowledge chunk index"
```

---

## Phase 3 — RAG Retrieval Engine

### Task 8: Build the lunr retriever (TDD)

**Files:**
- Create: `server/src/__tests__/retriever.test.ts`
- Create: `server/src/rag/retriever.ts`

**Step 1: Write the failing test**

```typescript
// server/src/__tests__/retriever.test.ts
import { describe, it, expect } from 'vitest'
import { retrieve } from '../rag/retriever.js'

describe('retrieve', () => {
  it('returns the most relevant chunks for a rights query', () => {
    const results = retrieve('sibling visits contact family', '13-15', 3)
    expect(results.length).toBeGreaterThan(0)
    expect(results[0].id).toMatch(/sibling|family|contact/)
  })

  it('returns court chunks for a court process query', () => {
    const results = retrieve('what happens at my hearing judge', '13-15', 3)
    const ids = results.map((r) => r.id)
    expect(ids.some((id) => id.startsWith('court'))).toBe(true)
  })

  it('filters by ageBand — 10-12 tier should not return 18-21-only chunks', () => {
    const results = retrieve('extended foster care EFC', '10-12', 5)
    results.forEach((r) => {
      expect(r.ageBands).toContain('10-12')
    })
  })

  it('returns at most maxResults chunks', () => {
    const results = retrieve('rights', '16-17', 2)
    expect(results.length).toBeLessThanOrEqual(2)
  })

  it('returns empty array for completely unrelated query', () => {
    const results = retrieve('xyznonsense404', '16-17', 3)
    expect(results.length).toBe(0)
  })
})
```

**Step 2: Run test to verify it fails**

```bash
cd server && npm test
```
Expected: FAIL — `Cannot find module '../rag/retriever.js'`

**Step 3: Implement `server/src/rag/retriever.ts`**

```typescript
import lunr from 'lunr'
import { ALL_CHUNKS } from './chunks.js'
import type { AgeBand, KnowledgeChunk } from '../types/index.js'

// Build the lunr index once at module load time
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
  maxResults = 5
): KnowledgeChunk[] {
  let results: lunr.Index.Result[]
  try {
    results = index.search(query)
  } catch {
    // lunr throws on empty/malformed queries
    return []
  }

  return results
    .map((r) => chunkById.get(r.ref))
    .filter((c): c is KnowledgeChunk => c !== undefined && c.ageBands.includes(ageBand))
    .slice(0, maxResults)
}
```

**Step 4: Run tests to verify they pass**

```bash
npm test
```
Expected: all 5 retriever tests PASS

**Step 5: Commit**

```bash
git add server/src/rag/retriever.ts server/src/__tests__/retriever.test.ts
git commit -m "feat: add lunr-based RAG retrieval engine with age-band filtering"
```

---

## Phase 4 — Chat API

### Task 9: Crisis detection middleware (TDD)

**Files:**
- Create: `server/src/__tests__/crisis.test.ts`
- Create: `server/src/middleware/crisis.ts`

**Step 1: Write the failing test**

```typescript
// server/src/__tests__/crisis.test.ts
import { describe, it, expect } from 'vitest'
import { detectCrisis } from '../middleware/crisis.js'

describe('detectCrisis', () => {
  it('detects explicit self-harm language', () => {
    expect(detectCrisis('I want to hurt myself')).toBe(true)
    expect(detectCrisis('thinking about suicide')).toBe(true)
    expect(detectCrisis("I don't want to live anymore")).toBe(true)
  })

  it('detects abuse disclosures', () => {
    expect(detectCrisis('my foster parent hit me')).toBe(true)
    expect(detectCrisis('someone is abusing me')).toBe(true)
  })

  it('detects crisis phrases', () => {
    expect(detectCrisis('I need help right now emergency')).toBe(true)
    expect(detectCrisis('kill myself')).toBe(true)
  })

  it('does not false-positive on normal foster care questions', () => {
    expect(detectCrisis('when is my next court hearing')).toBe(false)
    expect(detectCrisis('what are my rights to see my siblings')).toBe(false)
    expect(detectCrisis('how do I apply for ETV')).toBe(false)
  })
})
```

**Step 2: Run to confirm failure**

```bash
npm test
```
Expected: FAIL — `Cannot find module '../middleware/crisis.js'`

**Step 3: Implement `server/src/middleware/crisis.ts`**

```typescript
// server/src/middleware/crisis.ts
import type { CrisisResource } from '../types/index.js'

const CRISIS_PATTERNS = [
  /\b(suicid|kill\s+myself|end\s+my\s+life|don'?t\s+want\s+to\s+live|hurt\s+myself|self.?harm|cutting\s+myself)\b/i,
  /\b(abuse[sd]?|being\s+hit|someone\s+hurt\s+me|foster\s+parent\s+hit)\b/i,
  /\b(emergency|help\s+me\s+now|in\s+danger|not\s+safe\s+right\s+now)\b/i,
]

export function detectCrisis(text: string): boolean {
  return CRISIS_PATTERNS.some((pattern) => pattern.test(text))
}

export const CRISIS_RESOURCES: CrisisResource[] = [
  { name: '988 Suicide & Crisis Lifeline', number: '988', description: 'Call or text 988 — free, confidential, 24/7' },
  { name: 'Crisis Text Line', number: '741741', text: 'HOME to 741741', description: 'Text HOME to 741741 — free, confidential, 24/7' },
  { name: 'DCS Child Abuse Hotline', number: '1-888-767-2445', description: 'If you are unsafe in your placement — 24/7' },
  { name: 'ALWAYS Legal (Foster Youth)', number: '1-855-ALWAYS-1', description: 'Free legal help if your rights are being violated' },
]
```

**Step 4: Run tests to verify they pass**

```bash
npm test
```
Expected: all crisis tests PASS

**Step 5: Commit**

```bash
git add server/src/middleware/crisis.ts server/src/__tests__/crisis.test.ts
git commit -m "feat: add crisis keyword detection middleware and crisis resource list"
```

---

### Task 10: Age-adaptive prompt builder (TDD)

**Files:**
- Create: `server/src/__tests__/prompt.test.ts`
- Create: `server/src/rag/prompt.ts`

**Step 1: Write the failing test**

```typescript
// server/src/__tests__/prompt.test.ts
import { describe, it, expect } from 'vitest'
import { buildPrompt } from '../rag/prompt.js'
import type { KnowledgeChunk } from '../types/index.js'

const mockChunks: KnowledgeChunk[] = [
  {
    id: 'right-safety',
    text: 'You have the right to live in a safe home.',
    citation: 'A.R.S. §8-529(A)(2)',
    tags: ['rights', 'safety'],
    ageBands: ['10-12', '13-15', '16-17', '18-21'],
  },
]

describe('buildPrompt', () => {
  it('includes the user message', () => {
    const prompt = buildPrompt('what are my rights', '13-15', mockChunks)
    expect(prompt).toContain('what are my rights')
  })

  it('includes the retrieved context', () => {
    const prompt = buildPrompt('safety', '13-15', mockChunks)
    expect(prompt).toContain('safe home')
    expect(prompt).toContain('A.R.S. §8-529(A)(2)')
  })

  it('includes age-appropriate tone instruction for 10-12', () => {
    const prompt = buildPrompt('my rights', '10-12', mockChunks)
    expect(prompt.toLowerCase()).toContain('simple')
  })

  it('includes age-appropriate tone instruction for 18-21', () => {
    const prompt = buildPrompt('my rights', '18-21', mockChunks)
    expect(prompt.toLowerCase()).toContain('full')
  })

  it('includes the citation requirement instruction', () => {
    const prompt = buildPrompt('my rights', '16-17', mockChunks)
    expect(prompt.toLowerCase()).toContain('cit')
  })

  it('handles empty chunks gracefully', () => {
    const prompt = buildPrompt('unrelated question', '13-15', [])
    expect(prompt).toBeTruthy()
    expect(prompt).toContain('unrelated question')
  })
})
```

**Step 2: Run to confirm failure**

```bash
npm test
```
Expected: FAIL — `Cannot find module '../rag/prompt.js'`

**Step 3: Implement `server/src/rag/prompt.ts`**

```typescript
import type { AgeBand, KnowledgeChunk } from '../types/index.js'

const TONE_BY_BAND: Record<AgeBand, string> = {
  '10-12': 'Use very simple language (2nd–3rd grade). Short sentences. Friendly and reassuring. Avoid legal jargon entirely.',
  '13-15': 'Use plain language (5th–6th grade). Clear paragraphs. Explain legal terms when you use them.',
  '16-17': 'Use clear, detailed language with action items. The reader is becoming an adult and can handle specifics.',
  '18-21': 'Use full, professional language. Include all relevant details, deadlines, and next steps.',
}

export function buildPrompt(
  userMessage: string,
  ageBand: AgeBand,
  chunks: KnowledgeChunk[]
): string {
  const toneInstruction = TONE_BY_BAND[ageBand]

  const contextBlock =
    chunks.length > 0
      ? chunks
          .map((c) => `[Source: ${c.citation}]\n${c.text}`)
          .join('\n\n')
      : 'No specific knowledge base content found for this query.'

  return `You are FosterGuide AZ, an information tool for Arizona foster youth.

TONE: ${toneInstruction}

RULES:
- Answer ONLY questions about Arizona foster care, youth rights, court processes, and related resources.
- Every factual or legal claim MUST include a citation from the provided sources. Format: (Source: <citation>)
- If the answer is not in the provided context, say so clearly and direct the user to 211 Arizona or their caseworker.
- You are an information tool, not a counselor, attorney, or friend. Do not provide legal advice.
- End EVERY response with: "This is information, not legal or medical advice. For your specific situation, talk to your attorney, caseworker, or doctor."
- Keep responses concise. Bullet points are encouraged.

KNOWLEDGE BASE CONTEXT:
${contextBlock}

USER QUESTION: ${userMessage}

Answer:`
}
```

**Step 4: Run tests to verify they pass**

```bash
npm test
```
Expected: all prompt tests PASS

**Step 5: Commit**

```bash
git add server/src/rag/prompt.ts server/src/__tests__/prompt.test.ts
git commit -m "feat: add age-adaptive RAG prompt builder with citation requirements"
```

---

### Task 11: Claude API wrapper

**Files:**
- Create: `server/.env` (gitignored)
- Create: `server/src/rag/claude.ts`

**Step 1: Create `server/.env`**

```
ANTHROPIC_API_KEY=your_key_here
FRONTEND_ORIGIN=http://localhost:5173
PORT=3001
```

**Step 2: Create `server/src/rag/claude.ts`**

```typescript
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function generateResponse(prompt: string): Promise<string> {
  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
  })

  const content = message.content[0]
  if (content.type !== 'text') {
    throw new Error('Unexpected response type from Claude API')
  }

  return content.text
}
```

**Step 3: Smoke test (manual — requires API key)**

```bash
cd server
# Set your real key first in server/.env
npm run dev
# In another terminal:
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"what are my rights","ageBand":"13-15","language":"en"}'
```
Expected: JSON response with `reply`, `citations`, `isCrisis: false`

(This test will be wired up after the route is created in Task 12.)

**Step 4: Commit**

```bash
git add server/src/rag/claude.ts
git commit -m "feat: add Anthropic SDK wrapper for Claude Haiku generation"
```

---

### Task 12: Chat route — wire everything together

**Files:**
- Create: `server/src/routes/chat.ts`
- Modify: `server/src/index.ts`

**Step 1: Create `server/src/routes/chat.ts`**

```typescript
import { Router } from 'express'
import { z } from 'zod'
import { retrieve } from '../rag/retriever.js'
import { buildPrompt } from '../rag/prompt.js'
import { generateResponse } from '../rag/claude.js'
import { detectCrisis, CRISIS_RESOURCES } from '../middleware/crisis.js'
import type { ChatResponse } from '../types/index.js'

const router = Router()

const ChatRequestSchema = z.object({
  message: z.string().min(1).max(2000),
  ageBand: z.enum(['10-12', '13-15', '16-17', '18-21']),
  language: z.enum(['en', 'es']).default('en'),
  county: z.string().optional(),
  screenContext: z.string().optional(),
})

router.post('/', async (req, res) => {
  const parsed = ChatRequestSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid request', details: parsed.error.issues })
    return
  }

  const { message, ageBand } = parsed.data

  // Crisis check first — always
  if (detectCrisis(message)) {
    const response: ChatResponse = {
      reply:
        "I'm a tool that provides information. I'm not able to provide the kind of support you need right now. Here are people who can help you — please reach out to them.",
      citations: [],
      isCrisis: true,
      crisisResources: CRISIS_RESOURCES,
    }
    res.json(response)
    return
  }

  // Retrieve relevant knowledge chunks
  const chunks = retrieve(message, ageBand, 5)

  // Build age-adaptive prompt
  const prompt = buildPrompt(message, ageBand, chunks)

  // Generate response via Claude
  let reply: string
  try {
    reply = await generateResponse(prompt)
  } catch (err) {
    console.error('Claude API error:', err)
    res.status(503).json({
      error: 'AI service temporarily unavailable. Please try again or contact 211 Arizona (call/text 211).',
    })
    return
  }

  // Extract citations from retrieved chunks
  const citations = chunks.map((c) => ({ label: c.citation }))

  const response: ChatResponse = {
    reply,
    citations,
    isCrisis: false,
  }
  res.json(response)
})

export default router
```

**Step 2: Wire the route into `server/src/index.ts`**

Replace the file content with:

```typescript
import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import chatRouter from './routes/chat.js'

const app = express()
app.use(cors({ origin: process.env.FRONTEND_ORIGIN ?? 'http://localhost:5173' }))
app.use(express.json())

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', version: '0.1.0' })
})

app.use('/api/chat', chatRouter)

const PORT = Number(process.env.PORT ?? 3001)
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))
```

**Step 3: Run dev server and test end-to-end**

```bash
cd server && npm run dev
# In another terminal:
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"what are my rights to see my siblings","ageBand":"13-15","language":"en"}'
```
Expected: JSON with `reply` (from Claude), `citations` (including A.R.S. §8-529 reference), `isCrisis: false`

**Step 4: Test crisis detection**

```bash
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"I want to hurt myself","ageBand":"13-15","language":"en"}'
```
Expected: JSON with `isCrisis: true` and `crisisResources` array, no call to Claude

**Step 5: Commit**

```bash
git add server/src/routes/chat.ts server/src/index.ts
git commit -m "feat: wire RAG chat route — retrieve, prompt, generate, crisis-gate"
```

---

## Phase 5 — Frontend Integration

### Task 13: Add API client and environment config to frontend

**Files:**
- Create: `preview/.env.local`
- Create: `preview/src/api/chat.ts`
- Modify: `preview/vite.config.ts` (add dev proxy)

**Step 1: Create `preview/.env.local`**

```
VITE_API_URL=http://localhost:3001
```

**Step 2: Create `preview/src/api/chat.ts`**

```typescript
const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3001'

export type AgeBand = '10-12' | '13-15' | '16-17' | '18-21'
export type Language = 'en' | 'es'

export interface ChatApiResponse {
  reply: string
  citations: { label: string; url?: string }[]
  isCrisis: boolean
  crisisResources?: { name: string; number: string; text?: string; description: string }[]
}

export async function sendChatMessage(
  message: string,
  ageBand: AgeBand,
  language: Language,
  county?: string,
  screenContext?: string
): Promise<ChatApiResponse> {
  const res = await fetch(`${API_BASE}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, ageBand, language, county, screenContext }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error ?? `Chat API returned ${res.status}`)
  }

  return res.json() as Promise<ChatApiResponse>
}
```

**Step 3: Add dev proxy to `preview/vite.config.ts`**

The existing vite.config.ts likely looks like:
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/postcss'

export default defineConfig({
  plugins: [react()],
  css: { postcss: { plugins: [tailwindcss()] } },
})
```

Add the `server.proxy` field so the frontend dev server forwards `/api` calls to the backend:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/postcss'

export default defineConfig({
  plugins: [react()],
  css: { postcss: { plugins: [tailwindcss()] } },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
})
```

**Step 4: Commit**

```bash
git add preview/src/api/chat.ts preview/vite.config.ts
git commit -m "feat: add chat API client and dev proxy to frontend"
```

---

### Task 14: Replace `aiSimReply` with real API call in `FosterGuideAZPrototype.tsx`

**Files:**
- Modify: `preview/src/FosterGuideAZPrototype.tsx`

**Context:** The prototype has an `aiSimReply(msg)` function and a `handleSend` function inside the chat modal. Find the `handleSend` (or equivalent send logic) and replace it with a real API call.

**Step 1: Read the current chat send logic**

Find the `aiSimReply` function and `handleSend` by searching the file for those names. Note exact line numbers.

**Step 2: Add import at top of file**

At the top of `FosterGuideAZPrototype.tsx`, add:

```typescript
import { sendChatMessage } from './api/chat'
```

**Step 3: Replace the `handleSend` logic**

The current pattern looks approximately like:
```typescript
const handleSend = () => {
  if (!input.trim()) return
  const userMsg = { role: 'user', content: input }
  setMessages(prev => [...prev, userMsg])
  setInput('')
  const botReply = aiSimReply(input)
  setMessages(prev => [...prev, { role: 'bot', content: botReply }])
}
```

Replace with:
```typescript
const handleSend = async () => {
  if (!input.trim() || sending) return
  const text = input.trim()
  setInput('')
  setSending(true)
  setMessages(prev => [...prev, { role: 'user' as const, content: text }])

  try {
    const response = await sendChatMessage(
      text,
      userCtx.ageBand,
      userCtx.language as 'en' | 'es',
      userCtx.county,
      route
    )

    if (response.isCrisis && response.crisisResources) {
      setMessages(prev => [
        ...prev,
        { role: 'bot' as const, content: response.reply, isCrisis: true, crisisResources: response.crisisResources },
      ])
    } else {
      setMessages(prev => [
        ...prev,
        { role: 'bot' as const, content: response.reply, citations: response.citations },
      ])
    }
  } catch {
    setMessages(prev => [
      ...prev,
      { role: 'bot' as const, content: 'I\'m having trouble connecting right now. For urgent help, call 211 Arizona or text/call 988.' },
    ])
  } finally {
    setSending(false)
  }
}
```

Also add `const [sending, setSending] = useState(false)` near the other chat state hooks.

**Step 4: Add a loading indicator in the chat UI**

Find where the send button is rendered in the ChatModal. Add a loading spinner when `sending` is true:

```tsx
<button
  onClick={handleSend}
  disabled={sending || !input.trim()}
  className="..."
>
  {sending ? '...' : 'Send'}
</button>
```

**Step 5: Build to verify no TypeScript errors**

```bash
cd preview && npm run build
```
Expected: exit code 0

**Step 6: Commit**

```bash
git add preview/src/FosterGuideAZPrototype.tsx preview/src/api/
git commit -m "feat: wire chat modal to real RAG API, replace aiSimReply"
```

---

## Phase 6 — PWA Setup

### Task 15: Add PWA manifest and vite-plugin-pwa

**Files:**
- Create: `preview/public/manifest.json`
- Modify: `preview/vite.config.ts`

**Step 1: Install vite-plugin-pwa**

```bash
cd preview && npm install -D vite-plugin-pwa
```

**Step 2: Create `preview/public/manifest.json`**

```json
{
  "name": "FosterGuide AZ",
  "short_name": "FosterGuide",
  "description": "Know your rights. Understand your case. Find resources.",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#F5F2EE",
  "theme_color": "#2A7F8E",
  "orientation": "portrait",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any maskable" }
  ]
}
```

Note: create simple placeholder icon PNGs in `preview/public/` (solid teal square) — replace with proper icons before launch.

**Step 3: Update `preview/vite.config.ts` to add PWA plugin**

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/postcss'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: false, // we use our own manifest.json
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\./,
            handler: 'CacheFirst',
            options: { cacheName: 'fonts', expiration: { maxAgeSeconds: 60 * 60 * 24 * 365 } },
          },
        ],
      },
    }),
  ],
  css: { postcss: { plugins: [tailwindcss()] } },
  server: {
    proxy: {
      '/api': { target: 'http://localhost:3001', changeOrigin: true },
    },
  },
})
```

**Step 4: Add manifest link to `preview/index.html`**

In `<head>`:
```html
<link rel="manifest" href="/manifest.json" />
<meta name="theme-color" content="#2A7F8E" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="default" />
```

**Step 5: Build and verify**

```bash
cd preview && npm run build
```
Expected: `dist/` contains `sw.js` (service worker)

**Step 6: Commit**

```bash
git add preview/public/manifest.json preview/vite.config.ts preview/index.html
git commit -m "feat: add PWA manifest and service worker via vite-plugin-pwa"
```

---

## Phase 7 — Session Safety & Final Verification

### Task 16: Session boundary reminder (20-minute non-blocking prompt)

**Files:**
- Modify: `preview/src/FosterGuideAZPrototype.tsx`

**Step 1: Add session timer state**

Near the top of the main component, add:
```typescript
const [showBreakReminder, setShowBreakReminder] = useState(false)
useEffect(() => {
  const timer = setTimeout(() => setShowBreakReminder(true), 20 * 60 * 1000)
  return () => clearTimeout(timer)
}, []) // runs once per mount (session)
```

**Step 2: Render the non-blocking reminder banner**

At the bottom of the main `<div>` (above the `<TabBar>`), add:
```tsx
{showBreakReminder && (
  <div className="fixed top-16 left-0 right-0 z-40 flex justify-center pointer-events-none">
    <div
      className="mx-4 mt-2 px-4 py-3 rounded-xl shadow-lg text-sm flex items-center gap-3 pointer-events-auto"
      style={{ backgroundColor: '#2A7F8E', color: '#fff', maxWidth: 400 }}
    >
      <span>You've been here a while. Take a break when you need one — this will still be here.</span>
      <button
        onClick={() => setShowBreakReminder(false)}
        className="ml-auto text-white/80 hover:text-white font-medium shrink-0"
        aria-label="Dismiss"
      >
        ✕
      </button>
    </div>
  </div>
)}
```

**Step 3: Build to verify no TypeScript errors**

```bash
cd preview && npm run build
```
Expected: exit code 0

**Step 4: Commit**

```bash
git add preview/src/FosterGuideAZPrototype.tsx
git commit -m "feat: add 20-minute session boundary reminder (trauma-informed UX)"
```

---

### Task 17: Final verification

**Step 1: Run all server tests**

```bash
cd server && npm test
```
Expected: all tests PASS (retriever × 5, crisis × 4, prompt × 6)

**Step 2: Run frontend build**

```bash
cd preview && npm run build
```
Expected: exit code 0, no TypeScript errors

**Step 3: Run both together and smoke test**

Terminal 1:
```bash
cd server && npm run dev
```

Terminal 2:
```bash
cd preview && npm run dev
```

Open `http://localhost:5173` in a browser:
- [ ] Onboarding loads, age/county/pathway selectable
- [ ] Quick exit button visible on every screen
- [ ] Back button navigates from feature → home
- [ ] Chat modal opens from any screen
- [ ] Chat sends a message and receives a real Claude response
- [ ] Crisis message (`I want to hurt myself`) shows crisis resources and skips Claude
- [ ] Resources screen shows 50+ entries with filter chips
- [ ] Rights screen shows all §8-529 rights with citations
- [ ] Court screen shows 8-stage timeline
- [ ] Session reminder appears after 20 minutes (or test with a shorter timer value temporarily)

**Step 4: Final commit**

```bash
git add -A
git commit -m "chore: MVP Phase 1 complete — RAG chat, full content, PWA"
```

---

## Running the Full Stack

```bash
# Terminal 1 — backend
cd server && npm install && npm run dev

# Terminal 2 — frontend
cd preview && npm run dev
```

Frontend: `http://localhost:5173`
API: `http://localhost:3001`
Health check: `http://localhost:3001/health`

### Environment Variables

| Variable | Location | Required | Description |
|----------|----------|----------|-------------|
| `ANTHROPIC_API_KEY` | `server/.env` | Yes | Your Anthropic API key |
| `FRONTEND_ORIGIN` | `server/.env` | No | Default: `http://localhost:5173` |
| `PORT` | `server/.env` | No | Default: `3001` |
| `VITE_API_URL` | `preview/.env.local` | No | Default: `http://localhost:3001` |
