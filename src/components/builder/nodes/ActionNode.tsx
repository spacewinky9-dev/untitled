import { memo } from 'react'
import { Handle, Position, NodeProps } from '@xyflow/react'
import { TrendUp, TrendDown, X, Warning } from '@phosphor-icons/react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export interface ActionNodeData extends Record<string, unknown> {
  label: string
  action: 'buy' | 'sell' | 'close' | 'alert'
  inputs?: Array<{ id: string; label: string }>
  outputs?: Array<{ id: string; label: string; type: 'normal' | 'inverted' | 'error' }>
  blockNumber?: number | string
  executionOrder?: number
}

export const ActionNode = memo(({ data, selected }: NodeProps) => {
  const nodeData = data as ActionNodeData
  const isBuy = nodeData.action === 'buy'
  const isSell = nodeData.action === 'sell'
  const isClose = nodeData.action === 'close'
  const isDisabled = nodeData.disabled || false
  
  const inputs = nodeData.inputs || [{ id: 'input', label: 'Input' }]
  
  const outputs = nodeData.outputs || [
    { id: 'success', label: 'Normal', type: 'normal' as const },
    { id: 'error', label: 'Error', type: 'error' as const }
  ]
  
  const getHandleColor = (type: 'normal' | 'inverted' | 'error') => {
    switch (type) {
      case 'normal':
        return '#f97316'
      case 'inverted':
        return '#facc15'
      case 'error':
        return '#9ca3af'
      default:
        return '#f97316'
    }
  }
  
  const getBgColor = () => {
    if (isBuy) return '#16a34a'
    if (isSell) return '#dc2626'
    return '#0ea5e9'
  }
  
  return (
    <div className={cn(
      "px-4 py-3 rounded-xl border-2 bg-[oklch(0.35_0.015_260)] min-w-[160px] transition-all relative shadow-lg",
      selected ? "border-[#f59e0b] shadow-xl shadow-[#f59e0b]/30" : "border-[oklch(0.40_0.015_260)]",
      isDisabled && "opacity-50"
    )}>
      {nodeData.blockNumber !== undefined && (
        <div 
          className="absolute -top-3 left-3 h-6 px-2 flex items-center justify-center rounded-md text-[11px] font-mono font-bold text-white border-2 border-[oklch(0.25_0.01_260)]"
          style={{ backgroundColor: getBgColor() }}
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
        "text-[11px] mb-2 font-medium uppercase tracking-wide",
        isBuy ? "text-green-400" : isSell ? "text-red-400" : "text-blue-400"
      )}>
        {nodeData.action}
      </div>
      
      <div className="flex gap-4 justify-center pt-2">
        {outputs.map((output, idx) => (
          <div key={output.id} className="relative flex flex-col items-center gap-1">
            <div className="text-[10px] text-muted-foreground">
              {output.label}
            </div>
            <Handle
              type="source"
              position={Position.Bottom}
              id={output.id}
              className="!w-[14px] !h-[14px] !rounded-full !border-2 !border-[oklch(0.25_0.01_260)]"
              style={{ 
                backgroundColor: getHandleColor(output.type),
                position: 'relative',
                bottom: 'auto',
                left: 'auto',
                transform: 'none',
                marginTop: 0
              }}
            />
          </div>
        ))}
      </div>
    </div>
  )
})

ActionNode.displayName = 'ActionNode'
