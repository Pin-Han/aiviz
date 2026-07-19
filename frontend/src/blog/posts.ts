import type { BlogPost, BlogPostMeta } from './types'

// Import all posts — add new imports here
const modules = import.meta.glob('./posts/*.md', { eager: true }) as Record<
  string,
  { attributes: Record<string, unknown>; html: string }
>

function toPost(path: string, mod: { attributes: Record<string, unknown>; html: string }): BlogPost {
  const slug = path.replace('./posts/', '').replace('.md', '')
  const a = mod.attributes
  return {
    slug,
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

export function getAllPosts(): BlogPostMeta[] {
  return allPosts.map(({ html: _, ...meta }) => meta)
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return allPosts.find((p) => p.slug === slug)
}
