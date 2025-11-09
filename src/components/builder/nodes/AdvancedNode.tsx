import { memo } from 'react'
import { Handle, Position, NodeProps } from '@xyflow/react'
import { cn } from '@/lib/utils'

export interface AdvancedNodeData extends Record<string, unknown> {
  label: string
  advancedType: 'break_even' | 'partial_close' | 'trailing_stop' | 'trade_group' | 'scale_in' | 'scale_out' | 'hedging' | 'time_stop'
  parameters?: Record<string, any>
  blockNumber?: number | string
}

export const AdvancedNode = memo(({ data, selected }: NodeProps) => {
  const nodeData = data as AdvancedNodeData
  const isDisabled = nodeData.disabled || false
  
  const inputs = [{ id: 'trigger', label: 'Trigger' }]
  const outputs = [{ id: 'output', label: 'Done' }]
  
  return (
    <div className={cn(
      "px-3 py-1.5 rounded-md bg-[oklch(0.35_0.015_260)] min-w-[120px] transition-all relative",
      selected ? "ring-2 ring-[#f59e0b] ring-offset-1 ring-offset-[oklch(0.25_0.01_260)]" : "",
      isDisabled && "opacity-50"
    )}>
      {nodeData.blockNumber !== undefined && (
        <div 
          className="absolute -top-2 -left-2 w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-mono font-bold text-white border-2 border-[oklch(0.25_0.01_260)] shadow-md"
          style={{ backgroundColor: '#ec4899' }}
        >
          {nodeData.blockNumber}
        </div>
      )}
      
      {inputs.map((input, idx) => (
        <Handle
          key={input.id}
          type="target"
          position={Position.Left}
          id={input.id}
          className="!w-2.5 !h-2.5 !bg-white !border-2 !border-[#6b7280] !rounded-sm"
          style={{ 
            top: `${50 + (idx - (inputs.length - 1) / 2) * 16}%`
          }}
        />
      ))}
      
      <div className="flex items-center justify-center">
        <div className="font-semibold text-xs text-foreground text-center leading-tight">
          {nodeData.label}
        </div>
      </div>
      
      {outputs.map((output, idx) => (
        <Handle
          key={output.id}
          type="source"
          position={Position.Right}
          id={output.id}
          className="!w-2.5 !h-2.5 !bg-[#ec4899] !border-2 !border-[#db2777] !rounded-sm"
          style={{ 
            top: `${50 + (idx - (outputs.length - 1) / 2) * 16}%`
          }}
        />
      ))}
    </div>
  )
})

AdvancedNode.displayName = 'AdvancedNode'
