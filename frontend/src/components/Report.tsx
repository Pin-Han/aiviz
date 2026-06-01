import type { AnalysisResponse } from '@aiviz/shared/types.js'
import { SCORE_MAX_TOTAL } from '@aiviz/shared/constants.js'
import { ScoreCard } from './ScoreCard'
import { RadarChart } from './RadarChart'
import { NarrativeReport } from './NarrativeReport'
import { AiSuggestions } from './AiSuggestions'
import { SearchSimulation } from './SearchSimulation'
import { ShareButton } from './ShareButton'

interface ReportProps {
  data: AnalysisResponse
  onReset: () => void
}

function getVerdict(pct: number): { emoji: string; text: string; sub: string; color: string; border: string } {
  if (pct >= 80) return {
    emoji: '\u{1F7E2}',
    text: '你的商品在 AI 搜尋中表現優異',
    sub: 'AI 搜尋引擎能充分理解並可能推薦你的商品',
    color: 'text-pass',
    border: 'rgba(52, 211, 153, 0.2)',
  }
  if (pct >= 60) return {
    emoji: '\u{1F7E1}',
    text: 'AI 可以找到你的商品，但還有提升空間',
    sub: '修復以下問題後，被 AI 推薦的機率將顯著提升',
    color: 'text-warn',
    border: 'rgba(251, 191, 36, 0.2)',
  }
  if (pct >= 30) return {
    emoji: '\u{1F7E0}',
    text: 'AI 搜尋引擎可能不會推薦你的商品',
    sub: '你的商品資訊不足以讓 AI 搜尋引擎信任並推薦',
    color: 'text-warn',
    border: 'rgba(251, 191, 36, 0.2)',
  }
  return {
    emoji: '\u{1F534}',
    text: '這個頁面對 AI 搜尋引擎幾乎隱形',
    sub: 'AI 爬蟲無法取得有意義的商品資訊，急需優化',
    color: 'text-fail',
    border: 'rgba(248, 113, 113, 0.2)',
  }
}

export function Report({ data, onReset }: ReportProps) {
  const pct = Math.round((data.score.total / SCORE_MAX_TOTAL) * 100)
  const verdict = getVerdict(pct)

  const jsRule = data.rules.find((r) => r.id === 'js-rendering')
  const isDynamicRender = jsRule && jsRule.status === 'fail'

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between animate-fade-in-up">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-accent tracking-[0.15em]">REPORT</span>
              <span className="w-1 h-1 rounded-full bg-text-dim" />
              <span className="text-xs font-mono text-text-dim">
                {new Date(data.analyzedAt).toLocaleString('zh-TW')}
              </span>
            </div>
            <p className="text-sm text-text-muted truncate max-w-lg">{data.url}</p>
          </div>
          <div className="flex gap-2 flex-shrink-0 ml-4">
            <ShareButton data={data} />
            <button
              onClick={onReset}
              className="
                flex items-center gap-2 px-4 py-2.5
                bg-accent text-bg rounded-xl text-xs font-mono font-semibold tracking-wider
                hover:bg-accent/90 active:scale-[0.97]
                transition-all duration-200
              "
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="23 4 23 10 17 10"/>
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
              </svg>
              RESCAN
            </button>
          </div>
        </div>

        {/* Verdict hook */}
        <div className="glass-card p-5 animate-fade-in-up" style={{ borderColor: verdict.border }}>
          <div className="flex items-start gap-4">
            <span className="text-2xl flex-shrink-0">{verdict.emoji}</span>
            <div>
              <p className={`text-base font-semibold ${verdict.color}`}>{verdict.text}</p>
              <p className="text-sm text-text-muted mt-1">{verdict.sub}</p>
            </div>
          </div>
        </div>

        {/* Page type warning */}
        {data.pageTypeMessage && (
          <PageTypeWarning message={data.pageTypeMessage} pageType={data.pageType} url={data.url} />
        )}

        {/* Dynamic rendering warning */}
        {isDynamicRender && !data.pageTypeMessage && (
          <DynamicRenderWarning url={data.url} />
        )}

        {/* Score overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <ScoreCard
            total={data.score.total}
            accessibility={data.score.accessibility}
            basic={data.score.basic}
            advanced={data.score.advanced}
          />
          <RadarChart
            accessibility={data.score.accessibility}
            basic={data.score.basic}
            advanced={data.score.advanced}
          />
        </div>

        {/* 3-Layer Narrative */}
        <NarrativeReport data={data} />

        {/* AI Search Simulation */}
        <SearchSimulation data={data.searchSimulation} />

        {/* AI Suggestions */}
        <AiSuggestions rules={data.rules} aiReadability={data.aiReadability} />

        {/* Footer */}
        <div className="text-center pt-4 pb-8">
          <p className="text-[10px] font-mono text-text-dim tracking-[0.15em]">
            CRAWL {data.meta.crawlTimeMs}ms &middot; AI {data.meta.aiCallTimeMs}ms &middot; AIViz v1.0
          </p>
        </div>
      </div>
    </div>
  )
}

