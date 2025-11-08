export type NodeCategory = 'indicator' | 'condition' | 'action' | 'logic' | 'risk'

export interface NodeDefinition {
  id: string
  type: string
  category: NodeCategory
  label: string
  description: string
  icon: string
  defaultParameters?: Record<string, any>
}

export const NODE_CATEGORIES: Array<{
  id: NodeCategory
  label: string
  description: string
}> = [
  {
    id: 'indicator',
    label: 'Indicators',
    description: 'Technical analysis indicators'
  },
  {
    id: 'condition',
    label: 'Conditions',
    description: 'Comparison and condition checks'
  },
  {
    id: 'logic',
    label: 'Logic',
    description: 'Boolean logic operations'
  },
  {
    id: 'action',
    label: 'Actions',
    description: 'Trade execution actions'
  },
  {
    id: 'risk',
    label: 'Risk Management',
    description: 'Position sizing and risk controls'
  }
]

export type IndicatorSubcategory = 'moving_averages' | 'oscillators' | 'volatility' | 'volume' | 'trend' | 'support_resistance'

export interface IndicatorNodeDefinition extends NodeDefinition {
  subcategory?: IndicatorSubcategory
  outputs: Array<{ id: string; label: string }>
  parameters: Array<{
    key: string
    label: string
    type: 'number' | 'select' | 'boolean'
    default: any
    min?: number
    max?: number
    step?: number
    options?: Array<{ label: string; value: any }>
    description?: string
  }>
}

export const INDICATOR_SUBCATEGORIES: Array<{
  id: IndicatorSubcategory
  label: string
  description: string
}> = [
  { id: 'moving_averages', label: 'Moving Averages', description: 'Trend-following indicators' },
  { id: 'oscillators', label: 'Oscillators', description: 'Momentum and overbought/oversold indicators' },
  { id: 'volatility', label: 'Volatility', description: 'Market volatility and range indicators' },
  { id: 'volume', label: 'Volume', description: 'Volume-based indicators' },
  { id: 'trend', label: 'Trend', description: 'Trend strength and direction' },
  { id: 'support_resistance', label: 'Support/Resistance', description: 'Price levels and pivots' }
]

