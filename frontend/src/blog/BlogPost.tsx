import { useEffect, useState } from 'react'
import { useI18n } from '../i18n'
import { getPostBySlug, getAlternatePost } from './posts'
import { SHOPIFY_APP_URL, trackShopifyClick } from '../utils/shopify'

const SITE_URL = 'https://ai-vision-check-pink.vercel.app'

interface BlogPostProps {
  slug: string
  onBack: () => void
  onSwitchPost?: (slug: string) => void
}

/** Set or create a <meta> tag */
function setMeta(attr: string, key: string, content: string) {
  let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

/** Set or create a <link> tag */
function setLink(rel: string, href: string) {
  let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

/** Inject Article JSON-LD */
function setArticleJsonLd(post: { title: string; description: string; date: string; slug: string; tags: string[] }) {
  const id = 'blog-article-jsonld'
  let el = document.getElementById(id) as HTMLScriptElement | null
  if (!el) {
    el = document.createElement('script')
    el.id = id
    el.type = 'application/ld+json'
    document.head.appendChild(el)
  }
  el.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    url: `${SITE_URL}/blog/${post.slug}`,
    author: { '@type': 'Person', name: 'Pin-Han', url: 'https://github.com/Pin-Han' },
    publisher: { '@type': 'Organization', name: 'AIViz', url: SITE_URL },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/blog/${post.slug}` },
    keywords: post.tags,
    inLanguage: 'zh-TW',
  })
}

/** Clean up injected SEO tags on unmount */
function cleanupBlogSeo() {
  document.getElementById('blog-article-jsonld')?.remove()
}

export function BlogPost({ slug, onBack, onSwitchPost }: BlogPostProps) {
  const { t, setLocale } = useI18n()
  const post = getPostBySlug(slug)
  const altPost = getAlternatePost(slug)

  // Sync UI locale to post language
  useEffect(() => {
    if (post) setLocale(post.lang)
  }, [post, setLocale])

  useEffect(() => {
    if (!post) return

    // Title
    document.title = `${post.title} — AIViz Blog`

    // Meta description
    setMeta('name', 'description', post.description)

    // Canonical
    setLink('canonical', `${SITE_URL}/blog/${post.slug}`)

    // Open Graph
    setMeta('property', 'og:type', 'article')
    setMeta('property', 'og:title', post.title)
    setMeta('property', 'og:description', post.description)
    setMeta('property', 'og:url', `${SITE_URL}/blog/${post.slug}`)

    // Twitter
    setMeta('name', 'twitter:title', post.title)
    setMeta('name', 'twitter:description', post.description)

    // Article JSON-LD
    setArticleJsonLd(post)

    // Scroll to top
    window.scrollTo(0, 0)

    return () => cleanupBlogSeo()
  }, [post])

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

  return (
    <div className="min-h-screen py-12 px-4">
      <article className="max-w-2xl mx-auto">
        {/* Back */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-mono text-text-muted hover:text-text-primary transition-colors tracking-wider mb-8"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          BLOG
        </button>

        {/* Meta */}
        <div className="mb-10 pb-8 border-b border-border animate-fade-in-up">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-mono text-text-dim tracking-wider">
              {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
            <span className="w-1 h-1 rounded-full bg-text-dim" />
            {post.tags.map((tag) => (
              <span key={tag} className="text-xs font-mono text-accent/60 bg-accent/5 px-2 py-0.5 rounded tracking-wider">
                {tag}
              </span>
            ))}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight leading-snug">
            {post.title}
          </h1>
          <p className="text-base text-text-muted mt-4 leading-relaxed">{post.description}</p>

          {/* Language toggle */}
          {altPost && onSwitchPost && (
            <button
              onClick={() => onSwitchPost(altPost.slug)}
              className="mt-4 inline-flex items-center gap-1.5 text-xs text-accent hover:text-accent/80 transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
              {altPost.lang === 'en' ? 'Read in English' : '閱讀中文版'}
            </button>
          )}
        </div>

        {/* Content */}
        <div
          className="prose-aiviz animate-fade-in-up"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />

        {/* Bottom CTA */}
        <div className="mt-12 glass-card p-6 animate-fade-in-up" style={{ borderColor: 'rgba(150, 191, 72, 0.3)', background: 'rgba(150, 191, 72, 0.03)' }}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex-1">
              <p className="text-sm font-semibold text-text-primary mb-1">
                {post.lang === 'zh-TW' ? '想檢查你的商品 AI 可見度？' : 'Check your store\'s AI visibility'}
              </p>
              <p className="text-sm text-text-muted">
                {post.lang === 'zh-TW'
                  ? '用 AIViz 免費掃描，60 秒拿到報告。'
                  : 'Scan with AIViz for free — get your report in 60 seconds.'}
              </p>
            </div>
            <div className="flex gap-2">
              <a
                href="/"
                className="px-4 py-2 bg-accent text-bg rounded-lg text-xs font-mono font-semibold tracking-wider hover:bg-accent/90 active:scale-[0.97] transition-all"
              >
                {post.lang === 'zh-TW' ? '免費掃描' : 'Scan Free'}
              </a>
              <a
                href={SHOPIFY_APP_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={trackShopifyClick('blog_post_cta')}
                className="px-4 py-2 rounded-lg text-xs font-mono font-semibold tracking-wider text-white hover:opacity-90 active:scale-[0.97] transition-all"
                style={{ background: '#96bf48' }}
              >
                Shopify App
              </a>
            </div>
          </div>
        </div>

        {/* Feedback */}
        <BlogFeedback slug={post.slug} lang={post.lang} />

        {/* Footer */}
        <div className="text-center pt-8 pb-8">
          <button
            onClick={onBack}
            className="text-xs text-accent hover:text-accent/80 transition-colors"
          >
            {post.lang === 'zh-TW' ? '← 更多文章' : '← More articles'}
          </button>
        </div>
      </article>
    </div>
  )
}

function BlogFeedback({ slug, lang }: { slug: string; lang: string }) {
  const [voted, setVoted] = useState<'up' | 'down' | null>(null)

  const vote = (type: 'up' | 'down') => {
    setVoted(type)
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'blog_feedback', {
        article_slug: slug,
        feedback: type,
      })
    }
  }

  return (
    <div className="mt-10 pt-6 border-t border-border text-center animate-fade-in-up">
      {voted ? (
        <p className="text-sm text-text-muted">
          {lang === 'zh-TW' ? '感謝你的回饋！' : 'Thanks for your feedback!'}
        </p>
      ) : (
        <>
          <p className="text-sm text-text-muted mb-3">
            {lang === 'zh-TW' ? '這篇文章有幫助嗎？' : 'Was this article helpful?'}
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => vote('up')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border text-sm text-text-muted hover:border-accent hover:text-accent transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
              </svg>
              {lang === 'zh-TW' ? '有幫助' : 'Helpful'}
            </button>
            <button
              onClick={() => vote('down')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border text-sm text-text-muted hover:border-text-dim hover:text-text-dim transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"/>
              </svg>
              {lang === 'zh-TW' ? '可以更好' : 'Could be better'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
