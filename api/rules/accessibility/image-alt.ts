import * as cheerio from 'cheerio'
import type { Rule } from '../../../shared/types.js'

const TRACKING_PATTERNS = ['pixel', 'tracker', 'analytics', 'beacon', 'spacer']

export const imageAltRule: Rule = {
  id: 'image-alt',
  name: '圖片替代文字',
  description: '檢查頁面圖片是否有 alt 屬性，AI 需要 alt 文字理解圖片內容',
  category: 'accessibility',
  maxScore: 5,

  check(pageData) {
    const $ = cheerio.load(pageData.html)
    const images = $('img').toArray()

    // Filter out tracking pixels and tiny images
    const productImages = images.filter((img) => {
      const el = $(img)
      const src = (el.attr('src') || '').toLowerCase()
      const width = parseInt(el.attr('width') || '999', 10)
      const height = parseInt(el.attr('height') || '999', 10)

      if (width < 10 || height < 10) return false
      if (TRACKING_PATTERNS.some((p) => src.includes(p))) return false
      return true
    })

    if (productImages.length === 0) {
      return {
        score: 5,
        status: 'pass',
        message: '頁面無需檢查的圖片',
      }
    }

    const withAlt = productImages.filter((img) => {
      const alt = $(img).attr('alt')
      return alt !== undefined && alt.trim().length > 0
    })

    const pct = Math.round((withAlt.length / productImages.length) * 100)

    if (pct >= 80) {
      return {
        score: 5,
        status: 'pass',
        message: `${pct}% 的圖片有替代文字（${withAlt.length}/${productImages.length}）`,
      }
    }

    if (pct >= 50) {
      return {
        score: 3,
        status: 'warn',
        message: `僅 ${pct}% 的圖片有替代文字（${withAlt.length}/${productImages.length}），建議達到 80% 以上`,
        fix: '為商品圖片加入描述性的 alt 屬性，例如 alt="白色無線藍牙耳機 正面照"',
      }
    }

    return {
      score: 0,
      status: 'fail',
      message: `僅 ${pct}% 的圖片有替代文字（${withAlt.length}/${productImages.length}），AI 無法理解大部分圖片內容`,
      fix: '為所有商品圖片加入描述性的 alt 屬性',
      code: `<img src="product.jpg" alt="商品名稱 - 顏色/規格/角度描述">`,
    }
  },
}
