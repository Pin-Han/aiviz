# Phase 4: AI Layer & Rate Limiting

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the Gemini AI provider for readability assessment and fix suggestions, plus rate limiting with Vercel KV.

**Architecture:** `AIProvider` interface with `GeminiProvider` implementation. Rate limiter uses Vercel KV for per-IP and global counters with daily TTL.

**Tech Stack:** @google/generative-ai, @vercel/kv, Vitest

**Status:** Completed

**Depends on:** Phase 3 completed

---

## Task 1: Implement AI Provider Interface & Gemini Provider

**Files:**
- Create: `api/lib/ai-provider.ts`
- Create: `api/lib/gemini-provider.ts`
- Create: `api/lib/__tests__/gemini-provider.test.ts`

- [ ] **Step 1: Install Gemini SDK**

```bash
cd api && npm install @google/generative-ai
```

- [ ] **Step 2: Create AI provider interface**

Create `api/lib/ai-provider.ts`:

```typescript
import type { PageData, AiReadabilityResponse } from '@aiviz/shared/types.js'

export interface AIProvider {
  assessReadability(pageData: PageData): Promise<AiReadabilityResponse>
}
```

- [ ] **Step 3: Write failing test for Gemini provider**

Create `api/lib/__tests__/gemini-provider.test.ts`:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GeminiProvider } from '../gemini-provider.js'
import type { PageData } from '@aiviz/shared/types.js'

const mockPageData: PageData = {
  url: 'https://example.com/product',
  html: '',
  jsonLd: {
    '@type': 'Product',
    name: 'Wireless Headphone',
    description: 'Premium noise-cancelling headphone',
    brand: { '@type': 'Brand', name: 'BrandX' },
    offers: { '@type': 'Offer', price: '2990', priceCurrency: 'TWD' },
  },
  openGraph: { title: 'Wireless Headphone' },
  metaTags: { title: 'Wireless Headphone' },
  crawlTimeMs: 500,
}

// Mock the @google/generative-ai module
vi.mock('@google/generative-ai', () => {
  const mockGenerateContent = vi.fn().mockResolvedValue({
    response: {
      text: () =>
        JSON.stringify({
          summary: 'AI 能辨識這是一款無線耳機',
          strengths: ['商品名稱清晰'],
          weaknesses: ['缺少評價資料'],
        }),
    },
  })

  return {
    GoogleGenerativeAI: vi.fn().mockImplementation(() => ({
      getGenerativeModel: vi.fn().mockReturnValue({
        generateContent: mockGenerateContent,
      }),
    })),
  }
})

describe('GeminiProvider', () => {
  let provider: GeminiProvider

  beforeEach(() => {
    provider = new GeminiProvider('test-api-key')
  })

  it('returns readability assessment with summary, strengths, weaknesses', async () => {
    const result = await provider.assessReadability(mockPageData)

    expect(result.summary).toBe('AI 能辨識這是一款無線耳機')
    expect(result.strengths).toEqual(['商品名稱清晰'])
    expect(result.weaknesses).toEqual(['缺少評價資料'])
  })

  it('returns fallback result when API fails', async () => {
    const { GoogleGenerativeAI } = await import('@google/generative-ai')
    const mockInstance = new GoogleGenerativeAI('key')
    const model = mockInstance.getGenerativeModel({ model: 'test' })
    vi.mocked(model.generateContent).mockRejectedValueOnce(new Error('API Error'))

    const failProvider = new GeminiProvider('bad-key')
    const result = await failProvider.assessReadability(mockPageData)

    expect(result.summary).toContain('無法完成')
    expect(result.strengths).toEqual([])
    expect(result.weaknesses).toEqual([])
  })
})
```

- [ ] **Step 4: Run test to verify it fails**

```bash
cd api && npx vitest run lib/__tests__/gemini-provider.test.ts
```

Expected: FAIL — `GeminiProvider` not found.

- [ ] **Step 5: Implement Gemini provider**

Create `api/lib/gemini-provider.ts`:

```typescript
import { GoogleGenerativeAI } from '@google/generative-ai'
import type { PageData, AiReadabilityResponse } from '@aiviz/shared/types.js'
import type { AIProvider } from './ai-provider.js'

