export interface StrategyNode {
  id: string
  type: string
  position: { x: number; y: number }
  data: {
    label: string
    parameters?: Record<string, any>
    [key: string]: any
  }
}

export interface StrategyEdge {
  id: string
  source: string
  target: string
  sourceHandle?: string | null
  targetHandle?: string | null
}

export interface Strategy {
  id: string
  name: string
  description: string
  version: string
  createdAt: string
  updatedAt: string
  nodes: StrategyNode[]
  edges: StrategyEdge[]
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
