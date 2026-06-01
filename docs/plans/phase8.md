# Phase 8: UX Improvements — Scoring Intelligence

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix scoring redundancy when Product Schema is missing, detect non-product pages, and enhance AI readability suggestions. These three issues were identified during first-round user testing.

**Architecture:** Changes span scorer logic, AI prompt, and frontend display. No new dependencies.

**Tech Stack:** TypeScript, Vitest, Gemini API prompt engineering

**Status:** Completed

**Depends on:** Phase 7 completed

---

## Task 1: Fix Scoring Redundancy (No Product Schema)

**Problem:** When a page has no Product Schema, all 5 sub-rules (name-description, price-currency, image-quality, aggregate-rating, brand-info) each display "無 Product schema，無法檢查" — highly redundant.

**Solution:** Add a `collapsed` flag to rule results. When `product-schema` fails, the scorer marks all dependent rules as `collapsed`. The frontend groups collapsed rules into a single summary line instead of showing 5 identical messages.

**Files:**
- Modify: `shared/types.ts`
- Modify: `api/lib/scorer.ts`
- Modify: `api/rules/basic/product-schema.ts`
- Modify: `frontend/src/components/RuleList.tsx`
- Modify: `api/lib/__tests__/scorer.test.ts`

- [ ] **Step 1: Add `collapsed` field to response types**

In `shared/types.ts`, add `collapsed` to the rules array item in `AnalysisResponse`:

```typescript
// In AnalysisResponse.rules array item, add:
collapsed: boolean  // true when result is redundant due to a parent rule failing
```

- [ ] **Step 2: Update scorer to mark dependent rules as collapsed**

In `api/lib/scorer.ts`, after running all rules, check if `product-schema` failed. If so, mark all other basic rules (except product-schema itself) as `collapsed: true`:

```typescript
export function runAllRules(pageData: PageData): ScoredRuleResult[] {
  const results = allRules.map((rule) => {
    const result = rule.check(pageData)
    return {
      id: rule.id,
      name: rule.name,
      category: rule.category,
      score: result.score,
      maxScore: rule.maxScore,
      status: result.status,
      message: result.message,
      fix: result.fix ?? null,
      code: result.code ?? null,
      collapsed: false,
    }
  })

  // If product-schema failed, collapse dependent basic rules
  const schemaRule = results.find((r) => r.id === 'product-schema')
  if (schemaRule && schemaRule.status === 'fail') {
    const dependentIds = [
      'name-description', 'price-currency', 'image-quality',
      'aggregate-rating', 'brand-info',
    ]
    results.forEach((r) => {
      if (dependentIds.includes(r.id)) {
        r.collapsed = true
      }
    })
  }

  return results
}
```

- [ ] **Step 3: Update frontend RuleList to group collapsed rules**

In `frontend/src/components/RuleList.tsx`, render collapsed rules as a single summary:

```tsx
// Inside RuleSection, separate collapsed and visible rules
const visible = rules.filter((r) => !r.collapsed)
const collapsed = rules.filter((r) => r.collapsed)

// Render visible rules normally, then if collapsed exists:
{collapsed.length > 0 && (
  <div className="glass-card p-4 text-sm text-text-muted">
    <span className="text-fail">⊘</span> 另有 {collapsed.length} 項因缺少 Product Schema 而無法檢查
    <span className="text-text-dim ml-1">（加入 Product Schema 後自動解鎖）</span>
  </div>
)}
```

- [ ] **Step 4: Update scorer tests**

Add test case: when jsonLd is null, collapsed rules should be marked correctly.

- [ ] **Step 5: Run tests**

```bash
cd api && npx vitest run
```

- [ ] **Step 6: Commit**

```bash
git add shared/types.ts api/lib/scorer.ts api/lib/__tests__/scorer.test.ts frontend/src/components/RuleList.tsx
git commit -m "fix: collapse redundant rule messages when Product Schema is missing"
```

---

## Task 2: Page Type Detection

**Problem:** Users may input a homepage, blog post, or category page. These pages legitimately don't have Product Schema, but the tool gives them a very low score — making it seem like the tool is broken.

**Solution:** Add a page type detection step in the analyze pipeline. Before scoring, check if the page appears to be a product page. If not, return a different response mode with a helpful message instead of misleading scores.

**Files:**
- Create: `api/lib/page-detector.ts`
- Create: `api/lib/__tests__/page-detector.test.ts`
- Modify: `shared/types.ts`
- Modify: `api/analyze.ts`
- Modify: `frontend/src/components/Report.tsx`

- [ ] **Step 1: Create page type detector**

Create `api/lib/page-detector.ts`:

Detection logic (heuristic-based):
- **Product page signals:** JSON-LD with `@type: Product`, OG type is `product`, URL contains `/product`, `/item`, `/p/`, price-related meta tags
- **Homepage signals:** URL path is `/` or empty, JSON-LD type is `WebSite` or `Organization`
- **Other signals:** Blog post (`article` OG type), category page (multiple product links)

```typescript
export type PageType = 'product' | 'homepage' | 'other'

export function detectPageType(pageData: PageData): PageType {
  // Check JSON-LD
  if (pageData.jsonLd && pageData.jsonLd['@type'] === 'Product') return 'product'

  // Check URL patterns
  const path = new URL(pageData.url).pathname.toLowerCase()
  if (path === '/' || path === '') return 'homepage'

  const productPatterns = ['/product', '/item', '/p/', '/shop/', '/buy-']
  if (productPatterns.some((p) => path.includes(p))) return 'product'

  // Check OG type
  if (pageData.openGraph.type === 'product') return 'product'

  return 'other'
}
```

