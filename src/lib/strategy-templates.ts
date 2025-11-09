import { Strategy } from '@/types/strategy'
import { Node, Edge } from '@xyflow/react'

export interface StrategyTemplate {
  id: string
  name: string
  description: string
  category: 'trend' | 'momentum' | 'reversal' | 'breakout' | 'scalping'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  strategy: Strategy
}

export const STRATEGY_TEMPLATES: StrategyTemplate[] = [
  {
    id: 'rsi-oversold-overbought',
    name: 'RSI Oversold/Overbought',
    description: 'Buy when RSI < 30, sell when RSI > 70. Simple momentum reversal strategy.',
    category: 'reversal',
    difficulty: 'beginner',
    strategy: {
      id: 'template-rsi-basic',
      name: 'RSI Oversold/Overbought',
      description: 'RSI reversal strategy',
      version: '1.0',
      createdAt: new Date(),
      updatedAt: new Date(),
      nodes: [
        {
          id: 'event-1',
          type: 'event',
          position: { x: 100, y: 200 },
          data: {
            label: 'OnTick',
            category: 'event',
            eventType: 'ontick',
            parameters: {},
            inputs: [],
            outputs: [{ id: 'trigger', label: 'Trigger', dataType: 'signal' }]
          }
        },
        {
          id: 'rsi-1',
          type: 'indicator',
          position: { x: 300, y: 200 },
          data: {
            label: 'RSI',
            category: 'indicator',
            indicatorType: 'rsi',
            parameters: { period: 14, source: 'close' },
            inputs: [],
            outputs: [{ id: 'value', label: 'Value', dataType: 'number' }]
          }
        },
        {
          id: 'condition-buy',
          type: 'condition',
          position: { x: 500, y: 150 },
          data: {
            label: 'RSI < 30',
            category: 'condition',
            operator: 'lt',
            parameters: { value: 30 },
            inputs: [
              { id: 'a', label: 'A', dataType: 'number' },
              { id: 'b', label: 'B', dataType: 'number' }
            ],
            outputs: [{ id: 'result', label: 'Result', dataType: 'boolean' }]
          }
        },
        {
          id: 'condition-sell',
          type: 'condition',
          position: { x: 500, y: 250 },
          data: {
            label: 'RSI > 70',
            category: 'condition',
            operator: 'gt',
            parameters: { value: 70 },
            inputs: [
              { id: 'a', label: 'A', dataType: 'number' },
              { id: 'b', label: 'B', dataType: 'number' }
            ],
            outputs: [{ id: 'result', label: 'Result', dataType: 'boolean' }]
          }
        },
        {
          id: 'action-buy',
          type: 'action',
          position: { x: 700, y: 150 },
          data: {
            label: 'Buy',
            category: 'action',
            action: 'buy',
            parameters: { lots: 0.1, stopLoss: 50, takeProfit: 100 },
            inputs: [{ id: 'trigger', label: 'Trigger', dataType: 'boolean' }],
            outputs: []
          }
        },
        {
          id: 'action-sell',
          type: 'action',
          position: { x: 700, y: 250 },
          data: {
            label: 'Sell',
            category: 'action',
            action: 'sell',
            parameters: { lots: 0.1, stopLoss: 50, takeProfit: 100 },
            inputs: [{ id: 'trigger', label: 'Trigger', dataType: 'boolean' }],
            outputs: []
          }
        }
      ],
      edges: [
        { id: 'e1', source: 'event-1', target: 'rsi-1', sourceHandle: 'trigger', targetHandle: null },
        { id: 'e2', source: 'rsi-1', target: 'condition-buy', sourceHandle: 'value', targetHandle: 'a' },
        { id: 'e3', source: 'rsi-1', target: 'condition-sell', sourceHandle: 'value', targetHandle: 'a' },
        { id: 'e4', source: 'condition-buy', target: 'action-buy', sourceHandle: 'result', targetHandle: 'trigger' },
        { id: 'e5', source: 'condition-sell', target: 'action-sell', sourceHandle: 'result', targetHandle: 'trigger' }
      ],
      settings: {
        symbol: 'EURUSD',
        timeframe: 'H1',
        initialBalance: 10000,
        riskPerTrade: 2
      },
      metadata: {
        author: 'System',
        tags: ['RSI', 'reversal', 'beginner'],
        category: 'reversal',
        timeframe: 'H1',
        pairs: ['EURUSD']
      }
    }
  },
  {
    id: 'sma-crossover',
    name: 'SMA Crossover',
    description: 'Buy when fast SMA crosses above slow SMA, sell on opposite. Classic trend-following.',
    category: 'trend',
    difficulty: 'beginner',
    strategy: {
      id: 'template-sma-crossover',
      name: 'SMA Crossover',
      description: 'Moving average crossover trend strategy',
      version: '1.0',
      createdAt: new Date(),
      updatedAt: new Date(),
      nodes: [
        {
          id: 'event-1',
          type: 'event',
          position: { x: 50, y: 250 },
          data: {
            label: 'OnTick',
            category: 'event',
            eventType: 'ontick',
            parameters: {},
            inputs: [],
            outputs: [{ id: 'trigger', label: 'Trigger', dataType: 'signal' }]
          }
        },
        {
          id: 'sma-fast',
          type: 'indicator',
          position: { x: 250, y: 180 },
          data: {
            label: 'SMA(20)',
            category: 'indicator',
            indicatorType: 'sma',
            parameters: { period: 20, source: 'close' },
            inputs: [],
            outputs: [{ id: 'value', label: 'Value', dataType: 'number' }]
          }
        },
        {
          id: 'sma-slow',
          type: 'indicator',
          position: { x: 250, y: 320 },
          data: {
            label: 'SMA(50)',
            category: 'indicator',
            indicatorType: 'sma',
            parameters: { period: 50, source: 'close' },
            inputs: [],
            outputs: [{ id: 'value', label: 'Value', dataType: 'number' }]
          }
        },
        {
          id: 'cross-above',
          type: 'condition',
          position: { x: 500, y: 180 },
          data: {
            label: 'Cross Above',
            category: 'condition',
            operator: 'cross_above',
            parameters: {},
            inputs: [
              { id: 'a', label: 'Fast', dataType: 'number' },
              { id: 'b', label: 'Slow', dataType: 'number' }
            ],
            outputs: [{ id: 'result', label: 'Result', dataType: 'boolean' }]
          }
        },
        {
          id: 'cross-below',
          type: 'condition',
          position: { x: 500, y: 320 },
          data: {
            label: 'Cross Below',
            category: 'condition',
            operator: 'cross_below',
            parameters: {},
            inputs: [
              { id: 'a', label: 'Fast', dataType: 'number' },
              { id: 'b', label: 'Slow', dataType: 'number' }
            ],
            outputs: [{ id: 'result', label: 'Result', dataType: 'boolean' }]
          }
        },
        {
          id: 'action-buy',
          type: 'action',
          position: { x: 750, y: 180 },
          data: {
            label: 'Buy',
            category: 'action',
            action: 'buy',
            parameters: { lots: 0.1, stopLoss: 100, takeProfit: 200 },
            inputs: [{ id: 'trigger', label: 'Trigger', dataType: 'boolean' }],
            outputs: []
          }
        },
        {
          id: 'action-sell',
          type: 'action',
          position: { x: 750, y: 320 },
          data: {
            label: 'Sell',
            category: 'action',
            action: 'sell',
            parameters: { lots: 0.1, stopLoss: 100, takeProfit: 200 },
            inputs: [{ id: 'trigger', label: 'Trigger', dataType: 'boolean' }],
            outputs: []
          }
        }
      ],
      edges: [
        { id: 'e1', source: 'event-1', target: 'sma-fast', sourceHandle: 'trigger', targetHandle: null },
        { id: 'e2', source: 'event-1', target: 'sma-slow', sourceHandle: 'trigger', targetHandle: null },
        { id: 'e3', source: 'sma-fast', target: 'cross-above', sourceHandle: 'value', targetHandle: 'a' },
        { id: 'e4', source: 'sma-slow', target: 'cross-above', sourceHandle: 'value', targetHandle: 'b' },
        { id: 'e5', source: 'sma-fast', target: 'cross-below', sourceHandle: 'value', targetHandle: 'a' },
        { id: 'e6', source: 'sma-slow', target: 'cross-below', sourceHandle: 'value', targetHandle: 'b' },
        { id: 'e7', source: 'cross-above', target: 'action-buy', sourceHandle: 'result', targetHandle: 'trigger' },
        { id: 'e8', source: 'cross-below', target: 'action-sell', sourceHandle: 'result', targetHandle: 'trigger' }
      ],
      settings: {
        symbol: 'EURUSD',
        timeframe: 'H4',
        initialBalance: 10000,
        riskPerTrade: 2
      },
      metadata: {
        author: 'System',
        tags: ['SMA', 'crossover', 'trend', 'beginner'],
        category: 'trend',
        timeframe: 'H4',
        pairs: ['EURUSD']
      }
    }
  },
  {
    id: 'macd-momentum',
    name: 'MACD Momentum',
    description: 'Buy when MACD crosses above signal, sell when crosses below. Momentum-based strategy.',
    category: 'momentum',
    difficulty: 'beginner',
    strategy: {
      id: 'template-macd',
      name: 'MACD Momentum',
      description: 'MACD signal line crossover',
      version: '1.0',
      createdAt: new Date(),
      updatedAt: new Date(),
      nodes: [
        {
          id: 'event-1',
          type: 'event',
          position: { x: 50, y: 200 },
          data: {
            label: 'OnTick',
            category: 'event',
            eventType: 'ontick',
            parameters: {},
            inputs: [],
            outputs: [{ id: 'trigger', label: 'Trigger', dataType: 'signal' }]
          }
        },
        {
          id: 'macd-1',
          type: 'indicator',
          position: { x: 250, y: 200 },
          data: {
            label: 'MACD',
            category: 'indicator',
            indicatorType: 'macd',
            parameters: { fastPeriod: 12, slowPeriod: 26, signalPeriod: 9, source: 'close' },
            inputs: [],
            outputs: [
              { id: 'macd', label: 'MACD', dataType: 'number' },
              { id: 'signal', label: 'Signal', dataType: 'number' },
              { id: 'histogram', label: 'Histogram', dataType: 'number' }
            ]
          }
        },
        {
          id: 'cross-above',
          type: 'condition',
          position: { x: 500, y: 150 },
          data: {
            label: 'MACD > Signal',
            category: 'condition',
            operator: 'cross_above',
            parameters: {},
            inputs: [
              { id: 'a', label: 'MACD', dataType: 'number' },
              { id: 'b', label: 'Signal', dataType: 'number' }
            ],
            outputs: [{ id: 'result', label: 'Result', dataType: 'boolean' }]
          }
        },
        {
          id: 'cross-below',
          type: 'condition',
          position: { x: 500, y: 250 },
          data: {
            label: 'MACD < Signal',
            category: 'condition',
            operator: 'cross_below',
            parameters: {},
            inputs: [
              { id: 'a', label: 'MACD', dataType: 'number' },
              { id: 'b', label: 'Signal', dataType: 'number' }
            ],
            outputs: [{ id: 'result', label: 'Result', dataType: 'boolean' }]
          }
        },
        {
          id: 'action-buy',
          type: 'action',
          position: { x: 750, y: 150 },
          data: {
            label: 'Buy',
            category: 'action',
            action: 'buy',
            parameters: { lots: 0.1, stopLoss: 80, takeProfit: 150 },
            inputs: [{ id: 'trigger', label: 'Trigger', dataType: 'boolean' }],
            outputs: []
          }
        },
        {
          id: 'action-sell',
          type: 'action',
          position: { x: 750, y: 250 },
          data: {
            label: 'Sell',
            category: 'action',
            action: 'sell',
            parameters: { lots: 0.1, stopLoss: 80, takeProfit: 150 },
            inputs: [{ id: 'trigger', label: 'Trigger', dataType: 'boolean' }],
            outputs: []
          }
        }
      ],
      edges: [
        { id: 'e1', source: 'event-1', target: 'macd-1', sourceHandle: 'trigger', targetHandle: null },
        { id: 'e2', source: 'macd-1', target: 'cross-above', sourceHandle: 'macd', targetHandle: 'a' },
        { id: 'e3', source: 'macd-1', target: 'cross-above', sourceHandle: 'signal', targetHandle: 'b' },
        { id: 'e4', source: 'macd-1', target: 'cross-below', sourceHandle: 'macd', targetHandle: 'a' },
        { id: 'e5', source: 'macd-1', target: 'cross-below', sourceHandle: 'signal', targetHandle: 'b' },
        { id: 'e6', source: 'cross-above', target: 'action-buy', sourceHandle: 'result', targetHandle: 'trigger' },
        { id: 'e7', source: 'cross-below', target: 'action-sell', sourceHandle: 'result', targetHandle: 'trigger' }
      ],
      settings: {
        symbol: 'EURUSD',
        timeframe: 'H1',
        initialBalance: 10000,
        riskPerTrade: 2
      },
      metadata: {
        author: 'System',
        tags: ['MACD', 'momentum', 'crossover', 'beginner'],
        category: 'momentum',
        timeframe: 'H1',
        pairs: ['EURUSD']
      }
    }
  },
  {
    id: 'bollinger-bounce',
    name: 'Bollinger Bounce',
    description: 'Buy at lower band, sell at upper band. Mean reversion strategy.',
    category: 'reversal',
    difficulty: 'intermediate',
    strategy: {
      id: 'template-bollinger',
      name: 'Bollinger Bounce',
      description: 'Mean reversion using Bollinger Bands',
      version: '1.0',
      createdAt: new Date(),
      updatedAt: new Date(),
      nodes: [
        {
          id: 'event-1',
          type: 'event',
          position: { x: 50, y: 250 },
          data: {
            label: 'OnTick',
            category: 'event',
            eventType: 'ontick',
            parameters: {},
            inputs: [],
            outputs: [{ id: 'trigger', label: 'Trigger', dataType: 'signal' }]
          }
        },
        {
          id: 'bb-1',
          type: 'indicator',
          position: { x: 250, y: 200 },
          data: {
            label: 'BB(20,2)',
            category: 'indicator',
            indicatorType: 'bollinger',
            parameters: { period: 20, stdDev: 2, source: 'close' },
            inputs: [],
            outputs: [
              { id: 'upper', label: 'Upper', dataType: 'number' },
              { id: 'middle', label: 'Middle', dataType: 'number' },
              { id: 'lower', label: 'Lower', dataType: 'number' }
            ]
          }
        },
        {
          id: 'price-node',
          type: 'indicator',
          position: { x: 250, y: 320 },
          data: {
            label: 'Close',
            category: 'indicator',
            indicatorType: 'price',
            parameters: { source: 'close' },
            inputs: [],
            outputs: [{ id: 'value', label: 'Close', dataType: 'number' }]
          }
        },
        {
          id: 'touch-lower',
          type: 'condition',
          position: { x: 500, y: 150 },
          data: {
            label: 'Price ≤ Lower',
            category: 'condition',
            operator: 'lte',
            parameters: {},
            inputs: [
              { id: 'a', label: 'Price', dataType: 'number' },
              { id: 'b', label: 'Lower', dataType: 'number' }
            ],
            outputs: [{ id: 'result', label: 'Result', dataType: 'boolean' }]
          }
        },
        {
          id: 'touch-upper',
          type: 'condition',
          position: { x: 500, y: 280 },
          data: {
            label: 'Price ≥ Upper',
            category: 'condition',
            operator: 'gte',
            parameters: {},
            inputs: [
              { id: 'a', label: 'Price', dataType: 'number' },
              { id: 'b', label: 'Upper', dataType: 'number' }
            ],
            outputs: [{ id: 'result', label: 'Result', dataType: 'boolean' }]
          }
        },
        {
          id: 'action-buy',
          type: 'action',
          position: { x: 750, y: 150 },
          data: {
            label: 'Buy',
            category: 'action',
            action: 'buy',
            parameters: { lots: 0.1, stopLoss: 50, takeProfit: 100 },
            inputs: [{ id: 'trigger', label: 'Trigger', dataType: 'boolean' }],
            outputs: []
          }
        },
        {
          id: 'action-sell',
          type: 'action',
          position: { x: 750, y: 280 },
          data: {
            label: 'Sell',
            category: 'action',
            action: 'sell',
            parameters: { lots: 0.1, stopLoss: 50, takeProfit: 100 },
            inputs: [{ id: 'trigger', label: 'Trigger', dataType: 'boolean' }],
            outputs: []
          }
        }
      ],
      edges: [
        { id: 'e1', source: 'event-1', target: 'bb-1', sourceHandle: 'trigger', targetHandle: null },
        { id: 'e2', source: 'event-1', target: 'price-node', sourceHandle: 'trigger', targetHandle: null },
        { id: 'e3', source: 'price-node', target: 'touch-lower', sourceHandle: 'value', targetHandle: 'a' },
        { id: 'e4', source: 'bb-1', target: 'touch-lower', sourceHandle: 'lower', targetHandle: 'b' },
        { id: 'e5', source: 'price-node', target: 'touch-upper', sourceHandle: 'value', targetHandle: 'a' },
        { id: 'e6', source: 'bb-1', target: 'touch-upper', sourceHandle: 'upper', targetHandle: 'b' },
        { id: 'e7', source: 'touch-lower', target: 'action-buy', sourceHandle: 'result', targetHandle: 'trigger' },
        { id: 'e8', source: 'touch-upper', target: 'action-sell', sourceHandle: 'result', targetHandle: 'trigger' }
      ],
      settings: {
        symbol: 'GBPUSD',
        timeframe: 'M15',
        initialBalance: 10000,
        riskPerTrade: 2
      },
      metadata: {
        author: 'System',
        tags: ['Bollinger', 'mean-reversion', 'intermediate'],
        category: 'reversal',
        timeframe: 'M15',
        pairs: ['GBPUSD']
      }
    }
  },
  {
    id: 'rsi-sma-combo',
    name: 'RSI + SMA Combined',
    description: 'Buy when RSI < 30 AND price above SMA(50). Multi-condition strategy with logic gates.',
    category: 'momentum',
    difficulty: 'intermediate',
    strategy: {
      id: 'template-rsi-sma-combo',
      name: 'RSI + SMA Combined',
      description: 'Combined RSI oversold with trend filter',
      version: '1.0',
      createdAt: new Date(),
      updatedAt: new Date(),
      nodes: [
        {
          id: 'event-1',
          type: 'event',
          position: { x: 50, y: 250 },
          data: {
            label: 'OnTick',
            category: 'event',
            eventType: 'ontick',
            parameters: {},
            inputs: [],
            outputs: [{ id: 'trigger', label: 'Trigger', dataType: 'signal' }]
          }
        },
        {
          id: 'rsi-1',
          type: 'indicator',
          position: { x: 250, y: 150 },
          data: {
            label: 'RSI(14)',
            category: 'indicator',
            indicatorType: 'rsi',
            parameters: { period: 14, source: 'close' },
            inputs: [],
            outputs: [{ id: 'value', label: 'Value', dataType: 'number' }]
          }
        },
        {
          id: 'sma-1',
          type: 'indicator',
          position: { x: 250, y: 250 },
          data: {
            label: 'SMA(50)',
            category: 'indicator',
            indicatorType: 'sma',
            parameters: { period: 50, source: 'close' },
            inputs: [],
            outputs: [{ id: 'value', label: 'Value', dataType: 'number' }]
          }
        },
        {
          id: 'price-1',
          type: 'indicator',
          position: { x: 250, y: 350 },
          data: {
            label: 'Close',
            category: 'indicator',
            indicatorType: 'price',
            parameters: { source: 'close' },
            inputs: [],
            outputs: [{ id: 'value', label: 'Close', dataType: 'number' }]
          }
        },
        {
          id: 'cond-rsi-low',
          type: 'condition',
          position: { x: 450, y: 150 },
          data: {
            label: 'RSI < 30',
            category: 'condition',
            operator: 'lt',
            parameters: { value: 30 },
            inputs: [
              { id: 'a', label: 'RSI', dataType: 'number' },
              { id: 'b', label: 'Threshold', dataType: 'number' }
            ],
            outputs: [{ id: 'result', label: 'Result', dataType: 'boolean' }]
          }
        },
        {
          id: 'cond-price-above-sma',
          type: 'condition',
          position: { x: 450, y: 300 },
          data: {
            label: 'Price > SMA',
            category: 'condition',
            operator: 'gt',
            parameters: {},
            inputs: [
              { id: 'a', label: 'Price', dataType: 'number' },
              { id: 'b', label: 'SMA', dataType: 'number' }
            ],
            outputs: [{ id: 'result', label: 'Result', dataType: 'boolean' }]
          }
        },
        {
          id: 'logic-and',
          type: 'logic',
          position: { x: 650, y: 225 },
          data: {
            label: 'AND',
            category: 'logic',
            operator: 'AND',
            parameters: {},
            inputs: [
              { id: 'a', label: 'A', dataType: 'boolean' },
              { id: 'b', label: 'B', dataType: 'boolean' }
            ],
            outputs: [{ id: 'result', label: 'Result', dataType: 'boolean' }]
          }
        },
        {
          id: 'action-buy',
          type: 'action',
          position: { x: 850, y: 225 },
          data: {
            label: 'Buy',
            category: 'action',
            action: 'buy',
            parameters: { lots: 0.1, stopLoss: 50, takeProfit: 150 },
            inputs: [{ id: 'trigger', label: 'Trigger', dataType: 'boolean' }],
            outputs: []
          }
        }
      ],
      edges: [
        { id: 'e1', source: 'event-1', target: 'rsi-1', sourceHandle: 'trigger', targetHandle: null },
        { id: 'e2', source: 'event-1', target: 'sma-1', sourceHandle: 'trigger', targetHandle: null },
        { id: 'e3', source: 'event-1', target: 'price-1', sourceHandle: 'trigger', targetHandle: null },
        { id: 'e4', source: 'rsi-1', target: 'cond-rsi-low', sourceHandle: 'value', targetHandle: 'a' },
        { id: 'e5', source: 'price-1', target: 'cond-price-above-sma', sourceHandle: 'value', targetHandle: 'a' },
        { id: 'e6', source: 'sma-1', target: 'cond-price-above-sma', sourceHandle: 'value', targetHandle: 'b' },
        { id: 'e7', source: 'cond-rsi-low', target: 'logic-and', sourceHandle: 'result', targetHandle: 'a' },
        { id: 'e8', source: 'cond-price-above-sma', target: 'logic-and', sourceHandle: 'result', targetHandle: 'b' },
        { id: 'e9', source: 'logic-and', target: 'action-buy', sourceHandle: 'result', targetHandle: 'trigger' }
      ],
      settings: {
        symbol: 'EURUSD',
        timeframe: 'H1',
        initialBalance: 10000,
        riskPerTrade: 2
      },
      metadata: {
        author: 'System',
        tags: ['RSI', 'SMA', 'logic', 'intermediate'],
        category: 'momentum',
        timeframe: 'H1',
        pairs: ['EURUSD']
      }
    }
  }
]

export function getTemplate(id: string): StrategyTemplate | undefined {
  return STRATEGY_TEMPLATES.find(t => t.id === id)
}

export function getTemplatesByCategory(category: string): StrategyTemplate[] {
  return STRATEGY_TEMPLATES.filter(t => t.category === category)
}

export function getTemplatesByDifficulty(difficulty: string): StrategyTemplate[] {
  return STRATEGY_TEMPLATES.filter(t => t.difficulty === difficulty)
}
