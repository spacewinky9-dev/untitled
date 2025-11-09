import { GitBranch, ChartLine, BookOpen, Gear } from '@phosphor-icons/react'

interface LayoutProps {
  children: React.ReactNode
  activeTab: string
  onTabChange: (tab: string) => void
}

export function Layout({ children, activeTab, onTabChange }: LayoutProps) {
  return (
    <div className="flex flex-col h-screen bg-[#484848] text-foreground">
      <header className="flex items-center justify-between px-4 py-2 border-b border-[#555] bg-[#3a3a3a]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <GitBranch className="text-accent" size={24} weight="bold" />
            <h1 className="text-xl font-bold tracking-tight">ForexFlow</h1>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <button
            onClick={() => onTabChange('builder')}
            className={`px-4 py-1.5 text-[11px] font-semibold transition-colors ${
              activeTab === 'builder'
                ? 'bg-[#FF8C42] text-black'
                : 'bg-[#4a4a4a] text-[#ccc] hover:bg-[#555]'
            }`}
          >
            Builder
          </button>
          <button
            onClick={() => onTabChange('backtest')}
            className={`px-4 py-1.5 text-[11px] font-semibold transition-colors ${
              activeTab === 'backtest'
                ? 'bg-[#FF8C42] text-black'
                : 'bg-[#4a4a4a] text-[#ccc] hover:bg-[#555]'
            }`}
          >
            Backtest
          </button>
          <button
            onClick={() => onTabChange('library')}
            className={`px-4 py-1.5 text-[11px] font-semibold transition-colors ${
              activeTab === 'library'
                ? 'bg-[#FF8C42] text-black'
                : 'bg-[#4a4a4a] text-[#ccc] hover:bg-[#555]'
            }`}
          >
            Library
          </button>
          <button
            onClick={() => onTabChange('settings')}
            className={`px-4 py-1.5 text-[11px] font-semibold transition-colors ${
              activeTab === 'settings'
                ? 'bg-[#FF8C42] text-black'
                : 'bg-[#4a4a4a] text-[#ccc] hover:bg-[#555]'
            }`}
          >
            Settings
          </button>
        </div>
      </header>
      
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  )
}
