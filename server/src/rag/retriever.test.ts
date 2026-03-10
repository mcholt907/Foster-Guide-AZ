import { describe, it, expect } from 'vitest'
import { retrieve } from './retriever.js'

describe('retrieve', () => {
  it('returns English text for en language', () => {
    const results = retrieve('siblings contact visit', '13-15', 5, 'en')
    expect(results.length).toBeGreaterThan(0)
    results.forEach(c => expect(c.text).toBeTruthy())
  })

  it('returns results for es language (English index, Spanish-capable Claude)', () => {
    const results = retrieve('siblings contact visit', '13-15', 5, 'es')
    expect(results.length).toBeGreaterThan(0)
  })

  it('accepts language parameter without error', () => {
    expect(() => retrieve('rights', '16-17', 3, 'es')).not.toThrow()
    expect(() => retrieve('rights', '16-17', 3, 'en')).not.toThrow()
  })
})
