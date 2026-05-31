# Phase 5: API Endpoint

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wire everything together into the `POST /api/analyze` endpoint — validate input, crawl, parse, score, call Gemini, and return the full `AnalysisResponse`.

**Architecture:** Single Vercel Serverless Function that orchestrates crawler → parser → scorer → AI provider → response assembly. Includes llms.txt async check and CORS handling.

**Tech Stack:** Vercel Serverless Functions, TypeScript

**Status:** Completed

**Depends on:** Phase 4 completed

---

## Task 1: Implement the Analyze Endpoint

**Files:**
- Create: `api/analyze.ts`

- [ ] **Step 1: Create the endpoint**

Create `api/analyze.ts`:

```typescript
import type { VercelRequest, VercelResponse } from '@vercel/node'
import type { AnalysisResponse, ApiError, AiReadability } from '@aiviz/shared/types.js'
import { crawlUrl } from './lib/crawler.js'
import { parseHtml } from './lib/parser.js'
import { runAllRules } from './lib/scorer.js'
import { GeminiProvider } from './lib/gemini-provider.js'
import { checkRateLimit } from './lib/rate-limiter.js'
import { REQUEST_TIMEOUT_MS } from '@aiviz/shared/constants.js'

function isValidUrl(str: string): boolean {
  try {
    const url = new URL(str)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

function getClientIp(req: VercelRequest): string {
  const forwarded = req.headers['x-forwarded-for']
  if (typeof forwarded === 'string') return forwarded.split(',')[0].trim()
  return req.socket?.remoteAddress ?? 'unknown'
}

async function checkLlmsTxt(url: string): Promise<boolean> {
  try {
    const origin = new URL(url).origin
    const response = await fetch(`${origin}/llms.txt`, {
      signal: AbortSignal.timeout(3000),
    })
    return response.ok
  } catch {
    return false
  }
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
): Promise<void> {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed', code: 405 } satisfies ApiError)
    return
  }

  // Parse and validate input
  const { url } = req.body ?? {}

  if (!url || typeof url !== 'string' || !isValidUrl(url)) {
    res.status(400).json({
      error: '請提供有效的商品頁 URL（需包含 http:// 或 https://）',
      code: 400,
    } satisfies ApiError)
    return
  }

  // Rate limit check
  const ip = getClientIp(req)
  const rateLimit = await checkRateLimit(ip)

  if (!rateLimit.allowed) {
    res.status(429).json({
      error: '今日免費分析次數已用完，請明天再試',
      code: 429,
    } satisfies ApiError)
    return
  }

  try {
    // Step 1: Crawl
    const crawlResult = await crawlUrl(url)

    // Step 2: Parse
    const pageData = parseHtml(crawlResult.html, crawlResult.url, crawlResult.crawlTimeMs)

    // Step 3: Score with all rules
    const ruleResults = runAllRules(pageData)

    // Step 4: Async check for llms.txt and override the rule result
    const hasLlmsTxt = await checkLlmsTxt(url)
    const llmsTxtIndex = ruleResults.findIndex((r) => r.id === 'llms-txt')
    if (llmsTxtIndex !== -1 && hasLlmsTxt) {
      ruleResults[llmsTxtIndex] = {
        ...ruleResults[llmsTxtIndex],
        score: 10,
        status: 'pass',
        message: '已偵測到 llms.txt 檔案',
        fix: null,
        code: null,
      }
    }

    // Step 5: AI readability assessment
    let aiReadability: AiReadability
    let aiCallTimeMs = 0

    const geminiKey = process.env.GEMINI_API_KEY
    if (geminiKey) {
      const aiStart = Date.now()
      const provider = new GeminiProvider(geminiKey)
      const aiResult = await provider.assessReadability(pageData)
      aiCallTimeMs = Date.now() - aiStart

      // Check if it's a failure fallback
      if (aiResult.summary.includes('無法完成')) {
        aiReadability = { unavailable: true }
      } else {
        aiReadability = aiResult
      }
    } else {
      aiReadability = { unavailable: true }
    }

    // Step 6: Compute scores
    const basicScore = ruleResults
      .filter((r) => r.category === 'basic')
      .reduce((sum, r) => sum + r.score, 0)
    const advancedScore = ruleResults
      .filter((r) => r.category === 'advanced')
      .reduce((sum, r) => sum + r.score, 0)

    const response: AnalysisResponse = {
      url,
      analyzedAt: new Date().toISOString(),
      score: {
        total: basicScore + advancedScore,
        basic: basicScore,
        advanced: advancedScore,
      },
      rules: ruleResults,
      aiReadability,
      meta: {
        crawlTimeMs: crawlResult.crawlTimeMs,
        aiCallTimeMs,
        remainingQuota: rateLimit.remaining,
      },
    }

    res.status(200).json(response)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'

    if (message.startsWith('HTTP ')) {
      res.status(502).json({
        error: `無法連線到目標網站：${message}`,
        code: 502,
      } satisfies ApiError)
      return
    }

    res.status(500).json({
      error: '分析過程發生錯誤，請稍後再試',
      code: 500,
    } satisfies ApiError)
  }
}
```

