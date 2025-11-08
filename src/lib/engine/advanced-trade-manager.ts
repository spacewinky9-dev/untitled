import { OHLCV } from '@/types/market-data'

export interface TradePosition {
  id: string
  symbol: string
  type: 'buy' | 'sell'
  entryPrice: number
  currentPrice: number
  lots: number
  stopLoss?: number
  takeProfit?: number
  openTime: number
  groupName?: string
  magicNumber?: number
}

export interface BreakEvenConfig {
  profitPips: number
  lockPips: number
}

export interface PartialCloseConfig {
  profitPips: number
  closePercent: number
}

export interface TrailingStopConfig {
  activationPips: number
  trailingPips: number
  stepPips: number
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

export interface TradeGroupConfig {
  groupName: string
  maxTrades: number
}

export class AdvancedTradeManager {
  private positions: Map<string, TradePosition> = new Map()
  private groupPositions: Map<string, Set<string>> = new Map()
  private breakEvenApplied: Set<string> = new Set()
  private partialCloses: Map<string, number> = new Map()
  private highWaterMarks: Map<string, number> = new Map()

  getPipValue(symbol: string): number {
    if (symbol.includes('JPY')) {
      return 0.01
    }
    return 0.0001
  }

  calculatePips(symbol: string, price1: number, price2: number, type: 'buy' | 'sell'): number {
    const pipValue = this.getPipValue(symbol)
    const priceDiff = type === 'buy' ? price2 - price1 : price1 - price2
    return priceDiff / pipValue
  }

  addPosition(position: TradePosition): void {
    this.positions.set(position.id, position)
    
    if (position.groupName) {
      if (!this.groupPositions.has(position.groupName)) {
        this.groupPositions.set(position.groupName, new Set())
      }
      this.groupPositions.get(position.groupName)!.add(position.id)
    }

    this.highWaterMarks.set(position.id, 0)
  }

  updatePosition(id: string, currentPrice: number): void {
    const position = this.positions.get(id)
    if (position) {
      position.currentPrice = currentPrice
      
      const profitPips = this.calculatePips(
        position.symbol,
        position.entryPrice,
        currentPrice,
        position.type
      )
      
      const currentMark = this.highWaterMarks.get(id) || 0
      if (profitPips > currentMark) {
        this.highWaterMarks.set(id, profitPips)
      }
    }
  }

  closePosition(id: string): void {
    const position = this.positions.get(id)
    if (position && position.groupName) {
      this.groupPositions.get(position.groupName)?.delete(id)
    }
    this.positions.delete(id)
    this.breakEvenApplied.delete(id)
    this.partialCloses.delete(id)
    this.highWaterMarks.delete(id)
  }

  applyBreakEven(id: string, config: BreakEvenConfig): boolean {
    if (this.breakEvenApplied.has(id)) {
      return false
    }

    const position = this.positions.get(id)
    if (!position) return false

    const profitPips = this.calculatePips(
      position.symbol,
      position.entryPrice,
      position.currentPrice,
      position.type
    )

    if (profitPips >= config.profitPips) {
      const pipValue = this.getPipValue(position.symbol)
      const lockDistance = config.lockPips * pipValue
      
      if (position.type === 'buy') {
        position.stopLoss = position.entryPrice + lockDistance
      } else {
        position.stopLoss = position.entryPrice - lockDistance
      }
      
      this.breakEvenApplied.add(id)
      return true
    }

    return false
  }

  applyPartialClose(id: string, config: PartialCloseConfig): number {
    const currentlyClosed = this.partialCloses.get(id) || 0
    if (currentlyClosed >= 99) {
      return 0
    }

    const position = this.positions.get(id)
    if (!position) return 0

    const profitPips = this.calculatePips(
      position.symbol,
      position.entryPrice,
      position.currentPrice,
      position.type
    )

    if (profitPips >= config.profitPips) {
      const closeAmount = Math.min(config.closePercent, 100 - currentlyClosed)
      this.partialCloses.set(id, currentlyClosed + closeAmount)
      
      position.lots = position.lots * (1 - closeAmount / 100)
      
      return closeAmount
    }

    return 0
  }

