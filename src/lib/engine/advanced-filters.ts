/**
 * Spread and Volatility Filters
 * Advanced filters for optimal trade entry conditions
 */

import { OHLCV } from '@/types/market-data'

/**
 * Spread Filter - blocks trades when spread is too wide
 */
export class SpreadFilter {
  private maxSpreadPips: number
  private pipValue: number

  constructor(maxSpreadPips: number = 3, pipValue: number = 0.0001) {
    this.maxSpreadPips = maxSpreadPips
    this.pipValue = pipValue
  }

  /**
   * Check if spread is acceptable for trading
   */
  isSpreadAcceptable(bid: number, ask: number): boolean {
    const spreadPips = (ask - bid) / this.pipValue
    return spreadPips <= this.maxSpreadPips
  }

  /**
   * Calculate current spread in pips
   */
  calculateSpreadPips(bid: number, ask: number): number {
    return (ask - bid) / this.pipValue
  }

  /**
   * Estimate spread from OHLC data (high-low as proxy)
   */
  estimateSpreadFromBar(bar: OHLCV): number {
    const range = bar.high - bar.low
    const avgPrice = (bar.high + bar.low) / 2
    const estimatedSpread = range * 0.1 // Assume 10% of range is typical spread
    return (estimatedSpread / avgPrice) / this.pipValue
  }

  setMaxSpread(pips: number): void {
    this.maxSpreadPips = pips
  }
}

/**
 * Volatility Filter - measures market volatility for trade decisions
 */
export class VolatilityFilter {
  private atrPeriod: number
  private minVolatilityATR: number
  private maxVolatilityATR: number

  constructor(
    atrPeriod: number = 14,
    minVolatilityATR: number = 0.0010,
    maxVolatilityATR: number = 0.0100
  ) {
    this.atrPeriod = atrPeriod
    this.minVolatilityATR = minVolatilityATR
    this.maxVolatilityATR = maxVolatilityATR
  }

  /**
   * Calculate Average True Range (ATR) for volatility measurement
   */
  calculateATR(bars: OHLCV[], period: number = this.atrPeriod): number {
    if (bars.length < period + 1) {
      return 0
    }

    const trueRanges: number[] = []

    for (let i = 1; i < bars.length; i++) {
      const high = bars[i].high
      const low = bars[i].low
      const prevClose = bars[i - 1].close

      const tr = Math.max(
        high - low,
        Math.abs(high - prevClose),
        Math.abs(low - prevClose)
      )

      trueRanges.push(tr)
    }

    // Calculate average of last 'period' true ranges
    const recentTRs = trueRanges.slice(-period)
    const atr = recentTRs.reduce((sum, tr) => sum + tr, 0) / recentTRs.length

    return atr
  }

  /**
   * Check if volatility is within acceptable range
   */
  isVolatilityAcceptable(bars: OHLCV[]): boolean {
    const atr = this.calculateATR(bars)
    return atr >= this.minVolatilityATR && atr <= this.maxVolatilityATR
  }

  /**
   * Get volatility level classification
   */
  getVolatilityLevel(bars: OHLCV[]): 'very_low' | 'low' | 'normal' | 'high' | 'very_high' {
    const atr = this.calculateATR(bars)

    if (atr < this.minVolatilityATR * 0.5) return 'very_low'
    if (atr < this.minVolatilityATR) return 'low'
    if (atr <= this.maxVolatilityATR) return 'normal'
    if (atr <= this.maxVolatilityATR * 1.5) return 'high'
    return 'very_high'
  }

  /**
   * Calculate volatility ratio compared to average
   */
  getVolatilityRatio(bars: OHLCV[], lookback: number = 50): number {
    if (bars.length < lookback + this.atrPeriod) {
      return 1.0
    }

    const currentATR = this.calculateATR(bars)
    const historicalBars = bars.slice(-lookback)
    
    // Calculate average ATR over lookback period
    let atrSum = 0
    let count = 0
    
    for (let i = this.atrPeriod; i < historicalBars.length; i++) {
      const windowBars = historicalBars.slice(i - this.atrPeriod, i + 1)
      atrSum += this.calculateATR(windowBars)
      count++
    }

    const avgATR = count > 0 ? atrSum / count : currentATR
    return avgATR > 0 ? currentATR / avgATR : 1.0
  }

  setVolatilityRange(min: number, max: number): void {
    this.minVolatilityATR = min
    this.maxVolatilityATR = max
  }
}

/**
 * Time-based Trading Filter
 * Allows trading only during specified hours
 */
export class TimeFilter {
  private allowedHours: number[] // UTC hours when trading is allowed
  private allowedDays: number[]  // 0=Sunday, 6=Saturday

  constructor(allowedHours: number[] = [], allowedDays: number[] = [1, 2, 3, 4, 5]) {
    this.allowedHours = allowedHours
    this.allowedDays = allowedDays
  }

