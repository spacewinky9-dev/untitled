import { OHLCV } from '@/types/market-data'

export interface IchimokuOutput {
  tenkan: number[]
  kijun: number[]
  senkouA: number[]
  senkouB: number[]
  chikou: number[]
}

function getHighLow(data: OHLCV[], start: number, period: number): { high: number; low: number } {
  let high = -Infinity
  let low = Infinity
  
  for (let i = start; i < start + period && i < data.length; i++) {
    if (data[i].high > high) high = data[i].high
    if (data[i].low < low) low = data[i].low
  }
  
  return { high, low }
}

export function calculateIchimoku(
  data: OHLCV[],
  tenkanPeriod: number = 9,
  kijunPeriod: number = 26,
  senkouPeriod: number = 52
): IchimokuOutput {
  const tenkan: number[] = []
  const kijun: number[] = []
  const senkouA: number[] = []
  const senkouB: number[] = []
  const chikou: number[] = []
  
  for (let i = 0; i < data.length; i++) {
    if (i < tenkanPeriod - 1) {
      tenkan.push(NaN)
    } else {
      const { high, low } = getHighLow(data, i - tenkanPeriod + 1, tenkanPeriod)
      tenkan.push((high + low) / 2)
    }
    
    if (i < kijunPeriod - 1) {
      kijun.push(NaN)
    } else {
      const { high, low } = getHighLow(data, i - kijunPeriod + 1, kijunPeriod)
      kijun.push((high + low) / 2)
    }
    
    if (i < kijunPeriod - 1 || i < tenkanPeriod - 1) {
      senkouA.push(NaN)
    } else {
      senkouA.push((tenkan[i] + kijun[i]) / 2)
    }
    
    if (i < senkouPeriod - 1) {
      senkouB.push(NaN)
    } else {
      const { high, low } = getHighLow(data, i - senkouPeriod + 1, senkouPeriod)
      senkouB.push((high + low) / 2)
    }
    
    chikou.push(data[i].close)
  }
  
  return { tenkan, kijun, senkouA, senkouB, chikou }
}
