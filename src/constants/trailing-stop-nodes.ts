import { NodeDefinition } from '../types/nodes'

/**
 * Trailing Stop / Break Even Nodes
 * FxDreema-style trailing stop and break-even management nodes
 */

export const TRAILING_STOP_DEFINITIONS: NodeDefinition[] = [
  {
    id: 'break_even_point',
    type: 'action',
    category: 'action',
    label: 'Break Even Point (each trade)',
    description: 'Move stop loss to entry price when profit threshold is reached',
    icon: 'TrendUp',
    color: '#7BA5C8',
    inputs: [
      { id: 'trigger', label: 'Trigger', type: 'execution' },
      { id: 'trade', label: 'Trade', type: 'trade' },
    ],
    outputs: [
      { id: 'success', label: 'Success', type: 'execution' },
      { id: 'failed', label: 'Failed', type: 'execution' },
    ],
    parameters: [
      {
        name: 'profitThreshold',
        label: 'Profit Threshold (pips)',
        type: 'number',
        defaultValue: 10,
        description: 'Minimum profit in pips before moving to break-even',
      },
      {
        name: 'additionalPips',
        label: 'Additional Pips',
        type: 'number',
        defaultValue: 0,
        description: 'Additional pips beyond entry to place SL (0 = exact entry)',
      },
    ],
  },
  {
    id: 'trailing_stop_each',
    type: 'action',
    category: 'action',
    label: 'Trailing Stop (each trade)',
    description: 'Apply trailing stop to individual trade',
    icon: 'TrendUp',
    color: '#7BA5C8',
    inputs: [
      { id: 'trigger', label: 'Trigger', type: 'execution' },
      { id: 'trade', label: 'Trade', type: 'trade' },
    ],
    outputs: [
      { id: 'success', label: 'Success', type: 'execution' },
      { id: 'failed', label: 'Failed', type: 'execution' },
    ],
    parameters: [
      {
        name: 'trailingDistance',
        label: 'Trailing Distance (pips)',
        type: 'number',
        defaultValue: 20,
        description: 'Distance in pips to trail behind current price',
      },
      {
        name: 'minProfit',
        label: 'Minimum Profit (pips)',
        type: 'number',
        defaultValue: 0,
        description: 'Minimum profit before trailing starts (0 = immediate)',
      },
    ],
  },
  {
    id: 'trailing_stop_group',
    type: 'action',
    category: 'action',
    label: 'Trailing Stop (group of trades)',
    description: 'Apply trailing stop to multiple trades',
    icon: 'TrendUp',
    color: '#7BA5C8',
    inputs: [
      { id: 'trigger', label: 'Trigger', type: 'execution' },
      { id: 'trades', label: 'Trades', type: 'trade_array' },
    ],
    outputs: [
      { id: 'success', label: 'Success', type: 'execution' },
      { id: 'count', label: 'Count Modified', type: 'number' },
    ],
    parameters: [
      {
        name: 'trailingDistance',
        label: 'Trailing Distance (pips)',
        type: 'number',
        defaultValue: 20,
        description: 'Distance in pips to trail behind current price',
      },
      {
        name: 'minProfit',
        label: 'Minimum Profit (pips)',
        type: 'number',
        defaultValue: 0,
        description: 'Minimum profit before trailing starts',
      },
    ],
  },
  {
    id: 'trailing_money_loss',
    type: 'action',
    category: 'action',
    label: 'Trailing Money Loss (group of trades)',
    description: 'Protect profits by trailing stop based on equity peak',
    icon: 'Shield',
    color: '#7BA5C8',
    inputs: [
      { id: 'trigger', label: 'Trigger', type: 'execution' },
      { id: 'trades', label: 'Trades', type: 'trade_array' },
    ],
    outputs: [
      { id: 'success', label: 'Success', type: 'execution' },
      { id: 'threshold_reached', label: 'Threshold Reached', type: 'execution' },
    ],
    parameters: [
      {
        name: 'maxLossAmount',
        label: 'Maximum Loss Amount ($)',
        type: 'number',
        defaultValue: 100,
        description: 'Maximum allowed loss from equity peak',
      },
      {
        name: 'closeOnThreshold',
        label: 'Close on Threshold',
        type: 'boolean',
        defaultValue: true,
        description: 'Automatically close trades when threshold reached',
      },
    ],
  },
  {
    id: 'trailing_pending_orders',
    type: 'action',
    category: 'action',
    label: 'Trailing Pending Orders',
    description: 'Trail pending order prices with market movement',
    icon: 'Clock',
    color: '#7BA5C8',
    inputs: [
      { id: 'trigger', label: 'Trigger', type: 'execution' },
      { id: 'orders', label: 'Orders', type: 'order_array' },
    ],
    outputs: [
      { id: 'success', label: 'Success', type: 'execution' },
      { id: 'count', label: 'Count Modified', type: 'number' },
    ],
    parameters: [
      {
        name: 'trailingDistance',
        label: 'Trailing Distance (pips)',
        type: 'number',
        defaultValue: 20,
        description: 'Distance to maintain from current price',
      },
      {
        name: 'direction',
        label: 'Direction',
        type: 'select',
        options: ['favorable', 'unfavorable', 'both'],
        defaultValue: 'favorable',
        description: 'Which direction to trail (favorable = follow profit)',
      },
    ],
  },
]
