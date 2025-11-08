import { OHLCV } from '@/types/market-data'
import { calculateSMA } from './sma'

export interface BollingerBandsResult {
  upper: number[]
  middle: number[]
  lower: number[]
}

export function calculateBollingerBands(
  data: OHLCV[],
  period: number = 20,
  stdDev: number = 2,
  source: 'open' | 'high' | 'low' | 'close' = 'close'
): BollingerBandsResult {
  const middle = calculateSMA(data, period, source)
  const values = data.map(d => d[source])
  
  const upper: number[] = []
  const lower: number[] = []

  for (let i = 0; i < values.length; i++) {
    if (isNaN(middle[i])) {
      upper.push(NaN)
      lower.push(NaN)
    } else {
      const slice = values.slice(i - period + 1, i + 1)
      const mean = middle[i]
      const variance = slice.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / period
      const sd = Math.sqrt(variance)

      upper.push(mean + (stdDev * sd))
      lower.push(mean - (stdDev * sd))
    }
  }

  return {
    upper,
    middle,
    lower
  }
}
