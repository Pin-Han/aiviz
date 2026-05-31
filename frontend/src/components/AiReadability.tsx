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
      </div>

      <p className="text-sm text-text-muted leading-relaxed mb-4">{data.summary}</p>

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
    </div>
  )
}
