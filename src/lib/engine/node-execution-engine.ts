import { StrategyNode } from '@/types/strategy'
import { OHLCV } from '@/types/market-data'
import { getIndicator } from '@/lib/indicators'
import { ConditionEvaluator } from './condition-evaluator'
import { PatternDetector } from './pattern-detector'
import { MultiTimeframeAnalyzer } from './mtf-analyzer'
import { AdvancedTradeManager } from './advanced-trade-manager'
import { VariableStorage } from './variable-storage'
import { moneyManagement } from './money-management'
import { pendingOrderManager } from './pending-order-manager'
import { mathEngine } from './math-operations'
import { accountTerminal } from './account-terminal'
import { loopEngine } from './loop-iteration'
import { variableManager } from './variable-manager'

export interface NodeExecutionContext {
  node: StrategyNode
  bar: OHLCV
  index: number
  allBars: OHLCV[]
  balance: number
  openPositions: any[]
  variables: VariableStorage
  nodeValues: Map<string, any>
  indicatorCache: Map<string, any>
  symbol: string
  timeframe: string
  edges?: any[]
}

export class NodeExecutionEngine {
  private conditionEvaluator: ConditionEvaluator
  private patternDetector: PatternDetector
  private mtfAnalyzer: MultiTimeframeAnalyzer
  private tradeManager: AdvancedTradeManager

  constructor() {
    this.conditionEvaluator = new ConditionEvaluator()
    this.patternDetector = new PatternDetector()
    this.mtfAnalyzer = new MultiTimeframeAnalyzer()
    this.tradeManager = new AdvancedTradeManager()
  }

  setEdges(edges: any[]): void {
    this.edges = edges
  }

  private edges: any[] = []

  executeNode(context: NodeExecutionContext): any {
    const { node } = context
    const nodeType = node.data?.type || node.type

    try {
      switch (nodeType) {
        case 'event':
          return this.executeEventNode(context)
        
        case 'indicator':
          return this.executeIndicatorNode(context)
        
        case 'condition':
          return this.executeConditionNode(context)
        
        case 'logic':
          return this.executeLogicNode(context)
        
        case 'pattern':
          return this.executePatternNode(context)
        
        case 'mtf':
          return this.executeMTFNode(context)
        
        case 'variable':
          return this.executeVariableNode(context)
        
        case 'risk':
          return this.executeRiskNode(context)
        
        case 'money_management':
          return this.executeMoneyManagementNode(context)
        
        case 'advanced':
          return this.executeAdvancedNode(context)
        
        case 'action':
          return this.executeActionNode(context)
        
        case 'graphical':
          return this.executeGraphicalNode(context)
        
        case 'messaging':
          return this.executeMessagingNode(context)
        
        case 'file_ops':
          return this.executeFileOpsNode(context)
        
        case 'terminal':
          return this.executeTerminalNode(context)
        
        default:
          console.warn(`Unknown node type: ${nodeType}`)
          return null
      }
    } catch (error) {
      console.error(`Error executing node ${node.id}:`, error)
      throw error
    }
  }

  private executeEventNode(context: NodeExecutionContext): boolean {
    return true
  }

  private executeIndicatorNode(context: NodeExecutionContext): number | { [key: string]: number } {
    const { node, allBars, index } = context
    const params = node.data?.parameters || {}
    const indicatorId = node.data?.indicatorId || node.id.split('_')[0]

    const cacheKey = `${node.id}_${index}`
    if (context.indicatorCache.has(cacheKey)) {
      return context.indicatorCache.get(cacheKey)
    }

    const indicator = getIndicator(indicatorId)
    if (!indicator) {
      throw new Error(`Indicator ${indicatorId} not found`)
    }

    const result = indicator.calculate(allBars, params, index)
    context.indicatorCache.set(cacheKey, result)
    return result
  }

