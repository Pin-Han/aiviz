import { describe, it, expect } from 'vitest'
import { detectPageType } from '../page-detector.js'
import type { PageData } from '../../../shared/types.js'

const basePage: PageData = {
  url: 'https://example.com',
  html: '',
  jsonLd: null,
  openGraph: {},
  metaTags: {},
  crawlTimeMs: 500,
}

describe('detectPageType', () => {
  it('returns product when JSON-LD has Product type', () => {
    const page = { ...basePage, url: 'https://example.com/blog', jsonLd: { '@type': 'Product' } }
    expect(detectPageType(page)).toBe('product')
  })

  it('returns product when OG type is product', () => {
    const page = { ...basePage, url: 'https://example.com/some-page', openGraph: { type: 'product' } }
    expect(detectPageType(page)).toBe('product')
  })

  it('returns product for URL with /products/', () => {
    const page = { ...basePage, url: 'https://example.com/products/wireless-headphone' }
    expect(detectPageType(page)).toBe('product')
  })

  it('returns product for URL with /item/', () => {
    const page = { ...basePage, url: 'https://example.com/item/12345' }
    expect(detectPageType(page)).toBe('product')
  })

  it('returns product for URL with /shop/', () => {
    const page = { ...basePage, url: 'https://example.com/shop/buy-mac' }
    expect(detectPageType(page)).toBe('product')
  })

  it('returns homepage for root URL', () => {
    const page = { ...basePage, url: 'https://example.com/' }
    expect(detectPageType(page)).toBe('homepage')
  })

  it('returns other for unrecognized URL', () => {
    const page = { ...basePage, url: 'https://example.com/about' }
    expect(detectPageType(page)).toBe('other')
  })

  it('returns other for blog post', () => {
    const page = { ...basePage, url: 'https://example.com/blog/hello-world' }
    expect(detectPageType(page)).toBe('other')
  })

  it('JSON-LD Product takes precedence over homepage URL', () => {
    const page = { ...basePage, url: 'https://example.com/', jsonLd: { '@type': 'Product' } }
    expect(detectPageType(page)).toBe('product')
  })
})
