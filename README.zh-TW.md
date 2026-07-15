# AIViz

> Google 有 Rich Results Test 幫你檢查結構化資料。
> **AIViz 幫你檢查 ChatGPT、Perplexity、Gemini 搜不搜得到你的商品。**

開源的電商 AI 可見度健檢工具。輸入商品 URL，60 秒內獲得完整報告：AI 搜尋引擎能不能找到、理解、推薦你的商品。

**立即試用**: [aiviz.vercel.app](https://ai-vision-check-pink.vercel.app)

[English](README.md)

## 為什麼需要這個？

Google 有 [Rich Results Test](https://search.google.com/test/rich-results)，但 AI 搜尋引擎（ChatGPT、Perplexity、Gemini）用不同的方式理解商品。目前沒有針對 AI 時代的對應工具 — AIViz 就是為此而生。

AIViz 掃描你的商品頁，回答三個問題：

1. **AI 爬蟲進得來嗎？** — robots.txt、JS 渲染、meta 標籤
2. **AI 看得懂你在賣什麼嗎？** — schema.org Product 標記、Open Graph、結構化資料完整度
3. **AI 會推薦你的商品嗎？** — 模擬 AI 搜尋查詢、關鍵字可見度分析

## 功能

- **三層評分** (0-130 分) — 爬蟲可及性 + 結構化資料 + 進階優化
- **AI 搜尋模擬** — 模擬真實用戶問題，預測 AI 會不會推薦你的商品
- **AI 可讀性評估** — 用 Gemini 從 AI 引擎的角度評估資料品質
- **一鍵修復程式碼** — 產出可直接複製貼上的 JSON-LD 片段
- **可分享報告** — 每份報告產生短網址（`/r/:id`），保存 30 天
- **雙語支援** — 自動偵測瀏覽器語言（English / 繁體中文）

## 誰適合用？

- Shopify / CYBERBIZ / 91APP 店家
- WooCommerce / 自架站賣家
- 電商行銷人員與 SEO 顧問
- 任何想了解 AI 搜尋可見度的電商從業者

## 技術架構

| 層級 | 技術 |
|------|------|
| 前端 | React 19, Vite, Tailwind CSS |
| 後端 | Vercel Serverless Functions |
| 爬蟲 | Cheerio (HTML 解析) |
| AI | Google Gemini 2.5 Flash |
| 儲存 | Upstash Redis（報告分享 + 流量限制） |
| 部署 | Vercel |
| 多語系 | 自建 React Context（繁中 / 英文） |
| 分析 | Google Analytics 4 |

## 本地開發

```bash
# 複製專案
git clone https://github.com/Pin-Han/aiviz.git
cd aiviz

# 安裝依賴
npm install

# 設定 API 環境變數
cp api/.env.example api/.env
# 編輯 api/.env 填入 GEMINI_API_KEY

# 啟動前端開發伺服器
cd frontend && npm run dev

# 本地測試商品 URL
cd api && npx tsx _test-local.ts https://example-shop.com/products/item

# 跑測試（74 個測試）
npm test
```

## 貢獻

歡迎 PR！評分引擎使用可插拔的規則系統：

1. 在 `api/_rules/basic/` 或 `api/_rules/advanced/` 新增規則檔案
2. 實作 `shared/types.ts` 中的 `Rule` interface
3. 在 `api/_rules/index.ts` 註冊
4. 在 `__tests__/` 目錄加入測試

## 未來計畫

- [ ] Shopify App — 一鍵安裝，自動監控 AI 可見度
- [ ] AI 品牌監測 — 追蹤品牌在 AI 搜尋中的提及率
- [ ] 競品分析 — 比較你和競爭對手的 AI 可見度差異
- [ ] 定期掃描 — 自動排程檢查，變化時通知你

## 授權

MIT
