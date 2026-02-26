interface PunchButtonProps {
  isActive: boolean
  onPunch: () => void
}

export function PunchButton({ isActive, onPunch }: PunchButtonProps) {
  return (
    <div className="flex justify-center py-6">
      <button
        onClick={onPunch}
        className={`relative w-36 h-36 rounded-full font-bold text-lg text-white transition-all duration-300 active:scale-95 ${
          isActive
            ? 'bg-[var(--color-accent-red)] shadow-[0_0_30px_rgba(239,68,68,0.4)]'
            : 'bg-[var(--color-accent-emerald)] shadow-[0_0_30px_rgba(16,185,129,0.4)]'
        }`}
      >
        <span className="relative z-10">{isActive ? 'PUNCH OUT' : 'PUNCH IN'}</span>
        {isActive && (
          <span className="absolute inset-0 rounded-full bg-[var(--color-accent-red)] animate-pulse-glow opacity-30" />
        )}
      </button>
    </div>
  )
}
