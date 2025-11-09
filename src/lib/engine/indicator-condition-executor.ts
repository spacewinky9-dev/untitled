/**
 * Indicator Condition Execution Logic
 * Handles execution of specialized indicator condition nodes
 */

import { OHLCV } from '@/types/market-data'
import { Node } from '@xyflow/react'

/**
 * Execute indicator rise condition
 */
export function executeIndicatorRise(
  indicatorValues: number[],
  bars: number = 1,
  threshold: number = 0
): boolean {
  if (indicatorValues.length < bars + 1) {
    return false
  }

  const current = indicatorValues[indicatorValues.length - 1]
  const previous = indicatorValues[indicatorValues.length - 1 - bars]

  return (current - previous) > threshold
}

/**
 * Execute indicator fall condition
 */
export function executeIndicatorFall(
  indicatorValues: number[],
  bars: number = 1,
  threshold: number = 0
): boolean {
  if (indicatorValues.length < bars + 1) {
    return false
  }

  const current = indicatorValues[indicatorValues.length - 1]
  const previous = indicatorValues[indicatorValues.length - 1 - bars]

  return (previous - current) > threshold
}

/**
 * Execute indicator within limits condition
 */
export function executeIndicatorWithinLimits(
  indicatorValue: number,
  lowerLimit: number,
  upperLimit: number
): { within: boolean; outside: boolean } {
  const within = indicatorValue >= lowerLimit && indicatorValue <= upperLimit
  return {
    within,
    outside: !within
  }
}

/**
 * Execute price above indicator condition
 */
export function executePriceAboveIndicator(
  price: number,
  indicatorValue: number,
  threshold: number = 0.001,
  percentMode: boolean = false
): boolean {
  if (percentMode) {
    const percentDiff = ((price - indicatorValue) / indicatorValue) * 100
    return percentDiff > threshold
  } else {
    return (price - indicatorValue) > threshold
  }
}

/**
 * Execute price below indicator condition
 */
export function executePriceBelowIndicator(
  price: number,
  indicatorValue: number,
  threshold: number = 0.001,
  percentMode: boolean = false
): boolean {
  if (percentMode) {
    const percentDiff = ((indicatorValue - price) / indicatorValue) * 100
    return percentDiff > threshold
  } else {
    return (indicatorValue - price) > threshold
  }
}

/**
 * Execute indicator crosses level condition
 */
export function executeIndicatorCrossesLevel(
  currentValue: number,
  previousValue: number,
  level: number,
  direction: 'above' | 'below' | 'both' = 'both'
): { crossedAbove: boolean; crossedBelow: boolean } {
  const crossedAbove = previousValue <= level && currentValue > level
  const crossedBelow = previousValue >= level && currentValue < level

  switch (direction) {
    case 'above':
      return { crossedAbove, crossedBelow: false }
    case 'below':
      return { crossedAbove: false, crossedBelow }
    case 'both':
    default:
      return { crossedAbove, crossedBelow }
  }
}

/**
 * Execute two indicators cross condition
 */
export function executeTwoIndicatorsCross(
  indicator1Current: number,
  indicator1Previous: number,
  indicator2Current: number,
  indicator2Previous: number,
  direction: 'above' | 'below' | 'both' = 'both'
): { crossAbove: boolean; crossBelow: boolean } {
  const crossAbove = indicator1Previous <= indicator2Previous && indicator1Current > indicator2Current
  const crossBelow = indicator1Previous >= indicator2Previous && indicator1Current < indicator2Current

  switch (direction) {
    case 'above':
      return { crossAbove, crossBelow: false }
    case 'below':
      return { crossAbove: false, crossBelow }
    case 'both':
    default:
      return { crossAbove, crossBelow }
  }
}

/**
 * Execute indicator at extreme condition
 */
export function executeIndicatorExtreme(
  indicatorValue: number,
  overbought: number = 70,
  oversold: number = 30
): { overbought: boolean; oversold: boolean; neutral: boolean } {
  const isOverbought = indicatorValue >= overbought
  const isOversold = indicatorValue <= oversold
  const isNeutral = !isOverbought && !isOversold

  return {
    overbought: isOverbought,
    oversold: isOversold,
    neutral: isNeutral
  }
}

/**
 * Execute indicator trend analysis
 */
export function executeIndicatorTrend(
  indicatorValues: number[],
  period: number = 5,
  threshold: number = 0.0001
): { uptrend: boolean; downtrend: boolean; sideways: boolean } {
  if (indicatorValues.length < period) {
    return { uptrend: false, downtrend: false, sideways: true }
  }

  const recentValues = indicatorValues.slice(-period)
  
  // Calculate linear regression slope
  let sumX = 0
  let sumY = 0
  let sumXY = 0
  let sumX2 = 0

  for (let i = 0; i < recentValues.length; i++) {
    sumX += i
    sumY += recentValues[i]
    sumXY += i * recentValues[i]
    sumX2 += i * i
  }

  const n = recentValues.length
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX)

  const uptrend = slope > threshold
  const downtrend = slope < -threshold
  const sideways = !uptrend && !downtrend

  return { uptrend, downtrend, sideways }
}

/**
 * Execute indicator rate of change
 */
export function executeIndicatorRateOfChange(
  indicatorValues: number[],
  period: number = 5,
  threshold: number = 0.1
): { fastRise: boolean; fastFall: boolean; stable: boolean } {
  if (indicatorValues.length < period + 1) {
    return { fastRise: false, fastFall: false, stable: true }
  }

  const current = indicatorValues[indicatorValues.length - 1]
  const previous = indicatorValues[indicatorValues.length - 1 - period]

  const rateOfChange = Math.abs((current - previous) / previous) * 100

  const fastRise = rateOfChange > threshold && current > previous
  const fastFall = rateOfChange > threshold && current < previous
  const stable = rateOfChange <= threshold

  return { fastRise, fastFall, stable }
}

