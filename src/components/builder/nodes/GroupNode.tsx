import { memo, useState } from 'react'
import { Handle, Position, NodeProps, useReactFlow } from '@xyflow/react'
import { CaretDown, CaretRight, Folder, FolderOpen } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

export const GroupNode = memo(({ id, data, selected }: NodeProps) => {
  const { setNodes } = useReactFlow()
  const [isExpanded, setIsExpanded] = useState(data.isExpanded ?? true)

  const handleToggleExpand = () => {
    const newExpanded = !isExpanded
    setIsExpanded(newExpanded)
    
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              isExpanded: newExpanded
            },
            style: {
              ...node.style,
              width: newExpanded ? 'auto' : 200,
              height: newExpanded ? 'auto' : 60
            }
          }
        }
        
        if (data.childNodeIds?.includes(node.id)) {
          return {
            ...node,
            hidden: !newExpanded
          }
        }
        return node
      })
    )
  }

  const groupColor = data.color || 'oklch(0.55 0.15 240)'

  return (
    <div
      className={cn(
        'rounded-lg border-2 transition-all',
        'bg-card/50 backdrop-blur-sm',
        selected ? 'shadow-lg' : 'shadow-md'
      )}
      style={{
        borderColor: groupColor,
        minWidth: isExpanded ? 300 : 200,
        minHeight: isExpanded ? 200 : 60
      }}
    >
      <div
        className="flex items-center gap-2 p-3 cursor-pointer border-b"
        onClick={handleToggleExpand}
        style={{
          borderBottomColor: `${groupColor}40`,
          backgroundColor: `${groupColor}15`
        }}
      >
        {isExpanded ? (
          <FolderOpen size={20} style={{ color: groupColor }} />
        ) : (
          <Folder size={20} style={{ color: groupColor }} />
        )}
        
        <div className="flex-1">
          <div className="text-sm font-semibold" style={{ color: groupColor }}>
            {data.label}
          </div>
          {data.description && (
            <div className="text-xs text-muted-foreground mt-0.5">
              {data.description}
            </div>
          )}
        </div>

        {isExpanded ? (
          <CaretDown size={16} className="text-muted-foreground" />
        ) : (
          <CaretRight size={16} className="text-muted-foreground" />
        )}
      </div>

      {isExpanded && (
        <div className="p-4 text-xs text-muted-foreground">
          <div className="flex items-center justify-between">
            <span>{data.childNodeIds?.length || 0} nodes</span>
            <span>{data.internalEdges?.length || 0} connections</span>
          </div>
        </div>
      )}

      <Handle
        type="target"
        position={Position.Left}
        id="input"
        className="!w-3 !h-3 !border-2"
        style={{ borderColor: groupColor, backgroundColor: 'oklch(0.28 0.005 260)' }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        className="!w-3 !h-3 !border-2"
        style={{ borderColor: groupColor, backgroundColor: 'oklch(0.28 0.005 260)' }}
      />
    </div>
  )
})

GroupNode.displayName = 'GroupNode'
