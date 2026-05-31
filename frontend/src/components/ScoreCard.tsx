interface ScoreCardProps {
  total: number
  basic: number
  advanced: number
}

function getScoreColor(score: number) {
  if (score >= 80) return { text: 'text-pass', ring: 'border-pass', bg: 'bg-pass/10' }
  if (score >= 50) return { text: 'text-warn', ring: 'border-warn', bg: 'bg-warn/10' }
  return { text: 'text-fail', ring: 'border-fail', bg: 'bg-fail/10' }
}

function getLabel(score: number) {
  if (score >= 80) return 'Excellent'
  if (score >= 60) return 'Good'
  if (score >= 40) return 'Fair'
  return 'Poor'
}

export function ScoreCard({ total, basic, advanced }: ScoreCardProps) {
  const colors = getScoreColor(total)

  return (
    <div className="glass-card p-8 flex flex-col items-center animate-fade-in-up">
      {/* Score ring */}
      <div className={`relative w-36 h-36 rounded-full ${colors.bg} flex items-center justify-center mb-4`}>
        <div className={`absolute inset-2 rounded-full border-2 ${colors.ring} opacity-30`} />
        <div className="text-center animate-count-up">
          <span className={`text-5xl font-bold ${colors.text} tracking-tight`}>{total}</span>
          <span className="text-text-dim text-lg ml-0.5">/100</span>
        </div>
      </div>

      <p className="text-xs font-mono text-text-dim tracking-[0.2em] uppercase mb-5">
        {getLabel(total)}
      </p>

      {/* Breakdown */}
      <div className="w-full space-y-3">
        <ScoreBar label="基本項" score={basic} max={80} />
        <ScoreBar label="進階優化" score={advanced} max={20} />
      </div>
    </div>
  )
}

function ScoreBar({ label, score, max }: { label: string; score: number; max: number }) {
  const pct = Math.round((score / max) * 100)
  const colors = getScoreColor(pct)

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
