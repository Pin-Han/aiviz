export const SCORE_MAX_ACCESSIBILITY = 30
export const SCORE_MAX_BASIC = 80
export const SCORE_MAX_ADVANCED = 20
export const SCORE_MAX_TOTAL = SCORE_MAX_ACCESSIBILITY + SCORE_MAX_BASIC + SCORE_MAX_ADVANCED

export const RATE_LIMIT_PER_IP = 3
export const RATE_LIMIT_GLOBAL = 500

export const CRAWL_TIMEOUT_MS = 10_000
export const REQUEST_TIMEOUT_MS = 30_000

export const CATEGORY_LABELS: Record<string, string> = {
  accessibility: 'AI 爬蟲可及性',
  basic: '基本項目',
  advanced: '進階優化',
}

export const STATUS_LABELS: Record<string, string> = {
  pass: '通過',
  warn: '警告',
  fail: '未通過',
}
