import { useEffect, useMemo, useState } from "react"
import {
  createSession,
  loadStore,
  MAX_PROMPT,
  saveStore,
  sendMessage,
  titleFromPrompt,
  type ChatStore,
  type Message,
  type View,
} from "@/lib/chat"

export function useChat() {
  const [store, setStore] = useState<ChatStore>(loadStore)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    saveStore(store)
  }, [store])

  const active = useMemo(
    () =>
      store.sessions.find((session) => session.id === store.activeId) ??
      store.sessions[0],
    [store],
  )

  function setView(view: View) {
    setStore((prev) => ({ ...prev, view }))
  }

  function newChat() {
    const session = createSession()
    setStore((prev) => ({
      ...prev,
      sessions: [session, ...prev.sessions],
      activeId: session.id,
      view: "chat",
    }))
    setError(null)
  }

  function switchSession(id: string) {
    setStore((prev) => ({ ...prev, activeId: id, view: "chat" }))
    setError(null)
  }

  function deleteSession(id: string) {
    setStore((prev) => {
      const sessions = prev.sessions.filter((session) => session.id !== id)
      if (sessions.length === 0) {
        const next = createSession()
        return { ...prev, sessions: [next], activeId: next.id }
      }
      return {
        ...prev,
        sessions,
        activeId: prev.activeId === id ? sessions[0].id : prev.activeId,
      }
    })
    setError(null)
  }

  async function send(prompt: string) {
    const trimmed = prompt.trim()
    if (!trimmed || pending) return
    if (trimmed.length > MAX_PROMPT) {
      setError(`Prompt must be less than ${MAX_PROMPT} characters`)
      return
    }

    const sessionId = active.id
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
    }
    const now = Date.now()

    setError(null)
    setPending(true)
    setStore((prev) => ({
      ...prev,
      view: "chat",
      sessions: prev.sessions.map((session) =>
        session.id === sessionId
          ? {
              ...session,
              updatedAt: now,
              title:
                session.messages.length === 0
                  ? titleFromPrompt(trimmed)
                  : session.title,
              messages: [...session.messages, userMessage],
            }
          : session,
      ),
    }))

    try {
      const reply = await sendMessage(trimmed, sessionId)
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: reply,
      }
      setStore((prev) => ({
        ...prev,
        sessions: prev.sessions.map((session) =>
          session.id === sessionId
            ? {
                ...session,
                updatedAt: Date.now(),
                messages: [...session.messages, assistantMessage],
              }
            : session,
        ),
      }))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setPending(false)
    }
  }

  return {
    sessions: store.sessions,
    active,
    view: store.view,
    pending,
    error,
    send,
    newChat,
    switchSession,
    deleteSession,
    setView,
  }
}
