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
      "px-4 py-3 rounded-xl border-2 bg-[oklch(0.35_0.015_260)] min-w-[160px] transition-all relative shadow-lg",
      isPassBlock && "border-dashed",
      selected ? "border-[#f59e0b] shadow-xl shadow-[#f59e0b]/30" : "border-[oklch(0.40_0.015_260)]"
    )}>
      {nodeData.blockNumber !== undefined && (
        <div 
          className="absolute -top-3 left-3 h-6 px-2 flex items-center justify-center rounded-md text-[11px] font-mono font-bold text-white border-2 border-[oklch(0.25_0.01_260)]"
          style={{ backgroundColor: isPassBlock ? '#6b7280' : '#8b5cf6' }}
        >
          {nodeData.blockNumber}
        </div>
      )}
      
      <Handle
        type="target"
        position={Position.Top}
        id="input"
        className="!w-[14px] !h-[14px] !bg-white !border-2 !border-[#9ca3af] !rounded-full"
        style={{ 
          top: -7,
          left: '50%',
          transform: 'translateX(-50%)'
        }}
      />
      
      <div className="flex items-center gap-2 mb-2">
        <div className="font-semibold text-sm text-foreground">
          {nodeData.label}
        </div>
      </div>
      
      <div className={cn(
        "text-[11px] font-bold uppercase mb-2",
        isPassBlock ? "text-muted-foreground italic" : "text-purple-400"
      )}>
        {isPassBlock ? 'Empty' : operator}
      </div>
      
      <div className="flex justify-center pt-2">
        <div className="relative flex flex-col items-center gap-1">
          <div className="text-[10px] text-muted-foreground">
            Output
          </div>
          <Handle
            type="source"
            position={Position.Bottom}
            id="output"
            className="!w-[14px] !h-[14px] !rounded-full !border-2 !border-[oklch(0.25_0.01_260)]"
            style={{ 
              backgroundColor: '#f97316',
              position: 'relative',
              bottom: 'auto',
              left: 'auto',
              transform: 'none',
              marginTop: 0
            }}
          />
        </div>
      </div>
    </div>
  )
})

LogicNode.displayName = 'LogicNode'
