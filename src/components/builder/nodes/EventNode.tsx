import { memo } from 'react'
import { Handle, Position, NodeProps } from '@xyflow/react'
import { Play, Activity, Clock, CurrencyCircleDollar, ChartLineUp, Stop } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

export interface EventNodeData extends Record<string, unknown> {
  label: string
  eventType: 'on_init' | 'on_tick' | 'on_timer' | 'on_trade' | 'on_chart' | 'on_deinit'
  parameters?: Record<string, any>
}

export const EventNode = memo(({ data, selected }: NodeProps) => {
  const nodeData = data as EventNodeData
  
  const getIcon = () => {
    switch (nodeData.eventType) {
      case 'on_init': return Play
      case 'on_tick': return Activity
      case 'on_timer': return Clock
      case 'on_trade': return CurrencyCircleDollar
      case 'on_chart': return ChartLineUp
      case 'on_deinit': return Stop
      default: return Play
    }
  }
  
  const Icon = getIcon()
  
  return (
    <div className={cn(
      "px-3 py-2 rounded-lg border-2 bg-card min-w-[140px] transition-all",
      selected ? "border-primary shadow-lg shadow-primary/20" : "border-border",
      "border-l-4 border-l-purple-500"
    )}>
      <div className="flex items-start gap-2">
        <div className="flex-shrink-0 p-1 rounded bg-purple-500/20">
          <Icon size={12} weight="bold" className="text-purple-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-xs text-foreground truncate">
            {nodeData.label}
          </div>
          <div className="text-[10px] text-muted-foreground mt-0.5 truncate">
            Event Handler
          </div>
        </div>
      </div>
      
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        className="w-2.5 h-2.5 !bg-purple-500 border-2 !border-purple-500"
      />
    </div>
  )
})

EventNode.displayName = 'EventNode'
