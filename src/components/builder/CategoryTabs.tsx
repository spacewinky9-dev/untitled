import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { 
  Bell, 
  Timer, 
  ArrowsClockwise,
  ChartLine,
  Function,
  CurrencyCircleDollar,
  ChartLineUp,
  Stop
} from '@phosphor-icons/react'
import type { EventCategory } from '@/constants/node-categories'

interface CategoryTabsProps {
  activeCategory: EventCategory
  onCategoryChange: (category: EventCategory) => void
  nodeCounts?: Partial<Record<EventCategory, number>>
}

const CATEGORY_CONFIG = [
  {
    id: 'all' as EventCategory,
    label: 'All Nodes',
    icon: Function,
    description: 'Show all available nodes for all events'
  },
  {
    id: 'ontick' as EventCategory,
    label: 'OnTick',
    icon: ChartLine,
    description: 'Executes on every price tick - main strategy logic'
  },
  {
    id: 'oninit' as EventCategory,
    label: 'OnInit',
    icon: ArrowsClockwise,
    description: 'Executes once when EA starts - initialization logic'
  },
  {
    id: 'ontimer' as EventCategory,
    label: 'OnTimer',
    icon: Timer,
    description: 'Executes at timed intervals - periodic tasks'
  },
  {
    id: 'ontrade' as EventCategory,
    label: 'OnTrade',
    icon: CurrencyCircleDollar,
    description: 'Executes when a trade event occurs'
  },
  {
    id: 'onchart' as EventCategory,
    label: 'OnChart',
    icon: ChartLineUp,
    description: 'Executes on chart events - visual updates'
  },
  {
    id: 'ondeinit' as EventCategory,
    label: 'OnDeinit',
    icon: Stop,
    description: 'Executes when EA stops - cleanup logic'
  }
]

export function CategoryTabs({ activeCategory, onCategoryChange, nodeCounts }: CategoryTabsProps) {
  return (
    <div className="border-b border-border bg-card/50 backdrop-blur">
      <Tabs value={activeCategory} onValueChange={(v) => onCategoryChange(v as EventCategory)} className="w-full">
        <TabsList className="w-full justify-start h-auto p-1 bg-transparent rounded-none">
          {CATEGORY_CONFIG.map((category) => {
            const Icon = category.icon
            const count = nodeCounts?.[category.id] || 0
            
            return (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 py-2.5 rounded-lg"
              >
                <Icon size={16} weight="duotone" />
                <span className="text-sm font-medium">{category.label}</span>
                {category.id !== 'all' && (
                  <Badge 
                    variant="secondary" 
                    className="ml-1 text-xs h-5 px-1.5"
                  >
                    {count}
                  </Badge>
                )}
              </TabsTrigger>
            )
          })}
        </TabsList>
      </Tabs>
      
      <div className="px-4 py-2 bg-muted/30">
        <div className="text-xs text-muted-foreground">
          {CATEGORY_CONFIG.find(c => c.id === activeCategory)?.description}
        </div>
      </div>
    </div>
  )
}
