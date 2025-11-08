import { StrategyNode } from '@/types/strategy'
import { OHLCV } from '@/types/market-data'

export type NodeExecutionState = 
  | 'idle'
  | 'calculating'
  | 'success'
  | 'failed'
  | 'triggered'
  | 'inactive'

export interface NodeExecutionResult {
  nodeId: string
  state: NodeExecutionState
  value: any
  timestamp: number
  error?: string
  metadata?: {
    calculationTime?: number
    inputs?: any[]
    outputs?: any[]
  }
}

export interface ExecutionTrace {
  barIndex: number
  timestamp: number
  nodeResults: Map<string, NodeExecutionResult>
  activeNodes: Set<string>
  dataFlow: Map<string, any>
}

export interface VisualExecutionState {
  currentBar: number
  totalBars: number
  isPlaying: boolean
  playbackSpeed: number
  traces: ExecutionTrace[]
  currentTrace?: ExecutionTrace
}

export class ExecutionVisualizer {
  private traces: ExecutionTrace[] = []
  private currentBarIndex: number = 0
  private nodeStates: Map<string, NodeExecutionResult> = new Map()
  
  constructor() {
    this.reset()
  }

  reset(): void {
    this.traces = []
    this.currentBarIndex = 0
    this.nodeStates.clear()
  }

  startBar(barIndex: number, timestamp: number): void {
    this.currentBarIndex = barIndex
    const trace: ExecutionTrace = {
      barIndex,
      timestamp,
      nodeResults: new Map(),
      activeNodes: new Set(),
      dataFlow: new Map()
    }
    this.traces.push(trace)
  }

  recordNodeExecution(
    nodeId: string,
    state: NodeExecutionState,
    value: any,
    metadata?: NodeExecutionResult['metadata']
  ): void {
    const currentTrace = this.traces[this.traces.length - 1]
    if (!currentTrace) return

    const result: NodeExecutionResult = {
      nodeId,
      state,
      value,
      timestamp: Date.now(),
      metadata
    }

    currentTrace.nodeResults.set(nodeId, result)
    this.nodeStates.set(nodeId, result)

    if (state === 'triggered' || state === 'success') {
      currentTrace.activeNodes.add(nodeId)
    }
  }

  recordDataFlow(fromNodeId: string, toNodeId: string, value: any): void {
    const currentTrace = this.traces[this.traces.length - 1]
    if (!currentTrace) return

    const key = `${fromNodeId}->${toNodeId}`
    currentTrace.dataFlow.set(key, value)
  }

  getNodeState(nodeId: string): NodeExecutionResult | undefined {
    return this.nodeStates.get(nodeId)
  }

  getTraceAtBar(barIndex: number): ExecutionTrace | undefined {
    return this.traces.find(t => t.barIndex === barIndex)
  }

  getCurrentTrace(): ExecutionTrace | undefined {
    return this.traces[this.traces.length - 1]
  }

  getAllTraces(): ExecutionTrace[] {
    return this.traces
  }

  getExecutionPath(nodeId: string): NodeExecutionResult[] {
    return this.traces
      .map(trace => trace.nodeResults.get(nodeId))
      .filter(result => result !== undefined) as NodeExecutionResult[]
  }

  getActiveNodesAtBar(barIndex: number): Set<string> {
    const trace = this.getTraceAtBar(barIndex)
    return trace?.activeNodes ?? new Set()
  }

  getNodeValueHistory(nodeId: string): Array<{ barIndex: number; value: any }> {
    return this.traces
      .map(trace => ({
        barIndex: trace.barIndex,
        value: trace.nodeResults.get(nodeId)?.value
      }))
      .filter(item => item.value !== undefined)
  }