  private executeConditionNode(context: NodeExecutionContext): boolean {
    const { node, nodeValues, bar, index, allBars } = context
    const params = node.data?.parameters || {}
    const operator = params.operator || 'gt'

    const inputNodes = this.getInputNodes(context)
    if (inputNodes.length < 1) {
      return false
    }

    const value1 = nodeValues.get(inputNodes[0])
    if (value1 === undefined || value1 === null) {
      return false
    }

    if (operator === 'cross_above' || operator === 'cross_below' || operator === 'cross') {
      if (inputNodes.length < 2) return false
      const value2 = nodeValues.get(inputNodes[1])
      if (value2 === undefined || value2 === null) return false

      const prevValue1 = this.getPreviousValue(context, inputNodes[0], index - 1)
      const prevValue2 = this.getPreviousValue(context, inputNodes[1], index - 1)

      if (prevValue1 === null || prevValue2 === null) return false

      if (operator === 'cross_above') {
        return prevValue1 <= prevValue2 && value1 > value2
      } else if (operator === 'cross_below') {
        return prevValue1 >= prevValue2 && value1 < value2
      } else {
        return (prevValue1 <= prevValue2 && value1 > value2) || (prevValue1 >= prevValue2 && value1 < value2)
      }
    }

    const threshold = params.threshold !== undefined ? params.threshold : 
                     (inputNodes.length >= 2 ? nodeValues.get(inputNodes[1]) : 0)

    if (threshold === undefined || threshold === null) {
      return false
    }

    return this.conditionEvaluator.evaluate(operator, value1, threshold, {
      bar,
      previousBar: index > 0 ? allBars[index - 1] : bar,
      allBars
    })
  }

  private executeLogicNode(context: NodeExecutionContext): boolean {
    const { node, nodeValues } = context
    const logicType = node.data?.logicType || node.id.split('_')[0]?.toUpperCase()

    const inputNodes = this.getInputNodes(context)
    const inputs = inputNodes.map(nodeId => nodeValues.get(nodeId)).filter(v => v !== undefined)

    if (inputs.length === 0) {
      return false
    }

    switch (logicType) {
      case 'AND':
        return inputs.every(v => Boolean(v))
      case 'OR':
        return inputs.some(v => Boolean(v))
      case 'NOT':
        return !Boolean(inputs[0])
      case 'XOR':
        return inputs.filter(v => Boolean(v)).length === 1
      case 'NAND':
        return !inputs.every(v => Boolean(v))
      case 'NOR':
        return !inputs.some(v => Boolean(v))
      default:
        return false
    }
  }

  private executePatternNode(context: NodeExecutionContext): boolean {
    const { node, bar, index, allBars } = context
    const patternType = node.data?.patternType || node.data?.parameters?.pattern

    if (!patternType || index < 2) {
      return false
    }

    const candles = allBars.slice(Math.max(0, index - 2), index + 1)
    return this.patternDetector.detectPattern(patternType, candles)
  }

  private executeMTFNode(context: NodeExecutionContext): number | null {
    const { node, bar, symbol, allBars, index } = context
    const params = node.data?.parameters || {}
    const targetTimeframe = params.timeframe || 'H1'
    const indicatorType = params.indicator || 'sma'
    const indicatorParams = params.indicatorParams || {}

    return this.mtfAnalyzer.getIndicatorValue(
      allBars,
      indicatorType,
      targetTimeframe,
      indicatorParams,
      index
    )
  }

  private executeVariableNode(context: NodeExecutionContext): any {
    const { node, nodeValues, variables } = context
    const params = node.data?.parameters || {}
    const action = params.action || 'set'
    const variableName = params.name || 'var1'

    switch (action) {
      case 'set':
        const inputNodes = this.getInputNodes(context)
        const value = inputNodes.length > 0 ? nodeValues.get(inputNodes[0]) : params.value
        variables.set(variableName, value)
        variableManager.setVariable(variableName, value)
        return value

      case 'get':
        const storedValue = variables.get(variableName)
        return storedValue !== undefined ? storedValue : variableManager.getVariable(variableName)

      case 'increment':
        const currentValue = variables.get(variableName) || 0
        const newValue = currentValue + (params.step || 1)
        variables.set(variableName, newValue)
        variableManager.setVariable(variableName, newValue)
        return newValue

      case 'reset':
        variables.delete(variableName)
        variableManager.deleteVariable(variableName)
        return params.resetValue || 0

      default:
        return null
    }
  }

  private executeRiskNode(context: NodeExecutionContext): number {
    const { node, balance } = context
    const params = node.data?.parameters || {}
    const riskType = params.type || 'position_size'

    switch (riskType) {
      case 'position_size':
        const riskPercent = params.riskPercent || 1
        const stopLossPips = params.stopLossPips || 50
        const pipValue = params.pipValue || 10
        return (balance * (riskPercent / 100)) / (stopLossPips * pipValue)

      case 'stop_loss':
        return params.pips || params.price || 50

      case 'take_profit':
        const riskReward = params.riskReward || 2
        const slPips = params.stopLossPips || 50
        return slPips * riskReward

      case 'trailing_stop':
        return params.distance || 30

      default:
        return 0.01
    }
  }

