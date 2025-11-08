import { memo } from 'react'
import { Handle, Position, NodeProps } from '@xyflow/react'
import { 
  Package, 
  Cube
} from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

export interface CustomBlockNodeData extends Record<string, unknown> {
  label: string
  customBlockType: 'create' | 'use'
  parameters?: Record<string, any>
  inputs?: Array<{ id: string; label: string }>
  outputs?: Array<{ id: string; label: string }>
}

export const CustomBlockNode = memo(({ data, selected }: NodeProps) => {
  const nodeData = data as CustomBlockNodeData
  const Icon = nodeData.customBlockType === 'create' ? Package : Cube
  const inputs = nodeData.inputs || []
  const outputs = nodeData.outputs || []
  
  return (
    <div className={cn(
      "px-3 py-2 rounded-lg border-2 bg-card min-w-[140px] transition-all",
      selected ? "border-primary shadow-lg shadow-primary/20" : "border-border",
      "border-l-4 border-l-rose-500"
    )}>
      {inputs.length > 0 ? (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 flex flex-col gap-2">
          {inputs.map((input, idx) => (
            <Handle
              key={input.id}
              type="target"
              position={Position.Left}
              id={input.id}
              style={{ top: `${((idx + 1) / (inputs.length + 1)) * 100}%` }}
              className="w-2.5 h-2.5 !bg-rose-500 border-2 !border-rose-500"
            />
          ))}
        </div>
      ) : (
        <Handle
          type="target"
          position={Position.Left}
          id="input"
          className="w-2.5 h-2.5 !bg-rose-500 border-2 !border-rose-500"
        />
      )}
      
      <div className="flex items-start gap-2">
        <div className="flex-shrink-0 p-1 rounded bg-rose-500/20">
          <Icon size={12} weight="bold" className="text-rose-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-xs text-foreground truncate">
            {nodeData.label}
          </div>
          <div className="text-[10px] text-muted-foreground mt-0.5 truncate">
            Custom Block
          </div>
        </div>
      </div>
      
      {outputs.length > 0 ? (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col gap-2">
          {outputs.map((output, idx) => (
            <Handle
              key={output.id}
              type="source"
              position={Position.Right}
              id={output.id}
              style={{ top: `${((idx + 1) / (outputs.length + 1)) * 100}%` }}
              className="w-2.5 h-2.5 !bg-rose-500 border-2 !border-rose-500"
            />
          ))}
        </div>
      ) : (
        <Handle
          type="source"
          position={Position.Right}
          id="output"
          className="w-2.5 h-2.5 !bg-rose-500 border-2 !border-rose-500"
        />
      )}
    </div>
  )
})

CustomBlockNode.displayName = 'CustomBlockNode'
