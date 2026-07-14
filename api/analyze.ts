import type { VercelRequest, VercelResponse } from '@vercel/node'
import type { AnalysisResponse, ApiError, AiReadability, AiSearchSimulation } from '../shared/types.js'
import { crawlUrl } from './_lib/crawler.js'
import { parseHtml } from './_lib/parser.js'
import { runAllRules } from './_lib/scorer.js'
import { GeminiProvider } from './_lib/gemini-provider.js'
import { checkRateLimit } from './_lib/rate-limiter.js'
import { detectPageType } from './_lib/page-detector.js'
import { parseRobotsTxt, AI_BOTS } from './_rules/accessibility/robots-txt.js'

function isValidUrl(str: string): boolean {
  try {
    const url = new URL(str)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

function getClientIp(req: VercelRequest): string {
  const forwarded = req.headers['x-forwarded-for']
  if (typeof forwarded === 'string') return forwarded.split(',')[0].trim()
  return req.socket?.remoteAddress ?? 'unknown'
}

async function checkRobotsTxtBlocking(url: string): Promise<{ blocked: string[]; blanketBlock: boolean }> {
  try {
    const origin = new URL(url).origin
    const res = await fetch(`${origin}/robots.txt`, { signal: AbortSignal.timeout(3000) })
    if (!res.ok) return { blocked: [], blanketBlock: false }
    const text = await res.text()
    return parseRobotsTxt(text)
  } catch {
    return { blocked: [], blanketBlock: false }
  }
}

async function checkLlmsTxt(url: string): Promise<boolean> {
  try {
    const origin = new URL(url).origin
    const response = await fetch(`${origin}/llms.txt`, {
      signal: AbortSignal.timeout(3000),
    })
    return response.ok
  } catch {
    return false
  }
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
): Promise<void> {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed', code: 405 } satisfies ApiError)
    return
  }

  // Parse and validate input
  const { url, locale } = req.body ?? {}
  const lang = locale === 'en' ? 'en' : 'zh-TW'

  if (!url || typeof url !== 'string' || !isValidUrl(url)) {
    res.status(400).json({
      error: '請提供有效的商品頁 URL（需包含 http:// 或 https://）',
      code: 400,
    } satisfies ApiError)
    return
  }

  // Rate limit check
  const ip = getClientIp(req)
  const rateLimit = await checkRateLimit(ip)

  if (!rateLimit.allowed) {
    res.status(429).json({
      error: '今日免費分析次數已用完，請明天再試',
      code: 429,
    } satisfies ApiError)
    return
  }

  try {
    // Step 1: Crawl
    const crawlResult = await crawlUrl(url)

    // Step 2: Parse
    const pageData = parseHtml(crawlResult.html, crawlResult.url, crawlResult.crawlTimeMs)

    // Step 3: Detect page type
    const pageType = detectPageType(pageData)
    let pageTypeMessage: string | undefined
    if (pageType === 'homepage') {
      pageTypeMessage = '偵測到這是首頁而非商品頁。首頁通常不包含 Product Schema，這是正常的。建議輸入單一商品的 URL 以獲得更準確的分析。'
    } else if (pageType === 'other') {
      pageTypeMessage = '此頁面可能不是商品頁。如果這是商品頁但缺少結構化資料，請參考下方的修復建議。'
    }

    // Step 4: Score with all rules
    const ruleResults = runAllRules(pageData)

    // Step 5: Async checks (robots.txt + llms.txt) in parallel
    const [robotsResult, hasLlmsTxt] = await Promise.all([
      checkRobotsTxtBlocking(url),
      checkLlmsTxt(url),
    ])

    // Override robots.txt rule result
    const robotsIndex = ruleResults.findIndex((r) => r.id === 'robots-txt-ai')
    if (robotsIndex !== -1) {
      const { blocked, blanketBlock } = robotsResult
      if (blanketBlock || blocked.length === AI_BOTS.length) {
        ruleResults[robotsIndex] = {
          ...ruleResults[robotsIndex],
          score: 0,
          status: 'fail',
          message: 'robots.txt 封鎖了所有主要 AI 爬蟲，你的商品在 AI 搜尋中完全隱形',
          fix: '移除 robots.txt 中對 AI 爬蟲的封鎖，或至少允許 GPTBot 和 Google-Extended',
          code: '# 允許 AI 爬蟲存取\nUser-agent: GPTBot\nAllow: /\n\nUser-agent: Google-Extended\nAllow: /',
        }
      } else if (blocked.length > 0) {
        ruleResults[robotsIndex] = {
          ...ruleResults[robotsIndex],
          score: 5,
          status: 'warn',
          message: `部分 AI 爬蟲被封鎖：${blocked.join(', ')}`,
          fix: `考慮允許這些 AI 爬蟲存取：${blocked.join(', ')}`,
        }
      }
    }

    // Override llms.txt rule result
    const llmsTxtIndex = ruleResults.findIndex((r) => r.id === 'llms-txt')
    if (llmsTxtIndex !== -1 && hasLlmsTxt) {
      ruleResults[llmsTxtIndex] = {
        ...ruleResults[llmsTxtIndex],
        score: 10,
        status: 'pass',
        message: '已偵測到 llms.txt 檔案',
        fix: null,
        code: null,
      }
    }

    // Step 6: AI readability + search simulation (parallel)
    let aiReadability: AiReadability
    let searchSimulation: AiSearchSimulation
    let aiCallTimeMs = 0

    const geminiKey = process.env.GEMINI_API_KEY
    if (geminiKey && pageType === 'product') {
      const aiStart = Date.now()
      const provider = new GeminiProvider(geminiKey, lang)
      const [aiResult, simResult] = await Promise.all([
        provider.assessReadability(pageData),
        provider.simulateSearch(pageData),
      ])
      aiCallTimeMs = Date.now() - aiStart

      aiReadability = aiResult.summary.includes('無法完成')
        ? { unavailable: true }
        : aiResult

      searchSimulation = simResult.queries.length > 0
        ? simResult
        : { unavailable: true }
    } else if (geminiKey) {
      const aiStart = Date.now()
      const provider = new GeminiProvider(geminiKey, lang)
      const aiResult = await provider.assessReadability(pageData)
      aiCallTimeMs = Date.now() - aiStart

      aiReadability = aiResult.summary.includes('無法完成')
        ? { unavailable: true }
        : aiResult
      searchSimulation = { unavailable: true }
    } else {
      aiReadability = { unavailable: true }
      searchSimulation = { unavailable: true }
    }

    // Step 7: Compute scores
    const accessibilityScore = ruleResults
      .filter((r) => r.category === 'accessibility')
      .reduce((sum, r) => sum + r.score, 0)
    const basicScore = ruleResults
      .filter((r) => r.category === 'basic')
      .reduce((sum, r) => sum + r.score, 0)
    const advancedScore = ruleResults
      .filter((r) => r.category === 'advanced')
      .reduce((sum, r) => sum + r.score, 0)

    const response: AnalysisResponse = {
      url,
      analyzedAt: new Date().toISOString(),
      score: {
        total: accessibilityScore + basicScore + advancedScore,
        accessibility: accessibilityScore,
        basic: basicScore,
        advanced: advancedScore,
      },
      rules: ruleResults,
      aiReadability,
      searchSimulation,
      pageType,
      pageTypeMessage,
      meta: {
        crawlTimeMs: crawlResult.crawlTimeMs,
        aiCallTimeMs,
        remainingQuota: rateLimit.remaining,
      },
    }

    res.status(200).json(response)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'

    if (message.startsWith('HTTP ')) {
      res.status(502).json({
        error: `無法連線到目標網站：${message}`,
        code: 502,
      } satisfies ApiError)
      return
    }

    res.status(500).json({
      error: '分析過程發生錯誤，請稍後再試',
      code: 500,
    } satisfies ApiError)
  }
}
