import { describe, it, expect, vi } from 'vitest'

// Mock Claude to avoid real API calls
vi.mock('../rag/claude.js', () => ({
  generateResponse: vi.fn().mockResolvedValue('Mocked response from Compass'),
}))

import request from 'supertest'
import { app } from '../index.js'

describe('POST /api/chat', () => {
  it('passes language=es through and returns 200', async () => {
    const res = await request(app).post('/api/chat').send({
      message: '¿Cuáles son mis derechos?',
      ageBand: '13-15',
      language: 'es',
    })
    expect(res.status).toBe(200)
    expect(res.body.reply).toBeTruthy()
    expect(res.body.isCrisis).toBe(false)
  })

  it('defaults to en when language omitted and returns 200', async () => {
    const res = await request(app).post('/api/chat').send({
      message: 'What are my rights?',
      ageBand: '13-15',
    })
    expect(res.status).toBe(200)
    expect(res.body.reply).toBeTruthy()
  })

  it('returns 400 for invalid request', async () => {
    const res = await request(app).post('/api/chat').send({
      message: '',
      ageBand: '13-15',
    })
    expect(res.status).toBe(400)
  })
})
