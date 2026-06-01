import { describe, it, expect } from 'vitest'
import { runAllRules } from '../scorer.js'
import type { PageData } from '../../../shared/types.js'

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

  it('collapses dependent rules when product-schema fails', () => {
    const results = runAllRules(EMPTY_PAGE)

    const schemaRule = results.find((r) => r.id === 'product-schema')
    expect(schemaRule?.status).toBe('fail')
    expect(schemaRule?.collapsed).toBe(false)

    const collapsed = results.filter((r) => r.collapsed)
    expect(collapsed.length).toBe(5)
    expect(collapsed.map((r) => r.id).sort()).toEqual([
      'aggregate-rating',
      'brand-info',
      'image-quality',
      'name-description',
      'price-currency',
    ])
  })

  it('does not collapse rules when product-schema passes', () => {
    const results = runAllRules(FULL_PAGE)
    const collapsed = results.filter((r) => r.collapsed)
    expect(collapsed.length).toBe(0)
  })
})
