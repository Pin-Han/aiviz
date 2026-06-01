# Phase 9: AI Crawler Accessibility Checks

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a new scoring category "AI 爬蟲可及性" (AI Crawler Accessibility) that checks whether AI crawlers can actually reach and parse the page content. This is the most fundamental layer — if crawlers can't access the page, structured data quality is irrelevant.

**Architecture:** New `accessibility` rule category alongside existing `basic` and `advanced`. New rules check robots.txt, meta description scoring, image alt coverage, JS rendering dependency, and canonical URL. Some rules require additional HTTP requests (robots.txt, canonical).

**Tech Stack:** TypeScript, Cheerio, Vitest

**Status:** Not Started

**Depends on:** Phase 8 completed

---

## Task 1: Extend Rule Categories & Types

**Files:**
- Modify: `shared/types.ts`
- Modify: `shared/constants.ts`
- Modify: `frontend/src/components/RuleList.tsx`

- [ ] **Step 1: Add `accessibility` category to types**

In `shared/types.ts`, update `RuleCategory`:

```typescript
export type RuleCategory = 'accessibility' | 'basic' | 'advanced'
```

- [ ] **Step 2: Add constants for new category**

In `shared/constants.ts`, add:

```typescript
export const SCORE_MAX_ACCESSIBILITY = 30

export const CATEGORY_LABELS: Record<string, string> = {
  accessibility: 'AI 爬蟲可及性',
  basic: '基本項目',
  advanced: '進階優化',
}
```

Update `SCORE_MAX_TOTAL` accordingly:

```typescript
export const SCORE_MAX_TOTAL = SCORE_MAX_ACCESSIBILITY + SCORE_MAX_BASIC + SCORE_MAX_ADVANCED
```

Note: Total max score changes from 100 to 130. Consider whether to keep 100 scale (normalize) or expand. Recommendation: keep raw scores but display as percentage in UI.

- [ ] **Step 3: Update frontend RuleList to display 3 categories**

Add `accessibility` section in RuleList with tag `CRAWLER ACCESS` and render it first (before basic and advanced), since it's the most fundamental layer.

- [ ] **Step 4: Commit**

```bash
git commit -m "feat: add accessibility rule category for AI crawler checks"
```

---

## Task 2: robots.txt AI Crawler Check

**Files:**
- Create: `api/rules/accessibility/robots-txt.ts`
- Create: `api/rules/__tests__/accessibility-rules.test.ts`

**What it checks:** Fetches `{origin}/robots.txt` and looks for blocks against known AI crawlers.

**Known AI crawler user-agents:**
- `GPTBot` (OpenAI / ChatGPT)
- `Google-Extended` (Google AI, Gemini)
- `CCBot` (Common Crawl, used by many AI training sets)
- `anthropic-ai` (Claude)
- `PerplexityBot` (Perplexity)
- `Bytespider` (ByteDance / TikTok AI)

**Scoring:**
- 10/10: No AI crawlers blocked
- 5/10: Some AI crawlers blocked (with list of which ones)
- 0/10: All major AI crawlers blocked, or blanket `Disallow: /` for all bots

**Note:** This rule needs an async HTTP request (fetching robots.txt). Similar to the llms-txt rule, the default synchronous `check()` returns a placeholder, and the `analyze.ts` endpoint overrides it after the async fetch.

- [ ] **Step 1: Implement the rule**

```typescript
// api/rules/accessibility/robots-txt.ts
export const robotsTxtRule: Rule = {
  id: 'robots-txt-ai',
  name: 'AI 爬蟲存取權限',
  description: '檢查 robots.txt 是否封鎖 AI 搜尋引擎爬蟲',
  category: 'accessibility',
  maxScore: 10,
  check() {
    // Placeholder — overridden by analyze.ts after async fetch
    return {
      score: 10,
      status: 'pass',
      message: '未偵測到 robots.txt 或未封鎖 AI 爬蟲',
    }
  },
}
```

- [ ] **Step 2: Add async robots.txt check logic in analyze.ts**

```typescript
async function checkRobotsTxt(url: string): Promise<{ blocked: string[]; allBlocked: boolean }> {
  const AI_BOTS = ['GPTBot', 'Google-Extended', 'CCBot', 'anthropic-ai', 'PerplexityBot', 'Bytespider']
  try {
    const origin = new URL(url).origin
    const res = await fetch(`${origin}/robots.txt`, { signal: AbortSignal.timeout(3000) })
    if (!res.ok) return { blocked: [], allBlocked: false }
    const text = await res.text()
    // Parse robots.txt for blocked AI bots
    const blocked = AI_BOTS.filter(bot => {
      const regex = new RegExp(`User-agent:\\s*${bot}[\\s\\S]*?Disallow:\\s*/`, 'i')
      return regex.test(text)
    })
    // Check blanket block
    const blanketBlock = /User-agent:\s*\*[\s\S]*?Disallow:\s*\/\s*$/m.test(text)
    return { blocked, allBlocked: blanketBlock && blocked.length === 0 }
  } catch {
    return { blocked: [], allBlocked: false }
  }
}
```

- [ ] **Step 3: Write tests**
- [ ] **Step 4: Commit**

---

## Task 3: Meta Description Scoring

**Files:**
- Create: `api/rules/accessibility/meta-description.ts`

