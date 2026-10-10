---
title: "你的雙 11 折扣，ChatGPT 看不到"
description: "Adobe 預估今年年底購物季 AI 導流成長 130%，但 AI 助理報錯價格時，中位數誤差高達 300 美元（Product.ai）。如果你的 Shopify 折扣是用「自動折扣」設定的，AI 讀到的永遠是原價。雙 11 前花五分鐘檢查一個網址就知道。"
date: "2026-10-10"
lang: "zh-TW"
tags: ["Shopify SEO", "AI 可見度", "結構化資料"]
---

Product.ai 拿同樣 220 個購物問題，去問 ChatGPT、Claude、Gemini、Perplexity 的免費版和付費版，再把回答跟電商網站上的即時價格逐一比對。9 月 25 日公布結果：在 913 筆可以驗證的價格裡，85% 是對的。

聽起來還行。但下一句才是重點：價格一旦報錯，誤差的中位數是 300 美元。

研究團隊的原話是：「幾乎沒有中間地帶，不是完全正確，就是錯得離譜。」

我原本以為 AI 報錯價格是「模糊」的那種錯 —— 四捨五入、記成去年的型號、東拼西湊。這句話讓我重新想了一遍。研究沒有說錯的數字是從哪裡來的，但在我看來，沒有中間地帶的錯不太像是猜的，比較像是模型很忠實地讀了一個數字，只是那個來源本身就是錯的。

所以我去檢查了一個你完全掌控的來源：你自己的商品頁。

## 你即將走進的這個購物季

Product.ai 的研究出來三天後，Adobe 發布了年底購物季預測：11 月 1 日到 12 月 31 日之間，AI 導流到美國零售網站的流量預計年增 **130%**，感恩節當天的成長最猛，141%。Salesforce 七月的預測更直接 —— 今年年底購物季有 20% 的電商流量會來自 AI 聊天助理。

這些是美國的數字。但你在台灣也不會晚多少：雙 11 就在一個月後，而你的客人問 ChatGPT「現在有什麼 XX 在打折」的那一刻，AI 一定會回答一個價格。

問題是，它回答的是誰給的價格。

## 你的折扣價，在哪裡消失的

這是大部分 Shopify 店主不知道的事，因為後台沒有任何畫面會告訴你。

Shopify 有兩種方式做特價。一種是直接改商品售價，再填一個「比較價格」（compare-at price），也就是前台那個被劃掉的原價。另一種是建一個「自動折扣」：例如「冬季系列全館 7 折，11/1 到 11/11」。做雙 11 很容易選第二種，理由很實際 —— 設一次就好，不用改兩百個規格、活動結束再改回來。

但自動折扣是在**購物車裡**才計算的，預設不會出現在商品頁上。Shopify 社群論壇上有一則回覆把原因講得很白：折扣可能跟購物車裡的其他東西有關，所以商品頁沒辦法事先知道。

這代表什麼？你頁面裡的 JSON-LD —— 也就是 ChatGPT 和 Perplexity 會讀的 `offers.price` 欄位 —— 在整個檔期裡都停在原價。

你的橫幅寫 7 折。你的結構化資料寫 NT$2,980。客人看到的是橫幅，機器看到的是 NT$2,980。

很多佈景主題和折扣 App 會用 JavaScript 在頁面載入後把價格「改」成折扣價。這對真人有用，但對只讀伺服器原始 HTML 的爬蟲沒用。Vercel 和 MERJ 分析了 Vercel 網路上的 AI 爬蟲流量，發現 GPTBot 和 ClaudeBot 會下載 JavaScript 檔案，但從來不執行。

結果是一種很安靜、很具體的失分：有人問 AI 你這個品類有什麼優惠，你的商品出現了，但標的是原價，旁邊是一個把折扣價寫進 markup 的競爭對手。你明明比較便宜，機器不知道。

## 客人會怪你，不會怪 AI

你可能覺得 AI 講錯是 AI 的問題。消費者不這麼想。

Rithum 今年春天調查了 1,046 位美國和英國的線上購物者：58% 的人說，當 AI 推薦裡的商品資訊有錯，他們會怪罪品牌或零售商。16% 說他們會因此直接放棄買這個商品。

而且這個錯可以往兩個方向走。如果你上個月用比較價格做過特價，活動結束後忘了把售價改回來，你的 Schema 就會掛著一個過期的「低價」。AI 照著報，客人點進來，結果頁面要的錢比 AI 說的多。這不只是少一次推薦，而是一個覺得自己被「釣魚」的客人 —— 偏偏發生在一年中你最需要對方信任你的那一週。

## 解法很無聊，這是好消息

只針對你真正預期會在雙 11 賣得動的那幾個商品 —— 前十名就好，不是整個型錄 —— 改用「比較價格」來做特價，不要用自動折扣。這樣 Shopify 預設的 `structured_data` 輸出就會把折扣價放進 `offers.price`，跟客人看到的是同一個數字。你可以用 Shopify Flow 或批次改價 App 排程，不用在 11 月 10 日半夜爬起來一個一個改。

長尾商品要繼續用自動折扣也沒關係。重點是：AI 最可能被問到的那幾個商品，要掛一個它讀得懂的價格。

然後在行事曆上記一筆：檔期結束隔天早上，把價格改回來。12 月還掛著過期特價，比 11 月少掛一個折扣價傷得更重。

## 11 月 1 日之前，先檢查一個網址

挑你最暢銷的那一個商品 —— 你雙 11 每封 EDM 都會放的那個。[把它的網址丟進 AIViz 掃一次](https://ai-vision-check-pink.vercel.app/)，在報告裡找到價格那一項，它會顯示機器從你頁面結構化資料裡實際抓到的價格和幣別。接著用無痕視窗打開同一頁，對照客人實際要付的金額。

兩個數字一樣，你就沒事了。不一樣的話，你剛剛找到的，就是你的折扣跟每一個即將被問到它的 AI 之間的落差。活動正式上線之後再檢查一次，因為那時候兩個數字最容易對不上。

如果你的主打商品不只幾個，[SEO Checkup](https://apps.shopify.com/seo-checkup) 可以一次檢查全店每個商品頁的價格，比活動前一晚手動一頁一頁看快得多。

你的折扣是真的。確保機器讀到的數字也這麼說。

---

*資料來源：[Product.ai — AI Shopping Divergence Study](https://product.ai/research/ai-shopping-divergence-study/)（經 [Tech.co](https://tech.co/news/ai-shopping-assistants-not-ready-holidays) 報導）、[Adobe 2026 年底購物季預測](https://cryptobriefing.com/adobe-chatgpt-holiday-shopping-forecast/)、[Adobe — AI Traffic Trends Report, August 2026](https://business.adobe.com/resources/sdk/ai-traffic-trends-report-august-2026)、[Salesforce — 2026 Holiday Retail Predictions](https://www.salesforce.com/blog/holiday-retail-predictions-2026/)、[Rithum — The New Discovery Engine](https://fashionunited.com/news/retail/when-ai-shares-incorrect-information-58-of-shoppers-blame-the-brand/2026032671432)、[Shopify Community — Automatic discount visibility](https://community.shopify.com/t/automatic-discount-code-visibility/630655)、[Vercel — The rise of the AI crawler](https://vercel.com/blog/the-rise-of-the-ai-crawler)。*
