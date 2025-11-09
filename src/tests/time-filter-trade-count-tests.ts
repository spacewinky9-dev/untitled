/**
 * Time Filter and Trade/Order Count Tests
 * Tests for time-based filters and trade/order counting nodes
 */

import {
  executeTimeFilter,
  executeMonthsFilter,
  executeWeekdayFilter,
  executeHoursFilter,
  executeMinutesFilter,
  executeSecondsFilter,
  executeOncePerBar,
  executeOnceADay,
  executeOnceAnHour,
  executeOncePerMinutes,
  executeOncePerSeconds,
  executeOncePerTrades,
  executeEveryNTicks,
  executeEveryNBars,
  executeSpreadFilter
} from '@/lib/engine/time-filter-executor'

import {
  executeCheckTradesCount,
  executeCheckPendingOrdersCount,
  executeIfTrade,
  executeIfTradeOrder,
  executeIfPendingOrder,
  executeNoTrade,
  executeNoTradeOrder,
  executeNoPendingOrder,
  executeNoTradeNearby,
  executeNoPendingOrderNearby,
  TradeInfo,
  OrderInfo
} from '@/lib/engine/trade-order-count-executor'

/**
 * Test 1: Time Filter
 */
export function testTimeFilter(): boolean {
  console.log('Testing Time Filter...')
  
  try {
    // Test time within range (09:00-17:00)
    const morning = new Date('2024-01-01T10:00:00Z').getTime()
    const withinRange = executeTimeFilter(morning, 9, 0, 17, 0)
    console.log(`  10:00 within 09:00-17:00: ${withinRange}`)
    
    // Test time outside range
    const night = new Date('2024-01-01T22:00:00Z').getTime()
    const outsideRange = executeTimeFilter(night, 9, 0, 17, 0)
    console.log(`  22:00 outside 09:00-17:00: ${!outsideRange}`)
    
    // Test overnight range (22:00-02:00)
    const lateNight = new Date('2024-01-01T23:00:00Z').getTime()
    const overnightRange = executeTimeFilter(lateNight, 22, 0, 2, 0)
    console.log(`  23:00 within 22:00-02:00: ${overnightRange}`)
    
    console.log('✓ Time filter test passed')
    return withinRange && !outsideRange && overnightRange
  } catch (error) {
    console.error('✗ Time filter test failed:', error)
    return false
  }
}

/**
 * Test 2: Weekday Filter
 */
export function testWeekdayFilter(): boolean {
  console.log('Testing Weekday Filter...')
  
  try {
    // Monday (1)
    const monday = new Date('2024-01-01T10:00:00Z').getTime() // Jan 1, 2024 is Monday
    const isMonday = executeWeekdayFilter(monday, [1, 2, 3, 4, 5])
    console.log(`  Monday allowed: ${isMonday}`)
    
    // Sunday (7)
    const sunday = new Date('2024-01-07T10:00:00Z').getTime()
    const isSunday = executeWeekdayFilter(sunday, [1, 2, 3, 4, 5])
    console.log(`  Sunday not allowed: ${!isSunday}`)
    
    console.log('✓ Weekday filter test passed')
    return isMonday && !isSunday
  } catch (error) {
    console.error('✗ Weekday filter test failed:', error)
    return false
  }
}

/**
 * Test 3: Once Per Bar
 */
export function testOncePerBar(): boolean {
  console.log('Testing Once Per Bar...')
  
  try {
    const lastBarTime = new Date('2024-01-01T10:00:00Z').getTime()
    const currentBarTime = new Date('2024-01-01T10:01:00Z').getTime()
    
    // New bar
    const isNewBar = executeOncePerBar(lastBarTime, currentBarTime)
    console.log(`  New bar detected: ${isNewBar}`)
    
    // Same bar
    const isSameBar = executeOncePerBar(currentBarTime, currentBarTime)
    console.log(`  Same bar prevented: ${!isSameBar}`)
    
    console.log('✓ Once per bar test passed')
    return isNewBar && !isSameBar
  } catch (error) {
    console.error('✗ Once per bar test failed:', error)
    return false
  }
}

/**
 * Test 4: Every N Ticks/Bars
 */
