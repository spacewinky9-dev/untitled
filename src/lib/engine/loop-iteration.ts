import { TradePosition } from './advanced-trade-manager'
import { PendingOrder } from './pending-order-manager'

export type LoopType = 
  | 'for_each_trade'
  | 'for_each_pending'
  | 'for_each_symbol'
  | 'repeat_n_times'
  | 'while_condition'

export interface LoopContext {
  currentIndex: number
  totalIterations: number
  currentItem: any
  breakRequested: boolean
  continueRequested: boolean
}

export interface LoopResult {
  completed: boolean
  iterations: number
  results: any[]
  error?: string
}

export type LoopCallback = (context: LoopContext) => boolean | void

export class LoopIterationEngine {
  
  forEachTrade(
    trades: TradePosition[],
    callback: (trade: TradePosition, context: LoopContext) => boolean | void
  ): LoopResult {
    const results: any[] = []
    let completed = true
    
    for (let i = 0; i < trades.length; i++) {
      const context: LoopContext = {
        currentIndex: i,
        totalIterations: trades.length,
        currentItem: trades[i],
        breakRequested: false,
        continueRequested: false
      }
      
      try {
        const result = callback(trades[i], context)
        results.push(result)
        
        if (context.breakRequested || result === false) {
          completed = false
          break
        }
        
        if (context.continueRequested) {
          continue
        }
      } catch (error) {
        return {
          completed: false,
          iterations: i,
          results,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }
    }
    
    return {
      completed,
      iterations: trades.length,
      results
    }
  }
  
  forEachTradeInGroup(
    trades: TradePosition[],
    groupName: string,
    callback: (trade: TradePosition, context: LoopContext) => boolean | void
  ): LoopResult {
    const filteredTrades = trades.filter(t => t.groupName === groupName)
    return this.forEachTrade(filteredTrades, callback)
  }
  
  forEachTradeOfType(
    trades: TradePosition[],
    type: 'buy' | 'sell',
    callback: (trade: TradePosition, context: LoopContext) => boolean | void
  ): LoopResult {
    const filteredTrades = trades.filter(t => t.type === type)
    return this.forEachTrade(filteredTrades, callback)
  }
  
  forEachPendingOrder(
    orders: PendingOrder[],
    callback: (order: PendingOrder, context: LoopContext) => boolean | void
  ): LoopResult {
    const results: any[] = []
    let completed = true
    
    for (let i = 0; i < orders.length; i++) {
      const context: LoopContext = {
        currentIndex: i,
        totalIterations: orders.length,
        currentItem: orders[i],
        breakRequested: false,
        continueRequested: false
      }
      
      try {
        const result = callback(orders[i], context)
        results.push(result)
        
        if (context.breakRequested || result === false) {
          completed = false
          break
        }
        
        if (context.continueRequested) {
          continue
        }
      } catch (error) {
        return {
          completed: false,
          iterations: i,
          results,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }
    }
    
    return {
      completed,
      iterations: orders.length,
      results
    }
  }
  
  forEachSymbol(
    symbols: string[],
    callback: (symbol: string, context: LoopContext) => boolean | void
  ): LoopResult {
    const results: any[] = []
    let completed = true
    
    for (let i = 0; i < symbols.length; i++) {
      const context: LoopContext = {
        currentIndex: i,
        totalIterations: symbols.length,
        currentItem: symbols[i],
        breakRequested: false,
        continueRequested: false
      }
      
      try {
        const result = callback(symbols[i], context)
        results.push(result)
        
        if (context.breakRequested || result === false) {
          completed = false
          break
        }
        
        if (context.continueRequested) {
          continue
        }
      } catch (error) {
        return {
          completed: false,
          iterations: i,
          results,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }
    }
    
    return {
      completed,
      iterations: symbols.length,
      results
    }
  }
  
  repeatNTimes(
    n: number,
    callback: (iteration: number, context: LoopContext) => boolean | void
  ): LoopResult {
    const results: any[] = []
    let completed = true
    
    for (let i = 0; i < n; i++) {
      const context: LoopContext = {
        currentIndex: i,
        totalIterations: n,
        currentItem: i,
        breakRequested: false,
        continueRequested: false
      }
      
      try {
        const result = callback(i, context)
        results.push(result)
        
        if (context.breakRequested || result === false) {
          completed = false
          break
        }
        
        if (context.continueRequested) {
          continue
        }
      } catch (error) {
        return {
          completed: false,
          iterations: i,
          results,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }
    }
    
    return {
      completed,
      iterations: n,
      results
    }
  }
  
  whileCondition(
    condition: () => boolean,
    callback: (iteration: number, context: LoopContext) => boolean | void,
    maxIterations: number = 1000
  ): LoopResult {
    const results: any[] = []
    let completed = false
    let iterations = 0
    
    while (condition() && iterations < maxIterations) {
      const context: LoopContext = {
        currentIndex: iterations,
        totalIterations: maxIterations,
        currentItem: iterations,
        breakRequested: false,
        continueRequested: false
      }
      
      try {
        const result = callback(iterations, context)
        results.push(result)
        
        if (context.breakRequested || result === false) {
          completed = true
          break
        }
        
        if (context.continueRequested) {
          iterations++
          continue
        }
      } catch (error) {
        return {
          completed: false,
          iterations,
          results,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }
      
      iterations++
    }
    
    if (!condition() || iterations >= maxIterations) {
      completed = true
    }
    
    return {
      completed,
      iterations,
      results
    }
  }
  
  map<T, R>(
    items: T[],
    mapper: (item: T, index: number) => R
  ): R[] {
    return items.map((item, index) => mapper(item, index))
  }
  
  filter<T>(
    items: T[],
    predicate: (item: T, index: number) => boolean
  ): T[] {
    return items.filter((item, index) => predicate(item, index))
  }
  
  reduce<T, R>(
    items: T[],
    reducer: (accumulator: R, item: T, index: number) => R,
    initialValue: R
  ): R {
    return items.reduce((acc, item, index) => reducer(acc, item, index), initialValue)
  }
  
  find<T>(
    items: T[],
    predicate: (item: T, index: number) => boolean
  ): T | undefined {
    return items.find((item, index) => predicate(item, index))
  }
  
  some<T>(
    items: T[],
    predicate: (item: T, index: number) => boolean
  ): boolean {
    return items.some((item, index) => predicate(item, index))
  }
  
  every<T>(
    items: T[],
    predicate: (item: T, index: number) => boolean
  ): boolean {
    return items.every((item, index) => predicate(item, index))
  }
}

export const loopEngine = new LoopIterationEngine()
