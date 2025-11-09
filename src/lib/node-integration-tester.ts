import { StrategyExecutor } from '@/lib/engine/strategy-executor'
import { Strategy } from '@/types/strategy'
import { OHLCV } from '@/types/market-data'
import { generateRandomWalkData } from '@/lib/market-data/sample-data'

export interface NodeTestResult {
  nodeType: string
  nodeSubtype?: string
  tested: boolean
  passed: boolean
  error?: string
  executionTime?: number
}

export interface IntegrationTestResult {
  passed: boolean
  totalTests: number
  passedTests: number
  failedTests: number
  results: NodeTestResult[]
  overallExecutionTime: number
}

export class NodeIntegrationTester {
  private testData: OHLCV[]

  constructor() {
    this.testData = generateRandomWalkData(100, 'EURUSD', 1.1000)
  }

  async runAllTests(): Promise<IntegrationTestResult> {
    const startTime = performance.now()
    const results: NodeTestResult[] = []

    results.push(...await this.testIndicatorNodes())
    results.push(...await this.testConditionNodes())
    results.push(...await this.testLogicNodes())
    results.push(...await this.testActionNodes())
    results.push(...await this.testRiskNodes())
    results.push(...await this.testAdvancedNodes())

    const endTime = performance.now()
    const passedTests = results.filter(r => r.passed).length
    const failedTests = results.filter(r => !r.passed).length

    return {
      passed: failedTests === 0,
      totalTests: results.length,
      passedTests,
      failedTests,
      results,
      overallExecutionTime: endTime - startTime
    }
  }

  private async testIndicatorNodes(): Promise<NodeTestResult[]> {
    const indicators = [
      { type: 'sma', params: { period: 20 } },
      { type: 'ema', params: { period: 20 } },
      { type: 'wma', params: { period: 20 } },
      { type: 'rsi', params: { period: 14 } },
      { type: 'macd', params: { fastPeriod: 12, slowPeriod: 26, signalPeriod: 9 } },
      { type: 'bb', params: { period: 20, stdDev: 2 } },
      { type: 'atr', params: { period: 14 } },
      { type: 'stochastic', params: { kPeriod: 14, dPeriod: 3, slowing: 3 } },
      { type: 'cci', params: { period: 14 } },
      { type: 'adx', params: { period: 14 } },
      { type: 'williams', params: { period: 14 } },
      { type: 'sar', params: { step: 0.02, maximum: 0.2 } },
      { type: 'obv', params: {} },
      { type: 'vwap', params: {} }
    ]

    const results: NodeTestResult[] = []

    for (const indicator of indicators) {
      const result = await this.testIndicator(indicator.type, indicator.params)
      results.push(result)
    }

    return results
  }

  private async testIndicator(indicatorType: string, params: any): Promise<NodeTestResult> {
    const startTime = performance.now()
    
    try {
      const strategy: Strategy = {
        id: 'test',
        name: `Test ${indicatorType}`,
        description: '',
        nodes: [
          {
            id: 'event_1',
            type: 'event',
            position: { x: 0, y: 0 },
            data: { label: 'OnTick', eventType: 'onTick' }
          },
          {
            id: 'indicator_1',
            type: 'indicator',
            position: { x: 200, y: 0 },
            data: {
              label: indicatorType.toUpperCase(),
              indicatorType,
              parameters: params
            }
          }
        ],
        edges: [
          {
            id: 'e1',
            source: 'event_1',
            target: 'indicator_1',
            sourceHandle: 'out',
            targetHandle: 'in'
          }
        ],
        createdAt: Date.now(),
        updatedAt: Date.now()
      }

      const executor = new StrategyExecutor(strategy, false)
      await executor.execute(this.testData, 10000)

      const endTime = performance.now()
      
      return {
        nodeType: 'indicator',
        nodeSubtype: indicatorType,
        tested: true,
        passed: true,
        executionTime: endTime - startTime
      }
    } catch (error) {
      const endTime = performance.now()
      return {
        nodeType: 'indicator',
        nodeSubtype: indicatorType,
        tested: true,
        passed: false,
        error: error instanceof Error ? error.message : String(error),
        executionTime: endTime - startTime
      }
    }
  }