export const INDICATOR_DEFINITIONS: IndicatorNodeDefinition[] = [
  {
    id: 'sma',
    type: 'indicator',
    category: 'indicator',
    subcategory: 'moving_averages',
    label: 'SMA',
    description: 'Simple Moving Average - arithmetic mean over period',
    icon: 'ChartLine',
    outputs: [{ id: 'value', label: 'SMA Value' }],
    parameters: [
      { key: 'period', label: 'Period', type: 'number', default: 20, min: 1, max: 500, step: 1 },
      { 
        key: 'source', 
        label: 'Source', 
        type: 'select', 
        default: 'close',
        options: [
          { label: 'Close', value: 'close' },
          { label: 'Open', value: 'open' },
          { label: 'High', value: 'high' },
          { label: 'Low', value: 'low' },
          { label: 'HL/2', value: 'hl2' },
          { label: 'HLC/3', value: 'hlc3' },
          { label: 'OHLC/4', value: 'ohlc4' }
        ]
      }
    ],
    defaultParameters: { period: 20, source: 'close' }
  },
  {
    id: 'ema',
    type: 'indicator',
    category: 'indicator',
    subcategory: 'moving_averages',
    label: 'EMA',
    description: 'Exponential Moving Average - weighted average favoring recent data',
    icon: 'ChartLine',
    outputs: [{ id: 'value', label: 'EMA Value' }],
    parameters: [
      { key: 'period', label: 'Period', type: 'number', default: 20, min: 1, max: 500, step: 1 },
      { 
        key: 'source', 
        label: 'Source', 
        type: 'select', 
        default: 'close',
        options: [
          { label: 'Close', value: 'close' },
          { label: 'Open', value: 'open' },
          { label: 'High', value: 'high' },
          { label: 'Low', value: 'low' },
          { label: 'HL/2', value: 'hl2' },
          { label: 'HLC/3', value: 'hlc3' },
          { label: 'OHLC/4', value: 'ohlc4' }
        ]
      }
    ],
    defaultParameters: { period: 20, source: 'close' }
  },
  {
    id: 'wma',
    type: 'indicator',
    category: 'indicator',
    subcategory: 'moving_averages',
    label: 'WMA',
    description: 'Weighted Moving Average - linearly weighted average',
    icon: 'ChartLine',
    outputs: [{ id: 'value', label: 'WMA Value' }],
    parameters: [
      { key: 'period', label: 'Period', type: 'number', default: 20, min: 1, max: 500, step: 1 },
      { 
        key: 'source', 
        label: 'Source', 
        type: 'select', 
        default: 'close',
        options: [
          { label: 'Close', value: 'close' },
          { label: 'Open', value: 'open' },
          { label: 'High', value: 'high' },
          { label: 'Low', value: 'low' }
        ]
      }
    ],
    defaultParameters: { period: 20, source: 'close' }
  },
  {
    id: 'rsi',
    type: 'indicator',
    category: 'indicator',
    subcategory: 'oscillators',
    label: 'RSI',
    description: 'Relative Strength Index - momentum oscillator (0-100)',
    icon: 'Waveform',
    outputs: [{ id: 'value', label: 'RSI Value' }],
    parameters: [
      { key: 'period', label: 'Period', type: 'number', default: 14, min: 2, max: 100, step: 1 },
      { 
        key: 'source', 
        label: 'Source', 
        type: 'select', 
        default: 'close',
        options: [
          { label: 'Close', value: 'close' },
          { label: 'Open', value: 'open' },
          { label: 'High', value: 'high' },
          { label: 'Low', value: 'low' }
        ]
      },
      { key: 'overbought', label: 'Overbought Level', type: 'number', default: 70, min: 50, max: 95, step: 1 },
      { key: 'oversold', label: 'Oversold Level', type: 'number', default: 30, min: 5, max: 50, step: 1 }
    ],
    defaultParameters: { period: 14, source: 'close', overbought: 70, oversold: 30 }
  },
  {
    id: 'macd',
    type: 'indicator',
    category: 'indicator',
    subcategory: 'oscillators',
    label: 'MACD',
    description: 'Moving Average Convergence Divergence - trend and momentum',
    icon: 'ChartLineUp',
    outputs: [
      { id: 'macd', label: 'MACD Line' },
      { id: 'signal', label: 'Signal Line' },
      { id: 'histogram', label: 'Histogram' }
    ],
    parameters: [
      { key: 'fastPeriod', label: 'Fast Period', type: 'number', default: 12, min: 2, max: 100, step: 1 },
      { key: 'slowPeriod', label: 'Slow Period', type: 'number', default: 26, min: 2, max: 200, step: 1 },
      { key: 'signalPeriod', label: 'Signal Period', type: 'number', default: 9, min: 2, max: 50, step: 1 },
      { 
        key: 'source', 
        label: 'Source', 
        type: 'select', 
        default: 'close',
        options: [
          { label: 'Close', value: 'close' },
          { label: 'Open', value: 'open' },
          { label: 'High', value: 'high' },
          { label: 'Low', value: 'low' }
        ]
      }
    ],
    defaultParameters: { fastPeriod: 12, slowPeriod: 26, signalPeriod: 9, source: 'close' }
  },
  {
    id: 'stochastic',
    type: 'indicator',
    category: 'indicator',
    subcategory: 'oscillators',
    label: 'Stochastic',
    description: 'Stochastic Oscillator - momentum indicator (0-100)',
    icon: 'Waveform',
    outputs: [
      { id: 'k', label: '%K Line' },
      { id: 'd', label: '%D Line' }
    ],
    parameters: [
      { key: 'kPeriod', label: '%K Period', type: 'number', default: 14, min: 1, max: 100, step: 1 },
      { key: 'dPeriod', label: '%D Period', type: 'number', default: 3, min: 1, max: 50, step: 1 },
      { key: 'smooth', label: 'Smooth', type: 'number', default: 3, min: 1, max: 50, step: 1 }
    ],
    defaultParameters: { kPeriod: 14, dPeriod: 3, smooth: 3 }
  },
  {
    id: 'cci',
    type: 'indicator',
    category: 'indicator',
    subcategory: 'oscillators',
    label: 'CCI',
    description: 'Commodity Channel Index - cyclical trends indicator',
    icon: 'Waveform',
    outputs: [{ id: 'value', label: 'CCI Value' }],
    parameters: [
      { key: 'period', label: 'Period', type: 'number', default: 20, min: 2, max: 200, step: 1 }
    ],
    defaultParameters: { period: 20 }
  },
  {
    id: 'bb',
    type: 'indicator',
    category: 'indicator',
    subcategory: 'volatility',
    label: 'Bollinger Bands',
    description: 'Bollinger Bands - volatility bands around moving average',
    icon: 'Activity',
    outputs: [
      { id: 'upper', label: 'Upper Band' },
      { id: 'middle', label: 'Middle Band' },
      { id: 'lower', label: 'Lower Band' }
    ],
    parameters: [
      { key: 'period', label: 'Period', type: 'number', default: 20, min: 2, max: 200, step: 1 },
      { key: 'stdDev', label: 'Std Deviation', type: 'number', default: 2, min: 0.5, max: 5, step: 0.1 },
      { 
        key: 'source', 
        label: 'Source', 
        type: 'select', 
        default: 'close',
        options: [
          { label: 'Close', value: 'close' },
          { label: 'Open', value: 'open' },
          { label: 'High', value: 'high' },
          { label: 'Low', value: 'low' }
        ]
      }
    ],
    defaultParameters: { period: 20, stdDev: 2, source: 'close' }
  },
  {
    id: 'atr',
    type: 'indicator',
    category: 'indicator',
    subcategory: 'volatility',
    label: 'ATR',
    description: 'Average True Range - market volatility indicator',
    icon: 'Activity',
    outputs: [{ id: 'value', label: 'ATR Value' }],
    parameters: [
      { key: 'period', label: 'Period', type: 'number', default: 14, min: 1, max: 100, step: 1 }
    ],
    defaultParameters: { period: 14 }
  },
  {
    id: 'adx',
    type: 'indicator',
    category: 'indicator',
    subcategory: 'trend',
    label: 'ADX',
    description: 'Average Directional Index - trend strength',
    icon: 'ChartLineUp',
    outputs: [
      { id: 'adx', label: 'ADX' },
      { id: 'plusDI', label: '+DI' },
      { id: 'minusDI', label: '-DI' }
    ],
    parameters: [
      { key: 'period', label: 'Period', type: 'number', default: 14, min: 2, max: 100, step: 1 }
    ],
    defaultParameters: { period: 14 }
  },
  {
    id: 'parabolic_sar',
    type: 'indicator',
    category: 'indicator',
    subcategory: 'trend',
    label: 'Parabolic SAR',
    description: 'Parabolic Stop and Reverse - trend direction and reversals',
    icon: 'ChartLineUp',
    outputs: [{ id: 'value', label: 'SAR Value' }],
    parameters: [
      { key: 'acceleration', label: 'Acceleration', type: 'number', default: 0.02, min: 0.001, max: 0.2, step: 0.001 },
      { key: 'maximum', label: 'Maximum', type: 'number', default: 0.2, min: 0.01, max: 1, step: 0.01 }
    ],
    defaultParameters: { acceleration: 0.02, maximum: 0.2 }
  },
  {
    id: 'ichimoku',
    type: 'indicator',
    category: 'indicator',
    subcategory: 'trend',
    label: 'Ichimoku Cloud',
    description: 'Ichimoku Kinko Hyo - comprehensive trend system',
    icon: 'ChartLineUp',
    outputs: [
      { id: 'tenkan', label: 'Tenkan-sen' },
      { id: 'kijun', label: 'Kijun-sen' },
      { id: 'senkouA', label: 'Senkou Span A' },
      { id: 'senkouB', label: 'Senkou Span B' },
      { id: 'chikou', label: 'Chikou Span' }
    ],
    parameters: [
      { key: 'tenkanPeriod', label: 'Tenkan Period', type: 'number', default: 9, min: 1, max: 100, step: 1 },
      { key: 'kijunPeriod', label: 'Kijun Period', type: 'number', default: 26, min: 1, max: 100, step: 1 },
      { key: 'senkouPeriod', label: 'Senkou Period', type: 'number', default: 52, min: 1, max: 200, step: 1 }
    ],
    defaultParameters: { tenkanPeriod: 9, kijunPeriod: 26, senkouPeriod: 52 }
  },
  {
    id: 'pivot_points',
    type: 'indicator',
    category: 'indicator',
    subcategory: 'support_resistance',
    label: 'Pivot Points',
    description: 'Classic Pivot Points - support and resistance levels',
    icon: 'LineSegment',
    outputs: [
      { id: 'pivot', label: 'Pivot' },
      { id: 'r1', label: 'R1' },
      { id: 'r2', label: 'R2' },
      { id: 'r3', label: 'R3' },
      { id: 's1', label: 'S1' },
      { id: 's2', label: 'S2' },
      { id: 's3', label: 'S3' }
    ],
    parameters: [
      { 
        key: 'type', 
        label: 'Type', 
        type: 'select', 
        default: 'classic',
        options: [
          { label: 'Classic', value: 'classic' },
          { label: 'Fibonacci', value: 'fibonacci' },
          { label: 'Woodie', value: 'woodie' },
          { label: 'Camarilla', value: 'camarilla' }
        ]
      }
    ],
    defaultParameters: { type: 'classic' }
  }
]

