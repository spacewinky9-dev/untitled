import { OHLCV } from '@/types/market-data'

export function calculateParabolicSAR(
  data: OHLCV[],
  acceleration: number = 0.02,
  maximum: number = 0.2
): number[] {
  if (data.length < 2) return []
  
  const result: number[] = []
  let isUptrend = data[1].close > data[0].close
  let sar = isUptrend ? data[0].low : data[0].high
  let ep = isUptrend ? data[0].high : data[0].low
  let af = acceleration
  
  result.push(NaN)
  result.push(sar)
  
  for (let i = 2; i < data.length; i++) {
    sar = sar + af * (ep - sar)
    
    if (isUptrend) {
      if (data[i].low < sar) {
        isUptrend = false
        sar = ep
        ep = data[i].low
        af = acceleration
      } else {
        if (data[i].high > ep) {
          ep = data[i].high
          af = Math.min(af + acceleration, maximum)
        }
        sar = Math.min(sar, data[i - 1].low, data[i - 2].low)
      }
    } else {
      if (data[i].high > sar) {
        isUptrend = true
        sar = ep
        ep = data[i].high
        af = acceleration
      } else {
        if (data[i].low < ep) {
          ep = data[i].low
          af = Math.min(af + acceleration, maximum)
        }
        sar = Math.max(sar, data[i - 1].high, data[i - 2].high)
      }
    }
    
    result.push(sar)
  }
  
  return result
}
