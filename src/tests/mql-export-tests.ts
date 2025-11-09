/**
 * MQL Export Testing Utilities
 * Tests MQL4/MQL5 code generation
 */

import { exportToMQL, MQLVersion } from '@/lib/mql-export'
import { Strategy } from '@/types/strategy'
import { writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

/**
 * Test Strategy 1: Simple RSI Strategy
 * Tests basic indicator + condition + action flow
 */
export function createRSIStrategy(): Strategy {
  return {
    id: 'mql-test-rsi',
    name: 'RSI Oversold Strategy',
    description: 'Buy when RSI < 30, Sell when RSI > 70',
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
          label: 'RSI(14)',
          type: 'indicator',
          indicatorId: 'rsi',
          indicatorType: 'rsi',
          parameters: { period: 14 }
        }
      },
      {
        id: 'condition-1',
        type: 'condition',
        position: { x: 300, y: -50 },
        data: {
          label: 'RSI < 30',
          type: 'condition',
          operator: 'lt',
          parameters: { threshold: 30 }
        }
      },
      {
        id: 'condition-2',
        type: 'condition',
        position: { x: 300, y: 50 },
        data: {
          label: 'RSI > 70',
          type: 'condition',
          operator: 'gt',
          parameters: { threshold: 70 }
        }
      },
      {
        id: 'action-1',
        type: 'action',
        position: { x: 450, y: -50 },
        data: {
          label: 'Buy',
          type: 'action',
          action: 'buy',
          actionType: 'buy',
          parameters: { lots: 0.01 }
        }
      },
      {
        id: 'action-2',
        type: 'action',
        position: { x: 450, y: 50 },
        data: {
          label: 'Sell',
          type: 'action',
          action: 'sell',
          actionType: 'sell',
          parameters: { lots: 0.01 }
        }
      }
    ],
    edges: [
      { id: 'e1', source: 'event-1', target: 'rsi-1' },
      { id: 'e2', source: 'rsi-1', target: 'condition-1' },
      { id: 'e3', source: 'rsi-1', target: 'condition-2' },
      { id: 'e4', source: 'condition-1', target: 'action-1' },
      { id: 'e5', source: 'condition-2', target: 'action-2' }
    ],
    settings: {}
  }
}

/**
 * Test Strategy 2: MA Crossover with Logic Gates
 * Tests multiple indicators + logic gates
 */
export function createMACrossStrategy(): Strategy {
  return {
    id: 'mql-test-ma-cross',
    name: 'MA Crossover Strategy',
    description: 'Buy on SMA(20) cross above SMA(50) AND price > SMA(200)',
    nodes: [
      {
        id: 'event-1',
        type: 'event',
        position: { x: 0, y: 0 },
        data: { label: 'OnTick', type: 'event', parameters: {} }
      },
      {
        id: 'sma-20',
        type: 'indicator',
        position: { x: 150, y: -50 },
        data: {
          label: 'SMA(20)',
          type: 'indicator',
          indicatorId: 'sma',
          indicatorType: 'sma',
          parameters: { period: 20 }
        }
      },
      {
        id: 'sma-50',
        type: 'indicator',
        position: { x: 150, y: 50 },
        data: {
          label: 'SMA(50)',
          type: 'indicator',
          indicatorId: 'sma',
          indicatorType: 'sma',
          parameters: { period: 50 }
        }
      },
      {
        id: 'condition-1',
        type: 'condition',
        position: { x: 300, y: 0 },
        data: {
          label: 'Cross Above',
          type: 'condition',
          operator: 'cross_above',
          parameters: { threshold: 0 }
        }
      },
      {
        id: 'logic-1',
        type: 'logic',
        position: { x: 450, y: 0 },
        data: {
          label: 'AND',
          type: 'logic',
          logicType: 'AND',
          parameters: {}
        }
      },
      {
        id: 'action-1',
        type: 'action',
        position: { x: 600, y: 0 },
        data: {
          label: 'Buy',
          type: 'action',
          action: 'buy',
          actionType: 'buy',
          parameters: { lots: 0.01 }
        }
      }
    ],
    edges: [
      { id: 'e1', source: 'event-1', target: 'sma-20' },
      { id: 'e2', source: 'event-1', target: 'sma-50' },
      { id: 'e3', source: 'sma-20', target: 'condition-1' },
      { id: 'e4', source: 'sma-50', target: 'condition-1' },
      { id: 'e5', source: 'condition-1', target: 'logic-1' },
      { id: 'e6', source: 'logic-1', target: 'action-1' }
    ],
    settings: {}
  }
}

