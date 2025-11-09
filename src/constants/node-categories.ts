export type NodeCategory = 'indicator' | 'condition' | 'action' | 'logic' | 'risk' | 'event' | 'pattern' | 'mtf' | 'variable' | 'advanced' | 'money_management' | 'graphical' | 'messaging' | 'file_ops' | 'terminal' | 'custom'

export type EventCategory = 'ontick' | 'oninit' | 'ontimer' | 'ontrade' | 'onchart' | 'ondeinit' | 'all'

export interface PinDefinition {
  id: string
  label: string
  type: 'input' | 'output'
  dataType: 'number' | 'boolean' | 'signal' | 'any'
  description?: string
  optional?: boolean
}

export interface NodeDefinition {
  id: string
  type: string
  category: NodeCategory
  label: string
  description: string
  icon: string
  defaultParameters?: Record<string, any>
  executionOrder?: number
  eventContext?: EventCategory[]
  inputs?: PinDefinition[]
  outputs?: PinDefinition[]
}

export const NODE_CATEGORIES: Array<{
  id: NodeCategory
  label: string
  description: string
  executionOrder: number
  color: string
  bgColor: string
  textColor: string
  borderColor: string
  accentColor: string
}> = [
  {
    id: 'event',
    label: 'Events',
    description: 'Strategy lifecycle events (OnInit, OnTick, OnTimer, etc.)',
    executionOrder: 0,
    color: 'oklch(0.75 0.15 290)',
    bgColor: 'oklch(0.35 0.08 290)',
    textColor: 'oklch(0.95 0.12 290)',
    borderColor: 'oklch(0.60 0.18 290)',
    accentColor: '#9333ea'
  },
  {
    id: 'indicator',
    label: 'Indicators',
    description: 'Technical analysis indicators',
    executionOrder: 1,
    color: 'oklch(0.65 0.20 240)',
    bgColor: 'oklch(0.35 0.10 240)',
    textColor: 'oklch(0.95 0.15 240)',
    borderColor: 'oklch(0.55 0.25 240)',
    accentColor: '#3b82f6'
  },
  {
    id: 'mtf',
    label: 'Multi-Timeframe',
    description: 'Multi-timeframe analysis nodes',
    executionOrder: 2,
    color: 'oklch(0.70 0.18 200)',
    bgColor: 'oklch(0.35 0.09 200)',
    textColor: 'oklch(0.95 0.14 200)',
    borderColor: 'oklch(0.58 0.22 200)',
    accentColor: '#0ea5e9'
  },
  {
    id: 'pattern',
    label: 'Patterns',
    description: 'Chart patterns and formations',
    executionOrder: 3,
    color: 'oklch(0.68 0.20 160)',
    bgColor: 'oklch(0.35 0.10 160)',
    textColor: 'oklch(0.95 0.16 160)',
    borderColor: 'oklch(0.56 0.24 160)',
    accentColor: '#10b981'
  },
  {
    id: 'condition',
    label: 'Conditions',
    description: 'Comparison and condition checks',
    executionOrder: 4,
    color: 'oklch(0.72 0.18 140)',
    bgColor: 'oklch(0.35 0.09 140)',
    textColor: 'oklch(0.95 0.14 140)',
    borderColor: 'oklch(0.60 0.22 140)',
    accentColor: '#22c55e'
  },
  {
    id: 'logic',
    label: 'Logic',
    description: 'Boolean logic operations',
    executionOrder: 5,
    color: 'oklch(0.68 0.16 260)',
    bgColor: 'oklch(0.35 0.08 260)',
    textColor: 'oklch(0.95 0.12 260)',
    borderColor: 'oklch(0.56 0.20 260)',
    accentColor: '#8b5cf6'
  },
  {
    id: 'variable',
    label: 'Variables',
    description: 'Variables and data storage',
    executionOrder: 6,
    color: 'oklch(0.70 0.16 50)',
    bgColor: 'oklch(0.35 0.08 50)',
    textColor: 'oklch(0.95 0.12 50)',
    borderColor: 'oklch(0.58 0.20 50)',
    accentColor: '#f97316'
  },
  {
    id: 'risk',
    label: 'Risk Management',
    description: 'Position sizing and risk controls',
    executionOrder: 7,
    color: 'oklch(0.75 0.18 80)',
    bgColor: 'oklch(0.35 0.09 80)',
    textColor: 'oklch(0.95 0.14 80)',
    borderColor: 'oklch(0.62 0.22 80)',
    accentColor: '#eab308'
  },
  {
    id: 'money_management',
    label: 'Money Management',
    description: 'Position sizing, Martingale, Fibonacci, Risk % and more',
    executionOrder: 8,
    color: 'oklch(0.68 0.20 130)',
    bgColor: 'oklch(0.35 0.10 130)',
    textColor: 'oklch(0.95 0.16 130)',
    borderColor: 'oklch(0.56 0.24 130)',
    accentColor: '#84cc16'
  },
  {
    id: 'advanced',
    label: 'Advanced Trade',
    description: 'Advanced trade management (trailing, break-even, partial close)',
    executionOrder: 9,
    color: 'oklch(0.68 0.18 310)',
    bgColor: 'oklch(0.35 0.09 310)',
    textColor: 'oklch(0.95 0.14 310)',
    borderColor: 'oklch(0.56 0.22 310)',
    accentColor: '#ec4899'
  },
  {
    id: 'graphical',
    label: 'Graphical Objects',
    description: 'Draw arrows, lines, text, Fibonacci on chart',
    executionOrder: 10,
    color: 'oklch(0.68 0.18 270)',
    bgColor: 'oklch(0.35 0.09 270)',
    textColor: 'oklch(0.95 0.14 270)',
    borderColor: 'oklch(0.56 0.22 270)',
    accentColor: '#6366f1'
  },
  {
    id: 'messaging',
    label: 'Messaging',
    description: 'Send notifications to email, website, smartphone',
    executionOrder: 11,
    color: 'oklch(0.70 0.18 220)',
    bgColor: 'oklch(0.35 0.09 220)',
    textColor: 'oklch(0.95 0.14 220)',
    borderColor: 'oklch(0.58 0.22 220)',
    accentColor: '#06b6d4'
  },
  {
    id: 'file_ops',
    label: 'File Operations',
    description: 'Read and write data to files',
    executionOrder: 12,
    color: 'oklch(0.72 0.20 40)',
    bgColor: 'oklch(0.35 0.10 40)',
    textColor: 'oklch(0.95 0.16 40)',
    borderColor: 'oklch(0.60 0.24 40)',
    accentColor: '#f59e0b'
  },
  {
    id: 'terminal',
    label: 'Terminal Variables',
    description: 'Access terminal and account information',
    executionOrder: 13,
    color: 'oklch(0.70 0.16 280)',
    bgColor: 'oklch(0.35 0.08 280)',
    textColor: 'oklch(0.95 0.12 280)',
    borderColor: 'oklch(0.58 0.20 280)',
    accentColor: '#a855f7'
  },
  {
    id: 'custom',
    label: 'Custom Blocks',
    description: 'Create and use custom reusable blocks',
    executionOrder: 14,
    color: 'oklch(0.70 0.18 350)',
    bgColor: 'oklch(0.35 0.09 350)',
    textColor: 'oklch(0.95 0.14 350)',
    borderColor: 'oklch(0.58 0.22 350)',
    accentColor: '#f43f5e'
  },
  {
    id: 'action',
    label: 'Actions',
    description: 'Trade execution actions',
    executionOrder: 15,
    color: 'oklch(0.65 0.22 25)',
    bgColor: 'oklch(0.35 0.11 25)',
    textColor: 'oklch(0.95 0.18 25)',
    borderColor: 'oklch(0.55 0.26 25)',
    accentColor: '#ef4444'
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
    label: 'Stoch',
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
    label: 'BB',
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
    label: 'SAR',
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
    label: 'Ichi',
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
    label: 'Pivot',
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
    label: 'Init',
    description: 'Strategy initialization event - runs once at start',
    icon: 'Play',
    defaultParameters: {},
    eventContext: ['oninit', 'all']
  },
  {
    id: 'on_tick',
    type: 'event',
    category: 'event',
    label: 'Tick',
    description: 'Tick event - runs on every price update',
    icon: 'Activity',
    defaultParameters: {},
    eventContext: ['ontick', 'all']
  },
  {
    id: 'on_timer',
    type: 'event',
    category: 'event',
    label: 'Timer',
    description: 'Timer event - runs at specified intervals',
    icon: 'Clock',
    defaultParameters: {
      intervalSeconds: 60
    },
    eventContext: ['ontimer', 'all']
  },
  {
    id: 'on_trade',
    type: 'event',
    category: 'event',
    label: 'Trade',
    description: 'Trade event - runs when trade is opened/closed',
    icon: 'CurrencyCircleDollar',
    defaultParameters: {},
    eventContext: ['ontrade', 'all']
  },
  {
    id: 'on_chart',
    type: 'event',
    category: 'event',
    label: 'Chart',
    description: 'Chart event - runs on chart events for visual updates',
    icon: 'ChartLineUp',
    defaultParameters: {},
    eventContext: ['onchart', 'all']
  },
  {
    id: 'on_deinit',
    type: 'event',
    category: 'event',
    label: 'Deinit',
    description: 'Deinitialization event - runs once at shutdown',
    icon: 'Stop',
    defaultParameters: {},
    eventContext: ['ondeinit', 'all']
  },
  {
    id: 'mtf_indicator',
    type: 'mtf',
    category: 'mtf',
    label: 'MTF',
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
    label: 'Cond',
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
    label: 'Trend',
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
    label: 'Candle',
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
    label: 'Chart',
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
    label: 'SR',
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
    label: 'Div',
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
    label: 'Set',
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
    label: 'Get',
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
    label: 'BE',
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
    label: 'Partial',
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
    label: 'Trail',
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
    label: 'Group',
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
    label: 'ScaleIn',
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
    label: 'ScaleOut',
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
    label: 'Hedge',
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
    label: 'TimeStop',
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
    label: 'Comp',
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
    label: 'Thresh',
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
    label: 'Pat',
    description: 'Detect candlestick patterns',
    icon: 'ChartLine',
    defaultParameters: {
      pattern: 'engulfing'
    }
  },
  {
    id: 'if',
    type: 'logic',
    category: 'logic',
    label: 'IF',
    description: 'Conditional branching - execute if condition is true',
    icon: 'GitBranch',
    defaultParameters: {}
  },
  {
    id: 'else',
    type: 'logic',
    category: 'logic',
    label: 'ELSE',
    description: 'Alternative branch - execute if condition is false',
    icon: 'ArrowBendUpLeft',
    defaultParameters: {}
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
    id: 'pass',
    type: 'pass',
    category: 'logic',
    label: 'Pass',
    description: 'Empty block that does nothing - use to connect single blocks',
    icon: 'Circle',
    defaultParameters: {}
  },
  {
    id: 'buy',
    type: 'action',
    category: 'action',
    label: 'Buy',
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
    label: 'Sell',
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
    label: 'Close',
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
    label: 'Pos',
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
    label: 'SL',
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
    label: 'TP',
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
    label: 'Trail',
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
    label: 'Money',
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
    label: 'BuyLim',
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
    label: 'SellLim',
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
    label: 'BuyStop',
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
    label: 'SellStop',
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
    label: 'Mod',
    description: 'Modify pending order parameters',
    icon: 'PencilSimple',
    defaultParameters: {}
  },
  {
    id: 'delete_pending',
    type: 'action',
    category: 'action',
    label: 'Del',
    description: 'Delete pending order',
    icon: 'Trash',
    defaultParameters: {}
  },
  {
    id: 'for_each_trade',
    type: 'logic',
    category: 'logic',
    label: 'Each',
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
    label: 'Pend',
    description: 'Loop through all pending orders',
    icon: 'ListDashes',
    defaultParameters: {}
  },
  {
    id: 'for_each_symbol',
    type: 'logic',
    category: 'logic',
    label: 'Sym',
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
    label: 'Repeat',
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
    label: 'Sub',
    description: 'Subtract numbers',
    icon: 'Minus',
    defaultParameters: {}
  },
  {
    id: 'math_multiply',
    type: 'variable',
    category: 'variable',
    label: 'Mult',
    description: 'Multiply numbers',
    icon: 'X',
    defaultParameters: {}
  },
  {
    id: 'math_divide',
    type: 'variable',
    category: 'variable',
    label: 'Div',
    description: 'Divide numbers',
    icon: 'Divide',
    defaultParameters: {}
  },
  {
    id: 'math_modulus',
    type: 'variable',
    category: 'variable',
    label: 'Mod',
    description: 'Remainder after division',
    icon: 'Percent',
    defaultParameters: {}
  },
  {
    id: 'math_power',
    type: 'variable',
    category: 'variable',
    label: 'Pow',
    description: 'Raise to power',
    icon: 'MathOperations',
    defaultParameters: {}
  },
  {
    id: 'math_sqrt',
    type: 'variable',
    category: 'variable',
    label: 'Sqrt',
    description: 'Calculate square root',
    icon: 'MathOperations',
    defaultParameters: {}
  },
  {
    id: 'math_abs',
    type: 'variable',
    category: 'variable',
    label: 'Abs',
    description: 'Get absolute value',
    icon: 'MathOperations',
    defaultParameters: {}
  },
  {
    id: 'math_min',
    type: 'variable',
    category: 'variable',
    label: 'Min',
    description: 'Find minimum value',
    icon: 'CaretDown',
    defaultParameters: {}
  },
  {
    id: 'math_max',
    type: 'variable',
    category: 'variable',
    label: 'Max',
    description: 'Find maximum value',
    icon: 'CaretUp',
    defaultParameters: {}
  },
  {
    id: 'account_balance',
    type: 'variable',
    category: 'variable',
    label: 'Bal',
    description: 'Get current account balance',
    icon: 'CurrencyDollar',
    defaultParameters: {}
  },
  {
    id: 'account_equity',
    type: 'variable',
    category: 'variable',
    label: 'Eq',
    description: 'Get current account equity',
    icon: 'Wallet',
    defaultParameters: {}
  },
  {
    id: 'account_margin',
    type: 'variable',
    category: 'variable',
    label: 'Mrg',
    description: 'Get available margin',
    icon: 'ChartLineUp',
    defaultParameters: {}
  },
  {
    id: 'account_profit',
    type: 'variable',
    category: 'variable',
    label: 'Prof',
    description: 'Get total floating profit/loss',
    icon: 'TrendUp',
    defaultParameters: {}
  },
  {
    id: 'symbol_bid',
    type: 'variable',
    category: 'variable',
    label: 'Bid',
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
    label: 'Ask',
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
    label: 'Sprd',
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
    label: 'Cnt',
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
    label: 'Exist',
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
    label: 'PendEx',
    description: 'Check if pending order exists',
    icon: 'Clock',
    defaultParameters: {}
  },
  {
    id: 'time_filter',
    type: 'condition',
    category: 'condition',
    label: 'Time',
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
    label: 'Spread',
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
    label: 'Comm',
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
    label: 'Code',
    description: 'Execute custom MQL4/MQL5 code',
    icon: 'Code',
    defaultParameters: {
      code: '// Custom logic here'
    }
  },
  {
    id: 'trailing_stop_advanced',
    type: 'advanced',
    category: 'advanced',
    label: 'AdvTr',
    description: 'Trail stop loss, take profit, or pending orders (MT4 compatible)',
    icon: 'TrendUp',
    defaultParameters: {
      trailType: 'stop_loss',
      activationPips: 20,
      trailPips: 15,
      stepPips: 5,
      trailMode: 'pips'
    },
    eventContext: ['ontick', 'ontimer', 'all']
  },
  {
    id: 'trail_group',
    type: 'advanced',
    category: 'advanced',
    label: 'TrGrp',
    description: 'Trail multiple trades collectively (MT4 group trailing)',
    icon: 'Stack',
    defaultParameters: {
      groupName: 'group1',
      trailPips: 15,
      stepPips: 5
    },
    eventContext: ['ontick', 'ontimer', 'all']
  },
  {
    id: 'global_constant',
    type: 'variable',
    category: 'variable',
    label: 'Const',
    description: 'Project input parameter (constant value)',
    icon: 'Lock',
    defaultParameters: {
      name: 'LotSize',
      value: 0.01,
      valueType: 'number',
      description: 'Initial lot size'
    },
    eventContext: ['all']
  },
  {
    id: 'global_variable',
    type: 'variable',
    category: 'variable',
    label: 'Glob',
    description: 'Global variable accessible across events',
    icon: 'Database',
    defaultParameters: {
      name: 'myGlobalVar',
      initialValue: 0,
      valueType: 'number'
    },
    eventContext: ['all']
  },
  {
    id: 'risk_percent',
    type: 'money_management',
    category: 'money_management',
    label: 'Risk%',
    description: 'Calculate lot size based on account risk percentage',
    icon: 'Percent',
    defaultParameters: {
      riskPercent: 2.0,
      stopLossPips: 20,
      maxLot: 10.0,
      minLot: 0.01
    },
    eventContext: ['ontick', 'all']
  },
  {
    id: 'fibonacci_lots',
    type: 'money_management',
    category: 'money_management',
    label: 'Fib',
    description: 'Fibonacci-based position sizing',
    icon: 'ChartLineUp',
    defaultParameters: {
      baseLot: 0.01,
      sequence: [1, 1, 2, 3, 5, 8, 13],
      resetOnWin: true,
      maxSequenceIndex: 6
    },
    eventContext: ['ontick', 'all']
  },
  {
    id: 'martingale',
    type: 'money_management',
    category: 'money_management',
    label: 'Mart',
    description: 'Fully customizable Martingale system',
    icon: 'ArrowsClockwise',
    defaultParameters: {
      baseLot: 0.01,
      multiplier: 2.0,
      maxLevels: 5,
      resetOnWin: true,
      resetOnProfit: 0,
      maxLot: 10.0
    },
    eventContext: ['ontick', 'all']
  },
  {
    id: 'anti_martingale',
    type: 'money_management',
    category: 'money_management',
    label: 'AntiM',
    description: 'Increase size on wins, decrease on losses',
    icon: 'TrendUp',
    defaultParameters: {
      baseLot: 0.01,
      multiplier: 1.5,
      maxLevels: 5,
      resetOnLoss: true
    },
    eventContext: ['ontick', 'all']
  },
  {
    id: 'custom_sequence',
    type: 'money_management',
    category: 'money_management',
    label: 'Seq',
    description: 'Custom lot size sequence (e.g., 0.01, 0.02, 0.05, 0.1)',
    icon: 'ListNumbers',
    defaultParameters: {
      sequence: [0.01, 0.02, 0.05, 0.1, 0.2],
      resetOnWin: true,
      loopSequence: false
    },
    eventContext: ['ontick', 'all']
  },
  {
    id: 'recovery_zones',
    type: 'money_management',
    category: 'money_management',
    label: 'Recov',
    description: 'Zone recovery money management',
    icon: 'ShieldCheck',
    defaultParameters: {
      zoneSize: 20,
      lotsPerZone: 0.01,
      maxZones: 5,
      recoveryTarget: 0
    },
    eventContext: ['ontick', 'all']
  },
  {
    id: 'fixed_ratio',
    type: 'money_management',
    category: 'money_management',
    label: 'FixRat',
    description: 'Fixed ratio money management (Ryan Jones)',
    icon: 'Equals',
    defaultParameters: {
      delta: 100,
      startingLot: 0.01,
      increment: 0.01
    },
    eventContext: ['ontick', 'all']
  },
  {
    id: 'kelly_criterion',
    type: 'money_management',
    category: 'money_management',
    label: 'Kelly',
    description: 'Kelly Criterion optimal f calculation',
    icon: 'MathOperations',
    defaultParameters: {
      winRate: 60,
      avgWin: 100,
      avgLoss: 50,
      kellyFraction: 0.25,
      maxRisk: 5
    },
    eventContext: ['ontick', 'all']
  },
  {
    id: 'dynamic_value_check',
    type: 'condition',
    category: 'condition',
    label: 'Dyn',
    description: 'Check dynamic values from indicators easily',
    icon: 'Lightning',
    defaultParameters: {
      source: 'indicator',
      indicatorId: '',
      operator: 'gt',
      threshold: 0,
      shiftBars: 0
    },
    eventContext: ['ontick', 'all']
  },
  {
    id: 'indicator_buffer',
    type: 'variable',
    category: 'variable',
    label: 'Buf',
    description: 'Get indicator value from specific bar (shift)',
    icon: 'ChartLine',
    defaultParameters: {
      indicatorId: '',
      buffer: 0,
      shift: 0
    },
    eventContext: ['ontick', 'all']
  },
  {
    id: 'draw_arrow',
    type: 'graphical',
    category: 'graphical',
    label: 'Arrow',
    description: 'Draw arrow on chart (up/down signals)',
    icon: 'ArrowUp',
    defaultParameters: {
      arrowType: 'up',
      color: 'blue',
      barShift: 0,
      price: 0,
      windowIndex: 0
    },
    eventContext: ['ontick', 'onchart', 'all']
  },
  {
    id: 'draw_line',
    type: 'graphical',
    category: 'graphical',
    label: 'Line',
    description: 'Draw trend line on chart',
    icon: 'LineSegment',
    defaultParameters: {
      startBar: 0,
      startPrice: 0,
      endBar: 10,
      endPrice: 0,
      color: 'yellow',
      style: 'solid',
      width: 1,
      windowIndex: 0
    },
    eventContext: ['ontick', 'onchart', 'all']
  },
  {
    id: 'draw_hline',
    type: 'graphical',
    category: 'graphical',
    label: 'HLine',
    description: 'Draw horizontal line at price level',
    icon: 'Minus',
    defaultParameters: {
      price: 0,
      color: 'white',
      style: 'solid',
      width: 1,
      windowIndex: 0
    },
    eventContext: ['ontick', 'onchart', 'all']
  },
  {
    id: 'draw_vline',
    type: 'graphical',
    category: 'graphical',
    label: 'VLine',
    description: 'Draw vertical line at time',
    icon: 'DividerVertical',
    defaultParameters: {
      barShift: 0,
      color: 'white',
      style: 'solid',
      width: 1,
      windowIndex: 0
    },
    eventContext: ['ontick', 'onchart', 'all']
  },
  {
    id: 'draw_text',
    type: 'graphical',
    category: 'graphical',
    label: 'Text',
    description: 'Draw text label on chart',
    icon: 'TextT',
    defaultParameters: {
      text: 'Label',
      barShift: 0,
      price: 0,
      fontSize: 10,
      color: 'white',
      anchor: 'center',
      windowIndex: 0
    },
    eventContext: ['ontick', 'onchart', 'all']
  },
  {
    id: 'draw_fibonacci',
    type: 'graphical',
    category: 'graphical',
    label: 'Fibo',
    description: 'Draw Fibonacci retracement levels',
    icon: 'ChartLine',
    defaultParameters: {
      startBar: 0,
      startPrice: 0,
      endBar: 20,
      endPrice: 0,
      levels: [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1.0],
      color: 'gold',
      windowIndex: 0
    },
    eventContext: ['ontick', 'onchart', 'all']
  },
  {
    id: 'draw_rectangle',
    type: 'graphical',
    category: 'graphical',
    label: 'Rect',
    description: 'Draw rectangle zone on chart',
    icon: 'Rectangle',
    defaultParameters: {
      startBar: 0,
      startPrice: 0,
      endBar: 10,
      endPrice: 0,
      color: 'blue',
      fillColor: 'blue',
      opacity: 0.3,
      windowIndex: 0
    },
    eventContext: ['ontick', 'onchart', 'all']
  },
  {
    id: 'delete_object',
    type: 'graphical',
    category: 'graphical',
    label: 'DelObj',
    description: 'Delete graphical object from chart',
    icon: 'Trash',
    defaultParameters: {
      objectName: '',
      deleteAll: false
    },
    eventContext: ['ontick', 'onchart', 'ondeinit', 'all']
  },
  {
    id: 'send_email',
    type: 'messaging',
    category: 'messaging',
    label: 'Email',
    description: 'Send email notification',
    icon: 'EnvelopeSimple',
    defaultParameters: {
      subject: 'Trade Alert',
      body: 'Signal triggered',
      attachScreenshot: false
    },
    eventContext: ['ontick', 'ontrade', 'all']
  },
  {
    id: 'send_notification',
    type: 'messaging',
    category: 'messaging',
    label: 'Push',
    description: 'Send push notification to smartphone (MT4/MT5)',
    icon: 'DeviceMobile',
    defaultParameters: {
      message: 'Trade Alert',
      includeSymbol: true,
      includePrice: true
    },
    eventContext: ['ontick', 'ontrade', 'all']
  },
  {
    id: 'webhook',
    type: 'messaging',
    category: 'messaging',
    label: 'Hook',
    description: 'Send HTTP request to website/webhook',
    icon: 'Globe',
    defaultParameters: {
      url: 'https://example.com/webhook',
      method: 'POST',
      payload: '{"event": "signal"}',
      headers: '{}'
    },
    eventContext: ['ontick', 'ontrade', 'all']
  },
  {
    id: 'telegram_message',
    type: 'messaging',
    category: 'messaging',
    label: 'Tele',
    description: 'Send message to Telegram bot',
    icon: 'PaperPlaneTilt',
    defaultParameters: {
      botToken: '',
      chatId: '',
      message: 'Trade Alert',
      parseMode: 'HTML'
    },
    eventContext: ['ontick', 'ontrade', 'all']
  },
  {
    id: 'write_file',
    type: 'file_ops',
    category: 'file_ops',
    label: 'Write',
    description: 'Write data to file (CSV, TXT)',
    icon: 'FloppyDisk',
    defaultParameters: {
      fileName: 'data.csv',
      content: '',
      append: true,
      addTimestamp: true
    },
    eventContext: ['ontick', 'ontrade', 'ondeinit', 'all']
  },
  {
    id: 'read_file',
    type: 'file_ops',
    category: 'file_ops',
    label: 'Read',
    description: 'Read data from file',
    icon: 'FileText',
    defaultParameters: {
      fileName: 'data.csv',
      lineNumber: -1
    },
    eventContext: ['oninit', 'ontick', 'all']
  },
  {
    id: 'file_exists',
    type: 'condition',
    category: 'condition',
    label: 'FileEx',
    description: 'Check if file exists',
    icon: 'FileSearch',
    defaultParameters: {
      fileName: 'data.csv'
    },
    eventContext: ['oninit', 'ontick', 'all']
  },
  {
    id: 'delete_file',
    type: 'file_ops',
    category: 'file_ops',
    label: 'DelFile',
    description: 'Delete file from disk',
    icon: 'Trash',
    defaultParameters: {
      fileName: 'data.csv'
    },
    eventContext: ['ondeinit', 'all']
  },
  {
    id: 'terminal_company',
    type: 'terminal',
    category: 'terminal',
    label: 'Brkr',
    description: 'Get broker company name',
    icon: 'Bank',
    defaultParameters: {},
    eventContext: ['all']
  },
  {
    id: 'terminal_name',
    type: 'terminal',
    category: 'terminal',
    label: 'Term',
    description: 'Get terminal name and version',
    icon: 'Desktop',
    defaultParameters: {},
    eventContext: ['all']
  },
  {
    id: 'account_number',
    type: 'terminal',
    category: 'terminal',
    label: 'AccNum',
    description: 'Get account number',
    icon: 'IdentificationCard',
    defaultParameters: {},
    eventContext: ['all']
  },
  {
    id: 'account_name',
    type: 'terminal',
    category: 'terminal',
    label: 'AccName',
    description: 'Get account holder name',
    icon: 'User',
    defaultParameters: {},
    eventContext: ['all']
  },
  {
    id: 'account_leverage',
    type: 'terminal',
    category: 'terminal',
    label: 'Lev',
    description: 'Get account leverage',
    icon: 'ChartLineUp',
    defaultParameters: {},
    eventContext: ['all']
  },
  {
    id: 'account_currency',
    type: 'terminal',
    category: 'terminal',
    label: 'Cur',
    description: 'Get account currency',
    icon: 'CurrencyDollar',
    defaultParameters: {},
    eventContext: ['all']
  },
  {
    id: 'server_time',
    type: 'terminal',
    category: 'terminal',
    label: 'Time',
    description: 'Get server time',
    icon: 'Clock',
    defaultParameters: {},
    eventContext: ['all']
  },
  {
    id: 'is_demo',
    type: 'terminal',
    category: 'terminal',
    label: 'Demo?',
    description: 'Check if running on demo account',
    icon: 'TestTube',
    defaultParameters: {},
    eventContext: ['all']
  },
  {
    id: 'is_connected',
    type: 'terminal',
    category: 'terminal',
    label: 'Conn?',
    description: 'Check if terminal is connected to server',
    icon: 'WifiHigh',
    defaultParameters: {},
    eventContext: ['all']
  },
  {
    id: 'create_custom_block',
    type: 'custom',
    category: 'custom',
    label: 'Create',
    description: 'Create reusable custom block from selected nodes',
    icon: 'Package',
    defaultParameters: {
      blockName: 'My Custom Block',
      description: '',
      inputs: [],
      outputs: []
    },
    eventContext: ['all']
  },
  {
    id: 'use_custom_block',
    type: 'custom',
    category: 'custom',
    label: 'Use',
    description: 'Use previously created custom block',
    icon: 'Cube',
    defaultParameters: {
      blockId: '',
      blockName: ''
    },
    eventContext: ['all']
  }
]

