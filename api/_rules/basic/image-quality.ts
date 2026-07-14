import type { Rule } from '../../../shared/types.js'

export const imageQualityRule: Rule = {
  id: 'image-quality',
  name: '商品圖片',
  description: '檢查 Product schema 中是否有高品質的圖片 URL',
  category: 'basic',
  maxScore: 10,

  check(pageData) {
    const jsonLd = pageData.jsonLd
    if (!jsonLd) {
      return {
        score: 0,
        status: 'fail',
        message: '無 Product schema，無法檢查圖片資訊',
        fix: '請先加入 Product schema（見 product-schema 規則）',
      }
    }

    const image = Array.isArray(jsonLd.image) ? jsonLd.image[0] : jsonLd.image

    if (!image || (typeof image === 'string' && image.trim().length === 0)) {
      return {
        score: 0,
        status: 'fail',
        message: '缺少商品圖片，AI 無法在搜尋結果中顯示圖片',
        fix: '在 Product schema 中加入 image 欄位',
        code: `"image": "https://your-site.com/product-image.jpg"`,
      }
    }

    if (typeof image === 'string' && !image.startsWith('http')) {
      return {
        score: 5,
        status: 'warn',
        message: '圖片使用相對路徑，建議改為完整的 https:// 絕對路徑',
        fix: '將圖片 URL 改為絕對路徑',
        code: `"image": "https://your-site.com${image}"`,
      }
    }

    return {
      score: 10,
      status: 'pass',
      message: '商品圖片 URL 完整',
    }
  },
}
