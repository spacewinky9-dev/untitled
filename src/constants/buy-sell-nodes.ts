import { NodeDefinition } from '../types/nodes'

/**
 * Buy/Sell Action Node Definitions
 * Open market orders and place pending orders
 */
export const BUY_SELL_DEFINITIONS: NodeDefinition[] = [
  {
    id: 'buy_market',
    type: 'action',
    category: 'action',
    label: 'Buy Market',
    description: 'Open buy position at market price',
    icon: 'TrendingUp',
    color: '#00FF00',
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
        id: 'success',
        label: 'Success',
        type: 'trigger',
        position: 'right'
      },
      {
        id: 'error',
        label: 'Error',
        type: 'trigger',
        position: 'right'
      }
    ],
    parameters: {
      lots: { type: 'number', default: 0.1, label: 'Lots' },
      stopLoss: { type: 'number', default: 50, label: 'Stop Loss (pips)' },
      takeProfit: { type: 'number', default: 100, label: 'Take Profit (pips)' },
      magicNumber: { type: 'number', default: 0, label: 'Magic Number' },
      comment: { type: 'string', default: '', label: 'Comment' }
    }
  },
  {
    id: 'sell_market',
    type: 'action',
    category: 'action',
    label: 'Sell Market',
    description: 'Open sell position at market price',
    icon: 'TrendingDown',
    color: '#FF0000',
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
        id: 'success',
        label: 'Success',
        type: 'trigger',
        position: 'right'
      },
      {
        id: 'error',
        label: 'Error',
        type: 'trigger',
        position: 'right'
      }
    ],
    parameters: {
      lots: { type: 'number', default: 0.1, label: 'Lots' },
      stopLoss: { type: 'number', default: 50, label: 'Stop Loss (pips)' },
      takeProfit: { type: 'number', default: 100, label: 'Take Profit (pips)' },
      magicNumber: { type: 'number', default: 0, label: 'Magic Number' },
      comment: { type: 'string', default: '', label: 'Comment' }
    }
  },
  {
    id: 'buy_limit',
    type: 'action',
    category: 'action',
    label: 'Buy Limit',
    description: 'Place buy limit order at specified price',
    icon: 'ArrowUp',
    color: '#00CC00',
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
        id: 'success',
        label: 'Success',
        type: 'trigger',
        position: 'right'
      },
      {
        id: 'error',
        label: 'Error',
        type: 'trigger',
        position: 'right'
      }
    ],
    parameters: {
      price: { type: 'number', default: 0, label: 'Order Price' },
      lots: { type: 'number', default: 0.1, label: 'Lots' },
      stopLoss: { type: 'number', default: 50, label: 'Stop Loss (pips)' },
      takeProfit: { type: 'number', default: 100, label: 'Take Profit (pips)' },
      magicNumber: { type: 'number', default: 0, label: 'Magic Number' },
      comment: { type: 'string', default: '', label: 'Comment' }
    }
  },
  {
    id: 'sell_limit',
    type: 'action',
    category: 'action',
    label: 'Sell Limit',
    description: 'Place sell limit order at specified price',
    icon: 'ArrowDown',
    color: '#CC0000',
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
        id: 'success',
        label: 'Success',
        type: 'trigger',
        position: 'right'
      },
      {
        id: 'error',
        label: 'Error',
        type: 'trigger',
        position: 'right'
      }
    ],
    parameters: {
      price: { type: 'number', default: 0, label: 'Order Price' },
      lots: { type: 'number', default: 0.1, label: 'Lots' },
      stopLoss: { type: 'number', default: 50, label: 'Stop Loss (pips)' },
      takeProfit: { type: 'number', default: 100, label: 'Take Profit (pips)' },
      magicNumber: { type: 'number', default: 0, label: 'Magic Number' },
      comment: { type: 'string', default: '', label: 'Comment' }
    }
  },
  {
    id: 'buy_stop',
    type: 'action',
    category: 'action',
    label: 'Buy Stop',
    description: 'Place buy stop order at specified price',
    icon: 'ArrowUpCircle',
    color: '#00AA00',
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
        id: 'success',
        label: 'Success',
        type: 'trigger',
        position: 'right'
      },
      {
        id: 'error',
        label: 'Error',
        type: 'trigger',
        position: 'right'
      }
    ],
    parameters: {
      price: { type: 'number', default: 0, label: 'Order Price' },
      lots: { type: 'number', default: 0.1, label: 'Lots' },
      stopLoss: { type: 'number', default: 50, label: 'Stop Loss (pips)' },
      takeProfit: { type: 'number', default: 100, label: 'Take Profit (pips)' },
      magicNumber: { type: 'number', default: 0, label: 'Magic Number' },
      comment: { type: 'string', default: '', label: 'Comment' }
    }
  },
  {
    id: 'sell_stop',
    type: 'action',
    category: 'action',
    label: 'Sell Stop',
    description: 'Place sell stop order at specified price',
    icon: 'ArrowDownCircle',
    color: '#AA0000',
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
        id: 'success',
        label: 'Success',
        type: 'trigger',
        position: 'right'
      },
      {
        id: 'error',
        label: 'Error',
        type: 'trigger',
        position: 'right'
      }
    ],
    parameters: {
      price: { type: 'number', default: 0, label: 'Order Price' },
      lots: { type: 'number', default: 0.1, label: 'Lots' },
      stopLoss: { type: 'number', default: 50, label: 'Stop Loss (pips)' },
      takeProfit: { type: 'number', default: 100, label: 'Take Profit (pips)' },
      magicNumber: { type: 'number', default: 0, label: 'Magic Number' },
      comment: { type: 'string', default: '', label: 'Comment' }
    }
  }
]
