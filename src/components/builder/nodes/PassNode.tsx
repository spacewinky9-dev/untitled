import { memo } from 'react'
import { Handle, Position, NodeProps } from '@xyflow/react'
import { Circle } from '@phosphor-icons/react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export interface PassNodeData extends Record<string, unknown> {
  label: string
  blockNumber?: number | string
  executionOrder?: number
}

export const PassNode = memo(({ data, selected }: NodeProps) => {
  const nodeData = data as PassNodeData
  
  return (
    <div className={cn(
      "px-3 py-2.5 rounded-lg border-2 bg-card min-w-[120px] transition-all relative shadow-md",
      selected ? "border-primary shadow-lg shadow-primary/20" : "border-border border-dashed",
      "border-l-4 border-l-gray-500"
    )}>
      {nodeData.blockNumber !== undefined && (
        <Badge 
          variant="secondary" 
          className="absolute -top-2.5 -left-2.5 min-h-6 min-w-6 px-1.5 flex items-center justify-center rounded-md text-[10px] font-mono font-bold bg-gray-500 text-white border-2 border-background"
        >
          {nodeData.blockNumber}
        </Badge>
      )}
      
      <Handle
        type="target"
        position={Position.Top}
        id="input"
        className="!w-4 !h-4 !bg-white !border-2 !border-gray-400 !rounded-full"
        style={{ 
          top: -8,
          left: '50%',
          transform: 'translateX(-50%)'
        }}
      />
      
      <div className="flex items-start gap-1.5 mb-1">
        <div className="flex-shrink-0 p-1 rounded bg-muted">
          <Circle size={14} weight="regular" className="text-muted-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-xs text-foreground truncate">
            {nodeData.label}
          </div>
          <div className="text-[10px] text-muted-foreground mt-0.5 truncate italic">
            Empty block
          </div>
        </div>
      </div>
      
      <div className="flex justify-center pt-1">
        <Handle
          type="source"
          position={Position.Bottom}
          id="output"
          className="!w-3.5 !h-3.5 !rounded-full !border-2"
          style={{ 
            backgroundColor: '#10b981',
            borderColor: '#10b981',
            position: 'relative',
            bottom: 'auto',
            left: 'auto',
            transform: 'none',
            marginTop: 4
          }}
        />
      </div>
    </div>
  )
})

PassNode.displayName = 'PassNode'
