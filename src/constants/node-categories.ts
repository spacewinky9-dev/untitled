export type NodeCategory = 'indicator' | 'condition' | 'action' | 'logic' | 'risk' | 'event' | 'pattern' | 'mtf' | 'variable' | 'advanced'

export interface NodeDefinition {
  id: string
  type: string
  category: NodeCategory
  label: string
  description: string
  icon: string
  defaultParameters?: Record<string, any>
  executionOrder?: number
}

export const NODE_CATEGORIES: Array<{
  id: NodeCategory
  label: string
  description: string
  executionOrder: number
  color: string
  borderColor: string
}> = [
  {
    id: 'event',
    label: 'Events',
    description: 'Strategy lifecycle events (OnInit, OnTick, OnTimer, etc.)',
    executionOrder: 0,
    color: 'oklch(0.80 0.10 320)',
    borderColor: 'border-purple-500'
  },
  {
    id: 'indicator',
    label: 'Indicators',
    description: 'Technical analysis indicators',
    executionOrder: 1,
    color: 'oklch(0.70 0.15 210)',
    borderColor: 'border-accent'
  },
  {
    id: 'mtf',
    label: 'Multi-Timeframe',
    description: 'Multi-timeframe analysis nodes',
    executionOrder: 2,
    color: 'oklch(0.65 0.12 180)',
    borderColor: 'border-cyan-500'
  },
  {
    id: 'pattern',
    label: 'Patterns',
    description: 'Chart patterns and formations',
    executionOrder: 3,
    color: 'oklch(0.70 0.18 90)',
    borderColor: 'border-green-500'
  },
  {
    id: 'condition',
    label: 'Conditions',
    description: 'Comparison and condition checks',
    executionOrder: 4,
    color: 'oklch(0.65 0.18 145)',
    borderColor: 'border-bullish'
  },
  {
    id: 'logic',
    label: 'Logic',
    description: 'Boolean logic operations',
    executionOrder: 5,
    color: 'oklch(0.60 0.12 280)',
    borderColor: 'border-primary'
  },
  {
    id: 'variable',
    label: 'Variables',
    description: 'Variables and data storage',
    executionOrder: 6,
    color: 'oklch(0.68 0.10 40)',
    borderColor: 'border-orange-500'
  },
  {
    id: 'risk',
    label: 'Risk Management',
    description: 'Position sizing and risk controls',
    executionOrder: 7,
    color: 'oklch(0.75 0.15 60)',
    borderColor: 'border-yellow-500'
  },
  {
    id: 'advanced',
    label: 'Advanced Trade',
    description: 'Advanced trade management (trailing, break-even, partial close)',
    executionOrder: 8,
    color: 'oklch(0.60 0.15 300)',
    borderColor: 'border-pink-500'
  },
  {
    id: 'action',
    label: 'Actions',
    description: 'Trade execution actions',
    executionOrder: 9,
    color: 'oklch(0.55 0.20 25)',
    borderColor: 'border-bearish'
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
    id: 'on_init',
    type: 'event',
    category: 'event',
    label: 'OnInit',
    description: 'Strategy initialization event - runs once at start',
    icon: 'Play',
    defaultParameters: {}
  },
  {
    id: 'on_tick',
    type: 'event',
    category: 'event',
    label: 'OnTick',
    description: 'Tick event - runs on every price update',
    icon: 'Activity',
    defaultParameters: {}
  },
  {
    id: 'on_timer',
    type: 'event',
    category: 'event',
    label: 'OnTimer',
    description: 'Timer event - runs at specified intervals',
    icon: 'Clock',
    defaultParameters: {
      intervalSeconds: 60
    }
  },
  {
    id: 'on_trade',
    type: 'event',
    category: 'event',
    label: 'OnTrade',
    description: 'Trade event - runs when trade is opened/closed',
    icon: 'CurrencyCircleDollar',
    defaultParameters: {}
  },
  {
    id: 'on_deinit',
    type: 'event',
    category: 'event',
    label: 'OnDeinit',
    description: 'Deinitialization event - runs once at shutdown',
    icon: 'Stop',
    defaultParameters: {}
  },
  {
    id: 'mtf_indicator',
    type: 'mtf',
    category: 'mtf',
    label: 'MTF Indicator',
    description: 'Multi-timeframe indicator value',
    icon: 'ChartLine',
    defaultParameters: {
      timeframe: 'H1',
      indicator: 'sma',
      period: 20
    }
  },
  {
    id: 'mtf_condition',
    type: 'mtf',
    category: 'mtf',
    label: 'MTF Condition',
    description: 'Multi-timeframe condition check',
    icon: 'Equalizer',
    defaultParameters: {
      timeframe: 'H1',
      condition: 'trend_up'
    }
  },
  {
    id: 'higher_timeframe_trend',
    type: 'mtf',
    category: 'mtf',
    label: 'HTF Trend',
    description: 'Higher timeframe trend direction',
    icon: 'TrendUp',
    defaultParameters: {
      timeframe: 'H4'
    }
  },
  {
    id: 'candlestick_pattern',
    type: 'pattern',
    category: 'pattern',
    label: 'Candlestick Pattern',
    description: 'Detect candlestick patterns (engulfing, doji, hammer, etc.)',
    icon: 'Barcode',
    defaultParameters: {
      pattern: 'bullish_engulfing'
    }
  },
  {
    id: 'chart_pattern',
    type: 'pattern',
    category: 'pattern',
    label: 'Chart Pattern',
    description: 'Detect chart patterns (head & shoulders, triangles, etc.)',
    icon: 'ChartLine',
    defaultParameters: {
      pattern: 'double_bottom'
    }
  },
  {
    id: 'support_resistance',
    type: 'pattern',
    category: 'pattern',
    label: 'Support/Resistance',
    description: 'Detect support and resistance levels',
    icon: 'LineSegment',
    defaultParameters: {
      lookback: 20,
      threshold: 0.001
    }
  },
  {
    id: 'divergence',
    type: 'pattern',
    category: 'pattern',
    label: 'Divergence',
    description: 'Detect price/indicator divergence',
    icon: 'ArrowsOutCardinal',
    defaultParameters: {
      indicator: 'rsi',
      type: 'bullish'
    }
  },
  {
    id: 'set_variable',
    type: 'variable',
    category: 'variable',
    label: 'Set Variable',
    description: 'Store value in a variable',
    icon: 'Database',
    defaultParameters: {
      variableName: 'myVar',
      value: 0
    }
  },
  {
    id: 'get_variable',
    type: 'variable',
    category: 'variable',
    label: 'Get Variable',
    description: 'Retrieve value from a variable',
    icon: 'FileSearch',
    defaultParameters: {
      variableName: 'myVar'
    }
  },
  {
    id: 'counter',
    type: 'variable',
    category: 'variable',
    label: 'Counter',
    description: 'Increment/decrement counter variable',
    icon: 'NumberCircleOne',
    defaultParameters: {
      counterName: 'count',
      operation: 'increment'
    }
  },
  {
    id: 'array',
    type: 'variable',
    category: 'variable',
    label: 'Array',
    description: 'Array operations (push, pop, get)',
    icon: 'Stack',
    defaultParameters: {
      arrayName: 'data',
      operation: 'push'
    }
  },
  {
    id: 'break_even',
    type: 'advanced',
    category: 'advanced',
    label: 'Break Even',
    description: 'Move stop loss to break even after profit target',
    icon: 'Equals',
    defaultParameters: {
      profitPips: 20,
      lockPips: 0
    }
  },
  {
    id: 'partial_close',
    type: 'advanced',
    category: 'advanced',
    label: 'Partial Close',
    description: 'Close partial position at profit levels',
    icon: 'ChartLineUp',
    defaultParameters: {
      profitPips: 30,
      closePercent: 50
    }
  },
  {
    id: 'trailing_stop',
    type: 'advanced',
    category: 'advanced',
    label: 'Trailing Stop',
    description: 'Advanced trailing stop with activation level',
    icon: 'ShieldCheck',
    defaultParameters: {
      activationPips: 20,
      trailingPips: 15,
      stepPips: 5
    }
  },
  {
    id: 'trade_group',
    type: 'advanced',
    category: 'advanced',
    label: 'Trade Group',
    description: 'Group trades for collective management',
    icon: 'Stack',
    defaultParameters: {
      groupName: 'group1',
      maxTrades: 3
    }
  },
  {
    id: 'scale_in',
    type: 'advanced',
    category: 'advanced',
    label: 'Scale In',
    description: 'Add to position at specific levels',
    icon: 'ArrowsIn',
    defaultParameters: {
      addPips: 10,
      maxPositions: 3,
      multiplier: 1.0
    }
  },
  {
    id: 'scale_out',
    type: 'advanced',
    category: 'advanced',
    label: 'Scale Out',
    description: 'Exit position in multiple stages',
    icon: 'ArrowsOut',
    defaultParameters: {
      exitLevels: [20, 40, 60],
      portions: [33, 33, 34]
    }
  },
  {
    id: 'hedging',
    type: 'advanced',
    category: 'advanced',
    label: 'Hedging',
    description: 'Open hedge position to protect profits',
    icon: 'ShieldChevron',
    defaultParameters: {
      triggerPips: 30,
      hedgeRatio: 1.0
    }
  },
  {
    id: 'time_stop',
    type: 'advanced',
    category: 'advanced',
    label: 'Time Stop',
    description: 'Close trade after specified time',
    icon: 'HourglassLow',
    defaultParameters: {
      durationMinutes: 60
    }
  },
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
  },
  {
    id: 'money_management',
    type: 'risk',
    category: 'risk',
    label: 'Money Management',
    description: 'Advanced position sizing (Martingale, Anti-Martingale, Recovery, etc.)',
    icon: 'CurrencyDollar',
    defaultParameters: {
      method: 'risk_percent',
      riskPercent: 1,
      maxLotSize: 10,
      minLotSize: 0.01
    }
  },
  {
    id: 'buy_limit',
    type: 'action',
    category: 'action',
    label: 'Buy Limit',
    description: 'Place buy limit pending order',
    icon: 'ArrowDown',
    defaultParameters: {
      lots: 0.01,
      pips: 20
    }
  },
  {
    id: 'sell_limit',
    type: 'action',
    category: 'action',
    label: 'Sell Limit',
    description: 'Place sell limit pending order',
    icon: 'ArrowUp',
    defaultParameters: {
      lots: 0.01,
      pips: 20
    }
  },
  {
    id: 'buy_stop',
    type: 'action',
    category: 'action',
    label: 'Buy Stop',
    description: 'Place buy stop pending order',
    icon: 'ArrowUp',
    defaultParameters: {
      lots: 0.01,
      pips: 20
    }
  },
  {
    id: 'sell_stop',
    type: 'action',
    category: 'action',
    label: 'Sell Stop',
    description: 'Place sell stop pending order',
    icon: 'ArrowDown',
    defaultParameters: {
      lots: 0.01,
      pips: 20
    }
  },
  {
    id: 'modify_pending',
    type: 'action',
    category: 'action',
    label: 'Modify Pending',
    description: 'Modify pending order parameters',
    icon: 'PencilSimple',
    defaultParameters: {}
  },
  {
    id: 'delete_pending',
    type: 'action',
    category: 'action',
    label: 'Delete Pending',
    description: 'Delete pending order',
    icon: 'Trash',
    defaultParameters: {}
  },
  {
    id: 'for_each_trade',
    type: 'logic',
    category: 'logic',
    label: 'For Each Trade',
    description: 'Loop through all open trades',
    icon: 'ArrowsClockwise',
    defaultParameters: {
      filterByGroup: false,
      groupName: ''
    }
  },
  {
    id: 'for_each_pending',
    type: 'logic',
    category: 'logic',
    label: 'For Each Pending',
    description: 'Loop through all pending orders',
    icon: 'ListDashes',
    defaultParameters: {}
  },
  {
    id: 'for_each_symbol',
    type: 'logic',
    category: 'logic',
    label: 'For Each Symbol',
    description: 'Loop through multiple currency pairs',
    icon: 'Stack',
    defaultParameters: {
      symbols: ['EURUSD', 'GBPUSD']
    }
  },
  {
    id: 'repeat_n',
    type: 'logic',
    category: 'logic',
    label: 'Repeat N Times',
    description: 'Repeat logic N times',
    icon: 'Repeat',
    defaultParameters: {
      count: 3
    }
  },
  {
    id: 'math_add',
    type: 'variable',
    category: 'variable',
    label: 'Add',
    description: 'Add two or more numbers',
    icon: 'Plus',
    defaultParameters: {}
  },
  {
    id: 'math_subtract',
    type: 'variable',
    category: 'variable',
    label: 'Subtract',
    description: 'Subtract numbers',
    icon: 'Minus',
    defaultParameters: {}
  },
  {
    id: 'math_multiply',
    type: 'variable',
    category: 'variable',
    label: 'Multiply',
    description: 'Multiply numbers',
    icon: 'X',
    defaultParameters: {}
  },
  {
    id: 'math_divide',
    type: 'variable',
    category: 'variable',
    label: 'Divide',
    description: 'Divide numbers',
    icon: 'Divide',
    defaultParameters: {}
  },
  {
    id: 'math_modulus',
    type: 'variable',
    category: 'variable',
    label: 'Modulus',
    description: 'Remainder after division',
    icon: 'Percent',
    defaultParameters: {}
  },
  {
    id: 'math_power',
    type: 'variable',
    category: 'variable',
    label: 'Power',
    description: 'Raise to power',
    icon: 'MathOperations',
    defaultParameters: {}
  },
  {
    id: 'math_sqrt',
    type: 'variable',
    category: 'variable',
    label: 'Square Root',
    description: 'Calculate square root',
    icon: 'MathOperations',
    defaultParameters: {}
  },
  {
    id: 'math_abs',
    type: 'variable',
    category: 'variable',
    label: 'Absolute Value',
    description: 'Get absolute value',
    icon: 'MathOperations',
    defaultParameters: {}
  },
  {
    id: 'math_min',
    type: 'variable',
    category: 'variable',
    label: 'Minimum',
    description: 'Find minimum value',
    icon: 'CaretDown',
    defaultParameters: {}
  },
  {
    id: 'math_max',
    type: 'variable',
    category: 'variable',
    label: 'Maximum',
    description: 'Find maximum value',
    icon: 'CaretUp',
    defaultParameters: {}
  },
  {
    id: 'account_balance',
    type: 'variable',
    category: 'variable',
    label: 'Account Balance',
    description: 'Get current account balance',
    icon: 'CurrencyDollar',
    defaultParameters: {}
  },
  {
    id: 'account_equity',
    type: 'variable',
    category: 'variable',
    label: 'Account Equity',
    description: 'Get current account equity',
    icon: 'Wallet',
    defaultParameters: {}
  },
  {
    id: 'account_margin',
    type: 'variable',
    category: 'variable',
    label: 'Free Margin',
    description: 'Get available margin',
    icon: 'ChartLineUp',
    defaultParameters: {}
  },
  {
    id: 'account_profit',
    type: 'variable',
    category: 'variable',
    label: 'Account Profit',
    description: 'Get total floating profit/loss',
    icon: 'TrendUp',
    defaultParameters: {}
  },
  {
    id: 'symbol_bid',
    type: 'variable',
    category: 'variable',
    label: 'Symbol Bid',
    description: 'Get current bid price',
    icon: 'ChartLine',
    defaultParameters: {
      symbol: 'EURUSD'
    }
  },
  {
    id: 'symbol_ask',
    type: 'variable',
    category: 'variable',
    label: 'Symbol Ask',
    description: 'Get current ask price',
    icon: 'ChartLine',
    defaultParameters: {
      symbol: 'EURUSD'
    }
  },
  {
    id: 'symbol_spread',
    type: 'variable',
    category: 'variable',
    label: 'Symbol Spread',
    description: 'Get current spread in pips',
    icon: 'ArrowsOutLineHorizontal',
    defaultParameters: {
      symbol: 'EURUSD'
    }
  },
  {
    id: 'trades_count',
    type: 'condition',
    category: 'condition',
    label: 'Trades Count',
    description: 'Check number of open trades',
    icon: 'Hash',
    defaultParameters: {
      operator: 'lt',
      value: 5
    }
  },
  {
    id: 'trade_exists',
    type: 'condition',
    category: 'condition',
    label: 'Trade Exists',
    description: 'Check if trade exists',
    icon: 'Check',
    defaultParameters: {
      groupName: ''
    }
  },
  {
    id: 'pending_exists',
    type: 'condition',
    category: 'condition',
    label: 'Pending Exists',
    description: 'Check if pending order exists',
    icon: 'Clock',
    defaultParameters: {}
  },
  {
    id: 'time_filter',
    type: 'condition',
    category: 'condition',
    label: 'Time Filter',
    description: 'Filter by time of day and day of week',
    icon: 'Clock',
    defaultParameters: {
      startHour: 0,
      endHour: 23,
      allowedDays: [1, 2, 3, 4, 5]
    }
  },
  {
    id: 'spread_filter',
    type: 'condition',
    category: 'condition',
    label: 'Spread Filter',
    description: 'Check if spread is acceptable',
    icon: 'ArrowsOutLineHorizontal',
    defaultParameters: {
      maxSpreadPips: 2.0
    }
  },
  {
    id: 'print',
    type: 'action',
    category: 'action',
    label: 'Print',
    description: 'Print message to console/log',
    icon: 'Terminal',
    defaultParameters: {
      message: 'Debug message'
    }
  },
  {
    id: 'comment',
    type: 'action',
    category: 'action',
    label: 'Comment',
    description: 'Display text on chart',
    icon: 'ChatText',
    defaultParameters: {
      text: 'Chart comment'
    }
  },
  {
    id: 'custom_code',
    type: 'advanced',
    category: 'advanced',
    label: 'Custom Code',
    description: 'Execute custom MQL4/MQL5 code',
    icon: 'Code',
    defaultParameters: {
      code: '// Custom logic here'
    }
  }
]

export function getNodesByCategory(category: NodeCategory): NodeDefinition[] {
  return NODE_DEFINITIONS.filter(node => node.category === category)
}

export function getNodeDefinition(id: string): NodeDefinition | undefined {
  return NODE_DEFINITIONS.find(node => node.id === id)
}
