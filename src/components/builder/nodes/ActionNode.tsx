import { memo } from 'react'
import { Handle, Position, NodeProps } from '@xyflow/react'
import { TrendUp, TrendDown } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

export interface ActionNodeData extends Record<string, unknown> {
  label: string
  action: 'buy' | 'sell' | 'close' | 'alert'
}

export const ActionNode = memo(({ data, selected }: NodeProps) => {
  const nodeData = data as ActionNodeData
  const isBuy = nodeData.action === 'buy'
  const isSell = nodeData.action === 'sell'
  
  return (
    <div className={cn(
      "px-4 py-3 rounded-lg border-2 bg-card min-w-[180px] transition-all",
      selected ? "border-primary shadow-lg shadow-primary/20" : "border-border",
      "border-l-4"
    )}
    style={{ 
      borderLeftColor: isBuy ? 'oklch(0.65 0.18 145)' : isSell ? 'oklch(0.55 0.20 25)' : 'oklch(0.60 0.20 40)' 
    }}
    >
      <Handle
        type="target"
        position={Position.Left}
        id="trigger"
        className="w-3 h-3 !bg-accent border-2 !border-accent"
      />
      
      <div className="flex items-start gap-2">
        <div className={cn(
          "flex-shrink-0 p-1.5 rounded",
          isBuy ? "bg-bullish/20" : isSell ? "bg-bearish/20" : "bg-muted"
        )}>
          {isBuy ? (
            <TrendUp size={16} weight="bold" className="text-bullish" />
          ) : isSell ? (
            <TrendDown size={16} weight="bold" className="text-bearish" />
          ) : (
            <TrendUp size={16} weight="bold" className="text-muted-foreground" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm text-foreground truncate">
            {nodeData.label}
          </div>
          <div className={cn(
            "text-xs mt-0.5 font-medium uppercase tracking-wide",
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
