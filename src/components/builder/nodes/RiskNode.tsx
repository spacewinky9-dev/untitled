import { memo, useState } from 'react'
import { Handle, Position, NodeProps } from '@xyflow/react'
import { cn } from '@/lib/utils'
import { InlineNodeEditor } from '../InlineNodeEditor'
import { getCategoryColors } from '@/constants/node-categories'

export interface RiskNodeData extends Record<string, unknown> {
  label: string
  blockNumber?: number | string
  riskPercent?: number
  pips?: number
  lots?: number
  method?: string
}

export const RiskNode = memo(({ data, selected, id }: NodeProps) => {
  const nodeData = data as RiskNodeData
  const isDisabled = nodeData.disabled || false
  const [isEditingLabel, setIsEditingLabel] = useState(false)
  
  const inputs = [{ id: 'input', label: 'Input' }]
  const outputs = [{ id: 'output', label: 'Value' }]
  
  const colors = getCategoryColors('risk')

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsEditingLabel(true)
  }

  return (
    <div className={cn(
      "px-3 py-1.5 rounded-md min-w-[120px] transition-all relative",
      selected ? "ring-2 ring-offset-1 ring-offset-[oklch(0.25_0.01_260)]" : "",
      isDisabled && "opacity-50"
    )} style={{ 
      backgroundColor: colors.bgColor,
      borderColor: selected ? colors.borderColor : 'transparent',
      borderWidth: selected ? '2px' : '0px'
    }}>
      {nodeData.blockNumber !== undefined && (
        <div 
          className="absolute -top-2 -left-2 w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-mono font-bold text-black border-2 border-[oklch(0.25_0.01_260)] shadow-md"
          style={{ backgroundColor: colors.accentColor }}
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
          className="!w-2.5 !h-2.5 !rounded-sm !border-2"
          style={{ 
            backgroundColor: colors.accentColor,
            borderColor: colors.borderColor,
            top: `${50 + (idx - (outputs.length - 1) / 2) * 16}%`
          }}
        />
      ))}
    </div>
  )
})

RiskNode.displayName = 'RiskNode'
