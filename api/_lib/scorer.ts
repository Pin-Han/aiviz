import type { RuleCategory, RuleStatus, PageData } from '../../shared/types.js'
import { allRules } from '../_rules/index.js'

export interface ScoredRuleResult {
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
}

const SCHEMA_DEPENDENT_IDS = [
  'name-description',
  'price-currency',
  'image-quality',
  'aggregate-rating',
  'brand-info',
]

export function runAllRules(pageData: PageData): ScoredRuleResult[] {
  const results = allRules.map((rule) => {
    const result = rule.check(pageData)
    return {
      id: rule.id,
      name: rule.name,
      category: rule.category,
      score: result.score,
      maxScore: rule.maxScore,
      status: result.status,
      message: result.message,
      fix: result.fix ?? null,
      code: result.code ?? null,
      collapsed: false,
    }
  })

  // If product-schema failed, collapse dependent basic rules
  const schemaRule = results.find((r) => r.id === 'product-schema')
  if (schemaRule && schemaRule.status === 'fail') {
    results.forEach((r) => {
      if (SCHEMA_DEPENDENT_IDS.includes(r.id)) {
        r.collapsed = true
      }
    })
  }

  return results
}
