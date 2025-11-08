import { OHLCV } from './market-data'

export type IndicatorCategory = 'trend' | 'momentum' | 'volatility' | 'volume' | 'custom'

export interface ParameterDefinition {
  key: string
  label: string
  type: 'number' | 'select' | 'boolean'
  default: any
  min?: number
  max?: number
  step?: number
  options?: { label: string; value: any }[]
  description?: string
}

export interface Indicator {
  id: string
  name: string
  category: IndicatorCategory
  description: string
  parameters: ParameterDefinition[]
  outputCount: number
  outputLabels: string[]
  calculate: (data: OHLCV[], params: Record<string, any>) => number[] | number[][]
}

export interface IndicatorResult {
  indicatorId: string
  values: number[] | number[][]
  parameters: Record<string, any>
}
