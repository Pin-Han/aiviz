const STEPS = [
  { label: '爬取頁面中', desc: 'Fetching page HTML...' },
  { label: '解析結構化資料', desc: 'Parsing JSON-LD & Open Graph...' },
  { label: 'AI 可讀性評估中', desc: 'Analyzing readability...' },
]

interface AnalysisProgressProps {
  step: string
}

export function AnalysisProgress({ step }: AnalysisProgressProps) {
  const currentIndex = STEPS.findIndex((s) => step.startsWith(s.label))

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
          正在掃描中
        </h2>
        <p className="text-xs text-text-dim text-center font-mono mb-8 tracking-wider">SCANNING IN PROGRESS</p>

        <div className="space-y-4">
          {STEPS.map((s, i) => {
            const isDone = i < currentIndex
            const isCurrent = i === currentIndex || (currentIndex === -1 && i === 0)
            const isPending = !isDone && !isCurrent

            return (
              <div
                key={s.label}
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
                    {s.label}
                  </p>
                  <p className="text-xs text-text-dim font-mono mt-0.5">{s.desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
