import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts'
import { SCORE_MAX_ACCESSIBILITY, SCORE_MAX_BASIC, SCORE_MAX_ADVANCED } from '@aiviz/shared/constants.js'

interface RadarChartProps {
  accessibility: number
  basic: number
  advanced: number
}

export function RadarChart({ accessibility, basic, advanced }: RadarChartProps) {
  const data = [
    {
      subject: 'AI 爬蟲可及性',
      score: Math.round((accessibility / SCORE_MAX_ACCESSIBILITY) * 100),
      fullMark: 100,
    },
    {
      subject: '結構化資料',
      score: Math.round((basic / SCORE_MAX_BASIC) * 100),
      fullMark: 100,
    },
    {
      subject: '進階優化',
      score: Math.round((advanced / SCORE_MAX_ADVANCED) * 100),
      fullMark: 100,
    },
  ]

  return (
    <div className="glass-card p-6 animate-fade-in-up stagger-1">
      <h3 className="text-xs font-mono text-text-dim tracking-[0.15em] uppercase mb-2">Score Distribution</h3>
      <ResponsiveContainer width="100%" height={260}>
        <RechartsRadarChart data={data} cx="50%" cy="50%" outerRadius="65%">
          <PolarGrid stroke="#e7e2dc" strokeDasharray="3 3" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: '#57534e', fontSize: 12, fontFamily: 'DM Sans' }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tickCount={5}
            tick={{ fill: '#a8a29e', fontSize: 12, fontFamily: 'JetBrains Mono' }}
            axisLine={false}
          />
          <Radar
            name="Score"
            dataKey="score"
            stroke="#0d7377"
            strokeWidth={2}
            fill="#0d7377"
            fillOpacity={0.12}
            dot={{ fill: '#0d7377', r: 4, strokeWidth: 0 }}
          />
        </RechartsRadarChart>
      </ResponsiveContainer>
    </div>
  )
}
