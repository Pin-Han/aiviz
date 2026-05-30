# Phase 6: Frontend

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the full frontend SPA — Landing page with URL input, analysis progress view, and report page with score card, radar chart, rule list, AI readability section, fix suggestions, and share button.

**Architecture:** React SPA with three views managed by state (no router needed — single page with conditional rendering). Uses `lz-string` for share URL encoding.

**Tech Stack:** React, Tailwind CSS, recharts (radar chart), lz-string

**Status:** Not Started

**Depends on:** Phase 5 completed (API endpoint available for testing)

---

## Task 1: API Hook & Types

**Files:**
- Create: `frontend/src/hooks/useAnalysis.ts`
- Create: `frontend/src/utils/shareEncoder.ts`

- [ ] **Step 1: Create the API hook**

Create `frontend/src/hooks/useAnalysis.ts`:

```typescript
import { useState, useCallback } from 'react'
import type { AnalysisResponse, ApiError } from '@aiviz/shared/types.js'

type AnalysisState =
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
      // Simulate step progression for UX
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

  const reset = useCallback(() => {
    setState({ status: 'idle' })
  }, [])

  return { state, analyze, reset }
}
```

- [ ] **Step 2: Create share encoder**

Create `frontend/src/utils/shareEncoder.ts`:

```typescript
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
```

- [ ] **Step 3: Commit**

```bash
git add frontend/src/hooks/useAnalysis.ts frontend/src/utils/shareEncoder.ts
git commit -m "feat: add useAnalysis hook and share encoder utility"
```

---

## Task 2: Landing Page (Home)

**Files:**
- Create: `frontend/src/components/UrlInput.tsx`
- Modify: `frontend/src/App.tsx`

- [ ] **Step 1: Create UrlInput component**

Create `frontend/src/components/UrlInput.tsx`:

```tsx
import { useState } from 'react'

interface UrlInputProps {
  onSubmit: (url: string) => void
  disabled: boolean
  remainingQuota?: number
}

export function UrlInput({ onSubmit, disabled, remainingQuota }: UrlInputProps) {
  const [url, setUrl] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = url.trim()
    if (!trimmed) return
    onSubmit(trimmed)
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="flex gap-2">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="輸入商品頁 URL，例如 https://your-shop.com/products/..."
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
          disabled={disabled}
          required
        />
        <button
          type="submit"
          disabled={disabled || !url.trim()}
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          分析
        </button>
      </div>
      {remainingQuota !== undefined && (
        <p className="mt-2 text-sm text-gray-500 text-center">
          今日剩餘免費次數：{remainingQuota}/3
        </p>
      )}
    </form>
  )
}
```

- [ ] **Step 2: Update App.tsx with landing page layout**

Replace `frontend/src/App.tsx`:

```tsx
import { useEffect } from 'react'
import { useAnalysis } from './hooks/useAnalysis'
import { UrlInput } from './components/UrlInput'
import { AnalysisProgress } from './components/AnalysisProgress'
import { Report } from './components/Report'
import { decodeReport } from './utils/shareEncoder'
import type { AnalysisResponse } from '@aiviz/shared/types.js'

function App() {
  const { state, analyze, reset } = useAnalysis()

  // Check for shared report in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const encoded = params.get('r')
    if (encoded) {
      const data = decodeReport(encoded)
      if (data) {
        // Manually set state — shared reports are read-only
        // We'll handle this via a separate state
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {state.status === 'idle' && (
        <div className="flex flex-col items-center justify-center min-h-screen px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              AIViz
            </h1>
            <p className="text-lg text-gray-600">
              你的商品，AI 搜得到嗎？
            </p>
            <p className="text-sm text-gray-400 mt-1">
              60 秒內檢查你的商品頁在 AI 搜尋引擎中的可見度
            </p>
          </div>

          <UrlInput onSubmit={analyze} disabled={false} />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-4xl">
            <FeatureCard
              title="結構化資料評分"
              description="檢查商品頁的 schema.org 結構化資料是否完整，讓 AI 看得懂你的商品"
            />
            <FeatureCard
              title="AI 可讀性評估"
              description="從 AI 搜尋引擎的角度，評估你的商品資料品質"
            />
            <FeatureCard
              title="一鍵修復建議"
              description="具體告訴你缺什麼、怎麼補，附上可直接複製的程式碼"
            />
          </div>
        </div>
      )}

      {state.status === 'loading' && (
        <AnalysisProgress step={state.step} />
      )}

      {state.status === 'success' && (
        <Report data={state.data} onReset={reset} />
      )}

      {state.status === 'error' && (
        <div className="flex flex-col items-center justify-center min-h-screen px-4">
          <div className="bg-white rounded-xl shadow-sm border border-red-200 p-8 max-w-md text-center">
            <p className="text-red-600 text-lg font-medium mb-2">分析失敗</p>
            <p className="text-gray-600 mb-6">{state.message}</p>
            <button
              onClick={reset}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              重新輸入
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  )
}

export default App
```

