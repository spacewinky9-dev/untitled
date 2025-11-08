import { OHLCV } from '@/types/market-data'

export function calculateRSI(
  data: OHLCV[],
  period: number = 14,
  source: 'open' | 'high' | 'low' | 'close' = 'close'
): number[] {
  const values = data.map(d => d[source])
  const result: number[] = []

  for (let i = 0; i < values.length; i++) {
    if (i < period) {
      result.push(NaN)
      continue
    }

    let gains = 0
    let losses = 0

    for (let j = i - period + 1; j <= i; j++) {
      const change = values[j] - values[j - 1]
      if (change > 0) {
        gains += change
      } else {
        losses += Math.abs(change)
      }
    }

    const avgGain = gains / period
    const avgLoss = losses / period

    if (avgLoss === 0) {
      result.push(100)
    } else {
      const rs = avgGain / avgLoss
      const rsi = 100 - (100 / (1 + rs))
      result.push(rsi)
    }
  }

  return result
}