  private executeMoneyManagementNode(context: NodeExecutionContext): number {
    const { node, balance, symbol } = context
    const params = node.data?.parameters || {}
    
    const config = {
      method: params.method || 'risk_percent',
      riskPercent: params.riskPercent || 1,
      fixedLot: params.fixedLot || 0.01,
      balancePercent: params.balancePercent || 10,
      martingaleMultiplier: params.martingaleMultiplier || 2,
      antiMartingaleMultiplier: params.antiMartingaleMultiplier || 1.5,
      maxLotSize: params.maxLotSize || 10,
      minLotSize: params.minLotSize || 0.01,
      recoveryFactor: params.recoveryFactor || 2,
      fixedRatioDelta: params.fixedRatioDelta || 5000
    }

    const stopLossPips = params.stopLossPips || 50
    const pipValue = accountTerminal.calculatePipValue(symbol || 'EURUSD', 1.0)
    
    return moneyManagement.calculateLotSize(config, stopLossPips, pipValue, symbol || 'EURUSD')
  }

  private executeAdvancedNode(context: NodeExecutionContext): any {
    const { node, bar, openPositions } = context
    const params = node.data?.parameters || {}
    const actionType = params.type || 'trailing_stop'

    switch (actionType) {
      case 'trailing_stop':
        const distance = params.distance || 30
        return { type: 'trailing_stop', distance }

      case 'break_even':
        const trigger = params.trigger || 20
        return { type: 'break_even', trigger }

      case 'partial_close':
        const percent = params.percent || 50
        return { type: 'partial_close', percent }

      default:
        return null
    }
  }

  private executeActionNode(context: NodeExecutionContext): any {
    const { node, nodeValues } = context
    const actionType = node.data?.actionType || node.id.split('_')[0]

    const inputNodes = this.getInputNodes(context)
    const shouldExecute = inputNodes.length > 0 ? Boolean(nodeValues.get(inputNodes[0])) : true

    if (!shouldExecute) {
      return null
    }

    return {
      type: actionType,
      execute: true,
      timestamp: context.bar.time
    }
  }

  private executeGraphicalNode(context: NodeExecutionContext): any {
    const { node, bar } = context
    const params = node.data?.parameters || {}

    return {
      type: 'graphical',
      objectType: params.objectType || 'arrow',
      price: bar.close,
      time: bar.time,
      params
    }
  }

  private executeMessagingNode(context: NodeExecutionContext): any {
    const { node, nodeValues } = context
    const params = node.data?.parameters || {}

    const inputNodes = this.getInputNodes(context)
    const shouldSend = inputNodes.length > 0 ? Boolean(nodeValues.get(inputNodes[0])) : true

    if (!shouldSend) {
      return null
    }

    return {
      type: 'message',
      method: params.method || 'notification',
      message: params.message || 'Trading signal triggered',
      params
    }
  }

  private executeFileOpsNode(context: NodeExecutionContext): any {
    const { node } = context
    const params = node.data?.parameters || {}

    return {
      type: 'file_operation',
      operation: params.operation || 'write',
      params
    }
  }

  private executeTerminalNode(context: NodeExecutionContext): any {
    const { node, balance, symbol } = context
    const params = node.data?.parameters || {}
    const infoType = params.type || 'account_balance'

    switch (infoType) {
      case 'account_balance':
        return accountTerminal.getAccountBalance()
      
      case 'account_equity':
        return accountTerminal.getAccountEquity()
      
      case 'account_margin':
        return accountTerminal.getAccountMargin()
      
      case 'account_free_margin':
        return accountTerminal.getAccountFreeMargin()
      
      case 'symbol_bid':
        const symbolInfo = accountTerminal.getSymbolInfo(symbol || 'EURUSD')
        return symbolInfo?.bid || context.bar.close
      
      case 'symbol_ask':
        const symInfo = accountTerminal.getSymbolInfo(symbol || 'EURUSD')
        return symInfo?.ask || context.bar.close
      
      case 'symbol_point':
        return accountTerminal.getSymbolInfo(symbol || 'EURUSD')?.point || 0.0001
      
      default:
        return balance
    }
  }

  private getInputNodes(context: NodeExecutionContext): string[] {
    const edges = context.edges || this.edges
    return edges
      .filter(edge => edge.target === context.node.id)
      .map(edge => edge.source)
  }

  private getPreviousValue(context: NodeExecutionContext, nodeId: string, prevIndex: number): number | null {
    if (prevIndex < 0) return null
    const cacheKey = `${nodeId}_${prevIndex}`
    return context.indicatorCache.get(cacheKey) || null
  }

  getNodeInputConnections(nodeId: string, edges: any[]): string[] {
    return edges
      .filter(edge => edge.target === nodeId)
      .map(edge => edge.source)
  }
}

export const nodeExecutionEngine = new NodeExecutionEngine()
