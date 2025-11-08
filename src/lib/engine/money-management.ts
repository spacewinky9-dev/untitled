export type MoneyManagementMethod = 
  | 'fixed_lot'
  | 'percent_balance'
  | 'percent_equity'
  | 'risk_percent'
  | 'martingale'
  | 'anti_martingale'
  | 'recovery'
  | 'fixed_ratio'
  | 'optimal_f'

export interface MoneyManagementConfig {
  method: MoneyManagementMethod
  fixedLot?: number
  riskPercent?: number
  balancePercent?: number
  martingaleMultiplier?: number
  antiMartingaleMultiplier?: number
  maxLotSize?: number
  minLotSize?: number
  recoveryFactor?: number
  fixedRatioDelta?: number
}

export interface TradeHistory {
  result: 'win' | 'loss'
  profit: number
  lotSize: number
}

export class MoneyManagementSystem {
  private tradeHistory: TradeHistory[] = []
  private consecutiveWins: number = 0
  private consecutiveLosses: number = 0
  private baseBalance: number = 10000
  private currentBalance: number = 10000
  private highWaterMark: number = 10000
  
  constructor(initialBalance: number = 10000) {
    this.baseBalance = initialBalance
    this.currentBalance = initialBalance
    this.highWaterMark = initialBalance
  }
  
  updateBalance(newBalance: number): void {
    this.currentBalance = newBalance
    if (newBalance > this.highWaterMark) {
      this.highWaterMark = newBalance
    }
  }
  
  recordTrade(trade: TradeHistory): void {
    this.tradeHistory.push(trade)
    
    if (trade.result === 'win') {
      this.consecutiveWins++
      this.consecutiveLosses = 0
    } else {
      this.consecutiveLosses++
      this.consecutiveWins = 0
    }
  }
  
  calculateLotSize(
    config: MoneyManagementConfig,
    stopLossPips: number,
    pipValue: number,
    symbol: string = 'EURUSD'
  ): number {
    let lotSize = 0
    
    switch (config.method) {
      case 'fixed_lot':
        lotSize = config.fixedLot || 0.01
        break
        
      case 'percent_balance':
        lotSize = (this.currentBalance * (config.balancePercent || 1) / 100) / 
                 (stopLossPips * pipValue)
        break
        
      case 'percent_equity':
        lotSize = (this.currentBalance * (config.balancePercent || 1) / 100) / 
                 (stopLossPips * pipValue)
        break
        
      case 'risk_percent':
        const riskAmount = this.currentBalance * (config.riskPercent || 1) / 100
        lotSize = riskAmount / (stopLossPips * pipValue)
        break
        
      case 'martingale':
        lotSize = this.calculateMartingale(config)
        break
        
      case 'anti_martingale':
        lotSize = this.calculateAntiMartingale(config)
        break
        
      case 'recovery':
        lotSize = this.calculateRecovery(config, stopLossPips, pipValue)
        break
        
      case 'fixed_ratio':
        lotSize = this.calculateFixedRatio(config)
        break
        
      case 'optimal_f':
        lotSize = this.calculateOptimalF(config, stopLossPips, pipValue)
        break
        
      default:
        lotSize = 0.01
    }
    
    lotSize = this.normalizeLotSize(lotSize, symbol)
    
    if (config.minLotSize && lotSize < config.minLotSize) {
      lotSize = config.minLotSize
    }
    
    if (config.maxLotSize && lotSize > config.maxLotSize) {
      lotSize = config.maxLotSize
    }
    
    return lotSize
  }
  
  private calculateMartingale(config: MoneyManagementConfig): number {
    const baseLot = config.fixedLot || 0.01
    const multiplier = config.martingaleMultiplier || 2.0
    
    if (this.consecutiveLosses === 0) {
      return baseLot
    }
    
    return baseLot * Math.pow(multiplier, this.consecutiveLosses)
  }
  
  private calculateAntiMartingale(config: MoneyManagementConfig): number {
    const baseLot = config.fixedLot || 0.01
    const multiplier = config.antiMartingaleMultiplier || 1.5
    
    if (this.consecutiveWins === 0) {
      return baseLot
    }
    
    return baseLot * Math.pow(multiplier, this.consecutiveWins)
  }
  
