import type { Rule } from '../../../shared/types.js'

export const aggregateRatingRule: Rule = {
  id: 'aggregate-rating',
  name: '商品評價資料',
  description: '檢查 Product schema 中是否有 aggregateRating 評價資料',
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
    if (rating && rating.ratingValue !== undefined) {
      return {
        score: 10,
        status: 'pass',
        message: `商品評價資料完整（${rating.ratingValue} 分，${rating.reviewCount ?? '?'} 則評論）`,
      }
    }

    return {
      score: 0,
      status: 'fail',
      message: '未偵測到 aggregateRating，AI 無法判斷商品口碑',
      fix: '在 Product schema 中加入 aggregateRating',
      code: `"aggregateRating": {\n  "@type": "AggregateRating",\n  "ratingValue": "4.5",\n  "reviewCount": "89"\n}`,
    }
  },
}
