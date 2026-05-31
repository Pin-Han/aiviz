import { describe, it, expect } from 'vitest'
import { pageSpeedRule } from '../advanced/page-speed.js'
import { llmsTxtRule } from '../advanced/llms-txt.js'
import type { PageData } from '../../../shared/types.js'

const basePageData: PageData = {
  url: 'https://example.com/product',
  html: '',
  jsonLd: null,
  openGraph: {},
  metaTags: {},
  crawlTimeMs: 500,
}

describe('pageSpeedRule', () => {
  it('returns pass when crawl time < 3000ms', () => {
    const page = { ...basePageData, crawlTimeMs: 1500 }
    const result = pageSpeedRule.check(page)
    expect(result.status).toBe('pass')
    expect(result.score).toBe(10)
  })

  it('returns warn when crawl time is between 3000-5000ms', () => {
    const page = { ...basePageData, crawlTimeMs: 4000 }
    const result = pageSpeedRule.check(page)
    expect(result.status).toBe('warn')
    expect(result.score).toBe(5)
  })

  it('returns fail when crawl time > 5000ms', () => {
    const page = { ...basePageData, crawlTimeMs: 6000 }
    const result = pageSpeedRule.check(page)
    expect(result.status).toBe('fail')
    expect(result.score).toBe(0)
  })
})

describe('llmsTxtRule', () => {
  it('has correct metadata', () => {
    expect(llmsTxtRule.id).toBe('llms-txt')
    expect(llmsTxtRule.category).toBe('advanced')
    expect(llmsTxtRule.maxScore).toBe(10)
  })
})
