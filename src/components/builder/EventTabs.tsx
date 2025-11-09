import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { EventCategory } from '@/constants/node-categories'

interface EventTabsProps {
  activeEvent: EventCategory
  onEventChange: (event: EventCategory) => void
}

const EVENT_TABS = [
  { id: 'oninit' as const, label: 'on Init', color: 'text-purple-400' },
  { id: 'ontick' as const, label: 'on Tick', color: 'text-primary' },
  { id: 'ontimer' as const, label: 'on Timer', color: 'text-blue-400' },
  { id: 'ontrade' as const, label: 'on Trade', color: 'text-green-400' },
  { id: 'onchart' as const, label: 'on Chart', color: 'text-yellow-400' },
  { id: 'ondeinit' as const, label: 'on Deinit', color: 'text-red-400' },
]

export function EventTabs({ activeEvent, onEventChange }: EventTabsProps) {
  return (
    <div className="flex items-center gap-1 px-2 py-1.5 bg-card/50 border-b border-border">
      <Tabs value={activeEvent === 'all' ? 'ontick' : activeEvent} onValueChange={(v) => onEventChange(v as EventCategory)}>
        <TabsList className="h-8 bg-background/50">
          {EVENT_TABS.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className={`h-7 px-3 text-xs ${tab.color} data-[state=active]:bg-primary/20 data-[state=active]:text-primary`}
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  )
}
