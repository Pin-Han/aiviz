import { useState } from 'react'
import type { AnalysisResponse, RuleStatus } from '@aiviz/shared/types.js'
import { SCORE_MAX_ACCESSIBILITY, SCORE_MAX_BASIC, SCORE_MAX_ADVANCED } from '@aiviz/shared/constants.js'
import { useI18n } from '../i18n'

interface NarrativeReportProps {
  data: AnalysisResponse
}

// ── Layer Status Helpers ────────────────────────────────

function getLayerStatus(score: number, max: number): { pct: number; status: 'good' | 'warn' | 'bad' } {
  const pct = max > 0 ? Math.round((score / max) * 100) : 0
  if (pct >= 70) return { pct, status: 'good' }
  if (pct >= 40) return { pct, status: 'warn' }
  return { pct, status: 'bad' }
}

const LAYER_COLORS = {
  good: { dot: 'bg-pass', text: 'text-pass', border: 'border-pass/20', bg: 'bg-pass/5' },
  warn: { dot: 'bg-warn', text: 'text-warn', border: 'border-warn/20', bg: 'bg-warn/5' },
  bad:  { dot: 'bg-fail', text: 'text-fail', border: 'border-fail/20', bg: 'bg-fail/5' },
}

// ── Status Icon ─────────────────────────────────────────

const STATUS_ICON: Record<RuleStatus, { icon: string; color: string; bg: string }> = {
  pass: { icon: '\u2713', color: 'text-pass', bg: 'bg-pass/10' },
  warn: { icon: '!', color: 'text-warn', bg: 'bg-warn/10' },
  fail: { icon: '\u2717', color: 'text-fail', bg: 'bg-fail/10' },
}

// ── Main Component ──────────────────────────────────────

export function NarrativeReport({ data }: NarrativeReportProps) {
  const { t } = useI18n()

  const accessRules = data.rules.filter((r) => r.category === 'accessibility')
  const basicRules = data.rules.filter((r) => r.category === 'basic')
  const advancedRules = data.rules.filter((r) => r.category === 'advanced')

  const accessStatus = getLayerStatus(data.score.accessibility, SCORE_MAX_ACCESSIBILITY)
  const basicStatus = getLayerStatus(data.score.basic, SCORE_MAX_BASIC)
  const advancedStatus = getLayerStatus(data.score.advanced, SCORE_MAX_ADVANCED)

  function getLayerConclusion(layerName: string, status: 'good' | 'warn' | 'bad', rules: AnalysisResponse['rules']): string {
    const failing = rules.filter((r) => r.status === 'fail' && !r.collapsed)
    const failNames = failing.map((r) => r.name).join(', ')

    const key = `narrative.${layerName}.${status}`
    return t(key, { issues: failNames })
  }

  return (
    <div className="space-y-4 animate-fade-in-up stagger-2">
      <div className="flex items-center gap-2 mb-1">
        <h2 className="text-sm font-semibold text-text-primary">{t('narrative.title')}</h2>
        <span className="text-xs font-mono text-text-dim tracking-wider bg-surface-2 px-1.5 py-0.5 rounded">{t('narrative.tag')}</span>
      </div>

      {/* Layer 1: Can AI crawlers access? */}
      <NarrativeLayer
        number={1}
        title={t('narrative.layer1.title')}
        subtitle={t('narrative.layer1.subtitle')}
        score={data.score.accessibility}
        maxScore={SCORE_MAX_ACCESSIBILITY}
        status={accessStatus.status}
        conclusion={getLayerConclusion('access', accessStatus.status, accessRules)}
        rules={accessRules}
      />

      {/* Layer 2: Can AI understand? */}
      <NarrativeLayer
        number={2}
        title={t('narrative.layer2.title')}
        subtitle={t('narrative.layer2.subtitle')}
        score={data.score.basic}
        maxScore={SCORE_MAX_BASIC}
        status={basicStatus.status}
        conclusion={getLayerConclusion('understand', basicStatus.status, basicRules)}
        rules={basicRules}
      />

      {/* Layer 3: Would AI recommend? */}
      <NarrativeLayer
        number={3}
        title={t('narrative.layer3.title')}
        subtitle={t('narrative.layer3.subtitle')}
        score={data.score.advanced}
        maxScore={SCORE_MAX_ADVANCED}
        status={advancedStatus.status}
        conclusion={getLayerConclusion('recommend', advancedStatus.status, advancedRules)}
        rules={advancedRules}
      />
    </div>
  )
}

