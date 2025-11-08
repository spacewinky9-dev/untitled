import { Strategy } from '@/types/strategy'
import { OHLCV } from '@/types/market-data'
import { BacktestConfig, BacktestResult, EquityPoint, PerformanceMetrics } from '@/types/backtest'
import { StrategyExecutor, Trade } from './strategy-executor'

export class BacktestEngine {
  async run(strategy: Strategy, data: OHLCV[], config: BacktestConfig): Promise<BacktestResult> {
    const executor = new StrategyExecutor(strategy)
    const executionResult = await executor.execute(data, config.initialBalance)

    const adjustedTrades = this.applyTradingCosts(executionResult.trades, config)

    const equityCurve = this.calculateEquityCurve(adjustedTrades, config.initialBalance, data)

    const metrics = this.calculateMetrics(adjustedTrades, equityCurve, config.initialBalance)

    const statistics = this.calculateStatistics(adjustedTrades)

    return {
      config,
      trades: adjustedTrades,
      equityCurve,
      metrics,
      statistics
    }
  }

  private calculateStatistics(trades: Trade[]): any {
    const durations = trades
      .filter(t => t.exitTime && t.entryTime)
      .map(t => (t.exitTime! - t.entryTime) / 1000 / 60)

    const winningTrades = trades.filter(t => (t.profit || 0) > 0)
    const losingTrades = trades.filter(t => (t.profit || 0) < 0)

    let longestWinStreak = 0
    let longestLossStreak = 0
    let currentWinStreak = 0
    let currentLossStreak = 0

    for (const trade of trades) {
      if ((trade.profit || 0) > 0) {
        currentWinStreak++
        currentLossStreak = 0
        longestWinStreak = Math.max(longestWinStreak, currentWinStreak)
      } else {
        currentLossStreak++
        currentWinStreak = 0
        longestLossStreak = Math.max(longestLossStreak, currentLossStreak)
      }
    }

    return {
      longestWinStreak,
      longestLossStreak,
      avgTradeDuration: durations.length > 0 ? durations.reduce((a, b) => a + b, 0) / durations.length : 0,
      bestTrade: Math.max(...trades.map(t => t.profit || 0), 0),
      worstTrade: Math.min(...trades.map(t => t.profit || 0), 0),
      avgWinDuration: 0,
      avgLossDuration: 0
    }
  }

  private applyTradingCosts(trades: Trade[], config: BacktestConfig): Trade[] {
    return trades.map(trade => {
      if (!trade.exitPrice) return trade

      const spreadCost = (config.spread / 10000) * trade.lots * 10
      const slippageCost = (config.slippage / 10000) * trade.lots * 10
      const commissionCost = config.commission * trade.lots * 2

      const adjustedProfit = (trade.profit || 0) - spreadCost - slippageCost - commissionCost

      return {
        ...trade,
        profit: adjustedProfit
      }
    })
  }

  private calculateEquityCurve(trades: Trade[], initialBalance: number, data: OHLCV[]): EquityPoint[] {
    const curve: EquityPoint[] = []
    let balance = initialBalance
    let peak = initialBalance
    let tradeIndex = 0

    for (const bar of data) {
      while (tradeIndex < trades.length && trades[tradeIndex].exitTime === bar.time) {
        balance += trades[tradeIndex].profit || 0
        tradeIndex++
      }

      if (balance > peak) {
        peak = balance
      }

      const drawdown = peak - balance
      const drawdownPercent = (drawdown / peak) * 100

      curve.push({
        time: bar.time,
        balance,
        equity: balance,
        drawdown,
        drawdownPercent
      })
    }

    return curve
  }

  private calculateMetrics(trades: Trade[], equityCurve: EquityPoint[], initialBalance: number): PerformanceMetrics {
    const totalTrades = trades.length
    const winningTrades = trades.filter(t => (t.profit || 0) > 0)
    const losingTrades = trades.filter(t => (t.profit || 0) < 0)

    const totalProfit = trades.reduce((sum, t) => sum + (t.profit || 0), 0)
    const totalReturn = ((totalProfit / initialBalance) * 100)
    
    const grossProfit = winningTrades.reduce((sum, t) => sum + (t.profit || 0), 0)
    const grossLoss = Math.abs(losingTrades.reduce((sum, t) => sum + (t.profit || 0), 0))

    const winRate = totalTrades > 0 ? (winningTrades.length / totalTrades) * 100 : 0
    const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : 0

    const avgWin = winningTrades.length > 0 ? grossProfit / winningTrades.length : 0
    const avgLoss = losingTrades.length > 0 ? grossLoss / losingTrades.length : 0

    const maxDrawdown = Math.max(...equityCurve.map(p => p.drawdown), 0)
    const maxDrawdownPercent = Math.max(...equityCurve.map(p => p.drawdownPercent), 0)

    const returns = this.calculateReturns(equityCurve)
    const sharpeRatio = this.calculateSharpeRatio(returns)
    const sortinoRatio = this.calculateSortinoRatio(returns)

    const expectancy = avgWin * (winRate / 100) - avgLoss * ((100 - winRate) / 100)
    const recoveryFactor = maxDrawdown > 0 ? totalProfit / maxDrawdown : 0

    let maxConsecutiveWins = 0
    let maxConsecutiveLosses = 0
    let currentWinStreak = 0
    let currentLossStreak = 0

    for (const trade of trades) {
      if ((trade.profit || 0) > 0) {
        currentWinStreak++
        currentLossStreak = 0
        maxConsecutiveWins = Math.max(maxConsecutiveWins, currentWinStreak)
      } else {
        currentLossStreak++
        currentWinStreak = 0
        maxConsecutiveLosses = Math.max(maxConsecutiveLosses, currentLossStreak)
      }
    }

    return {
      totalTrades,
      winningTrades: winningTrades.length,
      losingTrades: losingTrades.length,
      winRate,
      totalProfit,
      totalReturn,
      grossProfit,
      grossLoss,
      profitFactor,
      avgWin,
      avgLoss,
      maxDrawdown,
      maxDrawdownPercent,
      sharpeRatio,
      sortinoRatio,
      expectancy,
      recoveryFactor,
      maxConsecutiveWins,
      maxConsecutiveLosses
    }
  }

  private calculateReturns(equityCurve: EquityPoint[]): number[] {
    const returns: number[] = []
    for (let i = 1; i < equityCurve.length; i++) {
      const ret = (equityCurve[i].balance - equityCurve[i - 1].balance) / equityCurve[i - 1].balance
      returns.push(ret)
    }
    return returns
  }

  private calculateSharpeRatio(returns: number[]): number {
    if (returns.length === 0) return 0

    const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length
    const variance = returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length
    const stdDev = Math.sqrt(variance)

    return stdDev > 0 ? (avgReturn / stdDev) * Math.sqrt(252) : 0
  }

  private calculateSortinoRatio(returns: number[]): number {
    if (returns.length === 0) return 0

    const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length
    const negativeReturns = returns.filter(r => r < 0)

    if (negativeReturns.length === 0) return 0

    const downside = negativeReturns.reduce((sum, r) => sum + Math.pow(r, 2), 0) / negativeReturns.length
    const downsideDev = Math.sqrt(downside)

    return downsideDev > 0 ? (avgReturn / downsideDev) * Math.sqrt(252) : 0
  }
}
