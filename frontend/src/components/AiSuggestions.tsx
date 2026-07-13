import { useState } from 'react'
import type { AnalysisResponse, AiReadability } from '@aiviz/shared/types.js'
import { useI18n } from '../i18n'

interface AiSuggestionsProps {
  rules: AnalysisResponse['rules']
  aiReadability: AiReadability
}

const SCHEMA_DEPENDENT_IDS = ['name-description', 'price-currency', 'image-quality', 'aggregate-rating', 'brand-info']

export function AiSuggestions({ rules, aiReadability }: AiSuggestionsProps) {
  const { t } = useI18n()
  const fixable = rules
    .filter((r) => r.fix && r.status !== 'pass' && !r.collapsed)
    .sort((a, b) => (b.maxScore - b.score) - (a.maxScore - a.score))

  const schemaFailing = fixable.some((r) => r.id === 'product-schema')
  const dependentItems = schemaFailing ? rules.filter((r) => SCHEMA_DEPENDENT_IDS.includes(r.id) && r.status !== 'pass') : []
  const independentFixes = schemaFailing ? fixable.filter((r) => !SCHEMA_DEPENDENT_IDS.includes(r.id)) : fixable
  const dependentPts = dependentItems.reduce((sum, r) => sum + (r.maxScore - r.score), 0)

  const hasAi = !('unavailable' in aiReadability)
  const hasAnySuggestion = fixable.length > 0 || hasAi

  if (!hasAnySuggestion) {
    return (
      <div className="glass-card p-6 text-center animate-fade-in-up stagger-3" style={{ borderColor: 'rgba(52, 211, 153, 0.2)' }}>
        <div className="w-10 h-10 rounded-full bg-pass/10 flex items-center justify-center mx-auto mb-3">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-pass)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <p className="text-pass font-medium text-sm">{t('suggestions.allPass')}</p>
      </div>
    )
  }

  return (
    <div className="glass-card p-6 animate-fade-in-up stagger-3">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-5 h-5 rounded-md bg-accent/10 flex items-center justify-center">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2.5">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
          </svg>
        </div>
        <h2 className="text-sm font-semibold text-text-primary">{t('suggestions.title')}</h2>
        <span className="text-xs font-mono text-text-dim tracking-wider bg-surface-2 px-1.5 py-0.5 rounded">{t('suggestions.tag')}</span>
      </div>

      {/* AI Readability Summary */}
      {hasAi && (
        <div className="mb-5 p-4 rounded-xl bg-surface-2/30 border border-border/30">
          <p className="text-sm text-text-muted leading-relaxed">
            {(aiReadability as Exclude<AiReadability, { unavailable: true }>).summary}
          </p>

          {/* Competitiveness */}
          {(aiReadability as Exclude<AiReadability, { unavailable: true }>).competitivenessScore > 0 && (
            <div className="mt-3 flex items-center gap-3">
              <span className="text-xs font-mono text-text-dim tracking-wider">{t('aiReadability.citation')}</span>
              <div className="flex-1 h-1.5 bg-surface rounded-full overflow-hidden max-w-[120px]">
                <div
                  className={`h-full rounded-full ${
                    (aiReadability as Exclude<AiReadability, { unavailable: true }>).competitivenessScore >= 7 ? 'bg-pass' :
                    (aiReadability as Exclude<AiReadability, { unavailable: true }>).competitivenessScore >= 4 ? 'bg-warn' : 'bg-fail'
                  }`}
                  style={{ width: `${(aiReadability as Exclude<AiReadability, { unavailable: true }>).competitivenessScore * 10}%` }}
                />
              </div>
              <span className="text-xs font-mono text-accent">
                {(aiReadability as Exclude<AiReadability, { unavailable: true }>).competitivenessScore}/10
              </span>
            </div>
          )}
        </div>
      )}

      {/* Fix list */}
      {independentFixes.length > 0 && (
        <div className="space-y-2.5">
          <p className="text-xs text-text-dim font-mono tracking-wider">{t('suggestions.priorityFixes')}</p>
          {independentFixes.map((r, i) => (
            <FixRow key={r.id} rule={r} index={i + 1} />
          ))}
        </div>
      )}

      {/* Collapsed schema-dependent items */}
      {dependentItems.length > 0 && (
        <div className="mt-3">
          <CollapsedSchemaGroup items={dependentItems} totalPts={dependentPts} />
        </div>
      )}

      {/* Improvement potential & Peer comparison */}
      {hasAi && (
        <div className="mt-4 pt-4 border-t border-border/30 space-y-2">
          {(aiReadability as Exclude<AiReadability, { unavailable: true }>).improvementPotential && (
            <div className="flex items-start gap-2 text-sm text-text-muted">
              <span className="text-accent flex-shrink-0 mt-px">\u2197</span>
              <span>{(aiReadability as Exclude<AiReadability, { unavailable: true }>).improvementPotential}</span>
            </div>
          )}
          {(aiReadability as Exclude<AiReadability, { unavailable: true }>).peerComparison && (
            <div className="flex items-start gap-2 text-sm text-text-muted">
              <span className="text-text-dim flex-shrink-0 mt-px">\u2261</span>
              <span>{(aiReadability as Exclude<AiReadability, { unavailable: true }>).peerComparison}</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function FixRow({ rule, index }: { rule: AnalysisResponse['rules'][0]; index: number }) {
  const { t } = useI18n()
  const [showCode, setShowCode] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (!rule.code) return
    await navigator.clipboard.writeText(rule.code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="rounded-xl bg-surface-2/20 border border-border/30 p-3.5">
      <div className="flex gap-3">
        <span className="flex-shrink-0 w-5 h-5 rounded-lg bg-accent/10 text-accent flex items-center justify-center text-xs font-mono font-bold mt-0.5">
          {index}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <p className="text-sm text-text-primary font-medium">{rule.name}</p>
            <span className="text-xs font-mono text-accent/60">{t('suggestions.ptsPotential', { pts: rule.maxScore - rule.score })}</span>
          </div>
          <p className="text-sm text-text-muted mt-1 leading-relaxed">{rule.fix}</p>

          {rule.code && (
            <div className="mt-2">
              <button
                onClick={() => setShowCode(!showCode)}
                className="text-xs font-mono text-accent/70 hover:text-accent transition-colors"
              >
                {showCode ? t('suggestions.hideCode') : t('suggestions.showCode')}
              </button>
              {showCode && (
                <div className="relative mt-2 group">
                  <pre className="bg-surface-2 border border-border rounded-lg p-3 text-sm font-mono text-text-primary overflow-x-auto leading-relaxed">
                    <code>{rule.code}</code>
                  </pre>
                  <button
                    onClick={handleCopy}
                    className="absolute top-1.5 right-1.5 px-2 py-0.5 rounded text-xs font-mono tracking-wider bg-surface-2 border border-border text-text-dim hover:text-text-primary opacity-0 group-hover:opacity-100 transition-all"
                  >
                    {copied ? t('rules.copied') : t('rules.copy')}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function CollapsedSchemaGroup({ items, totalPts }: { items: AnalysisResponse['rules']; totalPts: number }) {
  const { t } = useI18n()
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="rounded-xl bg-fail/5 border border-fail/10 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex gap-3 p-3.5 text-left hover:bg-fail/5 transition-colors"
      >
        <span className="flex-shrink-0 w-5 h-5 rounded-lg bg-fail/10 text-fail flex items-center justify-center text-xs font-mono font-bold mt-0.5">
          !
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-text-primary font-medium">
            {t('suggestions.schemaUnlock', { count: items.length })}
          </p>
          <p className="text-sm text-text-muted mt-0.5">{items.map((r) => r.name).join(', ')}</p>
          <p className="text-xs font-mono text-accent/60 mt-1">{t('suggestions.ptsPotential', { pts: totalPts })}</p>
        </div>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          className={`text-text-dim mt-1 flex-shrink-0 transition-transform ${expanded ? 'rotate-180' : ''}`}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {expanded && (
        <div className="px-3.5 pb-3 space-y-1 border-t border-fail/10">
          {items.map((r) => (
            <div key={r.id} className="flex items-center justify-between py-1.5 text-xs text-text-dim">
              <span>{r.name}</span>
              <span className="font-mono">+{r.maxScore - r.score}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
