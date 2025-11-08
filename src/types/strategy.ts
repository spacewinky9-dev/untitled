export interface Strategy {
  id: string
  name: string
  description: string
  version: string
  createdAt: string
  updatedAt: string
  nodes: any[]
  edges: any[]
  settings?: StrategySettings
  metadata?: StrategyMetadata
}

export interface StrategySettings {
  initialBalance: number
  leverage: number
  spread: number
  commission: number
  slippage: number
}

export interface StrategyMetadata {
  author: string
  tags: string[]
  category: string
  timeframe: string
  pairs: string[]
}

export const defaultStrategySettings: StrategySettings = {
  initialBalance: 10000,
  leverage: 100,
  spread: 2,
  commission: 7,
  slippage: 1
}
