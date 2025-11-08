import { memo } from 'react'
import { Handle, Position, NodeProps } from '@xyflow/react'
import { Equals, ChartLineUp, ShieldCheck, Stack, ArrowsIn, ArrowsOut, ShieldChevron, HourglassLow } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

export interface AdvancedNodeData extends Record<string, unknown> {
  label: string
  advancedType: 'break_even' | 'partial_close' | 'trailing_stop' | 'trade_group' | 'scale_in' | 'scale_out' | 'hedging' | 'time_stop'
  parameters?: Record<string, any>
}

export const AdvancedNode = memo(({ data, selected }: NodeProps) => {
  const nodeData = data as AdvancedNodeData
  
  const getIcon = () => {
    switch (nodeData.advancedType) {
      case 'break_even': return Equals
      case 'partial_close': return ChartLineUp
      case 'trailing_stop': return ShieldCheck
      case 'trade_group': return Stack
      case 'scale_in': return ArrowsIn
      case 'scale_out': return ArrowsOut
      case 'hedging': return ShieldChevron
      case 'time_stop': return HourglassLow
      default: return ShieldCheck
    }
  }
  
  const Icon = getIcon()
  
  return (
    <div className={cn(
      "px-4 py-3 rounded-lg border-2 bg-card min-w-[180px] transition-all",
      selected ? "border-primary shadow-lg shadow-primary/20" : "border-border",
      "border-l-4 border-l-pink-500"
    )}>
      <Handle
        type="target"
        position={Position.Left}
        id="trigger"
        className="w-3 h-3 !bg-pink-500 border-2 !border-pink-500"
      />
      
      <div className="flex items-start gap-2">
        <div className="flex-shrink-0 p-1.5 rounded bg-pink-500/20">
          <Icon size={16} weight="bold" className="text-pink-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm text-foreground truncate">
            {nodeData.label}
          </div>
          <div className="text-xs text-muted-foreground mt-0.5 truncate">
            Advanced Trade
          </div>
        </div>
      </div>
      
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        className="w-3 h-3 !bg-pink-500 border-2 !border-pink-500"
      />
    </div>
  )
})

AdvancedNode.displayName = 'AdvancedNode'
