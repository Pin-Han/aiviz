import { describe, it, expect } from 'vitest'
import { productSchemaRule } from '../basic/product-schema.js'
import { nameDescriptionRule } from '../basic/name-description.js'
import { priceCurrencyRule } from '../basic/price-currency.js'
import type { PageData } from '../../../shared/types.js'

const basePageData: PageData = {
  url: 'https://example.com',
  html: '',
  jsonLd: null,
  openGraph: {},
  metaTags: {},
  crawlTimeMs: 500,
}

describe('productSchemaRule', () => {
  it('returns pass with 20 points when Product schema exists', () => {
    const page = { ...basePageData, jsonLd: { '@type': 'Product', name: 'Test' } }
    const result = productSchemaRule.check(page)
    expect(result.status).toBe('pass')
    expect(result.score).toBe(20)
  })

  it('returns fail with 0 points when no schema', () => {
    const result = productSchemaRule.check(basePageData)
    expect(result.status).toBe('fail')
    expect(result.score).toBe(0)
    expect(result.fix).toBeDefined()
    expect(result.code).toBeDefined()
  })
})

describe('nameDescriptionRule', () => {
  it('returns pass with 15 points when both name and description are present and long enough', () => {
    const page = {
      ...basePageData,
      jsonLd: {
        '@type': 'Product',
        name: 'Wireless Headphone',
        description: 'Premium wireless headphone with active noise cancellation and 30-hour battery life',
      },
    }
    const result = nameDescriptionRule.check(page)
    expect(result.status).toBe('pass')
    expect(result.score).toBe(15)
  })

  it('returns warn when description is too short', () => {
    const page = {
      ...basePageData,
      jsonLd: { '@type': 'Product', name: 'Headphone', description: 'Good' },
    }
    const result = nameDescriptionRule.check(page)
    expect(result.status).toBe('warn')
    expect(result.score).toBeGreaterThan(0)
    expect(result.score).toBeLessThan(15)
  })

  it('returns fail when both are missing', () => {
    const result = nameDescriptionRule.check(basePageData)
    expect(result.status).toBe('fail')
    expect(result.score).toBe(0)
  })
})

describe('priceCurrencyRule', () => {
  it('returns pass with 15 points when price and currency are valid', () => {
    const page = {
      ...basePageData,
      jsonLd: {
        '@type': 'Product',
        offers: { '@type': 'Offer', price: '2990', priceCurrency: 'TWD' },
      },
    }
    const result = priceCurrencyRule.check(page)
    expect(result.status).toBe('pass')
    expect(result.score).toBe(15)
  })

  it('returns warn when price exists but no currency', () => {
    const page = {
      ...basePageData,
      jsonLd: {
        '@type': 'Product',
        offers: { '@type': 'Offer', price: '2990' },
      },
    }
    const result = priceCurrencyRule.check(page)
    expect(result.status).toBe('warn')
  })

  it('returns fail when no offers at all', () => {
    const page = { ...basePageData, jsonLd: { '@type': 'Product' } }
    const result = priceCurrencyRule.check(page)
    expect(result.status).toBe('fail')
    expect(result.score).toBe(0)
  })
})
