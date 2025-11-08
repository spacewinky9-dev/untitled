import { OHLCV } from '@/types/market-data'

export function calculateWilliamsR(
  data: OHLCV[],
  period: number = 14
): number[] {
  const results: number[] = []

  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      results.push(NaN)
      continue
    }

    let highestHigh = -Infinity
    let lowestLow = Infinity

    for (let j = i - period + 1; j <= i; j++) {
      highestHigh = Math.max(highestHigh, data[j].high)
      lowestLow = Math.min(lowestLow, data[j].low)
    }

    const currentClose = data[i].close
    const range = highestHigh - lowestLow

    if (range === 0) {
      results.push(-50)
      continue
    }

    const williamsR = ((highestHigh - currentClose) / range) * -100

    results.push(williamsR)
  }

  return results
}
