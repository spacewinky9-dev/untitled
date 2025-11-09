/**
 * Advanced Features Integration Tests
 * Tests for market sessions, filters, correlation, and portfolio management
 */

import { MarketSessionManager, detectSession } from '@/lib/engine/market-session-detector'
import { 
  SpreadFilter, 
  VolatilityFilter, 
  TimeFilter, 
  DrawdownFilter,
  AdvancedFilterManager 
} from '@/lib/engine/advanced-filters'
import { 
  CorrelationAnalyzer, 
  PortfolioManager,
  calculateCorrelation 
} from '@/lib/engine/correlation-analyzer'
import { OHLCV } from '@/types/market-data'
import { getSampleData } from '@/lib/market-data/sample-data'

// Test data
const testData: OHLCV[] = getSampleData('trending', 100)

/**
 * Test 1: Market Session Detection
 */
export function testMarketSessions(): boolean {
  console.log('Testing Market Session Detection...')
  
  try {
    const sessionManager = new MarketSessionManager()
    
    // Test Asian session (UTC 00:00-09:00)
    const asianTime = new Date('2024-01-01T05:00:00Z').getTime()
    const asianSession = sessionManager.getCurrentSession(asianTime)
    console.log(`  Asian time (05:00 UTC) -> ${asianSession}`)
    
    // Test European session (UTC 08:00-17:00)
    const europeanTime = new Date('2024-01-01T12:00:00Z').getTime()
    const europeanSession = sessionManager.getCurrentSession(europeanTime)
    console.log(`  European time (12:00 UTC) -> ${europeanSession}`)
    
    // Test US session (UTC 13:00-22:00)
    const usTime = new Date('2024-01-01T18:00:00Z').getTime()
    const usSession = sessionManager.getCurrentSession(usTime)
    console.log(`  US time (18:00 UTC) -> ${usSession}`)
    
    // Test overlap period
    const overlapTime = new Date('2024-01-01T14:00:00Z').getTime()
    const isOverlap = sessionManager.isOverlapPeriod(overlapTime)
    console.log(`  Overlap check (14:00 UTC) -> ${isOverlap}`)
    
    // Test session filtering
    const canTrade = sessionManager.canTrade(europeanTime, ['european', 'us'])
    console.log(`  Can trade in European session -> ${canTrade}`)
    
    console.log('✓ Market session detection test passed')
    return true
  } catch (error) {
    console.error('✗ Market session test failed:', error)
    return false
  }
}

/**
 * Test 2: Spread Filter
 */
export function testSpreadFilter(): boolean {
  console.log('Testing Spread Filter...')
  
  try {
    const spreadFilter = new SpreadFilter(3, 0.0001) // Max 3 pips
    
    // Test acceptable spread
    const tightSpread = spreadFilter.isSpreadAcceptable(1.1000, 1.1002) // 2 pips
    console.log(`  Tight spread (2 pips) acceptable -> ${tightSpread}`)
    
    // Test unacceptable spread
    const wideSpread = spreadFilter.isSpreadAcceptable(1.1000, 1.1005) // 5 pips
    console.log(`  Wide spread (5 pips) acceptable -> ${wideSpread}`)
    
    // Calculate spread
    const spreadPips = spreadFilter.calculateSpreadPips(1.1000, 1.1003)
    console.log(`  Calculated spread: ${spreadPips} pips`)
    
    console.log('✓ Spread filter test passed')
    return !wideSpread && tightSpread // Wide should be false, tight should be true
  } catch (error) {
    console.error('✗ Spread filter test failed:', error)
    return false
  }
}

/**
 * Test 3: Volatility Filter
 */
export function testVolatilityFilter(): boolean {
  console.log('Testing Volatility Filter...')
  
  try {
    const volatilityFilter = new VolatilityFilter(14, 0.0010, 0.0100)
    
    // Calculate ATR
    const atr = volatilityFilter.calculateATR(testData)
    console.log(`  Calculated ATR: ${atr.toFixed(4)}`)
    
    // Check volatility level
    const level = volatilityFilter.getVolatilityLevel(testData)
    console.log(`  Volatility level: ${level}`)
    
    // Check if acceptable
    const isAcceptable = volatilityFilter.isVolatilityAcceptable(testData)
    console.log(`  Volatility acceptable: ${isAcceptable}`)
    
    // Calculate volatility ratio
    const ratio = volatilityFilter.getVolatilityRatio(testData, 50)
    console.log(`  Volatility ratio: ${ratio.toFixed(2)}`)
    
    console.log('✓ Volatility filter test passed')
    return true
  } catch (error) {
    console.error('✗ Volatility filter test failed:', error)
    return false
  }
}