export function getNodesByCategory(category: NodeCategory): NodeDefinition[] {
  return NODE_DEFINITIONS.filter(node => node.category === category)
}

export function getNodeDefinition(id: string): NodeDefinition | undefined {
  return NODE_DEFINITIONS.find(node => node.id === id)
}

export function getNodesByEventContext(eventContext: EventCategory): NodeDefinition[] {
  if (eventContext === 'all') {
    return NODE_DEFINITIONS
  }
  return NODE_DEFINITIONS.filter(node => 
    !node.eventContext || 
    node.eventContext.includes(eventContext) || 
    node.eventContext.includes('all')
  )
}

export function countNodesByEventContext(eventContext: EventCategory): number {
  return getNodesByEventContext(eventContext).length
}

export function getCategoryColors(category: NodeCategory) {
  const categoryInfo = NODE_CATEGORIES.find(cat => cat.id === category)
  return categoryInfo ? {
    color: categoryInfo.color,
    bgColor: categoryInfo.bgColor,
    textColor: categoryInfo.textColor,
    borderColor: categoryInfo.borderColor,
    accentColor: categoryInfo.accentColor
  } : {
    color: 'oklch(0.55 0.18 50)',
    bgColor: 'oklch(0.35 0.09 50)',
    textColor: 'oklch(0.95 0.14 50)',
    borderColor: 'oklch(0.55 0.22 50)',
    accentColor: '#f59e0b'
  }
}
