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
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between animate-fade-in-up">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-accent tracking-[0.15em]">REPORT</span>
              <span className="w-1 h-1 rounded-full bg-text-dim" />
              <span className="text-xs font-mono text-text-dim">
                {new Date(data.analyzedAt).toLocaleString('zh-TW')}
              </span>
            </div>
            <p className="text-sm text-text-muted truncate max-w-lg">{data.url}</p>
          </div>
          <div className="flex gap-2 flex-shrink-0 ml-4">
            <ShareButton data={data} />
            <button
              onClick={onReset}
              className="
                flex items-center gap-2 px-4 py-2.5
                bg-accent text-bg rounded-xl text-xs font-mono font-semibold tracking-wider
                hover:bg-accent/90 active:scale-[0.97]
                transition-all duration-200
              "
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="23 4 23 10 17 10"/>
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
              </svg>
              RESCAN
            </button>
          </div>
        </div>

        {/* Score + Radar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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

        {/* Footer */}
        <div className="text-center pt-4 pb-8">
          <p className="text-[10px] font-mono text-text-dim tracking-[0.15em]">
            CRAWL {data.meta.crawlTimeMs}ms &middot; AI {data.meta.aiCallTimeMs}ms &middot; AIViz v1.0
          </p>
        </div>
      </div>
    </div>
  )
}