**What it checks:** Whether `<meta name="description">` exists and is meaningful. AI uses this as a primary summary source.

**Scoring:**
- 5/5: Description exists and is 50-160 characters
- 3/5: Description exists but too short (<50) or too long (>160)
- 0/5: No description

- [ ] **Step 1: Implement the rule**
- [ ] **Step 2: Write tests**
- [ ] **Step 3: Commit**

---

## Task 4: Image Alt Text Coverage

**Files:**
- Create: `api/rules/accessibility/image-alt.ts`

**What it checks:** Scans all `<img>` tags in the page HTML. Calculates the percentage that have non-empty `alt` attributes.

**Scoring:**
- 5/5: 80%+ images have alt text
- 3/5: 50-79% have alt text
- 0/5: Less than 50% have alt text

**Note:** Only counts images that are likely product-related (skip tiny tracking pixels by filtering `width`/`height` < 10 or `src` containing `pixel`, `tracker`, `analytics`).

- [ ] **Step 1: Implement the rule**
- [ ] **Step 2: Write tests**
- [ ] **Step 3: Commit**

---

## Task 5: JavaScript Rendering Dependency

**Files:**
- Create: `api/rules/accessibility/js-rendering.ts`

**What it checks:** Compares the raw HTML content (what Cheerio sees) against signals of JS-dependent rendering. If the `<body>` is nearly empty (e.g., only a `<div id="root">` or `<div id="app">`) and there are multiple `<script>` tags, the page likely requires JS execution to render content.

**Scoring:**
- 5/5: Body has substantial HTML content (> 500 chars of text content)
- 3/5: Body has some content but appears partially JS-rendered
- 0/5: Body is essentially empty — full SPA, AI crawlers likely see nothing

**Heuristics:**
- Count text content length in `<body>` (excluding `<script>` and `<style>` tags)
- Check for SPA markers: `<div id="root">`, `<div id="app">`, `<div id="__next">`
- Count `<script>` tags

- [ ] **Step 1: Implement the rule**
- [ ] **Step 2: Write tests**
- [ ] **Step 3: Commit**

---

## Task 6: Canonical URL Check

**Files:**
- Create: `api/rules/accessibility/canonical-url.ts`

**What it checks:** Whether the page has a `<link rel="canonical">` tag and whether it points to the current URL (not a different page). Mismatched canonical URLs can cause AI to index the wrong version.

**Scoring:**
- 5/5: Canonical URL exists and matches the analyzed URL
- 3/5: Canonical URL exists but points elsewhere (possible intentional redirect)
- 0/5: No canonical URL

- [ ] **Step 1: Implement the rule**
- [ ] **Step 2: Write tests**
- [ ] **Step 3: Commit**

---

## Task 7: Wire Rules into Scorer & Update API

**Files:**
- Modify: `api/rules/index.ts`
- Modify: `api/lib/scorer.ts`
- Modify: `api/analyze.ts`
- Modify: `shared/types.ts` (update AnalysisResponse score structure)

- [ ] **Step 1: Add new rules to index**

```typescript
import { robotsTxtRule } from './accessibility/robots-txt.js'
import { metaDescriptionRule } from './accessibility/meta-description.js'
import { imageAltRule } from './accessibility/image-alt.js'
import { jsRenderingRule } from './accessibility/js-rendering.js'
import { canonicalUrlRule } from './accessibility/canonical-url.js'
```

- [ ] **Step 2: Update AnalysisResponse score to include accessibility**

```typescript
score: {
  total: number
  accessibility: number
  basic: number
  advanced: number
}
```

- [ ] **Step 3: Update analyze.ts with async robots.txt override**

Similar to the existing llms.txt override pattern.

- [ ] **Step 4: Update ScoreCard and Report components for 3 score categories**

- [ ] **Step 5: Run all tests**

```bash
cd api && npx vitest run
```

- [ ] **Step 6: Commit**

```bash
git commit -m "feat: integrate 5 AI crawler accessibility rules into scoring engine"
```

---

## Task 8: Deploy & Verify

- [ ] **Step 1: Push to GitHub**
- [ ] **Step 2: Deploy API to Vercel**
- [ ] **Step 3: Verify end-to-end with production**
- [ ] **Step 4: Test with various page types:**
  - A Shopify store with good setup (should score high across all categories)
  - A SPA-heavy site (should flag JS rendering issue)
  - A site that blocks GPTBot (should flag robots.txt issue)
  - A page with many images without alt (should flag image alt issue)

---

## Phase 9 New Rules Summary

| Rule | Category | Max Score | What it checks |
|------|----------|-----------|---------------|
| robots-txt-ai | accessibility | 10 | AI crawlers not blocked in robots.txt |
| meta-description | accessibility | 5 | Meta description exists and is good length |
| image-alt | accessibility | 5 | Product images have alt text |
| js-rendering | accessibility | 5 | Page content accessible without JS execution |
| canonical-url | accessibility | 5 | Canonical URL correct |

**Total new points: 30** (accessibility category)

## Phase 9 Completion Checklist

- [ ] 5 new accessibility rules implemented and tested
- [ ] New `accessibility` scoring category displayed in report
- [ ] robots.txt async check works (similar to llms-txt pattern)
- [ ] ScoreCard shows 3 score breakdowns (accessibility / basic / advanced)
- [ ] All tests pass
- [ ] Deployed and verified end-to-end
