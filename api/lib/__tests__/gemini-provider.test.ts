import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GeminiProvider } from '../gemini-provider.js'
import type { PageData } from '../../../shared/types.js'

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

const mockGenerateContent = vi.fn()

vi.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: vi.fn().mockImplementation(() => ({
    getGenerativeModel: vi.fn().mockReturnValue({
      generateContent: (...args: unknown[]) => mockGenerateContent(...args),
    }),
  })),
}))

describe('GeminiProvider', () => {
  let provider: GeminiProvider

  beforeEach(() => {
    vi.clearAllMocks()
    provider = new GeminiProvider('test-api-key')
  })

  it('returns readability assessment with summary, strengths, weaknesses', async () => {
    mockGenerateContent.mockResolvedValueOnce({
      response: {
        text: () =>
          JSON.stringify({
            summary: 'AI 能辨識這是一款無線耳機',
            strengths: ['商品名稱清晰'],
            weaknesses: ['缺少評價資料'],
          }),
      },
    })

    const result = await provider.assessReadability(mockPageData)

    expect(result.summary).toBe('AI 能辨識這是一款無線耳機')
    expect(result.strengths).toEqual(['商品名稱清晰'])
    expect(result.weaknesses).toEqual(['缺少評價資料'])
  })

  it('returns fallback result when API fails', async () => {
    mockGenerateContent.mockRejectedValueOnce(new Error('API Error'))

    const result = await provider.assessReadability(mockPageData)

    expect(result.summary).toContain('無法完成')
    expect(result.strengths).toEqual([])
    expect(result.weaknesses).toEqual([])
  })

  it('handles markdown-wrapped JSON response', async () => {
    mockGenerateContent.mockResolvedValueOnce({
      response: {
        text: () => '```json\n{"summary":"Test","strengths":["A"],"weaknesses":["B"]}\n```',
      },
    })

    const result = await provider.assessReadability(mockPageData)

    expect(result.summary).toBe('Test')
    expect(result.strengths).toEqual(['A'])
  })
})
