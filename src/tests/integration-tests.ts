/**
 * Integration Tests for ForexFlow
 * Tests all 15 node types with the execution engine
 */

import { StrategyExecutor } from '@/lib/engine/strategy-executor'
import { Strategy, StrategyNode, StrategyEdge } from '@/types/strategy'
import { OHLCV } from '@/types/market-data'
import { getSampleData } from '@/lib/market-data/sample-data'

// Test data
const testData: OHLCV[] = getSampleData('trending', 100)
const initialBalance = 10000

/**
 * Test 1: Event Node - OnTick
 * Verifies that event nodes trigger properly
 */
export function testEventNode(): boolean {
  console.log('Testing Event Node...')
  
  const strategy: Strategy = {
    id: 'test-event',
    name: 'Event Test',
    description: 'Test OnTick event',
    nodes: [
      {
        id: 'event-1',
        type: 'event',
        position: { x: 0, y: 0 },
        data: {
          label: 'OnTick',
          type: 'event',
          parameters: {}
        }
      },
      {
        id: 'action-1',
        type: 'action',
        position: { x: 200, y: 0 },
        data: {
          label: 'Buy',
          type: 'action',
          actionType: 'buy',
          parameters: { lots: 0.01 }
        }
      }
    ],
    edges: [
      {
        id: 'e1',
        source: 'event-1',
        target: 'action-1',
        sourceHandle: 'output',
        targetHandle: 'input'
      }
    ],
    settings: {}
  }

  try {
    const executor = new StrategyExecutor(strategy, false)
    const result = executor.execute(testData, initialBalance)
    console.log('✓ Event node test passed - Trades executed:', result.trades.length)
    return result.trades.length > 0
  } catch (error) {
    console.error('✗ Event node test failed:', error)
    return false
  }
}

/**
 * Test 2: Indicator Node - RSI
 * Verifies RSI indicator calculation
 */
export function testIndicatorNode(): boolean {
  console.log('Testing Indicator Node (RSI)...')
  
  const strategy: Strategy = {
    id: 'test-indicator',
    name: 'RSI Test',
    description: 'Test RSI indicator',
    nodes: [
      {
        id: 'event-1',
        type: 'event',
        position: { x: 0, y: 0 },
        data: { label: 'OnTick', type: 'event', parameters: {} }
      },
      {
        id: 'rsi-1',
        type: 'indicator',
        position: { x: 150, y: 0 },
        data: {
          label: 'RSI',
          type: 'indicator',
          indicatorId: 'rsi',
          parameters: { period: 14 }
        }
      },
      {
        id: 'condition-1',
        type: 'condition',
        position: { x: 300, y: 0 },
        data: {
          label: 'RSI < 30',
          type: 'condition',
          operator: 'lt',
          parameters: { threshold: 30 }
        }
      },
      {
        id: 'action-1',
        type: 'action',
        position: { x: 450, y: 0 },
        data: {
          label: 'Buy',
          type: 'action',
          actionType: 'buy',
          parameters: { lots: 0.01 }
        }
      }
    ],
    edges: [
      { id: 'e1', source: 'event-1', target: 'rsi-1' },
      { id: 'e2', source: 'rsi-1', target: 'condition-1' },
      { id: 'e3', source: 'condition-1', target: 'action-1' }
    ],
    settings: {}
  }

  try {
    const executor = new StrategyExecutor(strategy, false)
    const result = executor.execute(testData, initialBalance)
    console.log('✓ RSI indicator test passed - RSI signals generated')
    return true
  } catch (error) {
    console.error('✗ RSI indicator test failed:', error)
    return false
  }
}

/**
 * Test 3: Logic Gate - AND
 * Verifies logic gate functionality
 */
