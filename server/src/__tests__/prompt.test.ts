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

  it('includes the retrieved context and citation', () => {
    const prompt = buildPrompt('safety', '13-15', mockChunks)
    expect(prompt).toContain('safe home')
    expect(prompt).toContain('A.R.S. §8-529(A)(2)')
  })

  it('includes simple tone instruction for 10-12', () => {
    const prompt = buildPrompt('my rights', '10-12', mockChunks)
    expect(prompt.toLowerCase()).toContain('simple')
  })

  it('includes full tone instruction for 18-21', () => {
    const prompt = buildPrompt('my rights', '18-21', mockChunks)
    expect(prompt.toLowerCase()).toContain('full')
  })

  it('includes citation requirement instruction', () => {
    const prompt = buildPrompt('my rights', '16-17', mockChunks)
    expect(prompt.toLowerCase()).toContain('cit')
  })

  it('handles empty chunks gracefully', () => {
    const prompt = buildPrompt('unrelated question', '13-15', [])
    expect(prompt).toBeTruthy()
    expect(prompt).toContain('unrelated question')
  })
})
