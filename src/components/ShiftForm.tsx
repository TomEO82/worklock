import { useState } from 'react'
import { format, parseISO } from 'date-fns'
import type { Shift } from '../types'

interface ShiftFormProps {
  date: string
  existingShift?: Shift
  onSave: (date: string, start: string, end: string) => void
  onDelete?: (id: string) => void
  onClose: () => void
}

export function ShiftForm({ date, existingShift, onSave, onDelete, onClose }: ShiftFormProps) {
  const [startTime, setStartTime] = useState(existingShift?.plannedStart ?? '09:00')
  const [endTime, setEndTime] = useState(existingShift?.plannedEnd ?? '17:00')

  const formattedDate = format(parseISO(date), 'EEEE, MMM d')

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end justify-center" onClick={onClose}>
      <div
        className="bg-[var(--color-bg-secondary)] w-full max-w-md rounded-t-2xl p-5 pb-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1 bg-[var(--color-text-muted)] rounded-full mx-auto mb-4" />

        <h3 className="text-lg font-bold mb-1">
          {existingShift ? 'Edit Shift' : 'Plan Shift'}
        </h3>
        <p className="text-sm text-[var(--color-text-secondary)] mb-5">{formattedDate}</p>

        <div className="space-y-4">
          <div>
            <label className="text-xs text-[var(--color-text-muted)] block mb-1.5">Start Time</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full bg-[var(--color-bg-card)] text-[var(--color-text-primary)] rounded-lg px-4 py-3 text-base border-none outline-none"
            />
          </div>
          <div>
            <label className="text-xs text-[var(--color-text-muted)] block mb-1.5">End Time</label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full bg-[var(--color-bg-card)] text-[var(--color-text-primary)] rounded-lg px-4 py-3 text-base border-none outline-none"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          {existingShift && onDelete && existingShift.status === 'planned' && (
            <button
              onClick={() => onDelete(existingShift.id)}
              className="flex-1 py-3 rounded-xl bg-[var(--color-accent-red)]/20 text-[var(--color-accent-red)] font-semibold text-sm"
            >
              Delete
            </button>
          )}
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-[var(--color-bg-card)] text-[var(--color-text-secondary)] font-semibold text-sm"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSave(date, startTime, endTime)
              onClose()
            }}
            className="flex-1 py-3 rounded-xl bg-[var(--color-accent-blue)] text-white font-semibold text-sm"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}
