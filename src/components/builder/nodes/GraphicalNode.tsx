import { memo } from 'react'
import { Handle, Position, NodeProps } from '@xyflow/react'
import { 
  ArrowUp, 
  LineSegment, 
  Minus,
  DividerVertical,
  TextT,
  ChartLine,
  Rectangle,
  Trash
} from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

export interface GraphicalNodeData extends Record<string, unknown> {
  label: string
  graphicalType: 'arrow' | 'line' | 'hline' | 'vline' | 'text' | 'fibonacci' | 'rectangle' | 'delete'
  parameters?: Record<string, any>
}

const ICONS = {
  arrow: ArrowUp,
  line: LineSegment,
  hline: Minus,
  vline: DividerVertical,
  text: TextT,
  fibonacci: ChartLine,
  rectangle: Rectangle,
  delete: Trash
}

export const GraphicalNode = memo(({ data, selected }: NodeProps) => {
  const nodeData = data as GraphicalNodeData
  const Icon = ICONS[nodeData.graphicalType] || ArrowUp
  
  return (
    <div className={cn(
      "px-3 py-2 rounded-lg border-2 bg-card min-w-[140px] transition-all",
      selected ? "border-primary shadow-lg shadow-primary/20" : "border-border",
      "border-l-4 border-l-indigo-500"
    )}>
      <Handle
        type="target"
        position={Position.Left}
        id="trigger"
        className="w-2.5 h-2.5 !bg-indigo-500 border-2 !border-indigo-500"
      />
      
      <div className="flex items-start gap-2">
        <div className="flex-shrink-0 p-1 rounded bg-indigo-500/20">
          <Icon size={12} weight="bold" className="text-indigo-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-xs text-foreground truncate">
            {nodeData.label}
          </div>
          <div className="text-[10px] text-muted-foreground mt-0.5 truncate">
            Graphical
          </div>
        </div>
      </div>
      
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        className="w-2.5 h-2.5 !bg-indigo-500 border-2 !border-indigo-500"
      />
    </div>
  )
})

GraphicalNode.displayName = 'GraphicalNode'
