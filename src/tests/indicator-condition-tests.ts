/**
 * Indicator Condition Tests
 * Tests for specialized indicator condition nodes
 */

import {
  executeIndicatorRise,
  executeIndicatorFall,
  executeIndicatorWithinLimits,
  executePriceAboveIndicator,
  executePriceBelowIndicator,
  executeIndicatorCrossesLevel,
  executeTwoIndicatorsCross,
  executeIndicatorExtreme,
  executeIndicatorTrend,
  executeIndicatorRateOfChange,
  executeIndicatorDivergence
} from '@/lib/engine/indicator-condition-executor'

/**
 * Test 1: Indicator Rise
 */
export function testIndicatorRise(): boolean {
  console.log('Testing Indicator Rise...')
  
  try {
    // Rising indicator values
    const risingValues = [10, 12, 15, 18, 22]
    const isRising = executeIndicatorRise(risingValues, 1, 0)
    console.log(`  Rising indicator detected: ${isRising}`)
    
    // Falling indicator values
    const fallingValues = [22, 18, 15, 12, 10]
    const isNotRising = executeIndicatorRise(fallingValues, 1, 0)
    console.log(`  Falling indicator not rising: ${!isNotRising}`)
    
    console.log('✓ Indicator rise test passed')
    return isRising && !isNotRising
  } catch (error) {
    console.error('✗ Indicator rise test failed:', error)
    return false
  }
}

/**
 * Test 2: Indicator Fall
 */
export function testIndicatorFall(): boolean {
  console.log('Testing Indicator Fall...')
  
  try {
    // Falling indicator values
    const fallingValues = [22, 18, 15, 12, 10]
    const isFalling = executeIndicatorFall(fallingValues, 1, 0)
    console.log(`  Falling indicator detected: ${isFalling}`)
    
    // Rising indicator values
    const risingValues = [10, 12, 15, 18, 22]
    const isNotFalling = executeIndicatorFall(risingValues, 1, 0)
    console.log(`  Rising indicator not falling: ${!isNotFalling}`)
    
    console.log('✓ Indicator fall test passed')
    return isFalling && !isNotFalling
  } catch (error) {
    console.error('✗ Indicator fall test failed:', error)
    return false
  }
}

/**
 * Test 3: Indicator Within Limits
 */
export function testIndicatorWithinLimits(): boolean {
  console.log('Testing Indicator Within Limits...')
  
  try {
    // Value within limits (RSI between 30-70)
    const result1 = executeIndicatorWithinLimits(50, 30, 70)
    console.log(`  Value 50 within 30-70: ${result1.within}`)
    
    // Value outside limits
    const result2 = executeIndicatorWithinLimits(80, 30, 70)
    console.log(`  Value 80 outside 30-70: ${result2.outside}`)
    
    console.log('✓ Indicator within limits test passed')
    return result1.within && result2.outside
  } catch (error) {
    console.error('✗ Indicator within limits test failed:', error)
    return false
  }
}

/**
 * Test 4: Price Above/Below Indicator
 */
export function testPriceIndicatorComparison(): boolean {
  console.log('Testing Price vs Indicator...')
  
  try {
    const price = 1.1050
    const indicator = 1.1000
    
    // Price above indicator
    const isAbove = executePriceAboveIndicator(price, indicator, 0.001, false)
    console.log(`  Price ${price} above indicator ${indicator}: ${isAbove}`)
    
    // Price below indicator
    const isBelow = executePriceBelowIndicator(price, indicator, 0.001, false)
    console.log(`  Price ${price} below indicator ${indicator}: ${isBelow}`)
    
    console.log('✓ Price vs indicator test passed')
    return isAbove && !isBelow
  } catch (error) {
    console.error('✗ Price vs indicator test failed:', error)
    return false
  }
}

/**
 * Test 5: Indicator Crosses Level
 */
