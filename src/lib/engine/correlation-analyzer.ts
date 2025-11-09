/**
 * Currency Correlation Analysis
 * Analyzes correlations between currency pairs for portfolio diversification
 */

import { OHLCV } from '@/types/market-data'

export interface CorrelationData {
  pair1: string
  pair2: string
  correlation: number
  strength: 'strong_positive' | 'moderate_positive' | 'weak' | 'moderate_negative' | 'strong_negative'
  period: number
}

/**
 * Calculate Pearson correlation coefficient
 */
export function calculateCorrelation(data1: number[], data2: number[]): number {
  if (data1.length !== data2.length || data1.length === 0) {
    return 0
  }

  const n = data1.length
  
  // Calculate means
  const mean1 = data1.reduce((sum, val) => sum + val, 0) / n
  const mean2 = data2.reduce((sum, val) => sum + val, 0) / n

  // Calculate correlation
  let numerator = 0
  let sum1Sq = 0
  let sum2Sq = 0

  for (let i = 0; i < n; i++) {
    const diff1 = data1[i] - mean1
    const diff2 = data2[i] - mean2
    numerator += diff1 * diff2
    sum1Sq += diff1 * diff1
    sum2Sq += diff2 * diff2
  }

  const denominator = Math.sqrt(sum1Sq * sum2Sq)
  
  if (denominator === 0) {
    return 0
  }

  return numerator / denominator
}

/**
 * Calculate returns from OHLCV data
 */
export function calculateReturns(bars: OHLCV[]): number[] {
  const returns: number[] = []
  
  for (let i = 1; i < bars.length; i++) {
    const prevClose = bars[i - 1].close
    const currentClose = bars[i].close
    const returnValue = (currentClose - prevClose) / prevClose
    returns.push(returnValue)
  }

  return returns
}

/**
 * Classify correlation strength
 */
export function classifyCorrelation(correlation: number): CorrelationData['strength'] {
  const abs = Math.abs(correlation)
  
  if (correlation > 0.7) return 'strong_positive'
  if (correlation > 0.3) return 'moderate_positive'
  if (correlation < -0.7) return 'strong_negative'
  if (correlation < -0.3) return 'moderate_negative'
  return 'weak'
}

/**
 * Correlation Matrix Calculator
 */
export class CorrelationAnalyzer {
  private pairData: Map<string, OHLCV[]>
  private correlationCache: Map<string, CorrelationData>
  private period: number

  constructor(period: number = 30) {
    this.pairData = new Map()
    this.correlationCache = new Map()
    this.period = period
  }

  /**
   * Add price data for a currency pair
   */
  addPairData(symbol: string, bars: OHLCV[]): void {
    this.pairData.set(symbol, bars)
    this.correlationCache.clear() // Clear cache when data changes
  }

  /**
   * Calculate correlation between two pairs
   */
  calculatePairCorrelation(pair1: string, pair2: string, period?: number): CorrelationData | null {
    const bars1 = this.pairData.get(pair1)
    const bars2 = this.pairData.get(pair2)

    if (!bars1 || !bars2) {
      return null
    }

    const usePeriod = period || this.period
    const cacheKey = `${pair1}-${pair2}-${usePeriod}`

    // Check cache
    if (this.correlationCache.has(cacheKey)) {
      return this.correlationCache.get(cacheKey)!
    }

    // Get recent bars for analysis
    const recentBars1 = bars1.slice(-usePeriod)
    const recentBars2 = bars2.slice(-usePeriod)

    // Calculate returns
    const returns1 = calculateReturns(recentBars1)
    const returns2 = calculateReturns(recentBars2)

    // Ensure equal length
    const minLength = Math.min(returns1.length, returns2.length)
    const data1 = returns1.slice(-minLength)
    const data2 = returns2.slice(-minLength)

    // Calculate correlation
    const correlation = calculateCorrelation(data1, data2)
    const strength = classifyCorrelation(correlation)

    const result: CorrelationData = {
      pair1,
      pair2,
      correlation,
      strength,
      period: usePeriod
    }

    this.correlationCache.set(cacheKey, result)
    return result
  }

  /**
   * Get correlation matrix for all pairs
   */
  getCorrelationMatrix(): Map<string, Map<string, number>> {
    const matrix = new Map<string, Map<string, number>>()
    const symbols = Array.from(this.pairData.keys())

    for (const symbol1 of symbols) {
      const row = new Map<string, number>()
      
      for (const symbol2 of symbols) {
        if (symbol1 === symbol2) {
          row.set(symbol2, 1.0) // Perfect correlation with itself
        } else {
          const corr = this.calculatePairCorrelation(symbol1, symbol2)
          row.set(symbol2, corr?.correlation || 0)
        }
      }
      
      matrix.set(symbol1, row)
    }

    return matrix
  }

  /**
   * Find pairs with low correlation for diversification
   */
  findDiversificationPairs(minCorrelation: number = -0.5, maxCorrelation: number = 0.3): CorrelationData[] {
    const symbols = Array.from(this.pairData.keys())
    const diversified: CorrelationData[] = []

    for (let i = 0; i < symbols.length; i++) {
      for (let j = i + 1; j < symbols.length; j++) {
        const corr = this.calculatePairCorrelation(symbols[i], symbols[j])
        if (corr && corr.correlation >= minCorrelation && corr.correlation <= maxCorrelation) {
          diversified.push(corr)
        }
      }
    }

    return diversified.sort((a, b) => a.correlation - b.correlation)
  }

