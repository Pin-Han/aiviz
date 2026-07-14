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
  'category.basic': '基本項',
  'category.basic.full': '基本項目',
  'category.advanced': '進階優化',
  'category.accessibility.tag': 'CRAWLER ACCESS',
  'category.basic.tag': 'BASIC',
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
  'narrative.layer3.title': 'AI 會推薦你的商品嗎？',
  'narrative.layer3.subtitle': 'RECOMMENDATION POTENTIAL',
  'narrative.access.good': 'AI 爬蟲可以正常存取你的頁面',
  'narrative.access.warn': '大致可存取，但有小問題：{issues}',
  'narrative.access.bad': 'AI 爬蟲存取受阻：{issues}',
  'narrative.understand.good': 'AI 能充分理解你在賣什麼商品',
  'narrative.understand.warn': 'AI 能部分理解，但缺少：{issues}',
  'narrative.understand.bad': 'AI 無法有效理解你的商品資訊',
  'narrative.recommend.good': 'AI 有較高機率推薦你的商品給用戶',
  'narrative.recommend.warn': '有被推薦的可能，但競爭力不足',
  'narrative.recommend.bad': 'AI 目前不太可能主動推薦你的商品',
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
  'cta.title': '需要更深入的 AI 搜尋優化？',
  'cta.desc': '我們提供 SEO / AEO / GEO 諮詢服務，幫助你的商品在 AI 搜尋引擎中獲得更高可見度。',
  'cta.button': 'CONTACT US',
}

export default zhTW
