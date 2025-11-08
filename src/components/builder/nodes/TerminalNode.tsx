import { memo } from 'react'
import { Handle, Position, NodeProps } from '@xyflow/react'
import { 
  Bank, 
  Desktop, 
  IdentificationCard,
  User,
  ChartLineUp,
  CurrencyDollar,
  Clock,
  TestTube,
  WifiHigh
} from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

export interface TerminalNodeData extends Record<string, unknown> {
  label: string
  terminalVarType: 'company' | 'name' | 'account_number' | 'account_name' | 'leverage' | 'currency' | 'server_time' | 'is_demo' | 'is_connected'
  parameters?: Record<string, any>
}

const ICONS = {
  company: Bank,
  name: Desktop,
  account_number: IdentificationCard,
  account_name: User,
  leverage: ChartLineUp,
  currency: CurrencyDollar,
  server_time: Clock,
  is_demo: TestTube,
  is_connected: WifiHigh
}

export const TerminalNode = memo(({ data, selected }: NodeProps) => {
  const nodeData = data as TerminalNodeData
  const Icon = ICONS[nodeData.terminalVarType] || Desktop
  
  return (
    <div className={cn(
      "px-3 py-2 rounded-lg border-2 bg-card min-w-[140px] transition-all",
      selected ? "border-primary shadow-lg shadow-primary/20" : "border-border",
      "border-l-4 border-l-violet-500"
    )}>
      <div className="flex items-start gap-2">
        <div className="flex-shrink-0 p-1 rounded bg-violet-500/20">
          <Icon size={12} weight="bold" className="text-violet-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-xs text-foreground truncate">
            {nodeData.label}
          </div>
          <div className="text-[10px] text-muted-foreground mt-0.5 truncate">
            Terminal
          </div>
        </div>
      </div>
      
      <Handle
        type="source"
        position={Position.Right}
        id="value"
        className="w-2.5 h-2.5 !bg-violet-500 border-2 !border-violet-500"
      />
    </div>
  )
})

TerminalNode.displayName = 'TerminalNode'
