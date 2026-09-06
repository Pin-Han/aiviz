---
title: "AI 的推薦，不是在你的商品頁上決定的"
description: "Erlin 追蹤 500 個品牌：68% 的 AI 引用來自你管不到的網站。ChatGPT 回答商品問題時最常引用 YouTube、Reddit、RTINGS，品牌自己的網站幾乎不在名單上。那你的商品頁到底還有什麼用？"
date: "2026-09-06"
lang: "zh-TW"
tags: ["GEO", "AI 可見度", "Shopify SEO"]
---

一家叫 cloro 的監測公司跑了 3,312 筆商品相關的查詢，涵蓋六個 AI 引擎，把每一則回答引用的網域全部記下來。ChatGPT 這邊的排行是：YouTube 19%、Reddit 19%、RTINGS 16%，接下來是 Google、Forbes、PCMag、CNET，都是個位數。名單上第一個出現的零售商是 Amazon，5%。

真正做這些商品的品牌，幾乎不在上面。

我在這個部落格已經寫過兩篇文章，叫你去修商品頁的結構化資料。那個建議本身沒錯。但我把它擺錯位置了，而位置比建議本身更關鍵。

## 我對那個「40%」的理解是錯的

上個月我引用了 Princeton 的 GEO 論文：加入引述、加入統計數字、標註來源，可以把引用可見度拉高 30-40%。這個數字是真的。但七月 Olivier Martinez 發表了一份 2023 到 2026 的 GEO 研究批判性綜述，把同一篇論文讀得更仔細，而那個但書才是重點 —— 那個 40% 是**相對**增幅，而且是在「模型已經抓回來的五份文件」這個固定範圍內量出來的。

翻譯成人話：那份研究告訴你的是，當你的頁面已經在模型手上那疊資料裡，會發生什麼事。它完全沒有講你的頁面要怎麼進到那疊裡面。

這份綜述對整個領域都不太客氣。在 C-SEO Bench 上，54 組「方法 × 領域」的測試裡，只有三組拿到穩定的正向結果。在專門為電商設計的 E-GEO 測試平台上，十五個初始經驗法則裡有十個是沒效果、甚至反效果的。關鍵字堆疊在各個 benchmark 上都是零到負分 —— 這應該沒人意外。

所以這裡其實有兩個問題，而我之前是當成一個在寫。**被抓進來**，跟**被引用**。你的 Schema 解決的是第二個。cloro 的資料告訴你，第一個是在別的地方決定的。

## 推薦是在別人的網頁上發生的

Erlin 在八月公布了一份追蹤 500 個品牌、橫跨 ChatGPT、Claude、Gemini、Perplexity 的資料：**68% 的 AI 引用來自第三方來源，只有 32% 來自品牌自己的網站**。他們還量了不同第三方相對於品牌自有內容的權重：

- Reddit 討論串：3.4 倍
- Wikipedia：2.9 倍
- G2、Capterra 這類評論平台：2.6 倍
- YouTube：2.1 倍

AirOps 的版本更極端 —— 分析 21,311 則品牌提及、500 多個商業意圖查詢，其中只有 13.2% 來自品牌自己的網域，而第三方提及裡有將近 90% 出自懶人包、比較文、評測。不過他們的樣本是 B2B 軟體，所以我不會把那個 13.2% 直接套到一家賣鍋具的店。cloro 的類別才是消費品：3C、穿戴、居家、廚房、音響、戶外。不同資料，同一個方向。

於是問題就有點尷尬了。如果模型是靠讀 RTINGS 和 Reddit 做決定，那你的商品頁到底是拿來幹嘛的？

## 你的頁面不是廣告，是查證用的

這是我後來想通的模型，它也改變了我看自家工具報告的方式。

第三方來源告訴機器：**這個商品值得被提到**。你的頁面告訴機器：**關於這個商品，現在什麼是真的** —— 現在的價格、有沒有現貨、確切的型號、真實的評論數。一篇三月寫的評測可以說你的喇叭好聽，但它沒辦法說出這顆喇叭今天賣多少錢。

當兩邊對不起來，模型就麻煩了。如果你的頁面寫「312 則評價，4.6 分」，但你的 Trustpilot 上是「40 則，3.9 分」，其中一個會被丟掉 —— 而被丟掉的不會是那個獨立的第三方。

Erlin 關於「事實密度」的數字指向同一件事。**商品有九個以上結構化事實的品牌，AI 覆蓋率平均 78%；只有零到兩個的，是 9%。**每多一個屬性，中位數覆蓋率大約多 8.3%。他們也量了衰退：長期沒動的頁面，覆蓋率每個月掉約 1.8%；每月更新的頁面，比放著不管的高出 23%。

九個事實聽起來不像一個內容專案。品牌、GTIN、型號、價格、幣別、庫存狀態、材質、尺寸、平均評分。大部分 Shopify 主題其實已經在頁面上顯示了其中七項，只是只有兩項進到 JSON-LD 裡。

## 你現在看到的 AI 流量，本來就少算了

在你決定「AI 流量太少不用管」之前，還有一件事值得知道。

The Digital Bloom 的分析發現，大約 **70.6% 的 AI 推薦流量進到 Google Analytics 時會被歸類成「direct」**，因為 AI 助理經常把 referrer 拿掉。所以當你打開 GA4 看到 AI 只帶來 1% 的 session，實際數字很可能是好幾倍，藏在一個你放著沒看很多年的分類裡。

而且它會轉換。Visibility Labs 追蹤 94 家電商、為期十二個月，ChatGPT 進來的 session 轉換率是 1.81%，非品牌自然搜尋是 1.39%。

## 這禮拜就做這一件事

打開 ChatGPT，用消費者會問的方式問一次 ——「[你的品類] 推薦，預算 [你的價格帶]」—— 然後**只看引用來源，不要看答案**。跳出來的那幾個網域，才是你真正的競爭場地。推薦是在那裡發生的，你在自己頁面上做再多也進不去。

接著，去確認你的頁面能不能替它們背書。[把你最暢銷的商品網址丟進 AIViz 掃一次](https://ai-vision-check-pink.vercel.app/)，看機器實際抓得到什麼：找得到你的品牌嗎？GTIN？評分？庫存狀態？如果抓不到，那麼就算哪天有評測寫到你，你在那場對話裡還是不存在。

如果你的 SKU 不只十來個，[SEO Checkup](https://apps.shopify.com/seo-checkup) 可以一次把整間店的商品頁都跑過同樣的檢查。

你沒辦法在這個禮拜叫 Reddit 討論你。但你可以確保 —— 當它真的討論你的那天，跟著讀過來的那台機器，會找到一個站得住腳的頁面。

---

*資料來源：[cloro — AI Shopping: What ChatGPT Recommends](https://cloro.dev/blog/ai-shopping-chatgpt-recommends/)、[Erlin — AEO Best Practices in 2026：500 個品牌的數據](https://www.erlin.ai/blog/aeo-best-practices)、[AirOps — The Influence of Offsite Signals in AI Search](https://www.airops.com/report/the-influence-of-offsite-signals-in-ai-search)、[Martinez — Optimizing Visibility in Generative Engines: A Critical Survey of GEO (2023–2026)](https://arxiv.org/abs/2607.14035)、[Zero Click Project — ChatGPT Shopping Ecommerce Discovery Research](https://www.zeroclickproject.com/insights/research/chatgpt-shopping-ecommerce-discovery-research)。*
