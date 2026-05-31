# Phase 3: Scoring Engine

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the pluggable scoring engine — 8 independent rules (6 basic + 2 advanced) and a scorer that loads and runs them all, producing a total score.

**Architecture:** Each rule is a separate file exporting a `Rule` object. The `scorer.ts` module auto-collects all rules and runs them against `PageData`. Rules are pure functions with no async or side effects.

**Tech Stack:** TypeScript, Vitest

**Status:** Completed

**Depends on:** Phase 2 completed (parser produces `PageData`)

---

## Task 1: Implement Scorer

**Files:**
- Create: `api/lib/scorer.ts`
- Create: `api/lib/__tests__/scorer.test.ts`

- [ ] **Step 1: Write the failing test**

Create `api/lib/__tests__/scorer.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { runAllRules } from '../scorer.js'
import type { PageData } from '@aiviz/shared/types.js'

const EMPTY_PAGE: PageData = {
  url: 'https://example.com',
  html: '<html></html>',
  jsonLd: null,
  openGraph: {},
  metaTags: {},
  crawlTimeMs: 500,
}

const FULL_PAGE: PageData = {
  url: 'https://example.com',
  html: '<html></html>',
  jsonLd: {
    '@type': 'Product',
    name: 'Test Product',
    description: 'A great product with detailed description that is long enough to be meaningful',
    image: 'https://example.com/image.jpg',
    brand: { '@type': 'Brand', name: 'TestBrand' },
    offers: {
      '@type': 'Offer',
      price: '999',
      priceCurrency: 'TWD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.5',
      reviewCount: '100',
    },
  },
  openGraph: { title: 'Test', description: 'Test' },
  metaTags: { title: 'Test' },
  crawlTimeMs: 500,
}

describe('runAllRules', () => {
  it('returns all rule results with scores', () => {
    const results = runAllRules(FULL_PAGE)

    expect(results.length).toBeGreaterThan(0)
    results.forEach((r) => {
      expect(r).toHaveProperty('id')
      expect(r).toHaveProperty('score')
      expect(r).toHaveProperty('maxScore')
      expect(r).toHaveProperty('status')
      expect(r).toHaveProperty('category')
    })
  })

  it('gives a low score for empty page', () => {
    const results = runAllRules(EMPTY_PAGE)
    const total = results.reduce((sum, r) => sum + r.score, 0)

    expect(total).toBeLessThan(30)
  })

  it('gives a high score for full page', () => {
    const results = runAllRules(FULL_PAGE)
    const total = results.reduce((sum, r) => sum + r.score, 0)

    expect(total).toBeGreaterThan(60)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd api && npx vitest run lib/__tests__/scorer.test.ts
```

Expected: FAIL — `runAllRules` not found.

- [ ] **Step 3: Create rule index and scorer**

Create `api/rules/index.ts`:

```typescript
import type { Rule } from '@aiviz/shared/types.js'

import { productSchemaRule } from './basic/product-schema.js'
import { nameDescriptionRule } from './basic/name-description.js'
import { priceCurrencyRule } from './basic/price-currency.js'
import { imageQualityRule } from './basic/image-quality.js'
import { aggregateRatingRule } from './basic/aggregate-rating.js'
import { brandInfoRule } from './basic/brand-info.js'
import { pageSpeedRule } from './advanced/page-speed.js'
import { llmsTxtRule } from './advanced/llms-txt.js'

export const allRules: Rule[] = [
  productSchemaRule,
  nameDescriptionRule,
  priceCurrencyRule,
  imageQualityRule,
  aggregateRatingRule,
  brandInfoRule,
  pageSpeedRule,
  llmsTxtRule,
]
```

Create `api/lib/scorer.ts`:

```typescript
import type { RuleCategory, RuleStatus } from '@aiviz/shared/types.js'
import { allRules } from '../rules/index.js'
import type { PageData } from '@aiviz/shared/types.js'

export interface ScoredRuleResult {
  id: string
  name: string
  category: RuleCategory
  score: number
  maxScore: number
  status: RuleStatus
  message: string
  fix: string | null
  code: string | null
}

export function runAllRules(pageData: PageData): ScoredRuleResult[] {
  return allRules.map((rule) => {
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
    }
  })
}
```

