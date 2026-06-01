import * as cheerio from 'cheerio'
import type { Rule } from '../../../shared/types.js'

const SPA_MARKERS = ['div#root', 'div#app', 'div#__next', 'div#__nuxt']
const MIN_CONTENT_LENGTH = 500
const PARTIAL_CONTENT_LENGTH = 200

export const jsRenderingRule: Rule = {
  id: 'js-rendering',
  name: 'JavaScript 渲染依賴',
  description: '檢查頁面內容是否需要 JavaScript 才能渲染，AI 爬蟲可能無法執行 JS',
  category: 'accessibility',
  maxScore: 5,

  check(pageData) {
    const $ = cheerio.load(pageData.html)

    // Remove script and style tags, then get body text
    $('script, style, noscript').remove()
    const bodyText = $('body').text().replace(/\s+/g, ' ').trim()
    const textLength = bodyText.length

    // Check for SPA markers
    const hasSpaMarker = SPA_MARKERS.some((selector) => $(selector).length > 0)
    const scriptCount = cheerio.load(pageData.html)('script').length

    if (textLength >= MIN_CONTENT_LENGTH) {
      return {
        score: 5,
        status: 'pass',
        message: `頁面有足夠的 HTML 內容（${textLength} 字），AI 爬蟲可直接讀取`,
      }
    }

    if (textLength >= PARTIAL_CONTENT_LENGTH) {
      return {
        score: 3,
        status: 'warn',
        message: `頁面 HTML 內容較少（${textLength} 字），部分內容可能需要 JS 渲染`,
        fix: '確保關鍵商品資訊（名稱、描述、價格）在初始 HTML 中就能看到，不依賴 JavaScript 載入',
      }
    }

    if (hasSpaMarker || scriptCount > 5) {
      return {
        score: 0,
        status: 'fail',
        message: `頁面幾乎是空的 HTML（${textLength} 字），依賴 JavaScript 渲染內容。GPTBot、PerplexityBot 等 AI 爬蟲可能看不到任何商品資訊`,
        fix: '考慮使用 SSR（Server-Side Rendering）或 SSG（Static Site Generation），確保 AI 爬蟲不需要執行 JavaScript 就能讀取內容',
      }
    }

    return {
      score: 0,
      status: 'fail',
      message: `頁面 HTML 內容極少（${textLength} 字），AI 爬蟲可能無法取得有意義的內容`,
      fix: '確保頁面的 HTML 包含完整的商品資訊，不完全依賴 JavaScript 動態載入',
    }
  },
}