- [ ] **Step 3: Commit**

```bash
git add frontend/src/components/UrlInput.tsx frontend/src/App.tsx
git commit -m "feat: implement landing page with URL input and feature cards"
```

---

## Task 3: Analysis Progress View

**Files:**
- Create: `frontend/src/components/AnalysisProgress.tsx`

- [ ] **Step 1: Create progress component**

Create `frontend/src/components/AnalysisProgress.tsx`:

```tsx
const STEPS = [
  '爬取頁面中...',
  '解析結構化資料...',
  'AI 可讀性評估中...',
]

interface AnalysisProgressProps {
  step: string
}

export function AnalysisProgress({ step }: AnalysisProgressProps) {
  const currentIndex = STEPS.indexOf(step)

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 max-w-md w-full">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">
          正在分析中...
        </h2>

        <div className="space-y-4">
          {STEPS.map((s, i) => {
            const isDone = i < currentIndex
            const isCurrent = i === currentIndex
            const isPending = i > currentIndex

            return (
              <div key={s} className="flex items-center gap-3">
                {isDone && (
                  <span className="text-green-500 text-lg">&#10003;</span>
                )}
                {isCurrent && (
                  <span className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                )}
                {isPending && (
                  <span className="w-5 h-5 rounded-full border-2 border-gray-200" />
                )}
                <span
                  className={
                    isDone
                      ? 'text-green-600'
                      : isCurrent
                        ? 'text-blue-600 font-medium'
                        : 'text-gray-400'
                  }
                >
                  {s}
                </span>
              </div>
            )
          })}
        </div>

        {/* Ad placeholder area */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg text-center text-sm text-gray-400">
          {/* Future: ad placement */}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/components/AnalysisProgress.tsx
git commit -m "feat: implement analysis progress view with step indicators"
```

---

## Task 4: Report Page — Score Card

**Files:**
- Create: `frontend/src/components/ScoreCard.tsx`

- [ ] **Step 1: Create ScoreCard component**

Create `frontend/src/components/ScoreCard.tsx`:

```tsx
interface ScoreCardProps {
  total: number
  basic: number
  advanced: number
}

function getScoreColor(score: number): string {
  if (score >= 80) return 'text-green-600'
  if (score >= 50) return 'text-yellow-500'
  return 'text-red-500'
}

function getScoreBg(score: number): string {
  if (score >= 80) return 'bg-green-50 border-green-200'
  if (score >= 50) return 'bg-yellow-50 border-yellow-200'
  return 'bg-red-50 border-red-200'
}

export function ScoreCard({ total, basic, advanced }: ScoreCardProps) {
  return (
    <div className={`rounded-xl border p-8 text-center ${getScoreBg(total)}`}>
      <p className="text-sm text-gray-500 mb-2">AI 可見度分數</p>
      <p className={`text-6xl font-bold ${getScoreColor(total)}`}>
        {total}
      </p>
      <p className="text-gray-400 text-lg mt-1">/ 100</p>

      <div className="flex justify-center gap-8 mt-6">
        <div>
          <p className="text-sm text-gray-500">基本項</p>
          <p className="text-xl font-semibold text-gray-700">{basic}/80</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">進階優化</p>
          <p className="text-xl font-semibold text-gray-700">{advanced}/20</p>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/components/ScoreCard.tsx
git commit -m "feat: implement score card component"
```

---

## Task 5: Report Page — Radar Chart

**Files:**
- Create: `frontend/src/components/RadarChart.tsx`

- [ ] **Step 1: Install recharts**

```bash
cd frontend && npm install recharts
```

- [ ] **Step 2: Create RadarChart component**

Create `frontend/src/components/RadarChart.tsx`:

```tsx
import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts'

interface RadarChartProps {
  rules: Array<{
    name: string
    score: number
    maxScore: number
  }>
}

export function RadarChart({ rules }: RadarChartProps) {
  const data = rules.map((r) => ({
    subject: r.name.replace(/(.{6}).*/, '$1...'),
    fullName: r.name,
    score: Math.round((r.score / r.maxScore) * 100),
    fullMark: 100,
  }))

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4">
      <ResponsiveContainer width="100%" height={300}>
        <RechartsRadarChart data={data}>
          <PolarGrid stroke="#e5e7eb" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: '#6b7280', fontSize: 11 }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fill: '#9ca3af', fontSize: 10 }}
          />
          <Radar
            name="得分率"
            dataKey="score"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.2}
          />
        </RechartsRadarChart>
      </ResponsiveContainer>
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add frontend/src/components/RadarChart.tsx frontend/package.json
git commit -m "feat: implement radar chart for score visualization"
```

