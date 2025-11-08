import { OHLCV } from '@/types/market-data'

export function calculateATR(
  data: OHLCV[],
  period: number = 14
): number[] {
  const result: number[] = []
  const trueRanges: number[] = []

  for (let i = 0; i < data.length; i++) {
    if (i === 0) {
      trueRanges.push(data[i].high - data[i].low)
      result.push(NaN)
    } else {
      const tr = Math.max(
        data[i].high - data[i].low,
        Math.abs(data[i].high - data[i - 1].close),
        Math.abs(data[i].low - data[i - 1].close)
      )
      trueRanges.push(tr)

      if (i < period) {
        result.push(NaN)
      } else if (i === period) {
        const sum = trueRanges.slice(1, period + 1).reduce((a, b) => a + b, 0)
        result.push(sum / period)
      } else {
        const atr = (result[i - 1] * (period - 1) + trueRanges[i]) / period
        result.push(atr)
      }
    }
  }

  return result
}
