import { NodeDefinition } from '../types/nodes'

/**
 * Trading Actions Nodes
 * FxDreema-style trade management action nodes
 */

export const TRADING_ACTIONS_DEFINITIONS: NodeDefinition[] = [
  {
    id: 'modify_stops',
    type: 'action',
    category: 'action',
    label: 'Modify Stops of Trades',
    description: 'Update stop loss and take profit of trades',
    icon: 'Edit',
    color: '#5A8FB0',
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
        name: 'modifyStopLoss',
        label: 'Modify Stop Loss',
        type: 'boolean',
        defaultValue: true,
      },
      {
        name: 'stopLoss',
        label: 'New Stop Loss (pips)',
        type: 'number',
        defaultValue: 50,
        description: 'New SL distance in pips from entry',
      },
      {
        name: 'modifyTakeProfit',
        label: 'Modify Take Profit',
        type: 'boolean',
        defaultValue: false,
      },
      {
        name: 'takeProfit',
        label: 'New Take Profit (pips)',
        type: 'number',
        defaultValue: 100,
        description: 'New TP distance in pips from entry',
      },
    ],
  },
  {
    id: 'close_trades',
    type: 'action',
    category: 'action',
    label: 'Close Trades',
    description: 'Close all or filtered trades',
    icon: 'X',
    color: '#5A8FB0',
    inputs: [
      { id: 'trigger', label: 'Trigger', type: 'execution' },
      { id: 'trades', label: 'Trades', type: 'trade_array' },
    ],
    outputs: [
      { id: 'success', label: 'Success', type: 'execution' },
      { id: 'count', label: 'Count Closed', type: 'number' },
      { id: 'total_profit', label: 'Total Profit', type: 'number' },
    ],
    parameters: [
      {
        name: 'filterType',
        label: 'Filter Type',
        type: 'select',
        options: ['all', 'buy', 'sell'],
        defaultValue: 'all',
        description: 'Which trades to close',
      },
    ],
  },
  {
    id: 'close_losable_trades',
    type: 'action',
    category: 'action',
    label: 'Close Losable Trades',
    description: 'Close trades with loss exceeding threshold',
    icon: 'X',
    color: '#5A8FB0',
    inputs: [
      { id: 'trigger', label: 'Trigger', type: 'execution' },
      { id: 'trades', label: 'Trades', type: 'trade_array' },
    ],
    outputs: [
      { id: 'success', label: 'Success', type: 'execution' },
      { id: 'count', label: 'Count Closed', type: 'number' },
    ],
    parameters: [
      {
        name: 'lossThreshold',
        label: 'Loss Threshold ($)',
        type: 'number',
        defaultValue: -50,
        description: 'Close trades with loss greater than this (negative value)',
      },
    ],
  },
  {
    id: 'close_profitable_trades',
    type: 'action',
    category: 'action',
    label: 'Close Profitable Trades',
    description: 'Close trades with profit exceeding threshold',
    icon: 'CheckCircle',
    color: '#5A8FB0',
    inputs: [
      { id: 'trigger', label: 'Trigger', type: 'execution' },
      { id: 'trades', label: 'Trades', type: 'trade_array' },
    ],
    outputs: [
      { id: 'success', label: 'Success', type: 'execution' },
      { id: 'count', label: 'Count Closed', type: 'number' },
    ],
    parameters: [
      {
        name: 'profitThreshold',
        label: 'Profit Threshold ($)',
        type: 'number',
        defaultValue: 100,
        description: 'Close trades with profit greater than this',
      },
    ],
  },
  {
    id: 'close_least_profitable',
    type: 'action',
    category: 'action',
    label: 'Close Least Profitable Trade',
    description: 'Close the trade with lowest profit (or highest loss)',
    icon: 'ArrowDown',
    color: '#5A8FB0',
    inputs: [
      { id: 'trigger', label: 'Trigger', type: 'execution' },
      { id: 'trades', label: 'Trades', type: 'trade_array' },
    ],
    outputs: [
      { id: 'success', label: 'Success', type: 'execution' },
      { id: 'trade', label: 'Closed Trade', type: 'trade' },
    ],
    parameters: [],
  },
  {
    id: 'close_most_profitable',
    type: 'action',
    category: 'action',
    label: 'Close Most Profitable Trade',
    description: 'Close the trade with highest profit',
    icon: 'ArrowUp',
    color: '#5A8FB0',
    inputs: [
      { id: 'trigger', label: 'Trigger', type: 'execution' },
      { id: 'trades', label: 'Trades', type: 'trade_array' },
    ],
    outputs: [
      { id: 'success', label: 'Success', type: 'execution' },
      { id: 'trade', label: 'Closed Trade', type: 'trade' },
    ],
    parameters: [],
  },
  {
    id: 'delete_pending_orders',
    type: 'action',
    category: 'action',
    label: 'Delete Pending Orders',
    description: 'Remove pending orders',
    icon: 'Trash',
    color: '#5A8FB0',
    inputs: [
      { id: 'trigger', label: 'Trigger', type: 'execution' },
      { id: 'orders', label: 'Orders', type: 'order_array' },
    ],
    outputs: [
      { id: 'success', label: 'Success', type: 'execution' },
      { id: 'count', label: 'Count Deleted', type: 'number' },
    ],
    parameters: [
      {
        name: 'filterType',
        label: 'Filter Type',
        type: 'select',
        options: ['all', 'buy_limit', 'sell_limit', 'buy_stop', 'sell_stop'],
        defaultValue: 'all',
        description: 'Which order types to delete',
      },
    ],
  },
]
