import { OHLCV } from '@/types/market-data'

export function calculateVWAP(data: OHLCV[]): number[] {
  const results: number[] = []

  let cumulativeTPV = 0
  let cumulativeVolume = 0

  for (let i = 0; i < data.length; i++) {
    const typicalPrice = (data[i].high + data[i].low + data[i].close) / 3
    const tpv = typicalPrice * data[i].volume

    cumulativeTPV += tpv
    cumulativeVolume += data[i].volume

    if (cumulativeVolume === 0) {
      results.push(NaN)
      continue
    }

    const vwap = cumulativeTPV / cumulativeVolume

    results.push(vwap)
  }

  return results
}
