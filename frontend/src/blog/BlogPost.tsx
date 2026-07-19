import { useEffect } from 'react'
import { useI18n } from '../i18n'
import { getPostBySlug } from './posts'
import { SHOPIFY_APP_URL, trackShopifyClick } from '../utils/shopify'

interface BlogPostProps {
  slug: string
  onBack: () => void
}

export function BlogPost({ slug, onBack }: BlogPostProps) {
  const { t } = useI18n()
  const post = getPostBySlug(slug)

  useEffect(() => {
    if (post) {
      document.title = `${post.title} — AIViz Blog`
    }
  }, [post])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card p-8 text-center">
          <p className="text-sm text-text-muted mb-4">Post not found</p>
          <button onClick={onBack} className="text-xs text-accent hover:text-accent/80 transition-colors">
            Back to blog
          </button>
        </div>
      </div>
    )
  }

  const readingTime = Math.max(1, Math.round(post.html.replace(/<[^>]*>/g, '').length / 500))

  return (
    <div className="min-h-screen py-16 px-4">
      <article className="max-w-[680px] mx-auto">
        {/* Back */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-text-muted hover:text-accent transition-colors mb-12"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          {post.lang === 'zh-TW' ? '所有文章' : 'All articles'}
        </button>

        {/* Header */}
        <header className="mb-12 animate-fade-in-up">
          {/* Tags */}
          <div className="flex items-center gap-2 mb-5">
            {post.tags.map((tag) => (
              <span key={tag} className="text-xs font-medium text-accent bg-accent/8 px-2.5 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-bold text-text-primary tracking-tight leading-[1.25] mb-5">
            {post.title}
          </h1>

          {/* Description */}
          <p className="text-lg text-text-muted leading-relaxed mb-6">
            {post.description}
          </p>

          {/* Meta line */}
          <div className="flex items-center gap-3 text-sm text-text-dim pt-6 border-t border-border">
            <span>AIViz</span>
            <span className="w-1 h-1 rounded-full bg-text-dim" />
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString(
                post.lang === 'zh-TW' ? 'zh-TW' : 'en-US',
                { year: 'numeric', month: 'long', day: 'numeric' },
              )}
            </time>
            <span className="w-1 h-1 rounded-full bg-text-dim" />
            <span>{post.lang === 'zh-TW' ? `${readingTime} 分鐘閱讀` : `${readingTime} min read`}</span>
          </div>
        </header>

        {/* Content */}
        <div
          className="prose-aiviz animate-fade-in-up"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />

        {/* Bottom CTA */}
        <div className="mt-16 rounded-2xl p-8 animate-fade-in-up" style={{ background: 'linear-gradient(135deg, rgba(13,115,119,0.06) 0%, rgba(150,191,72,0.06) 100%)', border: '1px solid rgba(13,115,119,0.12)' }}>
          <h3 className="text-lg font-bold text-text-primary mb-2">
            {post.lang === 'zh-TW' ? '想知道你的商品在 AI 搜尋中的表現？' : 'Curious how your products perform in AI search?'}
          </h3>
          <p className="text-sm text-text-muted mb-6 leading-relaxed">
            {post.lang === 'zh-TW'
              ? '用 AIViz 免費掃描你的商品頁，60 秒拿到完整的 AI 可見度報告和修復建議。'
              : 'Scan your product page with AIViz for free — get a full AI visibility report with fix suggestions in 60 seconds.'}
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-bg rounded-xl text-sm font-semibold hover:bg-accent/90 active:scale-[0.97] transition-all"
            >
              {post.lang === 'zh-TW' ? '免費掃描商品頁' : 'Scan Your Product Page'}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
            <a
              href={SHOPIFY_APP_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={trackShopifyClick('blog_post_cta')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90 active:scale-[0.97] transition-all"
              style={{ background: '#96bf48' }}
            >
              Shopify App
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Footer nav */}
        <div className="flex justify-center pt-12 pb-8">
          <button
            onClick={onBack}
            className="text-sm text-accent hover:text-accent/80 transition-colors font-medium"
          >
            {post.lang === 'zh-TW' ? '← 回到所有文章' : '← Back to all articles'}
          </button>
        </div>
      </article>
    </div>
  )
}
