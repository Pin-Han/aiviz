interface FixSuggestionsProps {
  rules: Array<{
    id: string
    name: string
    status: string
    fix: string | null
    maxScore: number
    score: number
  }>
}

export function FixSuggestions({ rules }: FixSuggestionsProps) {
  const fixable = rules
    .filter((r) => r.fix && r.status !== 'pass')
    .sort((a, b) => (b.maxScore - b.score) - (a.maxScore - a.score))

  if (fixable.length === 0) {
    return (
      <div className="glass-card p-6 text-center animate-fade-in-up stagger-2" style={{ borderColor: 'rgba(52, 211, 153, 0.2)' }}>
        <div className="w-10 h-10 rounded-full bg-pass/10 flex items-center justify-center mx-auto mb-3">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-pass)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <p className="text-pass font-medium text-sm">所有項目都通過了</p>
        <p className="text-xs text-text-dim mt-1 font-mono tracking-wider">ALL CHECKS PASSED</p>
      </div>
    )
  }

  return (
    <div className="glass-card p-6 animate-fade-in-up stagger-2">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-sm font-semibold text-text-primary">優先修復建議</h3>
        <span className="text-[10px] font-mono text-text-dim tracking-[0.15em] bg-surface-2 px-2 py-0.5 rounded">BY IMPACT</span>
      </div>
      <div className="space-y-3">
        {fixable.map((r, i) => (
          <div key={r.id} className="flex gap-3">
            <span className="
              flex-shrink-0 w-6 h-6 rounded-lg bg-accent/10 text-accent
              flex items-center justify-center text-xs font-mono font-bold
            ">
              {i + 1}
            </span>
            <div className="min-w-0">
              <p className="text-sm text-text-primary font-medium">{r.name}</p>
              <p className="text-xs text-text-muted mt-0.5 leading-relaxed">{r.fix}</p>
              <p className="text-[10px] text-text-dim font-mono mt-1">
                +{r.maxScore - r.score} pts potential
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
