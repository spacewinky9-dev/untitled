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
  costs?: TradeCosts
  reason?: string
}

export interface TradeCosts {
  spread: number
  slippage: number
  commission: number
}

export interface BacktestConfig {
  startDate: Date
  endDate: Date
  initialBalance: number
  leverage: number
  spread: number
  commission: number
  slippage: number
}

export interface BacktestResult {
  config: BacktestConfig
  trades: Trade[]
  equityCurve: EquityPoint[]
  metrics: PerformanceMetrics
  statistics: TradeStatistics
}

export interface EquityPoint {
  time: number
  balance: number
  equity: number
  drawdown: number
  drawdownPercent: number
}

export interface PerformanceMetrics {
  totalTrades: number
  winningTrades: number
  losingTrades: number
  winRate: number
  totalProfit: number
  totalReturn: number
  grossProfit: number
  grossLoss: number
  profitFactor: number
  avgWin: number
  avgLoss: number
  maxDrawdown: number
  maxDrawdownPercent: number
  sharpeRatio: number
  sortinoRatio: number
  expectancy: number
  recoveryFactor: number
  maxConsecutiveWins: number
  maxConsecutiveLosses: number
}

export interface TradeStatistics {
  longestWinStreak: number
  longestLossStreak: number
  avgTradeDuration: number
  bestTrade: number
  worstTrade: number
  avgWinDuration: number
  avgLossDuration: number
}
