// ============================================================================
// ASK ANYTHING — backend proxy example
// ----------------------------------------------------------------------------
// Drop this route into your existing Express server (the same one that
// handles /api/contact). It keeps your Anthropic API key on the server —
// NEVER put it in the React app or a VITE_ env var, since anything prefixed
// VITE_ is bundled into the public JS bundle and visible to anyone.
//
// Setup:
//   npm install @anthropic-ai/sdk
//   Add ANTHROPIC_API_KEY=sk-ant-... to your server's .env
//   Mount this route: app.use('/api/ask', askRouter)
// ============================================================================

import express from 'express'
import Anthropic from '@anthropic-ai/sdk'

const router = express.Router()
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

router.post('/', async (req, res) => {
  try {
    const { messages, context } = req.body
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'No message provided' })
    }

    const systemPrompt = `You are the "Ask Anything" assistant embedded in ${context?.profile?.name}'s developer portfolio.
Answer only using the facts below — if something isn't covered, say you're not sure and suggest they reach out directly via the Book a Meeting option. Keep answers short (2-4 sentences), friendly, and in first person as if you were representing him professionally, but always speak of him in third person.

PROFILE: ${JSON.stringify(context?.profile)}
EXPERIENCE: ${JSON.stringify(context?.experience)}
PROJECTS: ${JSON.stringify(context?.projects)}
STACK: ${JSON.stringify(context?.stack)}`

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 400,
      system: systemPrompt,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    })

    const reply = response.content.find((b) => b.type === 'text')?.text?.trim()
    if (!reply) throw new Error('Empty response from model')

    res.json({ ok: true, reply })
  } catch (err) {
    console.error('Ask Anything error:', err)
    res.status(500).json({ error: 'The assistant is temporarily unavailable.' })
  }
})

export default router
