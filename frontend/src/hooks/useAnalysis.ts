import { useState, useCallback } from 'react'
import type { AnalysisResponse, ApiError } from '@aiviz/shared/types.js'

export type AnalysisStep = 'crawling' | 'parsing' | 'analyzing'

export type AnalysisState =
  | { status: 'idle' }
  | { status: 'loading'; step: AnalysisStep }
  | { status: 'success'; data: AnalysisResponse }
  | { status: 'error'; message: string }

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

export function useAnalysis() {
  const [state, setState] = useState<AnalysisState>({ status: 'idle' })

  const analyze = useCallback(async (url: string) => {
    setState({ status: 'loading', step: 'crawling' })

    try {
      const stepTimer = setTimeout(() => {
        setState((prev) =>
          prev.status === 'loading'
            ? { status: 'loading', step: 'parsing' }
            : prev,
        )
      }, 3000)

      const stepTimer2 = setTimeout(() => {
        setState((prev) =>
          prev.status === 'loading'
            ? { status: 'loading', step: 'analyzing' }
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
      setState({ status: 'error', message: 'error.network' })
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
