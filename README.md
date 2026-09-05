# yapAI

yapAI is a judgement-free AI chat app built for one thing: letting you talk freely. Rant, vent, dream, overthink, spiral, celebrate — whatever is on your mind. No productivity pitch, no life-coach tone, no limits on what you’re allowed to say. Just a space to yap, and something that listens.

## What it does

Most chat products steer you toward answers, tasks, or “helpful” advice. yapAI is aimed at the opposite mood: you show up messy, and the app stays with you.

- **Judgement-free conversation** — Say the unfiltered version. The point is expression, not performance.
- **A place to unload** — Use it when you need to rant after a bad day, talk through a thought loop, dump half-formed ideas, or just keep typing until something feels lighter.
- **Ongoing chats** — Start a new chat whenever you want, switch between recent ones, or delete sessions you’re done with. Conversation history on the client stays in your browser so you can pick up where you left off.
- **Always available** — Open the home screen, hit **Start Yapping**, and go. No account setup required to begin talking.

The product framing is simple:

> Rant, vent, dream, or overthink. I’m here.  
> No limits. No judgement. Just you.

### How a session feels

1. Land on the home screen — brand-forward, calm, and explicit about the vibe (safe space, no judgement, yap unlimited).
2. Start a chat and type whatever you need to say (up to 1000 characters per message).
3. The assistant replies in the thread so the conversation can continue naturally.
4. Manage chats from the sidebar: new chat, recent sessions, home, delete.

### Under the hood (at a glance)

yapAI is a Bun monorepo with two packages:

| Package | Role |
| --- | --- |
| [`packages/client`](packages/client) | React + Vite UI — home, chat, local session storage |
| [`packages/server`](packages/server) | Express API — session-aware chat, LLM replies via Hugging Face |

The client proxies `/api` to the server. Chat messages are sent to `POST /api/chat`; the server keeps per-session history in memory and calls an LLM through Hugging Face’s OpenAI-compatible router.

## Quick start

Install dependencies and run client + server together from the repo root:

```bash
bun install
```

Create `packages/server/.env` from the example and add your Hugging Face key:

```bash
cp packages/server/.env.example packages/server/.env
```

```bash
HUGGING_FACE_API_KEY=your_key_here
```

Then:

```bash
bun run dev
```

- Client: usually `http://localhost:5173`
- Server: `http://localhost:3000`

For package-specific install and run steps, see:

- [Client install](packages/client/README.md)
- [Server install](packages/server/README.md)

## Requirements

- [Bun](https://bun.com)
- A [Hugging Face](https://huggingface.co) API key for the server
