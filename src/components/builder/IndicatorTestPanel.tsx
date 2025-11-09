import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Check, X, Warning, TestTube, LinkSimple } from '@phosphor-icons/react'
import { Node, Edge } from '@xyflow/react'

interface TestResult {
  name: string
  status: 'pass' | 'fail' | 'warning'
  message: string
  details?: string
}

interface IndicatorTestPanelProps {
  nodes: Node[]
  edges: Edge[]
  onAddTestNodes: () => void
  onClearCanvas: () => void
}

export function IndicatorTestPanel({ nodes, edges, onAddTestNodes, onClearCanvas }: IndicatorTestPanelProps) {
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [isRunning, setIsRunning] = useState(false)

  const runTests = () => {
    setIsRunning(true)
    const results: TestResult[] = []

    results.push(testNodeTypes())
    results.push(testNodeConnections())
    results.push(testIndicatorNodes())
    results.push(testDataFlow())
    results.push(testPortCompatibility())
    results.push(testNodeParameters())

    setTestResults(results)
    setIsRunning(false)
  }

  const testNodeTypes = (): TestResult => {
    const nodeTypes = new Set(nodes.map(n => n.type))
    const expectedTypes = ['indicator', 'condition', 'action', 'logic', 'event']
    const hasMultipleTypes = expectedTypes.filter(type => nodeTypes.has(type)).length > 1

    if (nodes.length === 0) {
      return {
        name: 'Node Types',
        status: 'warning',
        message: 'No nodes on canvas',
        details: 'Add some nodes to test functionality'
      }
    }

    return {
      name: 'Node Types',
      status: hasMultipleTypes ? 'pass' : 'warning',
      message: `Found ${nodeTypes.size} different node types`,
      details: Array.from(nodeTypes).join(', ')
    }
  }

  const testNodeConnections = (): TestResult => {
    if (edges.length === 0) {
      return {
        name: 'Node Connections',
        status: 'warning',
        message: 'No connections between nodes',
        details: 'Connect nodes to test data flow'
      }
    }

    const connectedNodeIds = new Set<string>()
    edges.forEach(edge => {
      connectedNodeIds.add(edge.source)
      connectedNodeIds.add(edge.target)
    })

    const isolatedNodes = nodes.filter(n => !connectedNodeIds.has(n.id))

    return {
      name: 'Node Connections',
      status: isolatedNodes.length === 0 ? 'pass' : 'warning',
      message: `${edges.length} connections, ${isolatedNodes.length} isolated nodes`,
      details: isolatedNodes.length > 0 ? `Isolated: ${isolatedNodes.map(n => n.data.label).join(', ')}` : 'All nodes connected'
    }
  }

  const testIndicatorNodes = (): TestResult => {
    const indicatorNodes = nodes.filter(n => n.type === 'indicator')

    if (indicatorNodes.length === 0) {
      return {
        name: 'Indicator Nodes',
        status: 'warning',
        message: 'No indicator nodes found',
        details: 'Add indicator nodes to test'
      }
    }

    const validIndicators = indicatorNodes.filter(n => {
      const data = n.data as any
      return data.parameters && typeof data.parameters === 'object'
    })

    return {
      name: 'Indicator Nodes',
      status: validIndicators.length === indicatorNodes.length ? 'pass' : 'fail',
      message: `${validIndicators.length}/${indicatorNodes.length} indicators valid`,
      details: indicatorNodes.map(n => (n.data as any).indicatorType || n.data.label).join(', ')
    }
  }

  const testDataFlow = (): TestResult => {
    const eventNodes = nodes.filter(n => n.type === 'event')
    const actionNodes = nodes.filter(n => n.type === 'action')

    if (eventNodes.length === 0 && actionNodes.length === 0) {
      return {
        name: 'Data Flow',
        status: 'warning',
        message: 'No entry or exit points',
        details: 'Add event nodes (entry) and action nodes (exit)'
      }
    }

    const hasCompleteFlow = eventNodes.length > 0 && actionNodes.length > 0

    return {
      name: 'Data Flow',
      status: hasCompleteFlow ? 'pass' : 'warning',
      message: hasCompleteFlow ? 'Complete flow detected' : 'Incomplete flow',
      details: `${eventNodes.length} event nodes, ${actionNodes.length} action nodes`
    }
  }

  const testPortCompatibility = (): TestResult => {
    const incompatibleConnections: string[] = []

    edges.forEach(edge => {
      const sourceNode = nodes.find(n => n.id === edge.source)
      const targetNode = nodes.find(n => n.id === edge.target)

      if (sourceNode && targetNode) {
        const sourceData = sourceNode.data as any
        const targetData = targetNode.data as any

        if (sourceData.outputs && targetData.inputs) {
          const sourceOutput = sourceData.outputs.find((o: any) => o.id === edge.sourceHandle)
          const targetInput = targetData.inputs.find((i: any) => i.id === edge.targetHandle)

          if (sourceOutput && targetInput && sourceOutput.dataType !== targetInput.dataType && targetInput.dataType !== 'any') {
            incompatibleConnections.push(`${sourceNode.data.label} → ${targetNode.data.label}`)
          }
        }
      }
    })

    return {
      name: 'Port Compatibility',
      status: incompatibleConnections.length === 0 ? 'pass' : 'fail',
      message: incompatibleConnections.length === 0 ? 'All connections compatible' : `${incompatibleConnections.length} incompatible connections`,
      details: incompatibleConnections.length > 0 ? incompatibleConnections.join(', ') : 'All port types match'
    }
  }

  const testNodeParameters = (): TestResult => {
    const nodesWithParams = nodes.filter(n => {
      const data = n.data as any
      return data.parameters && Object.keys(data.parameters).length > 0
    })

    return {
      name: 'Node Parameters',
      status: 'pass',
      message: `${nodesWithParams.length}/${nodes.length} nodes have parameters`,
      details: `Configured nodes: ${nodesWithParams.map(n => n.data.label).join(', ')}`
    }
  }

  const getStatusIcon = (status: 'pass' | 'fail' | 'warning') => {
    switch (status) {
      case 'pass':
        return <Check className="text-bullish" weight="bold" />
      case 'fail':
        return <X className="text-bearish" weight="bold" />
      case 'warning':
        return <Warning className="text-accent" weight="bold" />
    }
  }

  const getStatusBadge = (status: 'pass' | 'fail' | 'warning') => {
    const colors = {
      pass: 'bg-bullish/20 text-bullish border-bullish/30',
      fail: 'bg-bearish/20 text-bearish border-bearish/30',
      warning: 'bg-accent/20 text-accent border-accent/30'
    }

    return (
      <Badge variant="outline" className={colors[status]}>
        {status.toUpperCase()}
      </Badge>
    )
  }

  const passCount = testResults.filter(r => r.status === 'pass').length
  const failCount = testResults.filter(r => r.status === 'fail').length
  const warningCount = testResults.filter(r => r.status === 'warning').length

  return (
    <Card className="bg-card border-border">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TestTube className="text-primary" size={24} weight="duotone" />
            <h3 className="text-lg font-semibold">Indicator Test Panel</h3>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={runTests}
              disabled={isRunning || nodes.length === 0}
              size="sm"
              className="bg-primary text-primary-foreground"
            >
              <TestTube className="mr-2" />
              Run Tests
            </Button>
            <Button
              onClick={onAddTestNodes}
              variant="outline"
              size="sm"
            >
              Add Test Nodes
            </Button>
            <Button
              onClick={onClearCanvas}
              variant="outline"
              size="sm"
            >
              Clear Canvas
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Nodes:</span>
            <Badge variant="secondary">{nodes.length}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Connections:</span>
            <Badge variant="secondary">{edges.length}</Badge>
          </div>
          {testResults.length > 0 && (
            <>
              <div className="flex items-center gap-2">
                <Check className="text-bullish" size={16} weight="bold" />
                <span className="text-bullish font-mono">{passCount}</span>
              </div>
              <div className="flex items-center gap-2">
                <Warning className="text-accent" size={16} weight="bold" />
                <span className="text-accent font-mono">{warningCount}</span>
              </div>
              <div className="flex items-center gap-2">
                <X className="text-bearish" size={16} weight="bold" />
                <span className="text-bearish font-mono">{failCount}</span>
              </div>
            </>
          )}
        </div>
      </div>

      <Tabs defaultValue="results" className="w-full">
        <TabsList className="w-full justify-start border-b border-border rounded-none bg-transparent p-0 h-auto">
          <TabsTrigger value="results" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
            Test Results
          </TabsTrigger>
          <TabsTrigger value="nodes" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
            Nodes ({nodes.length})
          </TabsTrigger>
          <TabsTrigger value="connections" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
            Connections ({edges.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="results" className="m-0">
          <ScrollArea className="h-[400px]">
            <div className="p-4 space-y-3">
              {testResults.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <TestTube size={48} className="mx-auto mb-2 opacity-50" />
                  <p>Click "Run Tests" to start testing</p>
                </div>
              ) : (
                testResults.map((result, index) => (
                  <div
                    key={index}
                    className="p-3 rounded-lg bg-secondary/50 border border-border space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(result.status)}
                        <span className="font-semibold">{result.name}</span>
                      </div>
                      {getStatusBadge(result.status)}
                    </div>
                    <p className="text-sm text-foreground">{result.message}</p>
                    {result.details && (
                      <p className="text-xs text-muted-foreground font-mono">
                        {result.details}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="nodes" className="m-0">
          <ScrollArea className="h-[400px]">
            <div className="p-4 space-y-2">
              {nodes.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No nodes on canvas</p>
                </div>
              ) : (
                nodes.map((node) => {
                  const data = node.data as any
                  return (
                    <div
                      key={node.id}
                      className="p-3 rounded-lg bg-secondary/50 border border-border"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold">{data.label}</span>
                        <Badge variant="outline">{node.type}</Badge>
                      </div>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <div>ID: {node.id.slice(0, 8)}</div>
                        {data.indicatorType && (
                          <div>Type: {data.indicatorType}</div>
                        )}
                        {data.parameters && Object.keys(data.parameters).length > 0 && (
                          <div>Parameters: {Object.keys(data.parameters).length}</div>
                        )}
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="connections" className="m-0">
          <ScrollArea className="h-[400px]">
            <div className="p-4 space-y-2">
              {edges.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <LinkSimple size={48} className="mx-auto mb-2 opacity-50" />
                  <p>No connections between nodes</p>
                </div>
              ) : (
                edges.map((edge) => {
                  const sourceNode = nodes.find(n => n.id === edge.source)
                  const targetNode = nodes.find(n => n.id === edge.target)

                  return (
                    <div
                      key={edge.id}
                      className="p-3 rounded-lg bg-secondary/50 border border-border"
                    >
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-semibold">
                          {sourceNode?.data.label || 'Unknown'}
                        </span>
                        <LinkSimple className="text-muted-foreground" />
                        <span className="font-semibold">
                          {targetNode?.data.label || 'Unknown'}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {edge.sourceHandle && <span>From: {edge.sourceHandle}</span>}
                        {edge.targetHandle && <span className="ml-2">To: {edge.targetHandle}</span>}
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </Card>
  )
}
