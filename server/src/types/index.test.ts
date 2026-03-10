// server/src/types/index.test.ts
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
