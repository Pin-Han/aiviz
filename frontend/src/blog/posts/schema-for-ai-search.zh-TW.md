---
title: "Schema for AI：讓 ChatGPT 看懂你商品的結構化資料完整指南"
description: "72% 消費者計畫更常用 AI 購物，但 AI 搜尋引擎靠的不是關鍵字，而是結構化資料。這篇教你 Shopify 商店該補哪些 Schema 欄位，讓 ChatGPT 和 Perplexity 推薦你的商品。"
date: "2026-07-25"
lang: "zh-TW"
tags: ["結構化資料", "Shopify SEO", "JSON-LD"]
---

上週 Search Engine Land 發了一篇文章叫 "Schema for AI search"，講怎麼用結構化資料讓 AI 搜尋引擎找到你。我讀完之後用 AIViz 掃了一輪客戶的商店，發現一件事讓我意外：

**大部分 Shopify 商店的結構化資料，只做對了一半。**

Shopify 會自動幫你產生 Product Schema — 商品名稱、描述、圖片都有。但 AI 搜尋引擎需要的不只這些。ChatGPT 在判斷要不要推薦你的商品時，還會看 `aggregateRating`、`brand`、`gtin`、`availability` 這些欄位。缺了它們，AI 就缺少信心把你的商品推給消費者。

## AI 搜尋引擎跟 Google 看的東西不一樣

Google 搜尋的排名因素有上百個 — 外部連結、網站權重、頁面速度、使用者行為。你可能花了好幾年在經營這些。

但 ChatGPT 和 Perplexity 不吃這套。

根據 Recomaze 的研究，ChatGPT 從兩個來源取得商品資訊：**Bing Merchant Center 的產品 feed** 和**頁面上的 Schema.org 結構化資料**。它會用 GTIN（全球商品條碼）去比對已知的商品資料庫。Perplexity 則是即時爬取你的頁面，直接讀 JSON-LD 裡的 Product markup。

換句話說，你的 SEO 排名再好，如果 JSON-LD 裡缺了關鍵欄位，AI 就不認識你。

## Shopify 自動產生的 Schema 缺了什麼？

我用 AIViz 掃了 30 多家 Shopify 商店，整理出一個規律。Shopify 的 Dawn 主題（以及大部分主題）自動產生的 Product Schema 通常包含：

**有的**：`name`、`description`、`image`、`offers`（含 `price`、`priceCurrency`）

**幾乎都缺的**：
- `aggregateRating` — 評價分數和評論數量。HubSpot 的報告指出，72% 的消費者計畫更常用 AI 購物。當他們問 ChatGPT「推薦一個好的藍牙耳機」，有評價資料的商品會優先被推薦
- `brand` — 品牌名稱。聽起來很基本，但大部分主題只在頁面上顯示品牌，沒有放進 JSON-LD
- `gtin` / `mpn` — 商品條碼或編號。ChatGPT 用這個去交叉比對 Bing 的商品資料庫，有 GTIN 的商品更容易被正確辨識
- `availability` — 庫存狀態。你不會想讓 AI 推薦一個已經缺貨的商品給消費者

我本來以為至少 `brand` 應該大部分商店都有。掃完才發現，30 家裡面只有 4 家在 JSON-LD 中正確標記了品牌。

## 怎麼補？一個 JSON-LD 就搞定

好消息是，你不需要改 Shopify 主題的 Liquid 程式碼（雖然那是最乾淨的做法）。最快的方式是用 Shopify App 注入額外的 JSON-LD。

但在那之前，先搞清楚你缺什麼。到 [AIViz](https://ai-vision-check-pink.vercel.app/) 貼上你的商品頁 URL，報告會告訴你每個 Schema 欄位的狀態，而且直接給你可以複製的修復程式碼。

舉個例子，如果你的商品缺 `aggregateRating` 和 `brand`，AIViz 會產生這樣的 JSON-LD 片段：

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "brand": {
    "@type": "Brand",
    "name": "你的品牌名稱"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.5",
    "reviewCount": "128"
  }
}
```

把這段加到你的商品頁，AI 搜尋引擎就能讀到完整的商品資訊。

## 不只是 Product Schema — 別忘了這兩件事

結構化資料做好之後，還有兩個常被忽略的項目：

**robots.txt**：確認你沒有封鎖 AI 爬蟲。在你的 `robots.txt` 裡加上：

```
User-agent: GPTBot
Allow: /

User-agent: PerplexityBot
Allow: /
```

Shopify 的預設 `robots.txt` 通常不會擋 AI 爬蟲，但如果你之前有自訂過，建議檢查一下。

**llms.txt**：這是一個放在網站根目錄的 Markdown 檔案，讓 AI 爬蟲快速理解你的網站結構。根據 AskNeedle 的研究，83% 的 AI 引用來自過去 12 個月內更新過的頁面。`llms.txt` 讓 AI 知道你的網站是活的、有在維護的。

## 做完這些，分數會怎麼變？

根據我們的觀察，把缺少的 Schema 欄位補齊之後，AIViz 的分數通常從 30-40 分跳到 80-100 分。最大的分數來源是 Product Schema（20 分）和 aggregateRating（10 分），光這兩項就差 30 分。

但分數只是參考。真正的差異在於：AI 搜尋引擎有了足夠的資訊來推薦你的商品，而不是跳過你去推薦競爭對手。

## 你現在該做的一件事

掃描你賣最好的那一頁商品。看看報告裡哪些 Schema 欄位是紅色的。把它們補齊。

如果你的商店有幾十甚至幾百個商品，用 [SEO Checkup](https://apps.shopify.com/seo-checkup) 一次全站掃描會快很多。

---

*資料來源：[Search Engine Land — Schema for AI search](https://searchengineland.com/)、[HubSpot — AEO Trends 2026](https://blog.hubspot.com/marketing/answer-engine-optimization-trends)、[Recomaze — How AI Chooses Products](https://recomaze.ai/)、[AskNeedle — AEO for E-commerce](https://www.askneedle.com/blog/the-guide-of-answer-engine-optimization-for-ecommerce-brands)。*
