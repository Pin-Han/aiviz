# Phase 2: Crawler & Parser

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the data extraction layer — fetch a product page URL with Cheerio and extract JSON-LD, Open Graph, and meta tag data into the `PageData` structure.

**Architecture:** Two modules: `crawler.ts` fetches raw HTML via `fetch` + Cheerio, `parser.ts` extracts structured data from the HTML. Both are pure functions with no side effects beyond the HTTP call.

**Tech Stack:** Cheerio, Vitest

**Status:** Not Started

**Depends on:** Phase 1 completed

---

## Task 1: Implement Crawler

**Files:**
- Create: `api/lib/crawler.ts`
- Create: `api/lib/__tests__/crawler.test.ts`

- [ ] **Step 1: Write the failing test**

Create `api/lib/__tests__/crawler.test.ts`:

```typescript
import { describe, it, expect, vi } from 'vitest'
import { crawlUrl } from '../crawler.js'

describe('crawlUrl', () => {
  it('returns HTML and crawl time for a valid URL', async () => {
    const mockHtml = '<html><head><title>Test</title></head><body></body></html>'
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(mockHtml, { status: 200, headers: { 'content-type': 'text/html' } })
    )

    const result = await crawlUrl('https://example.com/product')

    expect(result.html).toBe(mockHtml)
    expect(result.crawlTimeMs).toBeGreaterThanOrEqual(0)
    expect(result.url).toBe('https://example.com/product')

    vi.restoreAllMocks()
  })

  it('throws on non-200 response', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response('Not Found', { status: 404 })
    )

    await expect(crawlUrl('https://example.com/missing')).rejects.toThrow('HTTP 404')

    vi.restoreAllMocks()
  })

  it('throws on timeout', async () => {
    vi.spyOn(globalThis, 'fetch').mockImplementationOnce(
      () => new Promise((_, reject) => setTimeout(() => reject(new Error('AbortError')), 100))
    )

    await expect(crawlUrl('https://example.com/slow', 50)).rejects.toThrow()

    vi.restoreAllMocks()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd api && npx vitest run lib/__tests__/crawler.test.ts
```

Expected: FAIL — `crawlUrl` not found.

- [ ] **Step 3: Implement crawler**

Create `api/lib/crawler.ts`:

```typescript
import { CRAWL_TIMEOUT_MS } from '@aiviz/shared/constants.js'

export interface CrawlResult {
  url: string
  html: string
  crawlTimeMs: number
}

export async function crawlUrl(
  url: string,
  timeoutMs: number = CRAWL_TIMEOUT_MS,
): Promise<CrawlResult> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)

  const start = Date.now()

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (compatible; AIViz/1.0; +https://github.com/user/aiviz)',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    const html = await response.text()
    const crawlTimeMs = Date.now() - start

    return { url, html, crawlTimeMs }
  } finally {
    clearTimeout(timer)
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
cd api && npx vitest run lib/__tests__/crawler.test.ts
```

Expected: 3 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add api/lib/crawler.ts api/lib/__tests__/crawler.test.ts
git commit -m "feat: implement URL crawler with timeout and error handling"
```

---

## Task 2: Implement Parser — JSON-LD Extraction

**Files:**
- Create: `api/lib/parser.ts`
- Create: `api/lib/__tests__/parser.test.ts`

- [ ] **Step 1: Write the failing test**

Create `api/lib/__tests__/parser.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { parseHtml } from '../parser.js'

const FULL_PRODUCT_HTML = `
<html>
<head>
  <title>Wireless Headphone - BrandX</title>
  <meta name="description" content="Best wireless headphone for music lovers">
  <meta name="robots" content="index, follow">
  <meta property="og:title" content="Wireless Headphone">
  <meta property="og:description" content="Best wireless headphone">
  <meta property="og:image" content="https://example.com/img.jpg">
  <meta property="og:type" content="product">
  <meta property="og:site_name" content="BrandX Store">
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Wireless Headphone",
    "description": "Premium wireless headphone with noise cancellation",
    "image": "https://example.com/headphone.jpg",
    "brand": { "@type": "Brand", "name": "BrandX" },
    "offers": {
      "@type": "Offer",
      "price": "2990",
      "priceCurrency": "TWD"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.5",
      "reviewCount": "89"
    }
  }
  </script>
</head>
<body></body>
</html>
`