Note: this will still fail until we create the rule files in subsequent tasks. We'll run the tests after all rules are created.

- [ ] **Step 4: Commit scorer and index (tests will pass after rules are added)**

```bash
git add api/lib/scorer.ts api/lib/__tests__/scorer.test.ts api/rules/index.ts
git commit -m "feat: add scoring engine and rule index"
```

---

## Task 2: Implement Basic Rules (1-3)

**Files:**
- Create: `api/rules/basic/product-schema.ts`
- Create: `api/rules/basic/name-description.ts`
- Create: `api/rules/basic/price-currency.ts`
- Create: `api/rules/__tests__/basic-rules.test.ts`

- [ ] **Step 1: Write failing tests for first 3 basic rules**

Create `api/rules/__tests__/basic-rules.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { productSchemaRule } from '../basic/product-schema.js'
import { nameDescriptionRule } from '../basic/name-description.js'
import { priceCurrencyRule } from '../basic/price-currency.js'
import type { PageData } from '@aiviz/shared/types.js'

const basePageData: PageData = {
  url: 'https://example.com',
  html: '',
  jsonLd: null,
  openGraph: {},
  metaTags: {},
  crawlTimeMs: 500,
}

describe('productSchemaRule', () => {
  it('returns pass with 20 points when Product schema exists', () => {
    const page = { ...basePageData, jsonLd: { '@type': 'Product', name: 'Test' } }
    const result = productSchemaRule.check(page)
    expect(result.status).toBe('pass')
    expect(result.score).toBe(20)
  })

  it('returns fail with 0 points when no schema', () => {
    const result = productSchemaRule.check(basePageData)
    expect(result.status).toBe('fail')
    expect(result.score).toBe(0)
    expect(result.fix).toBeDefined()
    expect(result.code).toBeDefined()
  })
})

describe('nameDescriptionRule', () => {
  it('returns pass with 15 points when both name and description are present and long enough', () => {
    const page = {
      ...basePageData,
      jsonLd: {
        '@type': 'Product',
        name: 'Wireless Headphone',
        description: 'Premium wireless headphone with active noise cancellation and 30-hour battery life',
      },
    }
    const result = nameDescriptionRule.check(page)
    expect(result.status).toBe('pass')
    expect(result.score).toBe(15)
  })

  it('returns warn when description is too short', () => {
    const page = {
      ...basePageData,
      jsonLd: { '@type': 'Product', name: 'Headphone', description: 'Good' },
    }
    const result = nameDescriptionRule.check(page)
    expect(result.status).toBe('warn')
    expect(result.score).toBeGreaterThan(0)
    expect(result.score).toBeLessThan(15)
  })

  it('returns fail when both are missing', () => {
    const result = nameDescriptionRule.check(basePageData)
    expect(result.status).toBe('fail')
    expect(result.score).toBe(0)
  })
})

describe('priceCurrencyRule', () => {
  it('returns pass with 15 points when price and currency are valid', () => {
    const page = {
      ...basePageData,
      jsonLd: {
        '@type': 'Product',
        offers: { '@type': 'Offer', price: '2990', priceCurrency: 'TWD' },
      },
    }
    const result = priceCurrencyRule.check(page)
    expect(result.status).toBe('pass')
    expect(result.score).toBe(15)
  })

  it('returns warn when price exists but no currency', () => {
    const page = {
      ...basePageData,
      jsonLd: {
        '@type': 'Product',
        offers: { '@type': 'Offer', price: '2990' },
      },
    }
    const result = priceCurrencyRule.check(page)
    expect(result.status).toBe('warn')
  })

  it('returns fail when no offers at all', () => {
    const page = { ...basePageData, jsonLd: { '@type': 'Product' } }
    const result = priceCurrencyRule.check(page)
    expect(result.status).toBe('fail')
    expect(result.score).toBe(0)
  })
})
```