/**
 * Test Strategy 3: Multi-Indicator with Risk Management
 * Tests complex strategy with risk nodes
 */
export function createComplexStrategy(): Strategy {
  return {
    id: 'mql-test-complex',
    name: 'Multi-Indicator Strategy',
    description: 'MACD + RSI + Risk Management',
    nodes: [
      {
        id: 'event-1',
        type: 'event',
        position: { x: 0, y: 0 },
        data: { label: 'OnTick', type: 'event', parameters: {} }
      },
      {
        id: 'macd-1',
        type: 'indicator',
        position: { x: 150, y: -50 },
        data: {
          label: 'MACD',
          type: 'indicator',
          indicatorId: 'macd',
          indicatorType: 'macd',
          parameters: { fastPeriod: 12, slowPeriod: 26, signalPeriod: 9 }
        }
      },
      {
        id: 'rsi-1',
        type: 'indicator',
        position: { x: 150, y: 50 },
        data: {
          label: 'RSI(14)',
          type: 'indicator',
          indicatorId: 'rsi',
          indicatorType: 'rsi',
          parameters: { period: 14 }
        }
      },
      {
        id: 'risk-1',
        type: 'risk',
        position: { x: 300, y: 100 },
        data: {
          label: 'Stop Loss',
          type: 'risk',
          riskType: 'stop_loss',
          parameters: { pips: 50 }
        }
      },
      {
        id: 'risk-2',
        type: 'risk',
        position: { x: 300, y: 150 },
        data: {
          label: 'Take Profit',
          type: 'risk',
          riskType: 'take_profit',
          parameters: { pips: 100 }
        }
      },
      {
        id: 'action-1',
        type: 'action',
        position: { x: 450, y: 0 },
        data: {
          label: 'Buy',
          type: 'action',
          action: 'buy',
          actionType: 'buy',
          parameters: { lots: 0.01 }
        }
      }
    ],
    edges: [
      { id: 'e1', source: 'event-1', target: 'macd-1' },
      { id: 'e2', source: 'event-1', target: 'rsi-1' },
      { id: 'e3', source: 'macd-1', target: 'action-1' },
      { id: 'e4', source: 'rsi-1', target: 'action-1' },
      { id: 'e5', source: 'risk-1', target: 'action-1' },
      { id: 'e6', source: 'risk-2', target: 'action-1' }
    ],
    settings: {}
  }
}

/**
 * Generate and save MQL code for testing
 */
export function generateMQLTestFiles(): void {
  console.log('\n=== Generating MQL Test Files ===\n')

  const outputDir = join(process.cwd(), 'mql-test-output')
  
  try {
    mkdirSync(outputDir, { recursive: true })
  } catch (error) {
    // Directory might already exist
  }

  const strategies = [
    { name: 'RSI_Oversold', strategy: createRSIStrategy() },
    { name: 'MA_Crossover', strategy: createMACrossStrategy() },
    { name: 'Multi_Indicator', strategy: createComplexStrategy() }
  ]

  const versions: MQLVersion[] = ['mql4', 'mql5']

  strategies.forEach(({ name, strategy }) => {
    versions.forEach(version => {
      const ext = version === 'mql4' ? 'mq4' : 'mq5'
      const filename = `${name}_EA.${ext}`
      const filepath = join(outputDir, filename)

      try {
        const mqlCode = exportToMQL(strategy, {
          version,
          expertName: name,
          magicNumber: 12345
        })

        writeFileSync(filepath, mqlCode, 'utf-8')
        console.log(`✓ Generated: ${filename}`)
      } catch (error) {
        console.error(`✗ Failed to generate ${filename}:`, error)
      }
    })
  })

  console.log(`\n✓ All MQL test files generated in: ${outputDir}`)
  console.log('\nNext Steps:')
  console.log('1. Open MetaTrader 4/5')
  console.log('2. Copy .mq4 files to: MetaTrader/MQL4/Experts/')
  console.log('3. Copy .mq5 files to: MetaTrader/MQL5/Experts/')
  console.log('4. Compile in MetaEditor')
  console.log('5. Run Strategy Tester to verify\n')
}

