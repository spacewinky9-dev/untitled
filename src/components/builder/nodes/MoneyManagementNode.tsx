import { memo } from 'react'
import { Handle, Position, NodeProps } from '@xyflow/react'
import { 
  CurrencyDollar, 
  ChartLineUp, 
  ArrowsClockwise, 
  TrendUp,
  ListNumbers,
  ShieldCheck,
  Equals,
  MathOperations,
  Percent
} from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

export interface MoneyManagementNodeData extends Record<string, unknown> {
  label: string
  moneyManagementType: 'risk_percent' | 'fibonacci' | 'martingale' | 'anti_martingale' | 'custom_sequence' | 'recovery_zones' | 'fixed_ratio' | 'kelly_criterion'
  parameters?: Record<string, any>
}

const ICONS = {
  risk_percent: Percent,
  fibonacci: ChartLineUp,
  martingale: ArrowsClockwise,
  anti_martingale: TrendUp,
  custom_sequence: ListNumbers,
  recovery_zones: ShieldCheck,
  fixed_ratio: Equals,
  kelly_criterion: MathOperations
}

export const MoneyManagementNode = memo(({ data, selected }: NodeProps) => {
  const nodeData = data as MoneyManagementNodeData
  const Icon = ICONS[nodeData.moneyManagementType] || CurrencyDollar
  
  return (
    <div className={cn(
      "px-3 py-2 rounded-lg border-2 bg-card min-w-[140px] transition-all",
      selected ? "border-primary shadow-lg shadow-primary/20" : "border-border",
      "border-l-4 border-l-emerald-500"
    )}>
      <Handle
        type="target"
        position={Position.Left}
        id="trigger"
        className="w-2.5 h-2.5 !bg-emerald-500 border-2 !border-emerald-500"
      />
      
      <div className="flex items-start gap-2">
        <div className="flex-shrink-0 p-1 rounded bg-emerald-500/20">
          <Icon size={12} weight="bold" className="text-emerald-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-xs text-foreground truncate">
            {nodeData.label}
          </div>
          <div className="text-[10px] text-muted-foreground mt-0.5 truncate">
            Money Mgmt
          </div>
        </div>
      </div>
      
      <Handle
        type="source"
        position={Position.Right}
        id="lot_size"
        className="w-2.5 h-2.5 !bg-emerald-500 border-2 !border-emerald-500"
      />
    </div>
  )
})

MoneyManagementNode.displayName = 'MoneyManagementNode'
