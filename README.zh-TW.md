<div align="center">

# AIViz — AI 搜尋可見度檢測工具

**Google 有 Rich Results Test，這是 AI 時代的對應工具。**

掃描任一商品頁 URL，60 秒內知道 ChatGPT、Perplexity、Gemini 能不能找到、理解、推薦你的商品。

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Deploy with Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FPin-Han%2Faiviz)
[![Shopify App](https://img.shields.io/badge/Shopify_App-SEO_Checkup-96bf48?logo=shopify)](https://apps.shopify.com/seo-checkup)

[線上試用](https://ai-vision-check-pink.vercel.app) · [Blog](https://ai-vision-check-pink.vercel.app/blog) · [Shopify App](https://apps.shopify.com/seo-checkup) · [English](README.md)

</div>

---

## 為什麼需要這個？

AI 搜尋引擎正在帶來 **4-5 倍轉換率的流量**（[Adobe, 2026](https://business.adobe.com/blog/ai-traffic-surge-retail-sites-not-machine-readable)），但大部分電商對它們來說是隱形的。

傳統 SEO 幫不了你 — ChatGPT 不看 meta keywords 和外部連結。它看的是**結構化資料**、**爬蟲權限**、**內容可讀性**。大部分 Shopify 商店這三項都有缺口。

AIViz 幫你掃描商品頁，告訴你缺了什麼。

## 功能

| | 功能 | 說明 |
|---|------|------|
| 📊 | **三層評分** (0-130 分) | 爬蟲可及性 · 結構化資料 · 進階優化 |
| 🔍 | **AI 搜尋模擬** | 模擬真實查詢 — ChatGPT 會推薦你的商品嗎？ |
| 🤖 | **AI 可讀性評估** | Gemini 從 AI 引擎角度評估你的頁面 |
| 🔧 | **一鍵修復程式碼** | 可直接複製貼上的 JSON-LD 片段 |
| 🔗 | **可分享報告** | 短網址 (`/r/:id`)，保存 30 天 |
| 🌐 | **雙語支援** | 自動偵測繁體中文 / English |

## Shopify App

Shopify 店家？**[SEO Checkup](https://apps.shopify.com/seo-checkup)** 是我們的免費 Shopify App，一次掃描全店商品，不用逐頁輸入 URL。

## 誰適合用？

- Shopify / CYBERBIZ / 91APP 店家
- WooCommerce / 自架站賣家
- 電商行銷人員與 SEO 顧問
- 任何想了解 AI 搜尋可見度的電商從業者

## 快速開始

```bash
git clone https://github.com/Pin-Han/aiviz.git
cd aiviz
npm install

# 設定 API 環境變數
cp api/.env.example api/.env
# 填入 GEMINI_API_KEY（免費額度：https://aistudio.google.com/apikey）

# 啟動前端
cd frontend && npm run dev

# 跑測試（74 個）
npm test
```

### 部署到 Vercel

```bash
vercel link
vercel env add GEMINI_API_KEY
vercel --prod
```

報告分享功能需要 [Upstash Redis](https://vercel.com/marketplace/upstash)（Vercel Marketplace，prefix: `KV`）。

## 評分規則

### 爬蟲可及性（30 分）
| 規則 | 分數 | 檢查項目 |
|------|------|---------|
| robots.txt | 10 | AI 爬蟲未被封鎖 |
| Meta Description | 5 | 存在且長度適當 |
| 圖片 Alt Text | 5 | 有描述性 alt 屬性 |
| JS 渲染 | 5 | 內容在原始 HTML 中（非純 JS 渲染） |
| Canonical URL | 5 | 正確的 canonical 標籤 |

### 結構化資料（80 分）
| 規則 | 分數 | 檢查項目 |
|------|------|---------|
| Product Schema | 20 | schema.org/Product JSON-LD 存在 |
| 名稱與描述 | 15 | 完整的商品資訊 |
| 價格與幣別 | 15 | 有效定價與幣別代碼 |
| 商品圖片 | 10 | 絕對 URL、可存取 |
| 評價資料 | 10 | 評論/評分資料 |
| 品牌資訊 | 10 | 品牌名稱可辨識 |

### 進階優化（20 分）
| 規則 | 分數 | 檢查項目 |
|------|------|---------|
| 頁面速度 | 10 | 伺服器回應 < 3 秒 |
| llms.txt | 10 | [llms.txt](https://llmstxt.org/) 檔案存在 |

## 貢獻

歡迎 PR！評分引擎使用可插拔的規則系統。在 `api/_rules/` 新增規則，實作 `Rule` interface，註冊到 `index.ts`，加入測試即可。

## 未來計畫

- [x] 網頁工具 — 掃描任意 URL，取得 AI 可見度報告
- [x] Shopify App — [SEO Checkup](https://apps.shopify.com/seo-checkup)
- [x] Blog — AI 可見度趨勢與教學
- [ ] AI 品牌監測 — 追蹤品牌在 AI 搜尋中的提及率
- [ ] 競品分析 — 比較你和競爭對手的 AI 可見度
- [ ] 定期掃描 — 自動排程，變化時通知

## 授權

MIT
