# Phase 7: Deployment & Documentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deploy frontend to GitHub Pages, API to Vercel, write README, and verify the full end-to-end flow works in production.

**Architecture:** GitHub Actions builds frontend and deploys to GitHub Pages. Vercel auto-deploys the api/ directory. Frontend points to the Vercel API URL via environment variable.

**Tech Stack:** GitHub Actions, Vercel CLI, GitHub Pages

**Status:** Completed

**Depends on:** Phase 6 completed

---

## Task 1: GitHub Actions Workflow for Frontend Deployment

**Files:**
- Create: `.github/workflows/deploy-frontend.yml`

- [ ] **Step 1: Create the workflow file**

Create `.github/workflows/deploy-frontend.yml`:

```yaml
name: Deploy Frontend to GitHub Pages

on:
  push:
    branches: [main]
    paths:
      - 'frontend/**'
      - 'shared/**'
      - '.github/workflows/deploy-frontend.yml'
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: 'pages'
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - run: npm ci

      - name: Build frontend
        working-directory: frontend
        env:
          VITE_API_URL: ${{ vars.VITE_API_URL }}
        run: npm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: frontend/dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Update frontend/vite.config.ts for GitHub Pages base path**

Update `frontend/vite.config.ts` — add `base` config:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: '/aiviz/',  // GitHub repo name
  resolve: {
    alias: {
      '@aiviz/shared': path.resolve(__dirname, '../shared'),
    },
  },
})
```

Note: Replace `aiviz` with the actual repo name if different.

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/deploy-frontend.yml frontend/vite.config.ts
git commit -m "ci: add GitHub Actions workflow for frontend deployment to GitHub Pages"
```

---

## Task 2: Vercel API Deployment Config

**Files:**
- Modify: `api/vercel.json`

- [ ] **Step 1: Verify vercel.json is correct**

The `api/vercel.json` from Phase 1 should already be correct. Verify it contains:

```json
{
  "functions": {
    "api/analyze.ts": {
      "maxDuration": 30
    }
  },
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "Access-Control-Allow-Origin", "value": "*" },
        { "key": "Access-Control-Allow-Methods", "value": "POST, OPTIONS" },
        { "key": "Access-Control-Allow-Headers", "value": "Content-Type" }
      ]
    }
  ]
}
```

- [ ] **Step 2: Deploy to Vercel**

```bash
cd api
npx vercel --prod
```

Follow prompts to link the project. Set environment variables:

```bash
npx vercel env add GEMINI_API_KEY production
# Paste your Gemini API key when prompted

npx vercel env add KV_REST_API_URL production
# Set up Vercel KV in the dashboard first, then add the URL

npx vercel env add KV_REST_API_TOKEN production
# Add the KV token
```

- [ ] **Step 3: Note the production URL**

After deploy, Vercel gives a URL like `https://aiviz-api.vercel.app`. Save this — it will be the `VITE_API_URL` for the frontend.

- [ ] **Step 4: Set the GitHub repository variable**

Go to GitHub repo > Settings > Variables > Actions > New repository variable:
- Name: `VITE_API_URL`
- Value: `https://your-vercel-deployment.vercel.app`

- [ ] **Step 5: Commit any config changes**

```bash
git add api/vercel.json
git commit -m "chore: finalize Vercel deployment config"
```

---

## Task 3: Write README.md

**Files:**
- Create: `README.md`
- Create: `README.zh-TW.md`

- [ ] **Step 1: Create English README**

Create `README.md`:

```markdown
# AIViz

> Google Rich Results Test checks if Google can read your page.
> AIViz checks if ChatGPT, Perplexity, and Gemini can find your product.

An AI visibility health checker for e-commerce product pages. Input a URL, get a detailed report on how well AI search engines can discover and understand your product.

[繁體中文](README.zh-TW.md)

## What It Does

1. **Structured Data Scoring** (0-100) — Checks if your product page has the right schema.org markup for AI crawlers
2. **AI Readability Assessment** — Evaluates your product data quality from an AI search engine's perspective
3. **Fix Suggestions** — Tells you exactly what's missing, with copy-paste JSON-LD code

## Demo

<!-- TODO: Replace with actual demo GIF after launch -->
![Demo](docs/demo.gif)

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
```

