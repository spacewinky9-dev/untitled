import { OHLCV, Timeframe } from '@/types/market-data'
import { INDICATOR_REGISTRY } from '@/lib/indicators'

export interface MultiTimeframeData {
  symbol: string
  timeframes: Map<Timeframe, OHLCV[]>
  currentIndex: Map<Timeframe, number>
}

export interface MTFIndicatorResult {
  timeframe: Timeframe
  indicator: string
  value: number | Record<string, any>
  timestamp: number
}

export class MultiTimeframeAnalyzer {
  private data: Map<string, MultiTimeframeData> = new Map()
  private cachedIndicators: Map<string, MTFIndicatorResult> = new Map()

  addSymbol(symbol: string): void {
    if (!this.data.has(symbol)) {
      this.data.set(symbol, {
        symbol,
        timeframes: new Map(),
        currentIndex: new Map()
      })
    }
  }

  setTimeframeData(symbol: string, timeframe: Timeframe, bars: OHLCV[]): void {
    this.addSymbol(symbol)
    const symbolData = this.data.get(symbol)!
    symbolData.timeframes.set(timeframe, bars)
    symbolData.currentIndex.set(timeframe, bars.length - 1)
  }

  getTimeframeData(symbol: string, timeframe: Timeframe): OHLCV[] | undefined {
    return this.data.get(symbol)?.timeframes.get(timeframe)
  }

  getCurrentBar(symbol: string, timeframe: Timeframe): OHLCV | undefined {
    const symbolData = this.data.get(symbol)
    if (!symbolData) return undefined

    const bars = symbolData.timeframes.get(timeframe)
    const index = symbolData.currentIndex.get(timeframe)
    
    if (!bars || index === undefined || index < 0 || index >= bars.length) {
      return undefined
    }

    return bars[index]
  }

  getPreviousBars(symbol: string, timeframe: Timeframe, count: number): OHLCV[] {
    const symbolData = this.data.get(symbol)
    if (!symbolData) return []

    const bars = symbolData.timeframes.get(timeframe)
    const currentIndex = symbolData.currentIndex.get(timeframe)
    
    if (!bars || currentIndex === undefined) return []

    const startIndex = Math.max(0, currentIndex - count + 1)
    return bars.slice(startIndex, currentIndex + 1)
  }

  calculateMTFIndicator(
    symbol: string,
    timeframe: Timeframe,
    indicator: string,
    parameters: Record<string, any>
  ): number | Record<string, any> | undefined {
    const cacheKey = `${symbol}-${timeframe}-${indicator}-${JSON.stringify(parameters)}`
    const cached = this.cachedIndicators.get(cacheKey)
    
    if (cached) {
      return cached.value
    }

    const bars = this.getTimeframeData(symbol, timeframe)
    if (!bars || bars.length === 0) return undefined

    try {
      const indicatorDef = INDICATOR_REGISTRY[indicator]
      if (!indicatorDef) {
        console.error(`Unknown indicator: ${indicator}`)
        return undefined
      }

      const result = indicatorDef.calculate(bars, parameters)
      
      if (Array.isArray(result)) {
        const lastValue = result[result.length - 1]
        const currentBar = this.getCurrentBar(symbol, timeframe)
        const mtfResult: MTFIndicatorResult = {
          timeframe,
          indicator,
          value: lastValue,
          timestamp: currentBar?.time || Date.now()
        }
        
        this.cachedIndicators.set(cacheKey, mtfResult)
        return lastValue
      } else {
        const currentBar = this.getCurrentBar(symbol, timeframe)
        const mtfResult: MTFIndicatorResult = {
          timeframe,
          indicator,
          value: result as any,
          timestamp: currentBar?.time || Date.now()
        }
        
        this.cachedIndicators.set(cacheKey, mtfResult)
        return result as any
      }
    } catch (error) {
      console.error(`Failed to calculate MTF indicator: ${indicator}`, error)
      return undefined
    }
  }