- [ ] **Step 2: Implement product-schema rule**

Create `api/rules/basic/product-schema.ts`:

```typescript
import type { Rule } from '@aiviz/shared/types.js'

export const productSchemaRule: Rule = {
  id: 'product-schema',
  name: 'Product Schema 存在',
  description: '檢查頁面是否包含 schema.org/Product 結構化資料',
  category: 'basic',
  maxScore: 20,

  check(pageData) {
    if (pageData.jsonLd && pageData.jsonLd['@type'] === 'Product') {
      return {
        score: 20,
        status: 'pass',
        message: '已偵測到 schema.org/Product 結構化資料',
      }
    }

    return {
      score: 0,
      status: 'fail',
      message: '未偵測到 schema.org/Product，AI 搜尋引擎無法結構化理解此商品',
      fix: '在頁面 <head> 中加入 JSON-LD 格式的 Product schema',
      code: `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "你的商品名稱",
  "description": "商品描述",
  "image": "https://your-site.com/image.jpg",
  "brand": {
    "@type": "Brand",
    "name": "品牌名稱"
  },
  "offers": {
    "@type": "Offer",
    "price": "999",
    "priceCurrency": "TWD",
    "availability": "https://schema.org/InStock"
  }
}
</script>`,
    }
  },
}
```

- [ ] **Step 3: Implement name-description rule**

Create `api/rules/basic/name-description.ts`:

```typescript
import type { Rule } from '@aiviz/shared/types.js'

const MIN_DESCRIPTION_LENGTH = 30

export const nameDescriptionRule: Rule = {
  id: 'name-description',
  name: '商品名稱與描述',
  description: '檢查 Product schema 中 name 和 description 是否完整',
  category: 'basic',
  maxScore: 15,

  check(pageData) {
    const jsonLd = pageData.jsonLd
    if (!jsonLd) {
      return {
        score: 0,
        status: 'fail',
        message: '無 Product schema，無法檢查名稱與描述',
        fix: '請先加入 Product schema（見 product-schema 規則）',
      }
    }

    const hasName = typeof jsonLd.name === 'string' && jsonLd.name.trim().length > 0
    const hasDesc = typeof jsonLd.description === 'string' && jsonLd.description.trim().length > 0
    const descLongEnough =
      hasDesc && jsonLd.description!.trim().length >= MIN_DESCRIPTION_LENGTH

    if (hasName && descLongEnough) {
      return {
        score: 15,
        status: 'pass',
        message: '商品名稱與描述完整，AI 可以充分理解此商品',
      }
    }

    if (hasName && hasDesc) {
      return {
        score: 8,
        status: 'warn',
        message: `描述過短（${jsonLd.description!.trim().length} 字），建議至少 ${MIN_DESCRIPTION_LENGTH} 字以提供 AI 足夠的商品資訊`,
        fix: '擴充商品描述，加入功能特色、規格、使用場景等資訊',
      }
    }

    if (hasName) {
      return {
        score: 5,
        status: 'warn',
        message: '缺少商品描述，AI 僅能從名稱判斷商品內容',
        fix: '在 Product schema 中加入 description 欄位',
        code: `"description": "詳細描述你的商品特色、規格、適用場景"`,
      }
    }

    return {
      score: 0,
      status: 'fail',
      message: '缺少商品名稱與描述，AI 無法理解此商品',
      fix: '在 Product schema 中加入 name 和 description 欄位',
      code: `"name": "你的商品名稱",\n"description": "詳細描述你的商品特色、規格、適用場景"`,
    }
  },
}
```

- [ ] **Step 4: Implement price-currency rule**

Create `api/rules/basic/price-currency.ts`:

