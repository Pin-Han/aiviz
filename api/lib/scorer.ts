import type { RuleCategory, RuleStatus, PageData } from '../../shared/types.js'
import { allRules } from '../rules/index.js'

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
}

export function runAllRules(pageData: PageData): ScoredRuleResult[] {
  return allRules.map((rule) => {
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
    }
  })
}
