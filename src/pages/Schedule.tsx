import { useState } from 'react'
import { addMonths, subMonths, format, startOfMonth } from 'date-fns'
import type { Shift } from '../types'
import { CalendarGrid } from '../components/CalendarGrid'
import { ShiftForm } from '../components/ShiftForm'
import { getMonthShifts } from '../utils/time'

interface ScheduleProps {
  shifts: Shift[]
  onAddShift: (date: string, start: string, end: string) => void
  onUpdateShift: (id: string, updates: Partial<Pick<Shift, 'plannedStart' | 'plannedEnd' | 'date'>>) => void
  onDeleteShift: (id: string) => void
}

export function Schedule({ shifts, onAddShift, onUpdateShift, onDeleteShift }: ScheduleProps) {
  const [monthDate, setMonthDate] = useState(startOfMonth(new Date()))
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const monthShifts = getMonthShifts(shifts, monthDate)
  const plannedCount = monthShifts.filter((s) => s.status === 'planned').length
  const totalCount = monthShifts.length

  const now = new Date()
  const canGoBack = monthDate > subMonths(startOfMonth(now), 1)
  const canGoForward = monthDate < addMonths(startOfMonth(now), 1)

  const selectedShift = selectedDate
    ? monthShifts.find((s) => s.date === selectedDate && s.status === 'planned')
    : undefined

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
        <div className="text-center">
          <h2 className="text-lg font-bold">{format(monthDate, 'MMMM yyyy')}</h2>
          <p className="text-xs text-[var(--color-text-muted)]">
            {totalCount} shift{totalCount !== 1 ? 's' : ''} · {plannedCount} planned
          </p>
        </div>
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

      <CalendarGrid
        monthDate={monthDate}
        shifts={monthShifts}
        onDayClick={(dateStr) => setSelectedDate(dateStr)}
      />

      <div className="flex items-center gap-4 justify-center text-[10px] text-[var(--color-text-muted)]">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-[var(--color-accent-blue)]" /> Planned
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-[var(--color-accent-amber)]" /> Active
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-[var(--color-accent-emerald)]" /> Done
        </span>
      </div>

      {selectedDate && (
        <ShiftForm
          date={selectedDate}
          existingShift={selectedShift}
          onSave={(date, start, end) => {
            if (selectedShift) {
              onUpdateShift(selectedShift.id, { plannedStart: start, plannedEnd: end, date })
            } else {
              onAddShift(date, start, end)
            }
          }}
          onDelete={onDeleteShift}
          onClose={() => setSelectedDate(null)}
        />
      )}
    </div>
  )
}
