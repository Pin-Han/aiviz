# AIViz

> 你的商品，AI 搜得到嗎？

電商商品頁 AI 可見度健檢工具。輸入商品 URL，60 秒內告訴你 AI 搜尋引擎看不看得到你的商品。

**線上版**: [ai-vision-check-pink.vercel.app](https://ai-vision-check-pink.vercel.app)

[English](README.md)

## 功能

1. **結構化資料評分** (0-130 分) — 三層檢查：爬蟲可及性、基本資料、進階優化
2. **AI 搜尋模擬** — 模擬 AI 搜尋引擎收到相關搜尋時，會不會推薦你的商品
3. **AI 可讀性評估** — 從 AI 搜尋引擎的角度評估商品資料品質
4. **一鍵修復建議** — 具體告訴你缺什麼，附上可直接複製的 JSON-LD 程式碼
5. **可分享報告** — 每份報告產生短網址（`/r/:id`），可直接分享給他人

## 誰適合用？

- Shopify 店家
- CYBERBIZ 店家
- 91APP 店家
- WooCommerce / 自架站
- 任何想提升 AI 搜尋可見度的電商

## 技術架構

- **前端**: React 19 + Vite + Tailwind CSS
- **後端**: Vercel Serverless Functions
- **爬蟲**: Cheerio (HTML 解析)
- **AI**: Google Gemini 2.5 Flash
- **儲存**: Upstash Redis（報告分享、流量限制）
- **部署**: Vercel
- **多語系**: 自建 React Context（繁中 / 英文，自動偵測）
- **分析**: Google Analytics 4

## 本地開發

```bash
# 安裝依賴
npm install

# 啟動前端開發伺服器
cd frontend && npm run dev

# 本地測試 API（需要 Gemini API Key）
cd api && cp .env.example .env
# 編輯 .env 填入 GEMINI_API_KEY
npx tsx _test-local.ts https://example-shop.com/products/item

# 跑測試
npm test
```

## 授權

MIT
