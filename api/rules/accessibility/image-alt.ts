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

    const missing = productImages.length - withAlt.length

    if (pct >= 50) {
      return {
        score: 3,
        status: 'warn',
        message: `${missing} 張圖片缺少替代文字（共 ${productImages.length} 張，${withAlt.length} 張有 alt），建議達到 80% 以上`,
        fix: `還有 ${missing} 張圖片需要加入 alt 屬性，描述圖片中的商品外觀、顏色、角度等`,
      }
    }

    return {
      score: 0,
      status: 'fail',
      message: `${missing} 張圖片缺少替代文字（共 ${productImages.length} 張，僅 ${withAlt.length} 張有 alt），AI 無法理解大部分圖片內容`,
      fix: `${missing} 張圖片需要加入描述性的 alt 屬性，讓 AI 能理解商品圖片內容`,
      code: `<img src="product.jpg" alt="商品名稱 - 顏色/規格/角度描述">`,
    }
  },
}
