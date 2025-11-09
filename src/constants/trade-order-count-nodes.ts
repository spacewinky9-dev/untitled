/**
 * Trade and Order Count Node Definitions
 * Nodes for checking trades, orders, and positions
 * Based on FxDreema block system design
 */

import { NodeDefinition } from './node-categories'

/**
 * Trade and order counting/checking nodes
 * Used to validate trading conditions and manage positions
 */
export const TRADE_ORDER_COUNT_DEFINITIONS: NodeDefinition[] = [
  {
    id: 'check_trades_count',
    type: 'condition',
    category: 'condition',
    label: 'Check Trades Count',
    description: 'Check number of open trades',
    icon: 'ListNumbers',
    defaultParameters: {
      operator: 'equal', // equal, greater, less, greater_equal, less_equal
      count: 0
    },
    outputs: [
      { id: 'true', label: 'True', type: 'output', dataType: 'boolean' }
    ]
  },
  {
    id: 'check_pending_orders_count',
    type: 'condition',
    category: 'condition',
    label: 'Check Pending Orders Count',
    description: 'Check number of pending orders',
    icon: 'ClockCountdown',
    defaultParameters: {
      operator: 'equal',
      count: 0
    },
    outputs: [
      { id: 'true', label: 'True', type: 'output', dataType: 'boolean' }
    ]
  },
  {
    id: 'if_trade',
    type: 'condition',
    category: 'condition',
    label: 'If Trade',
    description: 'Check if any trade exists',
    icon: 'Check',
    defaultParameters: {
      direction: 'any' // any, buy, sell
    },
    outputs: [
      { id: 'true', label: 'Exists', type: 'output', dataType: 'boolean' },
      { id: 'false', label: 'Not Exists', type: 'output', dataType: 'boolean' }
    ]
  },
  {
    id: 'if_trade_order',
    type: 'condition',
    category: 'condition',
    label: 'If Trade/Order',
    description: 'Check if trade or order exists',
    icon: 'ListChecks',
    defaultParameters: {
      checkType: 'any' // any, trade, order
    },
    outputs: [
      { id: 'true', label: 'Exists', type: 'output', dataType: 'boolean' },
      { id: 'false', label: 'Not Exists', type: 'output', dataType: 'boolean' }
    ]
  },
  {
    id: 'if_pending_order',
    type: 'condition',
    category: 'condition',
    label: 'If Pending Order',
    description: 'Check if pending order exists',
    icon: 'ClockClockwise',
    defaultParameters: {
      orderType: 'any' // any, buy_limit, sell_limit, buy_stop, sell_stop
    },
    outputs: [
      { id: 'true', label: 'Exists', type: 'output', dataType: 'boolean' },
      { id: 'false', label: 'Not Exists', type: 'output', dataType: 'boolean' }
    ]
  },
  {
    id: 'no_trade',
    type: 'condition',
    category: 'condition',
    label: 'No Trade',
    description: 'Check if no trades exist',
    icon: 'XCircle',
    defaultParameters: {},
    outputs: [
      { id: 'true', label: 'No Trades', type: 'output', dataType: 'boolean' }
    ]
  },
  {
    id: 'no_trade_order',
    type: 'condition',
    category: 'condition',
    label: 'No Trade/Order',
    description: 'Check if no trades or orders exist',
    icon: 'ProhibitInset',
    defaultParameters: {},
    outputs: [
      { id: 'true', label: 'None', type: 'output', dataType: 'boolean' }
    ]
  },
  {
    id: 'no_pending_order',
    type: 'condition',
    category: 'condition',
    label: 'No Pending Order',
    description: 'Check if no pending orders exist',
    icon: 'Prohibit',
    defaultParameters: {},
    outputs: [
      { id: 'true', label: 'No Orders', type: 'output', dataType: 'boolean' }
    ]
  },
  {
    id: 'no_trade_nearby',
    type: 'condition',
    category: 'condition',
    label: 'No Trade Nearby',
    description: 'Check if no trades within distance',
    icon: 'MapPinSlash',
    defaultParameters: {
      distancePips: 50
    },
    outputs: [
      { id: 'true', label: 'No Nearby', type: 'output', dataType: 'boolean' }
    ]
  },
  {
    id: 'no_pending_order_nearby',
    type: 'condition',
    category: 'condition',
    label: 'No Pending Order Nearby',
    description: 'Check if no pending orders within distance',
    icon: 'NavigationArrow',
    defaultParameters: {
      distancePips: 50
    },
    outputs: [
      { id: 'true', label: 'No Nearby', type: 'output', dataType: 'boolean' }
    ]
  }
]
