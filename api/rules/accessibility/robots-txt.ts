import type { Rule } from '../../../shared/types.js'

export const robotsTxtRule: Rule = {
  id: 'robots-txt-ai',
  name: 'AI 爬蟲存取權限',
  description: '檢查 robots.txt 是否封鎖 AI 搜尋引擎爬蟲',
  category: 'accessibility',
  maxScore: 10,

  check() {
    // Placeholder — overridden by analyze.ts after async robots.txt fetch
    return {
      score: 10,
      status: 'pass',
      message: '未偵測到 robots.txt 或未封鎖 AI 爬蟲',
    }
  },
}

export const AI_BOTS = ['GPTBot', 'Google-Extended', 'CCBot', 'anthropic-ai', 'PerplexityBot', 'Bytespider']

export function parseRobotsTxt(text: string): { blocked: string[]; blanketBlock: boolean } {
  // Split into sections by User-agent
  const sections = text.split(/(?=User-agent:)/i)

  const blocked: string[] = []

  for (const section of sections) {
    const agentMatch = section.match(/User-agent:\s*(.+)/i)
    if (!agentMatch) continue

    const agent = agentMatch[1].trim()
    const hasDisallowAll = /Disallow:\s*\/\s*$/m.test(section)

    if (!hasDisallowAll) continue

    // Check if this is a blanket block
    if (agent === '*') {
      // Blanket block — but only counts if no specific Allow overrides
      return { blocked: AI_BOTS, blanketBlock: true }
    }

    // Check if this agent matches any AI bot
    const matchedBot = AI_BOTS.find((bot) => agent.toLowerCase() === bot.toLowerCase())
    if (matchedBot && !blocked.includes(matchedBot)) {
      blocked.push(matchedBot)
    }
  }

  return { blocked, blanketBlock: false }
}
