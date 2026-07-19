import type { AnalysisResponse } from '@aiviz/shared/types.js'
import { SCORE_MAX_TOTAL } from '@aiviz/shared/constants.js'
import { useI18n } from '../i18n'
import { ScoreCard } from './ScoreCard'
import { RadarChart } from './RadarChart'
import { NarrativeReport } from './NarrativeReport'
import { AiSuggestions } from './AiSuggestions'
import { SearchSimulation } from './SearchSimulation'
import { ShareButton } from './ShareButton'

interface ReportProps {
  data: AnalysisResponse
  onReset: () => void
}

export function Report({ data, onReset }: ReportProps) {
  const { t, locale } = useI18n()
  const pct = Math.round((data.score.total / SCORE_MAX_TOTAL) * 100)

  const verdict = pct >= 80 ? {
    emoji: '\u{1F7E2}',
    text: t('report.verdict.excellent.text'),
    sub: t('report.verdict.excellent.sub'),
    color: 'text-pass',
    border: 'rgba(52, 211, 153, 0.2)',
  } : pct >= 60 ? {
    emoji: '\u{1F7E1}',
    text: t('report.verdict.good.text'),
    sub: t('report.verdict.good.sub'),
    color: 'text-warn',
    border: 'rgba(251, 191, 36, 0.2)',
  } : pct >= 30 ? {
    emoji: '\u{1F7E0}',
    text: t('report.verdict.fair.text'),
    sub: t('report.verdict.fair.sub'),
    color: 'text-warn',
    border: 'rgba(251, 191, 36, 0.2)',
  } : {
    emoji: '\u{1F534}',
    text: t('report.verdict.poor.text'),
    sub: t('report.verdict.poor.sub'),
    color: 'text-fail',
    border: 'rgba(248, 113, 113, 0.2)',
  }

  const jsRule = data.rules.find((r) => r.id === 'js-rendering')
  const isDynamicRender = jsRule && jsRule.status === 'fail'

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between animate-fade-in-up">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-accent tracking-[0.15em]">{t('report.tag')}</span>
              <span className="w-1 h-1 rounded-full bg-text-dim" />
              <span className="text-xs font-mono text-text-dim">
                {new Date(data.analyzedAt).toLocaleString(locale)}
              </span>
            </div>
            <p className="text-sm text-text-muted truncate max-w-lg">{data.url}</p>
          </div>
          <div className="flex gap-2 flex-shrink-0 ml-4">
            <ShareButton data={data} />
            <button
              onClick={onReset}
              className="
                flex items-center gap-2 px-4 py-2.5
                bg-accent text-bg rounded-xl text-xs font-mono font-semibold tracking-wider
                hover:bg-accent/90 active:scale-[0.97]
                transition-all duration-200
              "
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="23 4 23 10 17 10"/>
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
              </svg>
              {t('report.rescan')}
            </button>
          </div>
        </div>

        {/* Verdict hook */}
        <div className="glass-card p-5 animate-fade-in-up" style={{ borderColor: verdict.border }}>
          <div className="flex items-start gap-4">
            <span className="text-2xl flex-shrink-0">{verdict.emoji}</span>
            <div>
              <p className={`text-base font-semibold ${verdict.color}`}>{verdict.text}</p>
              <p className="text-sm text-text-muted mt-1">{verdict.sub}</p>
            </div>
          </div>
        </div>

        {/* Shopify detected CTA */}
        {data.platform === 'shopify' && <ShopifyCta />}

        {/* Page type warning */}
        {data.pageTypeMessage && (
          <PageTypeWarning message={data.pageTypeMessage} pageType={data.pageType} url={data.url} />
        )}

        {/* Dynamic rendering warning */}
        {isDynamicRender && !data.pageTypeMessage && (
          <DynamicRenderWarning url={data.url} />
        )}

        {/* Score overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <ScoreCard
            total={data.score.total}
            accessibility={data.score.accessibility}
            basic={data.score.basic}
            advanced={data.score.advanced}
          />
          <RadarChart
            accessibility={data.score.accessibility}
            basic={data.score.basic}
            advanced={data.score.advanced}
          />
        </div>

        {/* 3-Layer Narrative */}
        <NarrativeReport data={data} />

        {/* AI Search Simulation */}
        <SearchSimulation data={data.searchSimulation} />

        {/* AI Suggestions */}
        <AiSuggestions rules={data.rules} aiReadability={data.aiReadability} />

        {/* Generic Shopify CTA (non-Shopify stores) */}
        {data.platform !== 'shopify' && <ShopifyCtaGeneric />}

        {/* CTA */}
        <div className="glass-card p-6 text-center animate-fade-in-up" style={{ borderColor: 'rgba(13, 115, 119, 0.15)' }}>
          <h3 className="text-sm font-semibold text-text-primary mb-2">{t('cta.title')}</h3>
          <p className="text-sm text-text-muted mb-4 max-w-md mx-auto leading-relaxed">{t('cta.desc')}</p>
          <a
            href="mailto:patrick04184@gmail.com?subject=AIViz%20-%20Early%20Access%20Request"
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
          <p className="text-xs text-text-dim mt-3">
            <a
              href="mailto:patrick04184@gmail.com?subject=AIViz%20-%20SEO/AEO/GEO%20Consultation"
              className="hover:text-text-muted transition-colors"
            >
              {t('cta.consulting')}
            </a>
          </p>
        </div>

        {/* Footer */}
        <div className="text-center pt-4 pb-8">
          <p className="text-xs font-mono text-text-dim tracking-[0.15em]">
            CRAWL {data.meta.crawlTimeMs}ms &middot; AI {data.meta.aiCallTimeMs}ms &middot; AIViz v1.0
          </p>
        </div>
      </div>
    </div>
  )
}

