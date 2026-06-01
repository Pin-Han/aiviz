import type { AiSearchSimulation } from '@aiviz/shared/types.js'

interface SearchSimulationProps {
  data: AiSearchSimulation
}

const VISIBILITY_CONFIG = {
  high:   { label: '高', color: 'text-pass', bg: 'bg-pass/10', bar: 'bg-pass', width: '100%' },
  medium: { label: '中', color: 'text-warn', bg: 'bg-warn/10', bar: 'bg-warn', width: '60%' },
  low:    { label: '低', color: 'text-fail', bg: 'bg-fail/10', bar: 'bg-fail', width: '30%' },
  none:   { label: '無', color: 'text-fail', bg: 'bg-fail/10', bar: 'bg-fail', width: '5%' },
}

export function SearchSimulation({ data }: SearchSimulationProps) {
  if ('unavailable' in data) return null

  return (
    <div className="space-y-5 animate-fade-in-up stagger-2">
      {/* Search Queries Simulation */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-5 h-5 rounded-md bg-accent/10 flex items-center justify-center">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
          </div>
          <h3 className="text-sm font-semibold text-text-primary">AI 搜尋模擬</h3>
          <span className="text-[9px] font-mono text-text-dim tracking-wider bg-surface-2 px-1.5 py-0.5 rounded ml-1">SIMULATED</span>
        </div>
        <p className="text-xs text-text-dim mb-4 ml-7">
          根據頁面結構化資料品質，模擬你的商品在 AI 搜尋中被推薦的可能性
        </p>
        <div className="ml-7 mb-5 p-2.5 rounded-lg bg-surface-2/30 border border-border/30">
          <p className="text-[10px] text-text-dim leading-relaxed">
            以下為基於結構化資料的模擬分析，非即時搜尋結果。實際排名受品牌知名度、用戶行為、AI 演算法等多重因素影響。
          </p>
        </div>

        <div className="space-y-3">
          {data.queries.map((q, i) => (
            <div key={i} className="rounded-xl bg-surface-2/30 border border-border/50 p-4">
              <div className="flex items-start gap-3">
                <div className={`
                  w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5
                  ${q.wouldRecommend ? 'bg-pass/10' : 'bg-fail/10'}
                `}>
                  {q.wouldRecommend ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-pass)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-fail)" strokeWidth="2.5">
                      <line x1="18" y1="6" x2="6" y2="18"/>
                      <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-text-primary font-medium leading-relaxed">
                    &ldquo;{q.query}&rdquo;
                  </p>
                  <p className={`text-xs mt-1.5 ${q.wouldRecommend ? 'text-pass' : 'text-fail'}`}>
                    {q.wouldRecommend ? '可能被推薦' : '不太可能被推薦'}
                  </p>
                  <p className="text-xs text-text-muted mt-1 leading-relaxed">{q.reason}</p>
                  {!q.wouldRecommend && q.missingFactors.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {q.missingFactors.map((f, j) => (
                        <span key={j} className="text-[10px] px-2 py-0.5 rounded-md bg-fail/5 border border-fail/10 text-fail/80">
                          {f}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {data.overallVerdict && (
          <div className="mt-4 p-3 rounded-lg bg-accent/5 border border-accent/10">
            <p className="text-xs text-accent/80 leading-relaxed">{data.overallVerdict}</p>
          </div>
        )}
      </div>

      {/* Keyword Visibility */}
      {data.keywords.length > 0 && (
        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-5 h-5 rounded-md bg-accent/10 flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2.5">
                <line x1="4" y1="9" x2="20" y2="9"/>
                <line x1="4" y1="15" x2="20" y2="15"/>
                <line x1="10" y1="3" x2="8" y2="21"/>
                <line x1="16" y1="3" x2="14" y2="21"/>
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-text-primary">關鍵字可見度</h3>
          </div>

          <div className="space-y-3">
            {data.keywords.map((k, i) => {
              const config = VISIBILITY_CONFIG[k.visibility]
              return (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm text-text-primary">{k.keyword}</span>
                    <span className={`text-xs font-mono ${config.color}`}>{config.label}</span>
                  </div>
                  <div className="h-1.5 bg-surface-2 rounded-full overflow-hidden mb-1">
                    <div
                      className={`h-full rounded-full ${config.bar} transition-all duration-700`}
                      style={{ width: config.width }}
                    />
                  </div>
                  <p className="text-[10px] text-text-dim leading-relaxed">{k.reason}</p>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