export class GeminiProvider implements AIProvider {
  private model

  constructor(apiKey: string) {
    const genAI = new GoogleGenerativeAI(apiKey)
    this.model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
  }

  async assessReadability(pageData: PageData): Promise<AiReadabilityResponse> {
    const prompt = this.buildPrompt(pageData)

    try {
      const result = await this.model.generateContent(prompt)
      const text = result.response.text()
      return this.parseResponse(text)
    } catch {
      return {
        summary: 'AI 可讀性評估無法完成，請稍後再試',
        strengths: [],
        weaknesses: [],
      }
    }
  }

  private buildPrompt(pageData: PageData): string {
    const jsonLdStr = pageData.jsonLd ? JSON.stringify(pageData.jsonLd, null, 2) : '(none)'
    const ogStr = JSON.stringify(pageData.openGraph, null, 2)
    const metaStr = JSON.stringify(pageData.metaTags, null, 2)

    return `你是一個 AI 搜尋引擎的分析專家。以下是一個電商商品頁面的結構化資料。
請從 AI 搜尋引擎的角度評估這個商品的可讀性。

商品頁 URL: ${pageData.url}

JSON-LD (schema.org):
${jsonLdStr}

Open Graph:
${ogStr}

Meta Tags:
${metaStr}

請用以下 JSON 格式回答（純 JSON，不要 markdown code block）：
{
  "summary": "一段 50-100 字的繁體中文摘要，說明 AI 從這些資料能理解什麼、缺少什麼",
  "strengths": ["優勢1", "優勢2"],
  "weaknesses": ["不足1", "不足2"]
}

注意：
- 用繁體中文回答
- strengths 和 weaknesses 各列 1-3 項
- summary 要具體，提到商品類別和品牌（如果有的話）`
  }

  private parseResponse(text: string): AiReadabilityResponse {
    try {
      // Remove potential markdown code block wrappers
      const cleaned = text
        .replace(/```json\s*/g, '')
        .replace(/```\s*/g, '')
        .trim()

      const parsed = JSON.parse(cleaned)
      return {
        summary: String(parsed.summary || ''),
        strengths: Array.isArray(parsed.strengths) ? parsed.strengths.map(String) : [],
        weaknesses: Array.isArray(parsed.weaknesses) ? parsed.weaknesses.map(String) : [],
      }
    } catch {
      return {
        summary: text.slice(0, 200),
        strengths: [],
        weaknesses: [],
      }
    }
  }
}
```

- [ ] **Step 6: Run test to verify it passes**

```bash
cd api && npx vitest run lib/__tests__/gemini-provider.test.ts
```

Expected: All tests PASS.

- [ ] **Step 7: Commit**

```bash
git add api/lib/ai-provider.ts api/lib/gemini-provider.ts api/lib/__tests__/gemini-provider.test.ts api/package.json
git commit -m "feat: implement Gemini AI provider for readability assessment"
```

---

## Task 2: Implement Rate Limiter

**Files:**
- Create: `api/lib/rate-limiter.ts`
- Create: `api/lib/__tests__/rate-limiter.test.ts`

- [ ] **Step 1: Install Vercel KV**

```bash
cd api && npm install @vercel/kv
```

- [ ] **Step 2: Write failing test**

Create `api/lib/__tests__/rate-limiter.test.ts`:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { checkRateLimit } from '../rate-limiter.js'

// Mock @vercel/kv
const mockGet = vi.fn()
const mockIncr = vi.fn()
const mockExpire = vi.fn()

vi.mock('@vercel/kv', () => ({
  kv: {
    get: (...args: unknown[]) => mockGet(...args),
    incr: (...args: unknown[]) => mockIncr(...args),
    expire: (...args: unknown[]) => mockExpire(...args),
  },
}))

describe('checkRateLimit', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('allows request when under limits', async () => {
    mockGet.mockResolvedValue(null) // No existing count
    mockIncr.mockResolvedValue(1)

    const result = await checkRateLimit('192.168.1.1')

    expect(result.allowed).toBe(true)
    expect(result.remaining).toBe(2) // 3 - 1 = 2
  })

  it('blocks request when IP limit exceeded', async () => {
    mockGet.mockImplementation((key: string) => {
      if (key.startsWith('rate:ip:')) return Promise.resolve(3)
      return Promise.resolve(10) // global count low
    })

    const result = await checkRateLimit('192.168.1.1')

    expect(result.allowed).toBe(false)
    expect(result.remaining).toBe(0)
  })

  it('blocks request when global limit exceeded', async () => {
    mockGet.mockImplementation((key: string) => {
      if (key.startsWith('rate:ip:')) return Promise.resolve(1)
      if (key === 'rate:global') return Promise.resolve(500)
      return Promise.resolve(null)
    })

    const result = await checkRateLimit('192.168.1.1')

    expect(result.allowed).toBe(false)
  })
})
```

