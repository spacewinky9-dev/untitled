import { Strategy } from '@/types/strategy'
import { OHLCV } from '@/types/market-data'
import { BacktestEngine } from './backtest-engine'
import { BacktestConfig, PerformanceMetrics } from '@/types/backtest'

export interface OptimizationParameter {
  nodeId: string
  parameterKey: string
  min: number
  max: number
  step: number
  current?: number
}

export interface OptimizationConfig {
  parameters: OptimizationParameter[]
  targetMetric: keyof PerformanceMetrics
  maximize: boolean
  method: 'grid' | 'genetic' | 'random'
  maxIterations?: number
  populationSize?: number
}

export interface OptimizationResult {
  bestParameters: Record<string, number>
  bestMetricValue: number
  allResults: OptimizationIteration[]
  improvementPercent: number
  totalIterations: number
  duration: number
}

export interface OptimizationIteration {
  iteration: number
  parameters: Record<string, number>
  metricValue: number
  metrics: PerformanceMetrics
}

export class OptimizationEngine {
  private backtestEngine: BacktestEngine

  constructor() {
    this.backtestEngine = new BacktestEngine()
  }

  async optimize(
    strategy: Strategy,
    data: OHLCV[],
    backtestConfig: BacktestConfig,
    optimizationConfig: OptimizationConfig,
    onProgress?: (progress: number, iteration: number) => void
  ): Promise<OptimizationResult> {
    const startTime = Date.now()

    let results: OptimizationIteration[]

    switch (optimizationConfig.method) {
      case 'grid':
        results = await this.gridSearch(
          strategy,
          data,
          backtestConfig,
          optimizationConfig,
          onProgress
        )
        break
      case 'genetic':
        results = await this.geneticAlgorithm(
          strategy,
          data,
          backtestConfig,
          optimizationConfig,
          onProgress
        )
        break
      case 'random':
        results = await this.randomSearch(
          strategy,
          data,
          backtestConfig,
          optimizationConfig,
          onProgress
        )
        break
      default:
        throw new Error(`Unknown optimization method: ${optimizationConfig.method}`)
    }

    const sortedResults = results.sort((a, b) => {
      if (optimizationConfig.maximize) {
        return b.metricValue - a.metricValue
      } else {
        return a.metricValue - b.metricValue
      }
    })

    const bestResult = sortedResults[0]
    const worstResult = sortedResults[sortedResults.length - 1]
    
    const improvementPercent = optimizationConfig.maximize
      ? ((bestResult.metricValue - worstResult.metricValue) / Math.abs(worstResult.metricValue || 1)) * 100
      : ((worstResult.metricValue - bestResult.metricValue) / Math.abs(worstResult.metricValue || 1)) * 100

    return {
      bestParameters: bestResult.parameters,
      bestMetricValue: bestResult.metricValue,
      allResults: results,
      improvementPercent,
      totalIterations: results.length,
      duration: Date.now() - startTime
    }
  }

  private async gridSearch(
    strategy: Strategy,
    data: OHLCV[],
    backtestConfig: BacktestConfig,
    optimizationConfig: OptimizationConfig,
    onProgress?: (progress: number, iteration: number) => void
  ): Promise<OptimizationIteration[]> {
    const parameterCombinations = this.generateGridCombinations(optimizationConfig.parameters)
    const results: OptimizationIteration[] = []
    const total = parameterCombinations.length

    for (let i = 0; i < parameterCombinations.length; i++) {
      const parameters = parameterCombinations[i]
      const modifiedStrategy = this.applyParameters(strategy, parameters, optimizationConfig.parameters)
      
      const backtestResult = await this.backtestEngine.run(modifiedStrategy, data, backtestConfig)
      const metricValue = backtestResult.metrics[optimizationConfig.targetMetric] as number

      results.push({
        iteration: i + 1,
        parameters: this.parametersToRecord(parameters, optimizationConfig.parameters),
        metricValue,
        metrics: backtestResult.metrics
      })

      if (onProgress) {
        onProgress((i + 1) / total * 100, i + 1)
      }
    }

    return results
  }

  private async geneticAlgorithm(
    strategy: Strategy,
    data: OHLCV[],
    backtestConfig: BacktestConfig,
    optimizationConfig: OptimizationConfig,
    onProgress?: (progress: number, iteration: number) => void
  ): Promise<OptimizationIteration[]> {
    const populationSize = optimizationConfig.populationSize || 20
    const maxGenerations = optimizationConfig.maxIterations || 50
    const mutationRate = 0.1
    const crossoverRate = 0.7

    let population = this.initializePopulation(optimizationConfig.parameters, populationSize)
    const allResults: OptimizationIteration[] = []
    let generation = 0

    while (generation < maxGenerations) {
      const fitness = await Promise.all(
        population.map(async (individual) => {
          const modifiedStrategy = this.applyParameters(strategy, individual, optimizationConfig.parameters)
          const backtestResult = await this.backtestEngine.run(modifiedStrategy, data, backtestConfig)
          const metricValue = backtestResult.metrics[optimizationConfig.targetMetric] as number
          
          allResults.push({
            iteration: generation * populationSize + population.indexOf(individual) + 1,
            parameters: this.parametersToRecord(individual, optimizationConfig.parameters),
            metricValue,
            metrics: backtestResult.metrics
          })

          return metricValue
        })
      )

      const sortedIndices = fitness
        .map((f, i) => ({ fitness: f, index: i }))
        .sort((a, b) => optimizationConfig.maximize ? b.fitness - a.fitness : a.fitness - b.fitness)
        .map(item => item.index)

      const eliteCount = Math.floor(populationSize * 0.2)
      const newPopulation = sortedIndices.slice(0, eliteCount).map(i => [...population[i]])

      while (newPopulation.length < populationSize) {
        const parent1 = this.tournamentSelection(population, fitness, optimizationConfig.maximize)
        const parent2 = this.tournamentSelection(population, fitness, optimizationConfig.maximize)

        let offspring = [...parent1]
        if (Math.random() < crossoverRate) {
          offspring = this.crossover(parent1, parent2)
        }

        if (Math.random() < mutationRate) {
          offspring = this.mutate(offspring, optimizationConfig.parameters)
        }

        newPopulation.push(offspring)
      }

      population = newPopulation
      generation++

      if (onProgress) {
        onProgress((generation / maxGenerations) * 100, generation)
      }
    }

    return allResults
  }