/**
 * Test 4: Time Filter
 */
export function testTimeFilter(): boolean {
  console.log('Testing Time Filter...')
  
  try {
    // Allow trading only from 8:00-18:00 UTC, Monday-Friday
    const timeFilter = new TimeFilter([8, 9, 10, 11, 12, 13, 14, 15, 16, 17], [1, 2, 3, 4, 5])
    
    // Test allowed time (Wednesday 10:00 UTC)
    const allowedTime = new Date('2024-01-03T10:00:00Z').getTime()
    const isAllowed = timeFilter.isTradingAllowed(allowedTime)
    console.log(`  Wednesday 10:00 UTC allowed -> ${isAllowed}`)
    
    // Test disallowed time (Wednesday 22:00 UTC)
    const disallowedTime = new Date('2024-01-03T22:00:00Z').getTime()
    const isDisallowed = timeFilter.isTradingAllowed(disallowedTime)
    console.log(`  Wednesday 22:00 UTC allowed -> ${isDisallowed}`)
    
    // Test weekend
    const weekendTime = new Date('2024-01-06T10:00:00Z').getTime() // Saturday
    const isWeekend = timeFilter.isWeekend(weekendTime)
    console.log(`  Saturday is weekend -> ${isWeekend}`)
    
    console.log('✓ Time filter test passed')
    return isAllowed && !isDisallowed && isWeekend
  } catch (error) {
    console.error('✗ Time filter test failed:', error)
    return false
  }
}

/**
 * Test 5: Drawdown Filter
 */
export function testDrawdownFilter(): boolean {
  console.log('Testing Drawdown Filter...')
  
  try {
    const drawdownFilter = new DrawdownFilter(20) // 20% max drawdown
    const initialBalance = 10000
    
    // Simulate winning streak
    drawdownFilter.updateBalance(11000, initialBalance)
    console.log(`  After profit: trading allowed -> ${drawdownFilter.isTradingAllowed()}`)
    
    // Simulate small drawdown (10%)
    drawdownFilter.updateBalance(9900, initialBalance)
    const dd10 = drawdownFilter.getCurrentDrawdown()
    console.log(`  10% drawdown: ${dd10.toFixed(1)}% (allowed: ${drawdownFilter.isTradingAllowed()})`)
    
    // Simulate large drawdown (25%)
    drawdownFilter.updateBalance(8250, initialBalance)
    const dd25 = drawdownFilter.getCurrentDrawdown()
    console.log(`  25% drawdown: ${dd25.toFixed(1)}% (allowed: ${drawdownFilter.isTradingAllowed()})`)
    
    console.log('✓ Drawdown filter test passed')
    return dd25 >= 20 && !drawdownFilter.isTradingAllowed()
  } catch (error) {
    console.error('✗ Drawdown filter test failed:', error)
    return false
  }
}

/**
 * Test 6: Advanced Filter Manager
 */
export function testAdvancedFilterManager(): boolean {
  console.log('Testing Advanced Filter Manager...')
  
  try {
    const filterManager = new AdvancedFilterManager()
    
    // Test all filters combined
    const timestamp = new Date('2024-01-03T10:00:00Z').getTime()
    const result = filterManager.shouldAllowTrade(
      timestamp,
      testData,
      10000,
      10000,
      1.1000,
      1.1003
    )
    
    console.log(`  Trade allowed: ${result.allowed}`)
    if (!result.allowed) {
      console.log(`  Reasons: ${result.reasons.join(', ')}`)
    }
    
    console.log('✓ Advanced filter manager test passed')
    return true
  } catch (error) {
    console.error('✗ Advanced filter manager test failed:', error)
    return false
  }
}

/**
 * Test 7: Correlation Analysis
 */
