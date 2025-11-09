import { memo } from 'react'
import { Handle, Position, NodeProps } from '@xyflow/react'
import { cn } from '@/lib/utils'

export interface IndicatorNodeData extends Record<string, unknown> {
  label: string
  indicatorType?: string
  parameters?: Record<string, any>
  inputs?: Array<{ id: string; label: string }>
  outputs?: Array<{ id: string; label: string }>
  blockNumber?: number | string
  executionOrder?: number
}

export const IndicatorNode = memo(({ data, selected }: NodeProps) => {
  const nodeData = data as IndicatorNodeData
  const isDisabled = nodeData.disabled || false
  
  const inputs = nodeData.inputs || []
  const outputs = nodeData.outputs || [{ id: 'output', label: 'Value' }]
  
  return (
    <div className={cn(
      "px-3 py-1.5 rounded-md bg-[oklch(0.35_0.015_260)] min-w-[120px] transition-all relative",
      selected ? "ring-2 ring-[#f59e0b] ring-offset-1 ring-offset-[oklch(0.25_0.01_260)]" : "",
      isDisabled && "opacity-50"
    )}>
      {nodeData.blockNumber !== undefined && (
        <div 
          className="absolute -top-2 -left-2 w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-mono font-bold text-white border-2 border-[oklch(0.25_0.01_260)] shadow-md"
          style={{ backgroundColor: '#70a0ff' }}
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
          className="!w-2.5 !h-2.5 !bg-[#70a0ff] !border-2 !border-[#5080d0] !rounded-sm"
          style={{ 
            top: `${50 + (idx - (outputs.length - 1) / 2) * 16}%`
          }}
        />
      ))}
    </div>
  )
})

IndicatorNode.displayName = 'IndicatorNode'
