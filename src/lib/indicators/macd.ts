import { OHLCV } from '@/types/market-data'
import { calculateEMA } from './ema'

export interface MACDResult {
  macd: number[]
  signal: number[]
  histogram: number[]
}

export function calculateMACD(
  data: OHLCV[],
  fastPeriod: number = 12,
  slowPeriod: number = 26,
  signalPeriod: number = 9,
  source: 'open' | 'high' | 'low' | 'close' = 'close'
): MACDResult {
  const fastEMA = calculateEMA(data, fastPeriod, source)
  const slowEMA = calculateEMA(data, slowPeriod, source)

  const macdLine: number[] = []
  for (let i = 0; i < data.length; i++) {
    if (isNaN(fastEMA[i]) || isNaN(slowEMA[i])) {
      macdLine.push(NaN)
    } else {
      macdLine.push(fastEMA[i] - slowEMA[i])
    }
  }

  const macdData: OHLCV[] = data.map((d, i) => ({
    ...d,
    close: macdLine[i]
  }))

  const signalLine = calculateEMA(macdData, signalPeriod, 'close')

  const histogram: number[] = []
  for (let i = 0; i < data.length; i++) {
    if (isNaN(macdLine[i]) || isNaN(signalLine[i])) {
      histogram.push(NaN)
    } else {
      histogram.push(macdLine[i] - signalLine[i])
    }
  }

  return {
    macd: macdLine,
    signal: signalLine,
    histogram
  }
}