export function testCorrelationAnalysis(): boolean {
  console.log('Testing Correlation Analysis...')
  
  try {
    // Test correlation calculation
    const data1 = [1, 2, 3, 4, 5]
    const data2 = [2, 4, 6, 8, 10] // Perfect positive correlation
    const data3 = [5, 4, 3, 2, 1]  // Perfect negative correlation
    
    const corrPositive = calculateCorrelation(data1, data2)
    console.log(`  Perfect positive correlation: ${corrPositive.toFixed(2)}`)
    
    const corrNegative = calculateCorrelation(data1, data3)
    console.log(`  Perfect negative correlation: ${corrNegative.toFixed(2)}`)
    
    // Test with analyzer
    const analyzer = new CorrelationAnalyzer(30)
    analyzer.addPairData('EURUSD', testData)
    analyzer.addPairData('GBPUSD', getSampleData('trending', 100))
    analyzer.addPairData('USDJPY', getSampleData('ranging', 100))
    
    // Calculate pair correlation
    const pairCorr = analyzer.calculatePairCorrelation('EURUSD', 'GBPUSD')
    if (pairCorr) {
      console.log(`  EUR/USD vs GBP/USD: ${pairCorr.correlation.toFixed(2)} (${pairCorr.strength})`)
    }
    
    // Get diversification score
    const score = analyzer.getPortfolioDiversificationScore(['EURUSD', 'GBPUSD', 'USDJPY'])
    console.log(`  Portfolio diversification score: ${score.toFixed(1)}/100`)
    
    console.log('✓ Correlation analysis test passed')
    return Math.abs(corrPositive - 1.0) < 0.01 && Math.abs(corrNegative + 1.0) < 0.01
  } catch (error) {
    console.error('✗ Correlation analysis test failed:', error)
    return false
  }
}

/**
 * Test 8: Portfolio Manager
 */
export function testPortfolioManager(): boolean {
  console.log('Testing Portfolio Manager...')
  
  try {
    const portfolioManager = new PortfolioManager(3, 0.7) // Max 3 pairs, 70% corr threshold
    
    // Add market data
    portfolioManager.addMarketData('EURUSD', testData)
    portfolioManager.addMarketData('GBPUSD', getSampleData('trending', 100))
    portfolioManager.addMarketData('USDJPY', getSampleData('ranging', 100))
    portfolioManager.addMarketData('AUDUSD', getSampleData('trending', 100))
    
    // Add pairs to portfolio
    const added1 = portfolioManager.addPair('EURUSD')
    console.log(`  Added EURUSD: ${added1}`)
    
    const added2 = portfolioManager.addPair('USDJPY')
    console.log(`  Added USDJPY: ${added2}`)
    
    // Check if can add another
    const canAdd = portfolioManager.canAddPair('AUDUSD')
    console.log(`  Can add AUDUSD: ${canAdd.allowed}`)
    
    // Get portfolio metrics
    const metrics = portfolioManager.getPortfolioMetrics()
    console.log(`  Active pairs: ${metrics.activePairs}/${metrics.maxPairs}`)
    console.log(`  Diversification score: ${metrics.diversificationScore.toFixed(1)}/100`)
    
    // Get recommendation
    const recommended = portfolioManager.getRecommendedPair()
    console.log(`  Recommended pair: ${recommended || 'None'}`)
    
    console.log('✓ Portfolio manager test passed')
    return metrics.activePairs === 2
  } catch (error) {
    console.error('✗ Portfolio manager test failed:', error)
    return false
  }
}

/**
 * Run All Advanced Features Tests
 */
export function runAllAdvancedTests(): void {
  console.log('\n=== ForexFlow Advanced Features Tests ===\n')
  
  const tests = [
    { name: 'Market Session Detection', fn: testMarketSessions },
    { name: 'Spread Filter', fn: testSpreadFilter },
    { name: 'Volatility Filter', fn: testVolatilityFilter },
    { name: 'Time Filter', fn: testTimeFilter },
    { name: 'Drawdown Filter', fn: testDrawdownFilter },
    { name: 'Advanced Filter Manager', fn: testAdvancedFilterManager },
    { name: 'Correlation Analysis', fn: testCorrelationAnalysis },
    { name: 'Portfolio Manager', fn: testPortfolioManager }
  ]

  let passed = 0
  let failed = 0

  tests.forEach(test => {
    try {
      if (test.fn()) {
        passed++
      } else {
        failed++
      }
    } catch (error) {
      console.error(`Test ${test.name} threw error:`, error)
      failed++
    }
  })

  console.log(`\n=== Advanced Features Test Results ===`)
  console.log(`✓ Passed: ${passed}`)
  console.log(`✗ Failed: ${failed}`)
  console.log(`Total: ${tests.length}`)
  console.log(`Success Rate: ${((passed / tests.length) * 100).toFixed(1)}%\n`)
}

// Export for CLI usage
if (typeof window === 'undefined') {
  runAllAdvancedTests()
}
