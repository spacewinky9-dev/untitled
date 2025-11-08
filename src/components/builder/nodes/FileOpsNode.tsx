import { memo } from 'react'
import { Handle, Position, NodeProps } from '@xyflow/react'
import { 
  FloppyDisk, 
  FileText, 
  Trash
} from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

export interface FileOpsNodeData extends Record<string, unknown> {
  label: string
  fileOpType: 'write' | 'read' | 'delete'
  parameters?: Record<string, any>
}

const ICONS = {
  write: FloppyDisk,
  read: FileText,
  delete: Trash
}

export const FileOpsNode = memo(({ data, selected }: NodeProps) => {
  const nodeData = data as FileOpsNodeData
  const Icon = ICONS[nodeData.fileOpType] || FileText
  
  return (
    <div className={cn(
      "px-3 py-2 rounded-lg border-2 bg-card min-w-[140px] transition-all",
      selected ? "border-primary shadow-lg shadow-primary/20" : "border-border",
      "border-l-4 border-l-amber-500"
    )}>
      <Handle
        type="target"
        position={Position.Left}
        id="trigger"
        className="w-2.5 h-2.5 !bg-amber-500 border-2 !border-amber-500"
      />
      
      <div className="flex items-start gap-2">
        <div className="flex-shrink-0 p-1 rounded bg-amber-500/20">
          <Icon size={12} weight="bold" className="text-amber-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-xs text-foreground truncate">
            {nodeData.label}
          </div>
          <div className="text-[10px] text-muted-foreground mt-0.5 truncate">
            File Ops
          </div>
        </div>
      </div>
      
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        className="w-2.5 h-2.5 !bg-amber-500 border-2 !border-amber-500"
      />
    </div>
  )
})

FileOpsNode.displayName = 'FileOpsNode'
