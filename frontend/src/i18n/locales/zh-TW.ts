const zhTW: Record<string, string> = {
  // ── Landing ──────────────────────────────────────────
  'landing.title.line1': '你的商品，',
  'landing.title.line2': 'AI 搜得到嗎？',
  'landing.subtitle': '60 秒掃描你的商品頁，檢查 AI 搜尋引擎的可見度，\n獲得可直接複製的修復程式碼',
  'landing.feature1.title': '結構化資料評分',
  'landing.feature1.desc': '掃描 schema.org 標記完整度，8 項檢查規則',
  'landing.feature2.title': 'AI 可讀性評估',
  'landing.feature2.desc': '從 AI 搜尋引擎的角度，診斷你的商品資料品質',
  'landing.feature3.title': '一鍵修復建議',
  'landing.feature3.desc': '產出可直接複製的 JSON-LD 程式碼片段',
  'landing.footer': 'OPEN SOURCE \u00B7 ZERO COST \u00B7 PRIVACY FIRST',

  // ── URL Input ────────────────────────────────────────
  'input.placeholder': '輸入商品頁 URL...',
  'input.submit': '分析',
  'input.remaining': 'TODAY REMAINING: {remaining}/3',

  // ── Analysis Progress ────────────────────────────────
  'progress.title': '正在掃描中',
  'progress.subtitle': 'SCANNING IN PROGRESS',
  'progress.step.crawling.label': '爬取頁面中',
  'progress.step.crawling.desc': 'Fetching page HTML...',
  'progress.step.parsing.label': '解析結構化資料',
  'progress.step.parsing.desc': 'Parsing JSON-LD & Open Graph...',
  'progress.step.analyzing.label': 'AI 可讀性評估中',
  'progress.step.analyzing.desc': 'Analyzing readability...',

  // ── Error ────────────────────────────────────────────
  'error.title': '分析失敗',
  'error.retry': 'RETRY',
  'error.network': '網路連線錯誤，請檢查網路後再試',

  // ── Report ───────────────────────────────────────────
  'report.tag': 'REPORT',
  'report.rescan': 'RESCAN',
  'report.verdict.excellent.text': '你的商品在 AI 搜尋中表現優異',
  'report.verdict.excellent.sub': 'AI 搜尋引擎能充分理解並可能推薦你的商品',
  'report.verdict.good.text': 'AI 可以找到你的商品，但還有提升空間',
  'report.verdict.good.sub': '修復以下問題後，被 AI 推薦的機率將顯著提升',
  'report.verdict.fair.text': 'AI 搜尋引擎可能不會推薦你的商品',
  'report.verdict.fair.sub': '你的商品資訊不足以讓 AI 搜尋引擎信任並推薦',
  'report.verdict.poor.text': '這個頁面對 AI 搜尋引擎幾乎隱形',
  'report.verdict.poor.sub': 'AI 爬蟲無法取得有意義的商品資訊，急需優化',

  // ── Page Type Warning ────────────────────────────────
  'pageType.tryProduct': 'TRY A PRODUCT URL',
  'pageType.example': '{domain}/products/商品名稱 or {domain}/shop/商品名稱',

  // ── Dynamic Render Warning ───────────────────────────
  'dynamic.title': '此頁面使用動態渲染（JavaScript SPA）',
  'dynamic.desc': 'AI 爬蟲（GPTBot、PerplexityBot）可能無法讀取你的商品資訊。',
  'dynamic.marketplace': '平台商品頁面由平台控制渲染方式，建議考慮建立獨立商品網站。',
  'dynamic.comingSoon': 'COMING SOON: AI 品牌監測',
  'dynamic.recommended': 'RECOMMENDED',
  'dynamic.fix1': '1. 採用 SSR 確保 AI 爬蟲能讀取內容',
  'dynamic.fix2': '2. 在 HTML 中內嵌 JSON-LD，不依賴 JS 動態插入',

  // ── Score Card ───────────────────────────────────────
  'score.excellent': 'Excellent',
  'score.good': 'Good',
  'score.fair': 'Fair',
  'score.poor': 'Poor',
  'score.pts': '{total}/{max} pts',

  // ── Category Labels ──────────────────────────────────
  'category.accessibility': 'AI 爬蟲可及性',
  'category.basic': '結構化資料',
  'category.basic.full': '結構化資料',
  'category.advanced': '進階優化',
  'category.accessibility.tag': 'CRAWLER ACCESS',
  'category.basic.tag': 'STRUCTURED DATA',
  'category.advanced.tag': 'ADVANCED',

  // ── Radar Chart ──────────────────────────────────────
  'radar.title': 'Score Distribution',
  'radar.accessibility': 'AI 爬蟲可及性',
  'radar.basic': '結構化資料',
  'radar.advanced': '進階優化',
  'radar.score': 'Score',

  // ── Narrative Report ─────────────────────────────────
  'narrative.title': '你的商品在 AI 搜尋中的旅程',
  'narrative.tag': '3-LAYER ANALYSIS',
  'narrative.layer1.title': 'AI 爬蟲進得來嗎？',
  'narrative.layer1.subtitle': 'CRAWLER ACCESS',
  'narrative.layer2.title': 'AI 看得懂你在賣什麼嗎？',
  'narrative.layer2.subtitle': 'STRUCTURED DATA',
  'narrative.layer3.title': '你的頁面有為 AI 優化嗎？',
  'narrative.layer3.subtitle': 'ADVANCED OPTIMIZATION',
  'narrative.access.good': 'AI 爬蟲可以正常存取你的頁面',
  'narrative.access.warn': '大致可存取，但有小問題：{issues}',
  'narrative.access.bad': 'AI 爬蟲存取受阻：{issues}',
  'narrative.understand.good': 'AI 能充分理解你在賣什麼商品',
  'narrative.understand.warn': 'AI 能部分理解，但缺少：{issues}',
  'narrative.understand.bad': 'AI 無法有效理解你的商品資訊',
  'narrative.recommend.good': '你的頁面已具備完整的 AI 優化項目',
  'narrative.recommend.warn': '部分進階優化項目尚未完成',
  'narrative.recommend.bad': '進階 AI 優化項目尚未設置',
  'narrative.collapsed': '項因缺少 Product Schema 而無法檢查（加入後自動解鎖）',

  // ── Rule List ────────────────────────────────────────
  'rules.collapsed.count': '另有 {count} 項因缺少 Product Schema 而無法檢查',
  'rules.collapsed.unlock': '加入 Product Schema 後自動解鎖',
  'rules.fix': 'Fix',
  'rules.copy': 'COPY',
  'rules.copied': 'COPIED',

  // ── Search Simulation ────────────────────────────────
  'search.title': 'AI 搜尋模擬',
  'search.tag': 'SIMULATED',
  'search.desc': '根據頁面結構化資料品質，模擬你的商品在 AI 搜尋中被推薦的可能性',
  'search.disclaimer': '以下為基於結構化資料的模擬分析，非即時搜尋結果。實際排名受品牌知名度、用戶行為、AI 演算法等多重因素影響。',
  'search.wouldRecommend': '可能被推薦',
  'search.wouldNotRecommend': '不太可能被推薦',
  'search.keywords': '關鍵字可見度',
  'search.visibility.high': '高',
  'search.visibility.medium': '中',
  'search.visibility.low': '低',
  'search.visibility.none': '無',

  // ── AI Readability ───────────────────────────────────
  'aiReadability.unavailable': 'AI READABILITY UNAVAILABLE',
  'aiReadability.title': 'AI 可讀性評估',
  'aiReadability.tag': 'AI ANALYSIS',
  'aiReadability.citation': 'AI CITATION LIKELIHOOD',
  'aiReadability.strengths': 'STRENGTHS',
  'aiReadability.weaknesses': 'WEAKNESSES',

  // ── AI Suggestions ───────────────────────────────────
  'suggestions.allPass': '表現優異，目前無需修正',
  'suggestions.title': 'AI 建議的修正方向',
  'suggestions.tag': 'AI POWERED',
  'suggestions.priorityFixes': 'PRIORITY FIXES',
  'suggestions.showCode': '\u25BC 查看修復程式碼',
  'suggestions.hideCode': '\u25B2 隱藏程式碼',
  'suggestions.schemaUnlock': '加入 Product Schema 後可解鎖 {count} 項改善',
  'suggestions.ptsPotential': '+{pts} pts potential',

  // ── Fix Suggestions ──────────────────────────────────
  'fix.allPass': '所有項目都通過了',
  'fix.allPassTag': 'ALL CHECKS PASSED',
  'fix.title': '優先修復建議',
  'fix.tag': 'BY IMPACT',
  'fix.schemaUnlock': '加入 Product Schema 後可解鎖 {count} 項改善',
  'fix.includes': '包含：{names}',

  // ── Share ────────────────────────────────────────────
  'share.copied': 'COPIED',
  'share.button': 'SHARE',
  'share.prompt': '複製此連結分享報告：',

  // ── CTA ──────────────────────────────────────────────
  'cta.title': '想持續追蹤你的 AI 可見度？',
  'cta.desc': '自動定期掃描、變化通知、競品比較 — AI 監控功能即將推出。留下 email 搶先體驗。',
  'cta.button': 'GET EARLY ACCESS',
  'cta.consulting': '或洽詢 SEO / AEO / GEO 顧問服務 \u2192',

  // ── Shopify CTA ─────────────────────────────────────
  'shopify.cta.detected': '此商店使用 Shopify — 安裝 SEO Checkup 即可一次掃描全店商品、追蹤改善進度、取得修復連結。',
  'shopify.cta.button': 'Install Free on Shopify',
  'shopify.cta.generic': '你有 Shopify 商店嗎？試試我們的免費 Shopify App，一次掃描全站商品。',

  // ── Landing (About link) ─────────────────────────────
  'landing.learnMore': '了解更多關於 AIViz',

  // ── About Page ───────────────────────────────────────
  'about.back': '返回首頁',
  'about.hero.title': '讓 AI 搜尋引擎找到你的商品',
  'about.hero.subtitle': 'AIViz 是一款免費的 AI 可見度健檢工具，專為電商賣家設計。',

  'about.what.title': '這是什麼？',
  'about.what.desc': 'Google 有 Rich Results Test，讓你檢查網頁是否符合 Google 搜尋的結構化資料標準。但 AI 搜尋引擎（ChatGPT、Perplexity、Gemini）用不同的方式理解你的商品。AIViz 就是為此而生 — 60 秒內告訴你 AI 搜得到你的商品嗎。',

  'about.who.title': '誰適合用？',
  'about.who.shopify': 'Shopify 店家',
  'about.who.cyberbiz': 'CYBERBIZ / 91APP 店家',
  'about.who.woo': 'WooCommerce / 自架站',
  'about.who.marketer': '電商行銷人員與 SEO 顧問',

  'about.how.title': '怎麼運作？',
  'about.how.step1.title': '爬取頁面',
  'about.how.step1.desc': '抓取商品頁的 HTML，解析 JSON-LD、Open Graph、Meta Tags',
  'about.how.step2.title': '三層評分',
  'about.how.step2.desc': 'AI 爬蟲可及性（30 分）+ 結構化資料（80 分）+ 進階優化（20 分）',
  'about.how.step3.title': 'AI 模擬分析',
  'about.how.step3.desc': '用 Gemini AI 模擬搜尋引擎的推薦邏輯，評估你的商品被推薦的機率',

  'about.roadmap.title': '未來計畫',
  'about.roadmap.item1': 'Shopify App 一鍵安裝，自動監控 AI 可見度',
  'about.roadmap.item2': 'AI 品牌監測 — 追蹤你的品牌在 AI 搜尋中的提及率',
  'about.roadmap.item3': '競品分析 — 比較你和競爭對手的 AI 可見度差異',
  'about.roadmap.item4': '定期掃描報告 — 自動排程檢查，變化時通知你',

  'about.contact.title': '聯絡我們',
  'about.contact.desc': '有任何 SEO / AEO / GEO 相關問題，或想合作，歡迎來信。',

  'about.opensource': '本專案開源於 GitHub',

  // ── Page Titles (SEO) ───────────────────────────────
  'meta.title.home': 'AIViz — AI 搜尋可見度檢測工具',
  'meta.title.about': '關於 AIViz — AI 搜尋可見度檢測工具',
  'meta.title.report': '{url} 的 AI 可見度報告 — AIViz',
}

export default zhTW
