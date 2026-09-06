import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getRedis } from './_lib/redis.js'
import { injectMeta } from './_lib/html-meta.js'
import { SCORE_MAX_TOTAL } from '../shared/constants.js'

/**
 * Serves /r/:id with report-specific Open Graph tags baked in.
 *
 * Shared report links used to preview as the generic homepage card, because the
 * SPA only sets its meta tags once JavaScript runs — which crawlers don't do.
 * This fetches the deployed shell, rewrites the head, and hands back the same
 * page. The SPA still boots and loads the report itself, so behaviour for real
 * visitors is unchanged.
 */

interface StoredReport {
  url?: string
  score?: { total?: number }
  rules?: Array<{ status?: string }>
  pageType?: string
}

function hostnameOf(url: string | undefined): string {
  if (!url) return '這個頁面'
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

function buildMeta(report: StoredReport | null, url: string) {
  if (!report?.score || typeof report.score.total !== 'number') {
    return {
      title: 'AIViz 掃描報告 | AI 搜尋可見度檢測',
      description:
        '看看 ChatGPT、Perplexity、Gemini 讀到你的商品頁時，實際能理解多少。免費掃描，60 秒出結果。',
      url,
      ogType: 'article',
    }
  }

  const score = report.score.total
  const host = hostnameOf(report.url)
  const failed = (report.rules ?? []).filter((r) => r.status === 'fail').length

  const verdict =
    score >= 100 ? 'AI 可以清楚辨識這個頁面'
    : score >= 60 ? 'AI 讀得到，但缺了關鍵欄位'
    : 'AI 幾乎讀不懂這個頁面'

  const gap = failed > 0 ? `${failed} 個項目沒過。` : ''

  return {
    title: `${host} 的 AI 可見度：${score}/${SCORE_MAX_TOTAL} — AIViz`,
    description: `${verdict}。${gap}想知道你自己的商品頁在 ChatGPT、Perplexity 眼中長什麼樣？免費掃描，60 秒出結果。`,
    url,
    ogType: 'article',
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  const { id } = req.query
  const host = req.headers.host ?? ''
  const proto = (req.headers['x-forwarded-proto'] as string) ?? 'https'
  const origin = `${proto}://${host}`

  // The SPA shell, with whatever asset hashes the current deployment built.
  let shell: string
  try {
    const shellRes = await fetch(`${origin}/`, { headers: { 'user-agent': 'aiviz-og' } })
    if (!shellRes.ok) throw new Error(`shell fetch ${shellRes.status}`)
    shell = await shellRes.text()
  } catch {
    // Without the shell there's nothing to serve; let the SPA rewrite handle it.
    res.redirect(307, '/')
    return
  }

  let report: StoredReport | null = null
  if (typeof id === 'string' && id) {
    try {
      const redis = getRedis()
      const data = await redis?.get<string>(`report:${id}`)
      if (data) report = typeof data === 'string' ? JSON.parse(data) : data
    } catch {
      // A missing or unreadable report still renders — just with generic tags.
    }
  }

  const html = injectMeta(shell, buildMeta(report, `${origin}/r/${id ?? ''}`))

  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400')
  res.status(200).send(html)
}