  detectMTFTrend(
    symbol: string,
    timeframe: Timeframe,
    method: 'ma' | 'price' | 'slope' = 'ma',
    period: number = 20
  ): 'up' | 'down' | 'sideways' {
    const bars = this.getTimeframeData(symbol, timeframe)
    if (!bars || bars.length < period) return 'sideways'

    if (method === 'ma') {
      const ma = this.calculateMTFIndicator(symbol, timeframe, 'sma', { period, source: 'close' })
      const currentBar = this.getCurrentBar(symbol, timeframe)
      
      if (typeof ma === 'number' && currentBar) {
        const diff = currentBar.close - ma
        const threshold = currentBar.close * 0.001
        
        if (diff > threshold) return 'up'
        if (diff < -threshold) return 'down'
      }
      
      return 'sideways'
    } else if (method === 'price') {
      const recentBars = this.getPreviousBars(symbol, timeframe, period)
      if (recentBars.length < 2) return 'sideways'
      
      const first = recentBars[0]
      const last = recentBars[recentBars.length - 1]
      
      const diff = last.close - first.close
      const threshold = first.close * 0.01
      
      if (diff > threshold) return 'up'
      if (diff < -threshold) return 'down'
      return 'sideways'
    } else {
      const recentBars = this.getPreviousBars(symbol, timeframe, period)
      if (recentBars.length < period) return 'sideways'
      
      let upCount = 0
      let downCount = 0
      
      for (let i = 1; i < recentBars.length; i++) {
        if (recentBars[i].close > recentBars[i - 1].close) {
          upCount++
        } else if (recentBars[i].close < recentBars[i - 1].close) {
          downCount++
        }
      }
      
      const upPercent = upCount / (recentBars.length - 1)
      
      if (upPercent > 0.6) return 'up'
      if (upPercent < 0.4) return 'down'
      return 'sideways'
    }
  }

  checkMTFAlignment(
    symbol: string,
    timeframes: Timeframe[],
    expectedTrend: 'up' | 'down'
  ): { aligned: boolean; strength: number } {
    let alignedCount = 0
    
    for (const tf of timeframes) {
      const trend = this.detectMTFTrend(symbol, tf)
      if (trend === expectedTrend) {
        alignedCount++
      }
    }
    
    const strength = alignedCount / timeframes.length
    const aligned = strength >= 0.66
    
    return { aligned, strength }
  }

  getTimeframeStrength(timeframe: Timeframe): number {
    const timeframeOrder: Timeframe[] = ['M1', 'M5', 'M15', 'M30', 'H1', 'H4', 'D1', 'W1', 'MN']
    return timeframeOrder.indexOf(timeframe) + 1
  }

  getHigherTimeframe(currentTimeframe: Timeframe): Timeframe {
    const timeframeOrder: Timeframe[] = ['M1', 'M5', 'M15', 'M30', 'H1', 'H4', 'D1', 'W1', 'MN']
    const currentIndex = timeframeOrder.indexOf(currentTimeframe)
    
    if (currentIndex < timeframeOrder.length - 1) {
      return timeframeOrder[currentIndex + 1]
    }
    
    return currentTimeframe
  }

  getLowerTimeframe(currentTimeframe: Timeframe): Timeframe {
    const timeframeOrder: Timeframe[] = ['M1', 'M5', 'M15', 'M30', 'H1', 'H4', 'D1', 'W1', 'MN']
    const currentIndex = timeframeOrder.indexOf(currentTimeframe)
    
    if (currentIndex > 0) {
      return timeframeOrder[currentIndex - 1]
    }
    
    return currentTimeframe
  }

  resampleToHigherTimeframe(bars: OHLCV[], targetTimeframe: Timeframe): OHLCV[] {
    if (bars.length === 0) return []

    const timeframeMinutes: Record<Timeframe, number> = {
      M1: 1,
      M5: 5,
      M15: 15,
      M30: 30,
      H1: 60,
      H4: 240,
      D1: 1440,
      W1: 10080,
      MN: 43200
    }

    const targetMinutes = timeframeMinutes[targetTimeframe]
    const resampled: OHLCV[] = []
    let currentCandle: OHLCV | null = null

    for (const bar of bars) {
      const barTime = new Date(bar.time)
      const minutesSinceStart = Math.floor(barTime.getTime() / (60 * 1000))
      const candleStart = Math.floor(minutesSinceStart / targetMinutes) * targetMinutes

      if (!currentCandle || currentCandle.time !== candleStart * 60 * 1000) {
        if (currentCandle) {
          resampled.push(currentCandle)
        }

        currentCandle = {
          time: candleStart * 60 * 1000,
          open: bar.open,
          high: bar.high,
          low: bar.low,
          close: bar.close,
          volume: bar.volume
        }
      } else {
        currentCandle.high = Math.max(currentCandle.high, bar.high)
        currentCandle.low = Math.min(currentCandle.low, bar.low)
        currentCandle.close = bar.close
        currentCandle.volume += bar.volume
      }
    }

    if (currentCandle) {
      resampled.push(currentCandle)
    }

    return resampled
  }

  clearCache(): void {
    this.cachedIndicators.clear()
  }

  reset(): void {
    this.data.clear()
    this.cachedIndicators.clear()
  }

  getAvailableSymbols(): string[] {
    return Array.from(this.data.keys())
  }

  getAvailableTimeframes(symbol: string): Timeframe[] {
    const symbolData = this.data.get(symbol)
    if (!symbolData) return []
    return Array.from(symbolData.timeframes.keys())
  }
}

export const multiTimeframeAnalyzer = new MultiTimeframeAnalyzer()
