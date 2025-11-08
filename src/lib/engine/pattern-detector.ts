import { OHLCV } from '@/types/market-data'

export type CandlestickPattern = 
  | 'bullish_engulfing'
  | 'bearish_engulfing'
  | 'hammer'
  | 'shooting_star'
  | 'doji'
  | 'morning_star'
  | 'evening_star'
  | 'three_white_soldiers'
  | 'three_black_crows'
  | 'piercing_pattern'
  | 'dark_cloud_cover'

export type ChartPattern =
  | 'double_bottom'
  | 'double_top'
  | 'head_and_shoulders'
  | 'inverse_head_and_shoulders'
  | 'ascending_triangle'
  | 'descending_triangle'
  | 'symmetrical_triangle'
  | 'rising_wedge'
  | 'falling_wedge'
  | 'flag'
  | 'pennant'

export interface PatternResult {
  detected: boolean
  confidence: number
  bars: number[]
}

export class PatternDetector {
  
  detectCandlestickPattern(bars: OHLCV[], pattern: CandlestickPattern): PatternResult {
    if (bars.length < 3) {
      return { detected: false, confidence: 0, bars: [] }
    }

    const current = bars[bars.length - 1]
    const prev = bars[bars.length - 2]
    const prevPrev = bars.length >= 3 ? bars[bars.length - 3] : null

    switch (pattern) {
      case 'bullish_engulfing':
        return this.detectBullishEngulfing(prev, current)
      
      case 'bearish_engulfing':
        return this.detectBearishEngulfing(prev, current)
      
      case 'hammer':
        return this.detectHammer(current)
      
      case 'shooting_star':
        return this.detectShootingStar(current)
      
      case 'doji':
        return this.detectDoji(current)
      
      case 'morning_star':
        if (!prevPrev) return { detected: false, confidence: 0, bars: [] }
        return this.detectMorningStar(prevPrev, prev, current)
      
      case 'evening_star':
        if (!prevPrev) return { detected: false, confidence: 0, bars: [] }
        return this.detectEveningStar(prevPrev, prev, current)
      
      case 'three_white_soldiers':
        if (!prevPrev) return { detected: false, confidence: 0, bars: [] }
        return this.detectThreeWhiteSoldiers(prevPrev, prev, current)
      
      case 'three_black_crows':
        if (!prevPrev) return { detected: false, confidence: 0, bars: [] }
        return this.detectThreeBlackCrows(prevPrev, prev, current)
      
      case 'piercing_pattern':
        return this.detectPiercingPattern(prev, current)
      
      case 'dark_cloud_cover':
        return this.detectDarkCloudCover(prev, current)
      
      default:
        return { detected: false, confidence: 0, bars: [] }
    }
  }

  private detectBullishEngulfing(prev: OHLCV, current: OHLCV): PatternResult {
    const prevBody = Math.abs(prev.close - prev.open)
    const currentBody = Math.abs(current.close - current.open)
    
    const isBearishPrev = prev.close < prev.open
    const isBullishCurrent = current.close > current.open
    const engulfs = current.open < prev.close && current.close > prev.open
    
    if (isBearishPrev && isBullishCurrent && engulfs) {
      const confidence = Math.min(1, (currentBody / prevBody) * 0.7)
      return { detected: true, confidence, bars: [-2, -1] }
    }
    
    return { detected: false, confidence: 0, bars: [] }
  }

  private detectBearishEngulfing(prev: OHLCV, current: OHLCV): PatternResult {
    const prevBody = Math.abs(prev.close - prev.open)
    const currentBody = Math.abs(current.close - current.open)
    
    const isBullishPrev = prev.close > prev.open
    const isBearishCurrent = current.close < current.open
    const engulfs = current.open > prev.close && current.close < prev.open
    
    if (isBullishPrev && isBearishCurrent && engulfs) {
      const confidence = Math.min(1, (currentBody / prevBody) * 0.7)
      return { detected: true, confidence, bars: [-2, -1] }
    }
    
    return { detected: false, confidence: 0, bars: [] }
  }

