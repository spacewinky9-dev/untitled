import { memo } from 'react'
import { Handle, Position, NodeProps } from '@xyflow/react'
import { ChartLine, Equalizer, TrendUp } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

export interface MTFNodeData extends Record<string, unknown> {
  label: string
  mtfType: 'mtf_indicator' | 'mtf_condition' | 'higher_timeframe_trend'
  parameters?: Record<string, any>
}

export const MTFNode = memo(({ data, selected }: NodeProps) => {
  const nodeData = data as MTFNodeData
  
  const getIcon = () => {
    switch (nodeData.mtfType) {
      case 'mtf_indicator': return ChartLine
      case 'mtf_condition': return Equalizer
      case 'higher_timeframe_trend': return TrendUp
      default: return ChartLine
    }
  }
  
  const Icon = getIcon()
  
  return (
    <div className={cn(
      "px-4 py-3 rounded-lg border-2 bg-card min-w-[180px] transition-all",
      selected ? "border-primary shadow-lg shadow-primary/20" : "border-border",
      "border-l-4 border-l-cyan-500"
    )}>
      <Handle
        type="target"
        position={Position.Left}
        id="input"
        className="w-3 h-3 !bg-cyan-500 border-2 !border-cyan-500"
      />
      
      <div className="flex items-start gap-2">
        <div className="flex-shrink-0 p-1.5 rounded bg-cyan-500/20">
          <Icon size={16} weight="bold" className="text-cyan-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm text-foreground truncate">
            {nodeData.label}
          </div>
          <div className="text-xs text-muted-foreground mt-0.5 truncate">
            Multi-Timeframe
          </div>
        </div>
      </div>
      
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        className="w-3 h-3 !bg-cyan-500 border-2 !border-cyan-500"
      />
    </div>
  )
})

MTFNode.displayName = 'MTFNode'
