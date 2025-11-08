import { memo } from 'react'
import { Handle, Position, NodeProps } from '@xyflow/react'
import { TrendUp, TrendDown, X } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

export interface ActionNodeData extends Record<string, unknown> {
  label: string
  action: 'buy' | 'sell' | 'close' | 'alert'
  inputs?: Array<{ id: string; label: string }>
}

export const ActionNode = memo(({ data, selected }: NodeProps) => {
  const nodeData = data as ActionNodeData
  const isBuy = nodeData.action === 'buy'
  const isSell = nodeData.action === 'sell'
  const isClose = nodeData.action === 'close'
  
  const inputs = nodeData.inputs || [
    { id: 'trigger', label: 'Trigger' },
    { id: 'lots', label: 'Lots' },
    { id: 'sl', label: 'SL' },
    { id: 'tp', label: 'TP' }
  ]
  
  return (
    <div className={cn(
      "px-3 py-2 rounded-md border-2 bg-card min-w-[140px] transition-all",
      selected ? "border-primary shadow-lg shadow-primary/20" : "border-border",
      "border-l-4"
    )}
    style={{ 
      borderLeftColor: isBuy ? 'oklch(0.65 0.18 145)' : isSell ? 'oklch(0.55 0.20 25)' : 'oklch(0.60 0.20 40)' 
    }}
    >
      {inputs.map((input, idx) => (
        <Handle
          key={input.id}
          type="target"
          position={Position.Left}
          id={input.id}
          className="w-2.5 h-2.5 !bg-accent border-2 !border-accent"
          style={{ top: `${((idx + 1) * 100) / (inputs.length + 1)}%` }}
        />
      ))}
      
      <div className="flex items-start gap-1.5">
        <div className={cn(
          "flex-shrink-0 p-1 rounded",
          isBuy ? "bg-bullish/20" : isSell ? "bg-bearish/20" : "bg-muted"
        )}>
          {isBuy ? (
            <TrendUp size={12} weight="bold" className="text-bullish" />
          ) : isSell ? (
            <TrendDown size={12} weight="bold" className="text-bearish" />
          ) : isClose ? (
            <X size={12} weight="bold" className="text-muted-foreground" />
          ) : (
            <TrendUp size={12} weight="bold" className="text-muted-foreground" />
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
    </div>
  )
})

ActionNode.displayName = 'ActionNode'
