import { memo } from 'react'
import { Handle, Position, NodeProps } from '@xyflow/react'
import { Database, FileSearch, NumberCircleOne, Stack } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

export interface VariableNodeData extends Record<string, unknown> {
  label: string
  variableType: 'set_variable' | 'get_variable' | 'counter' | 'array'
  parameters?: Record<string, any>
}

export const VariableNode = memo(({ data, selected }: NodeProps) => {
  const nodeData = data as VariableNodeData
  
  const getIcon = () => {
    switch (nodeData.variableType) {
      case 'set_variable': return Database
      case 'get_variable': return FileSearch
      case 'counter': return NumberCircleOne
      case 'array': return Stack
      default: return Database
    }
  }
  
  const Icon = getIcon()
  const isGetter = nodeData.variableType === 'get_variable'
  
  return (
    <div className={cn(
      "px-4 py-3 rounded-lg border-2 bg-card min-w-[180px] transition-all",
      selected ? "border-primary shadow-lg shadow-primary/20" : "border-border",
      "border-l-4 border-l-orange-500"
    )}>
      <Handle
        type="target"
        position={Position.Left}
        id="input"
        className="w-3 h-3 !bg-orange-500 border-2 !border-orange-500"
      />
      
      <div className="flex items-start gap-2">
        <div className="flex-shrink-0 p-1.5 rounded bg-orange-500/20">
          <Icon size={16} weight="bold" className="text-orange-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm text-foreground truncate">
            {nodeData.label}
          </div>
          <div className="text-xs text-muted-foreground mt-0.5 truncate">
            {isGetter ? 'Get Value' : 'Store Value'}
          </div>
        </div>
      </div>
      
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        className="w-3 h-3 !bg-orange-500 border-2 !border-orange-500"
      />
    </div>
  )
})

VariableNode.displayName = 'VariableNode'
