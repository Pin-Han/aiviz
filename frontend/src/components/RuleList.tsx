import { useState } from 'react'
import type { RuleCategory, RuleStatus } from '@aiviz/shared/types.js'

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
  collapsed: boolean
}

interface RuleListProps {
  rules: RuleItem[]
}

const STATUS_CONFIG: Record<RuleStatus, { icon: string; color: string; bg: string }> = {
  pass: { icon: '\u2713', color: 'text-pass', bg: 'bg-pass/10' },
  warn: { icon: '!', color: 'text-warn', bg: 'bg-warn/10' },
  fail: { icon: '\u2717', color: 'text-fail', bg: 'bg-fail/10' },
}

export function RuleList({ rules }: RuleListProps) {
  const basic = rules.filter((r) => r.category === 'basic')
  const advanced = rules.filter((r) => r.category === 'advanced')

  return (
    <div className="space-y-6 animate-fade-in-up stagger-3">
      <RuleSection title="基本項目" tag="BASIC" rules={basic} />
      <RuleSection title="進階優化" tag="ADVANCED" rules={advanced} />
    </div>
  )
}

function RuleSection({ title, tag, rules }: { title: string; tag: string; rules: RuleItem[] }) {
  const visible = rules.filter((r) => !r.collapsed)
  const collapsed = rules.filter((r) => r.collapsed)

  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <h3 className="text-sm font-semibold text-text-primary">{title}</h3>
        <span className="text-[10px] font-mono text-text-dim tracking-[0.15em] bg-surface-2 px-2 py-0.5 rounded">{tag}</span>
      </div>
      <div className="space-y-1.5">
        {visible.map((rule) => (
          <RuleRow key={rule.id} rule={rule} />
        ))}
        {collapsed.length > 0 && (
          <div className="glass-card p-4 flex items-start gap-3">
            <span className="w-6 h-6 rounded-lg bg-fail/10 flex items-center justify-center text-xs font-bold text-fail flex-shrink-0">
              {collapsed.length}
            </span>
            <div>
              <p className="text-sm text-text-muted">
                另有 {collapsed.length} 項因缺少 Product Schema 而無法檢查
              </p>
              <p className="text-xs text-text-dim mt-0.5">加入 Product Schema 後自動解鎖</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function RuleRow({ rule }: { rule: RuleItem }) {
  const [expanded, setExpanded] = useState(false)
  const config = STATUS_CONFIG[rule.status]

  return (
    <div className="glass-card overflow-hidden transition-all duration-200">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-surface-2/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className={`w-6 h-6 rounded-lg ${config.bg} flex items-center justify-center text-xs font-bold ${config.color}`}>
            {config.icon}
          </span>
          <span className="text-sm text-text-primary">{rule.name}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-text-muted">
            {rule.score}<span className="text-text-dim">/{rule.maxScore}</span>
          </span>
          <svg
            width="12" height="12" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2"
            className={`text-text-dim transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-border/50">
          <p className="text-sm text-text-muted mt-3 leading-relaxed">{rule.message}</p>
          {rule.fix && (
            <div className="mt-3 p-3 rounded-xl bg-accent/5 border border-accent/10">
              <p className="text-xs font-mono text-accent/80 tracking-wider uppercase mb-1">Fix</p>
              <p className="text-sm text-text-primary">{rule.fix}</p>
            </div>
          )}
          {rule.code && <CodeBlock code={rule.code} />}
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
    <div className="relative mt-3 group">
      <pre className="bg-[#0d1117] border border-border rounded-xl p-4 text-xs font-mono text-accent/80 overflow-x-auto leading-relaxed">
        <code>{code}</code>
      </pre>
      <button
        onClick={handleCopy}
        className="
          absolute top-2 right-2 px-2.5 py-1 rounded-lg text-[10px] font-mono tracking-wider
          bg-surface-2 border border-border text-text-dim
          hover:text-text-primary hover:border-border-hover
          opacity-0 group-hover:opacity-100 transition-all duration-200
        "
      >
        {copied ? 'COPIED' : 'COPY'}
      </button>
    </div>
  )
}
