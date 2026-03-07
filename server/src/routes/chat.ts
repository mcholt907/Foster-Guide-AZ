import { Router } from 'express'
import { z } from 'zod'
import { retrieve } from '../rag/retriever.js'
import { buildPrompt } from '../rag/prompt.js'
import { generateResponse } from '../rag/claude.js'
import { detectCrisis, CRISIS_RESOURCES } from '../middleware/crisis.js'
import type { ChatResponse } from '../types/index.js'

const router = Router()

const ChatRequestSchema = z.object({
  message: z.string().min(1).max(2000),
  ageBand: z.enum(['10-12', '13-15', '16-17', '18-21']),
  language: z.enum(['en', 'es']).default('en'),
  county: z.string().optional(),
  screenContext: z.string().optional(),
})

router.post('/', async (req, res) => {
  const parsed = ChatRequestSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid request', details: parsed.error.issues })
    return
  }

  const { message, ageBand } = parsed.data

  // Crisis check first — always, before any AI call
  if (detectCrisis(message)) {
    const response: ChatResponse = {
      reply:
        "I'm a tool that provides information. I'm not able to provide the kind of support you need right now. Here are people who can help you — please reach out to them.",
      citations: [],
      isCrisis: true,
      crisisResources: CRISIS_RESOURCES,
    }
    res.json(response)
    return
  }

  // Retrieve relevant knowledge chunks
  const chunks = retrieve(message, ageBand, 5)

  // Build age-adaptive prompt
  const prompt = buildPrompt(message, ageBand, chunks)

  // Generate response via Claude
  let reply: string
  try {
    reply = await generateResponse(prompt)
  } catch (err) {
    console.error('Claude API error:', err)
    res.status(503).json({
      error: 'AI service temporarily unavailable. Please try again or contact 211 Arizona (call/text 211).',
    })
    return
  }

  // Extract citations from retrieved chunks
  const citations = chunks.map((c) => ({ label: c.citation }))

  const response: ChatResponse = {
    reply,
    citations,
    isCrisis: false,
  }
  res.json(response)
})

export default router
