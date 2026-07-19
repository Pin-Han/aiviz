import { useI18n } from '../i18n'
import { getAllPosts } from './posts'
import type { BlogPostMeta } from './types'

interface BlogListProps {
  onBack: () => void
  onPost: (slug: string) => void
}

export function BlogList({ onBack, onPost }: BlogListProps) {
  const { locale } = useI18n()
  const posts = getAllPosts()

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Back */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-mono text-text-muted hover:text-text-primary transition-colors tracking-wider"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          BACK
        </button>

        {/* Header */}
        <div className="text-center py-6 animate-fade-in-up">
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary mb-2 tracking-tight">Blog</h1>
          <p className="text-sm text-text-muted">AI visibility insights for e-commerce</p>
        </div>

        {/* Post list */}
        {posts.length === 0 ? (
          <div className="glass-card p-8 text-center">
            <p className="text-sm text-text-muted">Coming soon...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} onClick={() => onPost(post.slug)} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function PostCard({ post, onClick }: { post: BlogPostMeta; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="glass-card p-5 w-full text-left group hover:border-border-hover transition-all duration-300 animate-fade-in-up"
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-mono text-text-dim tracking-wider">
          {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
        </span>
        <span className="w-1 h-1 rounded-full bg-text-dim" />
        <span className="text-xs font-mono text-accent/60 tracking-wider uppercase">{post.lang === 'zh-TW' ? '中文' : 'EN'}</span>
      </div>
      <h2 className="text-base font-semibold text-text-primary mb-1.5 group-hover:text-accent transition-colors">
        {post.title}
      </h2>
      <p className="text-sm text-text-muted leading-relaxed line-clamp-2">{post.description}</p>
      <div className="flex gap-2 mt-3">
        {post.tags.map((tag) => (
          <span key={tag} className="text-xs font-mono text-text-dim bg-surface-2 px-2 py-0.5 rounded tracking-wider">
            {tag}
          </span>
        ))}
      </div>
    </button>
  )
}
