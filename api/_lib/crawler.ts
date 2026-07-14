import { CRAWL_TIMEOUT_MS } from '../../shared/constants.js'

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
          'Mozilla/5.0 (compatible; AIViz/1.0; +https://github.com/Pin-Han/aiviz)',
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
