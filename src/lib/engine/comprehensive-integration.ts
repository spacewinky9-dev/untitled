import { moneyManagement, MoneyManagementConfig } from './money-management'
import { pendingOrderManager, PendingOrder } from './pending-order-manager'
import { mathEngine, MathOperation } from './math-operations'
import { accountTerminal } from './account-terminal'
import { loopEngine } from './loop-iteration'
import { advancedTradeManager, TradePosition } from './advanced-trade-manager'
import { variableManager } from './variable-manager'
import { eventSystemManager, EventContext } from './event-system-manager'

export interface NodeExecutionContext {
  symbol: string
  timeframe: string
  currentTime: number
  currentPrice: number
  nodeId: string
  parameters: Record<string, any>
}

export class ComprehensiveEngineIntegration {
  
  executeMoneyManagementNode(
    context: NodeExecutionContext
  ): number {
    const config: MoneyManagementConfig = {
      method: context.parameters.method || 'risk_percent',
      riskPercent: context.parameters.riskPercent,
      fixedLot: context.parameters.fixedLot,
      balancePercent: context.parameters.balancePercent,
      martingaleMultiplier: context.parameters.martingaleMultiplier,
      antiMartingaleMultiplier: context.parameters.antiMartingaleMultiplier,
      maxLotSize: context.parameters.maxLotSize,
      minLotSize: context.parameters.minLotSize,
      recoveryFactor: context.parameters.recoveryFactor,
      fixedRatioDelta: context.parameters.fixedRatioDelta
    }
    
    const stopLossPips = context.parameters.stopLossPips || 20
    const pipValue = accountTerminal.calculatePipValue(context.symbol, 1.0)
    
    const lotSize = moneyManagement.calculateLotSize(
      config,
      stopLossPips,
      pipValue,
      context.symbol
    )
    
    return lotSize
  }
  
  executePendingOrderNode(
    context: NodeExecutionContext,
    orderType: 'buy_limit' | 'sell_limit' | 'buy_stop' | 'sell_stop'
  ): string {
    const lots = context.parameters.lots || 0.01
    const pips = context.parameters.pips || 20
    const symbolInfo = accountTerminal.getSymbolInfo(context.symbol)
    
    if (!symbolInfo) {
      throw new Error(`Symbol ${context.symbol} not found`)
    }
    
    const pipValue = symbolInfo.point * 10
    let entryPrice = context.currentPrice
    
    switch (orderType) {
      case 'buy_limit':
        entryPrice = context.currentPrice - (pips * pipValue)
        break
      case 'sell_limit':
        entryPrice = context.currentPrice + (pips * pipValue)
        break
      case 'buy_stop':
        entryPrice = context.currentPrice + (pips * pipValue)
        break
      case 'sell_stop':
        entryPrice = context.currentPrice - (pips * pipValue)
        break
    }
    
    const order: PendingOrder = {
      id: `pending_${Date.now()}_${Math.random()}`,
      type: orderType,
      symbol: context.symbol,
      entryPrice,
      lots,
      stopLoss: context.parameters.stopLoss,
      takeProfit: context.parameters.takeProfit,
      expirationTime: context.parameters.expirationTime,
      placedTime: context.currentTime,
      groupName: context.parameters.groupName,
      magicNumber: context.parameters.magicNumber,
      comment: context.parameters.comment
    }
    
    return pendingOrderManager.placePendingOrder(order)
  }
  
  executeModifyPendingNode(
    context: NodeExecutionContext,
    orderId: string
  ): boolean {
    return pendingOrderManager.modifyPendingOrder(orderId, {
      entryPrice: context.parameters.entryPrice,
      stopLoss: context.parameters.stopLoss,
      takeProfit: context.parameters.takeProfit,
      expirationTime: context.parameters.expirationTime
    })
  }
  
  executeDeletePendingNode(
    context: NodeExecutionContext,
    orderId?: string
  ): number {
    if (orderId) {
      return pendingOrderManager.deletePendingOrder(orderId) ? 1 : 0
    }
    
    if (context.parameters.groupName) {
      return pendingOrderManager.deletePendingOrdersByGroup(context.parameters.groupName)
    }
    
    if (context.parameters.orderType) {
      return pendingOrderManager.deletePendingOrdersByType(context.parameters.orderType)
    }
    
    return pendingOrderManager.deleteAllPendingOrders()
  }
  
