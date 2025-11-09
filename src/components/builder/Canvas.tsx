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
import { Badge } from '@/components/ui/badge'
import { Play, FloppyDisk, FolderOpen, Trash, ArrowsOut, Sparkle, Export, ArrowUUpLeft, ArrowUUpRight, ListNumbers, FilePlus, Question, BookOpen, CheckCircle } from '@phosphor-icons/react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { IndicatorNode } from './nodes/IndicatorNode'
import { ConditionNode } from './nodes/ConditionNode'
import { ActionNode } from './nodes/ActionNode'
import { LogicNode } from './nodes/LogicNode'
import { RiskNode } from './nodes/RiskNode'
import { EventNode } from './nodes/EventNode'
import { PassNode } from './nodes/PassNode'
import { MTFNode } from './nodes/MTFNode'
import { PatternNode } from './nodes/PatternNode'
import { VariableNode } from './nodes/VariableNode'
import { AdvancedNode } from './nodes/AdvancedNode'
import { MoneyManagementNode } from './nodes/MoneyManagementNode'
import { GraphicalNode } from './nodes/GraphicalNode'
import { MessagingNode } from './nodes/MessagingNode'
import { FileOpsNode } from './nodes/FileOpsNode'
import { TerminalNode } from './nodes/TerminalNode'
import { CustomBlockNode } from './nodes/CustomBlockNode'
import { NodePaletteWorkflow } from './NodePaletteWorkflow'
import { CompactNodePalette } from './CompactNodePalette'
import { EventTabs } from './EventTabs'
import { PropertiesPanel } from './PropertiesPanel'
import { AIStrategyBuilder } from './AIStrategyBuilder'
import { ExportDialog } from './ExportDialog'
import { EACreationGuide } from './EACreationGuide'
import { EADocumentation } from './EADocumentation'
import { ContextMenuWrapper } from './ContextMenu'
import { NewProjectDialog, ProjectConfig } from './NewProjectDialog'
import { LoadStrategyDialog } from './LoadStrategyDialog'
import { EditBlockLabelDialog } from './EditBlockLabelDialog'
import { TemplatesDialog } from './TemplatesDialog'
import { ValidationPanel } from './ValidationPanel'
import { StrategyTemplate } from '@/lib/strategy-templates'
import { NodeDefinition, EventCategory, getCategoryColors } from '@/constants/node-categories'
import { useKV } from '@github/spark/hooks'
import { useHistory } from '@/hooks/use-history'
import { useClipboard } from '@/hooks/use-clipboard'
import { Strategy } from '@/types/strategy'
import { toast } from 'sonner'
import { calculateBlockNumbers, validateMultipleBranches } from '@/lib/block-numbers'
import { ConnectionValidator } from '@/lib/engine/connection-validator'

const initialNodes: Node[] = []
const initialEdges: Edge[] = []

interface CanvasProps {
  pendingLoadStrategyId?: string | null
  onStrategyLoaded?: () => void
}