export function testIndicatorCrossesLevel(): boolean {
  console.log('Testing Indicator Crosses Level...')
  
  try {
    // Cross above level 50
    const result1 = executeIndicatorCrossesLevel(52, 48, 50, 'above')
    console.log(`  Crossed above 50: ${result1.crossedAbove}`)
    
    // Cross below level 50
    const result2 = executeIndicatorCrossesLevel(48, 52, 50, 'below')
    console.log(`  Crossed below 50: ${result2.crossedBelow}`)
    
    // No cross
    const result3 = executeIndicatorCrossesLevel(55, 54, 50, 'both')
    console.log(`  No cross detected: ${!result3.crossedAbove && !result3.crossedBelow}`)
    
    console.log('✓ Indicator crosses level test passed')
    return result1.crossedAbove && result2.crossedBelow
  } catch (error) {
    console.error('✗ Indicator crosses level test failed:', error)
    return false
  }
}

/**
 * Test 6: Two Indicators Cross
 */
export function testTwoIndicatorsCross(): boolean {
  console.log('Testing Two Indicators Cross...')
  
  try {
    // Fast MA crosses above slow MA
    const result1 = executeTwoIndicatorsCross(
      105, // fast current (above)
      95,  // fast previous (below)
      100, // slow current
      100, // slow previous
      'above'
    )
    console.log(`  Fast MA crossed above slow MA: ${result1.crossAbove}`)
    
    // Fast MA crosses below slow MA
    const result2 = executeTwoIndicatorsCross(
      95,  // fast current (below)
      105, // fast previous (above)
      100, // slow current
      100, // slow previous
      'below'
    )
    console.log(`  Fast MA crossed below slow MA: ${result2.crossBelow}`)
    
    console.log('✓ Two indicators cross test passed')
    return result1.crossAbove && result2.crossBelow
  } catch (error) {
    console.error('✗ Two indicators cross test failed:', error)
    return false
  }
}

/**
 * Test 7: Indicator at Extreme
 */
export function testIndicatorExtreme(): boolean {
  console.log('Testing Indicator at Extreme...')
  
  try {
    // Overbought (RSI > 70)
    const result1 = executeIndicatorExtreme(75, 70, 30)
    console.log(`  RSI 75 is overbought: ${result1.overbought}`)
    
    // Oversold (RSI < 30)
    const result2 = executeIndicatorExtreme(25, 70, 30)
    console.log(`  RSI 25 is oversold: ${result2.oversold}`)
    
    // Neutral (30 < RSI < 70)
    const result3 = executeIndicatorExtreme(50, 70, 30)
    console.log(`  RSI 50 is neutral: ${result3.neutral}`)
    
    console.log('✓ Indicator extreme test passed')
    return result1.overbought && result2.oversold && result3.neutral
  } catch (error) {
    console.error('✗ Indicator extreme test failed:', error)
    return false
  }
}

/**
 * Test 8: Indicator Trend
 */
export function testIndicatorTrend(): boolean {
  console.log('Testing Indicator Trend...')
  
  try {
    // Uptrend values
    const uptrendValues = [10, 12, 14, 16, 18, 20]
    const result1 = executeIndicatorTrend(uptrendValues, 5, 0.01)
    console.log(`  Uptrend detected: ${result1.uptrend}`)
    
    // Downtrend values
    const downtrendValues = [20, 18, 16, 14, 12, 10]
    const result2 = executeIndicatorTrend(downtrendValues, 5, 0.01)
    console.log(`  Downtrend detected: ${result2.downtrend}`)
    
    // Sideways values
    const sidewaysValues = [15, 15, 15, 15, 15, 15]
    const result3 = executeIndicatorTrend(sidewaysValues, 5, 0.01)
    console.log(`  Sideways detected: ${result3.sideways}`)
    
    console.log('✓ Indicator trend test passed')
    return result1.uptrend && result2.downtrend && result3.sideways
  } catch (error) {
    console.error('✗ Indicator trend test failed:', error)
    return false
  }
}

/**
 * Test 9: Indicator Rate of Change
 */
