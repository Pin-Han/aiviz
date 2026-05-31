import type { Rule } from '../../../shared/types.js'

const FAST_THRESHOLD_MS = 3000
const SLOW_THRESHOLD_MS = 5000

export const pageSpeedRule: Rule = {
  id: 'page-speed',
  name: '頁面載入速度',
  description: '根據爬取回應時間判斷頁面載入速度是否在 3 秒以內',
  category: 'advanced',
  maxScore: 10,

  check(pageData) {
    const ms = pageData.crawlTimeMs

    if (ms < FAST_THRESHOLD_MS) {
      return {
        score: 10,
        status: 'pass',
        message: `頁面回應時間 ${ms}ms，速度良好`,
      }
    }

    if (ms < SLOW_THRESHOLD_MS) {
      return {
        score: 5,
        status: 'warn',
        message: `頁面回應時間 ${ms}ms，建議優化至 3 秒以內`,
        fix: '優化伺服器回應時間、壓縮圖片、啟用 CDN',
      }
    }

    return {
      score: 0,
      status: 'fail',
      message: `頁面回應時間 ${ms}ms，過慢可能影響 AI 爬蟲效率`,
      fix: '優化伺服器回應時間、壓縮圖片、啟用 CDN、減少 JavaScript 載入量',
    }
  },
}
