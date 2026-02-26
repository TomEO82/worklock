import { formatHoursMinutes } from '../utils/time'

interface MonthStatsProps {
  workedSeconds: number
  remainingSeconds: number
  remainingShifts: number
  expectedEndTime: string | null
}

export function MonthStats({
  workedSeconds,
  remainingSeconds,
  remainingShifts,
  expectedEndTime,
}: MonthStatsProps) {
  const perShiftSeconds = remainingShifts > 0 ? remainingSeconds / remainingShifts : 0

  const cards = [
    { label: 'Worked', value: formatHoursMinutes(workedSeconds), color: 'var(--color-accent-emerald)' },
    { label: 'Remaining', value: formatHoursMinutes(Math.max(0, remainingSeconds)), color: 'var(--color-accent-blue)' },
    {
      label: 'Per Shift',
      value: remainingShifts > 0 ? formatHoursMinutes(perShiftSeconds) : '--',
      color: 'var(--color-accent-amber)',
      sub: remainingShifts > 0 ? `${remainingShifts} shift${remainingShifts !== 1 ? 's' : ''} left` : 'No shifts planned',
    },
  ]

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-3">
        {cards.map((card) => (
          <div
            key={card.label}
            className="bg-[var(--color-bg-secondary)] rounded-xl p-3 text-center"
          >
            <p className="text-[11px] text-[var(--color-text-muted)] mb-1">{card.label}</p>
            <p className="text-base font-bold" style={{ color: card.color }}>
              {card.value}
            </p>
            {card.sub && (
              <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5">{card.sub}</p>
            )}
          </div>
        ))}
      </div>

      {expectedEndTime && (
        <div className="bg-[var(--color-bg-secondary)] rounded-xl p-3 text-center border border-[var(--color-accent-blue)]/20">
          <p className="text-[11px] text-[var(--color-text-muted)] mb-0.5">Expected Shift End</p>
          <p className="text-lg font-bold text-[var(--color-accent-blue)]">{expectedEndTime}</p>
          <p className="text-[10px] text-[var(--color-text-muted)]">based on remaining hours / shifts</p>
        </div>
      )}
    </div>
  )
}
