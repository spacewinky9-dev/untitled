import { memo } from 'react'
import { Handle, Position, NodeProps } from '@xyflow/react'
import { cn } from '@/lib/utils'

export interface PassNodeData extends Record<string, unknown> {
  label: string
  blockNumber?: number | string
  executionOrder?: number
}

export const PassNode = memo(({ data, selected }: NodeProps) => {
  const nodeData = data as PassNodeData
  const isDisabled = nodeData.disabled || false
  
  return (
    <div className={cn(
      "px-3 py-1.5 rounded-md bg-[oklch(0.35_0.015_260)] min-w-[120px] transition-all relative border border-dashed border-[oklch(0.45_0.015_260)]",
      selected ? "ring-2 ring-[#f59e0b] ring-offset-1 ring-offset-[oklch(0.25_0.01_260)]" : "",
      isDisabled && "opacity-50"
    )}>
      {nodeData.blockNumber !== undefined && (
        <div 
          className="absolute -top-2 -left-2 w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-mono font-bold text-white border-2 border-[oklch(0.25_0.01_260)] shadow-md"
          style={{ backgroundColor: '#6b7280' }}
        >
          {nodeData.blockNumber}
        </div>
      )}
      
      <Handle
        type="target"
        position={Position.Left}
        id="input"
        className="!w-2.5 !h-2.5 !bg-white !border-2 !border-[#6b7280] !rounded-sm"
        style={{ 
          top: '50%'
        }}
      />
      
      <div className="flex items-center justify-center">
        <div className="font-semibold text-xs text-muted-foreground text-center leading-tight italic">
          {nodeData.label}
        </div>
      </div>
      
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        className="!w-2.5 !h-2.5 !bg-[#6b7280] !border-2 !border-[#52525b] !rounded-sm"
        style={{ 
          top: '50%'
        }}
      />
    </div>
  )
})

PassNode.displayName = 'PassNode'