export function testEveryN(): boolean {
  console.log('Testing Every N Ticks/Bars...')
  
  try {
    // Every 10 ticks
    const tick10 = executeEveryNTicks(10, 10)
    const tick11 = executeEveryNTicks(11, 10)
    console.log(`  Tick 10 triggers: ${tick10}`)
    console.log(`  Tick 11 doesn't trigger: ${!tick11}`)
    
    // Every 5 bars
    const bar5 = executeEveryNBars(5, 5)
    const bar6 = executeEveryNBars(6, 5)
    console.log(`  Bar 5 triggers: ${bar5}`)
    console.log(`  Bar 6 doesn't trigger: ${!bar6}`)
    
    console.log('✓ Every N test passed')
    return tick10 && !tick11 && bar5 && !bar6
  } catch (error) {
    console.error('✗ Every N test failed:', error)
    return false
  }
}

/**
 * Test 5: Spread Filter
 */
export function testSpreadFilter(): boolean {
  console.log('Testing Spread Filter...')
  
  try {
    // Tight spread (2 pips)
    const tightSpread = executeSpreadFilter(1.1000, 1.1002, 3, 0.0001)
    console.log(`  2 pips <= 3 pips: ${tightSpread}`)
    
    // Wide spread (5 pips)
    const wideSpread = executeSpreadFilter(1.1000, 1.1005, 3, 0.0001)
    console.log(`  5 pips > 3 pips: ${!wideSpread}`)
    
    console.log('✓ Spread filter test passed')
    return tightSpread && !wideSpread
  } catch (error) {
    console.error('✗ Spread filter test failed:', error)
    return false
  }
}

/**
 * Test 6: Check Trades Count
 */
export function testCheckTradesCount(): boolean {
  console.log('Testing Check Trades Count...')
  
  try {
    const trades: TradeInfo[] = [
      { id: '1', type: 'buy', openPrice: 1.1000, currentPrice: 1.1010, lots: 0.1, profit: 10 },
      { id: '2', type: 'sell', openPrice: 1.1020, currentPrice: 1.1015, lots: 0.1, profit: 5 }
    ]
    
    // Equal to 2
    const equal2 = executeCheckTradesCount(trades, 'equal', 2)
    console.log(`  Has exactly 2 trades: ${equal2}`)
    
    // Greater than 1
    const greater1 = executeCheckTradesCount(trades, 'greater', 1)
    console.log(`  Has more than 1 trade: ${greater1}`)
    
    // Less than 3
    const less3 = executeCheckTradesCount(trades, 'less', 3)
    console.log(`  Has less than 3 trades: ${less3}`)
    
    console.log('✓ Check trades count test passed')
    return equal2 && greater1 && less3
  } catch (error) {
    console.error('✗ Check trades count test failed:', error)
    return false
  }
}

/**
 * Test 7: If Trade
 */
export function testIfTrade(): boolean {
  console.log('Testing If Trade...')
  
  try {
    const trades: TradeInfo[] = [
      { id: '1', type: 'buy', openPrice: 1.1000, currentPrice: 1.1010, lots: 0.1, profit: 10 },
      { id: '2', type: 'sell', openPrice: 1.1020, currentPrice: 1.1015, lots: 0.1, profit: 5 }
    ]
    
    // Any trade
    const hasAny = executeIfTrade(trades, 'any')
    console.log(`  Has any trade: ${hasAny}`)
    
    // Buy trade
    const hasBuy = executeIfTrade(trades, 'buy')
    console.log(`  Has buy trade: ${hasBuy}`)
    
    // No trades
    const noTrades = executeIfTrade([], 'any')
    console.log(`  No trades: ${!noTrades}`)
    
    console.log('✓ If trade test passed')
    return hasAny && hasBuy && !noTrades
  } catch (error) {
    console.error('✗ If trade test failed:', error)
    return false
  }
}

/**
 * Test 8: No Trade Nearby
 */
