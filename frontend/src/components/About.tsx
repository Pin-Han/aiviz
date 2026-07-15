import { useI18n } from '../i18n'

interface AboutProps {
  onBack: () => void
}

export function About({ onBack }: AboutProps) {
  const { t } = useI18n()

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Back button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-mono text-text-muted hover:text-text-primary transition-colors tracking-wider"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          {t('about.back')}
        </button>

        {/* Hero */}
        <div className="text-center py-8 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2.5">
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            </div>
            <span className="text-lg font-bold text-text-primary tracking-tight">AIViz</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary mb-3 tracking-tight leading-tight">
            {t('about.hero.title')}
          </h1>
          <p className="text-sm text-text-muted max-w-lg mx-auto leading-relaxed">
            {t('about.hero.subtitle')}
          </p>
        </div>

        {/* What is this */}
        <div className="glass-card p-6 animate-fade-in-up stagger-1">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-5 h-5 rounded-md bg-accent/10 flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 16v-4"/>
                <path d="M12 8h.01"/>
              </svg>
            </div>
            <h2 className="text-sm font-semibold text-text-primary">{t('about.what.title')}</h2>
          </div>
          <p className="text-sm text-text-muted leading-relaxed">{t('about.what.desc')}</p>
        </div>

        {/* Who is it for */}
        <div className="glass-card p-6 animate-fade-in-up stagger-1">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-5 h-5 rounded-md bg-accent/10 flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2.5">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <h2 className="text-sm font-semibold text-text-primary">{t('about.who.title')}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {(['shopify', 'cyberbiz', 'woo', 'marketer'] as const).map((key) => (
              <div key={key} className="flex items-center gap-2 p-2.5 rounded-lg bg-surface-2/30">
                <span className="text-accent text-xs">{'\u2713'}</span>
                <span className="text-sm text-text-muted">{t(`about.who.${key}`)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* How it works */}
        <div className="glass-card p-6 animate-fade-in-up stagger-2">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-5 h-5 rounded-md bg-accent/10 flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2.5">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
              </svg>
            </div>
            <h2 className="text-sm font-semibold text-text-primary">{t('about.how.title')}</h2>
          </div>
          <div className="space-y-4">
            {([1, 2, 3] as const).map((step) => (
              <div key={step} className="flex gap-4">
                <div className="w-7 h-7 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-accent">{step}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-text-primary">{t(`about.how.step${step}.title`)}</p>
                  <p className="text-sm text-text-muted mt-0.5 leading-relaxed">{t(`about.how.step${step}.desc`)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Roadmap */}
        <div className="glass-card p-6 animate-fade-in-up stagger-2">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-5 h-5 rounded-md bg-accent/10 flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2.5">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
              </svg>
            </div>
            <h2 className="text-sm font-semibold text-text-primary">{t('about.roadmap.title')}</h2>
            <span className="text-xs font-mono text-text-dim tracking-wider bg-surface-2 px-1.5 py-0.5 rounded">COMING SOON</span>
          </div>
          <div className="space-y-2.5">
            {([1, 2, 3, 4] as const).map((i) => (
              <div key={i} className="flex items-start gap-3 p-2.5 rounded-lg bg-surface-2/30">
                <span className="text-accent text-xs mt-0.5">{'\u2192'}</span>
                <span className="text-sm text-text-muted leading-relaxed">{t(`about.roadmap.item${i}`)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="glass-card p-6 text-center animate-fade-in-up stagger-3" style={{ borderColor: 'rgba(13, 115, 119, 0.15)' }}>
          <h2 className="text-sm font-semibold text-text-primary mb-2">{t('about.contact.title')}</h2>
          <p className="text-sm text-text-muted mb-4 max-w-md mx-auto leading-relaxed">{t('about.contact.desc')}</p>
          <a
            href="mailto:patrick04184@gmail.com?subject=AIViz%20-%20SEO/AEO/GEO%20Consultation"
            className="
              inline-flex items-center gap-2 px-5 py-2.5
              bg-accent text-bg rounded-xl text-xs font-mono font-semibold tracking-wider
              hover:bg-accent/90 active:scale-[0.97] transition-all duration-200
            "
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="4" width="20" height="16" rx="2"/>
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
            </svg>
            {t('cta.button')}
          </a>
        </div>

        {/* Open source */}
        <div className="text-center pt-2 pb-8">
          <a
            href="https://github.com/Pin-Han/aiviz"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-mono text-text-dim hover:text-text-muted transition-colors tracking-wider"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            {t('about.opensource')}
          </a>
        </div>
      </div>
    </div>
  )
}
