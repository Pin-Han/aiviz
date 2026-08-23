---
title: "SEO、AEO、GEO：三個縮寫，一個你商品頁必須回答的問題"
description: "Adobe 2026 年 7 月數據：從 AI 來的訪客轉換率高出 60%。但零售商品頁只有 66% 的內容是 AI 讀得懂的。這篇拆解 SEO、AEO、GEO 到底差在哪，以及哪一個真的會影響你的營收。"
date: "2026-08-23"
lang: "zh-TW"
tags: ["GEO", "AEO", "AI 可見度"]
---

Adobe 上週公布 2026 年 7 月的零售數據。從 AI 助理（ChatGPT、Perplexity 這類）進來的訪客，轉換率比其他所有流量**高出 60%**，停留時間多 59%，跳出率低 33%，加入購物車的比例多 28%。這已經是 AI 流量連續第 11 個月在轉換率上贏過非 AI 流量。資料來自超過一兆次美國零售網站的造訪，不是誰的 A/B 測試小樣本。

然後 Adobe 用同一批網站做了另一件事：檢查這些頁面，語言模型到底能讀懂多少。

首頁 75%。分類頁 74%。商品頁 —— 那個真正收錢的頁面 —— 只有 **66%**。

我原本以為結果會反過來。首頁才是那個塞滿 JavaScript、輪播圖、lazy load 一堆東西的行銷遊樂場；商品頁應該是無聊、規格化、樣板產出的那種。我猜錯了。消費者決定要不要下單的那一頁，正是 AI 最看不懂的一頁。

## 三個縮寫，只有一個是新東西

現在每家找上你的行銷公司都在賣這三樣其中之一，所以我們把話講清楚。

**SEO** 是讓一條藍色連結排上去。**AEO**（answer engine optimization，答案引擎優化）是讓你的內容被「抽出來」當成答案 —— 精選摘要、語音助理的回答、Google AI Overview 裡的那一行。**GEO**（generative engine optimization，生成式引擎優化）則是讓你在 ChatGPT、Perplexity、Gemini 生成的答案裡「被引用」，而那裡根本沒有排名清單這種東西。

這裡有個關鍵：AEO 和 GEO 失敗的方式一模一樣 —— 機器讀了你的頁面，找不到一個它敢用的事實，於是安靜地改用競爭對手的資料。沒有人會寄報告通知你。排名沒有掉，流量也沒有出現你能歸因的下滑。你就只是，不再被提到了。

## Google 排名買不到 AI 的引用

這是整件事裡最改變我想法的一個數字。

Semrush 研究了 500 多個行銷相關主題，發現 ChatGPT 引用的頁面，**將近 90% 在傳統搜尋的排名是第 21 名以後**。排名 1-5 的頁面確實比 6-20 名更常被引用，所以傳統 SEO 還是有用。但那個相關性，比那些跟你說「排到第一名 AI 自然會找到你」的人願意承認的弱得多。

原因很機械。Google 排的是「頁面」。語言模型抓的是「片段」—— 一段文字、一張規格表、一個評論區塊 —— 然後把答案拼出來。一個排名第 30、但有一條乾淨、可引用、標記清楚的事實的頁面，會贏過排名第 3、但把同一條事實藏在圖片或 JavaScript 分頁裡的頁面。

這就是整個遊戲的規則，也是為什麼「把 SEO 做好就對了」在 2026 年只答對一半。

## 真的有研究支撐的三個做法

大部分 GEO 建議都是感覺派。有一份大型學術研究值得知道：Princeton 的 GEO 論文（Aggarwal 等人，發表於 KDD 2024），在約 10,000 個查詢上測試了九種內容策略。

其中三種明顯有效，相較未優化的基準各自把引用可見度拉高約 30-40%：**加入直接引述、加入統計數字、標註資料來源**。優化文句流暢度、用權威口吻寫作也有幫助。而關鍵字堆疊 —— 那個做了十五年 SEO 留下的反射動作 —— 幾乎沒有效果。

