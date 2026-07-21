import type { BlogPost, BlogPostMeta } from './types'

const modules = import.meta.glob('./posts/*.md', { eager: true }) as Record<
  string,
  { attributes: Record<string, unknown>; html: string }
>

/**
 * Slug convention:
 *   my-post.zh-TW.md  → slug "my-post.zh-TW", baseSlug "my-post"
 *   my-post.en.md     → slug "my-post.en",    baseSlug "my-post"
 *   my-post.md        → slug "my-post",        baseSlug "my-post"
 */
function parseSlug(filename: string): { slug: string; baseSlug: string } {
  const slug = filename.replace('./posts/', '').replace('.md', '')
  const baseSlug = slug.replace(/\.(zh-TW|en)$/, '')
  return { slug, baseSlug }
}

function toPost(path: string, mod: { attributes: Record<string, unknown>; html: string }): BlogPost {
  const { slug, baseSlug } = parseSlug(path)
  const a = mod.attributes
  return {
    slug,
    baseSlug,
    title: (a.title as string) ?? slug,
    description: (a.description as string) ?? '',
    date: (a.date as string) ?? '',
    lang: (a.lang as 'en' | 'zh-TW') ?? 'en',
    tags: (a.tags as string[]) ?? [],
    coverAlt: a.coverAlt as string | undefined,
    html: mod.html,
  }
}

const allPosts: BlogPost[] = Object.entries(modules)
  .map(([path, mod]) => toPost(path, mod))
  .sort((a, b) => (b.date > a.date ? 1 : -1))

/** Get posts filtered by locale */
export function getPostsByLocale(locale: string): BlogPostMeta[] {
  return allPosts
    .filter((p) => p.lang === locale)
    .map(({ html: _, ...meta }) => meta)
}

/** Get all posts (unfiltered) */
export function getAllPosts(): BlogPostMeta[] {
  return allPosts.map(({ html: _, ...meta }) => meta)
}

/** Get a single post by its full slug */
export function getPostBySlug(slug: string): BlogPost | undefined {
  return allPosts.find((p) => p.slug === slug)
}

/** Get the alternate language version of a post (if exists) */
export function getAlternatePost(slug: string): BlogPostMeta | undefined {
  const current = allPosts.find((p) => p.slug === slug)
  if (!current) return undefined
  const alt = allPosts.find((p) => p.baseSlug === current.baseSlug && p.slug !== slug)
  if (!alt) return undefined
  const { html: _, ...meta } = alt
  return meta
}
