# CLAUDE.md

## Project Overview

AIViz — open-source AI visibility checker for e-commerce product pages. Scans a product URL and reports how well AI search engines (ChatGPT, Perplexity, Gemini) can discover, understand, and recommend the product.

**Live**: https://ai-vision-check-pink.vercel.app
**Repo**: https://github.com/Pin-Han/aiviz

## Architecture

Monorepo with three npm workspaces:

```
frontend/   → React 19 SPA (Vite + Tailwind CSS), deployed as Vercel static
api/        → Vercel Serverless Functions (3 endpoints)
shared/     → TypeScript types & constants used by both
```

### API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `api/analyze.ts` | POST | Main analysis — crawl, parse, score, AI assess |
| `api/reports.ts` | POST | Save report to Redis, return short ID |
| `api/reports/[id].ts` | GET | Retrieve saved report by ID |

### API Internals (not endpoints)

Files under `api/_lib/` and `api/_rules/` are prefixed with `_` so Vercel does NOT deploy them as separate serverless functions (Hobby plan limit: 12). They are bundled into endpoint functions.

- `_lib/crawler.ts` — Fetch page HTML with timeout
- `_lib/parser.ts` — Extract JSON-LD, Open Graph, Meta tags via Cheerio
- `_lib/scorer.ts` — Run all rules against parsed PageData
- `_lib/gemini-provider.ts` — Gemini AI prompts (readability + search simulation)
- `_lib/redis.ts` — Upstash Redis singleton
- `_lib/rate-limiter.ts` — Per-IP + global daily rate limiting
- `_lib/page-detector.ts` — Detect if URL is product/homepage/other
- `_rules/` — 13 scoring rules in 3 categories (accessibility, basic, advanced)

### Data Flow

1. `POST /api/analyze` with `{ url, locale }`
2. Crawl HTML → parse structured data (JSON-LD, OG, Meta)
3. Run 13 rules across 3 categories → score 0-130
4. Parallel: check robots.txt + llms.txt live
5. Parallel: Gemini AI readability assessment + search simulation (locale-aware)
6. Return `AnalysisResponse` → frontend renders report
7. Frontend auto-saves report via `POST /api/reports` → URL updates to `/r/:id`

### Frontend Routing

No router library. URL-based state detection:
- `/` → Landing page (idle state)
- `/about` → About page
- `/r/:id` → Load report from Redis
- `?r=...` → Legacy compressed report (LZ-string, backwards compat)

### i18n

Custom React context in `frontend/src/i18n/`. Two locales: `zh-TW` (default for `zh-*` browsers) and `en` (fallback). Translation files: `i18n/locales/zh-TW.ts` and `en.ts`.

The `locale` is passed to `POST /api/analyze` so Gemini prompts instruct the model to respond in the user's language.

### Storage

Upstash Redis via Vercel Marketplace. Env vars: `KV_REST_API_URL`, `KV_REST_API_TOKEN`.

- Report sharing: `report:{id}` keys, 30-day TTL
- Rate limiting: `rate:ip:{ip}` and `rate:global` keys, daily reset at midnight UTC+8
- Falls back to in-memory Map when Redis is not configured (local dev)

### Analytics

Google Analytics 4 (G-Y76NWTCKV1). Custom event `analysis_complete` with params:
- `analyzed_url` — the URL that was scanned
- `score` — total score
- `page_type` — product/homepage/other

## Commands

```bash
npm install                          # Install all workspaces
cd frontend && npm run dev           # Frontend dev server (localhost:5173)
npm test                             # Run all tests (74 tests, API only)
cd frontend && npx tsc --noEmit      # Type check frontend
cd frontend && npm run build         # Build frontend
vercel --prod                        # Deploy to production
```

## Key Files

| File | Purpose |
|------|---------|
| `frontend/src/App.tsx` | Main app, routing, language switcher, GA4 events |
| `frontend/src/hooks/useAnalysis.ts` | Analysis state machine (idle/loading/success/error) |
| `frontend/src/components/Report.tsx` | Report layout, verdict, warnings, CTA |
| `frontend/src/components/About.tsx` | /about page |
| `frontend/src/i18n/` | i18n context + locale files |
| `api/analyze.ts` | Main analysis endpoint |
| `api/_lib/gemini-provider.ts` | Gemini prompts — locale-aware |
| `api/_rules/index.ts` | Rule registry (all 13 rules) |
| `shared/types.ts` | All TypeScript interfaces |
| `vercel.json` | Build, rewrites, CORS, function config |

## Conventions

- **Vercel Hobby plan**: max 12 serverless functions. Non-endpoint files MUST be under `_` prefixed dirs.
- **i18n**: All user-facing frontend strings go through `t()` from `useI18n()`. Never hardcode text.
- **API errors**: Currently returned in Chinese. Will be locale-aware in a future update.
- **Tests**: Colocated in `__tests__/` next to source files. Run with `vitest`.
- **Commits**: Follow conventional commits (`feat:`, `fix:`, `chore:`).
- **Scoring rules**: Pluggable. Implement `Rule` interface, register in `_rules/index.ts`.
- **Secrets**: `.env` is gitignored. Use `api/.env.example` as template. On Vercel, env vars are set via dashboard or Marketplace integrations.
