interface ProgressBarProps {
  workedHours: number
  limitHours: number
}

export function ProgressBar({ workedHours, limitHours }: ProgressBarProps) {
  const pct = Math.min(100, (workedHours / limitHours) * 100)
  const isNearLimit = pct >= 90

  return (
    <div className="mb-5">
      <div className="flex justify-between text-xs mb-1.5">
        <span className="text-[var(--color-text-secondary)]">Monthly Progress</span>
        <span className={isNearLimit ? 'text-[var(--color-accent-red)]' : 'text-[var(--color-text-secondary)]'}>
          {pct.toFixed(1)}%
        </span>
      </div>
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
