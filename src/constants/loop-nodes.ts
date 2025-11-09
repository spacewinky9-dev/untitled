import { NodeDefinition } from '../types/nodes'

/**
 * Loop for Trades & Orders Node Definitions
 * Iterate through trades and orders
 */
export const LOOP_DEFINITIONS: NodeDefinition[] = [
  {
    id: 'loop_all_trades',
    type: 'loop',
    category: 'loop',
    label: 'Loop Through All Trades',
    description: 'Iterate through each open trade',
    icon: 'Repeat',
    color: '#FF00FF',
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
        id: 'each',
        label: 'For Each',
        type: 'trigger',
        position: 'right'
      },
      {
        id: 'complete',
        label: 'Complete',
        type: 'trigger',
        position: 'right'
      },
      {
        id: 'trade',
        label: 'Current Trade',
        type: 'data',
        position: 'right'
      }
    ],
    parameters: {}
  },
  {
    id: 'loop_buy_trades',
    type: 'loop',
    category: 'loop',
    label: 'Loop Through Buy Trades',
    description: 'Iterate through each buy position',
    icon: 'Repeat',
    color: '#FF00FF',
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
        id: 'each',
        label: 'For Each',
        type: 'trigger',
        position: 'right'
      },
      {
        id: 'complete',
        label: 'Complete',
        type: 'trigger',
        position: 'right'
      },
      {
        id: 'trade',
        label: 'Current Trade',
        type: 'data',
        position: 'right'
      }
    ],
    parameters: {}
  },
  {
    id: 'loop_sell_trades',
    type: 'loop',
    category: 'loop',
    label: 'Loop Through Sell Trades',
    description: 'Iterate through each sell position',
    icon: 'Repeat',
    color: '#FF00FF',
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
        id: 'each',
        label: 'For Each',
        type: 'trigger',
        position: 'right'
      },
      {
        id: 'complete',
        label: 'Complete',
        type: 'trigger',
        position: 'right'
      },
      {
        id: 'trade',
        label: 'Current Trade',
        type: 'data',
        position: 'right'
      }
    ],
    parameters: {}
  },
  {
    id: 'loop_all_orders',
    type: 'loop',
    category: 'loop',
    label: 'Loop Through All Orders',
    description: 'Iterate through each pending order',
    icon: 'Repeat',
    color: '#FF00FF',
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
        id: 'each',
        label: 'For Each',
        type: 'trigger',
        position: 'right'
      },
      {
        id: 'complete',
        label: 'Complete',
        type: 'trigger',
        position: 'right'
      },
      {
        id: 'order',
        label: 'Current Order',
        type: 'data',
        position: 'right'
      }
    ],
    parameters: {}
  },
  {
    id: 'loop_buy_orders',
    type: 'loop',
    category: 'loop',
    label: 'Loop Through Buy Orders',
    description: 'Iterate through each buy limit/stop order',
    icon: 'Repeat',
    color: '#FF00FF',
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
        id: 'each',
        label: 'For Each',
        type: 'trigger',
        position: 'right'
      },
      {
        id: 'complete',
        label: 'Complete',
        type: 'trigger',
        position: 'right'
      },
      {
        id: 'order',
        label: 'Current Order',
        type: 'data',
        position: 'right'
      }
    ],
    parameters: {}
  },
  {
    id: 'loop_sell_orders',
    type: 'loop',
    category: 'loop',
    label: 'Loop Through Sell Orders',
    description: 'Iterate through each sell limit/stop order',
    icon: 'Repeat',
    color: '#FF00FF',
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
        id: 'each',
        label: 'For Each',
        type: 'trigger',
        position: 'right'
      },
      {
        id: 'complete',
        label: 'Complete',
        type: 'trigger',
        position: 'right'
      },
      {
        id: 'order',
        label: 'Current Order',
        type: 'data',
        position: 'right'
      }
    ],
    parameters: {}
  }
]
