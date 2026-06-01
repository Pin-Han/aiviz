import type { PageData } from '../../shared/types.js'

export type PageType = 'product' | 'homepage' | 'other'

export function detectPageType(pageData: PageData): PageType {
  // Strongest signal: JSON-LD Product type
  if (pageData.jsonLd && pageData.jsonLd['@type'] === 'Product') return 'product'

  // OG type
  if (pageData.openGraph.type === 'product') return 'product'

  // URL patterns
  const path = new URL(pageData.url).pathname.toLowerCase()

  // Homepage
  if (path === '/' || path === '') return 'homepage'

  // Product URL patterns (common across Shopify, WooCommerce, CYBERBIZ, etc.)
  const productPatterns = ['/product', '/item', '/p/', '/shop/', '/buy-', '/goods/']
  if (productPatterns.some((p) => path.includes(p))) return 'product'

  return 'other'
}
