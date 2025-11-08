import { OHLCV } from '@/types/market-data'

export function calculateSMA(
  data: OHLCV[],
  period: number,
  source: 'open' | 'high' | 'low' | 'close' = 'close'
): number[] {
  const values = data.map(d => d[source])
  const result: number[] = []

  for (let i = 0; i < values.length; i++) {
    if (i < period - 1) {
      result.push(NaN)
    } else {
      const sum = values.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0)
      result.push(sum / period)
    }
  }

  return result
}