---

## Task 6: Report Page — Rule List & Fix Suggestions

**Files:**
- Create: `frontend/src/components/RuleList.tsx`
- Create: `frontend/src/components/FixSuggestions.tsx`

- [ ] **Step 1: Create RuleList component**

Create `frontend/src/components/RuleList.tsx`:

```tsx
import { useState } from 'react'
import type { RuleCategory, RuleStatus } from '@aiviz/shared/types.js'
import { CATEGORY_LABELS } from '@aiviz/shared/constants.js'

interface RuleItem {
  id: string
  name: string
  category: RuleCategory
  score: number
  maxScore: number
  status: RuleStatus
  message: string
  fix: string | null
  code: string | null
}

interface RuleListProps {
  rules: RuleItem[]
}

const STATUS_ICON: Record<RuleStatus, string> = {
  pass: '\u2705',
  warn: '\u26A0\uFE0F',
  fail: '\u274C',
}

export function RuleList({ rules }: RuleListProps) {
  const basic = rules.filter((r) => r.category === 'basic')
  const advanced = rules.filter((r) => r.category === 'advanced')

  return (
    <div className="space-y-6">
      <RuleSection title={CATEGORY_LABELS.basic} rules={basic} />
      <RuleSection title={CATEGORY_LABELS.advanced} rules={advanced} />
    </div>
  )
}

function RuleSection({ title, rules }: { title: string; rules: RuleItem[] }) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-3">{title}</h3>
      <div className="space-y-2">
        {rules.map((rule) => (
          <RuleRow key={rule.id} rule={rule} />
        ))}
      </div>
    </div>
  )
}

function RuleRow({ rule }: { rule: RuleItem }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span>{STATUS_ICON[rule.status]}</span>
          <span className="font-medium text-gray-800">{rule.name}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">
            {rule.score}/{rule.maxScore}
          </span>
          <span className="text-gray-400 text-xs">
            {expanded ? '\u25B2' : '\u25BC'}
          </span>
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-50">
          <p className="text-sm text-gray-600 mt-3">{rule.message}</p>
          {rule.fix && (
            <div className="mt-3 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800 font-medium">修復建議</p>
              <p className="text-sm text-blue-700 mt-1">{rule.fix}</p>
            </div>
          )}
          {rule.code && (
            <div className="mt-3">
              <CodeBlock code={rule.code} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative">
      <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 text-sm overflow-x-auto">
        <code>{code}</code>
      </pre>
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 px-3 py-1 bg-gray-700 text-gray-300 text-xs rounded hover:bg-gray-600 transition-colors"
      >
        {copied ? '已複製!' : '複製'}
      </button>
    </div>
  )
}
```

- [ ] **Step 2: Create FixSuggestions component (prioritized summary)**

Create `frontend/src/components/FixSuggestions.tsx`:

```tsx
interface FixSuggestionsProps {
  rules: Array<{
    id: string
    name: string
    status: string
    fix: string | null
    maxScore: number
    score: number
  }>
}

export function FixSuggestions({ rules }: FixSuggestionsProps) {
  const fixable = rules
    .filter((r) => r.fix && r.status !== 'pass')
    .sort((a, b) => (b.maxScore - b.score) - (a.maxScore - a.score))

  if (fixable.length === 0) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
        <p className="text-green-700 font-medium">所有項目都通過了，做得好!</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        優先修復建議（依影響力排序）
      </h3>
      <ol className="space-y-3">
        {fixable.map((r, i) => (
          <li key={r.id} className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-medium">
              {i + 1}
            </span>
            <div>
              <p className="font-medium text-gray-800">{r.name}</p>
              <p className="text-sm text-gray-500 mt-0.5">{r.fix}</p>
              <p className="text-xs text-gray-400 mt-0.5">
                修復後最多可提升 {r.maxScore - r.score} 分
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add frontend/src/components/RuleList.tsx frontend/src/components/FixSuggestions.tsx
git commit -m "feat: implement rule list with expandable details and fix suggestions"
```

---

## Task 7: Report Page — AI Readability & Share Button

**Files:**
- Create: `frontend/src/components/AiReadability.tsx`
- Create: `frontend/src/components/ShareButton.tsx`

- [ ] **Step 1: Create AiReadability component**

Create `frontend/src/components/AiReadability.tsx`:

