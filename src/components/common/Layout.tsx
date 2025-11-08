import { GitBranch, ChartLine, BookOpen, Gear } from '@phosphor-icons/react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface LayoutProps {
  children: React.ReactNode
  activeTab: string
  onTabChange: (tab: string) => void
}

export function Layout({ children, activeTab, onTabChange }: LayoutProps) {
  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <header className="flex items-center justify-between px-6 py-3 border-b border-border bg-card/80 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <GitBranch className="text-accent" size={28} weight="bold" />
            <h1 className="text-2xl font-bold tracking-tight">ForexFlow</h1>
          </div>
          <span className="text-xs text-muted-foreground px-2 py-1 rounded bg-muted/50">
            v1.0.0-alpha
          </span>
        </div>
        
        <Tabs value={activeTab} onValueChange={onTabChange}>
          <TabsList className="bg-secondary">
            <TabsTrigger value="builder" className="gap-2">
              <GitBranch size={18} />
              Builder
            </TabsTrigger>
            <TabsTrigger value="backtest" className="gap-2">
              <ChartLine size={18} />
              Backtest
            </TabsTrigger>
            <TabsTrigger value="library" className="gap-2">
              <BookOpen size={18} />
              Library
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Gear size={18} />
              Settings
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </header>
      
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  )
}
