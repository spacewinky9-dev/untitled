import { Node, Edge } from '@xyflow/react'

export interface Strategy {
  id: string
  name: string
  description: string
  version: string
  createdAt: Date
  updatedAt: Date
  nodes: Node[]
  edges: Edge[]
  settings: StrategySettings
  metadata: StrategyMetadata
}

export interface StrategySettings {
  timeframe: string
  pairs: string[]
  riskPerTrade: number
  maxPositions: number
  enableStopLoss: boolean
  enableTakeProfit: boolean
}

export interface StrategyMetadata {
  author: string
  tags: string[]
  category: string
  isTemplate: boolean
  thumbnail?: string
}

export interface StrategyTemplate {
  id: string
  name: string
  description: string
  category: string
  strategy: Omit<Strategy, 'id' | 'createdAt' | 'updatedAt'>
  thumbnail?: string
}
