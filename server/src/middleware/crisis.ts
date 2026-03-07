import type { CrisisResource } from '../types/index.js'

const CRISIS_PATTERNS = [
  /\bsuicid(e|al|ality)?\b/i,
  /\bkill\s+myself\b/i,
  /\bend\s+my\s+life\b/i,
  /\bdon'?t\s+want\s+to\s+live\b/i,
  /\bhurt\s+myself\b/i,
  /\bself[.\s-]?harm\b/i,
  /\bcutting\s+myself\b/i,
  /\b(abused?|abusing)\b/i,
  /\bbeing\s+hit\b/i,
  /\bsomeone\s+(hurt|hit)\s+me\b/i,
  /\bfoster\s+parent\s+hit\b/i,
  /\bhelp\s+me\s+now\b/i,
  /\bin\s+danger\b/i,
  /\bnot\s+safe\s+right\s+now\b/i,
]

export function detectCrisis(text: string): boolean {
  return CRISIS_PATTERNS.some((pattern) => pattern.test(text))
}

export const CRISIS_RESOURCES: CrisisResource[] = [
  { name: '988 Suicide & Crisis Lifeline', number: '988', description: 'Call or text 988 — free, confidential, 24/7' },
  { name: 'Crisis Text Line', number: '741741', text: 'HOME to 741741', description: 'Text HOME to 741741 — free, confidential, 24/7' },
  { name: 'DCS Child Abuse Hotline', number: '1-888-767-2445', description: 'If you are unsafe in your placement — 24/7' },
  { name: 'ALWAYS Legal (Foster Youth)', number: '1-855-ALWAYS-1', description: 'Free legal help if your rights are being violated' },
]
