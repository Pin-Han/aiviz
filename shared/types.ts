// ── Page Data (input to rules) ──────────────────────────

export interface PageData {
  url: string
  html: string
  jsonLd: JsonLdProduct | null
  openGraph: OpenGraphData
  metaTags: MetaTagData
  crawlTimeMs: number
}

export interface JsonLdProduct {
  '@type': string
  name?: string
  description?: string
  image?: string | string[]
  brand?: { '@type': string; name: string } | string
  offers?: {
    '@type': string
    price?: string | number
    priceCurrency?: string
    availability?: string
  }
  aggregateRating?: {
    '@type': string
    ratingValue?: string | number
    reviewCount?: string | number
    bestRating?: string | number
    worstRating?: string | number
  }
  [key: string]: unknown
}

export interface OpenGraphData {
  title?: string
  description?: string
  image?: string
  type?: string
  siteName?: string
}

export interface MetaTagData {
  title?: string
  description?: string
  robots?: string
}

// ── Rule System ─────────────────────────────────────────

export type RuleCategory = 'accessibility' | 'basic' | 'advanced'
export type RuleStatus = 'pass' | 'warn' | 'fail'

export interface Rule {
  id: string
  name: string
  description: string
  category: RuleCategory
  maxScore: number
  check(pageData: PageData): RuleResult
}

export interface RuleResult {
  score: number
  status: RuleStatus
  message: string
  fix?: string
  code?: string
}

// ── AI Provider ─────────────────────────────────────────

export interface ReadabilityResult {
  summary: string
  strengths: string[]
  weaknesses: string[]
}

export interface AiReadabilityResponse {
  summary: string
  strengths: string[]
  weaknesses: string[]
  competitivenessScore: number
  improvementPotential: string
  peerComparison: string
}

export type AiReadability = AiReadabilityResponse | { unavailable: true }

// ── AI Search Simulation ────────────────────────────────

export interface SearchSimulationQuery {
  query: string
  wouldRecommend: boolean
  reason: string
  missingFactors: string[]
}

export interface SearchSimulationResult {
  productType: string
  queries: SearchSimulationQuery[]
  keywords: KeywordVisibility[]
  overallVerdict: string
}

export interface KeywordVisibility {
  keyword: string
  visibility: 'high' | 'medium' | 'low' | 'none'
  reason: string
}

export type AiSearchSimulation = SearchSimulationResult | { unavailable: true }

// ── API Response ────────────────────────────────────────

export interface AnalysisResponse {
  url: string
  analyzedAt: string
  score: {
    total: number
    accessibility: number
    basic: number
    advanced: number
  }
  rules: Array<{
    id: string
    name: string
    category: RuleCategory
    score: number
    maxScore: number
    status: RuleStatus
    message: string
    fix: string | null
    code: string | null
    collapsed: boolean
  }>
  aiReadability: AiReadability
  searchSimulation: AiSearchSimulation
  pageType: 'product' | 'homepage' | 'other'
  pageTypeMessage?: string
  meta: {
    crawlTimeMs: number
    aiCallTimeMs: number
    remainingQuota: number
  }
}

// ── API Error ───────────────────────────────────────────

export interface ApiError {
  error: string
  code: number
}
