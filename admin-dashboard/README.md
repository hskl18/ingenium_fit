# Ingenium Fit Admin Dashboard

Ant Design Pro–based console for content managers and clinicians.

## Prerequisites
- Node.js ≥ 18
- pnpm 9

## Setup
```bash
pnpm install
```

Create `.env.local` (copy from `.env.example` if available) for API keys and third-party integrations.

## Development
```bash
pnpm dev      # Starts Umi dev server on http://localhost:8000
```

Update `config/proxy.ts` so `/api`, `/app`, and `/mgkf` point to your backend (typically `http://localhost:8080`).

## Useful Scripts
- `pnpm build` – production bundle (outputs to `dist/`)
- `pnpm preview` – build then preview locally
- `pnpm lint` / `pnpm test` – quality checks

## Project Layout Highlights
- `src/pages/` – route-level pages
- `src/components/` – shared UI widgets
- `src/services/` – API clients
- `config/` – Umi routing, proxy, and plugin configuration
- `public/` – static assets served as-is
