import { useState } from 'react'
import { addMonths, subMonths, format, startOfMonth } from 'date-fns'
import type { Shift } from '../types'
import { ShiftCard } from '../components/ShiftCard'
import { getMonthShifts, getTotalWorkedSeconds, formatHoursMinutes } from '../utils/time'
import { useTimer } from '../hooks/useTimer'

interface HistoryProps {
  shifts: Shift[]
  monthlyLimitHours: number
}

export function History({ shifts, monthlyLimitHours }: HistoryProps) {
  const [monthDate, setMonthDate] = useState(startOfMonth(new Date()))
  const hasActive = shifts.some((s) => s.status === 'active')
  const now = useTimer(hasActive)

  const monthShifts = getMonthShifts(shifts, monthDate)
    .filter((s) => s.status !== 'planned')
    .sort((a, b) => {
      if (!a.startTime || !b.startTime) return 0
      return b.startTime.localeCompare(a.startTime)
    })

  const totalWorked = getTotalWorkedSeconds(shifts, monthDate, now)

  const nowDate = new Date()
  const canGoBack = monthDate > subMonths(startOfMonth(nowDate), 1)
  const canGoForward = monthDate < addMonths(startOfMonth(nowDate), 1)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button
          onClick={() => canGoBack && setMonthDate((d) => subMonths(d, 1))}
          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            canGoBack ? 'text-[var(--color-text-primary)] bg-[var(--color-bg-secondary)]' : 'opacity-30'
          }`}
          disabled={!canGoBack}
        >
          ‹
        </button>
        <h2 className="text-lg font-bold">{format(monthDate, 'MMMM yyyy')}</h2>
        <button
          onClick={() => canGoForward && setMonthDate((d) => addMonths(d, 1))}
          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            canGoForward ? 'text-[var(--color-text-primary)] bg-[var(--color-bg-secondary)]' : 'opacity-30'
          }`}
          disabled={!canGoForward}
        >
          ›
        </button>
      </div>

      <div className="bg-[var(--color-bg-secondary)] rounded-xl p-4 text-center">
        <p className="text-xs text-[var(--color-text-muted)]">Total Worked</p>
        <p className="text-2xl font-bold text-[var(--color-accent-emerald)]">
          {formatHoursMinutes(totalWorked)}
        </p>
        <p className="text-xs text-[var(--color-text-muted)] mt-1">
          of {monthlyLimitHours}h limit · {monthShifts.length} shift{monthShifts.length !== 1 ? 's' : ''}
        </p>
      </div>

      {monthShifts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-[var(--color-text-muted)] text-sm">No shifts recorded yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {monthShifts.map((shift) => (
            <ShiftCard key={shift.id} shift={shift} now={now} />
          ))}
        </div>
      )}
    </div>
  )
}
