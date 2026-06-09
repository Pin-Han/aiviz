import type { Rule } from '../../../shared/types.js'

export const aggregateRatingRule: Rule = {
  id: 'aggregate-rating',
  name: '商品評價資料',
  description: '檢查 Product schema 中是否有 aggregateRating 評價資料，並驗證評分值是否在合理範圍內',
  category: 'basic',
  maxScore: 10,

  check(pageData) {
    const jsonLd = pageData.jsonLd
    if (!jsonLd) {
      return {
        score: 0,
        status: 'fail',
        message: '無 Product schema，無法檢查評價資訊',
        fix: '請先加入 Product schema（見 product-schema 規則）',
      }
    }

    const rating = jsonLd.aggregateRating
    if (!rating || rating.ratingValue === undefined) {
      return {
        score: 0,
        status: 'fail',
        message: '未偵測到 aggregateRating，AI 無法判斷商品口碑',
        fix: '在 Product schema 中加入 aggregateRating',
        code: `"aggregateRating": {\n  "@type": "AggregateRating",\n  "ratingValue": "4.5",\n  "bestRating": "5",\n  "reviewCount": "89"\n}`,
      }
    }

    // Validate ratingValue is within range
    const value = Number(rating.ratingValue)
    const best = Number(rating.bestRating ?? 5)
    const worst = Number(rating.worstRating ?? 1)

    if (!isNaN(value) && !isNaN(best) && value > best) {
      return {
        score: 5,
        status: 'warn',
        message: `評分值超出範圍：ratingValue (${rating.ratingValue}) 大於 bestRating (${best})。Google 及 AI 搜尋引擎可能忽略此評價資料`,
        fix: `修正 ratingValue 使其不超過 bestRating，或將 bestRating 調整為正確的最高分（例如 ${Math.ceil(value)}）`,
        code: `"aggregateRating": {\n  "@type": "AggregateRating",\n  "ratingValue": "${Math.min(value, best)}",\n  "bestRating": "${best}",\n  "reviewCount": "${rating.reviewCount ?? '0'}"\n}`,
      }
    }

    if (!isNaN(value) && !isNaN(worst) && value < worst) {
      return {
        score: 5,
        status: 'warn',
        message: `評分值低於最低分：ratingValue (${rating.ratingValue}) 小於 worstRating (${worst})`,
        fix: `修正 ratingValue 使其不低於 worstRating (${worst})`,
      }
    }

    return {
      score: 10,
      status: 'pass',
      message: `商品評價資料完整（${rating.ratingValue} 分，${rating.reviewCount ?? '?'} 則評論）`,
    }
  },
}
