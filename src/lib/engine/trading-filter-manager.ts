import { OHLCV } from '@/types/market-data'

export interface TimeFilter {
  enabled: boolean
  startHour: number
  startMinute: number
  endHour: number
  endMinute: number
  allowedDays: number[]
  timezone: string
}

export interface SpreadFilter {
  enabled: boolean
  maxSpreadPips: number
}

export interface VolatilityFilter {
  enabled: boolean
  minATR: number
  maxATR: number
}

export interface TrendFilter {
  enabled: boolean
  requireTrend: 'up' | 'down' | 'any'
  minADX: number
}

export interface MaxTradesFilter {
  enabled: boolean
  maxConcurrentTrades: number
  maxTradesPerDay: number
  maxTradesPerWeek: number
}

export interface DrawdownFilter {
  enabled: boolean
  maxDrawdownPercent: number
  maxDailyLossPercent: number
}

export interface NewsFilter {
  enabled: boolean
  stopBeforeMinutes: number
  stopAfterMinutes: number
  highImpactOnly: boolean
}

export class TradingFilterManager {
  private timeFilter: TimeFilter = {
    enabled: false,
    startHour: 0,
    startMinute: 0,
    endHour: 23,
    endMinute: 59,
    allowedDays: [1, 2, 3, 4, 5],
    timezone: 'UTC'
  }

  private spreadFilter: SpreadFilter = {
    enabled: false,
    maxSpreadPips: 2.0
  }

  private volatilityFilter: VolatilityFilter = {
    enabled: false,
    minATR: 0,
    maxATR: Number.MAX_SAFE_INTEGER
  }

  private trendFilter: TrendFilter = {
    enabled: false,
    requireTrend: 'any',
    minADX: 25
  }

  private maxTradesFilter: MaxTradesFilter = {
    enabled: false,
    maxConcurrentTrades: 5,
    maxTradesPerDay: 10,
    maxTradesPerWeek: 50
  }

  private drawdownFilter: DrawdownFilter = {
    enabled: false,
    maxDrawdownPercent: 20,
    maxDailyLossPercent: 5
  }

  private newsFilter: NewsFilter = {
    enabled: false,
    stopBeforeMinutes: 30,
    stopAfterMinutes: 30,
    highImpactOnly: true
  }

  private tradesCountToday: number = 0
  private tradesCountThisWeek: number = 0
  private lastResetDay: number = 0
  private lastResetWeek: number = 0

  setTimeFilter(filter: Partial<TimeFilter>): void {
    this.timeFilter = { ...this.timeFilter, ...filter }
  }

  setSpreadFilter(filter: Partial<SpreadFilter>): void {
    this.spreadFilter = { ...this.spreadFilter, ...filter }
  }

  setVolatilityFilter(filter: Partial<VolatilityFilter>): void {
    this.volatilityFilter = { ...this.volatilityFilter, ...filter }
  }

  setTrendFilter(filter: Partial<TrendFilter>): void {
    this.trendFilter = { ...this.trendFilter, ...filter }
  }

  setMaxTradesFilter(filter: Partial<MaxTradesFilter>): void {
    this.maxTradesFilter = { ...this.maxTradesFilter, ...filter }
  }

  setDrawdownFilter(filter: Partial<DrawdownFilter>): void {
    this.drawdownFilter = { ...this.drawdownFilter, ...filter }
  }

  setNewsFilter(filter: Partial<NewsFilter>): void {
    this.newsFilter = { ...this.newsFilter, ...filter }
  }