  private detectHammer(bar: OHLCV): PatternResult {
    const body = Math.abs(bar.close - bar.open)
    const lowerShadow = Math.min(bar.open, bar.close) - bar.low
    const upperShadow = bar.high - Math.max(bar.open, bar.close)
    const range = bar.high - bar.low
    
    const isHammer = lowerShadow > body * 2 && upperShadow < body * 0.5 && body > range * 0.1
    
    if (isHammer) {
      const confidence = Math.min(1, (lowerShadow / body) / 3)
      return { detected: true, confidence, bars: [-1] }
    }
    
    return { detected: false, confidence: 0, bars: [] }
  }

  private detectShootingStar(bar: OHLCV): PatternResult {
    const body = Math.abs(bar.close - bar.open)
    const lowerShadow = Math.min(bar.open, bar.close) - bar.low
    const upperShadow = bar.high - Math.max(bar.open, bar.close)
    const range = bar.high - bar.low
    
    const isShootingStar = upperShadow > body * 2 && lowerShadow < body * 0.5 && body > range * 0.1
    
    if (isShootingStar) {
      const confidence = Math.min(1, (upperShadow / body) / 3)
      return { detected: true, confidence, bars: [-1] }
    }
    
    return { detected: false, confidence: 0, bars: [] }
  }

  private detectDoji(bar: OHLCV): PatternResult {
    const body = Math.abs(bar.close - bar.open)
    const range = bar.high - bar.low
    
    const isDoji = body < range * 0.1
    
    if (isDoji) {
      const confidence = 1 - (body / range) * 10
      return { detected: true, confidence: Math.max(0.5, confidence), bars: [-1] }
    }
    
    return { detected: false, confidence: 0, bars: [] }
  }

  private detectMorningStar(first: OHLCV, second: OHLCV, third: OHLCV): PatternResult {
    const firstBearish = first.close < first.open
    const secondSmall = Math.abs(second.close - second.open) < Math.abs(first.close - first.open) * 0.3
    const thirdBullish = third.close > third.open
    const gapDown = second.open < first.close
    const thirdCoversFirst = third.close > (first.open + first.close) / 2
    
    if (firstBearish && secondSmall && thirdBullish && gapDown && thirdCoversFirst) {
      return { detected: true, confidence: 0.8, bars: [-3, -2, -1] }
    }
    
    return { detected: false, confidence: 0, bars: [] }
  }

  private detectEveningStar(first: OHLCV, second: OHLCV, third: OHLCV): PatternResult {
    const firstBullish = first.close > first.open
    const secondSmall = Math.abs(second.close - second.open) < Math.abs(first.close - first.open) * 0.3
    const thirdBearish = third.close < third.open
    const gapUp = second.open > first.close
    const thirdCoversFirst = third.close < (first.open + first.close) / 2
    
    if (firstBullish && secondSmall && thirdBearish && gapUp && thirdCoversFirst) {
      return { detected: true, confidence: 0.8, bars: [-3, -2, -1] }
    }
    
    return { detected: false, confidence: 0, bars: [] }
  }

  private detectThreeWhiteSoldiers(first: OHLCV, second: OHLCV, third: OHLCV): PatternResult {
    const allBullish = first.close > first.open && second.close > second.open && third.close > third.open
    const consecutive = second.close > first.close && third.close > second.close
    const longBodies = Math.abs(first.close - first.open) > (first.high - first.low) * 0.6 &&
                       Math.abs(second.close - second.open) > (second.high - second.low) * 0.6 &&
                       Math.abs(third.close - third.open) > (third.high - third.low) * 0.6
    
    if (allBullish && consecutive && longBodies) {
      return { detected: true, confidence: 0.85, bars: [-3, -2, -1] }
    }
    
    return { detected: false, confidence: 0, bars: [] }
  }