  /**
   * Check if trading is allowed at this time
   */
  isTradingAllowed(timestamp: number): boolean {
    const date = new Date(timestamp)
    const hour = date.getUTCHours()
    const day = date.getUTCDay()

    // Check day filter
    if (this.allowedDays.length > 0 && !this.allowedDays.includes(day)) {
      return false
    }

    // Check hour filter
    if (this.allowedHours.length > 0 && !this.allowedHours.includes(hour)) {
      return false
    }

    return true
  }

  /**
   * Check if within trading window
   */
  isWithinTradingHours(timestamp: number, startHour: number, endHour: number): boolean {
    const hour = new Date(timestamp).getUTCHours()
    
    if (startHour <= endHour) {
      return hour >= startHour && hour < endHour
    } else {
      // Handles overnight windows (e.g., 22:00 to 02:00)
      return hour >= startHour || hour < endHour
    }
  }

  /**
   * Check if it's a weekend
   */
  isWeekend(timestamp: number): boolean {
    const day = new Date(timestamp).getUTCDay()
    return day === 0 || day === 6 // Sunday or Saturday
  }

  /**
   * Set allowed trading hours
   */
  setAllowedHours(hours: number[]): void {
    this.allowedHours = hours
  }

  /**
   * Set allowed trading days
   */
  setAllowedDays(days: number[]): void {
    this.allowedDays = days
  }
}

/**
 * Drawdown Control Filter
 * Stops trading when drawdown exceeds threshold
 */
export class DrawdownFilter {
  private maxDrawdownPercent: number
  private currentDrawdown: number = 0
  private peakBalance: number = 0
  private tradingEnabled: boolean = true

  constructor(maxDrawdownPercent: number = 20) {
    this.maxDrawdownPercent = maxDrawdownPercent
  }

  /**
   * Update balance and check drawdown
   */
  updateBalance(currentBalance: number, initialBalance: number): boolean {
    // Update peak if new high
    if (currentBalance > this.peakBalance) {
      this.peakBalance = currentBalance
    }

    // Calculate current drawdown
    if (this.peakBalance > 0) {
      this.currentDrawdown = ((this.peakBalance - currentBalance) / this.peakBalance) * 100
    }

    // Check if drawdown limit exceeded
    if (this.currentDrawdown >= this.maxDrawdownPercent) {
      this.tradingEnabled = false
      return false
    }

    this.tradingEnabled = true
    return true
  }

  /**
   * Check if trading is allowed based on drawdown
   */
  isTradingAllowed(): boolean {
    return this.tradingEnabled
  }

  /**
   * Get current drawdown percentage
   */
  getCurrentDrawdown(): number {
    return this.currentDrawdown
  }

  /**
   * Reset drawdown tracking
   */
  reset(initialBalance: number): void {
    this.peakBalance = initialBalance
    this.currentDrawdown = 0
    this.tradingEnabled = true
  }

  /**
   * Set maximum allowed drawdown
   */
  setMaxDrawdown(percent: number): void {
    this.maxDrawdownPercent = percent
  }
}

/**
 * Combined filter manager for advanced trade filtering
 */
export class AdvancedFilterManager {
  private spreadFilter: SpreadFilter
  private volatilityFilter: VolatilityFilter
  private timeFilter: TimeFilter
  private drawdownFilter: DrawdownFilter

  constructor() {
    this.spreadFilter = new SpreadFilter()
    this.volatilityFilter = new VolatilityFilter()
    this.timeFilter = new TimeFilter()
    this.drawdownFilter = new DrawdownFilter()
  }

  /**
   * Check all filters before allowing a trade
   */
  shouldAllowTrade(
    timestamp: number,
    bars: OHLCV[],
    currentBalance: number,
    initialBalance: number,
    bid?: number,
    ask?: number
  ): { allowed: boolean; reasons: string[] } {
    const reasons: string[] = []

    // Time filter
    if (!this.timeFilter.isTradingAllowed(timestamp)) {
      reasons.push('Outside trading hours')
    }

    // Volatility filter
    if (!this.volatilityFilter.isVolatilityAcceptable(bars)) {
      const level = this.volatilityFilter.getVolatilityLevel(bars)
      reasons.push(`Volatility ${level}`)
    }

    // Spread filter
    if (bid !== undefined && ask !== undefined) {
      if (!this.spreadFilter.isSpreadAcceptable(bid, ask)) {
        const spread = this.spreadFilter.calculateSpreadPips(bid, ask)
        reasons.push(`Spread too wide: ${spread.toFixed(1)} pips`)
      }
    }

    // Drawdown filter
    this.drawdownFilter.updateBalance(currentBalance, initialBalance)
    if (!this.drawdownFilter.isTradingAllowed()) {
      const dd = this.drawdownFilter.getCurrentDrawdown()
      reasons.push(`Max drawdown exceeded: ${dd.toFixed(1)}%`)
    }

    return {
      allowed: reasons.length === 0,
      reasons
    }
  }

  getSpreadFilter(): SpreadFilter {
    return this.spreadFilter
  }

  getVolatilityFilter(): VolatilityFilter {
    return this.volatilityFilter
  }

  getTimeFilter(): TimeFilter {
    return this.timeFilter
  }

  getDrawdownFilter(): DrawdownFilter {
    return this.drawdownFilter
  }
}
