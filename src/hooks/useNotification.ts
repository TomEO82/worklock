import { useEffect, useRef, useCallback, useState } from 'react'
import type { Shift } from '../types'
import { getTotalWorkedSeconds } from '../utils/time'

export function useNotification(
  shifts: Shift[],
  activeShift: Shift | null,
  monthlyLimitHours: number
) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [permissionState, setPermissionState] = useState<NotificationPermission>(
    typeof Notification !== 'undefined' ? Notification.permission : 'denied'
  )
  const [showWarningBanner, setShowWarningBanner] = useState(false)

  const requestPermission = useCallback(async () => {
    if (typeof Notification === 'undefined') return
    if (Notification.permission === 'default') {
      const result = await Notification.requestPermission()
      setPermissionState(result)
    }
  }, [])

  useEffect(() => {
    if (!activeShift?.startTime) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
      setShowWarningBanner(false)
      return
    }

    const now = new Date()
    const monthDate = now
    const totalWorkedSec = getTotalWorkedSeconds(shifts, monthDate, now)
    const warningThresholdSec = (monthlyLimitHours - 1) * 3600

    // Already past the warning
    if (totalWorkedSec >= warningThresholdSec) {
      setShowWarningBanner(true)
      return
    }

    const secondsUntilWarning = warningThresholdSec - totalWorkedSec
    const msUntilWarning = secondsUntilWarning * 1000

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      setShowWarningBanner(true)
      if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
        new Notification('WorkLock', {
          body: `1 hour remaining until your ${monthlyLimitHours}h monthly limit!`,
          icon: '/worklock/icon-192.png',
        })
      }
    }, msUntilWarning)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }
  }, [activeShift, shifts, monthlyLimitHours])

  // Check if close to limit even without active shift
  useEffect(() => {
    const now = new Date()
    const totalWorkedSec = getTotalWorkedSeconds(shifts, now, now)
    const warningThresholdSec = (monthlyLimitHours - 1) * 3600
    setShowWarningBanner(totalWorkedSec >= warningThresholdSec)
  }, [shifts, monthlyLimitHours])

  return { permissionState, requestPermission, showWarningBanner }
}
