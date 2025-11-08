import { OHLCV } from '@/types/market-data'

export interface PivotPoints {
  pivot: number
  r1: number
  r2: number
  r3: number
  s1: number
  s2: number
  s3: number
}

export type PivotType = 'classic' | 'fibonacci' | 'woodie' | 'camarilla'

export function calculatePivotPoints(
  data: OHLCV[],
  type: PivotType = 'classic'
): PivotPoints[] {
  const result: PivotPoints[] = []
  
  for (let i = 0; i < data.length; i++) {
    if (i === 0) {
      result.push({
        pivot: NaN,
        r1: NaN,
        r2: NaN,
        r3: NaN,
        s1: NaN,
        s2: NaN,
        s3: NaN
      })
      continue
    }
    
    const prev = data[i - 1]
    const high = prev.high
    const low = prev.low
    const close = prev.close
    
    let pivot: number
    let r1: number, r2: number, r3: number
    let s1: number, s2: number, s3: number
    
    switch (type) {
      case 'classic':
        pivot = (high + low + close) / 3
        r1 = 2 * pivot - low
        r2 = pivot + (high - low)
        r3 = high + 2 * (pivot - low)
        s1 = 2 * pivot - high
        s2 = pivot - (high - low)
        s3 = low - 2 * (high - pivot)
        break
        
      case 'fibonacci':
        pivot = (high + low + close) / 3
        r1 = pivot + 0.382 * (high - low)
        r2 = pivot + 0.618 * (high - low)
        r3 = pivot + 1.000 * (high - low)
        s1 = pivot - 0.382 * (high - low)
        s2 = pivot - 0.618 * (high - low)
        s3 = pivot - 1.000 * (high - low)
        break
        
      case 'woodie':
        pivot = (high + low + 2 * close) / 4
        r1 = 2 * pivot - low
        r2 = pivot + (high - low)
        r3 = high + 2 * (pivot - low)
        s1 = 2 * pivot - high
        s2 = pivot - (high - low)
        s3 = low - 2 * (high - pivot)
        break
        
      case 'camarilla':
        pivot = (high + low + close) / 3
        const range = high - low
        r1 = close + range * 1.1 / 12
        r2 = close + range * 1.1 / 6
        r3 = close + range * 1.1 / 4
        s1 = close - range * 1.1 / 12
        s2 = close - range * 1.1 / 6
        s3 = close - range * 1.1 / 4
        break
        
      default:
        pivot = r1 = r2 = r3 = s1 = s2 = s3 = NaN
    }
    
    result.push({ pivot, r1, r2, r3, s1, s2, s3 })
  }
  
  return result
}
