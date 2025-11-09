/**
 * Indicator Condition Node Definitions
 * Special condition nodes for comparing and analyzing indicators
 * Based on FxDreema block system design
 */

import { NodeDefinition } from './node-categories'

/**
 * Indicator-specific condition nodes
 * These provide specialized conditions for indicator analysis
 */
export const INDICATOR_CONDITION_DEFINITIONS: NodeDefinition[] = [
  {
    id: 'indicator_visible',
    type: 'condition',
    category: 'condition',
    label: 'Indicator is Visible',
    description: 'Check if indicator is currently visible on chart',
    icon: 'Eye',
    defaultParameters: {
      indicatorId: 'sma',
      period: 20
    },
    inputs: [
      { id: 'indicator', label: 'Indicator', type: 'input', dataType: 'number' }
    ],
    outputs: [
      { id: 'true', label: 'True', type: 'output', dataType: 'boolean' }
    ]
  },
  {
    id: 'indicator_invisible',
    type: 'condition',
    category: 'condition',
    label: 'Indicator is Invisible',
    description: 'Check if indicator is currently invisible/hidden on chart',
    icon: 'EyeSlash',
    defaultParameters: {
      indicatorId: 'sma',
      period: 20
    },
    inputs: [
      { id: 'indicator', label: 'Indicator', type: 'input', dataType: 'number' }
    ],
    outputs: [
      { id: 'true', label: 'True', type: 'output', dataType: 'boolean' }
    ]
  },
  {
    id: 'indicator_appear',
    type: 'condition',
    category: 'condition',
    label: 'Indicator Appear',
    description: 'Triggers when indicator appears (becomes visible)',
    icon: 'Eye',
    defaultParameters: {
      indicatorId: 'sma',
      period: 20
    },
    inputs: [
      { id: 'indicator', label: 'Indicator', type: 'input', dataType: 'number' }
    ],
    outputs: [
      { id: 'trigger', label: 'Triggered', type: 'output', dataType: 'signal' }
    ]
  },
  {
    id: 'indicator_disappear',
    type: 'condition',
    category: 'condition',
    label: 'Indicator Disappear',
    description: 'Triggers when indicator disappears (becomes hidden)',
    icon: 'EyeSlash',
    defaultParameters: {
      indicatorId: 'sma',
      period: 20
    },
    inputs: [
      { id: 'indicator', label: 'Indicator', type: 'input', dataType: 'number' }
    ],
    outputs: [
      { id: 'trigger', label: 'Triggered', type: 'output', dataType: 'signal' }
    ]
  },
  {
    id: 'indicator_rise',
    type: 'condition',
    category: 'condition',
    label: 'Indicator Rise',
    description: 'Check if indicator value is rising (current > previous)',
    icon: 'TrendUp',
    defaultParameters: {
      bars: 1,
      threshold: 0
    },
    inputs: [
      { id: 'indicator', label: 'Indicator', type: 'input', dataType: 'number' }
    ],
    outputs: [
      { id: 'true', label: 'Rising', type: 'output', dataType: 'boolean' }
    ]
  },
  {
    id: 'indicator_fall',
    type: 'condition',
    category: 'condition',
    label: 'Indicator Fall',
    description: 'Check if indicator value is falling (current < previous)',
    icon: 'TrendDown',
    defaultParameters: {
      bars: 1,
      threshold: 0
    },
    inputs: [
      { id: 'indicator', label: 'Indicator', type: 'input', dataType: 'number' }
    ],
    outputs: [
      { id: 'true', label: 'Falling', type: 'output', dataType: 'boolean' }
    ]
  },
  {
    id: 'indicator_within_limits',
    type: 'condition',
    category: 'condition',
    label: 'Indicator Moves Within Limits',
    description: 'Check if indicator value stays within specified range',
    icon: 'ArrowsLeftRight',
    defaultParameters: {
      lowerLimit: 20,
      upperLimit: 80
    },
    inputs: [
      { id: 'indicator', label: 'Indicator', type: 'input', dataType: 'number' }
    ],
    outputs: [
      { id: 'true', label: 'Within', type: 'output', dataType: 'boolean' },
      { id: 'false', label: 'Outside', type: 'output', dataType: 'boolean' }
    ]
  },
  {
    id: 'price_above_indicator',
    type: 'condition',
    category: 'condition',
    label: 'Price >> Indicator',
    description: 'Check if price is significantly above indicator',
    icon: 'CaretDoubleUp',
    defaultParameters: {
      threshold: 0.001,
      percentMode: false
    },
    inputs: [
      { id: 'price', label: 'Price', type: 'input', dataType: 'number' },
      { id: 'indicator', label: 'Indicator', type: 'input', dataType: 'number' }
    ],
    outputs: [
      { id: 'true', label: 'Above', type: 'output', dataType: 'boolean' }
    ]
  },
  {
    id: 'price_below_indicator',
    type: 'condition',
    category: 'condition',
    label: 'Price << Indicator',
    description: 'Check if price is significantly below indicator',
    icon: 'CaretDoubleDown',
    defaultParameters: {
      threshold: 0.001,
      percentMode: false
    },
    inputs: [
      { id: 'price', label: 'Price', type: 'input', dataType: 'number' },
      { id: 'indicator', label: 'Indicator', type: 'input', dataType: 'number' }
    ],
    outputs: [
      { id: 'true', label: 'Below', type: 'output', dataType: 'boolean' }
    ]
  },
  {
    id: 'indicator_crosses_level',
    type: 'condition',
    category: 'condition',
    label: 'Indicator Crosses Level',
    description: 'Detects when indicator crosses a specific level',
    icon: 'Intersection',
    defaultParameters: {
      level: 50,
      direction: 'above' // 'above', 'below', 'both'
    },
    inputs: [
      { id: 'indicator', label: 'Indicator', type: 'input', dataType: 'number' }
    ],
    outputs: [
      { id: 'crossed_above', label: 'Above', type: 'output', dataType: 'signal' },
      { id: 'crossed_below', label: 'Below', type: 'output', dataType: 'signal' }
    ]
  },
  {
    id: 'indicator_divergence',
    type: 'condition',
    category: 'condition',
    label: 'Indicator Divergence',
    description: 'Detect divergence between price and indicator',
    icon: 'ArrowsOutSimple',
    defaultParameters: {
      lookback: 20,
      type: 'bullish' // 'bullish', 'bearish', 'both'
    },
    inputs: [
      { id: 'price', label: 'Price', type: 'input', dataType: 'number' },
      { id: 'indicator', label: 'Indicator', type: 'input', dataType: 'number' }
    ],
    outputs: [
      { id: 'bullish_div', label: 'Bullish Div', type: 'output', dataType: 'signal' },
      { id: 'bearish_div', label: 'Bearish Div', type: 'output', dataType: 'signal' }
    ]
  },
  {
    id: 'indicator_extreme',
    type: 'condition',
    category: 'condition',
    label: 'Indicator at Extreme',
    description: 'Check if indicator is at overbought or oversold levels',
    icon: 'Warning',
    defaultParameters: {
      overbought: 70,
      oversold: 30
    },
    inputs: [
      { id: 'indicator', label: 'Indicator', type: 'input', dataType: 'number' }
    ],
    outputs: [
      { id: 'overbought', label: 'Overbought', type: 'output', dataType: 'boolean' },
      { id: 'oversold', label: 'Oversold', type: 'output', dataType: 'boolean' },
      { id: 'neutral', label: 'Neutral', type: 'output', dataType: 'boolean' }
    ]
  },
  {
    id: 'two_indicators_cross',
    type: 'condition',
    category: 'condition',
    label: 'Two Indicators Cross',
    description: 'Detect when two indicators cross each other',
    icon: 'Intersect',
    defaultParameters: {
      direction: 'both' // 'above', 'below', 'both'
    },
    inputs: [
      { id: 'indicator1', label: 'Indicator 1', type: 'input', dataType: 'number' },
      { id: 'indicator2', label: 'Indicator 2', type: 'input', dataType: 'number' }
    ],
    outputs: [
      { id: 'cross_above', label: 'Cross Above', type: 'output', dataType: 'signal' },
      { id: 'cross_below', label: 'Cross Below', type: 'output', dataType: 'signal' }
    ]
  },
  {
    id: 'indicator_trend',
    type: 'condition',
    category: 'condition',
    label: 'Indicator Trend',
    description: 'Analyze trend direction based on indicator slope',
    icon: 'ChartLineUp',
    defaultParameters: {
      period: 5,
      threshold: 0.0001
    },
    inputs: [
      { id: 'indicator', label: 'Indicator', type: 'input', dataType: 'number' }
    ],
    outputs: [
      { id: 'uptrend', label: 'Uptrend', type: 'output', dataType: 'boolean' },
      { id: 'downtrend', label: 'Downtrend', type: 'output', dataType: 'boolean' },
      { id: 'sideways', label: 'Sideways', type: 'output', dataType: 'boolean' }
    ]
  },
  {
    id: 'indicator_rate_of_change',
    type: 'condition',
    category: 'condition',
    label: 'Indicator Rate of Change',
    description: 'Measure how fast indicator is changing',
    icon: 'Lightning',
    defaultParameters: {
      period: 5,
      threshold: 0.1
    },
    inputs: [
      { id: 'indicator', label: 'Indicator', type: 'input', dataType: 'number' }
    ],
    outputs: [
      { id: 'fast_rise', label: 'Fast Rise', type: 'output', dataType: 'boolean' },
      { id: 'fast_fall', label: 'Fast Fall', type: 'output', dataType: 'boolean' },
      { id: 'stable', label: 'Stable', type: 'output', dataType: 'boolean' }
    ]
  }
]
