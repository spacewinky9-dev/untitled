/**
 * Trade and Order Count Execution Logic
 * Handles checking of trades, orders, and positions
 */

export interface TradeInfo {
  id: string
  type: 'buy' | 'sell'
  openPrice: number
  currentPrice: number
  lots: number
  profit: number
}

export interface OrderInfo {
  id: string
  type: 'buy_limit' | 'sell_limit' | 'buy_stop' | 'sell_stop'
  price: number
  lots: number
}

/**
 * Check trades count with operator
 */
export function executeCheckTradesCount(
  trades: TradeInfo[],
  operator: string,
  targetCount: number
): boolean {
  const actualCount = trades.length

  switch (operator) {
    case 'equal':
      return actualCount === targetCount
    case 'greater':
      return actualCount > targetCount
    case 'less':
      return actualCount < targetCount
    case 'greater_equal':
      return actualCount >= targetCount
    case 'less_equal':
      return actualCount <= targetCount
    default:
      return actualCount === targetCount
  }
}

/**
 * Check pending orders count with operator
 */
export function executeCheckPendingOrdersCount(
  orders: OrderInfo[],
  operator: string,
  targetCount: number
): boolean {
  const actualCount = orders.length

  switch (operator) {
    case 'equal':
      return actualCount === targetCount
    case 'greater':
      return actualCount > targetCount
    case 'less':
      return actualCount < targetCount
    case 'greater_equal':
      return actualCount >= targetCount
    case 'less_equal':
      return actualCount <= targetCount
    default:
      return actualCount === targetCount
  }
}

/**
 * Check if trade exists
 */
export function executeIfTrade(
  trades: TradeInfo[],
  direction: 'any' | 'buy' | 'sell'
): boolean {
  if (direction === 'any') {
    return trades.length > 0
  }

  return trades.some(trade => trade.type === direction)
}

/**
 * Check if trade or order exists
 */
export function executeIfTradeOrder(
  trades: TradeInfo[],
  orders: OrderInfo[],
  checkType: 'any' | 'trade' | 'order'
): boolean {
  if (checkType === 'any') {
    return trades.length > 0 || orders.length > 0
  }

  if (checkType === 'trade') {
    return trades.length > 0
  }

  if (checkType === 'order') {
    return orders.length > 0
  }

  return false
}

/**
 * Check if pending order exists
 */
export function executeIfPendingOrder(
  orders: OrderInfo[],
  orderType: 'any' | 'buy_limit' | 'sell_limit' | 'buy_stop' | 'sell_stop'
): boolean {
  if (orderType === 'any') {
    return orders.length > 0
  }

  return orders.some(order => order.type === orderType)
}

/**
 * Check if no trades exist
 */
export function executeNoTrade(trades: TradeInfo[]): boolean {
  return trades.length === 0
}

/**
 * Check if no trades or orders exist
 */
export function executeNoTradeOrder(trades: TradeInfo[], orders: OrderInfo[]): boolean {
  return trades.length === 0 && orders.length === 0
}

/**
 * Check if no pending orders exist
 */
export function executeNoPendingOrder(orders: OrderInfo[]): boolean {
  return orders.length === 0
}

/**
 * Check if no trade nearby
 */
export function executeNoTradeNearby(
  trades: TradeInfo[],
  currentPrice: number,
  distancePips: number,
  pipValue: number = 0.0001
): boolean {
  const distancePrice = distancePips * pipValue

  for (const trade of trades) {
    const distance = Math.abs(trade.openPrice - currentPrice)
    if (distance <= distancePrice) {
      return false // Found trade nearby
    }
  }

  return true // No trades nearby
}

/**
 * Check if no pending order nearby
 */
export function executeNoPendingOrderNearby(
  orders: OrderInfo[],
  currentPrice: number,
  distancePips: number,
  pipValue: number = 0.0001
): boolean {
  const distancePrice = distancePips * pipValue

  for (const order of orders) {
    const distance = Math.abs(order.price - currentPrice)
    if (distance <= distancePrice) {
      return false // Found order nearby
    }
  }

  return true // No orders nearby
}

/**
 * Main handler for trade/order count nodes
 */
export function executeTradeOrderCountNode(
  nodeId: string,
  nodeData: any,
  context: {
    trades?: TradeInfo[]
    orders?: OrderInfo[]
    currentPrice?: number
  }
): boolean {
  const params = nodeData.parameters || {}
  const trades = context.trades || []
  const orders = context.orders || []

  if (nodeId.includes('check_trades_count')) {
    return executeCheckTradesCount(
      trades,
      params.operator || 'equal',
      params.count || 0
    )
  }

  if (nodeId.includes('check_pending_orders_count')) {
    return executeCheckPendingOrdersCount(
      orders,
      params.operator || 'equal',
      params.count || 0
    )
  }

  if (nodeId.includes('if_trade') && !nodeId.includes('order')) {
    return executeIfTrade(
      trades,
      params.direction || 'any'
    )
  }

  if (nodeId.includes('if_trade_order')) {
    return executeIfTradeOrder(
      trades,
      orders,
      params.checkType || 'any'
    )
  }

  if (nodeId.includes('if_pending_order')) {
    return executeIfPendingOrder(
      orders,
      params.orderType || 'any'
    )
  }

  if (nodeId.includes('no_trade') && !nodeId.includes('order') && !nodeId.includes('nearby')) {
    return executeNoTrade(trades)
  }

  if (nodeId.includes('no_trade_order')) {
    return executeNoTradeOrder(trades, orders)
  }

  if (nodeId.includes('no_pending_order') && !nodeId.includes('nearby')) {
    return executeNoPendingOrder(orders)
  }

  if (nodeId.includes('no_trade_nearby')) {
    return executeNoTradeNearby(
      trades,
      context.currentPrice || 0,
      params.distancePips || 50
    )
  }

  if (nodeId.includes('no_pending_order_nearby')) {
    return executeNoPendingOrderNearby(
      orders,
      context.currentPrice || 0,
      params.distancePips || 50
    )
  }

  return false
}