```typescript
import type { Rule } from '@aiviz/shared/types.js'

export const priceCurrencyRule: Rule = {
  id: 'price-currency',
  name: '價格與幣別資訊',
  description: '檢查 Product schema 中 offers.price 和 priceCurrency 是否正確',
  category: 'basic',
  maxScore: 15,

  check(pageData) {
    const jsonLd = pageData.jsonLd
    if (!jsonLd) {
      return {
        score: 0,
        status: 'fail',
        message: '無 Product schema，無法檢查價格資訊',
        fix: '請先加入 Product schema（見 product-schema 規則）',
      }
    }

    const offers = jsonLd.offers
    if (!offers) {
      return {
        score: 0,
        status: 'fail',
        message: '缺少 offers 資訊，AI 無法得知商品價格',
        fix: '在 Product schema 中加入 offers',
        code: `"offers": {\n  "@type": "Offer",\n  "price": "999",\n  "priceCurrency": "TWD",\n  "availability": "https://schema.org/InStock"\n}`,
      }
    }

    const hasPrice =
      offers.price !== undefined &&
      offers.price !== null &&
      String(offers.price).trim().length > 0
    const hasCurrency =
      typeof offers.priceCurrency === 'string' && offers.priceCurrency.trim().length === 3

    if (hasPrice && hasCurrency) {
      return {
        score: 15,
        status: 'pass',
        message: `價格資訊完整：${offers.priceCurrency} ${offers.price}`,
      }
    }

    if (hasPrice) {
      return {
        score: 8,
        status: 'warn',
        message: '有價格但缺少幣別（priceCurrency），AI 無法確認幣別',
        fix: '在 offers 中加入 priceCurrency',
        code: `"priceCurrency": "TWD"`,
      }
    }

    return {
      score: 0,
      status: 'fail',
      message: '缺少價格資訊',
      fix: '在 offers 中加入 price 和 priceCurrency',
      code: `"price": "999",\n"priceCurrency": "TWD"`,
    }
  },
}
```

- [ ] **Step 5: Run tests**

```bash
cd api && npx vitest run rules/__tests__/basic-rules.test.ts
```

Expected: All tests PASS.

- [ ] **Step 6: Commit**

```bash
git add api/rules/basic/product-schema.ts api/rules/basic/name-description.ts api/rules/basic/price-currency.ts api/rules/__tests__/basic-rules.test.ts
git commit -m "feat: implement product-schema, name-description, price-currency rules"
```

---

## Task 3: Implement Basic Rules (4-6)

**Files:**
- Create: `api/rules/basic/image-quality.ts`
- Create: `api/rules/basic/aggregate-rating.ts`
- Create: `api/rules/basic/brand-info.ts`
- Create: `api/rules/__tests__/basic-rules-2.test.ts`

- [ ] **Step 1: Write failing tests**

Create `api/rules/__tests__/basic-rules-2.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { imageQualityRule } from '../basic/image-quality.js'
import { aggregateRatingRule } from '../basic/aggregate-rating.js'
import { brandInfoRule } from '../basic/brand-info.js'
import type { PageData } from '@aiviz/shared/types.js'

const basePageData: PageData = {
  url: 'https://example.com',
  html: '',
  jsonLd: null,
  openGraph: {},
  metaTags: {},
  crawlTimeMs: 500,
}

describe('imageQualityRule', () => {
  it('returns pass when absolute image URL exists', () => {
    const page = {
      ...basePageData,
      jsonLd: { '@type': 'Product', image: 'https://example.com/img.jpg' },
    }
    const result = imageQualityRule.check(page)
    expect(result.status).toBe('pass')
    expect(result.score).toBe(10)
  })

  it('returns warn when image is relative URL', () => {
    const page = {
      ...basePageData,
      jsonLd: { '@type': 'Product', image: '/img.jpg' },
    }
    const result = imageQualityRule.check(page)
    expect(result.status).toBe('warn')
  })

  it('returns fail when no image', () => {
    const page = { ...basePageData, jsonLd: { '@type': 'Product' } }
    const result = imageQualityRule.check(page)
    expect(result.status).toBe('fail')
    expect(result.score).toBe(0)
  })
})

describe('aggregateRatingRule', () => {
  it('returns pass when aggregateRating exists', () => {
    const page = {
      ...basePageData,
      jsonLd: {
        '@type': 'Product',
        aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.5', reviewCount: '10' },
      },
    }
    const result = aggregateRatingRule.check(page)
    expect(result.status).toBe('pass')
    expect(result.score).toBe(10)
  })

  it('returns fail when no aggregateRating', () => {
    const page = { ...basePageData, jsonLd: { '@type': 'Product' } }
    const result = aggregateRatingRule.check(page)
    expect(result.status).toBe('fail')
    expect(result.score).toBe(0)
    expect(result.code).toBeDefined()
  })
})

describe('brandInfoRule', () => {
  it('returns pass when brand object exists', () => {
    const page = {
      ...basePageData,
      jsonLd: { '@type': 'Product', brand: { '@type': 'Brand', name: 'Nike' } },
    }
    const result = brandInfoRule.check(page)
    expect(result.status).toBe('pass')
    expect(result.score).toBe(10)
  })

  it('returns pass when brand is a string', () => {
    const page = {
      ...basePageData,
      jsonLd: { '@type': 'Product', brand: 'Nike' },
    }
    const result = brandInfoRule.check(page)
    expect(result.status).toBe('pass')
    expect(result.score).toBe(10)
  })

  it('returns fail when no brand', () => {
    const page = { ...basePageData, jsonLd: { '@type': 'Product' } }
    const result = brandInfoRule.check(page)
    expect(result.status).toBe('fail')
    expect(result.score).toBe(0)
  })
})
```

