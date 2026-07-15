const en: Record<string, string> = {
  // ── Landing ──────────────────────────────────────────
  'landing.title.line1': 'Your product — ',
  'landing.title.line2': 'Can AI find it?',
  'landing.subtitle': 'Scan your product page in 60 seconds, check AI search engine visibility,\nand get copy-paste fix code',
  'landing.feature1.title': 'Structured Data Scoring',
  'landing.feature1.desc': 'Scan schema.org markup completeness with 8 check rules',
  'landing.feature2.title': 'AI Readability Assessment',
  'landing.feature2.desc': 'Diagnose your product data quality from an AI search engine perspective',
  'landing.feature3.title': 'One-Click Fix Suggestions',
  'landing.feature3.desc': 'Generate copy-paste JSON-LD code snippets',
  'landing.footer': 'OPEN SOURCE \u00B7 ZERO COST \u00B7 PRIVACY FIRST',

  // ── URL Input ────────────────────────────────────────
  'input.placeholder': 'Enter product page URL...',
  'input.submit': 'Analyze',
  'input.remaining': 'TODAY REMAINING: {remaining}/3',

  // ── Analysis Progress ────────────────────────────────
  'progress.title': 'Scanning',
  'progress.subtitle': 'SCANNING IN PROGRESS',
  'progress.step.crawling.label': 'Crawling page',
  'progress.step.crawling.desc': 'Fetching page HTML...',
  'progress.step.parsing.label': 'Parsing structured data',
  'progress.step.parsing.desc': 'Parsing JSON-LD & Open Graph...',
  'progress.step.analyzing.label': 'AI readability analysis',
  'progress.step.analyzing.desc': 'Analyzing readability...',

  // ── Error ────────────────────────────────────────────
  'error.title': 'Analysis Failed',
  'error.retry': 'RETRY',
  'error.network': 'Network error. Please check your connection and try again.',

  // ── Report ───────────────────────────────────────────
  'report.tag': 'REPORT',
  'report.rescan': 'RESCAN',
  'report.verdict.excellent.text': 'Your product performs excellently in AI search',
  'report.verdict.excellent.sub': 'AI search engines can fully understand and may recommend your product',
  'report.verdict.good.text': 'AI can find your product, but there\'s room for improvement',
  'report.verdict.good.sub': 'After fixing the issues below, the chance of AI recommendation will increase significantly',
  'report.verdict.fair.text': 'AI search engines may not recommend your product',
  'report.verdict.fair.sub': 'Your product information is insufficient for AI search engines to trust and recommend',
  'report.verdict.poor.text': 'This page is nearly invisible to AI search engines',
  'report.verdict.poor.sub': 'AI crawlers cannot obtain meaningful product information — optimization is urgently needed',

  // ── Page Type Warning ────────────────────────────────
  'pageType.tryProduct': 'TRY A PRODUCT URL',
  'pageType.example': '{domain}/products/product-name or {domain}/shop/product-name',

  // ── Dynamic Render Warning ───────────────────────────
  'dynamic.title': 'This page uses dynamic rendering (JavaScript SPA)',
  'dynamic.desc': 'AI crawlers (GPTBot, PerplexityBot) may not be able to read your product information.',
  'dynamic.marketplace': 'Marketplace product pages are controlled by the platform. Consider building an independent product website.',
  'dynamic.comingSoon': 'COMING SOON: AI Brand Monitoring',
  'dynamic.recommended': 'RECOMMENDED',
  'dynamic.fix1': '1. Use SSR to ensure AI crawlers can read your content',
  'dynamic.fix2': '2. Embed JSON-LD in HTML instead of injecting via JavaScript',

  // ── Score Card ───────────────────────────────────────
  'score.excellent': 'Excellent',
  'score.good': 'Good',
  'score.fair': 'Fair',
  'score.poor': 'Poor',
  'score.pts': '{total}/{max} pts',

  // ── Category Labels ──────────────────────────────────
  'category.accessibility': 'AI Crawler Access',
  'category.basic': 'Basic',
  'category.basic.full': 'Basic Checks',
  'category.advanced': 'Advanced',
  'category.accessibility.tag': 'CRAWLER ACCESS',
  'category.basic.tag': 'BASIC',
  'category.advanced.tag': 'ADVANCED',

  // ── Radar Chart ──────────────────────────────────────
  'radar.title': 'Score Distribution',
  'radar.accessibility': 'AI Crawler Access',
  'radar.basic': 'Structured Data',
  'radar.advanced': 'Advanced',
  'radar.score': 'Score',

  // ── Narrative Report ─────────────────────────────────
  'narrative.title': 'Your product\'s journey in AI search',
  'narrative.tag': '3-LAYER ANALYSIS',
  'narrative.layer1.title': 'Can AI crawlers access your page?',
  'narrative.layer1.subtitle': 'CRAWLER ACCESS',
  'narrative.layer2.title': 'Can AI understand what you\'re selling?',
  'narrative.layer2.subtitle': 'STRUCTURED DATA',
  'narrative.layer3.title': 'Would AI recommend your product?',
  'narrative.layer3.subtitle': 'RECOMMENDATION POTENTIAL',
  'narrative.access.good': 'AI crawlers can access your page normally',
  'narrative.access.warn': 'Mostly accessible, but with minor issues: {issues}',
  'narrative.access.bad': 'AI crawler access is blocked: {issues}',
  'narrative.understand.good': 'AI can fully understand what product you\'re selling',
  'narrative.understand.warn': 'AI can partially understand, but missing: {issues}',
  'narrative.understand.bad': 'AI cannot effectively understand your product information',
  'narrative.recommend.good': 'AI is likely to recommend your product to users',
  'narrative.recommend.warn': 'There\'s a chance of being recommended, but competitiveness is lacking',
  'narrative.recommend.bad': 'AI is currently unlikely to proactively recommend your product',
  'narrative.collapsed': ' checks unavailable without Product Schema (will unlock once added)',

  // ── Rule List ────────────────────────────────────────
  'rules.collapsed.count': '{count} more checks unavailable without Product Schema',
  'rules.collapsed.unlock': 'Will unlock once Product Schema is added',
  'rules.fix': 'Fix',
  'rules.copy': 'COPY',
  'rules.copied': 'COPIED',

  // ── Search Simulation ────────────────────────────────
  'search.title': 'AI Search Simulation',
  'search.tag': 'SIMULATED',
  'search.desc': 'Based on structured data quality, simulate the likelihood of your product being recommended in AI search',
  'search.disclaimer': 'This is a simulated analysis based on structured data, not real-time search results. Actual rankings are affected by brand awareness, user behavior, AI algorithms, and other factors.',
  'search.wouldRecommend': 'Likely to be recommended',
  'search.wouldNotRecommend': 'Unlikely to be recommended',
  'search.keywords': 'Keyword Visibility',
  'search.visibility.high': 'High',
  'search.visibility.medium': 'Med',
  'search.visibility.low': 'Low',
  'search.visibility.none': 'None',

  // ── AI Readability ───────────────────────────────────
  'aiReadability.unavailable': 'AI READABILITY UNAVAILABLE',
  'aiReadability.title': 'AI Readability Assessment',
  'aiReadability.tag': 'AI ANALYSIS',
  'aiReadability.citation': 'AI CITATION LIKELIHOOD',
  'aiReadability.strengths': 'STRENGTHS',
  'aiReadability.weaknesses': 'WEAKNESSES',

  // ── AI Suggestions ───────────────────────────────────
  'suggestions.allPass': 'Excellent performance — no fixes needed',
  'suggestions.title': 'AI-Suggested Fixes',
  'suggestions.tag': 'AI POWERED',
  'suggestions.priorityFixes': 'PRIORITY FIXES',
  'suggestions.showCode': '\u25BC Show fix code',
  'suggestions.hideCode': '\u25B2 Hide code',
  'suggestions.schemaUnlock': 'Add Product Schema to unlock {count} improvements',
  'suggestions.ptsPotential': '+{pts} pts potential',

  // ── Fix Suggestions ──────────────────────────────────
  'fix.allPass': 'All checks passed',
  'fix.allPassTag': 'ALL CHECKS PASSED',
  'fix.title': 'Priority Fixes',
  'fix.tag': 'BY IMPACT',
  'fix.schemaUnlock': 'Add Product Schema to unlock {count} improvements',
  'fix.includes': 'Includes: {names}',

  // ── Share ────────────────────────────────────────────
  'share.copied': 'COPIED',
  'share.button': 'SHARE',
  'share.prompt': 'Copy this link to share the report:',

  // ── CTA ──────────────────────────────────────────────
  'cta.title': 'Need deeper AI search optimization?',
  'cta.desc': 'We offer SEO / AEO / GEO consulting to help your products gain higher visibility in AI search engines.',
  'cta.button': 'CONTACT US',

  // ── Landing (About link) ─────────────────────────────
  'landing.learnMore': 'Learn more about AIViz',

  // ── About Page ───────────────────────────────────────
  'about.back': 'Back to Home',
  'about.hero.title': 'Help AI search engines find your products',
  'about.hero.subtitle': 'AIViz is a free AI visibility health checker designed for e-commerce sellers.',

  'about.what.title': 'What is this?',
  'about.what.desc': 'Google has Rich Results Test to check if your page meets Google Search structured data standards. But AI search engines (ChatGPT, Perplexity, Gemini) understand your products differently. AIViz was built for this — in 60 seconds, find out if AI can discover your product.',

  'about.who.title': 'Who is it for?',
  'about.who.shopify': 'Shopify store owners',
  'about.who.cyberbiz': 'CYBERBIZ / 91APP store owners',
  'about.who.woo': 'WooCommerce / self-hosted stores',
  'about.who.marketer': 'E-commerce marketers & SEO consultants',

  'about.how.title': 'How does it work?',
  'about.how.step1.title': 'Crawl the page',
  'about.how.step1.desc': 'Fetch product page HTML, parse JSON-LD, Open Graph, and Meta Tags',
  'about.how.step2.title': '3-layer scoring',
  'about.how.step2.desc': 'AI crawler access (30 pts) + Structured data (80 pts) + Advanced optimization (20 pts)',
  'about.how.step3.title': 'AI simulation',
  'about.how.step3.desc': 'Use Gemini AI to simulate search engine recommendation logic and assess your product\'s chances',

  'about.roadmap.title': 'Roadmap',
  'about.roadmap.item1': 'Shopify App — one-click install, automatic AI visibility monitoring',
  'about.roadmap.item2': 'AI Brand Monitoring — track how often your brand is mentioned in AI search',
  'about.roadmap.item3': 'Competitor Analysis — compare your AI visibility against competitors',
  'about.roadmap.item4': 'Scheduled Scans — automatic periodic checks with change notifications',

  'about.contact.title': 'Get in Touch',
  'about.contact.desc': 'Have questions about SEO / AEO / GEO, or interested in working together? Drop us an email.',

  'about.opensource': 'This project is open source on GitHub',
}

export default en