  executeMathOperationNode(
    context: NodeExecutionContext,
    operation: MathOperation,
    operands: number[]
  ): number {
    const result = mathEngine.executeOperation(operation, operands)
    
    if (result.error) {
      throw new Error(`Math operation failed: ${result.error}`)
    }
    
    return result.value
  }
  
  executeAccountDataNode(
    context: NodeExecutionContext,
    dataType: 'balance' | 'equity' | 'margin' | 'profit' | 'leverage'
  ): number {
    const account = accountTerminal.getAccount()
    
    switch (dataType) {
      case 'balance':
        return account.balance
      case 'equity':
        return account.equity
      case 'margin':
        return account.freeMargin
      case 'profit':
        return account.profit
      case 'leverage':
        return account.leverage
      default:
        return 0
    }
  }
  
  executeSymbolDataNode(
    context: NodeExecutionContext,
    dataType: 'bid' | 'ask' | 'spread' | 'high' | 'low' | 'volume'
  ): number {
    const symbol = context.parameters.symbol || context.symbol
    const symbolInfo = accountTerminal.getSymbolInfo(symbol)
    
    if (!symbolInfo) {
      throw new Error(`Symbol ${symbol} not found`)
    }
    
    switch (dataType) {
      case 'bid':
        return symbolInfo.bidPrice
      case 'ask':
        return symbolInfo.askPrice
      case 'spread':
        return symbolInfo.spread / 10
      case 'high':
        return symbolInfo.high
      case 'low':
        return symbolInfo.low
      case 'volume':
        return symbolInfo.volume
      default:
        return 0
    }
  }
  
  executeTradesCountNode(
    context: NodeExecutionContext,
    operator: string,
    value: number
  ): boolean {
    const positions = advancedTradeManager.getAllPositions()
    let count = positions.length
    
    if (context.parameters.groupName) {
      count = advancedTradeManager.getPositionsByGroup(context.parameters.groupName).length
    }
    
    if (context.parameters.symbol) {
      count = advancedTradeManager.getPositionsBySymbol(context.parameters.symbol).length
    }
    
    switch (operator) {
      case 'eq':
        return count === value
      case 'neq':
        return count !== value
      case 'gt':
        return count > value
      case 'gte':
        return count >= value
      case 'lt':
        return count < value
      case 'lte':
        return count <= value
      default:
        return false
    }
  }
  
  executeTradeExistsNode(
    context: NodeExecutionContext
  ): boolean {
    if (context.parameters.groupName) {
      return advancedTradeManager.getPositionsByGroup(context.parameters.groupName).length > 0
    }
    
    if (context.parameters.symbol) {
      return advancedTradeManager.getPositionsBySymbol(context.parameters.symbol).length > 0
    }
    
    return advancedTradeManager.getAllPositions().length > 0
  }
  
  executePendingExistsNode(
    context: NodeExecutionContext
  ): boolean {
    if (context.parameters.groupName) {
      return pendingOrderManager.getPendingOrdersByGroup(context.parameters.groupName).length > 0
    }
    
    if (context.parameters.symbol) {
      return pendingOrderManager.getPendingOrdersBySymbol(context.parameters.symbol).length > 0
    }
    
    return pendingOrderManager.countPendingOrders() > 0
  }
  
  executeTimeFilterNode(
    context: NodeExecutionContext
  ): boolean {
    const now = new Date(context.currentTime)
    const currentHour = now.getUTCHours()
    const currentDay = now.getUTCDay()
    
    const startHour = context.parameters.startHour || 0
    const endHour = context.parameters.endHour || 23
    const allowedDays = context.parameters.allowedDays || [1, 2, 3, 4, 5]
    
    const hourOk = currentHour >= startHour && currentHour <= endHour
    const dayOk = allowedDays.includes(currentDay)
    
    return hourOk && dayOk
  }
  