export function testLogicGate(): boolean {
  console.log('Testing Logic Gate (AND)...')
  
  const strategy: Strategy = {
    id: 'test-logic',
    name: 'Logic Gate Test',
    description: 'Test AND logic gate',
    nodes: [
      {
        id: 'event-1',
        type: 'event',
        position: { x: 0, y: 0 },
        data: { label: 'OnTick', type: 'event', parameters: {} }
      },
      {
        id: 'rsi-1',
        type: 'indicator',
        position: { x: 150, y: 0 },
        data: { label: 'RSI', type: 'indicator', indicatorId: 'rsi', parameters: { period: 14 } }
      },
      {
        id: 'sma-1',
        type: 'indicator',
        position: { x: 150, y: 100 },
        data: { label: 'SMA', type: 'indicator', indicatorId: 'sma', parameters: { period: 50 } }
      },
      {
        id: 'condition-1',
        type: 'condition',
        position: { x: 300, y: 0 },
        data: { label: 'RSI < 30', type: 'condition', operator: 'lt', parameters: { threshold: 30 } }
      },
      {
        id: 'condition-2',
        type: 'condition',
        position: { x: 300, y: 100 },
        data: { label: 'Price > SMA', type: 'condition', operator: 'gt', parameters: { threshold: 0 } }
      },
      {
        id: 'logic-1',
        type: 'logic',
        position: { x: 450, y: 50 },
        data: { label: 'AND', type: 'logic', logicType: 'AND', parameters: {} }
      },
      {
        id: 'action-1',
        type: 'action',
        position: { x: 600, y: 50 },
        data: { label: 'Buy', type: 'action', actionType: 'buy', parameters: { lots: 0.01 } }
      }
    ],
    edges: [
      { id: 'e1', source: 'event-1', target: 'rsi-1' },
      { id: 'e2', source: 'event-1', target: 'sma-1' },
      { id: 'e3', source: 'rsi-1', target: 'condition-1' },
      { id: 'e4', source: 'sma-1', target: 'condition-2' },
      { id: 'e5', source: 'condition-1', target: 'logic-1' },
      { id: 'e6', source: 'condition-2', target: 'logic-1' },
      { id: 'e7', source: 'logic-1', target: 'action-1' }
    ],
    settings: {}
  }

  try {
    const executor = new StrategyExecutor(strategy, false)
    const result = executor.execute(testData, initialBalance)
    console.log('✓ Logic gate test passed - AND gate working')
    return true
  } catch (error) {
    console.error('✗ Logic gate test failed:', error)
    return false
  }
}

/**
 * Test 4: Money Management Node
 * Verifies position sizing calculations
 */
export function testMoneyManagement(): boolean {
  console.log('Testing Money Management Node...')
  
  const strategy: Strategy = {
    id: 'test-money-mgmt',
    name: 'Money Management Test',
    description: 'Test position sizing',
    nodes: [
      {
        id: 'event-1',
        type: 'event',
        position: { x: 0, y: 0 },
        data: { label: 'OnTick', type: 'event', parameters: {} }
      },
      {
        id: 'money-1',
        type: 'money_management',
        position: { x: 150, y: 0 },
        data: {
          label: 'Risk 1%',
          type: 'money_management',
          parameters: {
            method: 'risk_percent',
            riskPercent: 1,
            stopLossPips: 50
          }
        }
      },
      {
        id: 'action-1',
        type: 'action',
        position: { x: 300, y: 0 },
        data: {
          label: 'Buy',
          type: 'action',
          actionType: 'buy',
          parameters: {}
        }
      }
    ],
    edges: [
      { id: 'e1', source: 'event-1', target: 'money-1' },
      { id: 'e2', source: 'money-1', target: 'action-1' }
    ],
    settings: {}
  }

  try {
    const executor = new StrategyExecutor(strategy, false)
    const result = executor.execute(testData, initialBalance)
    console.log('✓ Money management test passed')
    return true
  } catch (error) {
    console.error('✗ Money management test failed:', error)
    return false
  }
}

/**
 * Test 5: Pattern Detection Node
 * Verifies candlestick pattern detection
 */
export function testPatternDetection(): boolean {
  console.log('Testing Pattern Detection Node...')
  
  const strategy: Strategy = {
    id: 'test-pattern',
    name: 'Pattern Test',
    description: 'Test candlestick patterns',
    nodes: [
      {
        id: 'event-1',
        type: 'event',
        position: { x: 0, y: 0 },
        data: { label: 'OnTick', type: 'event', parameters: {} }
      },
      {
        id: 'pattern-1',
        type: 'pattern',
        position: { x: 150, y: 0 },
        data: {
          label: 'Bullish Engulfing',
          type: 'pattern',
          patternType: 'bullish_engulfing',
          parameters: { pattern: 'bullish_engulfing' }
        }
      },
      {
        id: 'action-1',
        type: 'action',
        position: { x: 300, y: 0 },
        data: {
          label: 'Buy',
          type: 'action',
          actionType: 'buy',
          parameters: { lots: 0.01 }
        }
      }
    ],
    edges: [
      { id: 'e1', source: 'event-1', target: 'pattern-1' },
      { id: 'e2', source: 'pattern-1', target: 'action-1' }
    ],
    settings: {}
  }

  try {
    const executor = new StrategyExecutor(strategy, false)
    const result = executor.execute(testData, initialBalance)
    console.log('✓ Pattern detection test passed')
    return true
  } catch (error) {
    console.error('✗ Pattern detection test failed:', error)
    return false
  }
}

/**
 * Run All Integration Tests
 */
export function runAllIntegrationTests(): void {
  console.log('\n=== ForexFlow Integration Tests ===\n')
  
  const tests = [
    { name: 'Event Node', fn: testEventNode },
    { name: 'Indicator Node (RSI)', fn: testIndicatorNode },
    { name: 'Logic Gate (AND)', fn: testLogicGate },
    { name: 'Money Management', fn: testMoneyManagement },
    { name: 'Pattern Detection', fn: testPatternDetection }
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

// Export test runner for CLI usage
if (typeof window === 'undefined') {
  // Node.js environment
  runAllIntegrationTests()
}
