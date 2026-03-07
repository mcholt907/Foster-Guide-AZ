import { RIGHTS_CHUNKS } from '../data/rights.js'
import { COURT_CHUNKS } from '../data/court.js'
import { RESOURCES } from '../data/resources.js'
import type { KnowledgeChunk, AgeBand } from '../types/index.js'

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
    ageBands: ['10-12', '13-15', '16-17', '18-21'] as AgeBand[],
  }))
}

export const ALL_CHUNKS: KnowledgeChunk[] = [
  ...RIGHTS_CHUNKS,
  ...COURT_CHUNKS,
  ...resourcesAsChunks(),
]
