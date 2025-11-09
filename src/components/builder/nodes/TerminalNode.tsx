import { memo, useState } from 'react'
import { Handle, Position, NodeProps } from '@xyflow/react'
import { cn } from '@/lib/utils'
import { InlineNodeEditor } from '../InlineNodeEditor'

export interface TerminalNodeData extends Record<string, unknown> {
  label: string
  terminalVarType: 'company' | 'name' | 'account_number' | 'account_name' | 'leverage' | 'currency' | 'server_time' | 'is_demo' | 'is_connected'
  parameters?: Record<string, any>
  blockNumber?: number | string
}

export const TerminalNode = memo(({ data, selected, id }: NodeProps) => {
  const nodeData = data as TerminalNodeData
  const isDisabled = nodeData.disabled || false
  const [isEditingLabel, setIsEditingLabel] = useState(false)
  
  const outputs = [{ id: 'value', label: 'Value' }]
  
  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsEditingLabel(true)
  }
  
  return (
    <div 
      className={cn(
        "px-3 py-1.5 rounded-md bg-[oklch(0.35_0.015_260)] min-w-[120px] transition-all relative cursor-grab active:cursor-grabbing",
        selected ? "ring-2 ring-[#f59e0b] ring-offset-1 ring-offset-[oklch(0.25_0.01_260)]" : "",
        isDisabled && "opacity-50"
      )}
    >      {nodeData.blockNumber !== undefined && (
        <div 
          className="absolute -top-2 -left-2 w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-mono font-bold text-white border-2 border-[oklch(0.25_0.01_260)] shadow-md"
          style={{ backgroundColor: '#8b5cf6' }}
        >
          {nodeData.blockNumber}
        </div>
      )}
      
      <div className="flex items-center justify-center" onDoubleClick={handleDoubleClick}>
        <InlineNodeEditor
          nodeId={id}
          currentLabel={nodeData.label}
          isEditing={isEditingLabel}
          onEditComplete={() => setIsEditingLabel(false)}
        />
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