  applyTrailingStop(id: string, config: TrailingStopConfig): boolean {
    const position = this.positions.get(id)
    if (!position) return false

    const profitPips = this.calculatePips(
      position.symbol,
      position.entryPrice,
      position.currentPrice,
      position.type
    )

    if (profitPips < config.activationPips) {
      return false
    }

    const highWaterMark = this.highWaterMarks.get(id) || 0
    const pipValue = this.getPipValue(position.symbol)
    const trailingDistance = config.trailingPips * pipValue

    if (position.type === 'buy') {
      const proposedStopLoss = position.currentPrice - trailingDistance
      
      const currentStopLoss = position.stopLoss || 0
      if (proposedStopLoss > currentStopLoss) {
        const improvement = (proposedStopLoss - currentStopLoss) / pipValue
        if (improvement >= config.stepPips) {
          position.stopLoss = proposedStopLoss
          return true
        }
      }
    } else {
      const proposedStopLoss = position.currentPrice + trailingDistance
      
      const currentStopLoss = position.stopLoss || Number.MAX_SAFE_INTEGER
      if (proposedStopLoss < currentStopLoss) {
        const improvement = (currentStopLoss - proposedStopLoss) / pipValue
        if (improvement >= config.stepPips) {
          position.stopLoss = proposedStopLoss
          return true
        }
      }
    }

    return false
  }

  canScaleIn(basePositionId: string, config: ScaleInConfig): boolean {
    const position = this.positions.get(basePositionId)
    if (!position || !position.groupName) return false

    const groupPositions = this.groupPositions.get(position.groupName)
    if (!groupPositions) return false

    const count = groupPositions.size
    if (count >= config.maxPositions) {
      return false
    }

    const profitPips = this.calculatePips(
      position.symbol,
      position.entryPrice,
      position.currentPrice,
      position.type
    )

    return Math.abs(profitPips) >= config.addPips
  }

  calculateScaleOutLots(id: string, config: ScaleOutConfig, currentProfitPips: number): number {
    const position = this.positions.get(id)
    if (!position) return 0

    let totalClosed = 0
    for (let i = 0; i < config.exitLevels.length; i++) {
      if (currentProfitPips >= config.exitLevels[i]) {
        totalClosed += config.portions[i]
      }
    }

    const alreadyClosed = this.partialCloses.get(id) || 0
    const toClose = Math.max(0, totalClosed - alreadyClosed)
    
    if (toClose > 0) {
      this.partialCloses.set(id, alreadyClosed + toClose)
      return position.lots * (toClose / 100)
    }

    return 0
  }

  checkStopLossHit(id: string, currentPrice: number): boolean {
    const position = this.positions.get(id)
    if (!position || !position.stopLoss) return false

    if (position.type === 'buy') {
      return currentPrice <= position.stopLoss
    } else {
      return currentPrice >= position.stopLoss
    }
  }

  checkTakeProfitHit(id: string, currentPrice: number): boolean {
    const position = this.positions.get(id)
    if (!position || !position.takeProfit) return false

    if (position.type === 'buy') {
      return currentPrice >= position.takeProfit
    } else {
      return currentPrice <= position.takeProfit
    }
  }

  getGroupPositions(groupName: string): TradePosition[] {
    const ids = this.groupPositions.get(groupName)
    if (!ids) return []

    return Array.from(ids)
      .map(id => this.positions.get(id))
      .filter((p): p is TradePosition => p !== undefined)
  }

  closeGroup(groupName: string): number {
    const positions = this.getGroupPositions(groupName)
    positions.forEach(pos => this.closePosition(pos.id))
    return positions.length
  }

  checkTimeStop(id: string, currentTime: number, durationMinutes: number): boolean {
    const position = this.positions.get(id)
    if (!position) return false

    const elapsedMinutes = (currentTime - position.openTime) / (1000 * 60)
    return elapsedMinutes >= durationMinutes
  }

  getAllPositions(): TradePosition[] {
    return Array.from(this.positions.values())
  }

  getPosition(id: string): TradePosition | undefined {
    return this.positions.get(id)
  }

  getGroupCount(groupName: string): number {
    return this.groupPositions.get(groupName)?.size || 0
  }

  canOpenInGroup(groupName: string, maxTrades: number): boolean {
    return this.getGroupCount(groupName) < maxTrades
  }

  calculateGroupProfit(groupName: string): number {
    const positions = this.getGroupPositions(groupName)
    return positions.reduce((total, pos) => {
      const pips = this.calculatePips(
        pos.symbol,
        pos.entryPrice,
        pos.currentPrice,
        pos.type
      )
      return total + pips * pos.lots
    }, 0)
  }

  getPositionProfit(id: string): { pips: number; profit: number } {
    const position = this.positions.get(id)
    if (!position) return { pips: 0, profit: 0 }

    const pips = this.calculatePips(
      position.symbol,
      position.entryPrice,
      position.currentPrice,
      position.type
    )

    const profit = pips * position.lots * 10

    return { pips, profit }
  }

  reset(): void {
    this.positions.clear()
    this.groupPositions.clear()
    this.breakEvenApplied.clear()
    this.partialCloses.clear()
    this.highWaterMarks.clear()
  }
}

export const advancedTradeManager = new AdvancedTradeManager()
