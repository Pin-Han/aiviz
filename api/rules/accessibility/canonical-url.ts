import * as cheerio from 'cheerio'
import type { Rule } from '../../../shared/types.js'

export const canonicalUrlRule: Rule = {
  id: 'canonical-url',
  name: 'Canonical URL',
  description: '檢查頁面是否有正確的 canonical URL，避免 AI 索引到錯誤版本',
  category: 'accessibility',
  maxScore: 5,

  check(pageData) {
    const $ = cheerio.load(pageData.html)
    const canonical = $('link[rel="canonical"]').attr('href')

    if (!canonical) {
      return {
        score: 0,
        status: 'fail',
        message: '缺少 canonical URL，AI 可能索引到重複版本的頁面',
        fix: '加入 <link rel="canonical"> 標籤指向此頁面的標準 URL',
        code: `<link rel="canonical" href="${pageData.url}">`,
      }
    }

    // Normalize URLs for comparison (remove trailing slash, protocol differences)
    const normalize = (u: string) => {
      try {
        const parsed = new URL(u)
        return parsed.origin + parsed.pathname.replace(/\/$/, '') + parsed.search
      } catch {
        return u
      }
    }

    if (normalize(canonical) === normalize(pageData.url)) {
      return {
        score: 5,
        status: 'pass',
        message: 'Canonical URL 正確指向當前頁面',
      }
    }

    return {
      score: 3,
      status: 'warn',
      message: `Canonical URL 指向不同頁面：${canonical}`,
      fix: '確認 canonical URL 是否正確。如果是刻意的重新導向可以忽略，否則請修正為當前頁面 URL',
    }
  },
}
