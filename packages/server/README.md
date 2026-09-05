# Server — install & run

Express API for yapAI. Handles chat sessions and calls an LLM through Hugging Face.

## Prerequisites

- [Bun](https://bun.com)
- A [Hugging Face](https://huggingface.co) API key

## Install

From the **repo root** (workspace install):

```bash
bun install
```

## Configure

From this package:

```bash
cd packages/server
cp .env.example .env
```

Edit `.env`:

```bash
HUGGING_FACE_API_KEY=your_key_here
```

Optional:

```bash
PORT=3000
```

(`PORT` defaults to `3000` if unset.)

## Run

```bash
bun run dev
```

Watch mode reloads on file changes. Without watch:

```bash
bun run start
```

Server listens on `http://localhost:3000` and exposes `POST /api/chat`.

To run server and client together, use `bun run dev` from the repo root (see the [main README](../../README.md)).