- [ ] **Step 3: Run test to verify it fails**

```bash
cd api && npx vitest run lib/__tests__/rate-limiter.test.ts
```

Expected: FAIL — `checkRateLimit` not found.

- [ ] **Step 4: Implement rate limiter**

Create `api/lib/rate-limiter.ts`:

```typescript
import { kv } from '@vercel/kv'
import { RATE_LIMIT_PER_IP, RATE_LIMIT_GLOBAL } from '@aiviz/shared/constants.js'

export interface RateLimitResult {
  allowed: boolean
  remaining: number
}

function getSecondsUntilMidnightUTC8(): number {
  const now = new Date()
  // UTC+8 midnight
  const utc8Offset = 8 * 60 * 60 * 1000
  const nowUtc8 = new Date(now.getTime() + utc8Offset)
  const tomorrowUtc8 = new Date(nowUtc8)
  tomorrowUtc8.setUTCHours(0, 0, 0, 0)
  tomorrowUtc8.setUTCDate(tomorrowUtc8.getUTCDate() + 1)

  const diffMs = tomorrowUtc8.getTime() - nowUtc8.getTime()
  return Math.ceil(diffMs / 1000)
}

export async function checkRateLimit(ip: string): Promise<RateLimitResult> {
  const ipKey = `rate:ip:${ip}`
  const globalKey = 'rate:global'

  const [ipCount, globalCount] = await Promise.all([
    kv.get<number>(ipKey),
    kv.get<number>(globalKey),
  ])

  // Check if already at limit
  if ((ipCount ?? 0) >= RATE_LIMIT_PER_IP) {
    return { allowed: false, remaining: 0 }
  }

  if ((globalCount ?? 0) >= RATE_LIMIT_GLOBAL) {
    return { allowed: false, remaining: 0 }
  }

  // Increment counters
  const ttl = getSecondsUntilMidnightUTC8()

  const [newIpCount] = await Promise.all([
    kv.incr(ipKey),
    kv.incr(globalKey),
  ])

  // Set expiry (only on first increment to avoid resetting TTL)
  if (newIpCount === 1) {
    await kv.expire(ipKey, ttl)
  }
  if ((globalCount ?? 0) === 0) {
    await kv.expire(globalKey, ttl)
  }

  return {
    allowed: true,
    remaining: RATE_LIMIT_PER_IP - newIpCount,
  }
}
```

- [ ] **Step 5: Run test to verify it passes**

```bash
cd api && npx vitest run lib/__tests__/rate-limiter.test.ts
```

Expected: All tests PASS.

- [ ] **Step 6: Commit**

```bash
git add api/lib/rate-limiter.ts api/lib/__tests__/rate-limiter.test.ts api/package.json
git commit -m "feat: implement rate limiter with Vercel KV"
```

---

## Phase 4 Completion Checklist

- [ ] `GeminiProvider` calls Gemini API, returns structured readability assessment
- [ ] Gemini failure returns graceful fallback (not a crash)
- [ ] `checkRateLimit()` enforces per-IP (3/day) and global (500/day) limits
- [ ] Rate limit counters expire at UTC+8 midnight
- [ ] All tests pass: `cd api && npx vitest run`
