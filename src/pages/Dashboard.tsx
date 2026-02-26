import type { Shift } from '../types'
import { useTimer } from '../hooks/useTimer'
import { useNotification } from '../hooks/useNotification'
import { PunchButton } from '../components/PunchButton'
import { LiveTimer } from '../components/LiveTimer'
import { ProgressBar } from '../components/ProgressBar'
import { MonthStats } from '../components/MonthStats'
import { getTotalWorkedSeconds, getRemainingPlannedShifts } from '../utils/time'
import { format, addSeconds } from 'date-fns'

interface DashboardProps {
  shifts: Shift[]
  activeShift: Shift | null
  monthlyLimitHours: number
  onPunchIn: () => void
  onPunchOut: () => void
}

export function Dashboard({
  shifts,
  activeShift,
  monthlyLimitHours,
  onPunchIn,
  onPunchOut,
}: DashboardProps) {
  const now = useTimer(!!activeShift)
  const { showWarningBanner, permissionState, requestPermission } = useNotification(
    shifts,
    activeShift,
    monthlyLimitHours
  )

  const monthDate = new Date()
  const workedSeconds = getTotalWorkedSeconds(shifts, monthDate, now)
  const limitSeconds = monthlyLimitHours * 3600
  const remainingSeconds = limitSeconds - workedSeconds
  const remainingShifts = getRemainingPlannedShifts(shifts, monthDate)

  let expectedEndTime: string | null = null
  if (activeShift?.startTime && remainingShifts > 0) {
    const perShiftSeconds = remainingSeconds / remainingShifts
    const expectedEnd = addSeconds(now, perShiftSeconds)
    expectedEndTime = format(expectedEnd, 'HH:mm')
  }

  return (
    <div className="space-y-4">
      {showWarningBanner && (
        <div className="bg-[var(--color-accent-red)]/20 border border-[var(--color-accent-red)]/40 rounded-xl p-3 text-center">
          <p className="text-sm font-semibold text-[var(--color-accent-red)]">
            Less than 1 hour until your {monthlyLimitHours}h monthly limit!
          </p>
        </div>
      )}

      {typeof Notification !== 'undefined' && permissionState === 'default' && (
        <button
          onClick={requestPermission}
          className="w-full bg-[var(--color-bg-secondary)] rounded-xl p-3 text-center text-sm text-[var(--color-text-secondary)]"
        >
          Tap to enable shift notifications
        </button>
      )}

      <PunchButton isActive={!!activeShift} onPunch={activeShift ? onPunchOut : onPunchIn} />
      <LiveTimer activeShift={activeShift} now={now} />
      <ProgressBar workedHours={workedSeconds / 3600} limitHours={monthlyLimitHours} />
      <MonthStats
        workedSeconds={workedSeconds}
        remainingSeconds={remainingSeconds}
        remainingShifts={remainingShifts}
        expectedEndTime={expectedEndTime}
      />
    </div>
  )
}
