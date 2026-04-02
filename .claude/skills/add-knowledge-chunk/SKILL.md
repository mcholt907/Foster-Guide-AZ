---
name: add-knowledge-chunk
description: Add a new knowledge chunk to the RAG knowledge base with correct schema, ARS citations, and age-band assignments
---

When adding entries to server/src/data/rights.ts, court.ts, or resources.ts:

SCHEMA (KnowledgeChunk):
  id:        "<category>-<kebab-slug>"   e.g. "rights-sibling-visits"
  text:      plain-language content (reading level rules below)
  citation:  "A.R.S. §8-529(X)" | "DCS Policy MM-YYYY" | org name for resources
  ageBands:  AgeBand[] — include all applicable bands
  category:  "rights" | "court" | "resources" | "future"

READING LEVEL BY BAND:
  10-12 → max 4th-grade, short sentences, zero unexplained acronyms
  13-15 → max 6th-grade, plain language
  16-17 → plain English, define any term on first use
  18-21 → complete info: deadlines, program names, phone numbers

AGE-BAND ASSIGNMENT RULES:
  EFC / ETV / Extended Foster Care → EXCLUDE "10-12"
  Crisis / safety content          → include ALL bands
  Court process content            → include ALL bands

AFTER ADDING: run `cd server && npm test` to verify retrieval works.
