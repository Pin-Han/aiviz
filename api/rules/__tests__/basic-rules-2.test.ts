import { describe, it, expect } from 'vitest'
import { imageQualityRule } from '../basic/image-quality.js'
import { aggregateRatingRule } from '../basic/aggregate-rating.js'
import { brandInfoRule } from '../basic/brand-info.js'
import type { PageData } from '../../../shared/types.js'

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

  it('returns warn when ratingValue exceeds bestRating', () => {
    const page = {
      ...basePageData,
      jsonLd: {
        '@type': 'Product',
        aggregateRating: { '@type': 'AggregateRating', ratingValue: '6', bestRating: '5', reviewCount: '2985' },
      },
    }
    const result = aggregateRatingRule.check(page)
    expect(result.status).toBe('warn')
    expect(result.score).toBe(5)
    expect(result.message).toContain('超出範圍')
  })

  it('returns pass when ratingValue is within range', () => {
    const page = {
      ...basePageData,
      jsonLd: {
        '@type': 'Product',
        aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.5', bestRating: '5', reviewCount: '100' },
      },
    }
    const result = aggregateRatingRule.check(page)
    expect(result.status).toBe('pass')
    expect(result.score).toBe(10)
  })

  it('defaults bestRating to 5 when not specified', () => {
    const page = {
      ...basePageData,
      jsonLd: {
        '@type': 'Product',
        aggregateRating: { '@type': 'AggregateRating', ratingValue: '6', reviewCount: '50' },
      },
    }
    const result = aggregateRatingRule.check(page)
    expect(result.status).toBe('warn')
    expect(result.message).toContain('超出範圍')
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
