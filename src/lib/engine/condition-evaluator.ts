import { OHLCV } from '@/types/market-data'

export type ComparisonOperator = 
  | 'gt' | 'lt' | 'gte' | 'lte' | 'eq' | 'neq'
  | 'cross_above' | 'cross_below' | 'cross'
  | 'above_threshold' | 'below_threshold'
  | 'in_range' | 'out_of_range'

export interface ConditionParameters {
  operator: ComparisonOperator
  threshold?: number
  thresholdHigh?: number
  thresholdLow?: number
  lookback?: number
}

export interface ConditionContext {
  currentValue: number
  comparisonValue?: number
  previousValue?: number
  previousComparisonValue?: number
  bar: OHLCV
  previousBar?: OHLCV
  index: number
}

export class ConditionEvaluator {
  static evaluate(params: ConditionParameters, context: ConditionContext): boolean {
    const { operator, threshold, thresholdHigh, thresholdLow } = params
    const { currentValue, comparisonValue, previousValue, previousComparisonValue } = context

    if (isNaN(currentValue)) return false

    switch (operator) {
      case 'gt':
        return this.greaterThan(currentValue, comparisonValue ?? threshold ?? 0)

      case 'lt':
        return this.lessThan(currentValue, comparisonValue ?? threshold ?? 0)

      case 'gte':
        return this.greaterThanOrEqual(currentValue, comparisonValue ?? threshold ?? 0)

      case 'lte':
        return this.lessThanOrEqual(currentValue, comparisonValue ?? threshold ?? 0)

      case 'eq':
        return this.equal(currentValue, comparisonValue ?? threshold ?? 0)

      case 'neq':
        return this.notEqual(currentValue, comparisonValue ?? threshold ?? 0)

      case 'cross_above':
        if (previousValue === undefined) return false
        const compareB = comparisonValue ?? threshold ?? 0
        const prevCompareB = previousComparisonValue ?? threshold ?? 0
        return this.crossAbove(currentValue, compareB, previousValue, prevCompareB)

      case 'cross_below':
        if (previousValue === undefined) return false
        const compareB2 = comparisonValue ?? threshold ?? 0
        const prevCompareB2 = previousComparisonValue ?? threshold ?? 0
        return this.crossBelow(currentValue, compareB2, previousValue, prevCompareB2)

      case 'cross':
        if (previousValue === undefined) return false
        const compareB3 = comparisonValue ?? threshold ?? 0
        const prevCompareB3 = previousComparisonValue ?? threshold ?? 0
        return this.crossAbove(currentValue, compareB3, previousValue, prevCompareB3) ||
               this.crossBelow(currentValue, compareB3, previousValue, prevCompareB3)

      case 'above_threshold':
        return this.aboveThreshold(currentValue, threshold ?? 0)

      case 'below_threshold':
        return this.belowThreshold(currentValue, threshold ?? 0)

      case 'in_range':
        if (thresholdLow === undefined || thresholdHigh === undefined) return false
        return this.inRange(currentValue, thresholdLow, thresholdHigh)

      case 'out_of_range':
        if (thresholdLow === undefined || thresholdHigh === undefined) return false
        return this.outOfRange(currentValue, thresholdLow, thresholdHigh)

      default:
        return false
    }
  }

  private static greaterThan(a: number, b: number): boolean {
    return a > b
  }

  private static lessThan(a: number, b: number): boolean {
    return a < b
  }

  private static greaterThanOrEqual(a: number, b: number): boolean {
    return a >= b
  }

  private static lessThanOrEqual(a: number, b: number): boolean {
    return a <= b
  }

  private static equal(a: number, b: number, epsilon: number = 0.0001): boolean {
    return Math.abs(a - b) < epsilon
  }

  private static notEqual(a: number, b: number, epsilon: number = 0.0001): boolean {
    return Math.abs(a - b) >= epsilon
  }

  private static crossAbove(
    currentA: number,
    currentB: number,
    previousA: number,
    previousB: number
  ): boolean {
    return previousA <= previousB && currentA > currentB
  }

  private static crossBelow(
    currentA: number,
    currentB: number,
    previousA: number,
    previousB: number
  ): boolean {
    return previousA >= previousB && currentA < currentB
  }

  private static aboveThreshold(value: number, threshold: number): boolean {
    return value > threshold
  }

  private static belowThreshold(value: number, threshold: number): boolean {
    return value < threshold
  }

  private static inRange(value: number, low: number, high: number): boolean {
    return value >= low && value <= high
  }

  private static outOfRange(value: number, low: number, high: number): boolean {
    return value < low || value > high
  }
}

export class CandlestickPatternDetector {
  static detectBullishEngulfing(current: OHLCV, previous: OHLCV): boolean {
    const prevBearish = previous.close < previous.open
    const currBullish = current.close > current.open
    const bodyEngulfs = current.open <= previous.close && current.close >= previous.open
    
    return prevBearish && currBullish && bodyEngulfs
  }

