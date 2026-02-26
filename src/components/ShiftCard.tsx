import type { Shift } from '../types'
import { formatDate, formatTime, getShiftDurationSeconds, formatHoursMinutes } from '../utils/time'

interface ShiftCardProps {
  shift: Shift
  now?: Date
}

export function ShiftCard({ shift, now }: ShiftCardProps) {
  const statusConfig = {
    completed: { color: 'var(--color-accent-emerald)', label: 'Completed', dot: 'bg-[var(--color-accent-emerald)]' },
    active: { color: 'var(--color-accent-amber)', label: 'Active', dot: 'bg-[var(--color-accent-amber)]' },
    planned: { color: 'var(--color-accent-blue)', label: 'Planned', dot: 'bg-[var(--color-accent-blue)]' },
  }

  const config = statusConfig[shift.status]
  const duration = shift.startTime ? getShiftDurationSeconds(shift, now) : 0

  return (
    <div className="bg-[var(--color-bg-secondary)] rounded-xl p-4 flex items-center gap-4">
      <div className={`w-1 h-12 rounded-full ${config.dot}`} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold">{formatDate(shift.date)}</p>
        <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
          {shift.startTime
            ? `${formatTime(shift.startTime)}${shift.endTime ? ` - ${formatTime(shift.endTime)}` : ' - ...'}`
            : shift.plannedStart && shift.plannedEnd
              ? `Planned: ${shift.plannedStart} - ${shift.plannedEnd}`
              : 'Planned'}
        </p>
      </div>
      <div className="text-right">
        <p className="text-xs font-medium" style={{ color: config.color }}>
          {config.label}
        </p>
        {duration > 0 && (
          <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
            {formatHoursMinutes(duration)}
          </p>
        )}
      </div>
    </div>
  )
}
