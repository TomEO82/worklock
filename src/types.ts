export interface Shift {
  id: string
  date: string // YYYY-MM-DD
  startTime: string | null // ISO timestamp
  endTime: string | null // ISO timestamp
  plannedStart: string | null // HH:MM
  plannedEnd: string | null // HH:MM
  status: 'planned' | 'active' | 'completed'
}

export interface AppState {
  monthlyLimitHours: number
  shifts: Shift[]
}

export type Page = 'dashboard' | 'schedule' | 'history'