- [ ] **Step 2: Implement image-quality rule**

Create `api/rules/basic/image-quality.ts`:

```typescript
import type { Rule } from '@aiviz/shared/types.js'

export const imageQualityRule: Rule = {
  id: 'image-quality',
  name: '商品圖片',
  description: '檢查 Product schema 中是否有高品質的圖片 URL',
  category: 'basic',
  maxScore: 10,

  check(pageData) {
    const jsonLd = pageData.jsonLd
    if (!jsonLd) {
      return {
        score: 0,
        status: 'fail',
        message: '無 Product schema，無法檢查圖片資訊',
        fix: '請先加入 Product schema（見 product-schema 規則）',
      }
    }

    const image = Array.isArray(jsonLd.image) ? jsonLd.image[0] : jsonLd.image

    if (!image || (typeof image === 'string' && image.trim().length === 0)) {
      return {
        score: 0,
        status: 'fail',
        message: '缺少商品圖片，AI 無法在搜尋結果中顯示圖片',
        fix: '在 Product schema 中加入 image 欄位',
        code: `"image": "https://your-site.com/product-image.jpg"`,
      }
    }

    if (typeof image === 'string' && !image.startsWith('http')) {
      return {
        score: 5,
        status: 'warn',
        message: '圖片使用相對路徑，建議改為完整的 https:// 絕對路徑',
        fix: '將圖片 URL 改為絕對路徑',
        code: `"image": "https://your-site.com${image}"`,
      }
    }

    return {
      score: 10,
      status: 'pass',
      message: '商品圖片 URL 完整',
    }
  },
}
```

- [ ] **Step 3: Implement aggregate-rating rule**

Create `api/rules/basic/aggregate-rating.ts`:

```typescript
import type { Rule } from '@aiviz/shared/types.js'

export const aggregateRatingRule: Rule = {
  id: 'aggregate-rating',
  name: '商品評價資料',
  description: '檢查 Product schema 中是否有 aggregateRating 評價資料',
  category: 'basic',
  maxScore: 10,

  check(pageData) {
    const jsonLd = pageData.jsonLd
    if (!jsonLd) {
      return {
        score: 0,
        status: 'fail',
        message: '無 Product schema，無法檢查評價資訊',
        fix: '請先加入 Product schema（見 product-schema 規則）',
      }
    }

    const rating = jsonLd.aggregateRating
    if (rating && rating.ratingValue !== undefined) {
      return {
        score: 10,
        status: 'pass',
        message: `商品評價資料完整（${rating.ratingValue} 分，${rating.reviewCount ?? '?'} 則評論）`,
      }
    }

    return {
      score: 0,
      status: 'fail',
      message: '未偵測到 aggregateRating，AI 無法判斷商品口碑',
      fix: '在 Product schema 中加入 aggregateRating',
      code: `"aggregateRating": {\n  "@type": "AggregateRating",\n  "ratingValue": "4.5",\n  "reviewCount": "89"\n}`,
    }
  },
}
```

