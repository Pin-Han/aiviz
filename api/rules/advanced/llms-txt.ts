import type { Rule } from '../../../shared/types.js'

export const llmsTxtRule: Rule = {
  id: 'llms-txt',
  name: 'llms.txt 檔案',
  description: '檢查網站根目錄是否有 llms.txt（新興 AI 爬蟲標準）',
  category: 'advanced',
  maxScore: 10,

  check() {
    // This rule returns a default "fail" result.
    // The analyze.ts endpoint does an async fetch to {origin}/llms.txt
    // and overrides this result if the file exists.
    return {
      score: 0,
      status: 'fail',
      message: '未偵測到 llms.txt，這是一個新興的 AI 爬蟲標準',
      fix: '在網站根目錄建立 llms.txt 檔案，描述你的網站內容供 AI 爬蟲使用',
      code: `# llms.txt - AI Crawler Guide\n# See https://llmstxt.org for details\n\n# Site: Your Store Name\n# Description: Brief description of your store\n\n## Products\n- /products/ - Browse all products`,
    }
  },
}