  private detectThreeBlackCrows(first: OHLCV, second: OHLCV, third: OHLCV): PatternResult {
    const allBearish = first.close < first.open && second.close < second.open && third.close < third.open
    const consecutive = second.close < first.close && third.close < second.close
    const longBodies = Math.abs(first.close - first.open) > (first.high - first.low) * 0.6 &&
                       Math.abs(second.close - second.open) > (second.high - second.low) * 0.6 &&
                       Math.abs(third.close - third.open) > (third.high - third.low) * 0.6
    
    if (allBearish && consecutive && longBodies) {
      return { detected: true, confidence: 0.85, bars: [-3, -2, -1] }
    }
    
    return { detected: false, confidence: 0, bars: [] }
  }

  private detectPiercingPattern(prev: OHLCV, current: OHLCV): PatternResult {
    const prevBearish = prev.close < prev.open
    const currentBullish = current.close > current.open
    const opensBelow = current.open < prev.close
    const closesAboveMid = current.close > (prev.open + prev.close) / 2
    const notFullyEngulfing = current.close < prev.open
    
    if (prevBearish && currentBullish && opensBelow && closesAboveMid && notFullyEngulfing) {
      return { detected: true, confidence: 0.75, bars: [-2, -1] }
    }
    
    return { detected: false, confidence: 0, bars: [] }
  }

  private detectDarkCloudCover(prev: OHLCV, current: OHLCV): PatternResult {
    const prevBullish = prev.close > prev.open
    const currentBearish = current.close < current.open
    const opensAbove = current.open > prev.close
    const closesBelowMid = current.close < (prev.open + prev.close) / 2
    const notFullyEngulfing = current.close > prev.open
    
    if (prevBullish && currentBearish && opensAbove && closesBelowMid && notFullyEngulfing) {
      return { detected: true, confidence: 0.75, bars: [-2, -1] }
    }
    
    return { detected: false, confidence: 0, bars: [] }
  }

  detectChartPattern(bars: OHLCV[], pattern: ChartPattern, lookback: number = 50): PatternResult {
    if (bars.length < lookback) {
      return { detected: false, confidence: 0, bars: [] }
    }

    const recentBars = bars.slice(-lookback)

    switch (pattern) {
      case 'double_bottom':
        return this.detectDoubleBottom(recentBars)
      
      case 'double_top':
        return this.detectDoubleTop(recentBars)
      
      case 'head_and_shoulders':
        return this.detectHeadAndShoulders(recentBars)
      
      case 'inverse_head_and_shoulders':
        return this.detectInverseHeadAndShoulders(recentBars)
      
      default:
        return { detected: false, confidence: 0, bars: [] }
    }
  }

  private detectDoubleBottom(bars: OHLCV[]): PatternResult {
    const lows = bars.map(b => b.low)
    const sortedLows = [...lows].sort((a, b) => a - b)
    const lowest = sortedLows[0]
    const tolerance = lowest * 0.01
    
    const bottomIndices: number[] = []
    for (let i = 1; i < lows.length - 1; i++) {
      if (lows[i] < lows[i-1] && lows[i] < lows[i+1] && Math.abs(lows[i] - lowest) < tolerance) {
        bottomIndices.push(i)
      }
    }
    
    if (bottomIndices.length >= 2) {
      const spacing = bottomIndices[bottomIndices.length - 1] - bottomIndices[0]
      if (spacing > 5 && spacing < bars.length - 5) {
        return { detected: true, confidence: 0.7, bars: bottomIndices }
      }
    }
    
    return { detected: false, confidence: 0, bars: [] }
  }

  private detectDoubleTop(bars: OHLCV[]): PatternResult {
    const highs = bars.map(b => b.high)
    const sortedHighs = [...highs].sort((a, b) => b - a)
    const highest = sortedHighs[0]
    const tolerance = highest * 0.01
    
    const topIndices: number[] = []
    for (let i = 1; i < highs.length - 1; i++) {
      if (highs[i] > highs[i-1] && highs[i] > highs[i+1] && Math.abs(highs[i] - highest) < tolerance) {
        topIndices.push(i)
      }
    }
    
    if (topIndices.length >= 2) {
      const spacing = topIndices[topIndices.length - 1] - topIndices[0]
      if (spacing > 5 && spacing < bars.length - 5) {
        return { detected: true, confidence: 0.7, bars: topIndices }
      }
    }
    
    return { detected: false, confidence: 0, bars: [] }
  }

