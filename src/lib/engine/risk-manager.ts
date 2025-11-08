import { Trade } from './strategy-executor'
import { BacktestConfig } from '@/types/backtest'

export interface RiskConfig {
  maxPositionSize: number
  maxDailyLoss: number
  maxDrawdownPercent: number
  riskPerTrade: number
  maxConcurrentTrades: number
  maxLeverage: number
  minRiskRewardRatio?: number
}

export interface PositionSizeResult {
  lots: number
  riskAmount: number
  stopDistance: number
  canTrade: boolean
  reason?: string
}

export interface PortfolioRisk {
  totalExposure: number
  exposurePercent: number
  marginUsed: number
  freeMargin: number
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
}

export class RiskManager {
  private config: RiskConfig
  private dailyLoss: number = 0
  private dailyStartTime: number = 0

  constructor(config: RiskConfig) {
    this.config = config
  }

  calculatePositionSize(
    balance: number,
    entryPrice: number,
    stopLoss: number,
    symbol: string = 'EURUSD'
  ): PositionSizeResult {
    if (!stopLoss || stopLoss === entryPrice) {
      return {
        lots: 0.01,
        riskAmount: 0,
        stopDistance: 0,
        canTrade: false,
        reason: 'Invalid stop loss'
      }
    }

    const riskAmount = balance * (this.config.riskPerTrade / 100)
    const stopDistance = Math.abs(entryPrice - stopLoss)
    const pipValue = this.getPipValue(symbol)
    
    let lots = riskAmount / (stopDistance * pipValue * 100000)
    lots = Math.min(lots, this.config.maxPositionSize)
    lots = Math.max(lots, 0.01)
    lots = Math.round(lots * 100) / 100

    return {
      lots,
      riskAmount,
      stopDistance: stopDistance * 10000,
      canTrade: true
    }
  }

  canOpenTrade(
    balance: number,
    initialBalance: number,
    openPositions: Trade[],
    currentTime: number
  ): { canTrade: boolean; reason?: string } {
    if (openPositions.length >= this.config.maxConcurrentTrades) {
      return { canTrade: false, reason: 'Maximum concurrent trades reached' }
    }

    const drawdownPercent = ((initialBalance - balance) / initialBalance) * 100
    if (drawdownPercent >= this.config.maxDrawdownPercent) {
      return { canTrade: false, reason: 'Maximum drawdown limit reached' }
    }

    if (this.isDifferentDay(currentTime)) {
      this.dailyLoss = 0
      this.dailyStartTime = currentTime
    }

    if (this.dailyLoss >= this.config.maxDailyLoss) {
      return { canTrade: false, reason: 'Daily loss limit reached' }
    }

    return { canTrade: true }
  }

  validateRiskReward(
    entryPrice: number,
    stopLoss: number,
    takeProfit: number
  ): { isValid: boolean; ratio: number; reason?: string } {
    if (!stopLoss || !takeProfit) {
      return { isValid: false, ratio: 0, reason: 'Missing SL or TP' }
    }

    const risk = Math.abs(entryPrice - stopLoss)
    const reward = Math.abs(takeProfit - entryPrice)
    const ratio = reward / risk

    const minRatio = this.config.minRiskRewardRatio || 1.5

    if (ratio < minRatio) {
      return {
        isValid: false,
        ratio,
        reason: `Risk/Reward ratio ${ratio.toFixed(2)} is below minimum ${minRatio}`
      }
    }

    return { isValid: true, ratio }
  }

  updateDailyLoss(loss: number): void {
    if (loss < 0) {
      this.dailyLoss += Math.abs(loss)
    }
  }

  calculatePortfolioRisk(
    balance: number,
    openPositions: Trade[],
    leverage: number = 100
  ): PortfolioRisk {
    const totalExposure = openPositions.reduce((sum, pos) => {
      return sum + (pos.entryPrice * pos.lots * 100000)
    }, 0)

    const exposurePercent = (totalExposure / balance) * 100
    const marginUsed = totalExposure / leverage
    const freeMargin = balance - marginUsed

    let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low'
    if (exposurePercent > 200) riskLevel = 'critical'
    else if (exposurePercent > 100) riskLevel = 'high'
    else if (exposurePercent > 50) riskLevel = 'medium'

    return {
      totalExposure,
      exposurePercent,
      marginUsed,
      freeMargin,
      riskLevel
    }
  }

  optimizeStopLoss(
    entryPrice: number,
    atr: number,
    direction: 'buy' | 'sell',
    multiplier: number = 2
  ): number {
    const stopDistance = atr * multiplier
    if (direction === 'buy') {
      return entryPrice - stopDistance
    } else {
      return entryPrice + stopDistance
    }
  }

  optimizeTakeProfit(
    entryPrice: number,
    stopLoss: number,
    riskRewardRatio: number = 2
  ): number {
    const risk = Math.abs(entryPrice - stopLoss)
    const reward = risk * riskRewardRatio
    
    if (entryPrice > stopLoss) {
      return entryPrice + reward
    } else {
      return entryPrice - reward
    }
  }

  private getPipValue(symbol: string): number {
    const quoteCurrency = symbol.slice(3, 6)
    
    if (quoteCurrency === 'USD') {
      return 10
    } else if (quoteCurrency === 'JPY') {
      return 0.1
    }
    
    return 10
  }

  private isDifferentDay(currentTime: number): boolean {
    if (this.dailyStartTime === 0) {
      this.dailyStartTime = currentTime
      return false
    }

    const dayMs = 24 * 60 * 60 * 1000
    return currentTime - this.dailyStartTime > dayMs
  }

  calculateTrailingSt(
    position: Trade,
    currentPrice: number,
    atr: number,
    multiplier: number = 2
  ): number | null {
    if (!position.stopLoss) return null

    const trailDistance = atr * multiplier

    if (position.type === 'buy') {
      const newStop = currentPrice - trailDistance
      if (newStop > position.stopLoss) {
        return newStop
      }
    } else {
      const newStop = currentPrice + trailDistance
      if (newStop < position.stopLoss) {
        return newStop
      }
    }

    return null
  }

  getConfig(): RiskConfig {
    return { ...this.config }
  }

  updateConfig(updates: Partial<RiskConfig>): void {
    this.config = { ...this.config, ...updates }
  }
}

export const createDefaultRiskConfig = (): RiskConfig => ({
  maxPositionSize: 1.0,
  maxDailyLoss: 1000,
  maxDrawdownPercent: 20,
  riskPerTrade: 2,
  maxConcurrentTrades: 3,
  maxLeverage: 100,
  minRiskRewardRatio: 1.5
})
