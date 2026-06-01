import { useState } from 'react'

interface FixRule {
  id: string
  name: string
  status: string
  fix: string | null
  maxScore: number
  score: number
  collapsed: boolean
}

interface FixSuggestionsProps {
  rules: FixRule[]
}

const SCHEMA_DEPENDENT_IDS = ['name-description', 'price-currency', 'image-quality', 'aggregate-rating', 'brand-info']

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

  // Group schema-dependent items if product-schema itself is failing
  const schemaFailing = fixable.some((r) => r.id === 'product-schema')
  const dependentItems = schemaFailing ? fixable.filter((r) => SCHEMA_DEPENDENT_IDS.includes(r.id)) : []
  const independentItems = schemaFailing
    ? fixable.filter((r) => !SCHEMA_DEPENDENT_IDS.includes(r.id))
    : fixable

  const dependentPts = dependentItems.reduce((sum, r) => sum + (r.maxScore - r.score), 0)

  return (
    <div className="glass-card p-6 animate-fade-in-up stagger-2">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-sm font-semibold text-text-primary">優先修復建議</h3>
        <span className="text-[10px] font-mono text-text-dim tracking-[0.15em] bg-surface-2 px-2 py-0.5 rounded">BY IMPACT</span>
      </div>
      <div className="space-y-3">
        {independentItems.map((r, i) => (
          <FixItem key={r.id} rule={r} index={i + 1} />
        ))}
        {dependentItems.length > 0 && (
          <CollapsedFixGroup items={dependentItems} totalPts={dependentPts} startIndex={independentItems.length + 1} />
        )}
      </div>
    </div>
  )
}

function FixItem({ rule, index }: { rule: FixRule; index: number }) {
  return (
    <div className="flex gap-3">
      <span className="flex-shrink-0 w-6 h-6 rounded-lg bg-accent/10 text-accent flex items-center justify-center text-xs font-mono font-bold">
        {index}
      </span>
      <div className="min-w-0">
        <p className="text-sm text-text-primary font-medium">{rule.name}</p>
        <p className="text-xs text-text-muted mt-0.5 leading-relaxed">{rule.fix}</p>
        <p className="text-[10px] text-text-dim font-mono mt-1">+{rule.maxScore - rule.score} pts potential</p>
      </div>
    </div>
  )
}

function CollapsedFixGroup({ items, totalPts, startIndex }: { items: FixRule[]; totalPts: number; startIndex: number }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="rounded-xl bg-surface-2/30 border border-border/50 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex gap-3 p-3 text-left hover:bg-surface-2/50 transition-colors"
      >
        <span className="flex-shrink-0 w-6 h-6 rounded-lg bg-fail/10 text-fail flex items-center justify-center text-xs font-mono font-bold">
          {startIndex}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-text-primary font-medium">
            加入 Product Schema 後可解鎖 {items.length} 項改善
          </p>
          <p className="text-xs text-text-muted mt-0.5">
            包含：{items.map((r) => r.name).join('、')}
          </p>
          <p className="text-[10px] text-text-dim font-mono mt-1">+{totalPts} pts potential</p>
        </div>
        <svg
          width="12" height="12" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2"
          className={`text-text-dim mt-2 flex-shrink-0 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {expanded && (
        <div className="px-3 pb-3 space-y-2 border-t border-border/30">
          {items.map((r, i) => (
            <div key={r.id} className="flex gap-3 pt-2">
              <span className="flex-shrink-0 w-5 h-5 rounded bg-surface-2 text-text-dim flex items-center justify-center text-[10px] font-mono">
                {startIndex}.{i + 1}
              </span>
              <div className="min-w-0">
                <p className="text-xs text-text-muted">{r.name}</p>
                <p className="text-[10px] text-text-dim font-mono">+{r.maxScore - r.score} pts</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
