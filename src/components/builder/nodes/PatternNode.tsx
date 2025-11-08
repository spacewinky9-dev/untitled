import { memo } from 'react'
import { Handle, Position, NodeProps } from '@xyflow/react'
import { Barcode, ChartLine, LineSegment, ArrowsOutCardinal } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

export interface PatternNodeData extends Record<string, unknown> {
  label: string
  patternType: 'candlestick_pattern' | 'chart_pattern' | 'support_resistance' | 'divergence'
  parameters?: Record<string, any>
}

export const PatternNode = memo(({ data, selected }: NodeProps) => {
  const nodeData = data as PatternNodeData
  
  const getIcon = () => {
    switch (nodeData.patternType) {
      case 'candlestick_pattern': return Barcode
      case 'chart_pattern': return ChartLine
      case 'support_resistance': return LineSegment
      case 'divergence': return ArrowsOutCardinal
      default: return Barcode
    }
  }
  
  const Icon = getIcon()
  
  return (
    <div className={cn(
      "px-4 py-3 rounded-lg border-2 bg-card min-w-[180px] transition-all",
      selected ? "border-primary shadow-lg shadow-primary/20" : "border-border",
      "border-l-4 border-l-green-500"
    )}>
      <Handle
        type="target"
        position={Position.Left}
        id="input"
        className="w-3 h-3 !bg-green-500 border-2 !border-green-500"
      />
      
      <div className="flex items-start gap-2">
        <div className="flex-shrink-0 p-1.5 rounded bg-green-500/20">
          <Icon size={16} weight="bold" className="text-green-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm text-foreground truncate">
            {nodeData.label}
          </div>
          <div className="text-xs text-muted-foreground mt-0.5 truncate">
            Pattern Detection
          </div>
        </div>
      </div>
      
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        className="w-3 h-3 !bg-green-500 border-2 !border-green-500"
      />
    </div>
  )
})

PatternNode.displayName = 'PatternNode'