  private calculateRecovery(
    config: MoneyManagementConfig, 
    stopLossPips: number, 
    pipValue: number
  ): number {
    const drawdown = this.highWaterMark - this.currentBalance
    
    if (drawdown <= 0) {
      return config.fixedLot || 0.01
    }
    
    const recoveryFactor = config.recoveryFactor || 2.0
    const targetProfit = drawdown / recoveryFactor
    
    return targetProfit / (stopLossPips * pipValue)
  }
  
  private calculateFixedRatio(config: MoneyManagementConfig): number {
    const delta = config.fixedRatioDelta || 5000
    const baseLot = config.fixedLot || 0.01
    const profit = this.currentBalance - this.baseBalance
    
    if (profit <= 0) {
      return baseLot
    }
    
    const unitsToAdd = Math.floor(profit / delta)
    return baseLot + (unitsToAdd * baseLot)
  }
  
  private calculateOptimalF(
    config: MoneyManagementConfig,
    stopLossPips: number,
    pipValue: number
  ): number {
    if (this.tradeHistory.length < 10) {
      return config.fixedLot || 0.01
    }
    
    const maxLoss = Math.min(...this.tradeHistory.map(t => t.profit))
    
    if (maxLoss >= 0) {
      return config.fixedLot || 0.01
    }
    
    const optimalF = this.findOptimalF()
    const riskAmount = this.currentBalance * optimalF
    
    return riskAmount / (stopLossPips * pipValue)
  }
  
  private findOptimalF(): number {
    const recentTrades = this.tradeHistory.slice(-30)
    
    if (recentTrades.length === 0) {
      return 0.02
    }
    
    const winRate = recentTrades.filter(t => t.result === 'win').length / recentTrades.length
    const avgWin = this.calculateAverage(recentTrades.filter(t => t.result === 'win').map(t => t.profit))
    const avgLoss = Math.abs(this.calculateAverage(recentTrades.filter(t => t.result === 'loss').map(t => t.profit)))
    
    if (avgLoss === 0) {
      return 0.02
    }
    
    const optimalF = (winRate * avgWin - (1 - winRate) * avgLoss) / avgLoss
    
    return Math.max(0.01, Math.min(0.25, optimalF))
  }
  
  private calculateAverage(values: number[]): number {
    if (values.length === 0) return 0
    return values.reduce((sum, v) => sum + v, 0) / values.length
  }
  
  private normalizeLotSize(lotSize: number, symbol: string): number {
    let roundedLot = Math.round(lotSize * 100) / 100
    
    if (roundedLot < 0.01) {
      roundedLot = 0.01
    }
    
    return roundedLot
  }
  
  getStatistics() {
    const totalTrades = this.tradeHistory.length
    const winningTrades = this.tradeHistory.filter(t => t.result === 'win').length
    const losingTrades = this.tradeHistory.filter(t => t.result === 'loss').length
    
    const totalProfit = this.tradeHistory.reduce((sum, t) => sum + t.profit, 0)
    const grossProfit = this.tradeHistory
      .filter(t => t.result === 'win')
      .reduce((sum, t) => sum + t.profit, 0)
    const grossLoss = Math.abs(
      this.tradeHistory
        .filter(t => t.result === 'loss')
        .reduce((sum, t) => sum + t.profit, 0)
    )
    
    return {
      totalTrades,
      winningTrades,
      losingTrades,
      winRate: totalTrades > 0 ? winningTrades / totalTrades : 0,
      consecutiveWins: this.consecutiveWins,
      consecutiveLosses: this.consecutiveLosses,
      totalProfit,
      grossProfit,
      grossLoss,
      profitFactor: grossLoss > 0 ? grossProfit / grossLoss : 0,
      currentBalance: this.currentBalance,
      highWaterMark: this.highWaterMark,
      drawdown: this.highWaterMark - this.currentBalance,
      drawdownPercent: ((this.highWaterMark - this.currentBalance) / this.highWaterMark) * 100
    }
  }
  
  reset(initialBalance?: number): void {
    if (initialBalance !== undefined) {
      this.baseBalance = initialBalance
      this.currentBalance = initialBalance
      this.highWaterMark = initialBalance
    }
    this.tradeHistory = []
    this.consecutiveWins = 0
    this.consecutiveLosses = 0
  }
}

export const moneyManagement = new MoneyManagementSystem()
