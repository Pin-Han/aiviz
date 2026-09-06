/**
 * Post-build prerender.
 *
 * The SPA sets its <meta> tags from JavaScript, which real browsers run and
 * social crawlers (Facebook, LINE, Twitter, Slack) do not. Every shared blog
 * link therefore rendered the generic homepage card.
 *
 * This writes one static HTML file per blog post — the same SPA shell with the
 * head rewritten — so crawlers get correct tags without executing anything.
 * Vercel serves them via `cleanUrls`; the SPA still boots and takes over.
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import fm from 'front-matter'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const DIST = join(ROOT, 'dist')
const POSTS_DIR = join(ROOT, 'src/blog/posts')
const SITE = 'https://ai-vision-check-pink.vercel.app'

const esc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

/** Replace the content="" of a <meta> matched by attr/value, leaving the rest alone. */
function setMeta(html, attr, name, value) {
  const re = new RegExp(`(<meta ${attr}="${name}" content=")[^"]*(")`)
  if (!re.test(html)) throw new Error(`prerender: no <meta ${attr}="${name}"> in index.html`)
  return html.replace(re, `$1${esc(value)}$2`)
}

function setTitle(html, value) {
  return html.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(value)}</title>`)
}

function setCanonical(html, url) {
  return html.replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${esc(url)}$2`)
}

function setHreflang(html, hreflang, url) {
  const re = new RegExp(`(<link rel="alternate" hreflang="${hreflang}" href=")[^"]*(")`)
  return html.replace(re, `$1${esc(url)}$2`)
}

function setHtmlLang(html, lang) {
  return html.replace(/<html lang="[^"]*">/, `<html lang="${lang}">`)
}

function injectJsonLd(html, obj) {
  const block = `    <script type="application/ld+json">\n${JSON.stringify(obj, null, 2)}\n    </script>\n  </head>`
  return html.replace('</head>', block)
}

// --- Load posts (same slug convention as src/blog/posts.ts) ---
const posts = readdirSync(POSTS_DIR)
  .filter((f) => f.endsWith('.md'))
  .map((file) => {
    const slug = file.replace(/\.md$/, '')
    const { attributes } = fm(readFileSync(join(POSTS_DIR, file), 'utf-8'))
    return { slug, baseSlug: slug.replace(/\.(zh-TW|en)$/, ''), ...attributes }
  })

const shell = readFileSync(join(DIST, 'index.html'), 'utf-8')

function renderPost(post) {
  const url = `${SITE}/blog/${post.slug}`
  const alt = posts.find((p) => p.baseSlug === post.baseSlug && p.slug !== post.slug)
  const isZh = post.lang === 'zh-TW'

  let html = shell
  html = setHtmlLang(html, post.lang)
  html = setTitle(html, `${post.title} — AIViz Blog`)
  html = setMeta(html, 'name', 'description', post.description)
  html = setCanonical(html, url)

  // hreflang: point each locale at its own version, x-default at English
  const zhUrl = isZh ? url : alt ? `${SITE}/blog/${alt.slug}` : url
  const enUrl = isZh ? (alt ? `${SITE}/blog/${alt.slug}` : url) : url
  html = setHreflang(html, 'zh-TW', zhUrl)
  html = setHreflang(html, 'en', enUrl)
  html = setHreflang(html, 'x-default', enUrl)

  html = setMeta(html, 'property', 'og:type', 'article')
  html = setMeta(html, 'property', 'og:title', post.title)
  html = setMeta(html, 'property', 'og:description', post.description)
  html = setMeta(html, 'property', 'og:url', url)
  html = setMeta(html, 'property', 'og:locale', isZh ? 'zh_TW' : 'en_US')
  html = setMeta(html, 'property', 'og:locale:alternate', isZh ? 'en_US' : 'zh_TW')
  html = setMeta(html, 'property', 'og:image:alt', post.title)

  html = setMeta(html, 'name', 'twitter:title', post.title)
  html = setMeta(html, 'name', 'twitter:description', post.description)
  html = setMeta(html, 'name', 'twitter:image:alt', post.title)

  html = injectJsonLd(html, {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    inLanguage: post.lang,
    keywords: (post.tags ?? []).join(', '),
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    author: { '@type': 'Organization', name: 'AIViz', url: SITE },
    publisher: { '@type': 'Organization', name: 'AIViz', url: SITE },
    image: `${SITE}/og-image.png`,
  })

  return html
}

function renderBlogIndex() {
  const url = `${SITE}/blog`
  const title = 'Blog — AIViz'
  const description =
    '關於 AI 搜尋可見度、結構化資料與 GEO 的實作筆記，寫給經營電商的人。Notes on AI search visibility, structured data and GEO for e-commerce.'

  let html = shell
  html = setTitle(html, title)
  html = setMeta(html, 'name', 'description', description)
  html = setCanonical(html, url)
  html = setHreflang(html, 'zh-TW', url)
  html = setHreflang(html, 'en', url)
  html = setHreflang(html, 'x-default', url)
  html = setMeta(html, 'property', 'og:title', title)
  html = setMeta(html, 'property', 'og:description', description)
  html = setMeta(html, 'property', 'og:url', url)
  html = setMeta(html, 'name', 'twitter:title', title)
  html = setMeta(html, 'name', 'twitter:description', description)
  return html
}

mkdirSync(join(DIST, 'blog'), { recursive: true })
writeFileSync(join(DIST, 'blog.html'), renderBlogIndex())

for (const post of posts) {
  writeFileSync(join(DIST, 'blog', `${post.slug}.html`), renderPost(post))
}

console.log(`prerendered ${posts.length} blog posts + blog index`)
