import { memo } from 'react'
import { Handle, Position, NodeProps } from '@xyflow/react'
import { Percent, WarningOctagon, Target, ShieldCheck } from '@phosphor-icons/react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export const RiskNode = memo(({ data, selected }: NodeProps) => {
  const getIcon = () => {
    const label = String(data.label).toLowerCase()
    if (label.includes('stop')) return <WarningOctagon size={20} />
    if (label.includes('take') || label.includes('profit')) return <Target size={20} />
    if (label.includes('trailing')) return <ShieldCheck size={20} />
    return <Percent size={20} />
  }

  const getParameterDisplay = () => {
    if (data.riskPercent) {
      return `${data.riskPercent}% risk`
    }
    if (data.pips) {
      return `${data.pips} pips`
    }
    if (data.lots) {
      return `${data.lots} lots`
    }
    return null
  }

  return (
    <Card className={`
      min-w-[180px] border-2 transition-all
      ${selected 
        ? 'border-primary shadow-lg shadow-primary/20' 
        : 'border-yellow-500 hover:border-yellow-400'
      }
    `}>
      <div className="bg-yellow-500/20 border-b-2 border-yellow-500 px-3 py-2 flex items-center gap-2">
        <div className="text-yellow-400">
          {getIcon()}
        </div>
        <div className="flex-1">
          <div className="text-xs font-medium text-yellow-400">Risk Management</div>
          <div className="text-sm font-semibold text-foreground">{String(data.label)}</div>
        </div>
      </div>
      
      <div className="p-3 space-y-2">
        {getParameterDisplay() && (
          <div className="flex justify-center">
            <Badge variant="outline" className="font-mono text-xs border-yellow-500/50">
              {getParameterDisplay()}
            </Badge>
          </div>
        )}
        {typeof data.method === 'string' && data.method.length > 0 && (
          <div className="text-xs text-center text-muted-foreground">
            Method: {data.method.replace(/_/g, ' ')}
          </div>
        )}
      </div>

      <Handle
        type="target"
        position={Position.Left}
        id="trigger"
        style={{ background: '#eab308' }}
        className="w-3 h-3 border-2 border-yellow-400"
      />
      
      <Handle
        type="source"
        position={Position.Right}
        id="value-out"
        style={{ background: '#eab308' }}
        className="w-3 h-3 border-2 border-yellow-400"
      />
    </Card>
  )
})

RiskNode.displayName = 'RiskNode'
