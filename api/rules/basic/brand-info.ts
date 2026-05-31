import type { Rule } from '../../../shared/types.js'

export const brandInfoRule: Rule = {
  id: 'brand-info',
  name: '品牌資訊',
  description: '檢查 Product schema 中是否有可辨識的品牌資訊',
  category: 'basic',
  maxScore: 10,

  check(pageData) {
    const jsonLd = pageData.jsonLd
    if (!jsonLd) {
      return {
        score: 0,
        status: 'fail',
        message: '無 Product schema，無法檢查品牌資訊',
        fix: '請先加入 Product schema（見 product-schema 規則）',
      }
    }

    const brand = jsonLd.brand

    if (typeof brand === 'object' && brand !== null && 'name' in brand) {
      return {
        score: 10,
        status: 'pass',
        message: `品牌資訊完整：${(brand as { name: string }).name}`,
      }
    }

    if (typeof brand === 'string' && brand.trim().length > 0) {
      return {
        score: 10,
        status: 'pass',
        message: `品牌資訊存在：${brand}`,
      }
    }

    return {
      score: 0,
      status: 'fail',
      message: '缺少品牌資訊，AI 無法辨識商品品牌',
      fix: '在 Product schema 中加入 brand',
      code: `"brand": {\n  "@type": "Brand",\n  "name": "你的品牌名稱"\n}`,
    }
  },
}
