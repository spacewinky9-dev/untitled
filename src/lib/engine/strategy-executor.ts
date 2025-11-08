import { Strategy, StrategyNode, StrategyEdge } from '@/types/strategy'
import { OHLCV } from '@/types/market-data'
import { getIndicator, IndicatorOutput } from '@/lib/indicators'

export interface ExecutionContext {
  bar: OHLCV
  index: number
  balance: number
  openPositions: Trade[]
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

  constructor(private strategy: Strategy) {
    this.nodes = new Map(strategy.nodes.map(n => [n.id, n]))
    this.edges = strategy.edges
    this.indicatorCache = new Map()
    this.nodeValues = new Map()
  }

  async execute(data: OHLCV[], initialBalance: number): Promise<ExecutionResult> {
    this.preCalculateIndicators(data)

    const trades: Trade[] = []
    const signals: Signal[] = []
    let balance = initialBalance
    let openPositions: Trade[] = []

    for (let i = 0; i < data.length; i++) {
      const bar = data[i]
      const context: ExecutionContext = { bar, index: i, balance, openPositions }

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
        const indicatorType = node.data.parameters?.indicatorType
        if (!indicatorType) continue

        const indicator = getIndicator(indicatorType)
        if (indicator) {
          const result = indicator.calculate(data, node.data.parameters || {})
          this.indicatorCache.set(node.id, result)
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

    const inputValues = this.getInputValues(node.id, context)
    if (inputValues.length < 2 && threshold === undefined) return false

    const inputA = inputValues[0] ?? NaN
    const inputB = threshold !== undefined ? threshold : (inputValues[1] ?? NaN)

    if (isNaN(inputA) || isNaN(inputB)) return false

    switch (operator) {
      case 'gt':
        return inputA > inputB
      case 'lt':
        return inputA < inputB
      case 'eq':
        return Math.abs(inputA - inputB) < 0.0001
      case 'gte':
        return inputA >= inputB
      case 'lte':
        return inputA <= inputB
      case 'cross_above':
        if (context.index === 0) return false
        const prevA = this.getInputValueAtIndex(node.id, 0, context.index - 1)
        const prevB = threshold !== undefined ? threshold : this.getInputValueAtIndex(node.id, 1, context.index - 1)
        return prevA <= prevB && inputA > inputB
      case 'cross_below':
        if (context.index === 0) return false
        const prevA2 = this.getInputValueAtIndex(node.id, 0, context.index - 1)
        const prevB2 = threshold !== undefined ? threshold : this.getInputValueAtIndex(node.id, 1, context.index - 1)
        return prevA2 >= prevB2 && inputA < inputB
      default:
        return false
    }
  }

  private evaluateLogicNode(node: StrategyNode, context: ExecutionContext): boolean {
    const operator = node.data.parameters?.operator || 'AND'
    const inputs = this.getConnectedInputNodeIds(node.id)
    const values = inputs.map(id => {
      const val = this.nodeValues.get(id)
      return typeof val === 'boolean' ? val : false
    })

    switch (operator) {
      case 'AND':
        return values.length > 0 && values.every(v => v)
      case 'OR':
        return values.some(v => v)
      case 'NOT':
        return !values[0]
      case 'XOR':
        return values.filter(v => v).length === 1
      default:
        return false
    }
  }

  private evaluateActionNode(node: StrategyNode, context: ExecutionContext): boolean {
    const inputs = this.getConnectedInputNodeIds(node.id)
    const triggered = inputs.some(id => this.nodeValues.get(id) === true)
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
