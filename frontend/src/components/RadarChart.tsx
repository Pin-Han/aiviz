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
    subject: r.name.length > 5 ? r.name.slice(0, 5) + '...' : r.name,
    fullName: r.name,
    score: Math.round((r.score / r.maxScore) * 100),
    fullMark: 100,
  }))

  return (
    <div className="glass-card p-6 animate-fade-in-up stagger-1">
      <h3 className="text-xs font-mono text-text-dim tracking-[0.15em] uppercase mb-4">Score Distribution</h3>
      <ResponsiveContainer width="100%" height={260}>
        <RechartsRadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
          <PolarGrid stroke="#1e2d3d" strokeDasharray="3 3" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: '#7a8ba3', fontSize: 10, fontFamily: 'JetBrains Mono' }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={false}
            axisLine={false}
          />
          <Radar
            name="Score"
            dataKey="score"
            stroke="#38bdf8"
            strokeWidth={2}
            fill="#38bdf8"
            fillOpacity={0.12}
            dot={{ fill: '#38bdf8', r: 3 }}
          />
        </RechartsRadarChart>
      </ResponsiveContainer>
    </div>
  )
}
