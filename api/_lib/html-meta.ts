/**
 * Rewrites <head> tags in the built SPA shell.
 *
 * The SPA sets its meta tags from JavaScript. Social crawlers (Facebook, LINE,
 * Twitter, Slack) don't run JavaScript, so shared links rendered whatever the
 * static index.html happened to say. These helpers let a serverless function
 * inject the right tags before the crawler sees the page.
 *
 * Mirrors frontend/scripts/prerender.mjs, which does the same for blog posts at
 * build time. Keep the two in sync if index.html's head changes.
 */

function escapeAttr(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export interface PageMeta {
  title: string
  description: string
  url: string
  ogType?: string
}

function setMeta(html: string, attr: 'name' | 'property', key: string, value: string): string {
  const re = new RegExp(`(<meta ${attr}="${key}" content=")[^"]*(")`)
  return html.replace(re, `$1${escapeAttr(value)}$2`)
}

export function injectMeta(html: string, meta: PageMeta): string {
  let out = html
  out = out.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeAttr(meta.title)}</title>`)
  out = out.replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${escapeAttr(meta.url)}$2`)

  out = setMeta(out, 'name', 'description', meta.description)
  out = setMeta(out, 'property', 'og:type', meta.ogType ?? 'website')
  out = setMeta(out, 'property', 'og:title', meta.title)
  out = setMeta(out, 'property', 'og:description', meta.description)
  out = setMeta(out, 'property', 'og:url', meta.url)
  out = setMeta(out, 'property', 'og:image:alt', meta.title)
  out = setMeta(out, 'name', 'twitter:title', meta.title)
  out = setMeta(out, 'name', 'twitter:description', meta.description)
  out = setMeta(out, 'name', 'twitter:image:alt', meta.title)
  return out
}
