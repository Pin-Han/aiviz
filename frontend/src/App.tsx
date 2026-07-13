import { useEffect } from 'react'
import { useAnalysis } from './hooks/useAnalysis'
import { useI18n, SUPPORTED_LOCALES } from './i18n'
import type { Locale } from './i18n'
import { UrlInput } from './components/UrlInput'
import { AnalysisProgress } from './components/AnalysisProgress'
import { Report } from './components/Report'
import { decodeReport } from './utils/shareEncoder'

function App() {
  const { state, analyze, reset, setSharedReport } = useAnalysis()
  const { t, locale, setLocale } = useI18n()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const encoded = params.get('r')
    if (encoded) {
      const data = decodeReport(encoded)
      if (data) {
        setSharedReport(data)
        window.history.replaceState({}, '', window.location.pathname)
      }
    }
  }, [setSharedReport])

  return (
    <div className="min-h-screen bg-bg relative">
      {/* Subtle dot pattern */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.4]"
        style={{
          backgroundImage: 'radial-gradient(circle, #d4cdc4 0.5px, transparent 0.5px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Language switcher */}
      <div className="fixed top-4 right-4 z-50">
        <select
          value={locale}
          onChange={(e) => setLocale(e.target.value as Locale)}
          className="text-xs font-mono bg-surface border border-border rounded-lg px-2 py-1.5 text-text-muted cursor-pointer hover:border-border-hover transition-colors outline-none"
        >
          {SUPPORTED_LOCALES.map((l) => (
            <option key={l} value={l}>
              {l === 'zh-TW' ? '繁體中文' : 'English'}
            </option>
          ))}
        </select>
      </div>

      {state.status === 'idle' && <Landing onAnalyze={analyze} />}
      {state.status === 'loading' && <AnalysisProgress step={state.step} />}
      {state.status === 'success' && <Report data={state.data} onReset={reset} />}
      {state.status === 'error' && <ErrorView message={state.message} onReset={reset} />}
    </div>
  )
}

function Landing({ onAnalyze }: { onAnalyze: (url: string) => void }) {
  const { t } = useI18n()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 relative">
      <div className="text-center mb-10 animate-fade-in-up">
        {/* Logo */}
        <div className="inline-flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2.5">
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          </div>
          <span className="text-lg font-bold text-text-primary tracking-tight">AIViz</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-3 tracking-tight leading-tight">
          {t('landing.title.line1')}<br className="sm:hidden" />
          <span className="text-accent">{t('landing.title.line2')}</span>
        </h1>
        <p className="text-sm text-text-muted max-w-md mx-auto leading-relaxed whitespace-pre-line">
          {t('landing.subtitle')}
        </p>
      </div>

      <div className="w-full max-w-2xl animate-fade-in-up stagger-1">
        <UrlInput onSubmit={onAnalyze} disabled={false} />
      </div>

      {/* Feature cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-16 max-w-3xl w-full animate-fade-in-up stagger-2">
        <FeatureCard
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
            </svg>
          }
          title={t('landing.feature1.title')}
          description={t('landing.feature1.desc')}
        />
        <FeatureCard
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 16v-4"/>
              <path d="M12 8h.01"/>
            </svg>
          }
          title={t('landing.feature2.title')}
          description={t('landing.feature2.desc')}
        />
        <FeatureCard
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="16 18 22 12 16 6"/>
              <polyline points="8 6 2 12 8 18"/>
            </svg>
          }
          title={t('landing.feature3.title')}
          description={t('landing.feature3.desc')}
        />
      </div>

      {/* Footer */}
      <p className="mt-16 text-xs font-mono text-text-muted tracking-[0.2em] animate-fade-in-up stagger-3">
        {t('landing.footer')}
      </p>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="glass-card p-5 group hover:border-border-hover transition-all duration-300">
      <div className="w-9 h-9 rounded-xl bg-accent/8 border border-accent/10 flex items-center justify-center text-accent mb-4 group-hover:bg-accent/12 transition-colors">
        {icon}
      </div>
      <h3 className="text-sm font-semibold text-text-primary mb-1.5">{title}</h3>
      <p className="text-sm text-text-muted leading-relaxed">{description}</p>
    </div>
  )
}

function ErrorView({ message, onReset }: { message: string; onReset: () => void }) {
  const { t } = useI18n()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="glass-card p-8 max-w-md w-full text-center animate-fade-in-up" style={{ borderColor: 'rgba(248, 113, 113, 0.2)' }}>
        <div className="w-12 h-12 rounded-full bg-fail/10 flex items-center justify-center mx-auto mb-4">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-fail)" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
        </div>
        <p className="text-sm text-fail font-medium mb-1">{t('error.title')}</p>
        <p className="text-xs text-text-muted mb-6 leading-relaxed">
          {message === 'error.network' ? t('error.network') : message}
        </p>
        <button
          onClick={onReset}
          className="
            px-6 py-2.5 bg-accent text-bg rounded-xl text-xs font-mono font-semibold tracking-wider
            hover:bg-accent/90 active:scale-[0.97] transition-all duration-200
          "
        >
          {t('error.retry')}
        </button>
      </div>
    </div>
  )
}

export default App
