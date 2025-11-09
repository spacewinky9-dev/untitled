import { EventCategory } from '@/constants/node-categories'
import { cn } from '@/lib/utils'

interface EventTabsProps {
  activeEvent: EventCategory
  onEventChange: (event: EventCategory) => void
}

const EVENT_TABS = [
  { id: 'oninit' as const, label: 'on Init' },
  { id: 'ontick' as const, label: 'on Tick' },
  { id: 'ontimer' as const, label: 'on Timer' },
  { id: 'ontrade' as const, label: 'on Trade' },
  { id: 'onchart' as const, label: 'on Chart' },
  { id: 'ondeinit' as const, label: 'on Deinit' },
]

export function EventTabs({ activeEvent, onEventChange }: EventTabsProps) {
  const normalizedActive = activeEvent === 'all' ? 'ontick' : activeEvent

  return (
    <div className="flex items-center gap-0 px-2 py-0 bg-[#3a3a3a] border-b border-[#555]">
      <div className="flex gap-0">
        {EVENT_TABS.map((tab, index) => (
          <button
            key={tab.id}
            onClick={() => onEventChange(tab.id)}
            className={cn(
              'px-4 py-2 text-[11px] font-semibold transition-colors border-r border-[#555] relative',
              normalizedActive === tab.id
                ? 'bg-[#FF8C42] text-black'
                : 'bg-[#4a4a4a] text-[#ccc] hover:bg-[#555]'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  )
}
