import { memo, useState } from 'react'
import { Handle, Position, NodeProps } from '@xyflow/react'
import { cn } from '@/lib/utils'
import { InlineNodeEditor } from '../InlineNodeEditor'
import { getCategoryColors } from '@/constants/node-categories'

export interface EventNodeData extends Record<string, unknown> {
  label: string
  eventType: 'on_init' | 'on_tick' | 'on_timer' | 'on_trade' | 'on_chart' | 'on_deinit'
  parameters?: Record<string, any>
  blockNumber?: number | string
  executionOrder?: number
}

export const EventNode = memo(({ data, selected, id }: NodeProps) => {
  const nodeData = data as EventNodeData
  const isDisabled = nodeData.disabled || false
  const [isEditingLabel, setIsEditingLabel] = useState(false)
  
  const colors = getCategoryColors('event')
  
  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsEditingLabel(true)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isEditingLabel) {
      e.stopPropagation()
    }
  }
  
  return (
    <div 
      className={cn(
        "px-3 py-1.5 rounded-md min-w-[120px] transition-all relative cursor-grab active:cursor-grabbing",
        selected ? "ring-2 ring-offset-1 ring-offset-[oklch(0.25_0.01_260)]" : "",
        isDisabled && "opacity-50"
      )} 
      style={{ 
        backgroundColor: colors.bgColor,
        borderColor: selected ? colors.borderColor : 'transparent',
        borderWidth: selected ? '2px' : '0px'
      }}
    >
      {nodeData.blockNumber !== undefined && (
        <div 
          className="absolute -top-2 -left-2 w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-mono font-bold text-white border-2 border-[oklch(0.25_0.01_260)] shadow-md"
          style={{ backgroundColor: colors.accentColor }}
        >
          {nodeData.blockNumber}
        </div>
      )}
      
      <div className="flex items-center justify-center" onDoubleClick={handleDoubleClick} onMouseDown={handleMouseDown}>
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

EventNode.displayName = 'EventNode'