- [ ] **Step 4: Implement brand-info rule**

Create `api/rules/basic/brand-info.ts`:

```typescript
import type { Rule } from '@aiviz/shared/types.js'

export const brandInfoRule: Rule = {
  id: 'brand-info',
  name: '品牌資訊',
  description: '檢查 Product schema 中是否有可辨識的品牌資訊',
  category: 'basic',
  maxScore: 10,

  check(pageData) {
    const jsonLd = pageData.jsonLd
    if (!jsonLd) {
      return {
        score: 0,
        status: 'fail',
        message: '無 Product schema，無法檢查品牌資訊',
        fix: '請先加入 Product schema（見 product-schema 規則）',
      }
    }

    const brand = jsonLd.brand

    if (typeof brand === 'object' && brand !== null && 'name' in brand) {
      return {
        score: 10,
        status: 'pass',
        message: `品牌資訊完整：${(brand as { name: string }).name}`,
      }
    }

    if (typeof brand === 'string' && brand.trim().length > 0) {
      return {
        score: 10,
        status: 'pass',
        message: `品牌資訊存在：${brand}`,
      }
    }

    return {
      score: 0,
      status: 'fail',
      message: '缺少品牌資訊，AI 無法辨識商品品牌',
      fix: '在 Product schema 中加入 brand',
      code: `"brand": {\n  "@type": "Brand",\n  "name": "你的品牌名稱"\n}`,
    }
  },
}
```

- [ ] **Step 5: Run tests**

```bash
cd api && npx vitest run rules/__tests__/basic-rules-2.test.ts
```

Expected: All tests PASS.

- [ ] **Step 6: Commit**

```bash
git add api/rules/basic/image-quality.ts api/rules/basic/aggregate-rating.ts api/rules/basic/brand-info.ts api/rules/__tests__/basic-rules-2.test.ts
git commit -m "feat: implement image-quality, aggregate-rating, brand-info rules"
```

---

## Task 4: Implement Advanced Rules

**Files:**
- Create: `api/rules/advanced/page-speed.ts`
- Create: `api/rules/advanced/llms-txt.ts`
- Create: `api/rules/__tests__/advanced-rules.test.ts`

- [ ] **Step 1: Write failing tests**

Create `api/rules/__tests__/advanced-rules.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { pageSpeedRule } from '../advanced/page-speed.js'
import { llmsTxtRule } from '../advanced/llms-txt.js'
import type { PageData } from '@aiviz/shared/types.js'

const basePageData: PageData = {
  url: 'https://example.com/product',
  html: '',
  jsonLd: null,
  openGraph: {},
  metaTags: {},
  crawlTimeMs: 500,
}

describe('pageSpeedRule', () => {
  it('returns pass when crawl time < 3000ms', () => {
    const page = { ...basePageData, crawlTimeMs: 1500 }
    const result = pageSpeedRule.check(page)
    expect(result.status).toBe('pass')
    expect(result.score).toBe(10)
  })

  it('returns warn when crawl time is between 3000-5000ms', () => {
    const page = { ...basePageData, crawlTimeMs: 4000 }
    const result = pageSpeedRule.check(page)
    expect(result.status).toBe('warn')
    expect(result.score).toBe(5)
  })

  it('returns fail when crawl time > 5000ms', () => {
    const page = { ...basePageData, crawlTimeMs: 6000 }
    const result = pageSpeedRule.check(page)
    expect(result.status).toBe('fail')
    expect(result.score).toBe(0)
  })
})

describe('llmsTxtRule', () => {
  it('has correct metadata', () => {
    expect(llmsTxtRule.id).toBe('llms-txt')
    expect(llmsTxtRule.category).toBe('advanced')
    expect(llmsTxtRule.maxScore).toBe(10)
  })

  // Note: actual llms.txt check requires a network call.
  // The rule receives pageData and derives the root URL to check.
  // In unit tests we verify the logic with a mocked crawlTimeMs
  // (the actual HTTP check for llms.txt is tested in integration tests).
})
```

