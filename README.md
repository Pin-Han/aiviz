# AIViz

> Google Rich Results Test checks if Google can read your page.
> **AIViz checks if ChatGPT, Perplexity, and Gemini can find your product.**

An open-source AI visibility checker for e-commerce product pages. Input a product URL, get a detailed report on how well AI search engines can discover, understand, and recommend your product — in 60 seconds.

**Try it now**: [aiviz.vercel.app](https://ai-vision-check-pink.vercel.app)

[繁體中文](README.zh-TW.md)

## Why This Exists

Google has [Rich Results Test](https://search.google.com/test/rich-results). But AI search engines (ChatGPT, Perplexity, Gemini) use different signals to understand and recommend products. There's no equivalent tool for the AI era — until now.

AIViz scans your product page and answers three questions:

1. **Can AI crawlers access your page?** — robots.txt, JS rendering, meta tags
2. **Can AI understand what you're selling?** — schema.org Product markup, Open Graph, structured data completeness
3. **Would AI recommend your product?** — simulated AI search queries, keyword visibility analysis

## Features

- **3-Layer Scoring** (0-130 pts) — Crawler accessibility + structured data + advanced optimization
- **AI Search Simulation** — Simulates real user queries and predicts if AI would recommend your product
- **AI Readability Assessment** — Powered by Gemini, evaluates data quality from an AI engine's perspective
- **Copy-Paste Fix Code** — Get JSON-LD snippets you can directly add to your page
- **Shareable Reports** — Each report gets a short URL (`/r/:id`), stored for 30 days
- **Bilingual** — Auto-detects browser language (English / 繁體中文)

## Screenshot

![AIViz Report](https://ai-vision-check-pink.vercel.app/r/5V8Wm_Mj)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, Tailwind CSS |
| Backend | Vercel Serverless Functions |
| Crawler | Cheerio (HTML parser) |
| AI | Google Gemini 2.5 Flash |
| Storage | Upstash Redis (report sharing + rate limiting) |
| Hosting | Vercel |
| i18n | Custom React Context (zh-TW / en) |
| Analytics | Google Analytics 4 |

## Scoring Rules

### Crawler Accessibility (30 pts)
| Rule | Pts | What it checks |
|------|-----|---------------|
| robots.txt | 10 | AI crawlers (GPTBot, PerplexityBot, etc.) not blocked |
| Meta Description | 5 | Present and adequate length |
| Image Alt Text | 5 | Images have descriptive alt attributes |
| JS Rendering | 5 | Content available in raw HTML (not JS-dependent) |
| Canonical URL | 5 | Correct canonical tag present |

### Structured Data (80 pts)
| Rule | Pts | What it checks |
|------|-----|---------------|
| Product Schema | 20 | schema.org/Product JSON-LD exists |
| Name & Description | 15 | Product name and description are complete |
| Price & Currency | 15 | Valid pricing with currency code |
| Product Image | 10 | Absolute URL, accessible image |
| Aggregate Rating | 10 | Review/rating data present |
| Brand Info | 10 | Brand name identifiable |

### Advanced (20 pts)
| Rule | Pts | What it checks |
|------|-----|---------------|
| Page Speed | 10 | Server response < 3 seconds |
| llms.txt | 10 | [llms.txt](https://llmstxt.org/) file present |

## Getting Started

### Prerequisites

- Node.js >= 20
- A [Gemini API key](https://aistudio.google.com/apikey) (free tier works)
- (Optional) [Upstash Redis](https://upstash.com/) for report sharing & rate limiting

### Setup

```bash
# Clone the repo
git clone https://github.com/Pin-Han/aiviz.git
cd aiviz

# Install dependencies (monorepo — installs all workspaces)
npm install

# Set up API environment variables
cp api/.env.example api/.env
# Edit api/.env with your GEMINI_API_KEY

# Start frontend dev server
cd frontend && npm run dev

# Test a product URL locally
cd api && npx tsx _test-local.ts https://example-shop.com/products/item

# Run tests (74 tests)
npm test
```

### Deploy to Vercel

```bash
# Link to Vercel project
vercel link

# Set environment variables
vercel env add GEMINI_API_KEY

# Deploy
vercel --prod
```

For report sharing, add [Upstash Redis](https://vercel.com/marketplace/upstash) from the Vercel Marketplace with prefix `KV`.

## Project Structure

```
aiviz/
├── frontend/                # React SPA
│   ├── src/
│   │   ├── App.tsx          # Main app + routing
│   │   ├── components/      # UI components (Report, ScoreCard, etc.)
│   │   ├── hooks/           # useAnalysis state machine
│   │   └── i18n/            # Translations (zh-TW, en)
│   └── index.html
├── api/                     # Vercel Serverless Functions
│   ├── analyze.ts           # POST /api/analyze — main endpoint
│   ├── reports.ts           # POST /api/reports — save report
│   ├── reports/[id].ts      # GET /api/reports/:id — retrieve report
│   ├── _lib/                # Internal: crawler, parser, scorer, AI provider
│   └── _rules/              # Scoring rules (pluggable)
│       ├── accessibility/   # robots.txt, meta, alt text, JS rendering, canonical
│       ├── basic/           # Product schema, name, price, image, rating, brand
│       └── advanced/        # Page speed, llms.txt
├── shared/                  # Shared TypeScript types & constants
└── vercel.json              # Vercel config
```

> Files under `api/_lib/` and `api/_rules/` are prefixed with `_` so Vercel bundles them into the endpoint functions instead of deploying them as separate serverless functions.

## Contributing

PRs welcome! The scoring engine uses a pluggable rule system:

1. Create a new file in `api/_rules/basic/` or `api/_rules/advanced/`
2. Implement the `Rule` interface from `shared/types.ts`:
   ```ts
   interface Rule {
     id: string
     name: string
     description: string
     category: 'accessibility' | 'basic' | 'advanced'
     maxScore: number
     check(pageData: PageData): RuleResult
   }
   ```
3. Register it in `api/_rules/index.ts`
4. Add tests in a colocated `__tests__/` directory

Ideas for new rules:
- `og:image` dimensions check
- Multilingual hreflang tags
- FAQ schema detection
- Breadcrumb schema
- Review schema richness

## Roadmap

- [ ] Shopify App — one-click install, automatic AI visibility monitoring
- [ ] AI Brand Monitoring — track brand mentions across AI search engines
- [ ] Competitor Analysis — compare AI visibility against competitors
- [ ] Scheduled Scans — periodic checks with change notifications
- [ ] More AI providers — test against Claude, Copilot, and others

## License

MIT
