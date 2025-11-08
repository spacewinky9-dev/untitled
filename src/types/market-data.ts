export type Timeframe = 'M1' | 'M5' | 'M15' | 'M30' | 'H1' | 'H4' | 'D1' | 'W1' | 'MN'

export interface OHLCV {
  time: number
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export interface CurrencyPair {
  symbol: string
  base: string
  quote: string
  pipSize: number
  lotSize: number
}

export interface MarketDataRequest {
  symbol: string
  timeframe: Timeframe
  from: Date
  to: Date
}
