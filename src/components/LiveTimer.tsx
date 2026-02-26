import type { Shift } from '../types'
import { getShiftDurationSeconds, formatDuration } from '../utils/time'

interface LiveTimerProps {
  activeShift: Shift | null
  now: Date
}

export function LiveTimer({ activeShift, now }: LiveTimerProps) {
  if (!activeShift) return null

  const seconds = getShiftDurationSeconds(activeShift, now)

  return (
    <div className="text-center mb-4">
      <p className="text-[var(--color-text-secondary)] text-sm mb-1">Current Shift</p>
      <p className="text-4xl font-mono font-bold tracking-wider text-[var(--color-accent-blue)] animate-pulse-glow">
        {formatDuration(seconds)}
      </p>
    </div>
  )
}
