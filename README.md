# AIViz

> Google Rich Results Test checks if Google can read your page.
> AIViz checks if ChatGPT, Perplexity, and Gemini can find your product.

An AI visibility health checker for e-commerce product pages. Input a URL, get a detailed report on how well AI search engines can discover and understand your product.

[繁體中文](README.zh-TW.md)

## What It Does

1. **Structured Data Scoring** (0-100) — Checks if your product page has the right schema.org markup for AI crawlers
2. **AI Readability Assessment** — Evaluates your product data quality from an AI search engine's perspective
3. **Fix Suggestions** — Tells you exactly what's missing, with copy-paste JSON-LD code

## Project Structure

```
aiviz/
├── frontend/    # React SPA (Vite + Tailwind) → GitHub Pages
├── api/         # Vercel Serverless Functions
├── shared/      # Shared TypeScript types
└── docs/        # Plans & documentation
```

## Development Progress

| Phase | Description | Status |
|-------|-------------|--------|
| [Phase 1](docs/plans/phase1.md) | Project Foundation | Not Started |
| [Phase 2](docs/plans/phase2.md) | Crawler & Parser | Not Started |
| [Phase 3](docs/plans/phase3.md) | Scoring Engine | Not Started |
| [Phase 4](docs/plans/phase4.md) | AI Layer & Rate Limiting | Not Started |
| [Phase 5](docs/plans/phase5.md) | API Endpoint | Not Started |
| [Phase 6](docs/plans/phase6.md) | Frontend | Not Started |
| [Phase 7](docs/plans/phase7.md) | Deployment & Docs | Not Started |

## Tech Stack

- **Frontend**: React + Vite + Tailwind CSS → GitHub Pages
- **Backend**: Vercel Serverless Functions
- **Crawler**: Cheerio (HTML parser)
- **AI**: Google Gemini 2.0 Flash (free tier)
- **Rate Limiting**: Vercel KV

## Scoring Rules

### Basic (80 points)
| Rule | Points | Description |
|------|--------|-------------|
| Product Schema | 20 | schema.org/Product exists |
| Name & Description | 15 | Complete and meaningful |
| Price & Currency | 15 | Valid pricing info |
| Image | 10 | Absolute URL, high quality |
| Aggregate Rating | 10 | Review data exists |
| Brand Info | 10 | Brand identifiable |

### Advanced (20 points)
| Rule | Points | Description |
|------|--------|-------------|
| Page Speed | 10 | Response time < 3s |
| llms.txt | 10 | AI crawler standard file |

## Contributing

The scoring engine uses a pluggable rule system. To add a new rule:

1. Create a new file in `api/rules/basic/` or `api/rules/advanced/`
2. Implement the `Rule` interface from `shared/types.ts`
3. Add the import to `api/rules/index.ts`

## Local Development

```bash
# Install dependencies
npm install

# Start frontend dev server
cd frontend && npm run dev

# Run API locally (requires Gemini API key)
cd api && cp .env.example .env
# Edit .env with your GEMINI_API_KEY
npx tsx test-local.ts https://example-shop.com/products/item

# Run tests
npm test
```

## Cost

| Item | Monthly Cost |
|------|-------------|
| GitHub Pages | $0 |
| Vercel Free Tier | $0 |
| Gemini API (Free) | $0 |
| Vercel KV (Free) | $0 |
| **Total** | **$0** |

## License

MIT
