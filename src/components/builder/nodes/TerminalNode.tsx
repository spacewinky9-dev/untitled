import { memo } from 'react'
import { Handle, Position, NodeProps } from '@xyflow/react'
import { cn } from '@/lib/utils'

export interface TerminalNodeData extends Record<string, unknown> {
  label: string
  terminalVarType: 'company' | 'name' | 'account_number' | 'account_name' | 'leverage' | 'currency' | 'server_time' | 'is_demo' | 'is_connected'
  parameters?: Record<string, any>
  blockNumber?: number | string
}

export const TerminalNode = memo(({ data, selected }: NodeProps) => {
  const nodeData = data as TerminalNodeData
  const isDisabled = nodeData.disabled || false
  
  const outputs = [{ id: 'value', label: 'Value' }]
  
  return (
    <div className={cn(
      "px-3 py-1.5 rounded-md bg-[oklch(0.35_0.015_260)] min-w-[120px] transition-all relative",
      selected ? "ring-2 ring-[#f59e0b] ring-offset-1 ring-offset-[oklch(0.25_0.01_260)]" : "",
      isDisabled && "opacity-50"
    )}>
      {nodeData.blockNumber !== undefined && (
        <div 
          className="absolute -top-2 -left-2 w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-mono font-bold text-white border-2 border-[oklch(0.25_0.01_260)] shadow-md"
          style={{ backgroundColor: '#8b5cf6' }}
        >
          {nodeData.blockNumber}
        </div>
      )}
      
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
          className="!w-2.5 !h-2.5 !bg-[#8b5cf6] !border-2 !border-[#7c3aed] !rounded-sm"
          style={{ 
            top: `${50 + (idx - (outputs.length - 1) / 2) * 16}%`
          }}
        />
      ))}
    </div>
  )
})

TerminalNode.displayName = 'TerminalNode'