  /**
   * Find highly correlated pairs (avoid trading both simultaneously)
   */
  findHighlyCorrelatedPairs(threshold: number = 0.7): CorrelationData[] {
    const symbols = Array.from(this.pairData.keys())
    const correlated: CorrelationData[] = []

    for (let i = 0; i < symbols.length; i++) {
      for (let j = i + 1; j < symbols.length; j++) {
        const corr = this.calculatePairCorrelation(symbols[i], symbols[j])
        if (corr && Math.abs(corr.correlation) >= threshold) {
          correlated.push(corr)
        }
      }
    }

    return correlated.sort((a, b) => Math.abs(b.correlation) - Math.abs(a.correlation))
  }

  /**
   * Get diversification score for a portfolio (0-100, higher is better)
   */
  getPortfolioDiversificationScore(activePairs: string[]): number {
    if (activePairs.length < 2) {
      return 100 // Single pair, no diversification needed
    }

    let totalCorrelation = 0
    let count = 0

    for (let i = 0; i < activePairs.length; i++) {
      for (let j = i + 1; j < activePairs.length; j++) {
        const corr = this.calculatePairCorrelation(activePairs[i], activePairs[j])
        if (corr) {
          totalCorrelation += Math.abs(corr.correlation)
          count++
        }
      }
    }

    const avgCorrelation = count > 0 ? totalCorrelation / count : 0
    // Convert to score: low correlation = high score
    return Math.max(0, Math.min(100, (1 - avgCorrelation) * 100))
  }

  /**
   * Recommend pairs to add for better diversification
   */
  recommendDiversificationPair(currentPairs: string[]): string | null {
    const allPairs = Array.from(this.pairData.keys())
    const availablePairs = allPairs.filter(p => !currentPairs.includes(p))

    if (availablePairs.length === 0) {
      return null
    }

    let bestPair: string | null = null
    let bestScore = -1

    for (const candidatePair of availablePairs) {
      let totalCorrelation = 0
      let count = 0

      for (const existingPair of currentPairs) {
        const corr = this.calculatePairCorrelation(candidatePair, existingPair)
        if (corr) {
          totalCorrelation += Math.abs(corr.correlation)
          count++
        }
      }

      const avgCorrelation = count > 0 ? totalCorrelation / count : 0
      const score = 1 - avgCorrelation // Lower correlation = higher score

      if (score > bestScore) {
        bestScore = score
        bestPair = candidatePair
      }
    }

    return bestPair
  }
}

/**
 * Portfolio Manager for multi-pair trading
 */
export class PortfolioManager {
  private correlationAnalyzer: CorrelationAnalyzer
  private maxConcurrentPairs: number
  private maxCorrelationThreshold: number
  private activePairs: Set<string>

  constructor(maxConcurrentPairs: number = 5, maxCorrelationThreshold: number = 0.7) {
    this.correlationAnalyzer = new CorrelationAnalyzer()
    this.maxConcurrentPairs = maxConcurrentPairs
    this.maxCorrelationThreshold = maxCorrelationThreshold
    this.activePairs = new Set()
  }

  /**
   * Add market data for analysis
   */
  addMarketData(symbol: string, bars: OHLCV[]): void {
    this.correlationAnalyzer.addPairData(symbol, bars)
  }

  /**
   * Check if new pair can be added to portfolio
   */
  canAddPair(newPair: string): { allowed: boolean; reason?: string } {
    // Check max concurrent pairs
    if (this.activePairs.size >= this.maxConcurrentPairs) {
      return {
        allowed: false,
        reason: `Maximum concurrent pairs (${this.maxConcurrentPairs}) reached`
      }
    }

    // Check correlation with active pairs
    for (const activePair of this.activePairs) {
      const corr = this.correlationAnalyzer.calculatePairCorrelation(newPair, activePair)
      if (corr && Math.abs(corr.correlation) > this.maxCorrelationThreshold) {
        return {
          allowed: false,
          reason: `High correlation (${(corr.correlation * 100).toFixed(1)}%) with ${activePair}`
        }
      }
    }

    return { allowed: true }
  }

  /**
   * Add pair to active portfolio
   */
  addPair(pair: string): boolean {
    const check = this.canAddPair(pair)
    if (check.allowed) {
      this.activePairs.add(pair)
      return true
    }
    return false
  }

  /**
   * Remove pair from active portfolio
   */
  removePair(pair: string): void {
    this.activePairs.delete(pair)
  }

  /**
   * Get active pairs
   */
  getActivePairs(): string[] {
    return Array.from(this.activePairs)
  }

  /**
   * Get portfolio diversification metrics
   */
  getPortfolioMetrics(): {
    activePairs: number
    diversificationScore: number
    maxPairs: number
    correlations: CorrelationData[]
  } {
    const activePairsList = this.getActivePairs()
    const diversificationScore = this.correlationAnalyzer.getPortfolioDiversificationScore(activePairsList)
    const correlations: CorrelationData[] = []

    for (let i = 0; i < activePairsList.length; i++) {
      for (let j = i + 1; j < activePairsList.length; j++) {
        const corr = this.correlationAnalyzer.calculatePairCorrelation(
          activePairsList[i],
          activePairsList[j]
        )
        if (corr) {
          correlations.push(corr)
        }
      }
    }

    return {
      activePairs: this.activePairs.size,
      diversificationScore,
      maxPairs: this.maxConcurrentPairs,
      correlations
    }
  }

  /**
   * Get recommended pair for diversification
   */
  getRecommendedPair(): string | null {
    const activePairsList = this.getActivePairs()
    return this.correlationAnalyzer.recommendDiversificationPair(activePairsList)
  }

  /**
   * Set maximum concurrent pairs
   */
  setMaxConcurrentPairs(max: number): void {
    this.maxConcurrentPairs = max
  }

  /**
   * Set correlation threshold
   */
  setCorrelationThreshold(threshold: number): void {
    this.maxCorrelationThreshold = threshold
  }

  /**
   * Reset portfolio
   */
  reset(): void {
    this.activePairs.clear()
  }
}
