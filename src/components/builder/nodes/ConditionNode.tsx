import { memo } from 'react'
import { Handle, Position, NodeProps } from '@xyflow/react'
import { GitBranch } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

export interface ConditionNodeData extends Record<string, unknown> {
  label: string
  operator: string
}

export const ConditionNode = memo(({ data, selected }: NodeProps) => {
  const nodeData = data as ConditionNodeData
  
  return (
    <div className={cn(
      "px-4 py-3 rounded-lg border-2 bg-card min-w-[180px] transition-all",
      selected ? "border-primary shadow-lg shadow-primary/20" : "border-border",
      "border-l-4"
    )}
    style={{ borderLeftColor: 'oklch(0.65 0.18 145)' }}
    >
      <Handle
        type="target"
        position={Position.Left}
        id="input-a"
        style={{ top: '35%' }}
        className="w-3 h-3 !bg-accent border-2 !border-accent"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="input-b"
        style={{ top: '65%' }}
        className="w-3 h-3 !bg-accent border-2 !border-accent"
      />
      
      <div className="flex items-start gap-2">
        <div className="flex-shrink-0 p-1.5 rounded bg-bullish/20">
          <GitBranch size={16} weight="bold" className="text-bullish" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm text-foreground truncate">
            {nodeData.label}
          </div>
          <div className="text-xs text-muted-foreground mt-0.5">
            {nodeData.operator}
          </div>
        </div>
      </div>
      
      <Handle
        type="source"
        position={Position.Right}
        id="result"
        className="w-3 h-3 !bg-bullish border-2 !border-bullish"
      />
    </div>
  )
})

ConditionNode.displayName = 'ConditionNode'
