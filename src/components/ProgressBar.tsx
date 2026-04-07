import { useState } from 'react'

interface ProgressBarProps {
  workedHours: number
  limitHours: number
  onSetLimit: (hours: number) => void
}

export function ProgressBar({ workedHours, limitHours, onSetLimit }: ProgressBarProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(String(limitHours))
  const pct = Math.min(100, (workedHours / limitHours) * 100)
  const isNearLimit = pct >= 90

  const handleSubmit = () => {
    const val = parseFloat(draft)
    if (val > 0 && val <= 744) {
      onSetLimit(val)
    } else {
      setDraft(String(limitHours))
    }
    setEditing(false)
  }

  return (
    <div className="mb-5">
      <div className="flex justify-between text-xs mb-1.5">
        <span
          className="text-[var(--color-text-secondary)] active:text-[var(--color-accent-blue)] transition-colors"
          onClick={() => { setDraft(String(limitHours)); setEditing(!editing) }}
        >
          Monthly Target: {limitHours}h
        </span>
        <span className={isNearLimit ? 'text-[var(--color-accent-red)]' : 'text-[var(--color-text-secondary)]'}>
          {pct.toFixed(1)}%
        </span>
      </div>
      {editing && (
        <div className="flex gap-2 mb-2">
          <input
            type="number"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            className="flex-1 bg-[var(--color-bg-card)] text-[var(--color-text-primary)] rounded-lg px-3 py-1.5 text-sm border border-[var(--color-border)] focus:outline-none focus:border-[var(--color-accent-blue)]"
            min="1"
            max="744"
            autoFocus
          />
          <button
            onClick={handleSubmit}
            className="px-3 py-1.5 bg-[var(--color-accent-blue)] text-white rounded-lg text-sm font-medium"
          >
            Set
          </button>
        </div>
      )}
      <div className="h-3 bg-[var(--color-bg-card)] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            isNearLimit ? 'bg-[var(--color-accent-red)]' : 'bg-[var(--color-accent-blue)]'
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
