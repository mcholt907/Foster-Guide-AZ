import { describe, it, expect } from 'vitest'
import { retrieve } from '../rag/retriever.js'

describe('retrieve', () => {
  it('returns relevant chunks for a sibling rights query', () => {
    const results = retrieve('sibling visits contact family', '13-15', 3)
    expect(results.length).toBeGreaterThan(0)
  })

  it('returns court chunks for a court process query', () => {
    const results = retrieve('what happens at my hearing judge', '13-15', 5)
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
