import { Trade } from './strategy-executor'
import { OHLCV } from '@/types/market-data'

export interface TradeGroup {
  groupName: string
  trades: Trade[]
  maxTrades: number
  totalLots: number
}

export interface TrailingStopConfig {
  activationPips: number
  trailingPips: number
  stepPips: number
}

export interface BreakEvenConfig {
  profitPips: number
  lockPips: number
}

export interface PartialCloseConfig {
  profitPips: number
  closePercent: number
}

export interface ScaleInConfig {
  addPips: number
  maxPositions: number
  multiplier: number
}

export interface ScaleOutConfig {
  exitLevels: number[]
  portions: number[]
}

export class AdvancedTradeManager {
  private tradeGroups: Map<string, TradeGroup> = new Map()
  private trailingStops: Map<string, number> = new Map()
  private breakEvenApplied: Set<string> = new Set()
  private partialCloseApplied: Map<string, number> = new Map()

  createTradeGroup(groupName: string, maxTrades: number): TradeGroup {
    if (!this.tradeGroups.has(groupName)) {
      this.tradeGroups.set(groupName, {
        groupName,
        trades: [],
        maxTrades,
        totalLots: 0
      })
    }
    return this.tradeGroups.get(groupName)!
  }

  addTradeToGroup(groupName: string, trade: Trade): boolean {
    const group = this.tradeGroups.get(groupName)
    if (!group) {
      return false
    }

    if (group.trades.length >= group.maxTrades) {
      return false
    }

    group.trades.push(trade)
    group.totalLots += trade.lots
    return true
  }

  removeTradeFromGroup(groupName: string, tradeId: string): void {
    const group = this.tradeGroups.get(groupName)
    if (!group) return

    const index = group.trades.findIndex(t => t.id === tradeId)
    if (index !== -1) {
      const trade = group.trades[index]
      group.totalLots -= trade.lots
      group.trades.splice(index, 1)
    }
  }

  getTradeGroup(groupName: string): TradeGroup | undefined {
    return this.tradeGroups.get(groupName)
  }

  applyTrailingStop(
    trade: Trade,
    currentBar: OHLCV,
    config: TrailingStopConfig
  ): Trade | null {
    if (!trade.entryPrice) return null

    const pipValue = 0.0001
    const currentPrice = trade.type === 'buy' ? currentBar.close : currentBar.close
    const profitPips = trade.type === 'buy'
      ? (currentPrice - trade.entryPrice) / pipValue
      : (trade.entryPrice - currentPrice) / pipValue

    if (profitPips < config.activationPips) {
      return null
    }

    const currentStopLoss = this.trailingStops.get(trade.id) || trade.stopLoss

    let newStopLoss: number
    if (trade.type === 'buy') {
      newStopLoss = currentPrice - (config.trailingPips * pipValue)
      
      if (!currentStopLoss || newStopLoss > currentStopLoss) {
        const stepsMoved = currentStopLoss 
          ? Math.floor((newStopLoss - currentStopLoss) / (config.stepPips * pipValue))
          : 1
        
        if (stepsMoved >= 1) {
          this.trailingStops.set(trade.id, newStopLoss)
          return { ...trade, stopLoss: newStopLoss }
        }
      }
    } else {
      newStopLoss = currentPrice + (config.trailingPips * pipValue)
      
      if (!currentStopLoss || newStopLoss < currentStopLoss) {
        const stepsMoved = currentStopLoss 
          ? Math.floor((currentStopLoss - newStopLoss) / (config.stepPips * pipValue))
          : 1
        
        if (stepsMoved >= 1) {
          this.trailingStops.set(trade.id, newStopLoss)
          return { ...trade, stopLoss: newStopLoss }
        }
      }
    }

    return null
  }

  applyBreakEven(
    trade: Trade,
    currentBar: OHLCV,
    config: BreakEvenConfig
  ): Trade | null {
    if (!trade.entryPrice || this.breakEvenApplied.has(trade.id)) {
      return null
    }

    const pipValue = 0.0001
    const currentPrice = currentBar.close
    const profitPips = trade.type === 'buy'
      ? (currentPrice - trade.entryPrice) / pipValue
      : (trade.entryPrice - currentPrice) / pipValue

    if (profitPips >= config.profitPips) {
      const breakEvenPrice = trade.type === 'buy'
        ? trade.entryPrice + (config.lockPips * pipValue)
        : trade.entryPrice - (config.lockPips * pipValue)

      this.breakEvenApplied.add(trade.id)
      return { ...trade, stopLoss: breakEvenPrice }
    }

    return null
  }

