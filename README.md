# AIViz

> Google Rich Results Test checks if Google can read your page.
> AIViz checks if ChatGPT, Perplexity, and Gemini can find your product.

An AI visibility health checker for e-commerce product pages. Input a URL, get a detailed report on how well AI search engines can discover and understand your product.

**Live**: [ai-vision-check-pink.vercel.app](https://ai-vision-check-pink.vercel.app)

[繁體中文](README.zh-TW.md)

## What It Does

1. **Structured Data Scoring** (0-130) — Checks schema.org markup across 3 layers: crawler accessibility, basic data, and advanced optimization
2. **AI Search Simulation** — Simulates how AI search engines would respond to queries about your product
3. **AI Readability Assessment** — Evaluates your product data quality from an AI search engine's perspective
4. **Fix Suggestions** — Tells you exactly what's missing, with copy-paste JSON-LD code
5. **Shareable Reports** — Each report gets a short URL (`/r/:id`) you can share directly

## Project Structure

```
aiviz/
├── frontend/    # React SPA (Vite + Tailwind) → Vercel
├── api/         # Vercel Serverless Functions
│   ├── analyze.ts        # Main analysis endpoint
│   ├── reports.ts        # Save reports
│   ├── reports/[id].ts   # Retrieve shared reports
│   ├── _lib/             # Internal libraries (crawler, parser, scorer, AI)
│   └── _rules/           # Scoring rules (accessibility, basic, advanced)
├── shared/      # Shared TypeScript types & constants
└── docs/        # Plans & documentation
```

## Tech Stack

- **Frontend**: React 19 + Vite + Tailwind CSS
- **Backend**: Vercel Serverless Functions
- **Crawler**: Cheerio (HTML parser)
- **AI**: Google Gemini 2.5 Flash
- **Storage**: Upstash Redis (report sharing, rate limiting)
- **Hosting**: Vercel
- **i18n**: Custom React context (zh-TW / en, auto-detected)
- **Analytics**: Google Analytics 4

## Scoring Rules

### Accessibility (30 points)
| Rule | Points | Description |
|------|--------|-------------|
| robots.txt | 10 | AI crawlers not blocked |
| Meta Description | 5 | Present and adequate length |
| Image Alt Text | 5 | Images have alt attributes |
| JS Rendering | 5 | Content available without JS |
| Canonical URL | 5 | Correct canonical tag |

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

## Local Development

```bash
# Install dependencies
npm install

# Start frontend dev server
cd frontend && npm run dev

# Run API locally (requires Gemini API key)
cd api && cp .env.example .env
# Edit .env with your GEMINI_API_KEY
npx tsx _test-local.ts https://example-shop.com/products/item

# Run tests
npm test
```

## Contributing

The scoring engine uses a pluggable rule system. To add a new rule:

1. Create a new file in `api/_rules/basic/` or `api/_rules/advanced/`
2. Implement the `Rule` interface from `shared/types.ts`
3. Add the import to `api/_rules/index.ts`

## License

MIT
