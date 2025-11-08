import { OHLCV } from '@/types/market-data'

export function calculateEMA(
  data: OHLCV[],
  period: number,
  source: 'open' | 'high' | 'low' | 'close' = 'close'
): number[] {
  const values = data.map(d => d[source])
  const result: number[] = []
  const multiplier = 2 / (period + 1)

  for (let i = 0; i < values.length; i++) {
    if (i < period - 1) {
      result.push(NaN)
    } else if (i === period - 1) {
      const sum = values.slice(0, period).reduce((a, b) => a + b, 0)
      result.push(sum / period)
    } else {
      const ema = (values[i] - result[i - 1]) * multiplier + result[i - 1]
      result.push(ema)
    }
  }

  return result
}
