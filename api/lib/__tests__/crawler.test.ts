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
