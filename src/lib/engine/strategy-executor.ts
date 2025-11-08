import { Strategy, StrategyNode, StrategyEdge } from '@/types/strategy'
import { OHLCV } from '@/types/market-data'
import { getIndicator, IndicatorOutput } from '@/lib/indicators'
import { ConditionEvaluator, ConditionContext, PatternMatcher, CandlestickPattern } from './condition-evaluator'
import { ExecutionVisualizer, NodeStateManager } from './execution-visualizer'
import { PatternDetector } from './pattern-detector'
import { MultiTimeframeAnalyzer, Timeframe } from './mtf-analyzer'
import { AdvancedTradeManager } from './advanced-trade-manager'
import { EventSystem } from './event-system'
import { VariableStorage } from './variable-storage'

export interface ExecutionContext {
  bar: OHLCV
  index: number
  balance: number
  openPositions: Trade[]
  allBars: OHLCV[]
  variables: VariableStorage
  currentEvent?: string
}

export interface Trade {
  id: string
  type: 'buy' | 'sell'
  entryTime: number
  entryPrice: number
  exitTime?: number
  exitPrice?: number
  lots: number
  stopLoss?: number
  takeProfit?: number
  profit?: number
  pips?: number
  reason?: string
}

export interface Signal {
  time: number
  type: 'buy' | 'sell' | 'close'
  reason: string
  nodeId: string
}

export interface ExecutionResult {
  trades: Trade[]
  signals: Signal[]
  finalBalance: number
  openPositions: Trade[]
}

export class StrategyExecutor {
  private nodes: Map<string, StrategyNode>
  private edges: StrategyEdge[]
  private indicatorCache: Map<string, any>
  private nodeValues: Map<string, any>
  private visualizer: ExecutionVisualizer
  private stateManager: NodeStateManager
  private enableVisualization: boolean
  private patternDetector: PatternDetector
  private mtfAnalyzer: MultiTimeframeAnalyzer
  private tradeManager: AdvancedTradeManager
  private eventSystem: EventSystem
  private variables: VariableStorage

  constructor(private strategy: Strategy, enableVisualization: boolean = false) {
    this.nodes = new Map(strategy.nodes.map(n => [n.id, n]))
    this.edges = strategy.edges
    this.indicatorCache = new Map()
    this.nodeValues = new Map()
    this.visualizer = new ExecutionVisualizer()
    this.stateManager = new NodeStateManager(this.visualizer)
    this.enableVisualization = enableVisualization
    this.patternDetector = new PatternDetector()
    this.mtfAnalyzer = new MultiTimeframeAnalyzer()
    this.tradeManager = new AdvancedTradeManager()
    this.eventSystem = new EventSystem()
    this.variables = new VariableStorage()
  }

  getVisualizer(): ExecutionVisualizer {
    return this.visualizer
  }

  getStateManager(): NodeStateManager {
    return this.stateManager
  }

  async execute(data: OHLCV[], initialBalance: number): Promise<ExecutionResult> {
    if (this.enableVisualization) {
      this.visualizer.reset()
    }

    this.preCalculateIndicators(data)

    const trades: Trade[] = []
    const signals: Signal[] = []
    let balance = initialBalance
    let openPositions: Trade[] = []

    for (let i = 0; i < data.length; i++) {
      const bar = data[i]
      const context: ExecutionContext = { 
        bar, 
        index: i, 
        balance, 
        openPositions, 
        allBars: data,
        variables: this.variables
      }

      if (this.enableVisualization) {
        this.visualizer.startBar(i, bar.time)
      }

      this.evaluateNodes(context)

      const entrySignals = this.findEntrySignals()
      for (const signal of entrySignals) {
        if (signal.type === 'buy' || signal.type === 'sell') {
          const trade = this.openPosition(signal, bar, balance)
          openPositions.push(trade)
          signals.push({ time: bar.time, type: signal.type, reason: signal.reason, nodeId: signal.nodeId })
        }
      }

      const closedPositions: Trade[] = []
      openPositions = openPositions.filter(position => {
        const exitResult = this.checkExitConditions(position, bar, context)
        if (exitResult.shouldExit) {
          position.exitTime = bar.time
          position.exitPrice = bar.close
          position.profit = this.calculateProfit(position, bar.close)
          position.pips = this.calculatePips(position, bar.close)
          position.reason = exitResult.reason
          balance += position.profit
          trades.push(position)
          signals.push({ time: bar.time, type: 'close', reason: exitResult.reason || 'Exit', nodeId: exitResult.nodeId || '' })
          closedPositions.push(position)
          return false
        }
        return true
      })
    }

    return {
      trades,
      signals,
      finalBalance: balance,
      openPositions
    }
  }

