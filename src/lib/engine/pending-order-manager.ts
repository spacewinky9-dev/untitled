export type PendingOrderType = 'buy_limit' | 'sell_limit' | 'buy_stop' | 'sell_stop'

export interface PendingOrder {
  id: string
  type: PendingOrderType
  symbol: string
  entryPrice: number
  lots: number
  stopLoss?: number
  takeProfit?: number
  expirationTime?: number
  placedTime: number
  groupName?: string
  magicNumber?: number
  comment?: string
}

export interface ModifyPendingOrderParams {
  entryPrice?: number
  stopLoss?: number
  takeProfit?: number
  expirationTime?: number
}

export class PendingOrderManager {
  private pendingOrders: Map<string, PendingOrder> = new Map()
  private filledOrders: Set<string> = new Set()
  
  placePendingOrder(order: PendingOrder): string {
    this.pendingOrders.set(order.id, order)
    return order.id
  }
  
  modifyPendingOrder(orderId: string, params: ModifyPendingOrderParams): boolean {
    const order = this.pendingOrders.get(orderId)
    if (!order) {
      return false
    }
    
    if (params.entryPrice !== undefined) {
      order.entryPrice = params.entryPrice
    }
    if (params.stopLoss !== undefined) {
      order.stopLoss = params.stopLoss
    }
    if (params.takeProfit !== undefined) {
      order.takeProfit = params.takeProfit
    }
    if (params.expirationTime !== undefined) {
      order.expirationTime = params.expirationTime
    }
    
    this.pendingOrders.set(orderId, order)
    return true
  }
  
  deletePendingOrder(orderId: string): boolean {
    return this.pendingOrders.delete(orderId)
  }
  
  deletePendingOrdersByGroup(groupName: string): number {
    let deletedCount = 0
    
    for (const [id, order] of this.pendingOrders.entries()) {
      if (order.groupName === groupName) {
        this.pendingOrders.delete(id)
        deletedCount++
      }
    }
    
    return deletedCount
  }
  
  deletePendingOrdersByType(orderType: PendingOrderType): number {
    let deletedCount = 0
    
    for (const [id, order] of this.pendingOrders.entries()) {
      if (order.type === orderType) {
        this.pendingOrders.delete(id)
        deletedCount++
      }
    }
    
    return deletedCount
  }
  
  deleteAllPendingOrders(): number {
    const count = this.pendingOrders.size
    this.pendingOrders.clear()
    return count
  }
  
  getPendingOrder(orderId: string): PendingOrder | undefined {
    return this.pendingOrders.get(orderId)
  }
  
  getAllPendingOrders(): PendingOrder[] {
    return Array.from(this.pendingOrders.values())
  }
  
  getPendingOrdersBySymbol(symbol: string): PendingOrder[] {
    return Array.from(this.pendingOrders.values()).filter(
      order => order.symbol === symbol
    )
  }
  
  getPendingOrdersByGroup(groupName: string): PendingOrder[] {
    return Array.from(this.pendingOrders.values()).filter(
      order => order.groupName === groupName
    )
  }
  
  getPendingOrdersByType(orderType: PendingOrderType): PendingOrder[] {
    return Array.from(this.pendingOrders.values()).filter(
      order => order.type === orderType
    )
  }
  
  countPendingOrders(): number {
    return this.pendingOrders.size
  }
  
  countPendingOrdersBySymbol(symbol: string): number {
    return this.getPendingOrdersBySymbol(symbol).length
  }
  
  countPendingOrdersByGroup(groupName: string): number {
    return this.getPendingOrdersByGroup(groupName).length
  }
  
  hasPendingOrder(orderId: string): boolean {
    return this.pendingOrders.has(orderId)
  }
  
  checkTriggeredOrders(currentPrice: number, currentTime: number): PendingOrder[] {
    const triggeredOrders: PendingOrder[] = []
    const toDelete: string[] = []
    
    for (const [id, order] of this.pendingOrders.entries()) {
      if (order.expirationTime && currentTime > order.expirationTime) {
        toDelete.push(id)
        continue
      }
      
      let triggered = false
      
      switch (order.type) {
        case 'buy_limit':
          triggered = currentPrice <= order.entryPrice
          break
        case 'sell_limit':
          triggered = currentPrice >= order.entryPrice
          break
        case 'buy_stop':
          triggered = currentPrice >= order.entryPrice
          break
        case 'sell_stop':
          triggered = currentPrice <= order.entryPrice
          break
      }
      
      if (triggered) {
        triggeredOrders.push(order)
        this.filledOrders.add(id)
        toDelete.push(id)
      }
    }
    
    toDelete.forEach(id => this.pendingOrders.delete(id))
    
    return triggeredOrders
  }
  
  getFilledOrderIds(): string[] {
    return Array.from(this.filledOrders)
  }
  
  wasOrderFilled(orderId: string): boolean {
    return this.filledOrders.has(orderId)
  }
  
  clearHistory(): void {
    this.filledOrders.clear()
  }
  
  reset(): void {
    this.pendingOrders.clear()
    this.filledOrders.clear()
  }
  
  export(): {
    pendingOrders: PendingOrder[]
    filledOrderIds: string[]
  } {
    return {
      pendingOrders: this.getAllPendingOrders(),
      filledOrderIds: this.getFilledOrderIds()
    }
  }
  
  import(data: {
    pendingOrders: PendingOrder[]
    filledOrderIds: string[]
  }): void {
    this.reset()
    
    data.pendingOrders.forEach(order => {
      this.pendingOrders.set(order.id, order)
    })
    
    data.filledOrderIds.forEach(id => {
      this.filledOrders.add(id)
    })
  }
}

export const pendingOrderManager = new PendingOrderManager()
