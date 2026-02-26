import { useState } from 'react'
import type { Page } from './types'
import { Layout } from './components/Layout'
import { Dashboard } from './pages/Dashboard'
import { Schedule } from './pages/Schedule'
import { History } from './pages/History'
import { useShifts } from './hooks/useShifts'

function App() {
  const [page, setPage] = useState<Page>('dashboard')
  const {
    shifts,
    activeShift,
    monthlyLimitHours,
    punchIn,
    punchOut,
    addPlannedShift,
    deleteShift,
  } = useShifts()

  return (
    <Layout currentPage={page} onNavigate={setPage}>
      {page === 'dashboard' && (
        <Dashboard
          shifts={shifts}
          activeShift={activeShift}
          monthlyLimitHours={monthlyLimitHours}
          onPunchIn={punchIn}
          onPunchOut={punchOut}
        />
      )}
      {page === 'schedule' && (
        <Schedule
          shifts={shifts}
          onAddShift={addPlannedShift}
          onDeleteShift={deleteShift}
        />
      )}
      {page === 'history' && (
        <History shifts={shifts} monthlyLimitHours={monthlyLimitHours} />
      )}
    </Layout>
  )
}

export default App
