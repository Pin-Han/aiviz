import type { ScoredRuleResult } from './scorer.js'

interface RuleTranslation {
  name: string
  messages: Record<string, string>
  fixes: Record<string, string>
}

// Extract all numbers from a string (for dynamic data like counts, scores, ms)
function extractNumbers(str: string): string[] {
  return str.match(/[\d.]+/g) ?? []
}

const EN: Record<string, RuleTranslation> = {
  'robots-txt-ai': {
    name: 'AI Crawler Access',
    messages: {
      pass: 'No robots.txt blocking detected — AI crawlers can access your page',
      fail: 'robots.txt blocks all major AI crawlers — your product is invisible in AI search',
      warn: 'Some AI crawlers are blocked: {0}',
    },
    fixes: {
      fail: 'Remove AI crawler blocks in robots.txt, or at least allow GPTBot and Google-Extended',
      warn: 'Consider allowing these AI crawlers: {0}',
    },
  },
  'meta-description': {
    name: 'Meta Description',
    messages: {
      pass: 'Meta description has adequate length ({0} chars)',
      fail: 'Missing meta description — AI cannot get a page summary',
      warn_short: 'Meta description is too short ({0} chars), recommend at least 50',
      warn_long: 'Meta description is too long ({0} chars), recommend under 160',
    },
    fixes: {
      fail: 'Add a <meta name="description"> tag, recommended 50-160 characters',
      warn_short: 'Expand the description with more product features and selling points',
      warn_long: 'Shorten the description to under 160 characters to avoid truncation',
    },
  },
  'image-alt': {
    name: 'Image Alt Text',
    messages: {
      pass_none: 'No product images to check',
      pass: '{0}% of images have alt text ({1}/{2})',
      warn: '{0} images missing alt text ({2} total, {1} have alt) — aim for 80%+',
      fail: '{0} images missing alt text ({2} total, only {1} have alt) — AI cannot understand most images',
    },
    fixes: {
      warn: '{0} images still need alt attributes describing the product appearance, color, and angle',
      fail: '{0} images need descriptive alt attributes so AI can understand product images',
    },
  },
  'js-rendering': {
    name: 'JavaScript Rendering',
    messages: {
      pass: 'Page has sufficient HTML content ({0} chars) — AI crawlers can read directly',
      warn: 'Page has limited HTML content ({0} chars) — some content may require JS rendering',
      fail_spa: 'Page is nearly empty HTML ({0} chars), relies on JavaScript rendering. GPTBot, PerplexityBot may not see any product info',
      fail: 'Page has very little HTML content ({0} chars) — AI crawlers may not get meaningful content',
    },
    fixes: {
      warn: 'Ensure key product info (name, description, price) is in the initial HTML without JavaScript',
      fail_spa: 'Consider using SSR or SSG so AI crawlers can read content without executing JavaScript',
      fail: 'Ensure the HTML contains complete product information without relying entirely on JavaScript',
    },
  },
  'canonical-url': {
    name: 'Canonical URL',
    messages: {
      pass: 'Canonical URL correctly points to current page',
      fail: 'Missing canonical URL — AI may index duplicate versions of this page',
      warn: 'Canonical URL points to a different page: {0}',
    },
    fixes: {
      fail: 'Add a <link rel="canonical"> tag pointing to this page\'s standard URL',
      warn: 'Verify the canonical URL is correct. If intentional, ignore; otherwise fix to current page URL',
    },
  },
  'product-schema': {
    name: 'Product Schema',
    messages: {
      pass: 'schema.org/Product structured data detected',
      fail: 'No schema.org/Product detected — AI search engines cannot understand this product structurally',
    },
    fixes: {
      fail: 'Add JSON-LD Product schema in the page <head>',
    },
  },
  'name-description': {
    name: 'Product Name & Description',
    messages: {
      pass: 'Product name and description are complete — AI can fully understand this product',
      fail_no_schema: 'No Product schema — cannot check name and description',
      fail: 'Missing product name and description — AI cannot understand this product',
      warn_no_desc: 'Missing product description — AI can only judge by name alone',
      warn_short: 'Description is too short ({0} chars), recommend at least 30 for AI to understand',
    },
    fixes: {
      fail_no_schema: 'Add Product schema first (see product-schema rule)',
      fail: 'Add name and description fields to Product schema',
      warn_no_desc: 'Add a description field to Product schema',
      warn_short: 'Expand product description with features, specs, and use cases',
    },
  },
  'price-currency': {
    name: 'Price & Currency',
    messages: {
      pass: 'Price info complete: {0} {1}',
      fail_no_schema: 'No Product schema — cannot check price info',
      fail_no_offers: 'Missing offers data — AI cannot determine product price',
      fail_no_price: 'Missing price info',
      warn: 'Price exists but missing currency (priceCurrency) — AI cannot confirm currency',
    },
    fixes: {
      fail_no_schema: 'Add Product schema first (see product-schema rule)',
      fail_no_offers: 'Add offers to Product schema',
      fail_no_price: 'Add price and priceCurrency to offers',
      warn: 'Add priceCurrency to offers',
    },
  },
  'image-quality': {
    name: 'Product Image',
    messages: {
      pass: 'Product image URL is complete',
      fail_no_schema: 'No Product schema — cannot check image info',
      fail: 'Missing product image — AI cannot display image in search results',
      warn: 'Image uses relative path — recommend using full https:// absolute URL',
    },
    fixes: {
      fail_no_schema: 'Add Product schema first (see product-schema rule)',
      fail: 'Add an image field to Product schema',
      warn: 'Change image URL to absolute path',
    },
  },
  'aggregate-rating': {
    name: 'Aggregate Rating',
    messages: {
      pass: 'Rating data complete ({0} stars, {1} reviews)',
      fail_no_schema: 'No Product schema — cannot check rating info',
      fail: 'No aggregateRating detected — AI cannot assess product reputation',
      warn_over: 'Rating value out of range: ratingValue ({0}) exceeds bestRating ({1}). Google and AI search engines may ignore this data',
      warn_under: 'Rating value below minimum: ratingValue ({0}) is less than worstRating ({1})',
    },
    fixes: {
      fail_no_schema: 'Add Product schema first (see product-schema rule)',
      fail: 'Add aggregateRating to Product schema',
      warn_over: 'Fix ratingValue to not exceed bestRating, or adjust bestRating to the correct maximum (e.g. {0})',
      warn_under: 'Fix ratingValue to not be below worstRating ({0})',
    },
  },
  'brand-info': {
    name: 'Brand Info',
    messages: {
      pass: 'Brand info complete: {0}',
      fail_no_schema: 'No Product schema — cannot check brand info',
      fail: 'Missing brand info — AI cannot identify the product brand',
    },
    fixes: {
      fail_no_schema: 'Add Product schema first (see product-schema rule)',
      fail: 'Add brand to Product schema',
    },
  },
  'page-speed': {
    name: 'Page Speed',
    messages: {
      pass: 'Page response time {0}ms — good speed',
      warn: 'Page response time {0}ms — recommend optimizing to under 3 seconds',
      fail: 'Page response time {0}ms — too slow, may affect AI crawler efficiency',
    },
    fixes: {
      warn: 'Optimize server response time, compress images, enable CDN',
      fail: 'Optimize server response time, compress images, enable CDN, reduce JavaScript payload',
    },
  },
  'llms-txt': {
    name: 'llms.txt File',
    messages: {
      pass: 'llms.txt file detected',
      fail: 'No llms.txt detected — this is an emerging AI crawler standard',
    },
    fixes: {
      fail: 'Create an llms.txt file at the site root describing your website content for AI crawlers',
    },
  },
}