/**
 * Validate MQL code structure
 */
export function validateMQLCode(code: string): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  // Check for required MQL4/5 structure elements
  if (!code.includes('OnInit')) {
    errors.push('Missing OnInit() function')
  }
  if (!code.includes('OnDeinit')) {
    errors.push('Missing OnDeinit() function')
  }
  if (!code.includes('OnTick')) {
    errors.push('Missing OnTick() function')
  }

  // Check for property declarations
  if (!code.includes('#property')) {
    errors.push('Missing #property declarations')
  }

  // Check for input parameters
  if (!code.includes('input')) {
    errors.push('Warning: No input parameters defined')
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * Test MQL export for all strategies
 */
export function testMQLExport(): void {
  console.log('\n=== Testing MQL Export ===\n')

  const strategies = [
    { name: 'RSI Strategy', strategy: createRSIStrategy() },
    { name: 'MA Crossover', strategy: createMACrossStrategy() },
    { name: 'Complex Strategy', strategy: createComplexStrategy() }
  ]

  let passed = 0
  let failed = 0

  strategies.forEach(({ name, strategy }) => {
    console.log(`Testing: ${name}`)

    // Test MQL4
    try {
      const mql4Code = exportToMQL(strategy, {
        version: 'mql4',
        expertName: name.replace(/\s/g, '_'),
        magicNumber: 12345
      })

      const validation = validateMQLCode(mql4Code)
      if (validation.valid) {
        console.log(`  ✓ MQL4 code generated successfully`)
        passed++
      } else {
        console.log(`  ✗ MQL4 validation failed:`)
        validation.errors.forEach(err => console.log(`    - ${err}`))
        failed++
      }
    } catch (error) {
      console.log(`  ✗ MQL4 generation failed:`, error)
      failed++
    }

    // Test MQL5
    try {
      const mql5Code = exportToMQL(strategy, {
        version: 'mql5',
        expertName: name.replace(/\s/g, '_'),
        magicNumber: 12345
      })

      const validation = validateMQLCode(mql5Code)
      if (validation.valid) {
        console.log(`  ✓ MQL5 code generated successfully`)
        passed++
      } else {
        console.log(`  ✗ MQL5 validation failed:`)
        validation.errors.forEach(err => console.log(`    - ${err}`))
        failed++
      }
    } catch (error) {
      console.log(`  ✗ MQL5 generation failed:`, error)
      failed++
    }

    console.log('')
  })

  console.log('=== MQL Export Test Results ===')
  console.log(`✓ Passed: ${passed}`)
  console.log(`✗ Failed: ${failed}`)
  console.log(`Total: ${passed + failed}`)
  console.log(`Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%\n`)
}

// CLI usage
if (typeof window === 'undefined') {
  const args = process.argv.slice(2)
  if (args.includes('--generate')) {
    generateMQLTestFiles()
  } else if (args.includes('--test')) {
    testMQLExport()
  } else {
    console.log('MQL Export Testing Utilities')
    console.log('Usage:')
    console.log('  --test      Run validation tests')
    console.log('  --generate  Generate MQL files for manual testing')
  }
}
