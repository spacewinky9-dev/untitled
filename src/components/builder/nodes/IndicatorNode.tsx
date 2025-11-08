import { memo } from 'react'
import { Handle, Position, NodeProps } from '@xyflow/react'
import { Function } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

export interface IndicatorNodeData extends Record<string, unknown> {
  label: string
  indicatorType?: string
  parameters?: Record<string, any>
  inputs?: Array<{ id: string; label: string }>
  outputs?: Array<{ id: string; label: string }>
}

export const IndicatorNode = memo(({ data, selected }: NodeProps) => {
  const nodeData = data as IndicatorNodeData
  
  const inputs = nodeData.inputs || [{ id: 'data-in', label: 'Data' }]
  const outputs = nodeData.outputs || [{ id: 'value-out', label: 'Value' }]
  
  return (
    <div className={cn(
      "px-3 py-2 rounded-md border-2 bg-card min-w-[140px] transition-all",
      selected ? "border-primary shadow-lg shadow-primary/20" : "border-border",
      "border-l-4"
    )}
    style={{ borderLeftColor: 'oklch(0.70 0.15 210)' }}
    >
      {inputs.map((input, idx) => (
        <Handle
          key={input.id}
          type="target"
          position={Position.Left}
          id={input.id}
          className="w-2.5 h-2.5 !bg-accent border-2 !border-accent"
          style={{ top: `${((idx + 1) * 100) / (inputs.length + 1)}%` }}
        />
      ))}
      
      <div className="flex items-start gap-1.5">
        <div className="flex-shrink-0 p-1 rounded bg-accent/20">
          <Function size={12} weight="bold" className="text-accent" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-xs text-foreground truncate">
            {nodeData.label}
          </div>
          {nodeData.indicatorType && (
            <div className="text-[10px] text-muted-foreground mt-0.5 truncate">
              {nodeData.indicatorType}
            </div>
          )}
          {nodeData.parameters?.period && (
            <div className="text-[10px] text-muted-foreground/80 mt-0.5">
              Period: {nodeData.parameters.period}
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
          className="w-2.5 h-2.5 !bg-accent border-2 !border-accent"
          style={{ top: `${((idx + 1) * 100) / (outputs.length + 1)}%` }}
        />
      ))}
    </div>
  )
})

IndicatorNode.displayName = 'IndicatorNode'
