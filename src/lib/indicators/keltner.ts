import { OHLCV } from '@/types/market-data'
import { calculateEMA } from './ema'
import { calculateATR } from './atr'

export interface KeltnerResult {
  upper: number
  middle: number
  lower: number
}

export function calculateKeltner(
  data: OHLCV[],
  period: number = 20,
  atrPeriod: number = 10,
  multiplier: number = 2
): KeltnerResult[] {
  const results: KeltnerResult[] = []

  const typicalPrices = data.map(c => (c.high + c.low + c.close) / 3)
  const typicalData = data.map((c, i) => ({
    ...c,
    close: typicalPrices[i]
  }))

  const emaResults = calculateEMA(typicalData, period, 'close')
  const atrResults = calculateATR(data, atrPeriod)

  for (let i = 0; i < data.length; i++) {
    if (isNaN(emaResults[i]) || isNaN(atrResults[i])) {
      results.push({ upper: NaN, middle: NaN, lower: NaN })
      continue
    }

    const middle = emaResults[i]
    const atr = atrResults[i]
    const offset = atr * multiplier

    results.push({
      upper: middle + offset,
      middle,
      lower: middle - offset
    })
  }

  return results
}