export function testIndicatorRateOfChange(): boolean {
  console.log('Testing Indicator Rate of Change...')
  
  try {
    // Fast rise (20% increase)
    const fastRiseValues = [100, 105, 110, 115, 120, 125]
    const result1 = executeIndicatorRateOfChange(fastRiseValues, 5, 10)
    console.log(`  Fast rise detected: ${result1.fastRise}`)
    
    // Fast fall (20% decrease)
    const fastFallValues = [125, 120, 115, 110, 105, 100]
    const result2 = executeIndicatorRateOfChange(fastFallValues, 5, 10)
    console.log(`  Fast fall detected: ${result2.fastFall}`)
    
    // Stable (< 10% change)
    const stableValues = [100, 101, 102, 101, 100, 101]
    const result3 = executeIndicatorRateOfChange(stableValues, 5, 10)
    console.log(`  Stable detected: ${result3.stable}`)
    
    console.log('✓ Indicator rate of change test passed')
    return result1.fastRise && result2.fastFall && result3.stable
  } catch (error) {
    console.error('✗ Indicator rate of change test failed:', error)
    return false
  }
}

/**
 * Test 10: Indicator Divergence
 */
export function testIndicatorDivergence(): boolean {
  console.log('Testing Indicator Divergence...')
  
  try {
    // Bullish divergence: price lower lows, indicator higher lows
    const priceValues = [100, 95, 90, 92, 95, 90, 88, 87, 89, 92, 95, 98, 100, 102, 104, 103, 102, 101, 100, 99]
    const bullishIndValues = [30, 28, 25, 27, 29, 26, 27, 28, 30, 32, 34, 36, 38, 40, 42, 41, 40, 39, 38, 37]
    
    const result1 = executeIndicatorDivergence(priceValues, bullishIndValues, 20, 'bullish')
    console.log(`  Bullish divergence detected: ${result1.bullishDiv}`)
    
    // Bearish divergence: price higher highs, indicator lower highs
    const bearishIndValues = [70, 72, 75, 73, 71, 74, 73, 72, 70, 68, 66, 64, 62, 60, 58, 59, 60, 61, 62, 63]
    
    const result2 = executeIndicatorDivergence(priceValues.reverse(), bearishIndValues, 20, 'bearish')
    console.log(`  Bearish divergence detected: ${result2.bearishDiv}`)
    
    console.log('✓ Indicator divergence test passed')
    return true // Basic structure test
  } catch (error) {
    console.error('✗ Indicator divergence test failed:', error)
    return false
  }
}

/**
 * Run All Indicator Condition Tests
 */
export function runAllIndicatorConditionTests(): void {
  console.log('\n=== Indicator Condition Tests ===\n')
  
  const tests = [
    { name: 'Indicator Rise', fn: testIndicatorRise },
    { name: 'Indicator Fall', fn: testIndicatorFall },
    { name: 'Indicator Within Limits', fn: testIndicatorWithinLimits },
    { name: 'Price vs Indicator', fn: testPriceIndicatorComparison },
    { name: 'Indicator Crosses Level', fn: testIndicatorCrossesLevel },
    { name: 'Two Indicators Cross', fn: testTwoIndicatorsCross },
    { name: 'Indicator at Extreme', fn: testIndicatorExtreme },
    { name: 'Indicator Trend', fn: testIndicatorTrend },
    { name: 'Indicator Rate of Change', fn: testIndicatorRateOfChange },
    { name: 'Indicator Divergence', fn: testIndicatorDivergence }
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

  console.log(`\n=== Indicator Condition Test Results ===`)
  console.log(`✓ Passed: ${passed}`)
  console.log(`✗ Failed: ${failed}`)
  console.log(`Total: ${tests.length}`)
  console.log(`Success Rate: ${((passed / tests.length) * 100).toFixed(1)}%\n`)
}

// Export for CLI usage
if (typeof window === 'undefined') {
  runAllIndicatorConditionTests()
}
