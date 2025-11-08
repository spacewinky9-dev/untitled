import { OHLCV } from '@/types/market-data'

export function generateSampleData(
  symbol: string,
  bars: number = 1000,
  startPrice: number = 1.1000,
  volatility: number = 0.0005
): OHLCV[] {
  const data: OHLCV[] = []
  const now = Date.now()
  const oneMinute = 60 * 1000

  let currentPrice = startPrice

  for (let i = 0; i < bars; i++) {
    const open = currentPrice
    const change = (Math.random() - 0.5) * 2 * volatility
    const close = open + change

    const high = Math.max(open, close) + Math.random() * volatility * 0.5
    const low = Math.min(open, close) - Math.random() * volatility * 0.5
    
    const volume = Math.floor(Math.random() * 1000) + 100

    data.push({
      time: now - (bars - i) * oneMinute,
      open,
      high,
      low,
      close,
      volume
    })

    currentPrice = close
  }

  return data
}

export function generateTrendingData(
  symbol: string,
  bars: number = 1000,
  startPrice: number = 1.1000,
  trendStrength: number = 0.0001,
  volatility: number = 0.0005
): OHLCV[] {
  const data: OHLCV[] = []
  const now = Date.now()
  const oneMinute = 60 * 1000

  let currentPrice = startPrice

  for (let i = 0; i < bars; i++) {
    const open = currentPrice
    const trend = trendStrength
    const noise = (Math.random() - 0.5) * 2 * volatility
    const change = trend + noise
    const close = open + change

    const high = Math.max(open, close) + Math.random() * volatility * 0.5
    const low = Math.min(open, close) - Math.random() * volatility * 0.5
    
    const volume = Math.floor(Math.random() * 1000) + 100

    data.push({
      time: now - (bars - i) * oneMinute,
      open,
      high,
      low,
      close,
      volume
    })

    currentPrice = close
  }

  return data
}

export function generateRangingData(
  symbol: string,
  bars: number = 1000,
  centerPrice: number = 1.1000,
  rangeWidth: number = 0.0020,
  volatility: number = 0.0003
): OHLCV[] {
  const data: OHLCV[] = []
  const now = Date.now()
  const oneMinute = 60 * 1000

  const topRange = centerPrice + rangeWidth / 2
  const bottomRange = centerPrice - rangeWidth / 2
  let currentPrice = centerPrice

  for (let i = 0; i < bars; i++) {
    const open = currentPrice
    
    const meanReversionForce = (centerPrice - currentPrice) * 0.1
    const noise = (Math.random() - 0.5) * 2 * volatility
    const change = meanReversionForce + noise
    
    let close = open + change
    close = Math.max(bottomRange, Math.min(topRange, close))

    const high = Math.max(open, close) + Math.random() * volatility * 0.3
    const low = Math.min(open, close) - Math.random() * volatility * 0.3
    
    const volume = Math.floor(Math.random() * 1000) + 100

    data.push({
      time: now - (bars - i) * oneMinute,
      open,
      high,
      low,
      close,
      volume
    })

    currentPrice = close
  }

  return data
}

export const SAMPLE_DATA = {
  EURUSD: generateTrendingData('EURUSD', 2000, 1.1000, 0.00005, 0.0003),
  GBPUSD: generateRangingData('GBPUSD', 2000, 1.3000, 0.0050, 0.0005),
  USDJPY: generateSampleData('USDJPY', 2000, 110.00, 0.05)
}

export function getSampleData(symbol: string): OHLCV[] {
  return SAMPLE_DATA[symbol as keyof typeof SAMPLE_DATA] || SAMPLE_DATA.EURUSD
}
