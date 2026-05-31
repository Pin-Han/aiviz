import LZString from 'lz-string'
import type { AnalysisResponse } from '@aiviz/shared/types.js'

export function encodeReport(data: AnalysisResponse): string {
  const json = JSON.stringify(data)
  return LZString.compressToEncodedURIComponent(json)
}

export function decodeReport(encoded: string): AnalysisResponse | null {
  try {
    const json = LZString.decompressFromEncodedURIComponent(encoded)
    if (!json) return null
    return JSON.parse(json) as AnalysisResponse
  } catch {
    return null
  }
}