describe('parseHtml', () => {
  it('extracts JSON-LD Product data', () => {
    const result = parseHtml(FULL_PRODUCT_HTML, 'https://example.com/product', 150)

    expect(result.jsonLd).not.toBeNull()
    expect(result.jsonLd!['@type']).toBe('Product')
    expect(result.jsonLd!.name).toBe('Wireless Headphone')
    expect(result.jsonLd!.brand).toEqual({ '@type': 'Brand', 'name': 'BrandX' })
    expect(result.jsonLd!.offers).toEqual({
      '@type': 'Offer',
      price: '2990',
      priceCurrency: 'TWD',
    })
    expect(result.jsonLd!.aggregateRating).toEqual({
      '@type': 'AggregateRating',
      ratingValue: '4.5',
      reviewCount: '89',
    })
  })

  it('extracts Open Graph data', () => {
    const result = parseHtml(FULL_PRODUCT_HTML, 'https://example.com/product', 150)

    expect(result.openGraph.title).toBe('Wireless Headphone')
    expect(result.openGraph.description).toBe('Best wireless headphone')
    expect(result.openGraph.image).toBe('https://example.com/img.jpg')
    expect(result.openGraph.type).toBe('product')
    expect(result.openGraph.siteName).toBe('BrandX Store')
  })

  it('extracts meta tags', () => {
    const result = parseHtml(FULL_PRODUCT_HTML, 'https://example.com/product', 150)

    expect(result.metaTags.title).toBe('Wireless Headphone - BrandX')
    expect(result.metaTags.description).toBe('Best wireless headphone for music lovers')
    expect(result.metaTags.robots).toBe('index, follow')
  })

  it('returns null jsonLd when no Product schema exists', () => {
    const html = '<html><head><title>No Schema</title></head><body></body></html>'
    const result = parseHtml(html, 'https://example.com', 100)

    expect(result.jsonLd).toBeNull()
  })

  it('handles multiple JSON-LD blocks and picks Product type', () => {
    const html = `
    <html><head>
      <script type="application/ld+json">{"@type":"WebSite","name":"Store"}</script>
      <script type="application/ld+json">{"@type":"Product","name":"Item"}</script>
    </head><body></body></html>
    `
    const result = parseHtml(html, 'https://example.com', 100)

    expect(result.jsonLd).not.toBeNull()
    expect(result.jsonLd!['@type']).toBe('Product')
    expect(result.jsonLd!.name).toBe('Item')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd api && npx vitest run lib/__tests__/parser.test.ts
```

Expected: FAIL — `parseHtml` not found.

- [ ] **Step 3: Implement parser**

Create `api/lib/parser.ts`:

```typescript
import * as cheerio from 'cheerio'
import type { PageData, JsonLdProduct, OpenGraphData, MetaTagData } from '@aiviz/shared/types.js'

export function parseHtml(html: string, url: string, crawlTimeMs: number): PageData {
  const $ = cheerio.load(html)

  const jsonLd = extractJsonLd($)
  const openGraph = extractOpenGraph($)
  const metaTags = extractMetaTags($)

  return {
    url,
    html,
    jsonLd,
    openGraph,
    metaTags,
    crawlTimeMs,
  }
}

function extractJsonLd($: cheerio.CheerioAPI): JsonLdProduct | null {
  const scripts = $('script[type="application/ld+json"]')
  let product: JsonLdProduct | null = null

  scripts.each((_, el) => {
    try {
      const text = $(el).html()
      if (!text) return

      const data = JSON.parse(text)

      // Handle @graph arrays
      if (data['@graph'] && Array.isArray(data['@graph'])) {
        const found = data['@graph'].find(
          (item: Record<string, unknown>) => item['@type'] === 'Product',
        )
        if (found) product = found as JsonLdProduct
        return
      }

      if (data['@type'] === 'Product') {
        product = data as JsonLdProduct
      }
    } catch {
      // Invalid JSON-LD, skip
    }
  })

  return product
}

function extractOpenGraph($: cheerio.CheerioAPI): OpenGraphData {
  return {
    title: $('meta[property="og:title"]').attr('content'),
    description: $('meta[property="og:description"]').attr('content'),
    image: $('meta[property="og:image"]').attr('content'),
    type: $('meta[property="og:type"]').attr('content'),
    siteName: $('meta[property="og:site_name"]').attr('content'),
  }
}

function extractMetaTags($: cheerio.CheerioAPI): MetaTagData {
  return {
    title: $('title').text() || undefined,
    description: $('meta[name="description"]').attr('content'),
    robots: $('meta[name="robots"]').attr('content'),
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
cd api && npx vitest run lib/__tests__/parser.test.ts
```

Expected: 5 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add api/lib/parser.ts api/lib/__tests__/parser.test.ts
git commit -m "feat: implement HTML parser for JSON-LD, Open Graph, meta tags"
```

---

## Phase 2 Completion Checklist

- [ ] `crawlUrl()` fetches HTML with timeout and error handling
- [ ] `parseHtml()` extracts JSON-LD Product, Open Graph, meta tags
- [ ] Handles edge cases: no schema, multiple JSON-LD blocks, @graph arrays
- [ ] All tests pass: `cd api && npx vitest run`
