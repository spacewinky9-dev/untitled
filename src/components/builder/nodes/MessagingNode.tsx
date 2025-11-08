import { memo } from 'react'
import { Handle, Position, NodeProps } from '@xyflow/react'
import { 
  EnvelopeSimple, 
  DeviceMobile, 
  Globe,
  PaperPlaneTilt,
  Bell
} from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

export interface MessagingNodeData extends Record<string, unknown> {
  label: string
  messagingType: 'email' | 'notification' | 'webhook' | 'telegram'
  parameters?: Record<string, any>
}

const ICONS = {
  email: EnvelopeSimple,
  notification: DeviceMobile,
  webhook: Globe,
  telegram: PaperPlaneTilt
}

export const MessagingNode = memo(({ data, selected }: NodeProps) => {
  const nodeData = data as MessagingNodeData
  const Icon = ICONS[nodeData.messagingType] || Bell
  
  return (
    <div className={cn(
      "px-3 py-2 rounded-lg border-2 bg-card min-w-[140px] transition-all",
      selected ? "border-primary shadow-lg shadow-primary/20" : "border-border",
      "border-l-4 border-l-sky-500"
    )}>
      <Handle
        type="target"
        position={Position.Left}
        id="trigger"
        className="w-2.5 h-2.5 !bg-sky-500 border-2 !border-sky-500"
      />
      
      <div className="flex items-start gap-2">
        <div className="flex-shrink-0 p-1 rounded bg-sky-500/20">
          <Icon size={12} weight="bold" className="text-sky-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-xs text-foreground truncate">
            {nodeData.label}
          </div>
          <div className="text-[10px] text-muted-foreground mt-0.5 truncate">
            Messaging
          </div>
        </div>
      </div>
      
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        className="w-2.5 h-2.5 !bg-sky-500 border-2 !border-sky-500"
      />
    </div>
  )
})

MessagingNode.displayName = 'MessagingNode'