export function Canvas({ pendingLoadStrategyId, onStrategyLoaded }: CanvasProps = {}) {
  const nodeTypes = useMemo(() => ({
    indicator: IndicatorNode,
    condition: ConditionNode,
    action: ActionNode,
    logic: LogicNode,
    risk: RiskNode,
    event: EventNode,
    pass: PassNode,
    mtf: MTFNode,
    pattern: PatternNode,
    variable: VariableNode,
    advanced: AdvancedNode,
    money_management: MoneyManagementNode,
    graphical: GraphicalNode,
    messaging: MessagingNode,
    file_ops: FileOpsNode,
    terminal: TerminalNode,
    custom: CustomBlockNode
  }), [])

  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const { screenToFlowPosition, fitView } = useReactFlow()
  const [nodeIdCounter, setNodeIdCounter] = useState(5)
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [showProperties, setShowProperties] = useState(false)
  const [showAIBuilder, setShowAIBuilder] = useState(false)
  const [showExportDialog, setShowExportDialog] = useState(false)
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false)
  const [showEditLabelDialog, setShowEditLabelDialog] = useState(false)
  const [showEADocs, setShowEADocs] = useState(false)
  const [showBlockNumbers, setShowBlockNumbers] = useState(true)
  const [showTemplatesDialog, setShowTemplatesDialog] = useState(false)
  const [showValidationPanel, setShowValidationPanel] = useState(false)
  const [activeEvent, setActiveEvent] = useState<EventCategory>('ontick')
  const [strategies, setStrategies] = useKV<Strategy[]>('strategies', [])
  const [currentStrategyId, setCurrentStrategyId] = useState<string | null>(null)
  const [currentProject, setCurrentProject] = useKV<ProjectConfig | null>('currentProject', null)
  const [showLoadDialog, setShowLoadDialog] = useState(false)
  const [hasSeenRenameTip, setHasSeenRenameTip] = useKV<boolean>('hasSeenRenameTip', false)
  
  const history = useHistory()
  const clipboard = useClipboard()

  useEffect(() => {
    if (!hasSeenRenameTip && nodes.length === 0) {
      const timer = setTimeout(() => {
        toast.info('💡 Tip: Double-click or press F2 to rename any node!', {
          duration: 5000
        })
        setHasSeenRenameTip(true)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [hasSeenRenameTip, setHasSeenRenameTip, nodes.length])

  useEffect(() => {
    if (pendingLoadStrategyId) {
      onLoadStrategy(pendingLoadStrategyId)
      if (onStrategyLoaded) {
        onStrategyLoaded()
      }
    }
  }, [pendingLoadStrategyId])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement
      const isInputField = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA'

      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault()
        onSaveStrategy()
      }
      
      if ((event.ctrlKey || event.metaKey) && event.key === 'z' && !event.shiftKey) {
        event.preventDefault()
        handleUndo()
      }
      
      if ((event.ctrlKey || event.metaKey) && (event.key === 'y' || (event.key === 'z' && event.shiftKey))) {
        event.preventDefault()
        handleRedo()
      }
      
      if ((event.ctrlKey || event.metaKey) && event.key === 'c' && !isInputField) {
        event.preventDefault()
        handleCopy()
      }
      
      if ((event.ctrlKey || event.metaKey) && event.key === 'x' && !isInputField) {
        event.preventDefault()
        handleCut()
      }
      
      if ((event.ctrlKey || event.metaKey) && event.key === 'v' && !isInputField) {
        event.preventDefault()
        handlePaste()
      }
      
      if ((event.ctrlKey || event.metaKey) && event.key === 'd' && !isInputField) {
        event.preventDefault()
        handleDuplicate()
      }
      
      if (event.key === 'F2' && !isInputField && selectedNode) {
        event.preventDefault()
        setShowEditLabelDialog(true)
      }
      
      if ((event.key === 'Delete' || event.key === 'Backspace') && !isInputField) {
        event.preventDefault()
        onDeleteSelected()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [nodes, edges, clipboard, selectedNode])

  const handleUndo = useCallback(() => {
    const state = history.undo()
    if (state) {
      setNodes(state.nodes)
      setEdges(state.edges)
      toast.success('Undone')
    }
  }, [history, setNodes, setEdges])

  const handleRedo = useCallback(() => {
    const state = history.redo()
    if (state) {
      setNodes(state.nodes)
      setEdges(state.edges)
      toast.success('Redone')
    }
  }, [history, setNodes, setEdges])

  const handleCopy = useCallback(() => {
    clipboard.copy(nodes, edges)
    const selectedCount = nodes.filter(n => n.selected).length
    if (selectedCount > 0) {
      toast.success(`Copied ${selectedCount} block(s)`)
    }
  }, [clipboard, nodes, edges])

  const handleCut = useCallback(() => {
    const selectedNodes = nodes.filter(n => n.selected)
    if (selectedNodes.length === 0) return

    clipboard.cut(nodes, edges)
    history.addHistory(nodes, edges, 'Cut blocks')
    
    onDeleteSelected()
    toast.success(`Cut ${selectedNodes.length} block(s)`)
  }, [clipboard, nodes, edges, history])

  const handlePaste = useCallback(() => {
    const result = clipboard.paste()
    if (!result) {
      toast.error('Nothing to paste')
      return
    }

    history.addHistory(nodes, edges, 'Paste blocks')
    
    setNodes((nds) => [...nds.map(n => ({ ...n, selected: false })), ...result.nodes.map(n => ({ ...n, selected: true }))])
    setEdges((eds) => [...eds, ...result.edges])
    
    toast.success(`Pasted ${result.nodes.length} block(s)`)
  }, [clipboard, nodes, edges, history, setNodes, setEdges])

  const handleDuplicate = useCallback(() => {
    const selectedNodes = nodes.filter(n => n.selected)
    if (selectedNodes.length === 0) {
      toast.error('No blocks selected')
      return
    }

    const selectedNodeIds = new Set(selectedNodes.map(n => n.id))
    const relevantEdges = edges.filter(
      e => selectedNodeIds.has(e.source) && selectedNodeIds.has(e.target)
    )

    const idMap = new Map<string, string>()
    const newNodes: Node[] = selectedNodes.map(node => {
      const newId = `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      idMap.set(node.id, newId)

      return {
        ...node,
        id: newId,
        position: {
          x: node.position.x + 50,
          y: node.position.y + 50
        },
        selected: true
      }
    })

    const newEdges: Edge[] = relevantEdges.map(edge => ({
      ...edge,
      id: `edge-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      source: idMap.get(edge.source) || edge.source,
      target: idMap.get(edge.target) || edge.target
    }))

    history.addHistory(nodes, edges, 'Duplicate blocks')
    
    setNodes((nds) => [...nds.map(n => ({ ...n, selected: false })), ...newNodes])
    setEdges((eds) => [...eds, ...newEdges])
    
    toast.success(`Duplicated ${newNodes.length} block(s)`)
  }, [nodes, edges, history, setNodes, setEdges])

  const onConnect = useCallback(
    (connection: Connection) => {
      if (!connection.source || !connection.target) return

      const sourceNode = nodes.find(n => n.id === connection.source)
      const targetNode = nodes.find(n => n.id === connection.target)

      if (!sourceNode || !targetNode) {
        toast.error('Invalid connection: Node not found')
        return
      }

      const validation = ConnectionValidator.validateConnection(
        sourceNode,
        targetNode,
        connection.sourceHandle,
        connection.targetHandle
      )

      if (!validation.valid) {
        toast.error(`Connection blocked: ${validation.reason}`)
        return
      }

      const categoryColors = getCategoryColors(sourceNode.type as any)
      
      const newEdge: Edge = {
        ...connection,
        id: `edge-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: 'default',
        animated: false,
        style: {
          stroke: categoryColors.accentColor,
          strokeWidth: 2.5
        }
      }

      history.addHistory(nodes, edges, 'Connect blocks')
      setEdges((eds) => [...eds, newEdge])
      toast.success('Blocks connected')
    },
    [setEdges, nodes, edges, history]
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

      history.addHistory(nodes, edges, `Add ${nodeDefinition.label}`)
      setNodes((nds) => nds.concat(newNode))
      setNodeIdCounter((id) => id + 1)
    },
    [screenToFlowPosition, nodeIdCounter, setNodes, nodes, edges, history]
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

      history.addHistory(nodes, edges, `Add ${nodeDefinition.label}`)
      setNodes((nds) => nds.concat(newNode))
      setNodeIdCounter((id) => id + 1)
    },
    [nodeIdCounter, setNodes, nodes, edges, history]
  )
  
  const onDragStart = useCallback((event: React.DragEvent, nodeDefinition: NodeDefinition) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify(nodeDefinition))
    event.dataTransfer.effectAllowed = 'move'
  }, [])

  const onDeleteSelected = useCallback(() => {
    const selectedNodes = nodes.filter(n => n.selected)
    if (selectedNodes.length > 0) {
      history.addHistory(nodes, edges, `Delete ${selectedNodes.length} block(s)`)
    }
    setNodes((nds) => nds.filter(node => !node.selected))
    setEdges((eds) => eds.filter(edge => !edge.selected))
  }, [setNodes, setEdges, nodes, edges, history])

  const onFitView = useCallback(() => {
    fitView({ padding: 0.2, duration: 400 })
  }, [fitView])

  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    setSelectedNode(node)
    setShowProperties(true)
  }, [])

  const onNodeDoubleClick = useCallback((_event: React.MouseEvent, node: Node) => {
    setSelectedNode(node)
    setShowProperties(true)
    toast.info('Double-click to open properties')
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
      nodes: nodes.map(n => ({
        id: n.id,
        type: n.type || 'default',
        position: n.position,
        data: {
          label: (n.data as any).label || n.type || 'Node',
          parameters: (n.data as any).parameters,
          ...n.data
        }
      })),
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

  const onAIStrategyGenerated = useCallback((newNodes: Node[], newEdges: Edge[]) => {
    history.markCheckpoint(nodes, edges, 'Before AI generation')
    setNodes(newNodes)
    setEdges(newEdges)
    setNodeIdCounter(newNodes.length + 1)
    history.addHistory(newNodes, newEdges, 'AI-generated strategy')
    toast.success('AI-generated strategy loaded! You can now modify it manually.')
  }, [setNodes, setEdges, nodes, edges, history])

  const getCurrentStrategy = useCallback((): Strategy => {
    const existingStrategy = strategies?.find(s => s.id === currentStrategyId)
    
    return {
      id: currentStrategyId || `strategy-${Date.now()}`,
      name: existingStrategy?.name || 'Untitled Strategy',
      description: '',
      version: '1.0.0',
      createdAt: existingStrategy?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      nodes: nodes.map(n => ({
        id: n.id,
        type: n.type || 'default',
        position: n.position,
        data: {
          label: (n.data as any).label || n.type || 'Node',
          parameters: (n.data as any).parameters,
          ...n.data
        }
      })),
      edges: edges
    }
  }, [nodes, edges, currentStrategyId, strategies])

  const getValidationResult = useCallback(() => {
    return ConnectionValidator.validateStrategyFlow(nodes, edges)
  }, [nodes, edges])

  const onValidateStrategy = useCallback(() => {
    setShowValidationPanel(true)
  }, [])

  const onExport = useCallback(() => {
    if (nodes.length === 0) {
      toast.error('No nodes to export. Build a strategy first!')
      return
    }
    
    const validation = validateMultipleBranches(nodes, edges)
    if (validation.warnings.length > 0) {
      validation.warnings.forEach(w => toast.warning(w))
    }
    if (validation.info.length > 0) {
      validation.info.forEach(i => toast.info(i))
    }
    
    setShowExportDialog(true)
  }, [nodes, edges])

  const toggleBlockNumbers = useCallback(() => {
    setShowBlockNumbers(prev => !prev)
  }, [])

  const onNewProject = useCallback((config: ProjectConfig) => {
    if (nodes.length > 0) {
      const confirmed = window.confirm('Creating a new project will clear the current canvas. Continue?')
      if (!confirmed) return
    }
    
    setCurrentProject(config)
    setNodes([])
    setEdges([])
    setNodeIdCounter(1)
    setCurrentStrategyId(null)
    history.clearHistory()
    toast.success(`New ${config.type} project created for ${config.language.toUpperCase()}`)
  }, [nodes, setNodes, setEdges, history, setCurrentProject])

  const onEditBlockLabel = useCallback((label: string | number) => {
    if (!selectedNode) return
    
    history.addHistory(nodes, edges, 'Edit block label')
    setNodes((nds) =>
      nds.map((node) =>
        node.id === selectedNode.id
          ? {
              ...node,
              data: {
                ...node.data,
                customLabel: label
              }
            }
          : node
      )
    )
    toast.success(`Block label updated to "${label}"`)
  }, [selectedNode, nodes, edges, history, setNodes])

  const onToggleNodeEnabled = useCallback(() => {
    if (!selectedNode) return
    
    const isDisabled = selectedNode.data.disabled || false
    history.addHistory(nodes, edges, isDisabled ? 'Enable block' : 'Disable block')
    
    setNodes((nds) =>
      nds.map((node) =>
        node.id === selectedNode.id
          ? {
              ...node,
              data: {
                ...node.data,
                disabled: !isDisabled
              }
            }
          : node
      )
    )
    toast.success(`Block ${isDisabled ? 'enabled' : 'disabled'}`)
  }, [selectedNode, nodes, edges, history, setNodes])

  const onLoadStrategy = useCallback((strategyId: string) => {
    const strategy = strategies?.find(s => s.id === strategyId)
    if (!strategy) {
      toast.error('Strategy not found')
      return
    }

    if (nodes.length > 0) {
      const confirmed = window.confirm('Loading a strategy will replace the current canvas. Continue?')
      if (!confirmed) return
    }

    history.markCheckpoint(nodes, edges, 'Before load')
    
    const loadedNodes = strategy.nodes.map(n => ({
      id: n.id,
      type: n.type,
      position: n.position,
      data: n.data
    }))
    
    const loadedEdges = strategy.edges || []
    
    setNodes(loadedNodes)
    setEdges(loadedEdges)
    setCurrentStrategyId(strategy.id)
    
    const maxNodeId = loadedNodes.reduce((max, node) => {
      const match = node.id.match(/node-(\d+)/)
      return match ? Math.max(max, parseInt(match[1])) : max
    }, 0)
    setNodeIdCounter(maxNodeId + 1)
    
    history.addHistory(loadedNodes, loadedEdges, 'Load strategy')
    setShowLoadDialog(false)
    toast.success(`Strategy "${strategy.name}" loaded successfully`)
  }, [strategies, nodes, edges, history, setNodes, setEdges])

  const onLoadTemplate = useCallback((template: StrategyTemplate) => {
    if (nodes.length > 0) {
      const confirmed = window.confirm('Loading a template will replace the current canvas. Continue?')
      if (!confirmed) return
    }

    history.markCheckpoint(nodes, edges, 'Before template load')
    
    const loadedNodes = template.strategy.nodes.map(n => ({
      id: n.id,
      type: n.type,
      position: n.position,
      data: n.data
    }))
    
    const loadedEdges = template.strategy.edges || []
    
    setNodes(loadedNodes)
    setEdges(loadedEdges)
    setCurrentStrategyId(null)
    
    const maxNodeId = loadedNodes.reduce((max, node) => {
      const match = node.id.match(/node-(\d+)/)
      return match ? Math.max(max, parseInt(match[1])) : max
    }, 0)
    setNodeIdCounter(maxNodeId + 1)
    
    history.addHistory(loadedNodes, loadedEdges, 'Load template')
    toast.success(`Template "${template.name}" loaded successfully`)
  }, [nodes, edges, history, setNodes, setEdges])

  const onDetachNode = useCallback(() => {
    if (!selectedNode) return
    
    history.addHistory(nodes, edges, 'Detach block')
    setEdges((eds) => eds.filter(
      (edge) => edge.source !== selectedNode.id && edge.target !== selectedNode.id
    ))
    toast.success('Block detached from all connections')
  }, [selectedNode, edges, history, setEdges])

  const executionMap = useMemo(() => {
    return calculateBlockNumbers(nodes, edges)
  }, [nodes, edges])

  const nodesWithBlockNumbers = useMemo(() => {
    return nodes.map(node => {
      const execInfo = executionMap.get(node.id)
      const displayLabel = node.data.customLabel !== undefined 
        ? node.data.customLabel 
        : (showBlockNumbers ? execInfo?.blockNumber : undefined)
      
      return {
        ...node,
        data: {
          ...node.data,
          blockNumber: displayLabel,
          executionOrder: execInfo?.executionOrder
        }
      }
    })
  }, [nodes, showBlockNumbers, executionMap])

  const styledEdges = useMemo(() => {
    return edges.map(edge => {
      const sourceNode = nodes.find(n => n.id === edge.source)
      if (!sourceNode) return edge

      const categoryColors = getCategoryColors(sourceNode.type as any)
      
      return {
        ...edge,
        style: {
          ...edge.style,
          stroke: edge.style?.stroke || categoryColors.accentColor,
          strokeWidth: edge.selected ? 3 : 2.5
        },
        animated: edge.selected
      }
    })
  }, [edges, nodes])

  return (
    <div className="w-full h-full flex flex-col">
      <EventTabs activeEvent={activeEvent} onEventChange={setActiveEvent} />
      
      <div className="flex-1 flex overflow-hidden">
        <CompactNodePalette activeEvent={activeEvent} onDragStart={onDragStart} />
        
        <ContextMenuWrapper
          nodes={nodes}
          edges={edges}
          selectedNode={selectedNode}
          onCopy={handleCopy}
          onCut={handleCut}
          onPaste={handlePaste}
          onDelete={onDeleteSelected}
          onDuplicate={handleDuplicate}
          onEditTitle={() => setShowEditLabelDialog(true)}
          onResize={() => toast.info('Resize feature coming soon')}
          onToggleLock={() => toast.info('Lock feature coming soon')}
          onToggleVisibility={() => toast.info('Visibility feature coming soon')}
          onToggleEnabled={onToggleNodeEnabled}
          onShowInfo={() => {
            if (selectedNode) {
              const execInfo = executionMap.get(selectedNode.id)
              toast.info(`Block #${execInfo?.blockNumber || '?'} - Execution Order: ${execInfo?.executionOrder || '?'}`)
            }
          }}
          onCreateGroup={() => toast.info('Create group feature coming soon')}
          onBreakConnection={onDetachNode}
        >
          <div ref={reactFlowWrapper} className="flex-1 relative">
            <ReactFlow
              nodes={nodesWithBlockNumbers}
              edges={styledEdges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onDrop={onDrop}
              onDragOver={onDragOver}
              onNodeClick={onNodeClick}
              onNodeDoubleClick={onNodeDoubleClick}
              onPaneClick={onPaneClick}
              nodeTypes={nodeTypes}
              fitView
              className="bg-background"
            >
              <Background 
                variant={BackgroundVariant.Dots}
                gap={20}
                size={1}
                color="oklch(0.35 0.015 260)"
              />
              
              <Controls 
                className="bg-card border border-border"
                showInteractive={false}
              />
              
              <MiniMap 
                className="bg-card border border-border"
                nodeColor={() => 'oklch(0.55 0.18 50)'}
                maskColor="oklch(0.25 0.01 260 / 0.85)"
              />
              
              <Panel position="top-left" className="flex gap-2">
                <EACreationGuide />
                <Dialog open={showEADocs} onOpenChange={setShowEADocs}>
                  <DialogTrigger asChild>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="gap-2"
                      title="Expert Advisor Documentation"
                    >
                      <Question size={16} />
                      EA Guide
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-6xl h-[80vh]">
                    <DialogHeader>
                      <DialogTitle>Expert Advisor Documentation</DialogTitle>
                      <DialogDescription>
                        Complete guide to understanding and creating Expert Advisors
                      </DialogDescription>
                    </DialogHeader>
                    <EADocumentation />
                  </DialogContent>
                </Dialog>
              <Button 
                size="sm" 
                variant="outline"
                className="gap-2"
                onClick={() => setShowNewProjectDialog(true)}
              >
                <FilePlus size={16} />
                New
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                className="gap-2"
                onClick={() => setShowTemplatesDialog(true)}
              >
                <BookOpen size={16} />
                Templates
              </Button>
              <Button 
                size="sm" 
                variant="default"
                className="gap-2 bg-gradient-to-r from-accent to-primary hover:opacity-90"
                onClick={() => setShowAIBuilder(true)}
              >
                <Sparkle size={16} weight="fill" />
                AI Builder
              </Button>
              <Button size="sm" className="gap-2" onClick={() => setShowLoadDialog(true)}>
                <FolderOpen size={16} />
                Open
              </Button>
              <Button size="sm" variant="outline" className="gap-2" onClick={onSaveStrategy}>
                <FloppyDisk size={16} />
                Save
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="gap-2"
                onClick={onValidateStrategy}
                title="Validate Strategy"
              >
                <CheckCircle size={16} />
                Validate
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="gap-2"
                onClick={onExport}
              >
                <Export size={16} />
                Export MQL
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
                onClick={handleUndo}
                disabled={!history.canUndo}
                title="Undo (Ctrl+Z)"
              >
                <ArrowUUpLeft size={16} />
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="gap-2"
                onClick={handleRedo}
                disabled={!history.canRedo}
                title="Redo (Ctrl+Y)"
              >
                <ArrowUUpRight size={16} />
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="gap-2"
                onClick={toggleBlockNumbers}
                title="Toggle Block Numbers"
              >
                <ListNumbers size={16} />
                {showBlockNumbers && (
                  <Badge variant="secondary" className="ml-1 h-4 px-1 text-xs">ON</Badge>
                )}
              </Button>
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
        </ContextMenuWrapper>

        {showProperties && (
          <PropertiesPanel 
            selectedNode={selectedNode} 
            onClose={() => setShowProperties(false)} 
          />
        )}
      </div>

      <AIStrategyBuilder
        open={showAIBuilder}
        onOpenChange={setShowAIBuilder}
        onStrategyGenerated={onAIStrategyGenerated}
      />

      <ExportDialog
        open={showExportDialog}
        onOpenChange={setShowExportDialog}
        strategy={getCurrentStrategy()}
        projectConfig={currentProject}
      />

      <NewProjectDialog
        open={showNewProjectDialog}
        onOpenChange={setShowNewProjectDialog}
        onCreateProject={onNewProject}
      />

      <LoadStrategyDialog
        open={showLoadDialog}
        onOpenChange={setShowLoadDialog}
        strategies={strategies || []}
        onLoadStrategy={onLoadStrategy}
      />

      <EditBlockLabelDialog
        open={showEditLabelDialog}
        onOpenChange={setShowEditLabelDialog}
        currentLabel={selectedNode?.data.customLabel || selectedNode?.data.blockNumber}
        onSave={onEditBlockLabel}
      />

      <TemplatesDialog
        open={showTemplatesDialog}
        onOpenChange={setShowTemplatesDialog}
        onLoadTemplate={onLoadTemplate}
      />

      <ValidationPanel
        open={showValidationPanel}
        onOpenChange={setShowValidationPanel}
        validation={getValidationResult()}
      />
    </div>
  )
}

