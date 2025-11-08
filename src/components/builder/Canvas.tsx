import { useCallback, useMemo } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Panel,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  BackgroundVariant,
  Node,
  Edge
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { Button } from '@/components/ui/button'
import { Play, FloppyDisk, FolderOpen } from '@phosphor-icons/react'
import { IndicatorNode } from './nodes/IndicatorNode'
import { ConditionNode } from './nodes/ConditionNode'
import { ActionNode } from './nodes/ActionNode'

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'indicator',
    position: { x: 100, y: 100 },
    data: {
      label: 'Moving Average',
      indicatorType: 'SMA',
      parameters: { period: 20, source: 'close' }
    }
  },
  {
    id: '2',
    type: 'indicator',
    position: { x: 100, y: 220 },
    data: {
      label: 'RSI',
      indicatorType: 'RSI',
      parameters: { period: 14 }
    }
  },
  {
    id: '3',
    type: 'condition',
    position: { x: 400, y: 150 },
    data: {
      label: 'Cross Above',
      operator: 'cross_above'
    }
  },
  {
    id: '4',
    type: 'action',
    position: { x: 650, y: 150 },
    data: {
      label: 'Buy Signal',
      action: 'buy'
    }
  }
]

const initialEdges: Edge[] = [
  { id: 'e1-3', source: '1', target: '3', sourceHandle: 'value-out', targetHandle: 'input-a' },
  { id: 'e2-3', source: '2', target: '3', sourceHandle: 'value-out', targetHandle: 'input-b' },
  { id: 'e3-4', source: '3', target: '4', sourceHandle: 'result', targetHandle: 'trigger' }
]

export function Canvas() {
  const nodeTypes = useMemo(() => ({
    indicator: IndicatorNode,
    condition: ConditionNode,
    action: ActionNode
  }), [])

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge(connection, eds))
    },
    [setEdges]
  )

  return (
    <div className="w-full h-full relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        className="bg-background"
      >
        <Background 
          variant={BackgroundVariant.Dots}
          gap={16}
          size={1}
          color="oklch(0.30 0.02 250)"
        />
        
        <Controls 
          className="bg-card border border-border"
          showInteractive={false}
        />
        
        <MiniMap 
          className="bg-card border border-border"
          nodeColor={() => 'oklch(0.35 0.12 250)'}
          maskColor="oklch(0.15 0.01 250 / 0.8)"
        />
        
        <Panel position="top-left" className="flex gap-2">
          <Button size="sm" className="gap-2">
            <FolderOpen size={16} />
            Open
          </Button>
          <Button size="sm" variant="outline" className="gap-2">
            <FloppyDisk size={16} />
            Save
          </Button>
          <Button size="sm" variant="default" className="gap-2 bg-bullish text-bullish-foreground hover:bg-bullish/90">
            <Play size={16} weight="fill" />
            Run Backtest
          </Button>
        </Panel>
      </ReactFlow>
    </div>
  )
}