  private async testConditionNodes(): Promise<NodeTestResult[]> {
    const operators = ['gt', 'lt', 'gte', 'lte', 'eq', 'neq', 'cross_above', 'cross_below']
    const results: NodeTestResult[] = []

    for (const operator of operators) {
      const result = await this.testCondition(operator)
      results.push(result)
    }

    return results
  }

  private async testCondition(operator: string): Promise<NodeTestResult> {
    const startTime = performance.now()
    
    try {
      const strategy: Strategy = {
        id: 'test',
        name: `Test condition ${operator}`,
        description: '',
        nodes: [
          {
            id: 'event_1',
            type: 'event',
            position: { x: 0, y: 0 },
            data: { label: 'OnTick', eventType: 'onTick' }
          },
          {
            id: 'indicator_1',
            type: 'indicator',
            position: { x: 200, y: 0 },
            data: {
              label: 'RSI',
              indicatorType: 'rsi',
              parameters: { period: 14 }
            }
          },
          {
            id: 'condition_1',
            type: 'condition',
            position: { x: 400, y: 0 },
            data: {
              label: `RSI ${operator} 50`,
              parameters: { operator, threshold: 50 }
            }
          }
        ],
        edges: [
          {
            id: 'e1',
            source: 'event_1',
            target: 'indicator_1',
            sourceHandle: 'out',
            targetHandle: 'in'
          },
          {
            id: 'e2',
            source: 'indicator_1',
            target: 'condition_1',
            sourceHandle: 'out',
            targetHandle: 'in'
          }
        ],
        createdAt: Date.now(),
        updatedAt: Date.now()
      }

      const executor = new StrategyExecutor(strategy, false)
      await executor.execute(this.testData, 10000)

      const endTime = performance.now()
      
      return {
        nodeType: 'condition',
        nodeSubtype: operator,
        tested: true,
        passed: true,
        executionTime: endTime - startTime
      }
    } catch (error) {
      const endTime = performance.now()
      return {
        nodeType: 'condition',
        nodeSubtype: operator,
        tested: true,
        passed: false,
        error: error instanceof Error ? error.message : String(error),
        executionTime: endTime - startTime
      }
    }
  }

  private async testLogicNodes(): Promise<NodeTestResult[]> {
    const logicTypes = ['AND', 'OR', 'NOT', 'XOR']
    const results: NodeTestResult[] = []

    for (const logicType of logicTypes) {
      const result = await this.testLogic(logicType)
      results.push(result)
    }

    return results
  }

