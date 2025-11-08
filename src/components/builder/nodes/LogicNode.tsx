import { memo } from 'react'
import { Handle, Position, NodeProps } from '@xyflow/react'
import { CirclesThree, ProhibitInset, Circle } from '@phosphor-icons/react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export interface LogicNodeData extends Record<string, unknown> {
  label: string
  operator?: string
  blockNumber?: number | string
  executionOrder?: number
}

export const LogicNode = memo(({ data, selected }: NodeProps) => {
  const nodeData = data as LogicNodeData
  const operator = nodeData.operator || (typeof nodeData.label === 'string' ? nodeData.label.toUpperCase() : 'AND')
  const isPassBlock = operator === 'PASS' || nodeData.label === 'Pass'
  
  const getIcon = () => {
    if (isPassBlock) {
      return <Circle size={14} weight="regular" />
    }
    if (operator === 'NOT') {
      return <ProhibitInset size={14} />
    }
    return <CirclesThree size={14} />
  }

  const inputCount = operator === 'NOT' ? 1 : isPassBlock ? 0 : 2

  return (
    <div className={cn(
      "px-3 py-2.5 rounded-lg border-2 bg-card min-w-[120px] transition-all relative shadow-md",
      selected ? "border-primary shadow-lg shadow-primary/20" : isPassBlock ? "border-border border-dashed" : "border-border",
      "border-l-4"
    )}
    style={{ borderLeftColor: isPassBlock ? '#6b7280' : 'oklch(0.60 0.12 280)' }}
    >
      {nodeData.blockNumber !== undefined && (
        <Badge 
          variant="secondary" 
          className="absolute -top-2.5 -left-2.5 min-h-6 min-w-6 px-1.5 flex items-center justify-center rounded-md text-[10px] font-mono font-bold border-2 border-background"
          style={{ 
            backgroundColor: isPassBlock ? '#6b7280' : 'oklch(0.60 0.12 280)',
            color: 'white'
          }}
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
      
      <div className="flex items-center gap-1.5 mb-1">
        <div className={cn(
          "flex-shrink-0 p-1 rounded",
          isPassBlock ? "bg-muted" : "bg-primary/20"
        )}>
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-xs text-foreground truncate">
            {nodeData.label}
          </div>
          <div className={cn(
            "text-[10px] font-bold uppercase mt-0.5",
            isPassBlock ? "text-muted-foreground italic" : "text-primary"
          )}>
            {isPassBlock ? 'Empty' : operator}
          </div>
        </div>
      </div>
      
      <div className="flex justify-center pt-1">
        <Handle
          type="source"
          position={Position.Bottom}
          id="output"
          className="!w-3.5 !h-3.5 !rounded-full !border-2"
          style={{ 
            backgroundColor: '#10b981',
            borderColor: '#10b981',
            position: 'relative',
            bottom: 'auto',
            left: 'auto',
            transform: 'none',
            marginTop: 4
          }}
        />
      </div>
    </div>
  )
})

LogicNode.displayName = 'LogicNode'
