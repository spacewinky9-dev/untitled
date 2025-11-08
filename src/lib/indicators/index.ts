import { OHLCV } from '@/types/market-data'
import { calculateSMA } from './sma'
import { calculateEMA } from './ema'
import { calculateRSI } from './rsi'
import { calculateMACD, MACDResult } from './macd'
import { calculateBollingerBands, BollingerBandsResult } from './bollinger-bands'
import { calculateATR } from './atr'
import { calculateStochastic, StochasticResult } from './stochastic'

export type IndicatorOutput = number[] | MACDResult | BollingerBandsResult | StochasticResult

export interface IndicatorDefinition {
  id: string
  name: string
  category: 'trend' | 'momentum' | 'volatility' | 'volume'
  description: string
  outputs: string[]
  calculate: (data: OHLCV[], params: Record<string, any>) => IndicatorOutput
}

export const INDICATOR_REGISTRY: Record<string, IndicatorDefinition> = {
  sma: {
    id: 'sma',
    name: 'Simple Moving Average',
    category: 'trend',
    description: 'Average price over N periods',
    outputs: ['value'],
    calculate: (data, params) => calculateSMA(data, params.period || 20, params.source || 'close')
  },
  
  ema: {
    id: 'ema',
    name: 'Exponential Moving Average',
    category: 'trend',
    description: 'Weighted average giving more weight to recent prices',
    outputs: ['value'],
    calculate: (data, params) => calculateEMA(data, params.period || 20, params.source || 'close')
  },
  
  rsi: {
    id: 'rsi',
    name: 'Relative Strength Index',
    category: 'momentum',
    description: 'Momentum oscillator measuring speed and magnitude of price changes',
    outputs: ['value'],
    calculate: (data, params) => calculateRSI(data, params.period || 14, params.source || 'close')
  },
  
  macd: {
    id: 'macd',
    name: 'MACD',
    category: 'momentum',
    description: 'Trend-following momentum indicator',
    outputs: ['macd', 'signal', 'histogram'],
    calculate: (data, params) => calculateMACD(
      data,
      params.fastPeriod || 12,
      params.slowPeriod || 26,
      params.signalPeriod || 9,
      params.source || 'close'
    )
  },
  
  bb: {
    id: 'bb',
    name: 'Bollinger Bands',
    category: 'volatility',
    description: 'Volatility bands around a moving average',
    outputs: ['upper', 'middle', 'lower'],
    calculate: (data, params) => calculateBollingerBands(
      data,
      params.period || 20,
      params.stdDev || 2,
      params.source || 'close'
    )
  },
  
  atr: {
    id: 'atr',
    name: 'Average True Range',
    category: 'volatility',
    description: 'Measure of market volatility',
    outputs: ['value'],
    calculate: (data, params) => calculateATR(data, params.period || 14)
  },
  
  stochastic: {
    id: 'stochastic',
    name: 'Stochastic Oscillator',
    category: 'momentum',
    description: 'Momentum indicator comparing closing price to price range',
    outputs: ['k', 'd'],
    calculate: (data, params) => calculateStochastic(
      data,
      params.kPeriod || 14,
      params.dPeriod || 3,
      params.smooth || 3
    )
  }
}

export function getIndicator(id: string): IndicatorDefinition | undefined {
  return INDICATOR_REGISTRY[id]
}

export function getIndicatorsByCategory(category: string): IndicatorDefinition[] {
  return Object.values(INDICATOR_REGISTRY).filter(ind => ind.category === category)
}

export function getAllIndicators(): IndicatorDefinition[] {
  return Object.values(INDICATOR_REGISTRY)
}
