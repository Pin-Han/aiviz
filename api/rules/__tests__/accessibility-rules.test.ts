import { describe, it, expect } from 'vitest'
import { metaDescriptionRule } from '../accessibility/meta-description.js'
import { imageAltRule } from '../accessibility/image-alt.js'
import { jsRenderingRule } from '../accessibility/js-rendering.js'
import { canonicalUrlRule } from '../accessibility/canonical-url.js'
import { robotsTxtRule, parseRobotsTxt } from '../accessibility/robots-txt.js'
import type { PageData } from '../../../shared/types.js'

const basePage: PageData = {
  url: 'https://example.com/products/test',
  html: '<html><head></head><body><p>Some content here that is long enough</p></body></html>',
  jsonLd: null,
  openGraph: {},
  metaTags: {},
  crawlTimeMs: 500,
}

// ── robots-txt ──────────────────────────────────────────

describe('robotsTxtRule', () => {
  it('has correct metadata', () => {
    expect(robotsTxtRule.id).toBe('robots-txt-ai')
    expect(robotsTxtRule.category).toBe('accessibility')
    expect(robotsTxtRule.maxScore).toBe(10)
  })

  it('defaults to pass (overridden by analyze.ts)', () => {
    const result = robotsTxtRule.check(basePage)
    expect(result.status).toBe('pass')
    expect(result.score).toBe(10)
  })
})

describe('parseRobotsTxt', () => {
  it('detects no blocks in permissive robots.txt', () => {
    const result = parseRobotsTxt('User-agent: *\nAllow: /')
    expect(result.blocked).toEqual([])
    expect(result.blanketBlock).toBe(false)
  })

  it('detects blanket block', () => {
    const result = parseRobotsTxt('User-agent: *\nDisallow: /')
    expect(result.blanketBlock).toBe(true)
  })

  it('detects specific AI bot blocks', () => {
    const txt = 'User-agent: GPTBot\nDisallow: /\n\nUser-agent: Google-Extended\nDisallow: /'
    const result = parseRobotsTxt(txt)
    expect(result.blocked).toContain('GPTBot')
    expect(result.blocked).toContain('Google-Extended')
    expect(result.blocked.length).toBe(2)
  })

  it('ignores non-AI bot blocks', () => {
    const txt = 'User-agent: SomeRandomBot\nDisallow: /'
    const result = parseRobotsTxt(txt)
    expect(result.blocked).toEqual([])
  })
})

// ── meta-description ────────────────────────────────────

describe('metaDescriptionRule', () => {
  it('returns pass for good length description', () => {
    const page = { ...basePage, metaTags: { description: 'A'.repeat(80) } }
    const result = metaDescriptionRule.check(page)
    expect(result.status).toBe('pass')
    expect(result.score).toBe(5)
  })

  it('returns warn for too short description', () => {
    const page = { ...basePage, metaTags: { description: 'Short' } }
    const result = metaDescriptionRule.check(page)
    expect(result.status).toBe('warn')
    expect(result.score).toBe(3)
  })

  it('returns warn for too long description', () => {
    const page = { ...basePage, metaTags: { description: 'A'.repeat(200) } }
    const result = metaDescriptionRule.check(page)
    expect(result.status).toBe('warn')
  })

  it('returns fail for missing description', () => {
    const result = metaDescriptionRule.check(basePage)
    expect(result.status).toBe('fail')
    expect(result.score).toBe(0)
  })
})

// ── image-alt ───────────────────────────────────────────

describe('imageAltRule', () => {
  it('returns pass when all images have alt', () => {
    const page = {
      ...basePage,
      html: '<html><body><img src="a.jpg" alt="Product A"><img src="b.jpg" alt="Product B"></body></html>',
    }
    const result = imageAltRule.check(page)
    expect(result.status).toBe('pass')
    expect(result.score).toBe(5)
  })

  it('returns fail when no images have alt', () => {
    const page = {
      ...basePage,
      html: '<html><body><img src="a.jpg"><img src="b.jpg"></body></html>',
    }
    const result = imageAltRule.check(page)
    expect(result.status).toBe('fail')
    expect(result.score).toBe(0)
  })

  it('skips tracking pixels', () => {
    const page = {
      ...basePage,
      html: '<html><body><img src="a.jpg" alt="Product"><img src="pixel.gif" width="1" height="1"></body></html>',
    }
    const result = imageAltRule.check(page)
    expect(result.status).toBe('pass')
    expect(result.score).toBe(5)
  })

  it('returns pass when no images exist', () => {
    const page = { ...basePage, html: '<html><body><p>No images</p></body></html>' }
    const result = imageAltRule.check(page)
    expect(result.status).toBe('pass')
  })
})

// ── js-rendering ────────────────────────────────────────

describe('jsRenderingRule', () => {
  it('returns pass for content-rich HTML', () => {
    const page = {
      ...basePage,
      html: `<html><body><div>${'Product description content. '.repeat(30)}</div></body></html>`,
    }
    const result = jsRenderingRule.check(page)
    expect(result.status).toBe('pass')
    expect(result.score).toBe(5)
  })

  it('returns fail for SPA with empty body', () => {
    const page = {
      ...basePage,
      html: '<html><body><div id="root"></div><script src="app.js"></script><script src="vendor.js"></script><script src="chunk1.js"></script><script src="chunk2.js"></script><script src="chunk3.js"></script><script src="chunk4.js"></script></body></html>',
    }
    const result = jsRenderingRule.check(page)
    expect(result.status).toBe('fail')
    expect(result.score).toBe(0)
  })
})

// ── canonical-url ───────────────────────────────────────

describe('canonicalUrlRule', () => {
  it('returns pass when canonical matches current URL', () => {
    const page = {
      ...basePage,
      html: '<html><head><link rel="canonical" href="https://example.com/products/test"></head><body></body></html>',
    }
    const result = canonicalUrlRule.check(page)
    expect(result.status).toBe('pass')
    expect(result.score).toBe(5)
  })

  it('returns warn when canonical points elsewhere', () => {
    const page = {
      ...basePage,
      html: '<html><head><link rel="canonical" href="https://example.com/other-page"></head><body></body></html>',
    }
    const result = canonicalUrlRule.check(page)
    expect(result.status).toBe('warn')
    expect(result.score).toBe(3)
  })

  it('returns fail when no canonical', () => {
    const page = { ...basePage, html: '<html><head></head><body></body></html>' }
    const result = canonicalUrlRule.check(page)
    expect(result.status).toBe('fail')
    expect(result.score).toBe(0)
  })
})