```tsx
import type { AiReadability as AiReadabilityType } from '@aiviz/shared/types.js'

interface AiReadabilityProps {
  data: AiReadabilityType
}

export function AiReadability({ data }: AiReadabilityProps) {
  if ('unavailable' in data) {
    return (
      <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 text-center">
        <p className="text-gray-500">AI 可讀性評估暫時無法使用</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        AI 可讀性評估
      </h3>
      <p className="text-gray-700 leading-relaxed">{data.summary}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {data.strengths.length > 0 && (
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-sm font-medium text-green-800 mb-2">優勢</p>
            <ul className="space-y-1">
              {data.strengths.map((s, i) => (
                <li key={i} className="text-sm text-green-700 flex items-start gap-2">
                  <span className="mt-0.5">+</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {data.weaknesses.length > 0 && (
          <div className="bg-red-50 rounded-lg p-4">
            <p className="text-sm font-medium text-red-800 mb-2">需改善</p>
            <ul className="space-y-1">
              {data.weaknesses.map((w, i) => (
                <li key={i} className="text-sm text-red-700 flex items-start gap-2">
                  <span className="mt-0.5">-</span>
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create ShareButton component**

Create `frontend/src/components/ShareButton.tsx`:

```tsx
import { useState } from 'react'
import type { AnalysisResponse } from '@aiviz/shared/types.js'
import { encodeReport } from '../utils/shareEncoder'

interface ShareButtonProps {
  data: AnalysisResponse
}

export function ShareButton({ data }: ShareButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    const encoded = encodeReport(data)
    const shareUrl = `${window.location.origin}${window.location.pathname}?r=${encoded}`

    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    } catch {
      // Fallback: prompt user
      window.prompt('複製此連結分享報告：', shareUrl)
    }
  }

  return (
    <button
      onClick={handleShare}
      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
    >
      {copied ? '已複製連結!' : '分享報告'}
    </button>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add frontend/src/components/AiReadability.tsx frontend/src/components/ShareButton.tsx
git commit -m "feat: implement AI readability display and share button"
```

---

## Task 8: Assemble Report Page

**Files:**
- Create: `frontend/src/components/Report.tsx`

- [ ] **Step 1: Create Report component that assembles all pieces**

Create `frontend/src/components/Report.tsx`:

```tsx
import type { AnalysisResponse } from '@aiviz/shared/types.js'
import { ScoreCard } from './ScoreCard'
import { RadarChart } from './RadarChart'
import { RuleList } from './RuleList'
import { AiReadability } from './AiReadability'
import { FixSuggestions } from './FixSuggestions'
import { ShareButton } from './ShareButton'

interface ReportProps {
  data: AnalysisResponse
  onReset: () => void
}

export function Report({ data, onReset }: ReportProps) {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">分析報告</h1>
            <p className="text-sm text-gray-500 mt-1 break-all">{data.url}</p>
          </div>
          <div className="flex gap-2">
            <ShareButton data={data} />
            <button
              onClick={onReset}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              重新分析
            </button>
          </div>
        </div>

        {/* Score + Radar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ScoreCard
            total={data.score.total}
            basic={data.score.basic}
            advanced={data.score.advanced}
          />
          <RadarChart rules={data.rules} />
        </div>

        {/* Fix Suggestions */}
        <FixSuggestions rules={data.rules} />

        {/* AI Readability */}
        <AiReadability data={data.aiReadability} />

        {/* Detailed Rule List */}
        <RuleList rules={data.rules} />

        {/* Footer meta */}
        <div className="text-center text-xs text-gray-400 pt-4">
          分析時間：{new Date(data.analyzedAt).toLocaleString('zh-TW')} |
          爬取 {data.meta.crawlTimeMs}ms |
          AI 分析 {data.meta.aiCallTimeMs}ms
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify all imports in App.tsx are correct**

Make sure `App.tsx` imports `AnalysisProgress` and `Report` (these should already be imported from Task 2).

- [ ] **Step 3: Run frontend dev server and verify all views render**

```bash
cd frontend && npm run dev
```

Test by:
1. Landing page shows with URL input
2. (Manually test progress view by temporarily setting state)
3. (Share URL decoding if testing with mock data)

- [ ] **Step 4: Commit**

```bash
git add frontend/src/components/Report.tsx
git commit -m "feat: assemble complete report page with all components"
```

---

## Phase 6 Completion Checklist

- [ ] Landing page with URL input, feature cards, quota display
- [ ] Analysis progress view with animated step indicators
- [ ] Score card with color-coded total, basic, advanced scores
- [ ] Radar chart visualizing rule scores
- [ ] Expandable rule list with fix suggestions and copy-paste code blocks
- [ ] AI readability section with strengths/weaknesses
- [ ] Share button generating compressed URL
- [ ] Error state with retry button
- [ ] `npm run dev` in frontend/ shows all views correctly