  static detectBearishEngulfing(current: OHLCV, previous: OHLCV): boolean {
    const prevBullish = previous.close > previous.open
    const currBearish = current.close < current.open
    const bodyEngulfs = current.open >= previous.close && current.close <= previous.open
    
    return prevBullish && currBearish && bodyEngulfs
  }

  static detectDoji(bar: OHLCV, bodyRatio: number = 0.1): boolean {
    const body = Math.abs(bar.close - bar.open)
    const range = bar.high - bar.low
    
    if (range === 0) return false
    
    return (body / range) < bodyRatio
  }

  static detectHammer(bar: OHLCV): boolean {
    const body = Math.abs(bar.close - bar.open)
    const range = bar.high - bar.low
    const lowerShadow = Math.min(bar.open, bar.close) - bar.low
    const upperShadow = bar.high - Math.max(bar.open, bar.close)
    
    if (range === 0) return false
    
    return lowerShadow > body * 2 && upperShadow < body * 0.5
  }

  static detectShootingStar(bar: OHLCV): boolean {
    const body = Math.abs(bar.close - bar.open)
    const range = bar.high - bar.low
    const upperShadow = bar.high - Math.max(bar.open, bar.close)
    const lowerShadow = Math.min(bar.open, bar.close) - bar.low
    
    if (range === 0) return false
    
    return upperShadow > body * 2 && lowerShadow < body * 0.5
  }

  static detectMorningStar(bars: OHLCV[]): boolean {
    if (bars.length < 3) return false
    
    const [first, second, third] = bars.slice(-3)
    
    const firstBearish = first.close < first.open
    const secondSmall = Math.abs(second.close - second.open) < Math.abs(first.close - first.open) * 0.3
    const thirdBullish = third.close > third.open
    const thirdRecovers = third.close > (first.open + first.close) / 2
    
    return firstBearish && secondSmall && thirdBullish && thirdRecovers
  }

  static detectEveningStar(bars: OHLCV[]): boolean {
    if (bars.length < 3) return false
    
    const [first, second, third] = bars.slice(-3)
    
    const firstBullish = first.close > first.open
    const secondSmall = Math.abs(second.close - second.open) < Math.abs(first.close - first.open) * 0.3
    const thirdBearish = third.close < third.open
    const thirdRecovers = third.close < (first.open + first.close) / 2
    
    return firstBullish && secondSmall && thirdBearish && thirdRecovers
  }

  static detectPinBar(bar: OHLCV): boolean {
    return this.detectHammer(bar) || this.detectShootingStar(bar)
  }

  static detectInsideBar(current: OHLCV, previous: OHLCV): boolean {
    return current.high <= previous.high && current.low >= previous.low
  }

  static detectOutsideBar(current: OHLCV, previous: OHLCV): boolean {
    return current.high > previous.high && current.low < previous.low
  }
}

export type CandlestickPattern = 
  | 'bullish_engulfing'
  | 'bearish_engulfing'
  | 'doji'
  | 'hammer'
  | 'shooting_star'
  | 'morning_star'
  | 'evening_star'
  | 'pin_bar'
  | 'inside_bar'
  | 'outside_bar'

export class PatternMatcher {
  static matchPattern(
    pattern: CandlestickPattern,
    bars: OHLCV[],
    index: number
  ): boolean {
    if (index < 0 || index >= bars.length) return false
    
    const current = bars[index]
    const previous = index > 0 ? bars[index - 1] : undefined
    
    switch (pattern) {
      case 'bullish_engulfing':
        return previous ? CandlestickPatternDetector.detectBullishEngulfing(current, previous) : false
      
      case 'bearish_engulfing':
        return previous ? CandlestickPatternDetector.detectBearishEngulfing(current, previous) : false
      
      case 'doji':
        return CandlestickPatternDetector.detectDoji(current)
      
      case 'hammer':
        return CandlestickPatternDetector.detectHammer(current)
      
      case 'shooting_star':
        return CandlestickPatternDetector.detectShootingStar(current)
      
      case 'morning_star':
        return CandlestickPatternDetector.detectMorningStar(bars.slice(0, index + 1))
      
      case 'evening_star':
        return CandlestickPatternDetector.detectEveningStar(bars.slice(0, index + 1))
      
      case 'pin_bar':
        return CandlestickPatternDetector.detectPinBar(current)
      
      case 'inside_bar':
        return previous ? CandlestickPatternDetector.detectInsideBar(current, previous) : false
      
      case 'outside_bar':
        return previous ? CandlestickPatternDetector.detectOutsideBar(current, previous) : false
      
      default:
        return false
    }
  }
}
