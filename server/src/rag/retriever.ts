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
  _language: Language = 'en'
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
