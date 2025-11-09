import { memo, useState } from 'react'
import { Handle, Position, NodeProps } from '@xyflow/react'
import { cn } from '@/lib/utils'
import { InlineNodeEditor } from '../InlineNodeEditor'

export interface PassNodeData extends Record<string, unknown> {
  label: string
  blockNumber?: number | string
  executionOrder?: number
}

export const PassNode = memo(({ data, selected, id }: NodeProps) => {
  const nodeData = data as PassNodeData
  const isDisabled = nodeData.disabled || false
  const [isEditingLabel, setIsEditingLabel] = useState(false)
  
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
        "px-3 py-1.5 rounded-md bg-[oklch(0.35_0.015_260)] min-w-[120px] transition-all relative border border-dashed border-[oklch(0.45_0.015_260)] cursor-grab active:cursor-grabbing",
        selected ? "ring-2 ring-[#f59e0b] ring-offset-1 ring-offset-[oklch(0.25_0.01_260)]" : "",
        isDisabled && "opacity-50"
      )}
    >      {nodeData.blockNumber !== undefined && (
        <div 
          className="absolute -top-2 -left-2 w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-mono font-bold text-white border-2 border-[oklch(0.25_0.01_260)] shadow-md"
          style={{ backgroundColor: '#6b7280' }}
        >
          {nodeData.blockNumber}
        </div>
      )}
      
      <Handle
        type="target"
        position={Position.Left}
        id="input"
        className="!w-2.5 !h-2.5 !bg-white !border-2 !border-[#6b7280] !rounded-sm"
        style={{ 
          top: '50%'
        }}
      />
      
      <div className="flex items-center justify-center" onDoubleClick={handleDoubleClick} onMouseDown={handleMouseDown}>
        <InlineNodeEditor
          nodeId={id}
          currentLabel={nodeData.label}
          isEditing={isEditingLabel}
          onEditComplete={() => setIsEditingLabel(false)}
          className="italic text-muted-foreground"
        />
      </div>
      
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        className="!w-2.5 !h-2.5 !bg-[#6b7280] !border-2 !border-[#52525b] !rounded-sm"
        style={{ 
          top: '50%'
        }}
      />
    </div>
  )
})

PassNode.displayName = 'PassNode'
