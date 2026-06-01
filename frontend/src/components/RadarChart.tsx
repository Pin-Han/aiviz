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
          <PolarGrid stroke="#1e2d3d" strokeDasharray="3 3" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: '#7a8ba3', fontSize: 12, fontFamily: 'DM Sans' }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tickCount={5}
            tick={{ fill: '#4a5568', fontSize: 9, fontFamily: 'JetBrains Mono' }}
            axisLine={false}
          />
          <Radar
            name="Score"
            dataKey="score"
            stroke="#38bdf8"
            strokeWidth={2}
            fill="#38bdf8"
            fillOpacity={0.15}
            dot={{ fill: '#38bdf8', r: 4, strokeWidth: 0 }}
          />
        </RechartsRadarChart>
      </ResponsiveContainer>
    </div>
  )
}
