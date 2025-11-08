import { OHLCV } from '@/types/market-data'

export interface StochasticResult {
  k: number[]
  d: number[]
}

export function calculateStochastic(
  data: OHLCV[],
  kPeriod: number = 14,
  dPeriod: number = 3,
  smooth: number = 3
): StochasticResult {
  const k: number[] = []

  for (let i = 0; i < data.length; i++) {
    if (i < kPeriod - 1) {
      k.push(NaN)
    } else {
      const slice = data.slice(i - kPeriod + 1, i + 1)
      const highest = Math.max(...slice.map(d => d.high))
      const lowest = Math.min(...slice.map(d => d.low))
      const current = data[i].close

      if (highest === lowest) {
        k.push(50)
      } else {
        k.push(((current - lowest) / (highest - lowest)) * 100)
      }
    }
  }

  const smoothK: number[] = []
  for (let i = 0; i < k.length; i++) {
    if (i < smooth - 1 || isNaN(k[i])) {
      smoothK.push(NaN)
    } else {
      const sum = k.slice(i - smooth + 1, i + 1).reduce((a, b) => a + b, 0)
      smoothK.push(sum / smooth)
    }
  }

  const d: number[] = []
  for (let i = 0; i < smoothK.length; i++) {
    if (i < dPeriod - 1 || isNaN(smoothK[i])) {
      d.push(NaN)
    } else {
      const sum = smoothK.slice(i - dPeriod + 1, i + 1).reduce((a, b) => a + b, 0)
      d.push(sum / dPeriod)
    }
  }

  return {
    k: smoothK,
    d
  }
}
