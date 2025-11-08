import { Node, Edge } from '@xyflow/react'
import { OHLCV } from '@/types/market-data'

export type EventType = 'init' | 'tick' | 'timer' | 'trade' | 'deinit'

export interface EventContext {
  type: EventType
  timestamp: number
  currentBar?: OHLCV
  previousBar?: OHLCV
  symbol?: string
  timeframe?: string
  tradeId?: string
  tradeAction?: 'opened' | 'closed' | 'modified'
}

export interface TimerConfig {
  intervalSeconds: number
  lastTrigger: number
}

export interface EventHandler {
  id: string
  eventType: EventType
  nodes: Node[]
  edges: Edge[]
  enabled: boolean
}

export class EventSystemManager {
  private handlers: Map<EventType, EventHandler[]> = new Map()
  private timerConfigs: Map<string, TimerConfig> = new Map()
  private initialized: boolean = false

  registerHandler(handler: EventHandler): void {
    const existingHandlers = this.handlers.get(handler.eventType) || []
    
    const index = existingHandlers.findIndex(h => h.id === handler.id)
    if (index >= 0) {
      existingHandlers[index] = handler
    } else {
      existingHandlers.push(handler)
    }
    
    this.handlers.set(handler.eventType, existingHandlers)

    if (handler.eventType === 'timer') {
      const timerNode = handler.nodes.find(n => n.type === 'event' && n.id.includes('on_timer'))
      if (timerNode && timerNode.data && typeof timerNode.data === 'object') {
        const params = timerNode.data.parameters as Record<string, any> | undefined
        const intervalSeconds = params?.intervalSeconds || 60
        this.timerConfigs.set(handler.id, {
          intervalSeconds,
          lastTrigger: 0
        })
      }
    }
  }

  unregisterHandler(id: string): void {
    for (const [eventType, handlers] of this.handlers) {
      const filtered = handlers.filter(h => h.id !== id)
      this.handlers.set(eventType, filtered)
    }
    this.timerConfigs.delete(id)
  }

  getHandlers(eventType: EventType): EventHandler[] {
    return (this.handlers.get(eventType) || []).filter(h => h.enabled)
  }

  shouldTriggerTimer(handlerId: string, currentTime: number): boolean {
    const config = this.timerConfigs.get(handlerId)
    if (!config) return false

    const elapsedSeconds = (currentTime - config.lastTrigger) / 1000
    
    if (elapsedSeconds >= config.intervalSeconds) {
      config.lastTrigger = currentTime
      return true
    }

    return false
  }

  triggerInit(context: EventContext): EventHandler[] {
    if (this.initialized) {
      return []
    }
    this.initialized = true
    return this.getHandlers('init')
  }

  triggerTick(context: EventContext): EventHandler[] {
    return this.getHandlers('tick')
  }

  triggerTimer(context: EventContext): EventHandler[] {
    const handlers = this.getHandlers('timer')
    return handlers.filter(h => this.shouldTriggerTimer(h.id, context.timestamp))
  }

  triggerTrade(context: EventContext): EventHandler[] {
    return this.getHandlers('trade')
  }

  triggerDeinit(context: EventContext): EventHandler[] {
    return this.getHandlers('deinit')
  }

  triggerEvent(context: EventContext): EventHandler[] {
    switch (context.type) {
      case 'init':
        return this.triggerInit(context)
      case 'tick':
        return this.triggerTick(context)
      case 'timer':
        return this.triggerTimer(context)
      case 'trade':
        return this.triggerTrade(context)
      case 'deinit':
        return this.triggerDeinit(context)
      default:
        return []
    }
  }

  reset(): void {
    this.handlers.clear()
    this.timerConfigs.clear()
    this.initialized = false
  }

  getAllHandlers(): EventHandler[] {
    const allHandlers: EventHandler[] = []
    for (const handlers of this.handlers.values()) {
      allHandlers.push(...handlers)
    }
    return allHandlers
  }

  getTimerInfo(handlerId: string): TimerConfig | undefined {
    return this.timerConfigs.get(handlerId)
  }

  setHandlerEnabled(id: string, enabled: boolean): void {
    for (const handlers of this.handlers.values()) {
      const handler = handlers.find(h => h.id === id)
      if (handler) {
        handler.enabled = enabled
      }
    }
  }
}

export const eventSystemManager = new EventSystemManager()