export function testNoTradeNearby(): boolean {
  console.log('Testing No Trade Nearby...')
  
  try {
    const trades: TradeInfo[] = [
      { id: '1', type: 'buy', openPrice: 1.1000, currentPrice: 1.1010, lots: 0.1, profit: 10 }
    ]
    
    // Price far from trade (100 pips away)
    const farPrice = 1.1100
    const noNearby = executeNoTradeNearby(trades, farPrice, 50, 0.0001)
    console.log(`  No trade within 50 pips: ${noNearby}`)
    
    // Price near trade (10 pips away)
    const nearPrice = 1.1010
    const hasNearby = executeNoTradeNearby(trades, nearPrice, 50, 0.0001)
    console.log(`  Trade within 50 pips: ${!hasNearby}`)
    
    console.log('✓ No trade nearby test passed')
    return noNearby && !hasNearby
  } catch (error) {
    console.error('✗ No trade nearby test failed:', error)
    return false
  }
}

/**
 * Test 9: Check Pending Orders
 */
export function testCheckPendingOrders(): boolean {
  console.log('Testing Check Pending Orders...')
  
  try {
    const orders: OrderInfo[] = [
      { id: '1', type: 'buy_limit', price: 1.0950, lots: 0.1 },
      { id: '2', type: 'sell_stop', price: 1.1050, lots: 0.1 }
    ]
    
    // Has 2 orders
    const hasOrders = executeCheckPendingOrdersCount(orders, 'equal', 2)
    console.log(`  Has 2 pending orders: ${hasOrders}`)
    
    // Has buy_limit order
    const hasBuyLimit = executeIfPendingOrder(orders, 'buy_limit')
    console.log(`  Has buy_limit order: ${hasBuyLimit}`)
    
    // No orders
    const noOrders = executeNoPendingOrder([])
    console.log(`  No orders: ${noOrders}`)
    
    console.log('✓ Check pending orders test passed')
    return hasOrders && hasBuyLimit && noOrders
  } catch (error) {
    console.error('✗ Check pending orders test failed:', error)
    return false
  }
}

/**
 * Test 10: Trade/Order Combined
 */
export function testTradeOrderCombined(): boolean {
  console.log('Testing Trade/Order Combined...')
  
  try {
    const trades: TradeInfo[] = [
      { id: '1', type: 'buy', openPrice: 1.1000, currentPrice: 1.1010, lots: 0.1, profit: 10 }
    ]
    const orders: OrderInfo[] = [
      { id: '1', type: 'buy_limit', price: 1.0950, lots: 0.1 }
    ]
    
    // Has trades or orders
    const hasAny = executeIfTradeOrder(trades, orders, 'any')
    console.log(`  Has trades or orders: ${hasAny}`)
    
    // No trades and no orders
    const noAny = executeNoTradeOrder([], [])
    console.log(`  No trades and no orders: ${noAny}`)
    
    console.log('✓ Trade/order combined test passed')
    return hasAny && noAny
  } catch (error) {
    console.error('✗ Trade/order combined test failed:', error)
    return false
  }
}

/**
 * Run All Time Filter and Trade Count Tests
 */
export function runAllTimeFilterTradeCountTests(): void {
  console.log('\n=== Time Filter & Trade/Order Count Tests ===\n')
  
  const tests = [
    { name: 'Time Filter', fn: testTimeFilter },
    { name: 'Weekday Filter', fn: testWeekdayFilter },
    { name: 'Once Per Bar', fn: testOncePerBar },
    { name: 'Every N Ticks/Bars', fn: testEveryN },
    { name: 'Spread Filter', fn: testSpreadFilter },
    { name: 'Check Trades Count', fn: testCheckTradesCount },
    { name: 'If Trade', fn: testIfTrade },
    { name: 'No Trade Nearby', fn: testNoTradeNearby },
    { name: 'Check Pending Orders', fn: testCheckPendingOrders },
    { name: 'Trade/Order Combined', fn: testTradeOrderCombined }
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

  console.log(`\n=== Test Results ===`)
  console.log(`✓ Passed: ${passed}`)
  console.log(`✗ Failed: ${failed}`)
  console.log(`Total: ${tests.length}`)
  console.log(`Success Rate: ${((passed / tests.length) * 100).toFixed(1)}%\n`)
}

// Export for CLI usage
if (typeof window === 'undefined') {
  runAllTimeFilterTradeCountTests()
}