- [ ] **Step 2: Create Traditional Chinese README**

Create `README.zh-TW.md`:

```markdown
# AIViz

> 你的商品，AI 搜得到嗎？

電商商品頁 AI 可見度健檢工具。輸入商品 URL，60 秒內告訴你 AI 搜尋引擎看不看得到你的商品。

[English](README.md)

## 功能

1. **結構化資料評分** (0-100 分) — 檢查商品頁是否有正確的 schema.org 標記
2. **AI 可讀性評估** — 從 AI 搜尋引擎的角度評估商品資料品質
3. **一鍵修復建議** — 具體告訴你缺什麼，附上可直接複製的 JSON-LD 程式碼

## 誰適合用？

- Shopify 店家
- CYBERBIZ 店家
- 91APP 店家
- WooCommerce / 自架站

## 開發進度

| 階段 | 說明 | 狀態 |
|------|------|------|
| [Phase 1](docs/plans/phase1.md) | 專案基礎建設 | 未開始 |
| [Phase 2](docs/plans/phase2.md) | 爬蟲與解析器 | 未開始 |
| [Phase 3](docs/plans/phase3.md) | 評分引擎 | 未開始 |
| [Phase 4](docs/plans/phase4.md) | AI 層與流量限制 | 未開始 |
| [Phase 5](docs/plans/phase5.md) | API 端點 | 未開始 |
| [Phase 6](docs/plans/phase6.md) | 前端介面 | 未開始 |
| [Phase 7](docs/plans/phase7.md) | 部署與文件 | 未開始 |

## 本地開發

```bash
npm install
cd frontend && npm run dev
```

## 授權

MIT
```

- [ ] **Step 3: Commit**

```bash
git add README.md README.zh-TW.md
git commit -m "docs: add English and Traditional Chinese README with progress tracking"
```

---

## Task 4: Enable GitHub Pages

- [ ] **Step 1: Push to GitHub and enable Pages**

```bash
git push origin main
```

Go to GitHub repo > Settings > Pages:
- Source: GitHub Actions
- The workflow will auto-trigger on next push to main

- [ ] **Step 2: Verify deployment**

After GitHub Actions completes:
1. Visit `https://<username>.github.io/aiviz/`
2. Landing page should appear with "AIViz" heading and URL input
3. Submit a real product URL
4. Verify the full flow: input → progress → report

- [ ] **Step 3: End-to-end smoke test**

Test with these URLs:
- A Shopify store product page
- A WooCommerce product page
- A page with no structured data (e.g., a blog post) — should get a low score
- An invalid URL — should show error

---

## Task 5: Create GitHub Repo (if not already on GitHub)

- [ ] **Step 1: Create repo on GitHub**

```bash
gh repo create aiviz --public --source=. --push
```

Or if repo already exists:

```bash
git remote add origin https://github.com/<your-username>/aiviz.git
git push -u origin main
```

- [ ] **Step 2: Set repository variables for deployment**

```bash
# Set the Vercel API URL for frontend builds
gh variable set VITE_API_URL --body "https://your-vercel-url.vercel.app"
```

---

## Phase 7 Completion Checklist

- [ ] GitHub Actions workflow deploys frontend to GitHub Pages on push
- [ ] Vercel deploys API with environment variables configured
- [ ] Frontend points to correct API URL via VITE_API_URL
- [ ] English README with demo, progress table, contributing guide
- [ ] Traditional Chinese README
- [ ] End-to-end flow works: input URL → see report
- [ ] Share links work
- [ ] Rate limiting works in production