/**
 * Execute indicator divergence detection
 */
export function executeIndicatorDivergence(
  priceValues: number[],
  indicatorValues: number[],
  lookback: number = 20,
  type: 'bullish' | 'bearish' | 'both' = 'both'
): { bullishDiv: boolean; bearishDiv: boolean } {
  if (priceValues.length < lookback || indicatorValues.length < lookback) {
    return { bullishDiv: false, bearishDiv: false }
  }

  const recentPrices = priceValues.slice(-lookback)
  const recentIndicators = indicatorValues.slice(-lookback)

  // Find local highs and lows
  const priceHigh1 = Math.max(...recentPrices.slice(-lookback / 2))
  const priceHigh2 = Math.max(...recentPrices.slice(-lookback, -lookback / 2))
  const priceLow1 = Math.min(...recentPrices.slice(-lookback / 2))
  const priceLow2 = Math.min(...recentPrices.slice(-lookback, -lookback / 2))

  const indHigh1 = Math.max(...recentIndicators.slice(-lookback / 2))
  const indHigh2 = Math.max(...recentIndicators.slice(-lookback, -lookback / 2))
  const indLow1 = Math.min(...recentIndicators.slice(-lookback / 2))
  const indLow2 = Math.min(...recentIndicators.slice(-lookback, -lookback / 2))

  // Bullish divergence: price making lower lows, indicator making higher lows
  const bullishDiv = priceLow1 < priceLow2 && indLow1 > indLow2

  // Bearish divergence: price making higher highs, indicator making lower highs
  const bearishDiv = priceHigh1 > priceHigh2 && indHigh1 < indHigh2

  switch (type) {
    case 'bullish':
      return { bullishDiv, bearishDiv: false }
    case 'bearish':
      return { bullishDiv: false, bearishDiv }
    case 'both':
    default:
      return { bullishDiv, bearishDiv }
  }
}

/**
 * Main handler for indicator condition nodes
 */
export function executeIndicatorConditionNode(
  nodeId: string,
  nodeData: any,
  context: {
    indicatorValue?: number
    indicatorValues?: number[]
    price?: number
    priceValues?: number[]
    indicator2Value?: number
    indicator2Values?: number[]
  }
): any {
  const params = nodeData.parameters || {}

  // Determine node type from ID
  if (nodeId.includes('indicator_rise')) {
    return executeIndicatorRise(
      context.indicatorValues || [],
      params.bars || 1,
      params.threshold || 0
    )
  }

  if (nodeId.includes('indicator_fall')) {
    return executeIndicatorFall(
      context.indicatorValues || [],
      params.bars || 1,
      params.threshold || 0
    )
  }

  if (nodeId.includes('indicator_within_limits')) {
    const result = executeIndicatorWithinLimits(
      context.indicatorValue || 0,
      params.lowerLimit || 20,
      params.upperLimit || 80
    )
    return result.within
  }

  if (nodeId.includes('price_above_indicator')) {
    return executePriceAboveIndicator(
      context.price || 0,
      context.indicatorValue || 0,
      params.threshold || 0.001,
      params.percentMode || false
    )
  }

  if (nodeId.includes('price_below_indicator')) {
    return executePriceBelowIndicator(
      context.price || 0,
      context.indicatorValue || 0,
      params.threshold || 0.001,
      params.percentMode || false
    )
  }

  if (nodeId.includes('indicator_crosses_level')) {
    const values = context.indicatorValues || []
    if (values.length < 2) return false

    const result = executeIndicatorCrossesLevel(
      values[values.length - 1],
      values[values.length - 2],
      params.level || 50,
      params.direction || 'both'
    )
    return result.crossedAbove || result.crossedBelow
  }

  if (nodeId.includes('two_indicators_cross')) {
    const values1 = context.indicatorValues || []
    const values2 = context.indicator2Values || []
    if (values1.length < 2 || values2.length < 2) return false

    const result = executeTwoIndicatorsCross(
      values1[values1.length - 1],
      values1[values1.length - 2],
      values2[values2.length - 1],
      values2[values2.length - 2],
      params.direction || 'both'
    )
    return result.crossAbove || result.crossBelow
  }

  if (nodeId.includes('indicator_extreme')) {
    const result = executeIndicatorExtreme(
      context.indicatorValue || 0,
      params.overbought || 70,
      params.oversold || 30
    )
    return result.overbought || result.oversold
  }

  if (nodeId.includes('indicator_trend')) {
    const result = executeIndicatorTrend(
      context.indicatorValues || [],
      params.period || 5,
      params.threshold || 0.0001
    )
    return result.uptrend || result.downtrend
  }

  if (nodeId.includes('indicator_rate_of_change')) {
    const result = executeIndicatorRateOfChange(
      context.indicatorValues || [],
      params.period || 5,
      params.threshold || 0.1
    )
    return result.fastRise || result.fastFall
  }

  if (nodeId.includes('indicator_divergence')) {
    const result = executeIndicatorDivergence(
      context.priceValues || [],
      context.indicatorValues || [],
      params.lookback || 20,
      params.type || 'both'
    )
    return result.bullishDiv || result.bearishDiv
  }

  // Default: indicator visible/invisible (placeholder logic)
  if (nodeId.includes('indicator_visible')) {
    return true // Assume visible by default
  }

  if (nodeId.includes('indicator_invisible')) {
    return false // Opposite of visible
  }

  return false
}
