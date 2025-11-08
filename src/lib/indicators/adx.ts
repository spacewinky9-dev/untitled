import { Indicator } from '@/types/indicators'
import { OHLCV } from '@/types/market-data'

export const ADX: Indicator = {
  id: 'adx',
  name: 'Average Directional Index',
  category: 'trend',
  description: 'Measures trend strength (0-100). Above 25 indicates strong trend.',
  parameters: [
    {
      key: 'period',
      label: 'Period',
      type: 'number',
      default: 14,
      min: 5,
      max: 50
    }
  ],
  outputCount: 1,
  outputLabels: ['ADX'],
  calculate: (data: OHLCV[], params: { period: number }) => {
    const { period } = params
    const result: number[] = []
    const plusDM: number[] = []
    const minusDM: number[] = []
    const tr: number[] = []

    for (let i = 0; i < data.length; i++) {
      if (i === 0) {
        plusDM.push(0)
        minusDM.push(0)
        tr.push(0)
        result.push(NaN)
        continue
      }

      const highDiff = data[i].high - data[i - 1].high
      const lowDiff = data[i - 1].low - data[i].low
      
      plusDM.push(highDiff > lowDiff && highDiff > 0 ? highDiff : 0)
      minusDM.push(lowDiff > highDiff && lowDiff > 0 ? lowDiff : 0)

      const high_low = data[i].high - data[i].low
      const high_close = Math.abs(data[i].high - data[i - 1].close)
      const low_close = Math.abs(data[i].low - data[i - 1].close)
      tr.push(Math.max(high_low, high_close, low_close))

      if (i < period) {
        result.push(NaN)
        continue
      }

      const smoothedPlusDM = plusDM.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0)
      const smoothedMinusDM = minusDM.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0)
      const smoothedTR = tr.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0)

      const plusDI = smoothedTR > 0 ? (smoothedPlusDM / smoothedTR) * 100 : 0
      const minusDI = smoothedTR > 0 ? (smoothedMinusDM / smoothedTR) * 100 : 0

      const diSum = plusDI + minusDI
      const dx = diSum > 0 ? (Math.abs(plusDI - minusDI) / diSum) * 100 : 0

      if (i < period * 2 - 1) {
        result.push(NaN)
      } else {
        const dxValues: number[] = []
        for (let j = i - period + 1; j <= i; j++) {
          if (j >= period - 1) {
            const pDM = plusDM.slice(j - period + 1, j + 1).reduce((a, b) => a + b, 0)
            const mDM = minusDM.slice(j - period + 1, j + 1).reduce((a, b) => a + b, 0)
            const tR = tr.slice(j - period + 1, j + 1).reduce((a, b) => a + b, 0)
            const pDI = tR > 0 ? (pDM / tR) * 100 : 0
            const mDI = tR > 0 ? (mDM / tR) * 100 : 0
            const sum = pDI + mDI
            dxValues.push(sum > 0 ? (Math.abs(pDI - mDI) / sum) * 100 : 0)
          }
        }
        const adx = dxValues.length > 0 ? dxValues.reduce((a, b) => a + b, 0) / dxValues.length : 0
        result.push(adx)
      }
    }

    return result
  }
}
