import { memo } from 'react'
import { Handle, Position, NodeProps } from '@xyflow/react'
import { Play, Activity, Clock, CurrencyCircleDollar, ChartLineUp, Stop } from '@phosphor-icons/react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export interface EventNodeData extends Record<string, unknown> {
  label: string
  eventType: 'on_init' | 'on_tick' | 'on_timer' | 'on_trade' | 'on_chart' | 'on_deinit'
  parameters?: Record<string, any>
  blockNumber?: number | string
  executionOrder?: number
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
      "px-4 py-3 rounded-xl border-2 bg-[oklch(0.35_0.015_260)] min-w-[160px] transition-all relative shadow-lg",
      selected ? "border-[#f59e0b] shadow-xl shadow-[#f59e0b]/30" : "border-[oklch(0.40_0.015_260)]"
    )}>
      {nodeData.blockNumber !== undefined && (
        <div 
          className="absolute -top-3 left-3 h-6 px-2 flex items-center justify-center rounded-md text-[11px] font-mono font-bold text-white border-2 border-[oklch(0.25_0.01_260)]"
          style={{ backgroundColor: '#a855f7' }}
        >
          {nodeData.blockNumber}
        </div>
      )}
      
      <div className="flex items-center gap-2 mb-2">
        <div className="font-semibold text-sm text-foreground">
          {nodeData.label}
        </div>
      </div>
      
      <div className="text-[11px] text-purple-400 mb-2">
        Event Handler
      </div>
      
      <div className="flex justify-center pt-2">
        <div className="relative flex flex-col items-center gap-1">
          <div className="text-[10px] text-muted-foreground">
            Output
          </div>
          <Handle
            type="source"
            position={Position.Bottom}
            id="output"
            className="!w-[14px] !h-[14px] !rounded-full !border-2 !border-[oklch(0.25_0.01_260)]"
            style={{ 
              backgroundColor: '#f97316',
              position: 'relative',
              bottom: 'auto',
              left: 'auto',
              transform: 'none',
              marginTop: 0
            }}
          />
        </div>
      </div>
    </div>
  )
})

EventNode.displayName = 'EventNode'