  executeSpreadFilterNode(
    context: NodeExecutionContext
  ): boolean {
    const maxSpreadPips = context.parameters.maxSpreadPips || 2.0
    const symbol = context.parameters.symbol || context.symbol
    const symbolInfo = accountTerminal.getSymbolInfo(symbol)
    
    if (!symbolInfo) {
      return false
    }
    
    const currentSpreadPips = symbolInfo.spread / 10
    
    return currentSpreadPips <= maxSpreadPips
  }
  
  executeForEachTradeNode(
    context: NodeExecutionContext,
    callback: (trade: TradePosition, index: number) => void
  ): void {
    let trades = advancedTradeManager.getAllPositions()
    
    if (context.parameters.filterByGroup && context.parameters.groupName) {
      trades = advancedTradeManager.getPositionsByGroup(context.parameters.groupName)
    }
    
    if (context.parameters.filterBySymbol && context.parameters.symbol) {
      trades = advancedTradeManager.getPositionsBySymbol(context.parameters.symbol)
    }
    
    if (context.parameters.filterByType) {
      trades = trades.filter(t => t.type === context.parameters.tradeType)
    }
    
    loopEngine.forEachTrade(trades, (trade, loopContext) => {
      callback(trade, loopContext.currentIndex)
    })
  }
  
  executeForEachPendingNode(
    context: NodeExecutionContext,
    callback: (order: PendingOrder, index: number) => void
  ): void {
    let orders = pendingOrderManager.getAllPendingOrders()
    
    if (context.parameters.filterByGroup && context.parameters.groupName) {
      orders = pendingOrderManager.getPendingOrdersByGroup(context.parameters.groupName)
    }
    
    if (context.parameters.filterBySymbol && context.parameters.symbol) {
      orders = pendingOrderManager.getPendingOrdersBySymbol(context.parameters.symbol)
    }
    
    if (context.parameters.filterByType) {
      orders = pendingOrderManager.getPendingOrdersByType(context.parameters.orderType)
    }
    
    loopEngine.forEachPendingOrder(orders, (order, loopContext) => {
      callback(order, loopContext.currentIndex)
    })
  }
  
  executeForEachSymbolNode(
    context: NodeExecutionContext,
    callback: (symbol: string, index: number) => void
  ): void {
    const symbols = context.parameters.symbols || accountTerminal.getSymbolNames()
    
    loopEngine.forEachSymbol(symbols, (symbol, loopContext) => {
      callback(symbol, loopContext.currentIndex)
    })
  }
  
  executeRepeatNNode(
    context: NodeExecutionContext,
    callback: (iteration: number) => void
  ): void {
    const count = context.parameters.count || 1
    
    loopEngine.repeatNTimes(count, (iteration, loopContext) => {
      callback(iteration)
    })
  }
  
  executeVariableNode(
    context: NodeExecutionContext,
    operation: 'set' | 'get' | 'increment' | 'decrement' | 'push' | 'pop'
  ): any {
    const variableName = context.parameters.variableName || 'var1'
    const scope = context.parameters.scope || 'local'
    
    switch (operation) {
      case 'set':
        variableManager.setVariable(variableName, context.parameters.value, scope)
        return context.parameters.value
        
      case 'get':
        return variableManager.getVariable(variableName, scope)
        
      case 'increment':
        return variableManager.incrementCounter(variableName, scope)
        
      case 'decrement':
        return variableManager.decrementCounter(variableName, scope)
        
      case 'push':
        return variableManager.arrayPush(variableName, context.parameters.value, scope)
        
      case 'pop':
        return variableManager.arrayPop(variableName, scope)
        
      default:
        return null
    }
  }
  
  getSystemState() {
    return {
      account: accountTerminal.getAccount(),
      terminal: accountTerminal.getTerminal(),
      positions: advancedTradeManager.getAllPositions(),
      pendingOrders: pendingOrderManager.getAllPendingOrders(),
      moneyManagementStats: moneyManagement.getStatistics(),
      variables: variableManager.getAllVariables('local')
    }
  }
  
  resetAllSystems() {
    moneyManagement.reset()
    pendingOrderManager.reset()
    advancedTradeManager.reset()
    variableManager.reset()
    accountTerminal.reset()
  }
}

export const engineIntegration = new ComprehensiveEngineIntegration()
