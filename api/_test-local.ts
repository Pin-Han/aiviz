/**
 * Local testing script — run with:
 *   npx tsx api/test-local.ts https://some-shopify-store.com/products/example
 *
 * Requires GEMINI_API_KEY in api/.env (optional — AI readability will be skipped without it)
 */

import { config } from 'dotenv'
config({ path: new URL('.env', import.meta.url).pathname })

import { crawlUrl } from './_lib/crawler.js'
import { parseHtml } from './_lib/parser.js'
import { runAllRules } from './_lib/scorer.js'
import { GeminiProvider } from './_lib/gemini-provider.js'

async function main() {
  const url = process.argv[2]
  if (!url) {
    console.error('Usage: npx tsx api/test-local.ts <product-url>')
    process.exit(1)
  }

  console.log(`\n🔍 Analyzing: ${url}\n`)

  // Crawl
  console.log('⏳ Crawling...')
  const crawlResult = await crawlUrl(url)
  console.log(`✅ Crawled in ${crawlResult.crawlTimeMs}ms (${crawlResult.html.length} chars)\n`)

  // Parse
  console.log('⏳ Parsing...')
  const pageData = parseHtml(crawlResult.html, crawlResult.url, crawlResult.crawlTimeMs)
  console.log(`✅ JSON-LD: ${pageData.jsonLd ? 'Found' : 'Not found'}`)
  console.log(`✅ OG Title: ${pageData.openGraph.title ?? '(none)'}`)
  console.log(`✅ Meta Title: ${pageData.metaTags.title ?? '(none)'}\n`)

  // Score
  console.log('⏳ Scoring...')
  const results = runAllRules(pageData)
  const basicScore = results
    .filter((r) => r.category === 'basic')
    .reduce((sum, r) => sum + r.score, 0)
  const advancedScore = results
    .filter((r) => r.category === 'advanced')
    .reduce((sum, r) => sum + r.score, 0)

  console.log(`\n📊 Score: ${basicScore + advancedScore}/100 (Basic: ${basicScore}/80, Advanced: ${advancedScore}/20)\n`)

  results.forEach((r) => {
    const icon = r.status === 'pass' ? '✅' : r.status === 'warn' ? '⚠️' : '❌'
    console.log(`${icon} ${r.name}: ${r.score}/${r.maxScore} — ${r.message}`)
    if (r.fix) console.log(`   💡 ${r.fix}`)
  })

  // AI Readability (optional)
  const geminiKey = process.env.GEMINI_API_KEY
  if (geminiKey) {
    console.log('\n⏳ AI Readability Assessment...')
    const provider = new GeminiProvider(geminiKey)
    const ai = await provider.assessReadability(pageData)
    console.log(`\n🤖 ${ai.summary}`)
    if (ai.strengths.length) console.log(`   👍 ${ai.strengths.join(', ')}`)
    if (ai.weaknesses.length) console.log(`   👎 ${ai.weaknesses.join(', ')}`)
  } else {
    console.log('\n⚠️  GEMINI_API_KEY not set, skipping AI readability assessment')
  }

  console.log('\n✅ Done!')
}

main().catch(console.error)
