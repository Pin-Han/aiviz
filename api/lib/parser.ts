import * as cheerio from 'cheerio'
import type { PageData, JsonLdProduct, OpenGraphData, MetaTagData } from '../../shared/types.js'

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
