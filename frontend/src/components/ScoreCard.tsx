import { SCORE_MAX_ACCESSIBILITY, SCORE_MAX_BASIC, SCORE_MAX_ADVANCED, SCORE_MAX_TOTAL } from '@aiviz/shared/constants.js'
import { useI18n } from '../i18n'

interface ScoreCardProps {
  total: number
  accessibility: number
  basic: number
  advanced: number
}

function getScoreColor(score: number) {
  if (score >= 80) return { text: 'text-pass', ring: 'border-pass', bg: 'bg-pass/10' }
  if (score >= 50) return { text: 'text-warn', ring: 'border-warn', bg: 'bg-warn/10' }
  return { text: 'text-fail', ring: 'border-fail', bg: 'bg-fail/10' }
}

export function ScoreCard({ total, accessibility, basic, advanced }: ScoreCardProps) {
  const { t } = useI18n()
  const pct = Math.round((total / SCORE_MAX_TOTAL) * 100)
  const colors = getScoreColor(pct)

  const label = pct >= 80 ? t('score.excellent')
    : pct >= 60 ? t('score.good')
    : pct >= 40 ? t('score.fair')
    : t('score.poor')

  return (
    <div className="glass-card p-8 flex flex-col items-center animate-fade-in-up">
      {/* Score ring */}
      <div className={`relative w-36 h-36 rounded-full ${colors.bg} flex items-center justify-center mb-4`}>
        <div className={`absolute inset-2 rounded-full border-2 ${colors.ring} opacity-30`} />
        <div className="text-center animate-count-up">
          <span className={`text-5xl font-bold ${colors.text} tracking-tight`}>{pct}</span>
          <span className="text-text-dim text-lg ml-0.5">%</span>
        </div>
      </div>

      <p className="text-xs font-mono text-text-muted tracking-[0.2em] uppercase mb-1">
        {label}
      </p>
      <p className="text-xs font-mono text-text-muted mb-5">
        {t('score.pts', { total, max: SCORE_MAX_TOTAL })}
      </p>

      {/* Breakdown */}
      <div className="w-full space-y-3">
        <ScoreBar label={t('category.accessibility')} score={accessibility} max={SCORE_MAX_ACCESSIBILITY} />
        <ScoreBar label={t('category.basic')} score={basic} max={SCORE_MAX_BASIC} />
        <ScoreBar label={t('category.advanced')} score={advanced} max={SCORE_MAX_ADVANCED} />
      </div>
    </div>
  )
}

function ScoreBar({ label, score, max }: { label: string; score: number; max: number }) {
  const pct = max > 0 ? Math.round((score / max) * 100) : 0

  return (
    <div>
      <div className="flex justify-between text-xs mb-1.5">
        <span className="text-text-muted">{label}</span>
        <span className="font-mono text-text-primary">{score}<span className="text-text-dim">/{max}</span></span>
      </div>
      <div className="h-1.5 bg-surface-2 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${
            pct >= 80 ? 'bg-pass' : pct >= 50 ? 'bg-warn' : 'bg-fail'
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