  private async testLogic(logicType: string): Promise<NodeTestResult> {
    const startTime = performance.now()
    
    try {
      const strategy: Strategy = {
        id: 'test',
        name: `Test logic ${logicType}`,
        description: '',
        nodes: [
          {
            id: 'event_1',
            type: 'event',
            position: { x: 0, y: 0 },
            data: { label: 'OnTick', eventType: 'onTick' }
          },
          {
            id: 'indicator_1',
            type: 'indicator',
            position: { x: 200, y: 0 },
            data: {
              label: 'RSI',
              indicatorType: 'rsi',
              parameters: { period: 14 }
            }
          },
          {
            id: 'condition_1',
            type: 'condition',
            position: { x: 400, y: 0 },
            data: {
              label: 'RSI > 50',
              parameters: { operator: 'gt', threshold: 50 }
            }
          },
          {
            id: 'condition_2',
            type: 'condition',
            position: { x: 400, y: 100 },
            data: {
              label: 'RSI < 70',
              parameters: { operator: 'lt', threshold: 70 }
            }
          },
          {
            id: 'logic_1',
            type: 'logic',
            position: { x: 600, y: 50 },
            data: {
              label: logicType,
              logicType
            }
          }
        ],
        edges: [
          {
            id: 'e1',
            source: 'event_1',
            target: 'indicator_1',
            sourceHandle: 'out',
            targetHandle: 'in'
          },
          {
            id: 'e2',
            source: 'indicator_1',
            target: 'condition_1',
            sourceHandle: 'out',
            targetHandle: 'in'
          },
          {
            id: 'e3',
            source: 'indicator_1',
            target: 'condition_2',
            sourceHandle: 'out',
            targetHandle: 'in'
          },
          {
            id: 'e4',
            source: 'condition_1',
            target: 'logic_1',
            sourceHandle: 'out',
            targetHandle: 'in'
          },
          {
            id: 'e5',
            source: 'condition_2',
            target: 'logic_1',
            sourceHandle: 'out',
            targetHandle: 'in'
          }
        ],
        createdAt: Date.now(),
        updatedAt: Date.now()
      }

      const executor = new StrategyExecutor(strategy, false)
      await executor.execute(this.testData, 10000)

      const endTime = performance.now()
      
      return {
        nodeType: 'logic',
        nodeSubtype: logicType,
        tested: true,
        passed: true,
        executionTime: endTime - startTime
      }
    } catch (error) {
      const endTime = performance.now()
      return {
        nodeType: 'logic',
        nodeSubtype: logicType,
        tested: true,
        passed: false,
        error: error instanceof Error ? error.message : String(error),
        executionTime: endTime - startTime
      }
    }
  }

  private async testActionNodes(): Promise<NodeTestResult[]> {
    const actionTypes = ['buy', 'sell', 'close', 'alert']
    const results: NodeTestResult[] = []

    for (const actionType of actionTypes) {
      const result = await this.testAction(actionType)
      results.push(result)
    }

    return results
  }

  private async testAction(actionType: string): Promise<NodeTestResult> {
    const startTime = performance.now()
    
    try {
      const strategy: Strategy = {
        id: 'test',
        name: `Test action ${actionType}`,
        description: '',
        nodes: [
          {
            id: 'event_1',
            type: 'event',
            position: { x: 0, y: 0 },
            data: { label: 'OnTick', eventType: 'onTick' }
          },
          {
            id: 'action_1',
            type: 'action',
            position: { x: 200, y: 0 },
            data: {
              label: actionType.toUpperCase(),
              actionType,
              parameters: { lots: 0.01 }
            }
          }
        ],
        edges: [
          {
            id: 'e1',
            source: 'event_1',
            target: 'action_1',
            sourceHandle: 'out',
            targetHandle: 'in'
          }
        ],
        createdAt: Date.now(),
        updatedAt: Date.now()
      }

      const executor = new StrategyExecutor(strategy, false)
      await executor.execute(this.testData, 10000)

      const endTime = performance.now()
      
      return {
        nodeType: 'action',
        nodeSubtype: actionType,
        tested: true,
        passed: true,
        executionTime: endTime - startTime
      }
    } catch (error) {
      const endTime = performance.now()
      return {
        nodeType: 'action',
        nodeSubtype: actionType,
        tested: true,
        passed: false,
        error: error instanceof Error ? error.message : String(error),
        executionTime: endTime - startTime
      }
    }
  }

  private async testRiskNodes(): Promise<NodeTestResult[]> {
    const riskTypes = ['stop_loss', 'take_profit', 'trailing_stop', 'position_size']
    const results: NodeTestResult[] = []

    for (const riskType of riskTypes) {
      const result = await this.testRisk(riskType)
      results.push(result)
    }

    return results
  }

