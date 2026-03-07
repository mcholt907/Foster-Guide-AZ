const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3001'

export type AgeBand = '10-12' | '13-15' | '16-17' | '18-21'
export type Language = 'en' | 'es'

export interface ChatApiResponse {
  reply: string
  citations: { label: string; url?: string }[]
  isCrisis: boolean
  crisisResources?: { name: string; number: string; text?: string; description: string }[]
}

export async function sendChatMessage(
  message: string,
  ageBand: AgeBand,
  language: Language,
  county?: string,
  screenContext?: string
): Promise<ChatApiResponse> {
  const res = await fetch(`${API_BASE}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, ageBand, language, county, screenContext }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error((err as { error?: string }).error ?? `Chat API returned ${res.status}`)
  }

  return res.json() as Promise<ChatApiResponse>
}