function PageTypeWarning({ message, pageType, url }: { message: string; pageType: string; url: string }) {
  const { t } = useI18n()
  let domain = ''
  try { domain = new URL(url).hostname } catch { /* */ }

  return (
    <div className="glass-card p-5 animate-fade-in-up" style={{ borderColor: 'rgba(251, 191, 36, 0.2)' }}>
      <div className="flex items-start gap-3">
        <div className="w-6 h-6 rounded-lg bg-warn/10 flex items-center justify-center flex-shrink-0 mt-0.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-warn)" strokeWidth="2.5">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </div>
        <div>
          <p className="text-sm text-text-muted leading-relaxed">{message}</p>
          {pageType === 'homepage' && domain && (
            <div className="mt-3 p-3 rounded-lg bg-surface-2/50">
              <p className="text-xs text-text-muted mb-1.5 font-mono tracking-wider">{t('pageType.tryProduct')}</p>
              <p className="text-xs text-text-muted">
                {t('pageType.example', { domain })}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function DynamicRenderWarning({ url }: { url: string }) {
  const { t } = useI18n()
  let domain = ''
  try { domain = new URL(url).hostname } catch { /* */ }
  const isMarketplace = ['shopee', 'momo', 'pchome', 'ruten'].some((p) => domain.includes(p))

  return (
    <div className="glass-card p-5 animate-fade-in-up" style={{ borderColor: 'rgba(248, 113, 113, 0.15)' }}>
      <div className="flex items-start gap-3">
        <div className="w-6 h-6 rounded-lg bg-fail/10 flex items-center justify-center flex-shrink-0 mt-0.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-fail)" strokeWidth="2.5">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
            <line x1="8" y1="21" x2="16" y2="21"/>
            <line x1="12" y1="17" x2="12" y2="21"/>
          </svg>
        </div>
        <div>
          <p className="text-sm text-fail font-medium mb-1">{t('dynamic.title')}</p>
          <p className="text-sm text-text-muted leading-relaxed">
            {t('dynamic.desc')}
          </p>
          {isMarketplace ? (
            <div className="mt-3 p-3 rounded-lg bg-surface-2/50 space-y-2">
              <p className="text-xs text-text-muted">{t('dynamic.marketplace')}</p>
              <p className="text-xs font-mono text-accent/60 tracking-wider">
                {t('dynamic.comingSoon')}
              </p>
            </div>
          ) : (
            <div className="mt-3 p-3 rounded-lg bg-surface-2/50 space-y-1.5">
              <p className="text-xs text-text-muted font-mono tracking-wider mb-1">{t('dynamic.recommended')}</p>
              <p className="text-xs text-text-muted">{t('dynamic.fix1')}</p>
              <p className="text-xs text-text-muted">{t('dynamic.fix2')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const SHOPIFY_APP_URL = 'https://apps.shopify.com/'

function ShopifyCta() {
  const { t } = useI18n()

  return (
    <div className="glass-card p-5 animate-fade-in-up" style={{ borderColor: 'rgba(99, 102, 241, 0.25)', background: 'rgba(99, 102, 241, 0.03)' }}>
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#96bf48' }}>
          <svg width="16" height="18" viewBox="0 0 256 292" fill="white">
            <path d="M223.774 57.34c-.201-1.46-1.48-2.268-2.537-2.357-1.055-.088-22.768-.517-22.768-.517s-15.129-14.71-16.818-16.399c-1.69-1.69-4.954-1.143-6.24-.826-.09 0-3.387 1.028-8.577 2.7-5.013-14.71-13.94-28.207-29.606-28.207-.428 0-.876.022-1.324.044C132.878 7.7 129.336 5 126.303 5c-28.872 0-42.7 36.108-47.043 54.471-11.303 3.518-19.352 5.982-20.407 6.316-6.33 1.983-6.508 2.18-7.342 8.123C50.962 78.69 33 222.972 33 222.972L173.906 252l55.752-12.078s-5.686-180.916-5.884-182.582z"/>
          </svg>
        </div>
        <div className="flex-1">
          <p className="text-sm text-text-primary leading-relaxed">
            {t('shopify.cta.detected')}
          </p>
          <a
            href={SHOPIFY_APP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="
              inline-flex items-center gap-2 mt-3 px-4 py-2
              rounded-lg text-xs font-mono font-semibold tracking-wider
              text-white transition-all duration-200
              hover:opacity-90 active:scale-[0.97]
            "
            style={{ background: '#96bf48' }}
          >
            {t('shopify.cta.button')}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  )
}

function ShopifyCtaGeneric() {
  const { t } = useI18n()

  return (
    <div className="flex items-center justify-center gap-2 py-3 animate-fade-in-up">
      <svg width="14" height="16" viewBox="0 0 256 292" fill="#96bf48" opacity="0.7">
        <path d="M223.774 57.34c-.201-1.46-1.48-2.268-2.537-2.357-1.055-.088-22.768-.517-22.768-.517s-15.129-14.71-16.818-16.399c-1.69-1.69-4.954-1.143-6.24-.826-.09 0-3.387 1.028-8.577 2.7-5.013-14.71-13.94-28.207-29.606-28.207-.428 0-.876.022-1.324.044C132.878 7.7 129.336 5 126.303 5c-28.872 0-42.7 36.108-47.043 54.471-11.303 3.518-19.352 5.982-20.407 6.316-6.33 1.983-6.508 2.18-7.342 8.123C50.962 78.69 33 222.972 33 222.972L173.906 252l55.752-12.078s-5.686-180.916-5.884-182.582z"/>
      </svg>
      <a
        href={SHOPIFY_APP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs text-text-muted hover:text-accent transition-colors"
      >
        {t('shopify.cta.generic')}
      </a>
    </div>
  )
}