function PageTypeWarning({ message, pageType, url }: { message: string; pageType: string; url: string }) {
  let domain = ''
  try { domain = new URL(url).hostname } catch { /* */ }

  return (
    <div className="glass-card p-5 animate-fade-in-up" style={{ borderColor: 'rgba(251, 191, 36, 0.2)' }}>
      <div className="flex items-start gap-3">
        <div className="w-6 h-6 rounded-lg bg-warn/10 flex items-center justify-center flex-shrink-0 mt-0.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-warn)" strokeWidth="2.5">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </div>
        <div>
          <p className="text-sm text-text-muted leading-relaxed">{message}</p>
          {pageType === 'homepage' && domain && (
            <div className="mt-3 p-3 rounded-lg bg-surface-2/50">
              <p className="text-xs text-text-dim mb-1.5 font-mono tracking-wider">TRY A PRODUCT URL</p>
              <p className="text-xs text-text-muted">
                {domain}/products/商品名稱 or {domain}/shop/商品名稱
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function DynamicRenderWarning({ url }: { url: string }) {
  let domain = ''
  try { domain = new URL(url).hostname } catch { /* */ }
  const isMarketplace = ['shopee', 'momo', 'pchome', 'ruten'].some((p) => domain.includes(p))

  return (
    <div className="glass-card p-5 animate-fade-in-up" style={{ borderColor: 'rgba(248, 113, 113, 0.15)' }}>
      <div className="flex items-start gap-3">
        <div className="w-6 h-6 rounded-lg bg-fail/10 flex items-center justify-center flex-shrink-0 mt-0.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-fail)" strokeWidth="2.5">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
            <line x1="8" y1="21" x2="16" y2="21"/>
            <line x1="12" y1="17" x2="12" y2="21"/>
          </svg>
        </div>
        <div>
          <p className="text-sm text-fail font-medium mb-1">此頁面使用動態渲染（JavaScript SPA）</p>
          <p className="text-sm text-text-muted leading-relaxed">
            AI 爬蟲（GPTBot、PerplexityBot）可能無法讀取你的商品資訊。
          </p>
          {isMarketplace ? (
            <div className="mt-3 p-3 rounded-lg bg-surface-2/50 space-y-2">
              <p className="text-xs text-text-muted">平台商品頁面由平台控制渲染方式，建議考慮建立獨立商品網站。</p>
              <p className="text-[10px] font-mono text-accent/60 tracking-wider">
                COMING SOON: AI 品牌監測
              </p>
            </div>
          ) : (
            <div className="mt-3 p-3 rounded-lg bg-surface-2/50 space-y-1.5">
              <p className="text-xs text-text-dim font-mono tracking-wider mb-1">RECOMMENDED</p>
              <p className="text-xs text-text-muted">1. 採用 SSR 確保 AI 爬蟲能讀取內容</p>
              <p className="text-xs text-text-muted">2. 在 HTML 中內嵌 JSON-LD，不依賴 JS 動態插入</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