  private preCalculateIndicators(data: OHLCV[]): void {
    for (const node of this.nodes.values()) {
      if (node.type === 'indicator') {
        const startTime = Date.now()
        
        if (this.enableVisualization) {
          this.stateManager.updateNodeState(node.id, 'calculating', null)
        }

        const indicatorType = node.data.parameters?.indicatorType || node.data.label?.toLowerCase()
        if (!indicatorType) continue

        const indicator = getIndicator(indicatorType)
        if (indicator) {
          try {
            const result = indicator.calculate(data, node.data.parameters || {})
            this.indicatorCache.set(node.id, result)
            
            if (this.enableVisualization) {
              const calculationTime = Date.now() - startTime
              this.stateManager.updateNodeState(node.id, 'success', result, { calculationTime })
            }
          } catch (error) {
            if (this.enableVisualization) {
              this.stateManager.updateNodeState(node.id, 'failed', null, { 
                calculationTime: Date.now() - startTime 
              })
            }
          }
        }
      }
    }
  }

  private evaluateNodes(context: ExecutionContext): void {
    this.nodeValues.clear()

    const sorted = this.topologicalSort()

    for (const nodeId of sorted) {
      const node = this.nodes.get(nodeId)
      if (!node) continue

      const value = this.evaluateNode(node, context)
      this.nodeValues.set(nodeId, value)
    }
  }

  private evaluateNode(node: StrategyNode, context: ExecutionContext): any {
    switch (node.type) {
      case 'indicator':
        return this.evaluateIndicatorNode(node, context)
      case 'condition':
        return this.evaluateConditionNode(node, context)
      case 'logic':
        return this.evaluateLogicNode(node, context)
      case 'action':
        return this.evaluateActionNode(node, context)
      default:
        return null
    }
  }

  private evaluateIndicatorNode(node: StrategyNode, context: ExecutionContext): number {
    const cached = this.indicatorCache.get(node.id)
    if (!cached) return NaN

    const { index } = context
    const output = node.data.parameters?.output || 'value'

    if (Array.isArray(cached)) {
      return cached[index] || NaN
    } else if (typeof cached === 'object') {
      return cached[output]?.[index] || NaN
    }

    return NaN
  }

  private evaluateConditionNode(node: StrategyNode, context: ExecutionContext): boolean {
    const operator = node.data.parameters?.operator || 'gt'
    const threshold = node.data.parameters?.threshold
    const thresholdHigh = node.data.parameters?.thresholdHigh
    const thresholdLow = node.data.parameters?.thresholdLow
    const pattern = node.data.parameters?.pattern as CandlestickPattern | undefined

    if (pattern) {
      const result = PatternMatcher.matchPattern(pattern, context.allBars, context.index)
      
      if (this.enableVisualization) {
        this.stateManager.updateNodeState(node.id, result ? 'triggered' : 'inactive', result)
      }
      
      return result
    }

    const inputValues = this.getInputValues(node.id, context)
    if (inputValues.length < 2 && threshold === undefined) {
      if (this.enableVisualization) {
        this.stateManager.updateNodeState(node.id, 'failed', false)
      }
      return false
    }

    const currentValue = inputValues[0] ?? NaN
    const comparisonValue = threshold !== undefined ? threshold : (inputValues[1] ?? NaN)

    if (isNaN(currentValue) || (threshold === undefined && isNaN(comparisonValue))) {
      if (this.enableVisualization) {
        this.stateManager.updateNodeState(node.id, 'inactive', false)
      }
      return false
    }

    let previousValue: number | undefined
    let previousComparisonValue: number | undefined
    
    if (context.index > 0 && (operator === 'cross_above' || operator === 'cross_below' || operator === 'cross')) {
      previousValue = this.getInputValueAtIndex(node.id, 0, context.index - 1)
      previousComparisonValue = threshold !== undefined ? threshold : this.getInputValueAtIndex(node.id, 1, context.index - 1)
    }

    const conditionContext: ConditionContext = {
      currentValue,
      comparisonValue,
      previousValue,
      previousComparisonValue,
      bar: context.bar,
      previousBar: context.index > 0 ? context.allBars[context.index - 1] : undefined,
      index: context.index
    }

    const result = ConditionEvaluator.evaluate(
      { operator, threshold, thresholdHigh, thresholdLow },
      conditionContext
    )

    if (this.enableVisualization) {
      this.stateManager.updateNodeState(
        node.id,
        result ? 'triggered' : 'inactive',
        result,
        { inputs: [currentValue, comparisonValue] }
      )
    }

    return result
  }

  private evaluateLogicNode(node: StrategyNode, context: ExecutionContext): boolean {
    const operator = node.data.parameters?.operator || 'AND'
    const inputs = this.getConnectedInputNodeIds(node.id)
    const values = inputs.map(id => {
      const val = this.nodeValues.get(id)
      return typeof val === 'boolean' ? val : false
    })

    let result: boolean
    switch (operator) {
      case 'AND':
        result = values.length > 0 && values.every(v => v)
        break
      case 'OR':
        result = values.some(v => v)
        break
      case 'NOT':
        result = !values[0]
        break
      case 'XOR':
        result = values.filter(v => v).length === 1
        break
      default:
        result = false
    }

    if (this.enableVisualization) {
      this.stateManager.updateNodeState(
        node.id,
        result ? 'triggered' : 'inactive',
        result,
        { inputs: values }
      )
    }

    return result
  }

