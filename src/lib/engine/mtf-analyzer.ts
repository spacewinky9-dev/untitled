import { OHLCV } from '@/types/market-data'
import { getIndicator } from '@/lib/indicators'

export type Timeframe = 'M1' | 'M5' | 'M15' | 'M30' | 'H1' | 'H4' | 'D1' | 'W1' | 'MN'

export interface MTFIndicatorConfig {
  timeframe: Timeframe
  indicator: string
  parameters: Record<string, any>
}

export interface MTFData {
  timeframe: Timeframe
  bars: OHLCV[]
  indicators: Map<string, any>
}

export class MultiTimeframeAnalyzer {
  private dataCache: Map<Timeframe, OHLCV[]> = new Map()
  private indicatorCache: Map<string, any> = new Map()

  getTimeframeMultiplier(from: Timeframe, to: Timeframe): number {
    const minutes: Record<Timeframe, number> = {
      'M1': 1,
      'M5': 5,
      'M15': 15,
      'M30': 30,
      'H1': 60,
      'H4': 240,
      'D1': 1440,
      'W1': 10080,
      'MN': 43200
    }
    
    return minutes[to] / minutes[from]
  }

  convertTimeframe(baseBars: OHLCV[], baseTimeframe: Timeframe, targetTimeframe: Timeframe): OHLCV[] {
    const multiplier = this.getTimeframeMultiplier(baseTimeframe, targetTimeframe)
    
    if (multiplier === 1) {
      return baseBars
    }
    
    if (multiplier < 1) {
      throw new Error(`Cannot convert to lower timeframe: ${baseTimeframe} to ${targetTimeframe}`)
    }

    const converted: OHLCV[] = []
    const barsPerPeriod = Math.floor(multiplier)
    
    for (let i = 0; i < baseBars.length; i += barsPerPeriod) {
      const periodBars = baseBars.slice(i, Math.min(i + barsPerPeriod, baseBars.length))
      
      if (periodBars.length === 0) continue
      
      const aggregatedBar: OHLCV = {
        time: periodBars[0].time,
        open: periodBars[0].open,
        high: Math.max(...periodBars.map(b => b.high)),
        low: Math.min(...periodBars.map(b => b.low)),
        close: periodBars[periodBars.length - 1].close,
        volume: periodBars.reduce((sum, b) => sum + b.volume, 0)
      }
      
      converted.push(aggregatedBar)
    }
    
    return converted
  }

  getMTFData(baseBars: OHLCV[], baseTimeframe: Timeframe, targetTimeframe: Timeframe): OHLCV[] {
    const cacheKey = `${baseTimeframe}-${targetTimeframe}`
    
    if (this.dataCache.has(targetTimeframe)) {
      const cached = this.dataCache.get(targetTimeframe)
      if (cached && cached.length > 0) return cached
    }

    const converted = this.convertTimeframe(baseBars, baseTimeframe, targetTimeframe)
    this.dataCache.set(targetTimeframe, converted)
    
    return converted
  }

  calculateMTFIndicator(
    baseBars: OHLCV[],
    baseTimeframe: Timeframe,
    config: MTFIndicatorConfig
  ): any {
    const cacheKey = `${config.timeframe}-${config.indicator}-${JSON.stringify(config.parameters)}`
    
    if (this.indicatorCache.has(cacheKey)) {
      return this.indicatorCache.get(cacheKey)
    }

    const mtfBars = this.getMTFData(baseBars, baseTimeframe, config.timeframe)
    
    if (mtfBars.length === 0) {
      return null
    }

    const indicatorFn = getIndicator(config.indicator)
    if (!indicatorFn) {
      console.warn(`Indicator ${config.indicator} not found`)
      return null
    }

    const result = indicatorFn.calculate(mtfBars, config.parameters)
    this.indicatorCache.set(cacheKey, result)
    
    return result
  }

  getTrendDirection(bars: OHLCV[], period: number = 20): 'up' | 'down' | 'sideways' {
    if (bars.length < period) {
      return 'sideways'
    }

    const recentBars = bars.slice(-period)
    const closes = recentBars.map(b => b.close)
    
    const sma = closes.reduce((sum, c) => sum + c, 0) / closes.length
    const currentPrice = closes[closes.length - 1]
    const firstPrice = closes[0]
    
    const priceChange = (currentPrice - firstPrice) / firstPrice
    const aboveMA = currentPrice > sma
    
    const higherHighs = recentBars.slice(-10).every((bar, i, arr) => {
      if (i === 0) return true
      return bar.high >= arr[i - 1].high * 0.995
    })
    
    const lowerLows = recentBars.slice(-10).every((bar, i, arr) => {
      if (i === 0) return true
      return bar.low <= arr[i - 1].low * 1.005
    })

    if (priceChange > 0.01 && aboveMA && higherHighs) {
      return 'up'
    } else if (priceChange < -0.01 && !aboveMA && lowerLows) {
      return 'down'
    } else {
      return 'sideways'
    }
  }

