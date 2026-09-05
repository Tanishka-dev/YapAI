export type Role = "user" | "assistant"
export type View = "home" | "chat"

export type Message = {
  id: string
  role: Role
  content: string
}

export type Session = {
  id: string
  title: string
  messages: Message[]
  updatedAt: number
}

export type ChatStore = {
  sessions: Session[]
  activeId: string
  view: View
}

export const MAX_PROMPT = 1000
const STORAGE_KEY = "yapai.chat"

export function createSession(): Session {
  return {
    id: crypto.randomUUID(),
    title: "New chat",
    messages: [],
    updatedAt: Date.now(),
  }
}

export function emptyStore(): ChatStore {
  const session = createSession()
  return { sessions: [session], activeId: session.id, view: "home" }
}

export function loadStore(): ChatStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return emptyStore()
    const parsed = JSON.parse(raw) as Partial<ChatStore>
    if (!Array.isArray(parsed.sessions) || parsed.sessions.length === 0) {
      return emptyStore()
    }
    const sessions = parsed.sessions.map((session) => ({
      ...session,
      updatedAt: session.updatedAt ?? Date.now(),
    }))
    const activeId = sessions.some((s) => s.id === parsed.activeId)
      ? parsed.activeId!
      : sessions[0].id
    const view = parsed.view === "chat" ? "chat" : "home"
    return { sessions, activeId, view }
  } catch {
    return emptyStore()
  }
}

export function saveStore(store: ChatStore) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
}

export function titleFromPrompt(prompt: string) {
  const compact = prompt.trim().replace(/\s+/g, " ")
  return compact.length <= 40 ? compact : `${compact.slice(0, 40).trimEnd()}…`
}

export function formatRelativeTime(ts: number) {
  const diff = Date.now() - ts
  const minutes = Math.floor(diff / 60_000)
  if (minutes < 1) return "Just now"
  if (minutes < 60) {
    return new Date(ts).toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    })
  }
  const days = Math.floor(diff / 86_400_000)
  if (days === 1) return "Yesterday"
  if (days > 1) return `${days} days ago`
  return new Date(ts).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  })
}

type ChatApiResponse = {
  message?: string
  sessionId?: string
  error?: string
}

export async function sendMessage(prompt: string, sessionId: string) {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, sessionId }),
  })

  const data = (await res.json().catch(() => ({}))) as ChatApiResponse
  if (!res.ok) {
    throw new Error(readApiError(data.error) ?? "Request failed")
  }
  if (!data.message) {
    throw new Error("Empty assistant reply")
  }
  return data.message
}

function readApiError(error: unknown) {
  if (typeof error !== "string") return null
  try {
    const parsed = JSON.parse(error) as { message?: string }[]
    if (Array.isArray(parsed) && parsed[0]?.message) {
      return parsed[0].message
    }
  } catch {
    return error
  }
  return error
}
