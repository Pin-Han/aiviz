import type { Rule } from '../../../shared/types.js'

export const priceCurrencyRule: Rule = {
  id: 'price-currency',
  name: '價格與幣別資訊',
  description: '檢查 Product schema 中 offers.price 和 priceCurrency 是否正確',
  category: 'basic',
  maxScore: 15,

  check(pageData) {
    const jsonLd = pageData.jsonLd
    if (!jsonLd) {
      return {
        score: 0,
        status: 'fail',
        message: '無 Product schema，無法檢查價格資訊',
        fix: '請先加入 Product schema（見 product-schema 規則）',
      }
    }

    const offers = jsonLd.offers
    if (!offers) {
      return {
        score: 0,
        status: 'fail',
        message: '缺少 offers 資訊，AI 無法得知商品價格',
        fix: '在 Product schema 中加入 offers',
        code: `"offers": {\n  "@type": "Offer",\n  "price": "999",\n  "priceCurrency": "TWD",\n  "availability": "https://schema.org/InStock"\n}`,
      }
    }

    const hasPrice =
      offers.price !== undefined &&
      offers.price !== null &&
      String(offers.price).trim().length > 0
    const hasCurrency =
      typeof offers.priceCurrency === 'string' && offers.priceCurrency.trim().length === 3

    if (hasPrice && hasCurrency) {
      return {
        score: 15,
        status: 'pass',
        message: `價格資訊完整：${offers.priceCurrency} ${offers.price}`,
      }
    }

    if (hasPrice) {
      return {
        score: 8,
        status: 'warn',
        message: '有價格但缺少幣別（priceCurrency），AI 無法確認幣別',
        fix: '在 offers 中加入 priceCurrency',
        code: `"priceCurrency": "TWD"`,
      }
    }

    return {
      score: 0,
      status: 'fail',
      message: '缺少價格資訊',
      fix: '在 offers 中加入 price 和 priceCurrency',
      code: `"price": "999",\n"priceCurrency": "TWD"`,
    }
  },
}