  private evaluateActionNode(node: StrategyNode, context: ExecutionContext): boolean {
    const inputs = this.getConnectedInputNodeIds(node.id)
    const triggered = inputs.some(id => this.nodeValues.get(id) === true)
    
    if (this.enableVisualization) {
      this.stateManager.updateNodeState(
        node.id,
        triggered ? 'triggered' : 'inactive',
        triggered
      )
    }
    
    return triggered
  }

  private findEntrySignals(): Signal[] {
    const signals: Signal[] = []

    for (const node of this.nodes.values()) {
      if (node.type === 'action') {
        const action = node.data.parameters?.action
        const triggered = this.nodeValues.get(node.id)

        if (triggered && (action === 'buy' || action === 'sell')) {
          signals.push({
            time: 0,
            type: action,
            reason: node.data.label || action,
            nodeId: node.id
          })
        }
      }
    }

    return signals
  }

  private openPosition(signal: Signal, bar: OHLCV, balance: number): Trade {
    const actionNode = this.nodes.get(signal.nodeId)
    const lots = actionNode?.data.parameters?.lots || 0.1
    const stopLoss = actionNode?.data.parameters?.stopLoss
    const takeProfit = actionNode?.data.parameters?.takeProfit

    return {
      id: `${Date.now()}-${Math.random()}`,
      type: signal.type as 'buy' | 'sell',
      entryTime: bar.time,
      entryPrice: bar.close,
      lots,
      stopLoss,
      takeProfit
    }
  }

  private checkExitConditions(position: Trade, bar: OHLCV, context: ExecutionContext): { shouldExit: boolean; reason?: string; nodeId?: string } {
    if (position.stopLoss) {
      if (position.type === 'buy' && bar.low <= position.stopLoss) {
        return { shouldExit: true, reason: 'Stop Loss' }
      }
      if (position.type === 'sell' && bar.high >= position.stopLoss) {
        return { shouldExit: true, reason: 'Stop Loss' }
      }
    }

    if (position.takeProfit) {
      if (position.type === 'buy' && bar.high >= position.takeProfit) {
        return { shouldExit: true, reason: 'Take Profit' }
      }
      if (position.type === 'sell' && bar.low <= position.takeProfit) {
        return { shouldExit: true, reason: 'Take Profit' }
      }
    }

    for (const node of this.nodes.values()) {
      if (node.type === 'action' && node.data.parameters?.action === 'close') {
        const triggered = this.nodeValues.get(node.id)
        if (triggered) {
          return { shouldExit: true, reason: 'Exit Signal', nodeId: node.id }
        }
      }
    }

    return { shouldExit: false }
  }

  private calculateProfit(position: Trade, exitPrice: number): number {
    const priceDiff = position.type === 'buy'
      ? exitPrice - position.entryPrice
      : position.entryPrice - exitPrice

    const pipValue = 10
    const pips = priceDiff * 10000
    return pips * position.lots * pipValue
  }

  private calculatePips(position: Trade, exitPrice: number): number {
    const priceDiff = position.type === 'buy'
      ? exitPrice - position.entryPrice
      : position.entryPrice - exitPrice

    return priceDiff * 10000
  }

  private getInputValues(nodeId: string, context: ExecutionContext): number[] {
    const connectedIds = this.getConnectedInputNodeIds(nodeId)
    return connectedIds.map(id => {
      const node = this.nodes.get(id)
      if (!node) return NaN

      if (node.type === 'indicator') {
        return this.evaluateIndicatorNode(node, context)
      }

      return this.nodeValues.get(id) ?? NaN
    })
  }

  private getInputValueAtIndex(nodeId: string, inputIndex: number, barIndex: number): number {
    const connectedIds = this.getConnectedInputNodeIds(nodeId)
    if (inputIndex >= connectedIds.length) return NaN

    const sourceNodeId = connectedIds[inputIndex]
    const node = this.nodes.get(sourceNodeId)
    if (!node || node.type !== 'indicator') return NaN

    const cached = this.indicatorCache.get(sourceNodeId)
    if (!cached) return NaN

    if (Array.isArray(cached)) {
      return cached[barIndex] || NaN
    } else if (typeof cached === 'object') {
      const output = node.data.parameters?.output || 'value'
      return cached[output]?.[barIndex] || NaN
    }

    return NaN
  }

  private getConnectedInputNodeIds(nodeId: string): string[] {
    return this.edges
      .filter(e => e.target === nodeId)
      .map(e => e.source)
  }

  private topologicalSort(): string[] {
    const visited = new Set<string>()
    const sorted: string[] = []

    const visit = (nodeId: string) => {
      if (visited.has(nodeId)) return
      visited.add(nodeId)

      const dependencies = this.edges
        .filter(e => e.target === nodeId)
        .map(e => e.source)

      for (const depId of dependencies) {
        visit(depId)
      }

      sorted.push(nodeId)
    }

    for (const nodeId of this.nodes.keys()) {
      visit(nodeId)
    }

    return sorted
  }
}