把這三點翻譯到商品頁上，它就不抽象了。「引述」是一則有署名的真實顧客評論，寫在 HTML 裡，而不是從評論外掛的 iframe 載進來。「統計數字」是「312 則評價，平均 4.6 分」寫成 JSON-LD 裡的 `aggregateRating`，而不是五顆要爬蟲自己數的星星圖示。「資料來源」是有連結的規格出處、認證標章、材質說明 —— 讓模型能引用，而不是靠猜。

這些都不是新內容。這些是你本來就有的內容，只是搬到機器撿得到的地方。

## 電商還沒準備好的那一層

還有第二層正在發生，而它跟內容一點關係都沒有。

OpenAI 在 2025 年 9 月推出 Instant Checkout，讓人可以在 ChatGPT 對話裡直接完成購買，背後是 OpenAI 與 Stripe 共同制定的 Agentic Commerce Protocol（ACP）。整個 2026 年開放範圍都還很窄 —— 只有少數幾個大品牌，不是全面對 Shopify 開放 —— 所以我不會建議你為了它重排這一季的工作。

但看看它要求什麼：一份結構化、即時的商品 feed，庫存、價格、運送資訊都要準到讓 agent 敢信。這跟 GEO 的要求是同一件事，只是標準更嚴。人類讀你的頁面時，價格有點過時只是有點煩；agent 直接在上面成交時，那就是一張壞掉的訂單。

換句話說，你為了被引用而做的功，跟未來被 agent 賣得出去的功，是同一份。這條件划算得不太尋常，也是我覺得現在就該做、而不是等哪個縮寫勝出的主要理由。

## 「可是 AI 流量只佔我 1%」

這個反駁很合理，數字也站在你這邊。Search Engine Land 分析了 13 個月的 GA4 資料，發現 LLM 帶來的推薦流量不到總推薦流量的 2% —— 但轉換率大約 18%。Ahrefs 也公布了自己的數字：AI 搜尋只帶來 0.5% 的訪客，卻貢獻了 12.1% 的註冊。

Ahrefs 是 B2B SaaS，Semrush 研究的是行銷主題，兩者都沒辦法完美對應到一家賣陶器的店。但 Adobe 的零售數據可以，而它用另一種語氣說了同一件事：轉換高 60%，每次造訪帶來的營收多 53%，年增 62%。

小渠道。不成比例的營收。而且成長很快。這種東西不需要一份策略簡報 —— 需要的是你的商品頁讀得懂。

## 這禮拜就做這一件事

挑你最暢銷的那一個商品頁網址 —— 不是首頁 —— 看看機器載入這一頁時究竟看到什麼。[丟進 AIViz 掃一次](https://ai-vision-check-pink.vercel.app/)，看報告裡哪些欄位是缺的，把最嚴重的兩個補起來。就這樣。

如果你的 SKU 數量不只十來個，而「一個一個網址貼」正是讓你遲遲沒動手的原因，[SEO Checkup](https://apps.shopify.com/seo-checkup) 可以一次掃完整間店。

Adobe 的基準線說，零售商品頁平均只有 66% 讀得懂。把你的拉到 95%，是一個禮拜二下午的工作量 —— 而現在它大概是電商裡最便宜的競爭優勢。

---

*資料來源：[Adobe / Digital Commerce 360 — 2026 年 7 月 AI 推薦流量數據](https://www.digitalcommerce360.com/2026/08/19/adobe-ai-referral-traffic-data-july-2026/)、[Adobe — AI 流量成長，但零售網站在 AI 搜尋可見度上落後](https://business.adobe.com/blog/ai-traffic-surge-retail-sites-not-machine-readable)、[Semrush — AI Search and SEO Traffic Study](https://www.semrush.com/blog/ai-search-seo-traffic-study/)、[Aggarwal et al. — GEO: Generative Engine Optimization (KDD 2024)](https://arxiv.org/abs/2311.09735)、[Search Engine Land — 13 個月 LLM 流量數據分析](https://searchengineland.com/what-13-months-of-data-reveals-about-llm-traffic-growth-and-conversions-470115)、[Ahrefs — AI search traffic conversions](https://ahrefs.com/blog/ai-search-traffic-conversions-ahrefs/)。*
