# Client — install & run

React + TypeScript + Vite frontend for yapAI.

## Prerequisites

- [Bun](https://bun.com)
- API server on port `3000` (Vite proxies `/api` → `http://localhost:3000`)

## Install

From the **repo root** (workspace install):

```bash
bun install
```

## Run

From this package:

```bash
cd packages/client
bun run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

To run client and server together, use `bun run dev` from the repo root instead (see the [main README](../../README.md)).

## Scripts

| Command | What it does |
| --- | --- |
| `bun run dev` | Start Vite dev server |
| `bun run build` | Typecheck + production build |
| `bun run preview` | Preview the production build |
| `bun run lint` | Run ESLint |
