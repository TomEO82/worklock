import { useState, useCallback, useEffect } from 'react'
import type { Shift, AppState } from '../types'
import { loadState, saveState } from '../utils/storage'
import { generateId } from '../utils/time'
import { format } from 'date-fns'

export function useShifts() {
  const [state, setState] = useState<AppState>(loadState)

  useEffect(() => {
    saveState(state)
  }, [state])

  const activeShift = state.shifts.find((s) => s.status === 'active') ?? null

  const punchIn = useCallback(() => {
    const now = new Date()
    const todayStr = format(now, 'yyyy-MM-dd')
    const existing = state.shifts.find(
      (s) => s.date === todayStr && s.status === 'planned'
    )

    if (existing) {
      setState((prev) => ({
        ...prev,
        shifts: prev.shifts.map((s) =>
          s.id === existing.id
            ? { ...s, status: 'active' as const, startTime: now.toISOString() }
            : s
        ),
      }))
    } else {
      const shift: Shift = {
        id: generateId(),
        date: todayStr,
        startTime: now.toISOString(),
        endTime: null,
        plannedStart: null,
        plannedEnd: null,
        status: 'active',
      }
      setState((prev) => ({ ...prev, shifts: [...prev.shifts, shift] }))
    }
  }, [state.shifts])

  const punchOut = useCallback(() => {
    const now = new Date()
    setState((prev) => ({
      ...prev,
      shifts: prev.shifts.map((s) =>
        s.status === 'active'
          ? { ...s, status: 'completed' as const, endTime: now.toISOString() }
          : s
      ),
    }))
  }, [])

  const addPlannedShift = useCallback(
    (date: string, plannedStart: string, plannedEnd: string) => {
      const shift: Shift = {
        id: generateId(),
        date,
        startTime: null,
        endTime: null,
        plannedStart,
        plannedEnd,
        status: 'planned',
      }
      setState((prev) => ({ ...prev, shifts: [...prev.shifts, shift] }))
    },
    []
  )

  const deleteShift = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      shifts: prev.shifts.filter((s) => s.id !== id),
    }))
  }, [])

  const updateShift = useCallback(
    (id: string, updates: Partial<Pick<Shift, 'plannedStart' | 'plannedEnd' | 'date' | 'startTime' | 'endTime'>>) => {
      setState((prev) => ({
        ...prev,
        shifts: prev.shifts.map((s) => (s.id === id ? { ...s, ...updates } : s)),
      }))
    },
    []
  )

  const setMonthlyLimit = useCallback((hours: number) => {
    setState((prev) => ({ ...prev, monthlyLimitHours: hours }))
  }, [])

  return {
    shifts: state.shifts,
    activeShift,
    monthlyLimitHours: state.monthlyLimitHours,
    punchIn,
    punchOut,
    addPlannedShift,
    deleteShift,
    updateShift,
    setMonthlyLimit,
  }
}
