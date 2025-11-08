import { StrategyNode } from '@/types/strategy'
import { OHLCV } from '@/types/market-data'
import { Trade } from './strategy-executor'

export type EventType = 'on_init' | 'on_tick' | 'on_timer' | 'on_trade' | 'on_deinit'

export interface EventContext {
  eventType: EventType
  bar?: OHLCV
  index?: number
  trade?: Trade
  balance?: number
  timestamp?: number
}

export interface EventHandler {
  id: string
  eventType: EventType
  nodes: StrategyNode[]
  enabled: boolean
}

export class EventSystem {
  private handlers: Map<EventType, EventHandler[]> = new Map()
  private timerIntervals: Map<string, number> = new Map()
  private lastTimerExecution: Map<string, number> = new Map()
  private initialized: boolean = false

  registerHandler(eventType: EventType, nodes: StrategyNode[]): string {
    const handlerId = `${eventType}_${Date.now()}_${Math.random()}`
    
    const handler: EventHandler = {
      id: handlerId,
      eventType,
      nodes,
      enabled: true
    }

    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, [])
    }

    this.handlers.get(eventType)!.push(handler)
    
    return handlerId
  }

  unregisterHandler(handlerId: string): boolean {
    for (const [eventType, handlers] of this.handlers.entries()) {
      const index = handlers.findIndex(h => h.id === handlerId)
      if (index !== -1) {
        handlers.splice(index, 1)
        return true
      }
    }
    return false
  }

  enableHandler(handlerId: string): void {
    for (const handlers of this.handlers.values()) {
      const handler = handlers.find(h => h.id === handlerId)
      if (handler) {
        handler.enabled = true
        return
      }
    }
  }

  disableHandler(handlerId: string): void {
    for (const handlers of this.handlers.values()) {
      const handler = handlers.find(h => h.id === handlerId)
      if (handler) {
        handler.enabled = false
        return
      }
    }
  }

  getHandlers(eventType: EventType): EventHandler[] {
    return this.handlers.get(eventType)?.filter(h => h.enabled) || []
  }

  hasHandlers(eventType: EventType): boolean {
    const handlers = this.handlers.get(eventType)
    return !!handlers && handlers.some(h => h.enabled)
  }

  setTimerInterval(handlerId: string, intervalSeconds: number): void {
    this.timerIntervals.set(handlerId, intervalSeconds)
  }

  getTimerInterval(handlerId: string): number {
    return this.timerIntervals.get(handlerId) || 60
  }

  shouldExecuteTimer(handlerId: string, currentTime: number): boolean {
    const interval = this.getTimerInterval(handlerId)
    const lastExecution = this.lastTimerExecution.get(handlerId) || 0
    
    const timeSinceLastExecution = (currentTime - lastExecution) / 1000
    
    if (timeSinceLastExecution >= interval) {
      this.lastTimerExecution.set(handlerId, currentTime)
      return true
    }
    
    return false
  }

  triggerInit(): EventContext[] {
    if (this.initialized) {
      return []
    }
    
    this.initialized = true
    const handlers = this.getHandlers('on_init')
    
    return handlers.map(handler => ({
      eventType: 'on_init' as EventType,
      timestamp: Date.now()
    }))
  }

  triggerTick(bar: OHLCV, index: number, balance: number): EventContext[] {
    if (!this.initialized) {
      return []
    }

    const handlers = this.getHandlers('on_tick')
    
    return handlers.map(handler => ({
      eventType: 'on_tick' as EventType,
      bar,
      index,
      balance,
      timestamp: bar.time
    }))
  }

  triggerTimer(currentTime: number, bar: OHLCV, index: number, balance: number): EventContext[] {
    if (!this.initialized) {
      return []
    }

    const handlers = this.getHandlers('on_timer')
    const contexts: EventContext[] = []

    for (const handler of handlers) {
      if (this.shouldExecuteTimer(handler.id, currentTime)) {
        contexts.push({
          eventType: 'on_timer' as EventType,
          bar,
          index,
          balance,
          timestamp: currentTime
        })
      }
    }

    return contexts
  }

  triggerTrade(trade: Trade, bar: OHLCV, balance: number): EventContext[] {
    if (!this.initialized) {
      return []
    }

    const handlers = this.getHandlers('on_trade')
    
    return handlers.map(handler => ({
      eventType: 'on_trade' as EventType,
      trade,
      bar,
      balance,
      timestamp: bar.time
    }))
  }

  triggerDeinit(): EventContext[] {
    if (!this.initialized) {
      return []
    }

    this.initialized = false
    const handlers = this.getHandlers('on_deinit')
    
    return handlers.map(handler => ({
      eventType: 'on_deinit' as EventType,
      timestamp: Date.now()
    }))
  }

  reset(): void {
    this.handlers.clear()
    this.timerIntervals.clear()
    this.lastTimerExecution.clear()
    this.initialized = false
  }

  getEventNodes(eventType: EventType): StrategyNode[] {
    const handlers = this.getHandlers(eventType)
    return handlers.flatMap(h => h.nodes)
  }

  getAllHandlers(): Map<EventType, EventHandler[]> {
    return new Map(this.handlers)
  }

  isInitialized(): boolean {
    return this.initialized
  }
}
