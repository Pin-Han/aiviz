import { GoogleGenerativeAI } from '@google/generative-ai'
import type { PageData, AiReadabilityResponse, SearchSimulationResult } from '../../shared/types.js'
import type { AIProvider } from './ai-provider.js'

export class GeminiProvider implements AIProvider {
  private model
  private lang: string

  constructor(apiKey: string, lang: string = 'zh-TW') {
    const genAI = new GoogleGenerativeAI(apiKey)
    this.model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
    this.lang = lang
  }

  async assessReadability(pageData: PageData): Promise<AiReadabilityResponse> {
    const prompt = this.buildReadabilityPrompt(pageData)

    try {
      const result = await this.model.generateContent(prompt)
      const text = result.response.text()
      return this.parseReadabilityResponse(text)
    } catch {
      return {
        summary: 'AI 可讀性評估無法完成，請稍後再試',
        strengths: [],
        weaknesses: [],
        competitivenessScore: 0,
        improvementPotential: '',
        peerComparison: '',
      }
    }
  }

  async simulateSearch(pageData: PageData): Promise<SearchSimulationResult> {
    const prompt = this.buildSearchSimulationPrompt(pageData)

    try {
      const result = await this.model.generateContent(prompt)
      const text = result.response.text()
      return this.parseSearchSimulationResponse(text)
    } catch {
      return {
        productType: '',
        queries: [],
        keywords: [],
        overallVerdict: 'AI 搜尋模擬無法完成，請稍後再試',
      }
    }
  }

  // ── Readability ─────────────────────────────────────────

  private buildReadabilityPrompt(pageData: PageData): string {
    const jsonLdStr = pageData.jsonLd ? JSON.stringify(pageData.jsonLd, null, 2) : '(none)'
    const ogStr = JSON.stringify(pageData.openGraph, null, 2)
    const metaStr = JSON.stringify(pageData.metaTags, null, 2)
    const isEn = this.lang === 'en'

    const langInstruction = isEn
      ? 'Respond in English'
      : '用繁體中文回答'

    const summaryHint = isEn
      ? 'A 50-100 word summary explaining what AI can understand from this data and what is missing'
      : '一段 50-100 字的摘要，說明 AI 從這些資料能理解什麼、缺少什麼'

    const improvementHint = isEn
      ? 'One sentence explaining estimated visibility improvement if weaknesses are fixed, e.g. "Adding reviews and brand info could improve visibility by 30-40%"'
      : '一句話說明如果改善弱點後，AI 可見度預估能提升多少，例如「補上評價與品牌資訊後，可見度預估提升 30-40%」'

    const peerHint = isEn
      ? 'One sentence about what similar product pages typically include that this page lacks, e.g. "Similar pages usually include user reviews, spec comparisons, and brand certifications"'
      : '一句話說明同類型商品頁面通常具備哪些你這個頁面缺少的元素，例如「同類商品頁面通常包含用戶評價、規格比較表與品牌認證標章」'

    return `You are an AI search engine analysis expert. Below is the structured data from an e-commerce product page.
Evaluate this product's readability and competitiveness from an AI search engine's perspective.

Product URL: ${pageData.url}

JSON-LD (schema.org):
${jsonLdStr}

Open Graph:
${ogStr}

Meta Tags:
${metaStr}

Respond in the following JSON format (pure JSON, no markdown code block):
{
  "summary": "${summaryHint}",
  "strengths": ["strength1", "strength2"],
  "weaknesses": ["weakness1", "weakness2"],
  "competitivenessScore": 7,
  "improvementPotential": "${improvementHint}",
  "peerComparison": "${peerHint}"
}

Instructions:
- ${langInstruction}
- List 1-3 items each for strengths and weaknesses
- summary should be specific, mentioning product category and brand if available
- competitivenessScore is 1-10, representing "likelihood of being cited when a user asks AI to recommend this type of product" (1=very unlikely, 10=very likely)
- improvementPotential should be specific with estimated percentage
- peerComparison should be specific with concrete examples`
  }

