import { GoogleGenerativeAI } from '@google/generative-ai'
import type { PageData, AiReadabilityResponse, SearchSimulationResult } from '../../shared/types.js'
import type { AIProvider } from './ai-provider.js'

export class GeminiProvider implements AIProvider {
  private model

  constructor(apiKey: string) {
    const genAI = new GoogleGenerativeAI(apiKey)
    this.model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
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

    return `你是一個 AI 搜尋引擎的分析專家。以下是一個電商商品頁面的結構化資料。
請從 AI 搜尋引擎的角度評估這個商品的可讀性與競爭力。

商品頁 URL: ${pageData.url}

JSON-LD (schema.org):
${jsonLdStr}

Open Graph:
${ogStr}

Meta Tags:
${metaStr}

請用以下 JSON 格式回答（純 JSON，不要 markdown code block）：
{
  "summary": "一段 50-100 字的繁體中文摘要，說明 AI 從這些資料能理解什麼、缺少什麼",
  "strengths": ["優勢1", "優勢2"],
  "weaknesses": ["不足1", "不足2"],
  "competitivenessScore": 7,
  "improvementPotential": "一句話說明如果改善弱點後，AI 可見度預估能提升多少",
  "peerComparison": "一句話說明同類型商品頁面通常具備哪些你這個頁面缺少的元素"
}

注意：
- 用繁體中文回答
- strengths 和 weaknesses 各列 1-3 項
- summary 要具體，提到商品類別和品牌（如果有的話）
- competitivenessScore 是 1-10 分，代表「如果用戶問 AI 推薦此類商品，此頁面被引用的機率」，1=幾乎不可能，10=非常有可能
- improvementPotential 要具體，例如「補上評價與品牌資訊後，可見度預估提升 30-40%」
- peerComparison 要具體，例如「同類商品頁面通常包含用戶評價、規格比較表與品牌認證標章」`
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

    return `你是一個 AI 搜尋引擎模擬器。以下是一個電商商品頁面的結構化資料。

請模擬：如果用戶在 ChatGPT、Perplexity、Gemini 等 AI 搜尋引擎中搜尋此類商品，這個商品會不會被推薦？

商品頁 URL: ${pageData.url}

JSON-LD (schema.org):
${jsonLdStr}

Open Graph:
${ogStr}

Meta Tags:
${metaStr}

請用以下 JSON 格式回答（純 JSON，不要 markdown code block）：
{
  "productType": "此商品的類型，例如：無線耳機、筆記型電腦、運動鞋",
  "queries": [
    {
      "query": "模擬用戶會問 AI 的問題，例如：推薦我一款 3000 元以內的無線耳機",
      "wouldRecommend": true,
      "reason": "為什麼會/不會推薦，一句話",
      "missingFactors": ["如果不推薦，列出缺少什麼才導致不被推薦"]
    }
  ],
  "keywords": [
    {
      "keyword": "與此商品相關的搜尋關鍵字",
      "visibility": "high/medium/low/none",
      "reason": "為什麼此關鍵字的可見度是這個等級"
    }
  ],
  "overallVerdict": "一句話總結：這個商品在 AI 搜尋中的整體表現如何"
}

注意：
- 用繁體中文回答
- queries 請產生 3 個不同角度的模擬搜尋問題（例如：價格導向、功能導向、比較導向）
- keywords 請列出 4-5 個相關關鍵字
- visibility 等級定義：high=很可能被推薦, medium=有機會, low=不太可能, none=幾乎不可能
- wouldRecommend 要根據頁面實際提供的資料判斷，不是根據品牌知名度
- missingFactors 只在 wouldRecommend 為 false 時需要填寫
- 所有判斷都基於頁面提供的結構化資料品質，不是品牌本身的知名度`
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