export const NODE_DEFINITIONS: NodeDefinition[] = [
  ...INDICATOR_DEFINITIONS,
  {
    id: 'comparison',
    type: 'condition',
    category: 'condition',
    label: 'Compare',
    description: 'Compare two values with various operators',
    icon: 'Equals',
    defaultParameters: {
      operator: 'gt'
    }
  },
  {
    id: 'cross',
    type: 'condition',
    category: 'condition',
    label: 'Cross',
    description: 'Detect crossover/crossunder between two values',
    icon: 'ArrowsLeftRight',
    defaultParameters: {
      operator: 'cross_above'
    }
  },
  {
    id: 'threshold',
    type: 'condition',
    category: 'condition',
    label: 'Threshold',
    description: 'Check if value crosses a fixed threshold level',
    icon: 'LineSegment',
    defaultParameters: {
      threshold: 50,
      operator: 'above'
    }
  },
  {
    id: 'range',
    type: 'condition',
    category: 'condition',
    label: 'Range',
    description: 'Check if value is within a specified range',
    icon: 'LineSegment',
    defaultParameters: {
      min: 30,
      max: 70
    }
  },
  {
    id: 'pattern',
    type: 'condition',
    category: 'condition',
    label: 'Pattern',
    description: 'Detect candlestick patterns',
    icon: 'ChartLine',
    defaultParameters: {
      pattern: 'engulfing'
    }
  },
  {
    id: 'and',
    type: 'logic',
    category: 'logic',
    label: 'AND',
    description: 'Logical AND operation',
    icon: 'CirclesThree',
    defaultParameters: {}
  },
  {
    id: 'or',
    type: 'logic',
    category: 'logic',
    label: 'OR',
    description: 'Logical OR operation',
    icon: 'CirclesThree',
    defaultParameters: {}
  },
  {
    id: 'not',
    type: 'logic',
    category: 'logic',
    label: 'NOT',
    description: 'Logical NOT operation',
    icon: 'ProhibitInset',
    defaultParameters: {}
  },
  {
    id: 'xor',
    type: 'logic',
    category: 'logic',
    label: 'XOR',
    description: 'Exclusive OR operation',
    icon: 'CirclesThree',
    defaultParameters: {}
  },
  {
    id: 'buy',
    type: 'action',
    category: 'action',
    label: 'Buy/Long',
    description: 'Open buy position',
    icon: 'TrendUp',
    defaultParameters: {
      lots: 0.01
    }
  },
  {
    id: 'sell',
    type: 'action',
    category: 'action',
    label: 'Sell/Short',
    description: 'Open sell position',
    icon: 'TrendDown',
    defaultParameters: {
      lots: 0.01
    }
  },
  {
    id: 'close',
    type: 'action',
    category: 'action',
    label: 'Close Position',
    description: 'Close open position',
    icon: 'X',
    defaultParameters: {}
  },
  {
    id: 'alert',
    type: 'action',
    category: 'action',
    label: 'Alert',
    description: 'Send notification',
    icon: 'BellRinging',
    defaultParameters: {
      message: 'Alert triggered'
    }
  },
  {
    id: 'position-size',
    type: 'risk',
    category: 'risk',
    label: 'Position Size',
    description: 'Calculate position size based on risk',
    icon: 'Percent',
    defaultParameters: {
      riskPercent: 1,
      method: 'fixed_percent'
    }
  },
  {
    id: 'stop-loss',
    type: 'risk',
    category: 'risk',
    label: 'Stop Loss',
    description: 'Set stop loss level',
    icon: 'WarningOctagon',
    defaultParameters: {
      pips: 20
    }
  },
  {
    id: 'take-profit',
    type: 'risk',
    category: 'risk',
    label: 'Take Profit',
    description: 'Set take profit level',
    icon: 'Target',
    defaultParameters: {
      pips: 40
    }
  },
  {
    id: 'trailing-stop',
    type: 'risk',
    category: 'risk',
    label: 'Trailing Stop',
    description: 'Dynamic trailing stop loss',
    icon: 'ShieldCheck',
    defaultParameters: {
      pips: 15,
      step: 5
    }
  }
]

export function getNodesByCategory(category: NodeCategory): NodeDefinition[] {
  return NODE_DEFINITIONS.filter(node => node.category === category)
}

export function getNodeDefinition(id: string): NodeDefinition | undefined {
  return NODE_DEFINITIONS.find(node => node.id === id)
}
