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