  private parseReadabilityResponse(text: string): AiReadabilityResponse {
    try {
      const cleaned = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim()
      const parsed = JSON.parse(cleaned)
      return {
        summary: String(parsed.summary || ''),
        strengths: Array.isArray(parsed.strengths) ? parsed.strengths.map(String) : [],
        weaknesses: Array.isArray(parsed.weaknesses) ? parsed.weaknesses.map(String) : [],
        competitivenessScore: Math.min(10, Math.max(0, Number(parsed.competitivenessScore) || 0)),
        improvementPotential: String(parsed.improvementPotential || ''),
        peerComparison: String(parsed.peerComparison || ''),
      }
    } catch {
      return {
        summary: text.slice(0, 200),
        strengths: [],
        weaknesses: [],
        competitivenessScore: 0,
        improvementPotential: '',
        peerComparison: '',
      }
    }
  }

  // ── Search Simulation ───────────────────────────────────

  private buildSearchSimulationPrompt(pageData: PageData): string {
    const jsonLdStr = pageData.jsonLd ? JSON.stringify(pageData.jsonLd, null, 2) : '(none)'
    const ogStr = JSON.stringify(pageData.openGraph, null, 2)
    const metaStr = JSON.stringify(pageData.metaTags, null, 2)
    const isEn = this.lang === 'en'

    const langInstruction = isEn
      ? 'Respond in English'
      : '用繁體中文回答'

    return `You are an AI search engine simulator. Below is the structured data from an e-commerce product page.

Simulate: If a user searches for this type of product on ChatGPT, Perplexity, or Gemini, would this product be recommended?

Product URL: ${pageData.url}

JSON-LD (schema.org):
${jsonLdStr}

Open Graph:
${ogStr}

Meta Tags:
${metaStr}

Respond in the following JSON format (pure JSON, no markdown code block):
{
  "productType": "The product type, e.g.: wireless earbuds, laptop, running shoes",
  "queries": [
    {
      "query": "A simulated user question to AI, e.g.: Recommend me wireless earbuds under $100",
      "wouldRecommend": true,
      "reason": "Why it would/wouldn't be recommended, one sentence",
      "missingFactors": ["If not recommended, list what's missing"]
    }
  ],
  "keywords": [
    {
      "keyword": "A search keyword related to this product",
      "visibility": "high/medium/low/none",
      "reason": "Why this keyword has this visibility level"
    }
  ],
  "overallVerdict": "One sentence summary of how this product performs in AI search overall"
}

Instructions:
- ${langInstruction}
- Generate 3 simulated search queries from different angles (e.g.: price-oriented, feature-oriented, comparison-oriented)
- List 4-5 relevant keywords
- Visibility levels: high=likely recommended, medium=possible, low=unlikely, none=almost impossible
- wouldRecommend should be based on the actual data provided, not brand awareness
- missingFactors only needed when wouldRecommend is false
- All judgments should be based on structured data quality, not the brand itself`
  }

  private parseSearchSimulationResponse(text: string): SearchSimulationResult {
    try {
      const cleaned = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim()
      const parsed = JSON.parse(cleaned)

      return {
        productType: String(parsed.productType || ''),
        queries: Array.isArray(parsed.queries)
          ? parsed.queries.map((q: Record<string, unknown>) => ({
              query: String(q.query || ''),
              wouldRecommend: Boolean(q.wouldRecommend),
              reason: String(q.reason || ''),
              missingFactors: Array.isArray(q.missingFactors) ? q.missingFactors.map(String) : [],
            }))
          : [],
        keywords: Array.isArray(parsed.keywords)
          ? parsed.keywords.map((k: Record<string, unknown>) => ({
              keyword: String(k.keyword || ''),
              visibility: ['high', 'medium', 'low', 'none'].includes(String(k.visibility))
                ? (String(k.visibility) as 'high' | 'medium' | 'low' | 'none')
                : 'none',
              reason: String(k.reason || ''),
            }))
          : [],
        overallVerdict: String(parsed.overallVerdict || ''),
      }
    } catch {
      return {
        productType: '',
        queries: [],
        keywords: [],
        overallVerdict: text.slice(0, 200),
      }
    }
  }
}
