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
  
  const inputs = nodeData.inputs || [{ id: 'input', label: 'Input' }]
  
  const outputs = nodeData.outputs || [
    { id: 'success', label: 'Success', type: 'normal' as const },
    { id: 'error', label: 'Error', type: 'error' as const }
  ]
  
  const getHandleColor = (type: 'normal' | 'inverted' | 'error') => {
    switch (type) {
      case 'normal':
        return '#10b981'
      case 'inverted':
        return '#f59e0b'
      case 'error':
        return '#ef4444'
      default:
        return '#10b981'
    }
  }
  
  return (
    <div className={cn(
      "px-3 py-2.5 rounded-lg border-2 bg-card min-w-[140px] transition-all relative shadow-md",
      selected ? "border-primary shadow-lg shadow-primary/20" : "border-border",
      "border-l-4"
    )}
    style={{ 
      borderLeftColor: isBuy ? 'oklch(0.65 0.18 145)' : isSell ? 'oklch(0.55 0.20 25)' : 'oklch(0.60 0.20 40)' 
    }}
    >
      {nodeData.blockNumber !== undefined && (
        <Badge 
          variant="secondary" 
          className="absolute -top-2.5 -left-2.5 min-h-6 min-w-6 px-1.5 flex items-center justify-center rounded-md text-[10px] font-mono font-bold border-2 border-background"
          style={{ 
            backgroundColor: isBuy ? 'oklch(0.65 0.18 145)' : isSell ? 'oklch(0.55 0.20 25)' : 'oklch(0.60 0.20 40)',
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
      
      <div className="flex items-start gap-1.5 mb-1">
        <div className={cn(
          "flex-shrink-0 p-1 rounded",
          isBuy ? "bg-bullish/20" : isSell ? "bg-bearish/20" : "bg-muted"
        )}>
          {isBuy ? (
            <TrendUp size={14} weight="bold" className="text-bullish" />
          ) : isSell ? (
            <TrendDown size={14} weight="bold" className="text-bearish" />
          ) : isClose ? (
            <X size={14} weight="bold" className="text-muted-foreground" />
          ) : (
            <TrendUp size={14} weight="bold" className="text-muted-foreground" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-xs text-foreground truncate">
            {nodeData.label}
          </div>
          <div className={cn(
            "text-[10px] mt-0.5 font-medium uppercase tracking-wide",
            isBuy ? "text-bullish" : isSell ? "text-bearish" : "text-muted-foreground"
          )}>
            {nodeData.action}
          </div>
        </div>
      </div>
      
      <div className="flex gap-2 justify-center pt-1">
        {outputs.map((output, idx) => (
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

ActionNode.displayName = 'ActionNode'
