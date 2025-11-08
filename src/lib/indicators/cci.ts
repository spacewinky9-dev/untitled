import { OHLCV } from '@/types/market-data'

export function calculateCCI(
  data: OHLCV[],
  period: number = 20
): number[] {
  const result: number[] = []
  
  for (let i = 0; i < data.length; i++) {
    if (i < period) {
      result.push(NaN)
      continue
    }
    
    const typicalPrices: number[] = []
    for (let j = i - period + 1; j <= i; j++) {
      const tp = (data[j].high + data[j].low + data[j].close) / 3
      typicalPrices.push(tp)
    }
    
    const sma = typicalPrices.reduce((sum, val) => sum + val, 0) / period
    
    const meanDeviation = typicalPrices.reduce((sum, val) => 
      sum + Math.abs(val - sma), 0) / period
    
    const currentTP = (data[i].high + data[i].low + data[i].close) / 3
    const cci = meanDeviation !== 0 
      ? (currentTP - sma) / (0.015 * meanDeviation)
      : 0
    
    result.push(cci)
  }
  
  return result
}
