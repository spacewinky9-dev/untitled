import { OHLCV } from '@/types/market-data'

export interface DonchianResult {
  upper: number
  middle: number
  lower: number
}

export function calculateDonchian(
  data: OHLCV[],
  period: number = 20
): DonchianResult[] {
  const results: DonchianResult[] = []

  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      results.push({ upper: NaN, middle: NaN, lower: NaN })
      continue
    }

    let highestHigh = -Infinity
    let lowestLow = Infinity

    for (let j = i - period + 1; j <= i; j++) {
      highestHigh = Math.max(highestHigh, data[j].high)
      lowestLow = Math.min(lowestLow, data[j].low)
    }

    const middle = (highestHigh + lowestLow) / 2

    results.push({
      upper: highestHigh,
      middle,
      lower: lowestLow
    })
  }

  return results
}
