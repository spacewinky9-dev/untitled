import { NodeDefinition } from '../types/nodes'

/**
 * Trading Conditions Node Definitions
 * Check account balance, equity, margin, and profit conditions
 */
export const TRADING_CONDITION_DEFINITIONS: NodeDefinition[] = [
  {
    id: 'balance_greater_than',
    type: 'condition',
    category: 'condition',
    label: 'Balance Greater Than',
    description: 'Check if account balance is greater than threshold',
    icon: 'TrendingUp',
    color: '#B3D9FF',
    inputs: [
      {
        id: 'trigger',
        label: 'Trigger',
        type: 'trigger',
        position: 'left'
      }
    ],
    outputs: [
      {
        id: 'true',
        label: 'True',
        type: 'trigger',
        position: 'right'
      },
      {
        id: 'false',
        label: 'False',
        type: 'trigger',
        position: 'right'
      }
    ],
    parameters: {
      threshold: { type: 'number', default: 10000, label: 'Threshold Amount' }
    }
  },
  {
    id: 'balance_less_than',
    type: 'condition',
    category: 'condition',
    label: 'Balance Less Than',
    description: 'Check if account balance is less than threshold',
    icon: 'TrendingDown',
    color: '#B3D9FF',
    inputs: [
      {
        id: 'trigger',
        label: 'Trigger',
        type: 'trigger',
        position: 'left'
      }
    ],
    outputs: [
      {
        id: 'true',
        label: 'True',
        type: 'trigger',
        position: 'right'
      },
      {
        id: 'false',
        label: 'False',
        type: 'trigger',
        position: 'right'
      }
    ],
    parameters: {
      threshold: { type: 'number', default: 1000, label: 'Threshold Amount' }
    }
  },
  {
    id: 'equity_greater_than',
    type: 'condition',
    category: 'condition',
    label: 'Equity Greater Than',
    description: 'Check if account equity is greater than threshold',
    icon: 'TrendingUp',
    color: '#B3D9FF',
    inputs: [
      {
        id: 'trigger',
        label: 'Trigger',
        type: 'trigger',
        position: 'left'
      }
    ],
    outputs: [
      {
        id: 'true',
        label: 'True',
        type: 'trigger',
        position: 'right'
      },
      {
        id: 'false',
        label: 'False',
        type: 'trigger',
        position: 'right'
      }
    ],
    parameters: {
      threshold: { type: 'number', default: 10000, label: 'Threshold Amount' }
    }
  },
  {
    id: 'equity_less_than',
    type: 'condition',
    category: 'condition',
    label: 'Equity Less Than',
    description: 'Check if account equity is less than threshold',
    icon: 'TrendingDown',
    color: '#B3D9FF',
    inputs: [
      {
        id: 'trigger',
        label: 'Trigger',
        type: 'trigger',
        position: 'left'
      }
    ],
    outputs: [
      {
        id: 'true',
        label: 'True',
        type: 'trigger',
        position: 'right'
      },
      {
        id: 'false',
        label: 'False',
        type: 'trigger',
        position: 'right'
      }
    ],
    parameters: {
      threshold: { type: 'number', default: 1000, label: 'Threshold Amount' }
    }
  },
  {
    id: 'margin_level_greater_than',
    type: 'condition',
    category: 'condition',
    label: 'Margin Level Greater Than',
    description: 'Check if margin level is greater than percentage',
    icon: 'Percent',
    color: '#B3D9FF',
    inputs: [
      {
        id: 'trigger',
        label: 'Trigger',
        type: 'trigger',
        position: 'left'
      }
    ],
    outputs: [
      {
        id: 'true',
        label: 'True',
        type: 'trigger',
        position: 'right'
      },
      {
        id: 'false',
        label: 'False',
        type: 'trigger',
        position: 'right'
      }
    ],
    parameters: {
      threshold: { type: 'number', default: 200, label: 'Threshold Percentage' }
    }
  },
  {
    id: 'margin_level_less_than',
    type: 'condition',
    category: 'condition',
    label: 'Margin Level Less Than',
    description: 'Check if margin level is less than percentage',
    icon: 'Percent',
    color: '#B3D9FF',
    inputs: [
      {
        id: 'trigger',
        label: 'Trigger',
        type: 'trigger',
        position: 'left'
      }
    ],
    outputs: [
      {
        id: 'true',
        label: 'True',
        type: 'trigger',
        position: 'right'
      },
      {
        id: 'false',
        label: 'False',
        type: 'trigger',
        position: 'right'
      }
    ],
    parameters: {
      threshold: { type: 'number', default: 100, label: 'Threshold Percentage' }
    }
  },
  {
    id: 'free_margin_greater_than',
    type: 'condition',
    category: 'condition',
    label: 'Free Margin Greater Than',
    description: 'Check if free margin is greater than threshold',
    icon: 'CircleDollarSign',
    color: '#B3D9FF',
    inputs: [
      {
        id: 'trigger',
        label: 'Trigger',
        type: 'trigger',
        position: 'left'
      }
    ],
    outputs: [
      {
        id: 'true',
        label: 'True',
        type: 'trigger',
        position: 'right'
      },
      {
        id: 'false',
        label: 'False',
        type: 'trigger',
        position: 'right'
      }
    ],
    parameters: {
      threshold: { type: 'number', default: 5000, label: 'Threshold Amount' }
    }
  },
  {
    id: 'free_margin_less_than',
    type: 'condition',
    category: 'condition',
    label: 'Free Margin Less Than',
    description: 'Check if free margin is less than threshold',
    icon: 'CircleDollarSign',
    color: '#B3D9FF',
    inputs: [
      {
        id: 'trigger',
        label: 'Trigger',
        type: 'trigger',
        position: 'left'
      }
    ],
    outputs: [
      {
        id: 'true',
        label: 'True',
        type: 'trigger',
        position: 'right'
      },
      {
        id: 'false',
        label: 'False',
        type: 'trigger',
        position: 'right'
      }
    ],
    parameters: {
      threshold: { type: 'number', default: 1000, label: 'Threshold Amount' }
    }
  },
  {
    id: 'profit_greater_than',
    type: 'condition',
    category: 'condition',
    label: 'Profit Greater Than',
    description: 'Check if total profit is greater than threshold',
    icon: 'TrendingUp',
    color: '#B3D9FF',
    inputs: [
      {
        id: 'trigger',
        label: 'Trigger',
        type: 'trigger',
        position: 'left'
      }
    ],
    outputs: [
      {
        id: 'true',
        label: 'True',
        type: 'trigger',
        position: 'right'
      },
      {
        id: 'false',
        label: 'False',
        type: 'trigger',
        position: 'right'
      }
    ],
    parameters: {
      threshold: { type: 'number', default: 100, label: 'Threshold Amount' }
    }
  },
  {
    id: 'profit_less_than',
    type: 'condition',
    category: 'condition',
    label: 'Profit Less Than',
    description: 'Check if total profit is less than threshold',
    icon: 'TrendingDown',
    color: '#B3D9FF',
    inputs: [
      {
        id: 'trigger',
        label: 'Trigger',
        type: 'trigger',
        position: 'left'
      }
    ],
    outputs: [
      {
        id: 'true',
        label: 'True',
        type: 'trigger',
        position: 'right'
      },
      {
        id: 'false',
        label: 'False',
        type: 'trigger',
        position: 'right'
      }
    ],
    parameters: {
      threshold: { type: 'number', default: -50, label: 'Threshold Amount' }
    }
  },
  {
    id: 'floating_profit_greater_than',
    type: 'condition',
    category: 'condition',
    label: 'Floating Profit Greater Than',
    description: 'Check if floating P/L is greater than threshold',
    icon: 'Activity',
    color: '#B3D9FF',
    inputs: [
      {
        id: 'trigger',
        label: 'Trigger',
        type: 'trigger',
        position: 'left'
      }
    ],
    outputs: [
      {
        id: 'true',
        label: 'True',
        type: 'trigger',
        position: 'right'
      },
      {
        id: 'false',
        label: 'False',
        type: 'trigger',
        position: 'right'
      }
    ],
    parameters: {
      threshold: { type: 'number', default: 50, label: 'Threshold Amount' }
    }
  },
  {
    id: 'floating_profit_less_than',
    type: 'condition',
    category: 'condition',
    label: 'Floating Profit Less Than',
    description: 'Check if floating P/L is less than threshold',
    icon: 'Activity',
    color: '#B3D9FF',
    inputs: [
      {
        id: 'trigger',
        label: 'Trigger',
        type: 'trigger',
        position: 'left'
      }
    ],
    outputs: [
      {
        id: 'true',
        label: 'True',
        type: 'trigger',
        position: 'right'
      },
      {
        id: 'false',
        label: 'False',
        type: 'trigger',
        position: 'right'
      }
    ],
    parameters: {
      threshold: { type: 'number', default: -30, label: 'Threshold Amount' }
    }
  }
]
