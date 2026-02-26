import type { Page } from '../types'

interface LayoutProps {
  currentPage: Page
  onNavigate: (page: Page) => void
  children: React.ReactNode
}

export function Layout({ currentPage, onNavigate, children }: LayoutProps) {
  const tabs: { page: Page; label: string; icon: string }[] = [
    { page: 'dashboard', label: 'Dashboard', icon: '⏱' },
    { page: 'schedule', label: 'Schedule', icon: '📅' },
    { page: 'history', label: 'History', icon: '📋' },
  ]

  return (
    <div className="flex flex-col h-full">
      <header className="px-5 pt-3 pb-2 bg-[var(--color-bg-primary)] border-b border-[var(--color-border)]">
        <h1 className="text-xl font-bold tracking-tight">
          Work<span className="text-[var(--color-accent-blue)]">Lock</span>
        </h1>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-4">{children}</main>

      <nav className="flex border-t border-[var(--color-border)] bg-[var(--color-bg-secondary)] pb-[env(safe-area-inset-bottom)]">
        {tabs.map((tab) => (
          <button
            key={tab.page}
            onClick={() => onNavigate(tab.page)}
            className={`flex-1 flex flex-col items-center py-2.5 gap-0.5 transition-colors ${
              currentPage === tab.page
                ? 'text-[var(--color-accent-blue)]'
                : 'text-[var(--color-text-muted)]'
            }`}
          >
            <span className="text-lg">{tab.icon}</span>
            <span className="text-[11px] font-medium">{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}
