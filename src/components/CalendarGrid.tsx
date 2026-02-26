import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  format,
  isSameMonth,
  isToday,
} from 'date-fns'
import type { Shift } from '../types'

interface CalendarGridProps {
  monthDate: Date
  shifts: Shift[]
  onDayClick: (dateStr: string) => void
}

export function CalendarGrid({ monthDate, shifts, onDayClick }: CalendarGridProps) {
  const monthStart = startOfMonth(monthDate)
  const monthEnd = endOfMonth(monthDate)
  const calStart = startOfWeek(monthStart, { weekStartsOn: 0 })
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 0 })

  const days: Date[] = []
  let cursor = calStart
  while (cursor <= calEnd) {
    days.push(cursor)
    cursor = addDays(cursor, 1)
  }

  const shiftsByDate = new Map<string, Shift[]>()
  for (const s of shifts) {
    const existing = shiftsByDate.get(s.date) ?? []
    existing.push(s)
    shiftsByDate.set(s.date, existing)
  }

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div>
      <div className="grid grid-cols-7 gap-1 mb-1">
        {weekDays.map((d) => (
          <div key={d} className="text-center text-[10px] text-[var(--color-text-muted)] py-1">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const dateStr = format(day, 'yyyy-MM-dd')
          const dayShifts = shiftsByDate.get(dateStr) ?? []
          const inMonth = isSameMonth(day, monthDate)
          const today = isToday(day)

          let dotColor = ''
          if (dayShifts.some((s) => s.status === 'active')) dotColor = 'bg-[var(--color-accent-amber)]'
          else if (dayShifts.some((s) => s.status === 'completed')) dotColor = 'bg-[var(--color-accent-emerald)]'
          else if (dayShifts.some((s) => s.status === 'planned')) dotColor = 'bg-[var(--color-accent-blue)]'

          return (
            <button
              key={dateStr}
              onClick={() => inMonth && onDayClick(dateStr)}
              className={`relative flex flex-col items-center justify-center h-11 rounded-lg transition-colors ${
                !inMonth
                  ? 'opacity-20 pointer-events-none'
                  : 'active:bg-[var(--color-bg-card)]'
              } ${today ? 'ring-1 ring-[var(--color-accent-blue)]' : ''}`}
            >
              <span
                className={`text-sm ${
                  today ? 'text-[var(--color-accent-blue)] font-bold' : 'text-[var(--color-text-primary)]'
                }`}
              >
                {format(day, 'd')}
              </span>
              {dotColor && <span className={`w-1.5 h-1.5 rounded-full ${dotColor} mt-0.5`} />}
            </button>
          )
        })}
      </div>
    </div>
  )
}
