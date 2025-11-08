import { memo } from 'react'
import { Handle, Position, NodeProps } from '@xyflow/react'
import { Function } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

export interface IndicatorNodeData extends Record<string, unknown> {
  label: string
  indicatorType: string
  parameters: Record<string, any>
}

export const IndicatorNode = memo(({ data, selected }: NodeProps) => {
  const nodeData = data as IndicatorNodeData
  
  return (
    <div className={cn(
      "px-4 py-3 rounded-lg border-2 bg-card min-w-[180px] transition-all",
      selected ? "border-primary shadow-lg shadow-primary/20" : "border-border",
      "border-l-4"
    )}
    style={{ borderLeftColor: 'oklch(0.70 0.15 210)' }}
    >
      <Handle
        type="target"
        position={Position.Left}
        id="data-in"
        className="w-3 h-3 !bg-accent border-2 !border-accent"
      />
      
      <div className="flex items-start gap-2">
        <div className="flex-shrink-0 p-1.5 rounded bg-accent/20">
          <Function size={16} weight="bold" className="text-accent" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm text-foreground truncate">
            {nodeData.label}
          </div>
          <div className="text-xs text-muted-foreground mt-0.5">
            {nodeData.indicatorType}
          </div>
          {nodeData.parameters?.period && (
            <div className="text-xs text-muted-foreground/80 mt-1">
              Period: {nodeData.parameters.period}
            </div>
          )}
        </div>
      </div>
      
      <Handle
        type="source"
        position={Position.Right}
        id="value-out"
        className="w-3 h-3 !bg-accent border-2 !border-accent"
      />
    </div>
  )
})

IndicatorNode.displayName = 'IndicatorNode'

