import { useState } from 'react'
import { Strategy } from '@/types/strategy'
import { BacktestConfig, BacktestResult } from '@/types/backtest'
import { OHLCV } from '@/types/market-data'
import { BacktestEngine } from '@/lib/engine/backtest-engine'
import { SAMPLE_DATA } from '@/lib/market-data/sample-data'

export function useBacktest() {
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<BacktestResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const runBacktest = async (
    strategy: Strategy,
    symbol: string = 'EURUSD',
    config?: Partial<BacktestConfig>
  ) => {
    setIsRunning(true)
    setProgress(0)
    setError(null)
    setResult(null)

    try {
      const data: OHLCV[] = SAMPLE_DATA[symbol as keyof typeof SAMPLE_DATA] || SAMPLE_DATA.EURUSD

      const backtestConfig: BacktestConfig = {
        startDate: new Date(data[0].time),
        endDate: new Date(data[data.length - 1].time),
        initialBalance: config?.initialBalance || 10000,
        leverage: config?.leverage || 100,
        spread: config?.spread || 2,
        commission: config?.commission || 7,
        slippage: config?.slippage || 1
      }

      setProgress(25)

      const engine = new BacktestEngine()
      
      setProgress(50)

      const backtestResult = await engine.run(strategy, data, backtestConfig)

      setProgress(100)
      setResult(backtestResult)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Backtest error:', err)
    } finally {
      setIsRunning(false)
    }
  }

  const reset = () => {
    setIsRunning(false)
    setProgress(0)
    setResult(null)
    setError(null)
  }

  return {
    runBacktest,
    reset,
    isRunning,
    progress,
    result,
    error
  }
}
