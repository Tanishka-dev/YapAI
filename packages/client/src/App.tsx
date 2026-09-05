import { useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent } from "react"
import { Brain, Home, Infinity as InfinityIcon, Lock, Menu, MessageCircle, Plus, Send, Trash2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { useChat } from "@/hooks/useChat"
import { formatRelativeTime, MAX_PROMPT } from "@/lib/chat"
import { cn } from "@/lib/utils"

function YapLogo({ className, size = 28 }: { className?: string; size?: number }) {
  const id = `yap${useId().replace(/:/g, "")}`
  const borderGrad = `${id}-border`
  return (
    <svg
      id={id}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      width={size}
      height={size}
      viewBox="0 0 256 256"
    >
      <defs>
        <linearGradient id={borderGrad} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#e879f9" />
        </linearGradient>
      </defs>
      {/* Bubble ring — gradient “border” */}
      <path
        fill={`url(#${borderGrad})`}
        d="M232,128A104,104,0,0,1,79.12,219.82L45.07,231.17a16,16,0,0,1-20.24-20.24l11.35-34.05A104,104,0,1,1,232,128Zm-16,0A88,88,0,1,0,51.81,172.06a8,8,0,0,1,.66,6.54L40,216,77.4,203.53a7.85,7.85,0,0,1,2.53-.42,8,8,0,0,1,4,1.08A88,88,0,0,0,216,128Z"
      />
      {/* Eyes */}
      <path
        fill={`url(#${borderGrad})`}
        d="M140,128a12,12,0,1,1-12-12A12,12,0,0,1,140,128ZM84,116a12,12,0,1,0,12,12A12,12,0,0,0,84,116Zm88,0a12,12,0,1,0,12,12A12,12,0,0,0,172,116Z"
      />
    </svg>
  )
}

export default function App() {
  const {
    sessions,
    active,
    view,
    pending,
    error,
    send,
    newChat,
    switchSession,
    deleteSession,
    setView,
  } = useChat()
  const [draft, setDraft] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" })
  }, [active.id, active.messages.length, pending])

  function startYapping() {
    newChat()
    setSidebarOpen(false)
  }

  function submit(event?: FormEvent) {
    event?.preventDefault()
    const value = draft
    setDraft("")
    void send(value)
    setSidebarOpen(false)
  }

  function onKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      submit()
    }
  }

  if (view === "home") {
    return (
      <div className="flex min-h-dvh flex-col bg-background text-foreground">
        <header className="flex items-center gap-2 px-6 py-5">
          <YapLogo size={100} className="drop-shadow-[0_0_12px_oklch(0.62_0.26_310_/_0.7)]" />
          <span className="text-6xl font-semibold tracking-tight">yapAI</span>
        </header>

        <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center px-6 pb-10 pt-6 text-center">
          <div className="relative mb-8">
            <p className="text-4xl leading-snug text-white/90 italic md:-right-28 ">
              rant, vent, dream, or overthink. I’m here.
            </p>
          </div>

          <h1 className="text-8xl font-semibold tracking-tight">
            Yap{" "}
            <span className="bg-gradient-to-r from-[#7c3aed] to-[#e879f9] bg-clip-text text-transparent">
              freely
            </span>
            .{" "}
            <span className="relative inline-block">
              We{" "}
              <span className="bg-gradient-to-r from-[#e879f9] to-[#7c3aed] bg-clip-text text-transparent">
                listen
              </span>
              .
              <span className="absolute inset-x-0 -bottom-1 h-2 rounded-full bg-gradient-to-r from-[#7c3aed]/80 to-[#e879f9]/80" />
            </span>
          </h1>
          <p className="mt-4 max-w-md text-xl text-muted-foreground">
            yapAI is your judgement-free space to yap, rant, and let it all out.
          </p>

          <Button
            size="lg"
            className="yap-gradient yap-glow mt-8 h-12 rounded-full px-8 text-base text-white"
            onClick={startYapping}
          >
            Start Yapping
          </Button>
          <p className="mt-3 text-xl text-muted-foreground">
            No limits. No judgement. Just you.
          </p>

          <div className=" mt-auto grid w-full gap-3 pt-16 sm:grid-cols-3">
            {[
              { icon: Lock, title: "Safe Space", copy: "Your thoughts stay private with us." },
              { icon: Brain, title: "No Judgement", copy: "Yap about anything, we don't judge." },
              { icon: InfinityIcon, title: "Yap Unlimited", copy: "Rant all you want. We've got time." },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-border bg-card/80 px-4 py-5 text-left"
              >
                <item.icon className="mb-3 size-5 text-primary" />
                <p className="text-lg font-medium">{item.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{item.copy}</p>
              </div>
            ))}
          </div>
        </main>
      </div>
    )
  }

  function renderSidebar() {
    return (
      <aside className="flex h-full w-86 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
        <div className="flex items-center justify-between px-4 py-4">
          <button
            type="button"
            className="flex items-center gap-2"
            onClick={() => {
              setView("home")
              setSidebarOpen(false)
            }}
          >
            <YapLogo size={100} />
            <span className="text-6xl font-semibold tracking-tight">yapAI</span>
          </button>
          <Button
            variant="ghost"
            size="icon-xs"
            className="md:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X />
          </Button>
        </div>

        <div className="px-3 pb-3">
          <Button
            variant="outline"
            size="lg"
            className="text-lg w-full justify-start gap-2 border-primary/50 text-foreground hover:bg-primary/10"
            onClick={() => {
              newChat()
              setSidebarOpen(false)
            }}
          >
            <Plus />
            New Chat
          </Button>
        </div>

        <nav className="space-y-0.5 px-3 pb-4">
          <Button
            variant="ghost"
            size="lg"
            className="text-lg w-full justify-start gap-2"
            onClick={() => {
              setView("home")
              setSidebarOpen(false)
            }}
          >
            <Home />
            Home
          </Button>
          <Button
            variant="secondary"
            size="lg"
            className="text-lg w-full justify-start gap-2"
            onClick={() => setSidebarOpen(false)}
          >
            <MessageCircle />
            Chats
          </Button>
        </nav>

        <p className="text-sm px-4 pb-2 font-medium tracking-wide text-muted-foreground uppercase">
          Recent chats
        </p>
        <ScrollArea className="min-h-0 flex-1 overflow-hidden px-2">
          <ul className="space-y-0.5 pb-4">
            {sessions.map((session) => (
              <li key={session.id} className="group flex items-start gap-0.5">
                <button
                  type="button"
                  onClick={() => {
                    switchSession(session.id)
                    setSidebarOpen(false)
                  }}
                  className={cn(
                    "flex min-w-0 flex-1 items-start gap-2 rounded-lg px-2.5 py-2 text-left transition-colors",
                    session.id === active.id
                      ? "bg-sidebar-accent"
                      : "text-muted-foreground hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground",
                  )}
                >
                  <MessageCircle className="mt-0.5 size-3.5 shrink-0 text-primary" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px]">{session.title}</span>
                    <span className="text-[11px] text-muted-foreground">
                      {formatRelativeTime(session.updatedAt)}
                    </span>
                  </span>
                </button>
                <Button
                  variant="ghost"
                  size="icon-lg"
                  className="mt-1.5 opacity-100 group-hover:opacity-100 md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100"
                  onClick={() => deleteSession(session.id)}
                  aria-label={`Delete ${session.title}`}
                >
                  <Trash2 />
                </Button>
              </li>
            ))}
          </ul>
        </ScrollArea>
      </aside>
    )
  }

  return (
    <div className="flex h-dvh overflow-hidden bg-background text-foreground">
      <div className="hidden h-full md:flex">{renderSidebar()}</div>
      {sidebarOpen ? (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            aria-label="Dismiss sidebar"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative z-10 h-full">{renderSidebar()}</div>
        </div>
      ) : null}

      <main className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-12 items-center gap-2 border-b border-border/60 px-4">
          <Button
            variant="ghost"
            size="icon-sm"
            className="md:hidden"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open chats"
          >
            <Menu />
          </Button>
          <span className="min-w-0 flex-1 truncate text-xl font-medium">{active.title}</span>
          <Button
            variant="ghost"
            size="icon-lg"
            onClick={() => deleteSession(active.id)}
            aria-label="Delete chat"
          >
            <Trash2 />
          </Button>
        </header>

        <ScrollArea className="min-h-0 flex-1 overflow-hidden">
          <div className="mx-auto flex w-full max-w-2xl flex-col gap-5 px-4 py-8">
            {active.messages.map((message) =>
              message.role === "assistant" ? (
                <div key={message.id} className="flex items-end gap-2">
                  <YapLogo size={22} className="mb-1 shrink-0" />
                  <div className="text-md max-w-[85%] rounded-2xl bg-secondary px-3.5 py-2.5 leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </div>
                </div>
              ) : (
                <div
                  key={message.id}
                  className="text-md yap-gradient ml-auto max-w-[85%] rounded-2xl px-3.5 py-2.5 leading-relaxed text-white whitespace-pre-wrap"
                >
                  {message.content}
                </div>
              ),
            )}
            {pending ? (
              <div className="flex items-end gap-2">
                <YapLogo size={22} className="mb-1 shrink-0" />
                <div className="rounded-2xl bg-secondary px-3.5 py-2.5 text-lg text-muted-foreground">
                  Listening…
                </div>
              </div>
            ) : null}
            <div ref={bottomRef} />
          </div>
        </ScrollArea>

        <form onSubmit={submit} className="mx-auto w-full max-w-4xl px-4 pb-6 pt-2">
          <div className="flex items-end gap-2 rounded-full border border-border bg-card/80 p-1.5 pl-4">
            <Textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Yap away..."
              maxLength={MAX_PROMPT}
              disabled={pending}
              rows={1}
              className="min-h-10 flex-1 resize-none border-0 bg-transparent px-0 py-2 shadow-none focus-visible:ring-0 dark:bg-transparent"
            />
            <Button
              type="submit"
              size="icon-lg"
              disabled={pending || !draft.trim()}
              aria-label="Send"
              className="text-lg yap-gradient yap-glow rounded-full text-white"
            >
              <Send />
            </Button>
          </div>
          {error ? <p className="mt-2 px-2 text-lg text-destructive">{error}</p> : null}
        </form>
      </main>
    </div>
  )
}