- [ ] **Step 2: Install @vercel/node types**

```bash
cd api && npm install -D @vercel/node
```

- [ ] **Step 3: Create .env.example for local development**

Create `api/.env.example`:

```
GEMINI_API_KEY=your-gemini-api-key-here
```

- [ ] **Step 4: Commit**

```bash
git add api/analyze.ts api/.env.example api/package.json
git commit -m "feat: implement POST /api/analyze endpoint"
```

---

## Task 2: Local Testing Script

**Files:**
- Create: `api/test-local.ts`

- [ ] **Step 1: Create a local test script**

Create `api/test-local.ts`:

```typescript
/**
 * Local testing script — run with:
 *   npx tsx api/test-local.ts https://some-shopify-store.com/products/example
 *
 * Requires GEMINI_API_KEY in api/.env
 */

import { config } from 'dotenv'
config({ path: '.env' })

import { crawlUrl } from './lib/crawler.js'
import { parseHtml } from './lib/parser.js'
import { runAllRules } from './lib/scorer.js'
import { GeminiProvider } from './lib/gemini-provider.js'

async function main() {
  const url = process.argv[2]
  if (!url) {
    console.error('Usage: npx tsx api/test-local.ts <product-url>')
    process.exit(1)
  }

  console.log(`\n🔍 Analyzing: ${url}\n`)

  // Crawl
  console.log('⏳ Crawling...')
  const crawlResult = await crawlUrl(url)
  console.log(`✅ Crawled in ${crawlResult.crawlTimeMs}ms (${crawlResult.html.length} chars)\n`)

  // Parse
  console.log('⏳ Parsing...')
  const pageData = parseHtml(crawlResult.html, crawlResult.url, crawlResult.crawlTimeMs)
  console.log(`✅ JSON-LD: ${pageData.jsonLd ? 'Found' : 'Not found'}`)
  console.log(`✅ OG Title: ${pageData.openGraph.title ?? '(none)'}`)
  console.log(`✅ Meta Title: ${pageData.metaTags.title ?? '(none)'}\n`)

  // Score
  console.log('⏳ Scoring...')
  const results = runAllRules(pageData)
  const basicScore = results
    .filter((r) => r.category === 'basic')
    .reduce((sum, r) => sum + r.score, 0)
  const advancedScore = results
    .filter((r) => r.category === 'advanced')
    .reduce((sum, r) => sum + r.score, 0)

  console.log(`\n📊 Score: ${basicScore + advancedScore}/100 (Basic: ${basicScore}/80, Advanced: ${advancedScore}/20)\n`)

  results.forEach((r) => {
    const icon = r.status === 'pass' ? '✅' : r.status === 'warn' ? '⚠️' : '❌'
    console.log(`${icon} ${r.name}: ${r.score}/${r.maxScore} — ${r.message}`)
    if (r.fix) console.log(`   💡 ${r.fix}`)
  })

  // AI Readability (optional)
  const geminiKey = process.env.GEMINI_API_KEY
  if (geminiKey) {
    console.log('\n⏳ AI Readability Assessment...')
    const provider = new GeminiProvider(geminiKey)
    const ai = await provider.assessReadability(pageData)
    console.log(`\n🤖 ${ai.summary}`)
    if (ai.strengths.length) console.log(`   👍 ${ai.strengths.join(', ')}`)
    if (ai.weaknesses.length) console.log(`   👎 ${ai.weaknesses.join(', ')}`)
  } else {
    console.log('\n⚠️  GEMINI_API_KEY not set, skipping AI readability assessment')
  }

  console.log('\n✅ Done!')
}

main().catch(console.error)
```

- [ ] **Step 2: Install tsx and dotenv for local execution**

```bash
cd api && npm install -D tsx dotenv
```

- [ ] **Step 3: Test locally with a real URL**

```bash
cd api && npx tsx test-local.ts https://www.apple.com/shop/product/MYW73LL/A/macbook-air-13-inch-with-m4-chip
```

Expected: Full analysis output in terminal — score, rule results, and AI assessment (if GEMINI_API_KEY is set in `api/.env`).

- [ ] **Step 4: Commit**

```bash
git add api/test-local.ts api/package.json
git commit -m "feat: add local testing script for end-to-end analysis"
```

---

## Phase 5 Completion Checklist

- [ ] `POST /api/analyze` endpoint handles full pipeline: validate → crawl → parse → score → AI → respond
- [ ] CORS headers configured for cross-origin requests from GitHub Pages
- [ ] Rate limiting enforced (400/429/502/500 error responses)
- [ ] llms.txt async check overrides the rule result when present
- [ ] Gemini failure doesn't crash the endpoint
- [ ] Local test script works with a real product URL
