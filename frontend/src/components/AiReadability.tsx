import type { AiReadability as AiReadabilityType } from '@aiviz/shared/types.js'

interface AiReadabilityProps {
  data: AiReadabilityType
}

export function AiReadability({ data }: AiReadabilityProps) {
  if ('unavailable' in data) {
    return (
      <div className="glass-card p-6 text-center animate-fade-in-up stagger-4">
        <p className="text-xs font-mono text-text-dim tracking-[0.15em]">AI READABILITY UNAVAILABLE</p>
      </div>
    )
  }

  return (
    <div className="glass-card p-6 animate-fade-in-up stagger-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-5 h-5 rounded-md bg-accent/10 flex items-center justify-center">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2.5">
            <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z"/>
            <path d="M12 16v-4"/>
            <path d="M12 8h.01"/>
          </svg>
        </div>
        <h3 className="text-sm font-semibold text-text-primary">AI 可讀性評估</h3>
        <span className="text-[9px] font-mono text-text-dim tracking-wider bg-surface-2 px-1.5 py-0.5 rounded ml-1">AI ANALYSIS</span>
      </div>

      <p className="text-sm text-text-muted leading-relaxed mb-4">{data.summary}</p>

      {/* Competitiveness gauge */}
      {data.competitivenessScore > 0 && (
        <div className="mb-4 p-4 rounded-xl bg-surface-2/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono text-text-dim tracking-[0.15em]">AI CITATION LIKELIHOOD</span>
            <span className="text-sm font-mono font-bold text-accent">{data.competitivenessScore}/10</span>
          </div>
          <div className="h-2 bg-surface rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out ${
                data.competitivenessScore >= 7 ? 'bg-pass' :
                data.competitivenessScore >= 4 ? 'bg-warn' : 'bg-fail'
              }`}
              style={{ width: `${data.competitivenessScore * 10}%` }}
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {data.strengths.length > 0 && (
          <div className="rounded-xl bg-pass/5 border border-pass/10 p-4">
            <p className="text-[10px] font-mono text-pass tracking-[0.15em] mb-2">STRENGTHS</p>
            <ul className="space-y-1.5">
              {data.strengths.map((s, i) => (
                <li key={i} className="text-xs text-text-muted flex items-start gap-2">
                  <span className="text-pass mt-px">+</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {data.weaknesses.length > 0 && (
          <div className="rounded-xl bg-fail/5 border border-fail/10 p-4">
            <p className="text-[10px] font-mono text-fail tracking-[0.15em] mb-2">WEAKNESSES</p>
            <ul className="space-y-1.5">
              {data.weaknesses.map((w, i) => (
                <li key={i} className="text-xs text-text-muted flex items-start gap-2">
                  <span className="text-fail mt-px">-</span>
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Improvement potential & Peer comparison */}
      {(data.improvementPotential || data.peerComparison) && (
        <div className="mt-4 space-y-2">
          {data.improvementPotential && (
            <div className="flex items-start gap-2 text-sm text-text-muted">
              <span className="text-accent flex-shrink-0 mt-0.5">&#x2197;</span>
              <span>{data.improvementPotential}</span>
            </div>
          )}
          {data.peerComparison && (
            <div className="flex items-start gap-2 text-sm text-text-muted">
              <span className="text-text-dim flex-shrink-0 mt-0.5">&#x2261;</span>
              <span>{data.peerComparison}</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
