import type { Rule } from '../../../shared/types.js'

export const metaDescriptionRule: Rule = {
  id: 'meta-description',
  name: 'Meta Description',
  description: '檢查頁面是否有適當長度的 meta description，AI 使用此欄位作為摘要來源',
  category: 'accessibility',
  maxScore: 5,

  check(pageData) {
    const desc = pageData.metaTags.description

    if (!desc || desc.trim().length === 0) {
      return {
        score: 0,
        status: 'fail',
        message: '缺少 meta description，AI 無法取得頁面摘要',
        fix: '加入 <meta name="description"> 標籤，建議 50-160 字',
        code: `<meta name="description" content="你的商品描述，包含主要特色與賣點">`,
      }
    }

    const len = desc.trim().length

    if (len >= 50 && len <= 160) {
      return {
        score: 5,
        status: 'pass',
        message: `Meta description 長度適當（${len} 字）`,
      }
    }

    if (len < 50) {
      return {
        score: 3,
        status: 'warn',
        message: `Meta description 過短（${len} 字），建議至少 50 字`,
        fix: '擴充描述內容，加入更多商品特色與賣點',
      }
    }

    return {
      score: 3,
      status: 'warn',
      message: `Meta description 過長（${len} 字），建議不超過 160 字`,
      fix: '精簡描述內容至 160 字以內，避免被搜尋引擎截斷',
    }
  },
}
