import { useState, useEffect, useRef } from 'react'

export function useTimer(isActive: boolean) {
  const [now, setNow] = useState(new Date())
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (isActive) {
      setNow(new Date())
      intervalRef.current = setInterval(() => {
        setNow(new Date())
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isActive])

  return now
}
