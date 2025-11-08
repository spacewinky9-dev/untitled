import { memo } from 'react'
import { Handle, Position, NodeProps } from '@xyflow/react'
import { CirclesThree, ProhibitInset } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

export interface LogicNodeData extends Record<string, unknown> {
  label: string
  operator?: string
}

export const LogicNode = memo(({ data, selected }: NodeProps) => {
  const nodeData = data as LogicNodeData
  const operator = nodeData.operator || (typeof nodeData.label === 'string' ? nodeData.label.toUpperCase() : 'AND')
  
  const getIcon = () => {
    if (operator === 'NOT') {
      return <ProhibitInset size={12} />
    }
    return <CirclesThree size={12} />
  }

  const inputCount = operator === 'NOT' ? 1 : 2

  return (
    <div className={cn(
      "px-3 py-2 rounded-md border-2 bg-card min-w-[120px] transition-all",
      selected ? "border-primary shadow-lg shadow-primary/20" : "border-border",
      "border-l-4"
    )}
    style={{ borderLeftColor: 'oklch(0.60 0.12 280)' }}
    >
      {inputCount >= 1 && (
        <Handle
          type="target"
          position={Position.Left}
          id="input-a"
          style={{ top: '35%' }}
          className="w-2.5 h-2.5 !bg-primary border-2 !border-primary"
        />
      )}
      
      {inputCount >= 2 && (
        <Handle
          type="target"
          position={Position.Left}
          id="input-b"
          style={{ top: '65%' }}
          className="w-2.5 h-2.5 !bg-primary border-2 !border-primary"
        />
      )}
      
      <div className="flex items-center gap-1.5">
        <div className="flex-shrink-0 p-1 rounded bg-primary/20">
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-xs text-foreground truncate">
            {nodeData.label}
          </div>
          <div className="text-[10px] text-primary font-bold uppercase mt-0.5">
            {operator}
          </div>
        </div>
      </div>
      
      <Handle
        type="source"
        position={Position.Right}
        id="result"
        className="w-2.5 h-2.5 !bg-primary border-2 !border-primary"
      />
    </div>
  )
})

LogicNode.displayName = 'LogicNode'