- [ ] **Step 2: Add page type to API response**

In `shared/types.ts`, add to `AnalysisResponse`:

```typescript
pageType: 'product' | 'homepage' | 'other'
pageTypeMessage?: string  // friendly message for non-product pages
```

- [ ] **Step 3: Update analyze endpoint**

In `api/analyze.ts`, after parsing but before scoring:

```typescript
const pageType = detectPageType(pageData)

// For non-product pages, still run scoring but add context
let pageTypeMessage: string | undefined
if (pageType === 'homepage') {
  pageTypeMessage = '偵測到這是首頁而非商品頁。首頁通常不包含 Product Schema，這是正常的。建議輸入單一商品的 URL 以獲得更準確的分析。'
} else if (pageType === 'other') {
  pageTypeMessage = '此頁面可能不是商品頁。如果這是商品頁但缺少結構化資料，請參考下方的修復建議。'
}
```

- [ ] **Step 4: Update frontend Report to show page type banner**

In `frontend/src/components/Report.tsx`, if `pageTypeMessage` exists, show an info banner at the top of the report:

```tsx
{data.pageTypeMessage && (
  <div className="glass-card p-4 border-warn/20 animate-fade-in-up">
    <div className="flex items-start gap-3">
      <span className="text-warn text-lg">⚠</span>
      <p className="text-sm text-text-muted">{data.pageTypeMessage}</p>
    </div>
  </div>
)}
```

- [ ] **Step 5: Write tests for page detector**

Test cases:
- URL with `/products/` → `product`
- URL `/` → `homepage`
- URL with no signals → `other`
- Page with Product JSON-LD → `product` regardless of URL

- [ ] **Step 6: Run tests**

```bash
cd api && npx vitest run
```

- [ ] **Step 7: Commit**

```bash
git add api/lib/page-detector.ts api/lib/__tests__/page-detector.test.ts shared/types.ts api/analyze.ts frontend/src/components/Report.tsx
git commit -m "feat: add page type detection with user-friendly messaging"
```

---

## Task 3: Enhanced AI Readability Suggestions

**Problem:** Current AI readability only shows summary + strengths/weaknesses. Users want more actionable guidance: how competitive is this page, what would improvement look like, and what do similar products typically include.

**Solution:** Enhance the Gemini prompt to return additional fields: a competitiveness score (1-10), estimated improvement potential, and peer comparison hints.

**Files:**
- Modify: `shared/types.ts`
- Modify: `api/lib/gemini-provider.ts`
- Modify: `frontend/src/components/AiReadability.tsx`

- [ ] **Step 1: Extend AI readability response type**

In `shared/types.ts`, update `AiReadabilityResponse`:

```typescript
export interface AiReadabilityResponse {
  summary: string
  strengths: string[]
  weaknesses: string[]
  competitivenessScore: number    // 1-10, how likely AI would cite this product
  improvementPotential: string    // e.g., "補上評價與品牌資訊後，可見度預估提升 30-40%"
  peerComparison: string          // e.g., "同類商品頁面通常包含評價資料與規格比較表"
}
```

- [ ] **Step 2: Update Gemini prompt**

In `api/lib/gemini-provider.ts`, extend the prompt to request the new fields:

```
請用以下 JSON 格式回答（純 JSON，不要 markdown code block）：
{
  "summary": "一段 50-100 字的繁體中文摘要...",
  "strengths": ["優勢1", "優勢2"],
  "weaknesses": ["不足1", "不足2"],
  "competitivenessScore": 7,
  "improvementPotential": "一句話說明改善後的預估效果",
  "peerComparison": "一句話說明同類商品頁面通常具備什麼"
}
```

Update `parseResponse` to handle the new fields with safe defaults.

- [ ] **Step 3: Update frontend AiReadability component**

Add three new sections below the existing strengths/weaknesses:

```tsx
{/* Competitiveness gauge */}
<div className="flex items-center gap-3 mt-4">
  <span className="text-xs font-mono text-text-dim">COMPETITIVENESS</span>
  <div className="flex-1 h-2 bg-surface-2 rounded-full">
    <div className="h-full rounded-full bg-accent" style={{ width: `${score * 10}%` }} />
  </div>
  <span className="text-sm font-mono text-accent">{score}/10</span>
</div>

{/* Improvement potential */}
<p className="text-sm text-text-muted mt-3">📈 {improvementPotential}</p>

{/* Peer comparison */}
<p className="text-sm text-text-muted mt-1">🔍 {peerComparison}</p>
```

- [ ] **Step 4: Update Gemini provider tests**

Update mock responses to include the new fields.

- [ ] **Step 5: Run tests**

```bash
cd api && npx vitest run
```

- [ ] **Step 6: Commit**

```bash
git add shared/types.ts api/lib/gemini-provider.ts api/lib/__tests__/gemini-provider.test.ts frontend/src/components/AiReadability.tsx
git commit -m "feat: enhance AI readability with competitiveness score and peer comparison"
```

---

## Phase 8 Completion Checklist

- [ ] No more repeated "無 Product schema" messages — collapsed into one line
- [ ] Homepage and non-product pages show a friendly info banner
- [ ] AI readability now includes competitiveness score, improvement potential, peer comparison
- [ ] All tests pass
- [ ] Deployed to Vercel and GitHub Pages
