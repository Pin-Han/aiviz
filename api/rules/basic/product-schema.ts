import type { Rule } from '../../../shared/types.js'

export const productSchemaRule: Rule = {
  id: 'product-schema',
  name: 'Product Schema 存在',
  description: '檢查頁面是否包含 schema.org/Product 結構化資料',
  category: 'basic',
  maxScore: 20,

  check(pageData) {
    if (pageData.jsonLd && pageData.jsonLd['@type'] === 'Product') {
      return {
        score: 20,
        status: 'pass',
        message: '已偵測到 schema.org/Product 結構化資料',
      }
    }

    return {
      score: 0,
      status: 'fail',
      message: '未偵測到 schema.org/Product，AI 搜尋引擎無法結構化理解此商品',
      fix: '在頁面 <head> 中加入 JSON-LD 格式的 Product schema',
      code: `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "你的商品名稱",
  "description": "商品描述",
  "image": "https://your-site.com/image.jpg",
  "brand": {
    "@type": "Brand",
    "name": "品牌名稱"
  },
  "offers": {
    "@type": "Offer",
    "price": "999",
    "priceCurrency": "TWD",
    "availability": "https://schema.org/InStock"
  }
}
</script>`,
    }
  },
}