  applyPartialClose(
    trade: Trade,
    currentBar: OHLCV,
    config: PartialCloseConfig
  ): { modifiedTrade: Trade | null, closedPortion: Trade | null } {
    const closedPercent = this.partialCloseApplied.get(trade.id) || 0
    
    if (closedPercent >= 100) {
      return { modifiedTrade: null, closedPortion: null }
    }

    const pipValue = 0.0001
    const currentPrice = currentBar.close
    const profitPips = trade.type === 'buy'
      ? (currentPrice - trade.entryPrice) / pipValue
      : (trade.entryPrice - currentPrice) / pipValue

    if (profitPips >= config.profitPips) {
      const closeAmount = (config.closePercent / 100) * trade.lots
      const remainingLots = trade.lots - closeAmount

      if (remainingLots < 0.01) {
        return {
          modifiedTrade: null,
          closedPortion: {
            ...trade,
            exitPrice: currentPrice,
            exitTime: currentBar.time
          }
        }
      }

      this.partialCloseApplied.set(trade.id, closedPercent + config.closePercent)

      const modifiedTrade: Trade = {
        ...trade,
        lots: remainingLots
      }

      const closedPortion: Trade = {
        ...trade,
        id: `${trade.id}_partial_${closedPercent}`,
        lots: closeAmount,
        exitPrice: currentPrice,
        exitTime: currentBar.time,
        profit: this.calculateProfit(trade.type, trade.entryPrice, currentPrice, closeAmount)
      }

      return { modifiedTrade, closedPortion }
    }

    return { modifiedTrade: null, closedPortion: null }
  }

  shouldScaleIn(
    existingTrades: Trade[],
    currentBar: OHLCV,
    config: ScaleInConfig
  ): boolean {
    if (existingTrades.length >= config.maxPositions) {
      return false
    }

    if (existingTrades.length === 0) {
      return false
    }

    const lastTrade = existingTrades[existingTrades.length - 1]
    const pipValue = 0.0001
    const currentPrice = currentBar.close
    
    const pipsFromEntry = lastTrade.type === 'buy'
      ? (currentPrice - lastTrade.entryPrice) / pipValue
      : (lastTrade.entryPrice - currentPrice) / pipValue

    return pipsFromEntry >= config.addPips
  }

  calculateScaleInLotSize(existingTrades: Trade[], config: ScaleInConfig): number {
    if (existingTrades.length === 0) {
      return 0.01
    }

    const lastTrade = existingTrades[existingTrades.length - 1]
    return lastTrade.lots * config.multiplier
  }

  shouldScaleOut(
    trade: Trade,
    currentBar: OHLCV,
    config: ScaleOutConfig,
    scaleOutLevel: number
  ): boolean {
    if (scaleOutLevel >= config.exitLevels.length) {
      return false
    }

    const pipValue = 0.0001
    const currentPrice = currentBar.close
    const profitPips = trade.type === 'buy'
      ? (currentPrice - trade.entryPrice) / pipValue
      : (trade.entryPrice - currentPrice) / pipValue

    return profitPips >= config.exitLevels[scaleOutLevel]
  }

  applyTimeStop(trade: Trade, currentBar: OHLCV, durationMinutes: number): boolean {
    const timeInTrade = (currentBar.time - trade.entryTime) / 1000 / 60
    return timeInTrade >= durationMinutes
  }

  createHedge(mainTrade: Trade, currentBar: OHLCV, hedgeRatio: number): Trade {
    const hedgeType = mainTrade.type === 'buy' ? 'sell' : 'buy'
    const hedgeLots = mainTrade.lots * hedgeRatio

    return {
      id: `${mainTrade.id}_hedge`,
      type: hedgeType,
      entryTime: currentBar.time,
      entryPrice: currentBar.close,
      lots: hedgeLots,
      stopLoss: mainTrade.stopLoss,
      takeProfit: mainTrade.takeProfit
    }
  }

  shouldCreateHedge(
    trade: Trade,
    currentBar: OHLCV,
    triggerPips: number
  ): boolean {
    const pipValue = 0.0001
    const currentPrice = currentBar.close
    const profitPips = trade.type === 'buy'
      ? (currentPrice - trade.entryPrice) / pipValue
      : (trade.entryPrice - currentPrice) / pipValue

    return profitPips >= triggerPips
  }

  private calculateProfit(
    type: 'buy' | 'sell',
    entryPrice: number,
    exitPrice: number,
    lots: number
  ): number {
    const pointValue = 10
    const pips = type === 'buy'
      ? (exitPrice - entryPrice) / 0.0001
      : (entryPrice - exitPrice) / 0.0001
    
    return pips * lots * pointValue
  }

  closeGroup(groupName: string, currentBar: OHLCV): Trade[] {
    const group = this.tradeGroups.get(groupName)
    if (!group) return []

    const closedTrades = group.trades.map(trade => ({
      ...trade,
      exitPrice: currentBar.close,
      exitTime: currentBar.time,
      profit: this.calculateProfit(trade.type, trade.entryPrice, currentBar.close, trade.lots)
    }))

    this.tradeGroups.delete(groupName)
    return closedTrades
  }

  getGroupProfit(groupName: string, currentBar: OHLCV): number {
    const group = this.tradeGroups.get(groupName)
    if (!group) return 0

    return group.trades.reduce((total, trade) => {
      const profit = this.calculateProfit(trade.type, trade.entryPrice, currentBar.close, trade.lots)
      return total + profit
    }, 0)
  }

  reset(): void {
    this.tradeGroups.clear()
    this.trailingStops.clear()
    this.breakEvenApplied.clear()
    this.partialCloseApplied.clear()
  }
}
