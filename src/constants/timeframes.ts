import { Timeframe } from '@/types/market-data'

export interface TimeframeInfo {
  value: Timeframe
  label: string
  minutes: number
}

export const TIMEFRAMES: TimeframeInfo[] = [
  { value: 'M1', label: '1 Minute', minutes: 1 },
  { value: 'M5', label: '5 Minutes', minutes: 5 },
  { value: 'M15', label: '15 Minutes', minutes: 15 },
  { value: 'M30', label: '30 Minutes', minutes: 30 },
  { value: 'H1', label: '1 Hour', minutes: 60 },
  { value: 'H4', label: '4 Hours', minutes: 240 },
  { value: 'D1', label: '1 Day', minutes: 1440 },
  { value: 'W1', label: '1 Week', minutes: 10080 },
  { value: 'MN', label: '1 Month', minutes: 43200 },
]

export const getTimeframeInfo = (timeframe: Timeframe): TimeframeInfo | undefined => {
  return TIMEFRAMES.find(tf => tf.value === timeframe)
}