// ── Narrative Layer ─────────────────────────────────────

function NarrativeLayer({
  number,
  title,
  subtitle,
  score,
  maxScore,
  status,
  conclusion,
  rules,
}: {
  number: number
  title: string
  subtitle: string
  score: number
  maxScore: number
  status: 'good' | 'warn' | 'bad'
  conclusion: string
  rules: AnalysisResponse['rules']
}) {
  const { t } = useI18n()
  const [expanded, setExpanded] = useState(false)
  const colors = LAYER_COLORS[status]
  const visibleRules = rules.filter((r) => !r.collapsed)
  const collapsedRules = rules.filter((r) => r.collapsed)

  return (
    <div className={`glass-card overflow-hidden border ${colors.border}`}>
      {/* Layer header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-5 text-left hover:bg-surface-2/30 transition-colors"
      >
        <div className="flex items-start gap-4">
          {/* Number circle */}
          <div className={`w-8 h-8 rounded-full ${colors.bg} border ${colors.border} flex items-center justify-center flex-shrink-0`}>
            <span className={`text-sm font-bold ${colors.text}`}>{number}</span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <h3 className="text-sm font-semibold text-text-primary">{title}</h3>
              <span className="text-xs font-mono text-text-dim tracking-wider">{subtitle}</span>
            </div>

            {/* Mini status bar */}
            <div className="flex items-center gap-3 mt-2">
              <div className="flex-1 h-1.5 bg-surface-2 rounded-full overflow-hidden max-w-[200px]">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    status === 'good' ? 'bg-pass' : status === 'warn' ? 'bg-warn' : 'bg-fail'
                  }`}
                  style={{ width: `${maxScore > 0 ? (score / maxScore) * 100 : 0}%` }}
                />
              </div>
              <span className="text-xs font-mono text-text-muted">{score}/{maxScore}</span>
              {/* Quick status icons */}
              <div className="flex gap-1">
                {visibleRules.map((r) => (
                  <span
                    key={r.id}
                    className={`w-2 h-2 rounded-full ${
                      r.status === 'pass' ? 'bg-pass' : r.status === 'warn' ? 'bg-warn' : 'bg-fail'
                    }`}
                    title={r.name}
                  />
                ))}
              </div>
            </div>

            {/* Conclusion */}
            <p className={`text-sm mt-2 ${colors.text}`}>{conclusion}</p>
          </div>

          <svg
            width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2"
            className={`text-text-dim flex-shrink-0 mt-1 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div className="px-5 pb-5 border-t border-border/30 pt-4 space-y-2">
          {visibleRules.map((rule) => (
            <RuleDetail key={rule.id} rule={rule} />
          ))}
          {collapsedRules.length > 0 && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-surface-2/30 text-sm text-text-muted">
              <span className="w-5 h-5 rounded bg-fail/10 flex items-center justify-center text-xs font-bold text-fail">
                {collapsedRules.length}
              </span>
              <span>{t('narrative.collapsed')}</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── Rule Detail Row ─────────────────────────────────────

function RuleDetail({ rule }: { rule: AnalysisResponse['rules'][0] }) {
  const config = STATUS_ICON[rule.status]

  return (
    <div className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-surface-2/20 transition-colors">
      <span className={`w-5 h-5 rounded ${config.bg} flex items-center justify-center text-xs font-bold ${config.color} flex-shrink-0 mt-0.5`}>
        {config.icon}
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className="text-xs text-text-primary">{rule.name}</span>
          <span className="text-xs font-mono text-text-dim">{rule.score}/{rule.maxScore}</span>
        </div>
        <p className="text-sm text-text-muted mt-0.5 leading-relaxed">{rule.message}</p>
      </div>
    </div>
  )
}