  private async testRisk(riskType: string): Promise<NodeTestResult> {
    const startTime = performance.now()
    
    try {
      const strategy: Strategy = {
        id: 'test',
        name: `Test risk ${riskType}`,
        description: '',
        nodes: [
          {
            id: 'event_1',
            type: 'event',
            position: { x: 0, y: 0 },
            data: { label: 'OnTick', eventType: 'onTick' }
          },
          {
            id: 'risk_1',
            type: 'risk',
            position: { x: 200, y: 0 },
            data: {
              label: riskType.replace('_', ' ').toUpperCase(),
              riskType,
              parameters: { pips: 20, riskPercent: 1 }
            }
          },
          {
            id: 'action_1',
            type: 'action',
            position: { x: 400, y: 0 },
            data: {
              label: 'BUY',
              actionType: 'buy',
              parameters: { lots: 0.01 }
            }
          }
        ],
        edges: [
          {
            id: 'e1',
            source: 'event_1',
            target: 'risk_1',
            sourceHandle: 'out',
            targetHandle: 'in'
          },
          {
            id: 'e2',
            source: 'risk_1',
            target: 'action_1',
            sourceHandle: 'out',
            targetHandle: 'in'
          }
        ],
        createdAt: Date.now(),
        updatedAt: Date.now()
      }

      const executor = new StrategyExecutor(strategy, false)
      await executor.execute(this.testData, 10000)

      const endTime = performance.now()
      
      return {
        nodeType: 'risk',
        nodeSubtype: riskType,
        tested: true,
        passed: true,
        executionTime: endTime - startTime
      }
    } catch (error) {
      const endTime = performance.now()
      return {
        nodeType: 'risk',
        nodeSubtype: riskType,
        tested: true,
        passed: false,
        error: error instanceof Error ? error.message : String(error),
        executionTime: endTime - startTime
      }
    }
  }

  private async testAdvancedNodes(): Promise<NodeTestResult[]> {
    const advancedTypes = [
      { type: 'pattern', subtype: 'bullish_engulfing' },
      { type: 'mtf', subtype: 'higher_timeframe' },
      { type: 'variable', subtype: 'set_variable' },
      { type: 'money_management', subtype: 'risk_percent' }
    ]
    const results: NodeTestResult[] = []

    for (const advanced of advancedTypes) {
      const result = await this.testAdvanced(advanced.type, advanced.subtype)
      results.push(result)
    }

    return results
  }

  private async testAdvanced(nodeType: string, subtype: string): Promise<NodeTestResult> {
    const startTime = performance.now()
    
    try {
      const strategy: Strategy = {
        id: 'test',
        name: `Test ${nodeType} ${subtype}`,
        description: '',
        nodes: [
          {
            id: 'event_1',
            type: 'event',
            position: { x: 0, y: 0 },
            data: { label: 'OnTick', eventType: 'onTick' }
          },
          {
            id: 'node_1',
            type: nodeType as any,
            position: { x: 200, y: 0 },
            data: {
              label: subtype.replace('_', ' ').toUpperCase(),
              [nodeType === 'pattern' ? 'patternType' : 
               nodeType === 'mtf' ? 'mtfType' :
               nodeType === 'variable' ? 'variableType' :
               'mmType']: subtype,
              parameters: {}
            }
          }
        ],
        edges: [
          {
            id: 'e1',
            source: 'event_1',
            target: 'node_1',
            sourceHandle: 'out',
            targetHandle: 'in'
          }
        ],
        createdAt: Date.now(),
        updatedAt: Date.now()
      }

      const executor = new StrategyExecutor(strategy, false)
      await executor.execute(this.testData, 10000)

      const endTime = performance.now()
      
      return {
        nodeType,
        nodeSubtype: subtype,
        tested: true,
        passed: true,
        executionTime: endTime - startTime
      }
    } catch (error) {
      const endTime = performance.now()
      return {
        nodeType,
        nodeSubtype: subtype,
        tested: true,
        passed: false,
        error: error instanceof Error ? error.message : String(error),
        executionTime: endTime - startTime
      }
    }
  }
}

export const nodeIntegrationTester = new NodeIntegrationTester()
