import { useState, useCallback } from 'react'
import type { AnalysisResponse, ApiError } from '@aiviz/shared/types.js'

export type AnalysisState =
  | { status: 'idle' }
  | { status: 'loading'; step: string }
  | { status: 'success'; data: AnalysisResponse }
  | { status: 'error'; message: string }

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

export function useAnalysis() {
  const [state, setState] = useState<AnalysisState>({ status: 'idle' })

  const analyze = useCallback(async (url: string) => {
    setState({ status: 'loading', step: '爬取頁面中...' })

    try {
      const stepTimer = setTimeout(() => {
        setState((prev) =>
          prev.status === 'loading'
            ? { status: 'loading', step: '解析結構化資料...' }
            : prev,
        )
      }, 3000)

      const stepTimer2 = setTimeout(() => {
        setState((prev) =>
          prev.status === 'loading'
            ? { status: 'loading', step: 'AI 可讀性評估中...' }
            : prev,
        )
      }, 6000)

      const response = await fetch(`${API_BASE}/api/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })

      clearTimeout(stepTimer)
      clearTimeout(stepTimer2)

      if (!response.ok) {
        const error: ApiError = await response.json()
        setState({ status: 'error', message: error.error })
        return
      }

      const data: AnalysisResponse = await response.json()
      setState({ status: 'success', data })
    } catch {
      setState({ status: 'error', message: '網路連線錯誤，請檢查網路後再試' })
    }
  }, [])

  const setSharedReport = useCallback((data: AnalysisResponse) => {
    setState({ status: 'success', data })
  }, [])

  const reset = useCallback(() => {
    setState({ status: 'idle' })
  }, [])

  return { state, analyze, reset, setSharedReport }
}
