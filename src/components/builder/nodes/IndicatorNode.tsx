import { memo } from 'react'
import { Handle, Position, NodeProps } from '@xyflow/react'
import { Function } from '@phosphor-icons/react'
import { Badge } from '@/components/ui/badge'
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
  
  return (
    <div className={cn(
      "px-4 py-3 rounded-lg bg-[#505050] min-w-[140px] transition-all relative shadow-lg border-2",
      selected ? "border-[#ff1493]" : "border-[#606060]"
    )}>
      {nodeData.blockNumber !== undefined && (
        <div 
          className="absolute -top-3 left-3 h-5 px-2 flex items-center justify-center rounded text-[10px] font-mono font-bold text-white"
          style={{ backgroundColor: '#ff6b1a' }}
        >
          {nodeData.blockNumber}
        </div>
      )}
      
      <Handle
        type="target"
        position={Position.Top}
        id="input"
        className="!w-3 !h-3 !bg-white !border-2 !border-gray-500 !rounded-full"
        style={{ 
          top: -6
        }}
      />
      
      <div className="flex items-center justify-center gap-2 mb-1">
        <div className="font-medium text-xs text-white text-center">
          {nodeData.label}
        </div>
      </div>
      
      {nodeData.indicatorType && (
        <div className="text-[10px] text-gray-300 text-center">
          {nodeData.indicatorType}
        </div>
      )}
      
      <Handle
        type="source"
        position={Position.Bottom}
        id="output"
        className="!w-3 !h-3 !bg-[#ff8c00] !border-2 !border-gray-500 !rounded-full"
        style={{ 
          bottom: -6
        }}
      />
    </div>
  )
})

IndicatorNode.displayName = 'IndicatorNode'
