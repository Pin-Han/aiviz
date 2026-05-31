import type { Rule } from '../../../shared/types.js'

const MIN_DESCRIPTION_LENGTH = 30

export const nameDescriptionRule: Rule = {
  id: 'name-description',
  name: '商品名稱與描述',
  description: '檢查 Product schema 中 name 和 description 是否完整',
  category: 'basic',
  maxScore: 15,

  check(pageData) {
    const jsonLd = pageData.jsonLd
    if (!jsonLd) {
      return {
        score: 0,
        status: 'fail',
        message: '無 Product schema，無法檢查名稱與描述',
        fix: '請先加入 Product schema（見 product-schema 規則）',
      }
    }

    const hasName = typeof jsonLd.name === 'string' && jsonLd.name.trim().length > 0
    const hasDesc = typeof jsonLd.description === 'string' && jsonLd.description.trim().length > 0
    const descLongEnough =
      hasDesc && jsonLd.description!.trim().length >= MIN_DESCRIPTION_LENGTH

    if (hasName && descLongEnough) {
      return {
        score: 15,
        status: 'pass',
        message: '商品名稱與描述完整，AI 可以充分理解此商品',
      }
    }

    if (hasName && hasDesc) {
      return {
        score: 8,
        status: 'warn',
        message: `描述過短（${jsonLd.description!.trim().length} 字），建議至少 ${MIN_DESCRIPTION_LENGTH} 字以提供 AI 足夠的商品資訊`,
        fix: '擴充商品描述，加入功能特色、規格、使用場景等資訊',
      }
    }

    if (hasName) {
      return {
        score: 5,
        status: 'warn',
        message: '缺少商品描述，AI 僅能從名稱判斷商品內容',
        fix: '在 Product schema 中加入 description 欄位',
        code: `"description": "詳細描述你的商品特色、規格、適用場景"`,
      }
    }

    return {
      score: 0,
      status: 'fail',
      message: '缺少商品名稱與描述，AI 無法理解此商品',
      fix: '在 Product schema 中加入 name 和 description 欄位',
      code: `"name": "你的商品名稱",\n"description": "詳細描述你的商品特色、規格、適用場景"`,
    }
  },
}
