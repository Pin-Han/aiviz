import { useI18n } from '../i18n'
import type { AnalysisStep } from '../hooks/useAnalysis'

const STEP_IDS: AnalysisStep[] = ['crawling', 'parsing', 'analyzing']

interface AnalysisProgressProps {
  step: AnalysisStep
}

export function AnalysisProgress({ step }: AnalysisProgressProps) {
  const { t } = useI18n()
  const currentIndex = STEP_IDS.indexOf(step)

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 relative overflow-hidden">
      {/* Scanning line effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="scan-line absolute inset-x-0 h-32" />
      </div>

      <div className="glass-card p-10 max-w-md w-full relative z-10 animate-fade-in-up">
        {/* Pulsing indicator */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-2 border-accent/30 flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-accent animate-pulse" />
              </div>
            </div>
            <div className="absolute inset-0 rounded-full border-2 border-accent/10" style={{ animation: 'pulse-ring 2s ease-in-out infinite' }} />
          </div>
        </div>

        <h2 className="text-lg font-semibold text-text-primary mb-1 text-center">
          {t('progress.title')}
        </h2>
        <p className="text-xs text-text-muted text-center font-mono mb-8 tracking-wider">{t('progress.subtitle')}</p>

        <div className="space-y-4">
          {STEP_IDS.map((id, i) => {
            const isDone = i < currentIndex
            const isCurrent = i === currentIndex
            const isPending = !isDone && !isCurrent

            return (
              <div
                key={id}
                className={`flex items-start gap-4 transition-all duration-500 ${isPending ? 'opacity-30' : ''}`}
              >
                <div className="flex-shrink-0 mt-0.5">
                  {isDone && (
                    <div className="w-6 h-6 rounded-full bg-pass/20 flex items-center justify-center">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--color-pass)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                  )}
                  {isCurrent && (
                    <div className="w-6 h-6 rounded-full border-2 border-accent border-t-transparent animate-spin" />
                  )}
                  {isPending && (
                    <div className="w-6 h-6 rounded-full border border-border" />
                  )}
                </div>
                <div>
                  <p className={`text-sm font-medium ${isCurrent ? 'text-accent' : isDone ? 'text-pass' : 'text-text-dim'}`}>
                    {t(`progress.step.${id}.label`)}
                  </p>
                  <p className="text-sm text-text-muted font-mono mt-0.5">
                    {t(`progress.step.${id}.desc`)}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
