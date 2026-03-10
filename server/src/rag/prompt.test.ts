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

  it('falls back to English text when text_es is missing', () => {
    const chunksNoEs = [{ ...mockChunks[0], text_es: undefined }]
    const prompt = buildPrompt('¿Cuáles son mis derechos?', '13-15', chunksNoEs, 'es')
    expect(prompt).toContain('You have the right to participate')
  })
})