  checkMTFAlignment(
    baseBars: OHLCV[],
    baseTimeframe: Timeframe,
    timeframes: Timeframe[],
    direction: 'up' | 'down'
  ): boolean {
    for (const tf of timeframes) {
      const mtfBars = this.getMTFData(baseBars, baseTimeframe, tf)
      const trend = this.getTrendDirection(mtfBars)
      
      if (trend !== direction && trend !== 'sideways') {
        return false
      }
    }
    
    return true
  }

  getMTFMAAlignment(
    baseBars: OHLCV[],
    baseTimeframe: Timeframe,
    timeframes: Timeframe[],
    period: number = 20
  ): { aligned: boolean, direction: 'up' | 'down' | 'mixed' } {
    const mas: { timeframe: Timeframe, value: number, price: number }[] = []
    
    for (const tf of timeframes) {
      const mtfBars = this.getMTFData(baseBars, baseTimeframe, tf)
      if (mtfBars.length < period) continue
      
      const closes = mtfBars.slice(-period).map(b => b.close)
      const ma = closes.reduce((sum, c) => sum + c, 0) / closes.length
      const currentPrice = mtfBars[mtfBars.length - 1].close
      
      mas.push({ timeframe: tf, value: ma, price: currentPrice })
    }
    
    if (mas.length === 0) {
      return { aligned: false, direction: 'mixed' }
    }

    const allAbove = mas.every(m => m.price > m.value)
    const allBelow = mas.every(m => m.price < m.value)
    
    if (allAbove) {
      return { aligned: true, direction: 'up' }
    } else if (allBelow) {
      return { aligned: true, direction: 'down' }
    } else {
      return { aligned: false, direction: 'mixed' }
    }
  }

  getHTFTrend(
    baseBars: OHLCV[],
    baseTimeframe: Timeframe,
    higherTimeframe: Timeframe
  ): { trend: 'up' | 'down' | 'sideways', strength: number } {
    const htfBars = this.getMTFData(baseBars, baseTimeframe, higherTimeframe)
    const trend = this.getTrendDirection(htfBars, 20)
    
    if (htfBars.length < 20) {
      return { trend: 'sideways', strength: 0 }
    }

    const recentBars = htfBars.slice(-20)
    const closes = recentBars.map(b => b.close)
    const priceChange = (closes[closes.length - 1] - closes[0]) / closes[0]
    const strength = Math.min(1, Math.abs(priceChange) * 10)
    
    return { trend, strength }
  }

  checkMTFCondition(
    baseBars: OHLCV[],
    baseTimeframe: Timeframe,
    targetTimeframe: Timeframe,
    conditionType: string
  ): boolean {
    const mtfBars = this.getMTFData(baseBars, baseTimeframe, targetTimeframe)
    
    if (mtfBars.length < 2) return false

    switch (conditionType) {
      case 'trend_up':
        return this.getTrendDirection(mtfBars) === 'up'
      
      case 'trend_down':
        return this.getTrendDirection(mtfBars) === 'down'
      
      case 'trend_sideways':
        return this.getTrendDirection(mtfBars) === 'sideways'
      
      case 'bullish_candle': {
        const lastBar = mtfBars[mtfBars.length - 1]
        return lastBar.close > lastBar.open
      }
      
      case 'bearish_candle': {
        const lastBar = mtfBars[mtfBars.length - 1]
        return lastBar.close < lastBar.open
      }
      
      case 'higher_high': {
        if (mtfBars.length < 3) return false
        const current = mtfBars[mtfBars.length - 1]
        const prev = mtfBars[mtfBars.length - 2]
        return current.high > prev.high
      }
      
      case 'lower_low': {
        if (mtfBars.length < 3) return false
        const current = mtfBars[mtfBars.length - 1]
        const prev = mtfBars[mtfBars.length - 2]
        return current.low < prev.low
      }
      
      default:
        return false
    }
  }

  clearCache(): void {
    this.dataCache.clear()
    this.indicatorCache.clear()
  }
}
