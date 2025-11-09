import { describe, it, expect, beforeEach } from 'vitest'
import { MultiTimeframeAnalyzer } from '@/lib/engine/multi-timeframe-analyzer'
import { OHLCV } from '@/types/market-data'

describe('MultiTimeframeAnalyzer', () => {
  let analyzer: MultiTimeframeAnalyzer
  const mockBars: OHLCV[] = [
    { time: 1000, open: 100, high: 105, low: 95, close: 102, volume: 1000 },
    { time: 2000, open: 102, high: 108, low: 100, close: 106, volume: 1200 },
    { time: 3000, open: 106, high: 110, low: 104, close: 108, volume: 1100 },
    { time: 4000, open: 108, high: 112, low: 106, close: 110, volume: 1300 },
    { time: 5000, open: 110, high: 115, low: 108, close: 112, volume: 1400 }
  ]

  beforeEach(() => {
    analyzer = new MultiTimeframeAnalyzer()
  })

  describe('Symbol Management', () => {
    it('should add a new symbol', () => {
      analyzer.addSymbol('EURUSD')
      const symbols = analyzer.getAvailableSymbols()
      expect(symbols).toContain('EURUSD')
    })

    it('should set timeframe data for a symbol', () => {
      analyzer.setTimeframeData('EURUSD', 'H1', mockBars)
      const data = analyzer.getTimeframeData('EURUSD', 'H1')
      expect(data).toBeDefined()
      expect(data?.length).toBe(5)
    })

    it('should return available timeframes for a symbol', () => {
      analyzer.setTimeframeData('EURUSD', 'H1', mockBars)
      analyzer.setTimeframeData('EURUSD', 'H4', mockBars)
      const timeframes = analyzer.getAvailableTimeframes('EURUSD')
      expect(timeframes).toHaveLength(2)
      expect(timeframes).toContain('H1')
      expect(timeframes).toContain('H4')
    })
  })

  describe('Bar Access', () => {
    beforeEach(() => {
      analyzer.setTimeframeData('EURUSD', 'H1', mockBars)
    })

    it('should get current bar', () => {
      const currentBar = analyzer.getCurrentBar('EURUSD', 'H1')
      expect(currentBar).toBeDefined()
      expect(currentBar?.close).toBe(112)
    })

    it('should get previous bars', () => {
      const previousBars = analyzer.getPreviousBars('EURUSD', 'H1', 3)
      expect(previousBars).toHaveLength(3)
      expect(previousBars[previousBars.length - 1].close).toBe(112)
    })

    it('should return empty array for unknown symbol', () => {
      const bars = analyzer.getPreviousBars('UNKNOWN', 'H1', 3)
      expect(bars).toHaveLength(0)
    })
  })

  describe('Trend Detection', () => {
    beforeEach(() => {
      analyzer.setTimeframeData('EURUSD', 'H1', mockBars)
    })

    it('should detect upward trend', () => {
      const trend = analyzer.detectMTFTrend('EURUSD', 'H1', 'price', 5)
      expect(trend).toBe('up')
    })

    it('should detect trend using moving average method', () => {
      const trend = analyzer.detectMTFTrend('EURUSD', 'H1', 'ma', 3)
      expect(['up', 'down', 'sideways']).toContain(trend)
    })

    it('should return sideways for insufficient data', () => {
      analyzer.setTimeframeData('GBPUSD', 'H1', mockBars.slice(0, 2))
      const trend = analyzer.detectMTFTrend('GBPUSD', 'H1', 'ma', 5)
      expect(trend).toBe('sideways')
    })
  })

  describe('MTF Indicator Calculation', () => {
    beforeEach(() => {
      analyzer.setTimeframeData('EURUSD', 'H1', mockBars)
    })

    it('should calculate SMA indicator', () => {
      const result = analyzer.calculateMTFIndicator('EURUSD', 'H1', 'sma', { 
        period: 3, 
        source: 'close' 
      })
      expect(result).toBeDefined()
      expect(typeof result).toBe('number')
    })

    it('should return undefined for unknown indicator', () => {
      const result = analyzer.calculateMTFIndicator('EURUSD', 'H1', 'unknown_indicator', {})
      expect(result).toBeUndefined()
    })

    it('should cache indicator results', () => {
      const result1 = analyzer.calculateMTFIndicator('EURUSD', 'H1', 'sma', { 
        period: 3, 
        source: 'close' 
      })
      const result2 = analyzer.calculateMTFIndicator('EURUSD', 'H1', 'sma', { 
        period: 3, 
        source: 'close' 
      })
      expect(result1).toBe(result2)
    })
  })

  describe('Timeframe Navigation', () => {
    it('should get higher timeframe', () => {
      expect(analyzer.getHigherTimeframe('M5')).toBe('M15')
      expect(analyzer.getHigherTimeframe('H1')).toBe('H4')
      expect(analyzer.getHigherTimeframe('MN')).toBe('MN')
    })

    it('should get lower timeframe', () => {
      expect(analyzer.getLowerTimeframe('M15')).toBe('M5')
      expect(analyzer.getLowerTimeframe('H4')).toBe('H1')
      expect(analyzer.getLowerTimeframe('M1')).toBe('M1')
    })

    it('should get timeframe strength', () => {
      expect(analyzer.getTimeframeStrength('M1')).toBe(1)
      expect(analyzer.getTimeframeStrength('H1')).toBe(5)
      expect(analyzer.getTimeframeStrength('MN')).toBe(9)
    })
  })

  describe('Cache Management', () => {
    beforeEach(() => {
      analyzer.setTimeframeData('EURUSD', 'H1', mockBars)
      analyzer.calculateMTFIndicator('EURUSD', 'H1', 'sma', { period: 3, source: 'close' })
    })

    it('should clear cache', () => {
      analyzer.clearCache()
      // After clearing cache, calculation should still work
      const result = analyzer.calculateMTFIndicator('EURUSD', 'H1', 'sma', { 
        period: 3, 
        source: 'close' 
      })
      expect(result).toBeDefined()
    })

    it('should reset all data', () => {
      analyzer.reset()
      const symbols = analyzer.getAvailableSymbols()
      expect(symbols).toHaveLength(0)
    })
  })
})