  getStatistics(): {
    totalBars: number
    totalNodeExecutions: number
    avgExecutionsPerBar: number
    nodesWithErrors: Set<string>
    mostActiveNodes: Array<{ nodeId: string; count: number }>
  } {
    const totalBars = this.traces.length
    let totalExecutions = 0
    const nodeExecutionCounts = new Map<string, number>()
    const nodesWithErrors = new Set<string>()

    for (const trace of this.traces) {
      totalExecutions += trace.nodeResults.size
      
      for (const [nodeId, result] of trace.nodeResults) {
        nodeExecutionCounts.set(nodeId, (nodeExecutionCounts.get(nodeId) || 0) + 1)
        
        if (result.state === 'failed') {
          nodesWithErrors.add(nodeId)
        }
      }
    }

    const mostActiveNodes = Array.from(nodeExecutionCounts.entries())
      .map(([nodeId, count]) => ({ nodeId, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    return {
      totalBars,
      totalNodeExecutions: totalExecutions,
      avgExecutionsPerBar: totalBars > 0 ? totalExecutions / totalBars : 0,
      nodesWithErrors,
      mostActiveNodes
    }
  }
}

export class NodeStateManager {
  private visualizer: ExecutionVisualizer
  private stateUpdateCallbacks: Map<string, (state: NodeExecutionResult) => void> = new Map()

  constructor(visualizer: ExecutionVisualizer) {
    this.visualizer = visualizer
  }

  subscribeToNode(nodeId: string, callback: (state: NodeExecutionResult) => void): () => void {
    this.stateUpdateCallbacks.set(nodeId, callback)
    
    return () => {
      this.stateUpdateCallbacks.delete(nodeId)
    }
  }

  updateNodeState(
    nodeId: string,
    state: NodeExecutionState,
    value: any,
    metadata?: NodeExecutionResult['metadata']
  ): void {
    this.visualizer.recordNodeExecution(nodeId, state, value, metadata)
    
    const callback = this.stateUpdateCallbacks.get(nodeId)
    if (callback) {
      const result = this.visualizer.getNodeState(nodeId)
      if (result) {
        callback(result)
      }
    }
  }

  getNodeDisplayValue(nodeId: string, node: StrategyNode): string {
    const state = this.visualizer.getNodeState(nodeId)
    if (!state) return ''

    const { value, state: executionState } = state

    if (executionState === 'failed') {
      return 'ERROR'
    }

    if (executionState === 'calculating') {
      return '...'
    }

    if (node.type === 'indicator') {
      if (typeof value === 'number') {
        return isNaN(value) ? 'N/A' : value.toFixed(5)
      }
      if (typeof value === 'object' && value !== null) {
        return Object.entries(value)
          .map(([key, val]) => `${key}: ${typeof val === 'number' ? val.toFixed(5) : String(val)}`)
          .join(', ')
      }
    }

    if (node.type === 'condition' || node.type === 'logic') {
      if (typeof value === 'boolean') {
        return value ? 'TRUE' : 'FALSE'
      }
    }

    if (node.type === 'action') {
      if (executionState === 'triggered') {
        return 'TRIGGERED'
      }
      return 'WAITING'
    }

    return String(value)
  }

  getNodeColor(nodeId: string): string {
    const state = this.visualizer.getNodeState(nodeId)
    if (!state) return 'transparent'

    switch (state.state) {
      case 'calculating':
        return 'oklch(0.70 0.15 210)'
      case 'success':
        return 'oklch(0.65 0.18 145)'
      case 'failed':
        return 'oklch(0.55 0.20 25)'
      case 'triggered':
        return 'oklch(0.75 0.15 60)'
      case 'inactive':
        return 'oklch(0.30 0.01 250)'
      default:
        return 'transparent'
    }
  }

  shouldAnimateNode(nodeId: string): boolean {
    const state = this.visualizer.getNodeState(nodeId)
    if (!state) return false

    const timeSinceUpdate = Date.now() - state.timestamp
    return timeSinceUpdate < 1000 && (
      state.state === 'calculating' ||
      state.state === 'triggered' ||
      state.state === 'success'
    )
  }
}

export interface PlaybackController {
  play(): void
  pause(): void
  stop(): void
  stepForward(): void
  stepBackward(): void
  seekToBar(barIndex: number): void
  setSpeed(speed: number): void
}

export class ExecutionPlaybackController implements PlaybackController {
  private visualizer: ExecutionVisualizer
  private currentBarIndex: number = 0
  private isPlaying: boolean = false
  private playbackSpeed: number = 1
  private intervalId?: NodeJS.Timeout
  private onUpdate?: (barIndex: number) => void

  constructor(
    visualizer: ExecutionVisualizer,
    onUpdate?: (barIndex: number) => void
  ) {
    this.visualizer = visualizer
    this.onUpdate = onUpdate
  }

  play(): void {
    if (this.isPlaying) return
    
    this.isPlaying = true
    const traces = this.visualizer.getAllTraces()
    
    this.intervalId = setInterval(() => {
      if (this.currentBarIndex >= traces.length) {
        this.stop()
        return
      }

      this.currentBarIndex++
      this.onUpdate?.(this.currentBarIndex)
    }, 1000 / this.playbackSpeed)
  }

  pause(): void {
    this.isPlaying = false
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = undefined
    }
  }

  stop(): void {
    this.pause()
    this.currentBarIndex = 0
    this.onUpdate?.(this.currentBarIndex)
  }

  stepForward(): void {
    const traces = this.visualizer.getAllTraces()
    if (this.currentBarIndex < traces.length - 1) {
      this.currentBarIndex++
      this.onUpdate?.(this.currentBarIndex)
    }
  }

  stepBackward(): void {
    if (this.currentBarIndex > 0) {
      this.currentBarIndex--
      this.onUpdate?.(this.currentBarIndex)
    }
  }

  seekToBar(barIndex: number): void {
    const traces = this.visualizer.getAllTraces()
    if (barIndex >= 0 && barIndex < traces.length) {
      this.currentBarIndex = barIndex
      this.onUpdate?.(this.currentBarIndex)
    }
  }

  setSpeed(speed: number): void {
    this.playbackSpeed = Math.max(0.1, Math.min(10, speed))
    
    if (this.isPlaying) {
      this.pause()
      this.play()
    }
  }

  getCurrentBarIndex(): number {
    return this.currentBarIndex
  }

  isCurrentlyPlaying(): boolean {
    return this.isPlaying
  }

  getPlaybackSpeed(): number {
    return this.playbackSpeed
  }
}
