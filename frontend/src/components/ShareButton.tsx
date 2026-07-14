import { useState } from 'react'
import type { AnalysisResponse } from '@aiviz/shared/types.js'
import { useI18n } from '../i18n'

interface ShareButtonProps {
  data: AnalysisResponse
}

const API_BASE = import.meta.env.VITE_API_URL ?? ''

export function ShareButton({ data }: ShareButtonProps) {
  const { t } = useI18n()
  const [copied, setCopied] = useState(false)
  const [saving, setSaving] = useState(false)

  const handleShare = async () => {
    if (saving) return
    setSaving(true)

    try {
      // Try saving to backend for a short URL
      const res = await fetch(`${API_BASE}/api/reports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ report: data }),
      })

      if (res.ok) {
        const { id } = await res.json()
        const shareUrl = `${window.location.origin}/r/${id}`
        await navigator.clipboard.writeText(shareUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 3000)
        return
      }
    } catch {
      // Fall through to fallback
    } finally {
      setSaving(false)
    }

    // Fallback: copy current URL
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    } catch {
      window.prompt(t('share.prompt'), window.location.href)
    }
  }

  return (
    <button
      onClick={handleShare}
      disabled={saving}
      className="
        flex items-center gap-2 px-4 py-2.5
        border border-border text-text-muted rounded-xl text-xs font-mono tracking-wider
        hover:border-border-hover hover:text-text-primary
        disabled:opacity-50
        active:scale-[0.97] transition-all duration-200
      "
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
        <polyline points="16 6 12 2 8 6"/>
        <line x1="12" y1="2" x2="12" y2="15"/>
      </svg>
      {saving ? '...' : copied ? t('share.copied') : t('share.button')}
    </button>
  )
}