  private detectHeadAndShoulders(bars: OHLCV[]): PatternResult {
    const highs = bars.map(b => b.high)
    const peaks: number[] = []
    
    for (let i = 5; i < highs.length - 5; i++) {
      let isPeak = true
      for (let j = i - 5; j < i + 5; j++) {
        if (j !== i && highs[j] >= highs[i]) {
          isPeak = false
          break
        }
      }
      if (isPeak) peaks.push(i)
    }
    
    if (peaks.length >= 3) {
      const lastThree = peaks.slice(-3)
      const [left, head, right] = lastThree.map(i => highs[i])
      
      const isPattern = head > left && head > right && 
                        Math.abs(left - right) < left * 0.05 &&
                        head > left * 1.05
      
      if (isPattern) {
        return { detected: true, confidence: 0.75, bars: lastThree }
      }
    }
    
    return { detected: false, confidence: 0, bars: [] }
  }

  private detectInverseHeadAndShoulders(bars: OHLCV[]): PatternResult {
    const lows = bars.map(b => b.low)
    const troughs: number[] = []
    
    for (let i = 5; i < lows.length - 5; i++) {
      let isTrough = true
      for (let j = i - 5; j < i + 5; j++) {
        if (j !== i && lows[j] <= lows[i]) {
          isTrough = false
          break
        }
      }
      if (isTrough) troughs.push(i)
    }
    
    if (troughs.length >= 3) {
      const lastThree = troughs.slice(-3)
      const [left, head, right] = lastThree.map(i => lows[i])
      
      const isPattern = head < left && head < right && 
                        Math.abs(left - right) < left * 0.05 &&
                        head < left * 0.95
      
      if (isPattern) {
        return { detected: true, confidence: 0.75, bars: lastThree }
      }
    }
    
    return { detected: false, confidence: 0, bars: [] }
  }

  detectSupportResistance(bars: OHLCV[], threshold: number = 0.001): { support: number[], resistance: number[] } {
    const levels = { support: [] as number[], resistance: [] as number[] }
    
    for (let i = 2; i < bars.length - 2; i++) {
      const bar = bars[i]
      const prevBars = bars.slice(Math.max(0, i - 10), i)
      const nextBars = bars.slice(i + 1, Math.min(bars.length, i + 11))
      
      const touchesResistance = prevBars.filter(b => Math.abs(b.high - bar.high) / bar.high < threshold).length >= 2
      const touchesSupport = prevBars.filter(b => Math.abs(b.low - bar.low) / bar.low < threshold).length >= 2
      
      if (touchesResistance && !levels.resistance.includes(bar.high)) {
        levels.resistance.push(bar.high)
      }
      if (touchesSupport && !levels.support.includes(bar.low)) {
        levels.support.push(bar.low)
      }
    }
    
    return levels
  }

  detectDivergence(bars: OHLCV[], indicatorValues: number[], type: 'bullish' | 'bearish'): PatternResult {
    if (bars.length < 20 || indicatorValues.length < 20) {
      return { detected: false, confidence: 0, bars: [] }
    }

    const recentBars = bars.slice(-20)
    const recentIndicator = indicatorValues.slice(-20)

    if (type === 'bullish') {
      const priceMovingDown = recentBars[recentBars.length - 1].low < recentBars[0].low
      const indicatorMovingUp = recentIndicator[recentIndicator.length - 1] > recentIndicator[0]
      
      if (priceMovingDown && indicatorMovingUp) {
        return { detected: true, confidence: 0.7, bars: [0, recentBars.length - 1] }
      }
    } else {
      const priceMovingUp = recentBars[recentBars.length - 1].high > recentBars[0].high
      const indicatorMovingDown = recentIndicator[recentIndicator.length - 1] < recentIndicator[0]
      
      if (priceMovingUp && indicatorMovingDown) {
        return { detected: true, confidence: 0.7, bars: [0, recentBars.length - 1] }
      }
    }

    return { detected: false, confidence: 0, bars: [] }
  }
}
