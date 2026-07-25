<div align="center">

# AIViz — AI Visibility Checker

**Google has Rich Results Test. This is the AI equivalent.**

Scan any product page URL and find out if ChatGPT, Perplexity, and Gemini can discover, understand, and recommend your product — in 60 seconds.

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Deploy with Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FPin-Han%2Faiviz)
[![Shopify App](https://img.shields.io/badge/Shopify_App-SEO_Checkup-96bf48?logo=shopify)](https://apps.shopify.com/seo-checkup)

[Live Demo](https://ai-vision-check-pink.vercel.app) · [Blog](https://ai-vision-check-pink.vercel.app/blog) · [Shopify App](https://apps.shopify.com/seo-checkup) · [繁體中文](README.zh-TW.md)

</div>

---

<!-- 
  TODO: Replace with actual screenshot
  Take a screenshot of a report page and save as docs/screenshot.png
-->
<!-- ![AIViz Screenshot](docs/screenshot.png) -->

## The Problem

AI search engines are sending **4-5x higher converting traffic** to e-commerce stores ([Adobe, 2026](https://business.adobe.com/blog/ai-traffic-surge-retail-sites-not-machine-readable)). But most stores are invisible to them.

Traditional SEO won't help — ChatGPT doesn't look at your meta keywords or backlinks. It looks at **structured data**, **crawler access**, and **content readability**. Most Shopify stores have gaps in all three.

AIViz scans your product page and tells you exactly what's missing.

## What You Get

| | Feature | Detail |
|---|---------|--------|
| 📊 | **3-Layer Score** (0-130 pts) | Crawler access · Structured data · Advanced optimization |
| 🔍 | **AI Search Simulation** | Simulates real queries — would ChatGPT recommend your product? |
| 🤖 | **AI Readability Assessment** | Gemini evaluates your page from an AI engine's perspective |
| 🔧 | **Copy-Paste Fix Code** | Get JSON-LD snippets you can add directly to your page |
| 🔗 | **Shareable Reports** | Each report gets a short URL (`/r/:id`), stored 30 days |
| 🌐 | **Bilingual** | Auto-detects English / 繁體中文 |

## Shopify App

Running a Shopify store? **[SEO Checkup](https://apps.shopify.com/seo-checkup)** is our free Shopify App that scans all your products at once — no need to check URLs one by one.

## Scoring Rules

### Crawler Accessibility (30 pts)
| Rule | Pts | Checks |
|------|-----|--------|
| robots.txt | 10 | AI crawlers (GPTBot, PerplexityBot, etc.) not blocked |
| Meta Description | 5 | Present and adequate length |
| Image Alt Text | 5 | Descriptive alt attributes |
| JS Rendering | 5 | Content in raw HTML, not JS-only |
| Canonical URL | 5 | Correct canonical tag |

### Structured Data (80 pts)
| Rule | Pts | Checks |
|------|-----|--------|
| Product Schema | 20 | schema.org/Product JSON-LD exists |
| Name & Description | 15 | Complete product info |
| Price & Currency | 15 | Valid pricing with currency |
| Product Image | 10 | Absolute URL, accessible |
| Aggregate Rating | 10 | Review/rating data |
| Brand Info | 10 | Brand name identifiable |

### Advanced (20 pts)
| Rule | Pts | Checks |
|------|-----|--------|
| Page Speed | 10 | Server response < 3s |
| llms.txt | 10 | [llms.txt](https://llmstxt.org/) file present |

## Quick Start

```bash
git clone https://github.com/Pin-Han/aiviz.git
cd aiviz
npm install

# Set up API env
cp api/.env.example api/.env
# Add your GEMINI_API_KEY (free tier: https://aistudio.google.com/apikey)

# Run frontend
cd frontend && npm run dev

# Run tests (74 tests)
npm test
```

### Deploy to Vercel

```bash
vercel link
vercel env add GEMINI_API_KEY
vercel --prod
```

For report sharing, add [Upstash Redis](https://vercel.com/marketplace/upstash) from the Vercel Marketplace (prefix: `KV`).

## Architecture

```
aiviz/
├── frontend/              # React 19 SPA (Vite + Tailwind CSS)
│   ├── src/
│   │   ├── components/    # Report, ScoreCard, RadarChart, etc.
│   │   ├── blog/          # Markdown blog with i18n
│   │   ├── hooks/         # useAnalysis state machine
│   │   └── i18n/          # zh-TW / en translations
│   └── index.html
├── api/                   # Vercel Serverless Functions
│   ├── analyze.ts         # POST /api/analyze
│   ├── reports.ts         # POST /api/reports
│   ├── reports/[id].ts    # GET  /api/reports/:id
│   ├── _lib/              # Crawler, parser, scorer, Gemini provider
│   └── _rules/            # Pluggable scoring rules
├── shared/                # TypeScript types & constants
└── vercel.json
```

**Tech stack**: React 19 · Vite · Tailwind CSS · Vercel Functions · Cheerio · Gemini 2.5 Flash · Upstash Redis · GA4

## Add a New Rule

The scoring engine is pluggable:

```ts
// api/_rules/basic/my-rule.ts
import type { Rule } from '../../../shared/types.js'

export const myRule: Rule = {
  id: 'my-rule',
  name: 'My Rule',
  description: 'Checks something useful',
  category: 'basic',
  maxScore: 10,
  check(pageData) {
    // Your logic here
    return { score: 10, status: 'pass', message: 'All good' }
  },
}
```

Register it in `api/_rules/index.ts` and add tests in `__tests__/`.

**Rule ideas**: OG image dimensions · hreflang tags · FAQ schema · Breadcrumb schema · Review richness

## Roadmap

- [x] Web tool — scan any URL, get AI visibility report
- [x] Shopify App — [SEO Checkup](https://apps.shopify.com/seo-checkup)
- [x] Blog — AI visibility insights ([/blog](https://ai-vision-check-pink.vercel.app/blog))
- [ ] AI Brand Monitoring — track brand mentions across AI search
- [ ] Competitor Analysis — compare AI visibility vs competitors
- [ ] Scheduled Scans — periodic checks with change alerts

## License

MIT
