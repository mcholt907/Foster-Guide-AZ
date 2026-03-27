const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export interface ChatApiResponse {
  reply: string;
  citations: { label: string; url?: string }[];
  isCrisis: boolean;
  crisisResources?: { name: string; number: string; text?: string; description: string }[];
}

export async function sendChatMessage(
  message: string,
  ageBand: string,
  language: "en" | "es",
  county?: string | null,
  screenContext?: string
): Promise<ChatApiResponse> {
  const res = await fetch(`${API_BASE}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, ageBand, language, county, screenContext }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error ?? `Chat API returned ${res.status}`);
  }

  return res.json() as Promise<ChatApiResponse>;
}
