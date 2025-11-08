import { memo } from 'react'
import { Handle, Position, NodeProps } from '@xyflow/react'
import { GitBranch } from '@phosphor-icons/react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export interface ConditionNodeData extends Record<string, unknown> {
  label: string
  operator?: string
  inputs?: Array<{ id: string; label: string }>
  outputs?: Array<{ id: string; label: string; type: 'normal' | 'inverted' }>
  blockNumber?: number | string
  executionOrder?: number
}

export const ConditionNode = memo(({ data, selected }: NodeProps) => {
  const nodeData = data as ConditionNodeData
  
  const outputs = nodeData.outputs || [
    { id: 'true', label: 'True', type: 'normal' as const },
    { id: 'false', label: 'False', type: 'inverted' as const }
  ]
  
  const getHandleColor = (type: 'normal' | 'inverted') => {
    return type === 'normal' ? '#10b981' : '#f59e0b'
  }
  
  return (
    <div className={cn(
      "px-3 py-2.5 rounded-lg border-2 bg-card min-w-[140px] transition-all relative shadow-md",
      selected ? "border-primary shadow-lg shadow-primary/20" : "border-border",
      "border-l-4"
    )}
    style={{ borderLeftColor: 'oklch(0.65 0.18 145)' }}
    >
      {nodeData.blockNumber !== undefined && (
        <Badge 
          variant="secondary" 
          className="absolute -top-2.5 -left-2.5 min-h-6 min-w-6 px-1.5 flex items-center justify-center rounded-md text-[10px] font-mono font-bold bg-bullish text-black border-2 border-background"
        >
          {nodeData.blockNumber}
        </Badge>
      )}
      
      <Handle
        type="target"
        position={Position.Top}
        id="input"
        className="!w-4 !h-4 !bg-white !border-2 !border-gray-400 !rounded-full"
        style={{ 
          top: -8,
          left: '50%',
          transform: 'translateX(-50%)'
        }}
      />
      
      <div className="flex items-start gap-1.5 mb-1">
        <div className="flex-shrink-0 p-1 rounded bg-bullish/20">
          <GitBranch size={14} weight="bold" className="text-bullish" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-xs text-foreground truncate">
            {nodeData.label}
          </div>
          {nodeData.operator && (
            <div className="text-[10px] text-muted-foreground mt-0.5 truncate">
              {nodeData.operator}
            </div>
          )}
        </div>
      </div>
      
      <div className="flex gap-2 justify-center pt-1">
        {outputs.map((output) => (
          <div key={output.id} className="relative flex flex-col items-center">
            <Handle
              type="source"
              position={Position.Bottom}
              id={output.id}
              className="!w-3.5 !h-3.5 !rounded-full !border-2"
              style={{ 
                backgroundColor: getHandleColor(output.type),
                borderColor: getHandleColor(output.type),
                position: 'relative',
                bottom: 'auto',
                left: 'auto',
                transform: 'none',
                marginTop: 4
              }}
            />
          </div>
        ))}
      </div>
    </div>
  )
})

ConditionNode.displayName = 'ConditionNode'
