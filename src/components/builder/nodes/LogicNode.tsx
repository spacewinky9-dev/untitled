import { memo, useState } from 'react'
import { Handle, Position, NodeProps } from '@xyflow/react'
import { cn } from '@/lib/utils'
import { InlineNodeEditor } from '../InlineNodeEditor'
import { getCategoryColors } from '@/constants/node-categories'

export interface LogicNodeData extends Record<string, unknown> {
  label: string
  operator?: string
  blockNumber?: number | string
  executionOrder?: number
}

export const LogicNode = memo(({ data, selected, id }: NodeProps) => {
  const nodeData = data as LogicNodeData
  const operator = nodeData.operator || (typeof nodeData.label === 'string' ? nodeData.label.toUpperCase() : 'AND')
  const isPassBlock = operator === 'PASS' || nodeData.label === 'Pass'
  const isDisabled = nodeData.disabled || false
  const [isEditingLabel, setIsEditingLabel] = useState(false)

  const inputCount = operator === 'NOT' ? 1 : isPassBlock ? 1 : 2
  
  const colors = getCategoryColors('logic')

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsEditingLabel(true)
  }

  return (
    <div 
      className={cn(
        "px-3 py-1.5 rounded-md min-w-[120px] transition-all relative cursor-grab active:cursor-grabbing",
        isPassBlock && "border border-dashed border-[oklch(0.45_0.015_260)]",
        selected ? "ring-2 ring-offset-1 ring-offset-[oklch(0.25_0.01_260)]" : "",
        isDisabled && "opacity-50"
      )} 
      style={{ 
        backgroundColor: colors.bgColor,
        borderColor: selected ? colors.borderColor : (isPassBlock ? undefined : 'transparent'),
        borderWidth: selected ? '2px' : (isPassBlock ? '1px' : '0px')
      }}
    >
      {nodeData.blockNumber !== undefined && (
        <div 
          className="absolute -top-2 -left-2 w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-mono font-bold text-white border-2 border-[oklch(0.25_0.01_260)] shadow-md"
          style={{ backgroundColor: isPassBlock ? '#6b7280' : colors.accentColor }}
        >
          {nodeData.blockNumber}
        </div>
      )}
      
      {Array.from({ length: inputCount }).map((_, idx) => (
        <Handle
          key={`input-${idx}`}
          type="target"
          position={Position.Left}
          id={inputCount === 1 ? 'input' : `input-${idx}`}
          className="!w-2.5 !h-2.5 !bg-white !border-2 !border-[#6b7280] !rounded-sm"
          style={{ 
            top: `${50 + (idx - (inputCount - 1) / 2) * 16}%`
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
      
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        className="!w-2.5 !h-2.5 !rounded-sm !border-2"
        style={{ 
          backgroundColor: colors.accentColor,
          borderColor: colors.borderColor,
          top: '50%'
        }}
      />
    </div>
  )
})

LogicNode.displayName = 'LogicNode'