// Match the Chinese message to find the right English variant key
function findMessageKey(rule: RuleTranslation, status: string, originalMsg: string): string {
  // Direct status match
  if (rule.messages[status]) return status

  // Try variants with suffixes
  const keys = Object.keys(rule.messages).filter((k) => k.startsWith(status))
  if (keys.length === 1) return keys[0]

  // Heuristic matching for variants
  if (status === 'pass' && originalMsg.includes('無需') || originalMsg.includes('無')) return 'pass_none'
  if (status === 'fail' && (originalMsg.includes('無 Product') || originalMsg.includes('無法檢查'))) return 'fail_no_schema'
  if (status === 'fail' && originalMsg.includes('offers')) return 'fail_no_offers'
  if (status === 'fail' && originalMsg.includes('缺少價格')) return 'fail_no_price'
  if (status === 'fail' && originalMsg.includes('SPA') || originalMsg.includes('JavaScript 渲染')) return 'fail_spa'
  if (status === 'warn' && originalMsg.includes('過短') && !originalMsg.includes('描述過短')) return 'warn_short'
  if (status === 'warn' && originalMsg.includes('過長')) return 'warn_long'
  if (status === 'warn' && originalMsg.includes('缺少商品描述') || originalMsg.includes('僅能從名稱')) return 'warn_no_desc'
  if (status === 'warn' && originalMsg.includes('描述過短')) return 'warn_short'
  if (status === 'warn' && originalMsg.includes('超出範圍')) return 'warn_over'
  if (status === 'warn' && originalMsg.includes('低於最低分')) return 'warn_under'

  return keys[0] ?? status
}

function interpolate(template: string, numbers: string[]): string {
  let result = template
  numbers.forEach((n, i) => {
    result = result.replace(`{${i}}`, n)
  })
  return result
}

export function translateRuleResults(results: ScoredRuleResult[], locale: string): ScoredRuleResult[] {
  if (locale !== 'en') return results

  return results.map((r) => {
    const tr = EN[r.id]
    if (!tr) return r

    const nums = extractNumbers(r.message)
    const msgKey = findMessageKey(tr, r.status, r.message)
    const translatedMsg = tr.messages[msgKey]
    const fixKey = findMessageKey(tr, r.status, r.fix ?? '')
    const translatedFix = tr.fixes[fixKey]

    // For fixes, also extract numbers from original fix text
    const fixNums = r.fix ? extractNumbers(r.fix) : []

    return {
      ...r,
      name: tr.name,
      message: translatedMsg ? interpolate(translatedMsg, nums) : r.message,
      fix: r.fix ? (translatedFix ? interpolate(translatedFix, fixNums.length > 0 ? fixNums : nums) : r.fix) : null,
    }
  })
}
