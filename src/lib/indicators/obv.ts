import { OHLCV } from '@/types/market-data'

export function calculateOBV(data: OHLCV[]): number[] {
  const results: number[] = []

  if (data.length === 0) {
    return results
  }

  let obvValue = data[0].volume

  results.push(obvValue)

  for (let i = 1; i < data.length; i++) {
    const currentClose = data[i].close
    const previousClose = data[i - 1].close
    const volume = data[i].volume

    if (currentClose > previousClose) {
      obvValue += volume
    } else if (currentClose < previousClose) {
      obvValue -= volume
    }

    results.push(obvValue)
  }

  return results
}
