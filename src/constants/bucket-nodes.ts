import { NodeDefinition } from '../types/nodes'

/**
 * Bucket of Trades & Orders Node Definitions
 * Select and filter trades and orders
 */
export const BUCKET_DEFINITIONS: NodeDefinition[] = [
  {
    id: 'all_trades',
    type: 'selector',
    category: 'selector',
    label: 'All Trades',
    description: 'Select all open trades',
    icon: 'List',
    color: '#6B8EFF',
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
        id: 'trades',
        label: 'Trades',
        type: 'data',
        position: 'right'
      }
    ],
    parameters: {}
  },
  {
    id: 'all_buy_trades',
    type: 'selector',
    category: 'selector',
    label: 'All Buy Trades',
    description: 'Select all buy positions',
    icon: 'TrendingUp',
    color: '#6B8EFF',
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
        id: 'trades',
        label: 'Buy Trades',
        type: 'data',
        position: 'right'
      }
    ],
    parameters: {}
  },
  {
    id: 'all_sell_trades',
    type: 'selector',
    category: 'selector',
    label: 'All Sell Trades',
    description: 'Select all sell positions',
    icon: 'TrendingDown',
    color: '#6B8EFF',
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
        id: 'trades',
        label: 'Sell Trades',
        type: 'data',
        position: 'right'
      }
    ],
    parameters: {}
  },
  {
    id: 'oldest_trade',
    type: 'selector',
    category: 'selector',
    label: 'Oldest Trade',
    description: 'Select oldest open trade',
    icon: 'Clock',
    color: '#6B8EFF',
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
        id: 'trade',
        label: 'Trade',
        type: 'data',
        position: 'right'
      }
    ],
    parameters: {}
  },
  {
    id: 'newest_trade',
    type: 'selector',
    category: 'selector',
    label: 'Newest Trade',
    description: 'Select newest open trade',
    icon: 'Clock',
    color: '#6B8EFF',
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
        id: 'trade',
        label: 'Trade',
        type: 'data',
        position: 'right'
      }
    ],
    parameters: {}
  },
  {
    id: 'most_profitable_trade',
    type: 'selector',
    category: 'selector',
    label: 'Most Profitable Trade',
    description: 'Select trade with highest profit',
    icon: 'TrendingUp',
    color: '#6B8EFF',
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
        id: 'trade',
        label: 'Trade',
        type: 'data',
        position: 'right'
      }
    ],
    parameters: {}
  },
  {
    id: 'least_profitable_trade',
    type: 'selector',
    category: 'selector',
    label: 'Least Profitable Trade',
    description: 'Select trade with lowest profit (most loss)',
    icon: 'TrendingDown',
    color: '#6B8EFF',
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
        id: 'trade',
        label: 'Trade',
        type: 'data',
        position: 'right'
      }
    ],
    parameters: {}
  },
  {
    id: 'all_pending_orders',
    type: 'selector',
    category: 'selector',
    label: 'All Pending Orders',
    description: 'Select all pending orders',
    icon: 'ListOrdered',
    color: '#6B8EFF',
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
        id: 'orders',
        label: 'Orders',
        type: 'data',
        position: 'right'
      }
    ],
    parameters: {}
  },
  {
    id: 'all_buy_orders',
    type: 'selector',
    category: 'selector',
    label: 'All Buy Orders',
    description: 'Select all buy limit/stop orders',
    icon: 'ArrowUp',
    color: '#6B8EFF',
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
        id: 'orders',
        label: 'Buy Orders',
        type: 'data',
        position: 'right'
      }
    ],
    parameters: {}
  },
  {
    id: 'all_sell_orders',
    type: 'selector',
    category: 'selector',
    label: 'All Sell Orders',
    description: 'Select all sell limit/stop orders',
    icon: 'ArrowDown',
    color: '#6B8EFF',
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
        id: 'orders',
        label: 'Sell Orders',
        type: 'data',
        position: 'right'
      }
    ],
    parameters: {}
  },
  {
    id: 'oldest_pending_order',
    type: 'selector',
    category: 'selector',
    label: 'Oldest Pending Order',
    description: 'Select oldest pending order',
    icon: 'Clock',
    color: '#6B8EFF',
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
        id: 'order',
        label: 'Order',
        type: 'data',
        position: 'right'
      }
    ],
    parameters: {}
  },
  {
    id: 'newest_pending_order',
    type: 'selector',
    category: 'selector',
    label: 'Newest Pending Order',
    description: 'Select newest pending order',
    icon: 'Clock',
    color: '#6B8EFF',
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
        id: 'order',
        label: 'Order',
        type: 'data',
        position: 'right'
      }
    ],
    parameters: {}
  },
  {
    id: 'all_trades_and_orders',
    type: 'selector',
    category: 'selector',
    label: 'All Trades & Orders',
    description: 'Select all trades and orders',
    icon: 'Database',
    color: '#6B8EFF',
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
        id: 'combined',
        label: 'Trades & Orders',
        type: 'data',
        position: 'right'
      }
    ],
    parameters: {}
  },
  {
    id: 'trades_by_magic_number',
    type: 'selector',
    category: 'selector',
    label: 'Trades By Magic Number',
    description: 'Filter trades by magic number',
    icon: 'Hash',
    color: '#6B8EFF',
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
        id: 'trades',
        label: 'Filtered Trades',
        type: 'data',
        position: 'right'
      }
    ],
    parameters: {
      magicNumber: { type: 'number', default: 0, label: 'Magic Number' }
    }
  }
]
