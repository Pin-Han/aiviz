import { useState } from 'react'

interface UrlInputProps {
  onSubmit: (url: string) => void
  disabled: boolean
  remainingQuota?: number
}

export function UrlInput({ onSubmit, disabled, remainingQuota }: UrlInputProps) {
  const [url, setUrl] = useState('')
  const [focused, setFocused] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = url.trim()
    if (!trimmed) return
    onSubmit(trimmed)
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div
        className={`
          flex items-center gap-2 p-1.5 rounded-2xl transition-all duration-300
          ${focused
            ? 'bg-surface-2 border border-accent/40 glow-accent'
            : 'bg-surface border border-border hover:border-border-hover'
          }
        `}
      >
        <div className="flex-1 flex items-center gap-3 pl-4">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-dim flex-shrink-0">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="輸入商品頁 URL..."
            className="flex-1 bg-transparent py-3 text-text-primary placeholder-text-dim outline-none text-[15px]"
            disabled={disabled}
            required
          />
        </div>
        <button
          type="submit"
          disabled={disabled || !url.trim()}
          className="
            px-6 py-3 bg-accent text-bg font-semibold rounded-xl
            hover:bg-accent/90 active:scale-[0.97]
            disabled:opacity-30 disabled:cursor-not-allowed
            transition-all duration-200 text-sm tracking-wide
          "
        >
          分析
        </button>
      </div>
      {remainingQuota !== undefined && (
        <p className="mt-3 text-xs text-text-dim text-center font-mono tracking-wider">
          TODAY REMAINING: {remainingQuota}/3
        </p>
      )}
    </form>
  )
}
