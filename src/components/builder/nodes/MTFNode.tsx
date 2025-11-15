import { memo } from 'react'
import { Handle, Position, NodeProps } from '@xyflow/react'
import { cn } from '@/lib/utils'
import { getTimeframeInfo } from '@/constants/timeframes'

export interface MTFNodeData extends Record<string, unknown> {
  label: string
  mtfType: 'mtf_indicator' | 'mtf_condition' | 'higher_timeframe_trend'
  parameters?: Record<string, any>
  blockNumber?: number | string
  timeframe?: string
  indicator?: string
}

export const MTFNode = memo(({ data, selected }: NodeProps) => {
  const nodeData = data as MTFNodeData
  const isDisabled = nodeData.disabled || false
  
  // Get timeframe info for display
  const timeframeInfo = nodeData.timeframe ? getTimeframeInfo(nodeData.timeframe as any) : null
  
  const inputs = [{ id: 'trigger', label: 'Trigger' }]
  const outputs = [
    { id: nodeData.mtfType === 'mtf_condition' ? 'result' : 
           nodeData.mtfType === 'higher_timeframe_trend' ? 'trend' : 'value', 
      label: nodeData.mtfType === 'mtf_condition' ? 'Result' : 
             nodeData.mtfType === 'higher_timeframe_trend' ? 'Trend' : 'Value' }
  ]
  
  return (
    <div className={cn(
      "px-3 py-2 rounded-md bg-[oklch(0.35_0.015_260)] min-w-[140px] transition-all relative",
      selected ? "ring-2 ring-[#06b6d4] ring-offset-1 ring-offset-[oklch(0.25_0.01_260)]" : "",
      isDisabled && "opacity-50"
    )}>
      {nodeData.blockNumber !== undefined && (
        <div 
          className="absolute -top-2 -left-2 w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-mono font-bold text-white border-2 border-[oklch(0.25_0.01_260)] shadow-md"
          style={{ backgroundColor: '#06b6d4' }}
        >
          {nodeData.blockNumber}
        </div>
      )}
      
      {inputs.map((input, idx) => (
        <Handle
          key={input.id}
          type="target"
          position={Position.Left}
          id={input.id}
          className="!w-2.5 !h-2.5 !bg-white !border-2 !border-[#6b7280] !rounded-sm"
          style={{ 
            top: `${50 + (idx - (inputs.length - 1) / 2) * 16}%`
          }}
        />
      ))}
      
      <div className="flex flex-col items-center justify-center gap-0.5">
        <div className="font-semibold text-xs text-foreground text-center leading-tight">
          {nodeData.label}
        </div>
        {timeframeInfo && (
          <div className="text-[10px] text-cyan-400 font-mono">
            {timeframeInfo.value}
          </div>
        )}
        {nodeData.indicator && (
          <div className="text-[10px] text-muted-foreground">
            {nodeData.indicator.toUpperCase()}
          </div>
        )}
      </div>
      
      {outputs.map((output, idx) => (
        <Handle
          key={output.id}
          type="source"
          position={Position.Right}
          id={output.id}
          className="!w-2.5 !h-2.5 !bg-[#06b6d4] !border-2 !border-[#0891b2] !rounded-sm"
          style={{ 
            top: `${50 + (idx - (outputs.length - 1) / 2) * 16}%`
          }}
        />
      ))}
    </div>
  )
})

MTFNode.displayName = 'MTFNode'