  private async randomSearch(
    strategy: Strategy,
    data: OHLCV[],
    backtestConfig: BacktestConfig,
    optimizationConfig: OptimizationConfig,
    onProgress?: (progress: number, iteration: number) => void
  ): Promise<OptimizationIteration[]> {
    const maxIterations = optimizationConfig.maxIterations || 100
    const results: OptimizationIteration[] = []

    for (let i = 0; i < maxIterations; i++) {
      const parameters = this.generateRandomParameters(optimizationConfig.parameters)
      const modifiedStrategy = this.applyParameters(strategy, parameters, optimizationConfig.parameters)
      
      const backtestResult = await this.backtestEngine.run(modifiedStrategy, data, backtestConfig)
      const metricValue = backtestResult.metrics[optimizationConfig.targetMetric] as number

      results.push({
        iteration: i + 1,
        parameters: this.parametersToRecord(parameters, optimizationConfig.parameters),
        metricValue,
        metrics: backtestResult.metrics
      })

      if (onProgress) {
        onProgress((i + 1) / maxIterations * 100, i + 1)
      }
    }

    return results
  }

  private generateGridCombinations(parameters: OptimizationParameter[]): number[][] {
    if (parameters.length === 0) return [[]]

    const [first, ...rest] = parameters
    const values: number[] = []
    
    for (let v = first.min; v <= first.max; v += first.step) {
      values.push(Number(v.toFixed(8)))
    }

    const restCombinations = this.generateGridCombinations(rest)
    const combinations: number[][] = []

    for (const value of values) {
      for (const restCombo of restCombinations) {
        combinations.push([value, ...restCombo])
      }
    }

    return combinations
  }

  private initializePopulation(parameters: OptimizationParameter[], size: number): number[][] {
    const population: number[][] = []
    
    for (let i = 0; i < size; i++) {
      population.push(this.generateRandomParameters(parameters))
    }

    return population
  }

  private generateRandomParameters(parameters: OptimizationParameter[]): number[] {
    return parameters.map(param => {
      const steps = Math.floor((param.max - param.min) / param.step) + 1
      const randomStep = Math.floor(Math.random() * steps)
      return Number((param.min + randomStep * param.step).toFixed(8))
    })
  }

  private tournamentSelection(population: number[][], fitness: number[], maximize: boolean): number[] {
    const tournamentSize = 3
    let best = Math.floor(Math.random() * population.length)
    
    for (let i = 1; i < tournamentSize; i++) {
      const competitor = Math.floor(Math.random() * population.length)
      if (maximize) {
        if (fitness[competitor] > fitness[best]) {
          best = competitor
        }
      } else {
        if (fitness[competitor] < fitness[best]) {
          best = competitor
        }
      }
    }

    return population[best]
  }

  private crossover(parent1: number[], parent2: number[]): number[] {
    const crossoverPoint = Math.floor(Math.random() * parent1.length)
    return [...parent1.slice(0, crossoverPoint), ...parent2.slice(crossoverPoint)]
  }

  private mutate(individual: number[], parameters: OptimizationParameter[]): number[] {
    const mutated = [...individual]
    const mutationIndex = Math.floor(Math.random() * mutated.length)
    const param = parameters[mutationIndex]
    
    const steps = Math.floor((param.max - param.min) / param.step) + 1
    const randomStep = Math.floor(Math.random() * steps)
    mutated[mutationIndex] = Number((param.min + randomStep * param.step).toFixed(8))

    return mutated
  }

  private applyParameters(
    strategy: Strategy,
    parameters: number[],
    paramDefinitions: OptimizationParameter[]
  ): Strategy {
    const modifiedStrategy = JSON.parse(JSON.stringify(strategy)) as Strategy

    parameters.forEach((value, index) => {
      const param = paramDefinitions[index]
      const node = modifiedStrategy.nodes.find(n => n.id === param.nodeId)
      
      if (node && node.data.parameters) {
        node.data.parameters[param.parameterKey] = value
      }
    })

    return modifiedStrategy
  }

  private parametersToRecord(
    parameters: number[],
    paramDefinitions: OptimizationParameter[]
  ): Record<string, number> {
    const record: Record<string, number> = {}
    
    parameters.forEach((value, index) => {
      const param = paramDefinitions[index]
      const key = `${param.nodeId}.${param.parameterKey}`
      record[key] = value
    })

    return record
  }
}