  checkTimeFilter(timestamp: number): { passed: boolean; reason?: string } {
    if (!this.timeFilter.enabled) {
      return { passed: true }
    }

    const date = new Date(timestamp)
    const dayOfWeek = date.getDay()
    
    if (!this.timeFilter.allowedDays.includes(dayOfWeek)) {
      return { passed: false, reason: 'Trading not allowed on this day of week' }
    }

    const hour = date.getHours()
    const minute = date.getMinutes()
    const currentMinutes = hour * 60 + minute
    
    const startMinutes = this.timeFilter.startHour * 60 + this.timeFilter.startMinute
    const endMinutes = this.timeFilter.endHour * 60 + this.timeFilter.endMinute

    if (startMinutes <= endMinutes) {
      if (currentMinutes < startMinutes || currentMinutes > endMinutes) {
        return { passed: false, reason: 'Outside allowed trading hours' }
      }
    } else {
      if (currentMinutes < startMinutes && currentMinutes > endMinutes) {
        return { passed: false, reason: 'Outside allowed trading hours' }
      }
    }

    return { passed: true }
  }

  checkSpreadFilter(currentSpread: number, symbol: string): { passed: boolean; reason?: string } {
    if (!this.spreadFilter.enabled) {
      return { passed: true }
    }

    const pipValue = symbol.includes('JPY') ? 0.01 : 0.0001
    const spreadPips = currentSpread / pipValue

    if (spreadPips > this.spreadFilter.maxSpreadPips) {
      return { passed: false, reason: `Spread too high: ${spreadPips.toFixed(1)} pips` }
    }

    return { passed: true }
  }

  checkVolatilityFilter(atr: number): { passed: boolean; reason?: string } {
    if (!this.volatilityFilter.enabled) {
      return { passed: true }
    }

    if (atr < this.volatilityFilter.minATR) {
      return { passed: false, reason: `Volatility too low: ATR ${atr.toFixed(4)}` }
    }

    if (atr > this.volatilityFilter.maxATR) {
      return { passed: false, reason: `Volatility too high: ATR ${atr.toFixed(4)}` }
    }

    return { passed: true }
  }

  checkTrendFilter(trend: 'up' | 'down' | 'sideways', adx: number): { passed: boolean; reason?: string } {
    if (!this.trendFilter.enabled) {
      return { passed: true }
    }

    if (adx < this.trendFilter.minADX) {
      return { passed: false, reason: `Trend too weak: ADX ${adx.toFixed(1)}` }
    }

    if (this.trendFilter.requireTrend !== 'any' && trend !== this.trendFilter.requireTrend) {
      return { passed: false, reason: `Wrong trend direction: ${trend}` }
    }

    return { passed: true }
  }

  checkMaxTradesFilter(currentOpenTrades: number, timestamp: number): { passed: boolean; reason?: string } {
    if (!this.maxTradesFilter.enabled) {
      return { passed: true }
    }

    this.updateTradeCounts(timestamp)

    if (currentOpenTrades >= this.maxTradesFilter.maxConcurrentTrades) {
      return { passed: false, reason: `Max concurrent trades reached: ${currentOpenTrades}` }
    }

    if (this.tradesCountToday >= this.maxTradesFilter.maxTradesPerDay) {
      return { passed: false, reason: `Max daily trades reached: ${this.tradesCountToday}` }
    }

    if (this.tradesCountThisWeek >= this.maxTradesFilter.maxTradesPerWeek) {
      return { passed: false, reason: `Max weekly trades reached: ${this.tradesCountThisWeek}` }
    }

    return { passed: true }
  }

  checkDrawdownFilter(currentDrawdown: number, dailyLoss: number): { passed: boolean; reason?: string } {
    if (!this.drawdownFilter.enabled) {
      return { passed: true }
    }

    if (currentDrawdown >= this.drawdownFilter.maxDrawdownPercent) {
      return { passed: false, reason: `Max drawdown exceeded: ${currentDrawdown.toFixed(1)}%` }
    }

    if (dailyLoss >= this.drawdownFilter.maxDailyLossPercent) {
      return { passed: false, reason: `Max daily loss exceeded: ${dailyLoss.toFixed(1)}%` }
    }

    return { passed: true }
  }