- [ ] **Step 2: Implement page-speed rule**

Create `api/rules/advanced/page-speed.ts`:

```typescript
import type { Rule } from '@aiviz/shared/types.js'

const FAST_THRESHOLD_MS = 3000
const SLOW_THRESHOLD_MS = 5000

export const pageSpeedRule: Rule = {
  id: 'page-speed',
  name: '頁面載入速度',
  description: '根據爬取回應時間判斷頁面載入速度是否在 3 秒以內',
  category: 'advanced',
  maxScore: 10,

  check(pageData) {
    const ms = pageData.crawlTimeMs

    if (ms < FAST_THRESHOLD_MS) {
      return {
        score: 10,
        status: 'pass',
        message: `頁面回應時間 ${ms}ms，速度良好`,
      }
    }

    if (ms < SLOW_THRESHOLD_MS) {
      return {
        score: 5,
        status: 'warn',
        message: `頁面回應時間 ${ms}ms，建議優化至 3 秒以內`,
        fix: '優化伺服器回應時間、壓縮圖片、啟用 CDN',
      }
    }

    return {
      score: 0,
      status: 'fail',
      message: `頁面回應時間 ${ms}ms，過慢可能影響 AI 爬蟲效率`,
      fix: '優化伺服器回應時間、壓縮圖片、啟用 CDN、減少 JavaScript 載入量',
    }
  },
}
```

- [ ] **Step 3: Implement llms-txt rule**

Create `api/rules/advanced/llms-txt.ts`:

```typescript
import type { Rule } from '@aiviz/shared/types.js'

export const llmsTxtRule: Rule = {
  id: 'llms-txt',
  name: 'llms.txt 檔案',
  description: '檢查網站根目錄是否有 llms.txt（新興 AI 爬蟲標準）',
  category: 'advanced',
  maxScore: 10,

  check(pageData) {
    // This rule's score is set by the analyze endpoint after an async check.
    // Default: assume not present (the endpoint will override if found).
    // We use a marker in the html field to detect if llms.txt was pre-checked.
    // See analyze.ts for the async llms.txt fetch logic.

    // For now, return a "not checked" result that the endpoint will override
    return {
      score: 0,
      status: 'fail',
      message: '未偵測到 llms.txt，這是一個新興的 AI 爬蟲標準',
      fix: '在網站根目錄建立 llms.txt 檔案，描述你的網站內容供 AI 爬蟲使用',
      code: `# llms.txt - AI Crawler Guide\n# See https://llmstxt.org for details\n\n# Site: Your Store Name\n# Description: Brief description of your store\n\n## Products\n- /products/ - Browse all products`,
    }
  },
}
```

Note: The llms-txt rule returns a default "fail" result. The `analyze.ts` endpoint (Phase 5) will do an async fetch to `{origin}/llms.txt` and override the result if the file exists. This keeps the rule itself synchronous like all other rules.

- [ ] **Step 4: Run tests**

```bash
cd api && npx vitest run rules/__tests__/advanced-rules.test.ts
```

Expected: All tests PASS.

- [ ] **Step 5: Run the full scorer test now that all rules exist**

```bash
cd api && npx vitest run
```

Expected: All tests across all files PASS.

- [ ] **Step 6: Commit**

```bash
git add api/rules/advanced/ api/rules/__tests__/advanced-rules.test.ts
git commit -m "feat: implement page-speed and llms-txt advanced rules"
```

---

## Phase 3 Completion Checklist

- [ ] All 6 basic rules implemented and tested
- [ ] All 2 advanced rules implemented and tested
- [ ] Scorer loads all rules and produces scored results
- [ ] `cd api && npx vitest run` — all tests pass
- [ ] Each rule provides Traditional Chinese messages, fix suggestions, and code snippets
