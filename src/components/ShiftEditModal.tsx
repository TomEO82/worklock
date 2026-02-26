import { useState } from 'react'
import { format, parseISO } from 'date-fns'
import type { Shift } from '../types'

interface ShiftEditModalProps {
  shift: Shift
  onSave: (id: string, updates: Partial<Pick<Shift, 'plannedStart' | 'plannedEnd' | 'date' | 'startTime' | 'endTime'>>) => void
  onDelete: (id: string) => void
  onClose: () => void
}

export function ShiftEditModal({ shift, onSave, onDelete, onClose }: ShiftEditModalProps) {
  const isRecorded = shift.status === 'completed' || shift.status === 'active'

  const initialStart = isRecorded && shift.startTime
    ? format(parseISO(shift.startTime), 'HH:mm')
    : shift.plannedStart ?? '09:00'
  const initialEnd = isRecorded && shift.endTime
    ? format(parseISO(shift.endTime), 'HH:mm')
    : shift.plannedEnd ?? '17:00'

  const [startTime, setStartTime] = useState(initialStart)
  const [endTime, setEndTime] = useState(initialEnd)
  const [date, setDate] = useState(shift.date)

  const formattedDate = format(parseISO(date), 'EEEE, MMM d')

  const handleSave = () => {
    if (isRecorded) {
      const startISO = new Date(`${date}T${startTime}:00`).toISOString()
      const endISO = shift.endTime ? new Date(`${date}T${endTime}:00`).toISOString() : null
      onSave(shift.id, { date, startTime: startISO, endTime: endISO })
    } else {
      onSave(shift.id, { date, plannedStart: startTime, plannedEnd: endTime })
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end justify-center" onClick={onClose}>
      <div
        className="bg-[var(--color-bg-secondary)] w-full max-w-md rounded-t-2xl p-5 pb-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1 bg-[var(--color-text-muted)] rounded-full mx-auto mb-4" />

        <h3 className="text-lg font-bold mb-1">Edit Shift</h3>
        <p className="text-sm text-[var(--color-text-secondary)] mb-5">{formattedDate}</p>

        <div className="space-y-4">
          <div>
            <label className="text-xs text-[var(--color-text-muted)] block mb-1.5">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-[var(--color-bg-card)] text-[var(--color-text-primary)] rounded-lg px-4 py-3 text-base border-none outline-none"
            />
          </div>
          <div>
            <label className="text-xs text-[var(--color-text-muted)] block mb-1.5">Start Time</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full bg-[var(--color-bg-card)] text-[var(--color-text-primary)] rounded-lg px-4 py-3 text-base border-none outline-none"
            />
          </div>
          {(shift.status !== 'active') && (
            <div>
              <label className="text-xs text-[var(--color-text-muted)] block mb-1.5">End Time</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full bg-[var(--color-bg-card)] text-[var(--color-text-primary)] rounded-lg px-4 py-3 text-base border-none outline-none"
              />
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={() => { onDelete(shift.id); onClose() }}
            className="flex-1 py-3 rounded-xl bg-[var(--color-accent-red)]/20 text-[var(--color-accent-red)] font-semibold text-sm"
          >
            Delete
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-[var(--color-bg-card)] text-[var(--color-text-secondary)] font-semibold text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-3 rounded-xl bg-[var(--color-accent-blue)] text-white font-semibold text-sm"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}
