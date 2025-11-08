import { memo } from 'react'
import { Handle, Position, NodeProps } from '@xyflow/react'
import { CirclesThree, ProhibitInset } from '@phosphor-icons/react'
import { Card } from '@/components/ui/card'

export const LogicNode = memo(({ data, selected }: NodeProps) => {
  const operator = (data.operator as string) || (typeof data.label === 'string' ? data.label.toUpperCase() : 'AND')
  
  const getIcon = () => {
    if (operator === 'NOT') {
      return <ProhibitInset size={20} />
    }
    return <CirclesThree size={20} />
  }

  const inputCount = operator === 'NOT' ? 1 : 2

  return (
    <Card className={`
      min-w-[160px] border-2 transition-all
      ${selected 
        ? 'border-primary shadow-lg shadow-primary/20' 
        : 'border-purple-500 hover:border-purple-400'
      }
    `}>
      <div className="bg-purple-500/20 border-b-2 border-purple-500 px-3 py-2 flex items-center gap-2">
        <div className="text-purple-400">
          {getIcon()}
        </div>
        <div className="flex-1">
          <div className="text-xs font-medium text-purple-400">Logic</div>
          <div className="text-sm font-semibold text-foreground">{String(data.label)}</div>
        </div>
      </div>
      
      <div className="p-3 space-y-2">
        <div className="flex items-center justify-center">
          <div className="text-2xl font-bold text-purple-400">
            {operator}
          </div>
        </div>
      </div>

      {inputCount >= 1 && (
        <Handle
          type="target"
          position={Position.Left}
          id="input-a"
          style={{ top: '35%', background: '#a855f7' }}
          className="w-3 h-3 border-2 border-purple-400"
        />
      )}
      
      {inputCount >= 2 && (
        <Handle
          type="target"
          position={Position.Left}
          id="input-b"
          style={{ top: '65%', background: '#a855f7' }}
          className="w-3 h-3 border-2 border-purple-400"
        />
      )}
      
      <Handle
        type="source"
        position={Position.Right}
        id="result"
        style={{ background: '#a855f7' }}
        className="w-3 h-3 border-2 border-purple-400"
      />
    </Card>
  )
})

LogicNode.displayName = 'LogicNode'
