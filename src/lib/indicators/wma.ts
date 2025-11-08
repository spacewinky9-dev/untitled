import { OHLCV } from '@/types/market-data'

export function calculateWMA(
  data: OHLCV[],
  period: number,
  source: 'open' | 'high' | 'low' | 'close' = 'close'
): number[] {
  const values = data.map(d => d[source])
  const result: number[] = []
  const weightSum = (period * (period + 1)) / 2

  for (let i = 0; i < values.length; i++) {
    if (i < period - 1) {
      result.push(NaN)
    } else {
      let sum = 0
      for (let j = 0; j < period; j++) {
        const weight = j + 1
        sum += values[i - period + 1 + j] * weight
      }
      result.push(sum / weightSum)
    }
  }

  return result
}
