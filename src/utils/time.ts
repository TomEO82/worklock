import { format, differenceInSeconds, startOfMonth, endOfMonth, parseISO } from 'date-fns'
import type { Shift } from '../types'

export function formatDuration(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function formatHoursMinutes(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  return `${h}h ${String(m).padStart(2, '0')}m`
}

export function getShiftDurationSeconds(shift: Shift, now?: Date): number {
  if (!shift.startTime) return 0
  const start = parseISO(shift.startTime)
  const end = shift.endTime ? parseISO(shift.endTime) : (now ?? new Date())
  return Math.max(0, differenceInSeconds(end, start))
}

export function getMonthKey(date: Date): string {
  return format(date, 'yyyy-MM')
}

export function getMonthShifts(shifts: Shift[], monthDate: Date): Shift[] {
  const monthStart = format(startOfMonth(monthDate), 'yyyy-MM-dd')
  const monthEnd = format(endOfMonth(monthDate), 'yyyy-MM-dd')
  return shifts.filter((s) => s.date >= monthStart && s.date <= monthEnd)
}

export function getTotalWorkedSeconds(shifts: Shift[], monthDate: Date, now?: Date): number {
  const monthShifts = getMonthShifts(shifts, monthDate)
  return monthShifts.reduce((total, shift) => {
    if (shift.status === 'planned') return total
    return total + getShiftDurationSeconds(shift, now)
  }, 0)
}

export function getRemainingPlannedShifts(shifts: Shift[], monthDate: Date): number {
  const monthShifts = getMonthShifts(shifts, monthDate)
  return monthShifts.filter(
    (s) => s.status === 'planned' || s.status === 'active'
  ).length
}

export function formatTime(isoString: string): string {
  return format(parseISO(isoString), 'HH:mm')
}

export function formatDate(dateStr: string): string {
  return format(parseISO(dateStr), 'EEE, MMM d')
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}
