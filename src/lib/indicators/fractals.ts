import { OHLCV } from '@/types/market-data'

export interface FractalsResult {
  up: number | null
  down: number | null
}

export function calculateFractals(
  data: OHLCV[],
  period: number = 5
): FractalsResult[] {
  const results: FractalsResult[] = []
  const sideBars = Math.floor((period - 1) / 2)

  for (let i = 0; i < data.length; i++) {
    if (i < sideBars || i >= data.length - sideBars) {
      results.push({ up: null, down: null })
      continue
    }

    let isUpFractal = true
    let isDownFractal = true

    const centerHigh = data[i].high
    const centerLow = data[i].low

    for (let j = i - sideBars; j <= i + sideBars; j++) {
      if (j === i) continue

      if (data[j].high >= centerHigh) {
        isUpFractal = false
      }

      if (data[j].low <= centerLow) {
        isDownFractal = false
      }
    }

    results.push({
      up: isUpFractal ? centerHigh : null,
      down: isDownFractal ? centerLow : null
    })
  }

  return results
}
