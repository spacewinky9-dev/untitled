import { Indicator } from '@/types/indicators'
import { OHLCV } from '@/types/market-data'

export const CCI: Indicator = {
  id: 'cci',
  name: 'Commodity Channel Index',
  category: 'momentum',
  description: 'Measures deviation from average price. Above +100 is overbought, below -100 is oversold.',
  parameters: [
    {
      key: 'period',
      label: 'Period',
      type: 'number',
      default: 20,
      min: 5,
      max: 100
    }
  ],
  outputCount: 1,
  outputLabels: ['CCI'],
  calculate: (data: OHLCV[], params: { period: number }) => {
    const { period } = params
    const result: number[] = []
    const typicalPrices: number[] = data.map(d => (d.high + d.low + d.close) / 3)

    for (let i = 0; i < data.length; i++) {
      if (i < period - 1) {
        result.push(NaN)
        continue
      }

      const slice = typicalPrices.slice(i - period + 1, i + 1)
      const sma = slice.reduce((a, b) => a + b, 0) / period
      
      const meanDeviation = slice.reduce((sum, val) => sum + Math.abs(val - sma), 0) / period
      
      const cci = meanDeviation > 0 ? (typicalPrices[i] - sma) / (0.015 * meanDeviation) : 0
      
      result.push(cci)
    }

    return result
  }
}

export const WilliamsR: Indicator = {
  id: 'williamsr',
  name: 'Williams %R',
  category: 'momentum',
  description: 'Momentum indicator ranging from 0 to -100. Below -80 is oversold, above -20 is overbought.',
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
  outputLabels: ['%R'],
  calculate: (data: OHLCV[], params: { period: number }) => {
    const { period } = params
    const result: number[] = []

    for (let i = 0; i < data.length; i++) {
      if (i < period - 1) {
        result.push(NaN)
        continue
      }

      const slice = data.slice(i - period + 1, i + 1)
      const highestHigh = Math.max(...slice.map(d => d.high))
      const lowestLow = Math.min(...slice.map(d => d.low))
      
      const range = highestHigh - lowestLow
      const williamsR = range > 0 ? ((highestHigh - data[i].close) / range) * -100 : 0
      
      result.push(williamsR)
    }

    return result
  }
}

export const ParabolicSAR: Indicator = {
  id: 'sar',
  name: 'Parabolic SAR',
  category: 'trend',
  description: 'Stop and Reverse indicator that provides potential reversal points.',
  parameters: [
    {
      key: 'accelerationFactor',
      label: 'Acceleration Factor',
      type: 'number',
      default: 0.02,
      min: 0.01,
      max: 0.1,
      step: 0.01
    },
    {
      key: 'maxAcceleration',
      label: 'Max Acceleration',
      type: 'number',
      default: 0.2,
      min: 0.1,
      max: 0.5,
      step: 0.1
    }
  ],
  outputCount: 1,
  outputLabels: ['SAR'],
  calculate: (data: OHLCV[], params: { accelerationFactor: number; maxAcceleration: number }) => {
    const { accelerationFactor, maxAcceleration } = params
    const result: number[] = []
    
    if (data.length < 2) {
      return data.map(() => NaN)
    }

    let isUptrend = data[1].close > data[0].close
    let sar = isUptrend ? data[0].low : data[0].high
    let ep = isUptrend ? data[0].high : data[0].low
    let af = accelerationFactor

    result.push(sar)

    for (let i = 1; i < data.length; i++) {
      sar = sar + af * (ep - sar)

      if (isUptrend) {
        sar = Math.min(sar, data[i - 1].low, i > 1 ? data[i - 2].low : data[i - 1].low)
        
        if (data[i].low < sar) {
          isUptrend = false
          sar = ep
          ep = data[i].low
          af = accelerationFactor
        } else {
          if (data[i].high > ep) {
            ep = data[i].high
            af = Math.min(af + accelerationFactor, maxAcceleration)
          }
        }
      } else {
        sar = Math.max(sar, data[i - 1].high, i > 1 ? data[i - 2].high : data[i - 1].high)
        
        if (data[i].high > sar) {
          isUptrend = true
          sar = ep
          ep = data[i].high
          af = accelerationFactor
        } else {
          if (data[i].low < ep) {
            ep = data[i].low
            af = Math.min(af + accelerationFactor, maxAcceleration)
          }
        }
      }

      result.push(sar)
    }

    return result
  }
}

export const OBV: Indicator = {
  id: 'obv',
  name: 'On-Balance Volume',
  category: 'volume',
  description: 'Cumulative volume indicator that shows money flow.',
  parameters: [],
  outputCount: 1,
  outputLabels: ['OBV'],
  calculate: (data: OHLCV[]) => {
    const result: number[] = []
    let obv = 0

    for (let i = 0; i < data.length; i++) {
      if (i === 0) {
        result.push(data[i].volume)
        obv = data[i].volume
      } else {
        if (data[i].close > data[i - 1].close) {
          obv += data[i].volume
        } else if (data[i].close < data[i - 1].close) {
          obv -= data[i].volume
        }
        result.push(obv)
      }
    }

    return result
  }
}

export const VWAP: Indicator = {
  id: 'vwap',
  name: 'Volume Weighted Average Price',
  category: 'volume',
  description: 'Average price weighted by volume, resets daily.',
  parameters: [],
  outputCount: 1,
  outputLabels: ['VWAP'],
  calculate: (data: OHLCV[]) => {
    const result: number[] = []
    let cumulativePV = 0
    let cumulativeVolume = 0

    for (let i = 0; i < data.length; i++) {
      const typicalPrice = (data[i].high + data[i].low + data[i].close) / 3
      cumulativePV += typicalPrice * data[i].volume
      cumulativeVolume += data[i].volume

      const vwap = cumulativeVolume > 0 ? cumulativePV / cumulativeVolume : typicalPrice
      result.push(vwap)
    }

    return result
  }
}
