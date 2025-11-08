import { memo } from 'react'
import { Handle, Position, NodeProps } from '@xyflow/react'
import { GitBranch } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

export interface ConditionNodeData extends Record<string, unknown> {
  label: string
  operator?: string
  inputs?: Array<{ id: string; label: string }>
  outputs?: Array<{ id: string; label: string }>
}

export const ConditionNode = memo(({ data, selected }: NodeProps) => {
  const nodeData = data as ConditionNodeData
  
  const inputs = nodeData.inputs || [
    { id: 'input-a', label: 'Input A' },
    { id: 'input-b', label: 'Input B' }
  ]
  
  const outputs = nodeData.outputs || [{ id: 'result', label: 'Result' }]
  
  return (
    <div className={cn(
      "px-3 py-2 rounded-md border-2 bg-card min-w-[130px] transition-all",
      selected ? "border-primary shadow-lg shadow-primary/20" : "border-border",
      "border-l-4"
    )}
    style={{ borderLeftColor: 'oklch(0.65 0.18 145)' }}
    >
      {inputs.map((input, idx) => (
        <Handle
          key={input.id}
          type="target"
          position={Position.Left}
          id={input.id}
          style={{ top: `${((idx + 1) * 100) / (inputs.length + 1)}%` }}
          className="w-2.5 h-2.5 !bg-accent border-2 !border-accent"
        />
      ))}
      
      <div className="flex items-start gap-1.5">
        <div className="flex-shrink-0 p-1 rounded bg-bullish/20">
          <GitBranch size={12} weight="bold" className="text-bullish" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-xs text-foreground truncate">
            {nodeData.label}
          </div>
          {nodeData.operator && (
            <div className="text-[10px] text-muted-foreground mt-0.5">
              {nodeData.operator}
            </div>
          )}
        </div>
      </div>
      
      {outputs.map((output, idx) => (
        <Handle
          key={output.id}
          type="source"
          position={Position.Right}
          id={output.id}
          style={{ top: `${((idx + 1) * 100) / (outputs.length + 1)}%` }}
          className="w-2.5 h-2.5 !bg-bullish border-2 !border-bullish"
        />
      ))}
    </div>
  )
})

ConditionNode.displayName = 'ConditionNode'
