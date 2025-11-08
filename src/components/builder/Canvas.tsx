import { useCallback, useMemo, useRef, useState, useEffect } from 'react'
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
  Edge,
  useReactFlow
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { Button } from '@/components/ui/button'
import { Play, FloppyDisk, FolderOpen, Trash, ArrowsOut } from '@phosphor-icons/react'
import { IndicatorNode } from './nodes/IndicatorNode'
import { ConditionNode } from './nodes/ConditionNode'
import { ActionNode } from './nodes/ActionNode'
import { LogicNode } from './nodes/LogicNode'
import { RiskNode } from './nodes/RiskNode'
import { NodePalette } from './NodePalette'
import { PropertiesPanel } from './PropertiesPanel'
import { NodeDefinition } from '@/constants/node-categories'
import { useKV } from '@github/spark/hooks'
import { Strategy } from '@/types/strategy'
import { toast } from 'sonner'

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
    action: ActionNode,
    logic: LogicNode,
    risk: RiskNode
  }), [])

  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const { screenToFlowPosition, fitView } = useReactFlow()
  const [nodeIdCounter, setNodeIdCounter] = useState(5)
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [showProperties, setShowProperties] = useState(false)
  const [strategies, setStrategies] = useKV<Strategy[]>('strategies', [])
  const [currentStrategyId, setCurrentStrategyId] = useState<string | null>(null)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault()
        onSaveStrategy()
      }
      if (event.key === 'Delete' || event.key === 'Backspace') {
        const target = event.target as HTMLElement
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
          event.preventDefault()
          onDeleteSelected()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [nodes, edges])

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge(connection, eds))
    },
    [setEdges]
  )

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()

      const nodeDefinitionData = event.dataTransfer.getData('application/reactflow')
      if (!nodeDefinitionData) return

      const nodeDefinition: NodeDefinition = JSON.parse(nodeDefinitionData)
      
      if (!reactFlowWrapper.current) return

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY
      })

      const newNode: Node = {
        id: `node-${nodeIdCounter}`,
        type: nodeDefinition.type,
        position,
        data: {
          label: nodeDefinition.label,
          ...nodeDefinition.defaultParameters
        }
      }

      setNodes((nds) => nds.concat(newNode))
      setNodeIdCounter((id) => id + 1)
    },
    [screenToFlowPosition, nodeIdCounter, setNodes]
  )

  const onNodeAdd = useCallback(
    (nodeDefinition: NodeDefinition) => {
      const position = { x: 250, y: 250 }

      const newNode: Node = {
        id: `node-${nodeIdCounter}`,
        type: nodeDefinition.type,
        position,
        data: {
          label: nodeDefinition.label,
          ...nodeDefinition.defaultParameters
        }
      }

      setNodes((nds) => nds.concat(newNode))
      setNodeIdCounter((id) => id + 1)
    },
    [nodeIdCounter, setNodes]
  )

  const onDeleteSelected = useCallback(() => {
    setNodes((nds) => nds.filter(node => !node.selected))
    setEdges((eds) => eds.filter(edge => !edge.selected))
  }, [setNodes, setEdges])

  const onFitView = useCallback(() => {
    fitView({ padding: 0.2, duration: 400 })
  }, [fitView])

  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    setSelectedNode(node)
    setShowProperties(true)
  }, [])

  const onPaneClick = useCallback(() => {
    setSelectedNode(null)
  }, [])

  const onSaveStrategy = useCallback(() => {
    const existingStrategy = strategies?.find(s => s.id === currentStrategyId)
    
    const strategy: Strategy = {
      id: currentStrategyId || `strategy-${Date.now()}`,
      name: existingStrategy?.name || 'Untitled Strategy',
      description: '',
      version: '1.0.0',
      createdAt: existingStrategy?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      nodes: nodes,
      edges: edges
    }

    setStrategies((current) => {
      const currentList = current || []
      const existing = currentList.findIndex(s => s.id === strategy.id)
      if (existing >= 0) {
        const updated = [...currentList]
        updated[existing] = strategy
        toast.success('Strategy saved successfully')
        return updated
      }
      toast.success('Strategy created successfully')
      return [...currentList, strategy]
    })

    if (!currentStrategyId) {
      setCurrentStrategyId(strategy.id)
    }
  }, [nodes, edges, currentStrategyId, strategies, setStrategies])

  return (
    <div className="w-full h-full flex">
      <NodePalette onNodeAdd={onNodeAdd} />
      
      <div ref={reactFlowWrapper} className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
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
            <Button size="sm" variant="outline" className="gap-2" onClick={onSaveStrategy}>
              <FloppyDisk size={16} />
              Save
            </Button>
            <Button 
              size="sm" 
              variant="default" 
              className="gap-2 bg-bullish text-bullish-foreground hover:bg-bullish/90"
            >
              <Play size={16} weight="fill" />
              Run Backtest
            </Button>
          </Panel>

          <Panel position="top-right" className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              className="gap-2"
              onClick={onFitView}
            >
              <ArrowsOut size={16} />
              Fit View
            </Button>
            <Button 
              size="sm" 
              variant="destructive" 
              className="gap-2"
              onClick={onDeleteSelected}
            >
              <Trash size={16} />
              Delete
            </Button>
          </Panel>
        </ReactFlow>
      </div>

      {showProperties && (
        <PropertiesPanel 
          selectedNode={selectedNode} 
          onClose={() => setShowProperties(false)} 
        />
      )}
    </div>
  )
}


