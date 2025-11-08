import { useState, useCallback } from 'react'
import { Strategy } from '@/types/strategy'
import { OptimizationEngine, OptimizationConfig, OptimizationResult } from '@/lib/engine/optimization-engine'
import { getSampleData } from '@/lib/market-data/sample-data'
import { BacktestConfig } from '@/types/backtest'

export function useOptimization() {
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentIteration, setCurrentIteration] = useState(0)
  const [result, setResult] = useState<OptimizationResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const runOptimization = useCallback(async (
    strategy: Strategy,
    symbol: string,
    backtestConfig: Partial<BacktestConfig>,
    optimizationConfig: OptimizationConfig
  ) => {
    setIsOptimizing(true)
    setProgress(0)
    setCurrentIteration(0)
    setError(null)
    setResult(null)

    try {
      const data = getSampleData(symbol)

      const config: BacktestConfig = {
        startDate: new Date(data[0].time),
        endDate: new Date(data[data.length - 1].time),
        initialBalance: backtestConfig.initialBalance || 10000,
        leverage: 100,
        spread: backtestConfig.spread || 2,
        commission: backtestConfig.commission || 7,
        slippage: backtestConfig.slippage || 1
      }

      const engine = new OptimizationEngine()
      
      const optimizationResult = await engine.optimize(
        strategy,
        data,
        config,
        optimizationConfig,
        (p, iteration) => {
          setProgress(p)
          setCurrentIteration(iteration)
        }
      )

      setResult(optimizationResult)
      setIsOptimizing(false)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Optimization failed'
      setError(message)
      setIsOptimizing(false)
    }
  }, [])

  const reset = useCallback(() => {
    setResult(null)
    setError(null)
    setProgress(0)
    setCurrentIteration(0)
  }, [])

  return {
    runOptimization,
    isOptimizing,
    progress,
    currentIteration,
    result,
    error,
    reset
  }
}