  checkNewsFilter(timestamp: number, nextNewsTime?: number): { passed: boolean; reason?: string } {
    if (!this.newsFilter.enabled || !nextNewsTime) {
      return { passed: true }
    }

    const msUntilNews = nextNewsTime - timestamp
    const minutesUntilNews = msUntilNews / (60 * 1000)

    if (minutesUntilNews > 0 && minutesUntilNews <= this.newsFilter.stopBeforeMinutes) {
      return { passed: false, reason: `News event in ${Math.round(minutesUntilNews)} minutes` }
    }

    const msSinceNews = timestamp - nextNewsTime
    const minutesSinceNews = msSinceNews / (60 * 1000)

    if (minutesSinceNews >= 0 && minutesSinceNews <= this.newsFilter.stopAfterMinutes) {
      return { passed: false, reason: `News event ${Math.round(minutesSinceNews)} minutes ago` }
    }

    return { passed: true }
  }

  checkAllFilters(context: {
    timestamp: number
    spread?: number
    symbol?: string
    atr?: number
    trend?: 'up' | 'down' | 'sideways'
    adx?: number
    currentOpenTrades?: number
    currentDrawdown?: number
    dailyLoss?: number
    nextNewsTime?: number
  }): { passed: boolean; reasons: string[] } {
    const results: { passed: boolean; reason?: string }[] = []

    results.push(this.checkTimeFilter(context.timestamp))

    if (context.spread !== undefined && context.symbol) {
      results.push(this.checkSpreadFilter(context.spread, context.symbol))
    }

    if (context.atr !== undefined) {
      results.push(this.checkVolatilityFilter(context.atr))
    }

    if (context.trend && context.adx !== undefined) {
      results.push(this.checkTrendFilter(context.trend, context.adx))
    }

    if (context.currentOpenTrades !== undefined) {
      results.push(this.checkMaxTradesFilter(context.currentOpenTrades, context.timestamp))
    }

    if (context.currentDrawdown !== undefined && context.dailyLoss !== undefined) {
      results.push(this.checkDrawdownFilter(context.currentDrawdown, context.dailyLoss))
    }

    if (context.nextNewsTime) {
      results.push(this.checkNewsFilter(context.timestamp, context.nextNewsTime))
    }

    const failedResults = results.filter(r => !r.passed)
    
    return {
      passed: failedResults.length === 0,
      reasons: failedResults.map(r => r.reason || 'Unknown reason').filter(Boolean)
    }
  }

  recordTrade(timestamp: number): void {
    this.updateTradeCounts(timestamp)
    this.tradesCountToday++
    this.tradesCountThisWeek++
  }

  private updateTradeCounts(timestamp: number): void {
    const date = new Date(timestamp)
    const currentDay = date.getDate()
    const currentWeek = this.getWeekNumber(date)

    if (currentDay !== this.lastResetDay) {
      this.tradesCountToday = 0
      this.lastResetDay = currentDay
    }

    if (currentWeek !== this.lastResetWeek) {
      this.tradesCountThisWeek = 0
      this.lastResetWeek = currentWeek
    }
  }

  private getWeekNumber(date: Date): number {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
    const dayNum = d.getUTCDay() || 7
    d.setUTCDate(d.getUTCDate() + 4 - dayNum)
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
  }

  getFilterStatus(): Record<string, boolean> {
    return {
      timeFilter: this.timeFilter.enabled,
      spreadFilter: this.spreadFilter.enabled,
      volatilityFilter: this.volatilityFilter.enabled,
      trendFilter: this.trendFilter.enabled,
      maxTradesFilter: this.maxTradesFilter.enabled,
      drawdownFilter: this.drawdownFilter.enabled,
      newsFilter: this.newsFilter.enabled
    }
  }

  reset(): void {
    this.tradesCountToday = 0
    this.tradesCountThisWeek = 0
    this.lastResetDay = 0
    this.lastResetWeek = 0
  }
}

export const tradingFilterManager = new TradingFilterManager()
