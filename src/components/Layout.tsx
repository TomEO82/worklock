import type { Page } from '../types'

interface LayoutProps {
  currentPage: Page
  onNavigate: (page: Page) => void
  children: React.ReactNode
}

function DashboardIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

function ScheduleIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
}

function HistoryIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  )
}

const tabIcons: Record<Page, () => React.JSX.Element> = {
  dashboard: DashboardIcon,
  schedule: ScheduleIcon,
  history: HistoryIcon,
}

export function Layout({ currentPage, onNavigate, children }: LayoutProps) {
  const tabs: { page: Page; label: string }[] = [
    { page: 'dashboard', label: 'Dashboard' },
    { page: 'schedule', label: 'Schedule' },
    { page: 'history', label: 'History' },
  ]

  return (
    <div className="flex flex-col" style={{ height: '100dvh' }}>
      <header className="px-5 pt-3 pb-2 bg-[var(--color-bg-primary)] border-b border-[var(--color-border)] flex items-baseline justify-between">
        <h1 className="text-xl font-bold tracking-tight">
          Work<span className="text-[var(--color-accent-blue)]">Lock</span>
        </h1>
        <span className="text-[10px] text-[var(--color-text-muted)]">v1.3.0</span>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-4">{children}</main>

      <nav className="flex border-t border-[var(--color-border)] bg-[var(--color-bg-secondary)] pb-[env(safe-area-inset-bottom)]">
        {tabs.map((tab) => {
          const Icon = tabIcons[tab.page]
          return (
            <button
              key={tab.page}
              onClick={() => onNavigate(tab.page)}
              className={`flex-1 flex flex-col items-center py-3 gap-1 transition-colors ${
                currentPage === tab.page
                  ? 'text-[var(--color-accent-blue)]'
                  : 'text-[var(--color-text-muted)]'
              }`}
            >
              <Icon />
              <span className="text-[11px] font-medium">{tab.label}</span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}
