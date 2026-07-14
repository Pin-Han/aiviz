# CLAUDE.md

## Project Overview

AIViz is an AI visibility health checker for e-commerce product pages. It scans a product URL and reports how well AI search engines (ChatGPT, Perplexity, Gemini) can discover and understand the product.

**Live URL**: https://ai-vision-check-pink.vercel.app

## Architecture

Monorepo with three workspaces:

- `frontend/` — React 19 SPA (Vite + Tailwind CSS)
- `api/` — Vercel Serverless Functions (only `analyze.ts`, `reports.ts`, `reports/[id].ts` are endpoints)
- `shared/` — TypeScript types and constants shared between frontend and API

### API internals

Files under `api/_lib/` and `api/_rules/` are prefixed with `_` so Vercel does NOT deploy them as separate serverless functions (Hobby plan limit: 12 functions). They are bundled into the endpoint functions that import them.

### Key data flow

1. User submits URL → `POST /api/analyze`
2. Crawl page HTML (Cheerio) → parse JSON-LD, Open Graph, Meta tags
3. Run 13 scoring rules across 3 categories (accessibility, basic, advanced)
4. Call Gemini 2.5 Flash for AI readability assessment + search simulation
5. Return `AnalysisResponse` → frontend renders report
6. Report auto-saved to Upstash Redis → URL updates to `/r/:id`

### i18n

Custom React context in `frontend/src/i18n/`. Two locales: `zh-TW` (default for zh browsers) and `en`. Translation files in `i18n/locales/`. The `locale` is also passed to the API so Gemini responds in the user's language.

### Storage

Upstash Redis via Vercel Marketplace. Used for:
- Report sharing (`report:{id}` keys, 30-day TTL)
- Rate limiting (`rate:ip:{ip}` and `rate:global` keys, daily reset at midnight UTC+8)

Env vars: `KV_REST_API_URL`, `KV_REST_API_TOKEN`

## Commands

```bash
# Install all workspaces
npm install

# Frontend dev server
cd frontend && npm run dev

# Run all tests (API only, 74 tests)
npm test

# Type check frontend
cd frontend && npx tsc --noEmit

# Build frontend
cd frontend && npm run build

# Deploy to Vercel production
vercel --prod
```

## Key Files

- `frontend/src/App.tsx` — Main app, routing, language switcher
- `frontend/src/hooks/useAnalysis.ts` — Analysis state machine
- `frontend/src/i18n/` — i18n system (context, locales)
- `api/analyze.ts` — Main analysis endpoint
- `api/_lib/gemini-provider.ts` — Gemini AI prompts (readability + search simulation)
- `api/_lib/scorer.ts` — Rule runner
- `api/_rules/` — Individual scoring rules
- `shared/types.ts` — All TypeScript interfaces
- `vercel.json` — Vercel config (build, rewrites, CORS, functions)

## Conventions

- Vercel Hobby plan: max 12 serverless functions. Keep non-endpoint files under `_` prefixed dirs.
- API error messages are in Chinese (returned to user directly).
- Frontend UI strings go through `t()` from `useI18n()`. Never hardcode user-facing text.
- Tests are colocated in `__tests__/` directories next to source files.
- Commit messages follow conventional commits (feat/fix/chore).
