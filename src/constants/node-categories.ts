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

export const NODE_DEFINITIONS: NodeDefinition[] = [
  {
    id: 'sma',
    type: 'indicator',
    category: 'indicator',
    label: 'SMA',
    description: 'Simple Moving Average',
    icon: 'ChartLine',
    defaultParameters: {
      period: 20,
      source: 'close'
    }
  },
  {
    id: 'ema',
    type: 'indicator',
    category: 'indicator',
    label: 'EMA',
    description: 'Exponential Moving Average',
    icon: 'ChartLine',
    defaultParameters: {
      period: 20,
      source: 'close'
    }
  },
  {
    id: 'rsi',
    type: 'indicator',
    category: 'indicator',
    label: 'RSI',
    description: 'Relative Strength Index',
    icon: 'Waveform',
    defaultParameters: {
      period: 14,
      source: 'close'
    }
  },
  {
    id: 'macd',
    type: 'indicator',
    category: 'indicator',
    label: 'MACD',
    description: 'Moving Average Convergence Divergence',
    icon: 'ChartLineUp',
    defaultParameters: {
      fastPeriod: 12,
      slowPeriod: 26,
      signalPeriod: 9
    }
  },
  {
    id: 'bb',
    type: 'indicator',
    category: 'indicator',
    label: 'Bollinger Bands',
    description: 'Bollinger Bands volatility indicator',
    icon: 'Activity',
    defaultParameters: {
      period: 20,
      stdDev: 2,
      source: 'close'
    }
  },
  {
    id: 'atr',
    type: 'indicator',
    category: 'indicator',
    label: 'ATR',
    description: 'Average True Range',
    icon: 'Activity',
    defaultParameters: {
      period: 14
    }
  },
  {
    id: 'stochastic',
    type: 'indicator',
    category: 'indicator',
    label: 'Stochastic',
    description: 'Stochastic Oscillator',
    icon: 'Waveform',
    defaultParameters: {
      kPeriod: 14,
      dPeriod: 3
    }
  },
  {
    id: 'comparison',
    type: 'condition',
    category: 'condition',
    label: 'Compare',
    description: 'Compare two values',
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
    description: 'Detect crossover/crossunder',
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
    description: 'Check if value crosses threshold',
    icon: 'LineSegment',
    defaultParameters: {
      threshold: 50,
      operator: 'above'
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
