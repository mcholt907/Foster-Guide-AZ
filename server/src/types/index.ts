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
  text: string        // English text to index and retrieve
  text_es?: string    // Spanish translation — if absent, falls back to English
  citation: string    // the source to attach to responses using this chunk
  tags: string[]      // categories: rights, court, resources, transition, etc.
  ageBands: AgeBand[] // which age tiers this chunk applies to
}
