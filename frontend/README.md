# Wedding OS Frontend (SvelteKit + SSR + PWA)

Production-ready SvelteKit/TypeScript frontend with OTP auth, RTL/LTR i18n (`fa` default), shadcn-style Tailwind components, and PWA support.

## Prerequisites

- Node **>=24** (adapter-node target; npm 10+ recommended)
- Docker (optional) for local/production containers

## Quickstart

```bash
npm install --engine-strict=false   # skip if already installed
npm run dev -- --host --port 5173   # dev server
```

Core routes are SSR-first and responsive:

- `/` landing
- `/login` phone + OTP (couple/vendor tabs)
- `/dashboard`, `/website`, `/guests`, `/checklist`, `/vendors`, `/style-guide`

## Build & Preview

```bash
npm run build
npm run preview -- --host --port 4173
```

## Environment

- `PUBLIC_API_BASE_URL` (required): backend base URL (e.g., `http://localhost:8000`)
- `AUTH_COOKIE_SECURE` / `PUBLIC_AUTH_COOKIE_SECURE`: toggle secure cookies (true in prod)
- Ports: dev `5173`, prod `3000`

## Docker

- Dev: `docker-compose -f docker-compose.local.yml up`
- Prod image: `compose/production/Dockerfile` (adapter-node, port 3000)

## PWA

- Configured via `@vite-pwa/sveltekit`
- Icons: `static/icons/icon-192.png`, `icon-512.png`
- Install prompt component: `PwaInstallPrompt.svelte`
