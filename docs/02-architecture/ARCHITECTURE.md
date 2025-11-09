# ForexFlow - Technical Architecture Document

## System Overview

ForexFlow is a browser-based, client-side React application that enables visual forex trading strategy creation, backtesting, and simulation. The application runs entirely in the browser without requiring a backend server, utilizing local storage for persistence and external APIs for market data.

---

## Technology Stack

### Core Framework
- **React 19** - UI framework with concurrent rendering
- **TypeScript 5.7** - Type-safe development
- **Vite 6.3** - Build tool and dev server

### UI & Styling
- **Tailwind CSS 4.1** - Utility-first styling
- **shadcn/ui v4** - Pre-built accessible components
- **Framer Motion 12** - Animation library
- **@phosphor-icons/react** - Icon library

### Visual Programming
- **@xyflow/react (React Flow)** - Node-based visual programming canvas
- Custom node types and edge rendering
- Custom minimap and controls

### Charting & Visualization
- **Lightweight Charts** - High-performance candlestick charts
- **Recharts** - Statistical charts (equity curves, distributions)
- **D3.js** - Custom visualizations (heat maps, advanced charts)

### Data & State Management
- **React Hooks** - Local component state (`useState`, `useReducer`)
- **useKV (Spark SDK)** - Persistent browser storage
- **React Context** - Global state (active strategy, settings)
- **TanStack Query** - Async data fetching and caching (market data)

### Forms & Validation
- **react-hook-form** - Form state management
- **zod** - Schema validation

### Utilities
- **date-fns** - Date manipulation
- **big.js** - Precise financial calculations
- **lodash-es** (selective imports) - Utility functions

---

## Application Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Browser Application                      │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              Presentation Layer (React)                │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐│ │
│  │  │ Builder  │  │ Backtest │  │  Chart   │  │Library ││ │
│  │  │   View   │  │   View   │  │   View   │  │  View  ││ │
│  │  └──────────┘  └──────────┘  └──────────┘  └────────┘│ │
│  └────────────────────────────────────────────────────────┘ │
│                            │                                  │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              Application Layer (Hooks)                 │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐│ │
│  │  │useStrategy│ │useBacktest│ │useMarket │  │usePaper││ │
│  │  │  Manager  │  │  Engine   │  │  Data    │  │Trading││ │
│  │  └──────────┘  └──────────┘  └──────────┘  └────────┘│ │
│  └────────────────────────────────────────────────────────┘ │
│                            │                                  │
│  ┌────────────────────────────────────────────────────────┐ │
│  │               Business Logic Layer                     │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐│ │
│  │  │ Strategy │  │ Indicator│  │ Backtest │  │  Risk  ││ │
│  │  │  Engine  │  │  Library │  │  Engine  │  │Manager ││ │
│  │  └──────────┘  └──────────┘  └──────────┘  └────────┘│ │
│  └────────────────────────────────────────────────────────┘ │
│                            │                                  │
│  ┌────────────────────────────────────────────────────────┐ │
│  │               Data Layer                               │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐            │ │
│  │  │   useKV  │  │ Market   │  │  Cache   │            │ │
│  │  │ (Spark)  │  │ Data API │  │  Layer   │            │ │
│  │  └──────────┘  └──────────┘  └──────────┘            │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                               │
└─────────────────────────────────────────────────────────────┘
          │                      │
          ▼                      ▼
  ┌──────────────┐      ┌──────────────┐
  │ Browser      │      │ External     │
  │ Storage      │      │ Market APIs  │
  │ (IndexedDB)  │      │ (OANDA, etc.)│
  └──────────────┘      └──────────────┘
```

---

## Directory Structure

```
/workspaces/spark-template/
├── src/
│   ├── components/
│   │   ├── ui/                      # shadcn components (pre-installed)
│   │   ├── builder/                 # Strategy builder components
│   │   │   ├── Canvas.tsx           # Main flow canvas
│   │   │   ├── NodePalette.tsx      # Draggable node library
│   │   │   ├── PropertiesPanel.tsx  # Node configuration panel
│   │   │   ├── Toolbar.tsx          # Builder actions toolbar
│   │   │   └── nodes/               # Custom node types
│   │   │       ├── IndicatorNode.tsx
│   │   │       ├── ConditionNode.tsx
│   │   │       ├── ActionNode.tsx
│   │   │       └── LogicNode.tsx
│   │   ├── chart/                   # Charting components
│   │   │   ├── CandlestickChart.tsx
│   │   │   ├── IndicatorOverlay.tsx
│   │   │   └── TradeMarkers.tsx
│   │   ├── backtest/                # Backtesting UI
│   │   │   ├── BacktestPanel.tsx
│   │   │   ├── EquityCurve.tsx
│   │   │   ├── MetricsGrid.tsx
│   │   │   └── TradeList.tsx
│   │   ├── library/                 # Strategy library
│   │   │   ├── StrategyGrid.tsx
│   │   │   ├── StrategyCard.tsx
│   │   │   └── TemplateList.tsx
│   │   └── common/                  # Shared components
│   │       ├── Navbar.tsx
│   │       ├── Layout.tsx
│   │       └── LiveNumber.tsx
│   ├── lib/
│   │   ├── utils.ts                 # Utility functions
│   │   ├── engine/                  # Core engines
│   │   │   ├── strategy-engine.ts   # Strategy execution
│   │   │   ├── backtest-engine.ts   # Backtesting logic
│   │   │   ├── indicator-engine.ts  # Indicator calculations
│   │   │   └── risk-manager.ts      # Risk management
│   │   ├── indicators/              # Technical indicators
│   │   │   ├── moving-average.ts
│   │   │   ├── rsi.ts
│   │   │   ├── macd.ts
│   │   │   ├── bollinger-bands.ts
│   │   │   └── index.ts             # Indicator registry
│   │   ├── nodes/                   # Node type definitions
│   │   │   ├── node-types.ts
│   │   │   ├── node-registry.ts
│   │   │   └── node-validator.ts
│   │   ├── market-data/             # Market data services
│   │   │   ├── data-provider.ts
│   │   │   ├── historical-data.ts
│   │   │   └── realtime-stream.ts
│   │   └── analytics/               # Performance analytics
│   │       ├── metrics.ts
│   │       ├── statistics.ts
│   │       └── reports.ts
│   ├── hooks/
│   │   ├── use-mobile.ts            # Mobile detection (existing)
│   │   ├── use-strategy.ts          # Strategy state management
│   │   ├── use-backtest.ts          # Backtesting operations
│   │   ├── use-market-data.ts       # Market data fetching
│   │   ├── use-paper-trading.ts     # Paper trading simulation
│   │   └── use-indicators.ts        # Indicator calculations
│   ├── types/
│   │   ├── strategy.ts              # Strategy type definitions
│   │   ├── market-data.ts           # Market data types
│   │   ├── backtest.ts              # Backtest result types
│   │   ├── indicators.ts            # Indicator types
│   │   └── nodes.ts                 # Node type definitions
│   ├── constants/
│   │   ├── indicators.ts            # Indicator definitions
│   │   ├── node-categories.ts       # Node palette categories
│   │   └── timeframes.ts            # Trading timeframes
│   ├── data/
│   │   ├── templates/               # Strategy templates
│   │   │   ├── trend-following.json
│   │   │   ├── mean-reversion.json
│   │   │   └── breakout.json
│   │   └── sample-data/             # Sample market data
│   │       └── eurusd-sample.json
│   ├── App.tsx                      # Main app component
│   ├── index.css                    # Global styles & theme
│   ├── main.tsx                     # Entry point (don't modify)
│   └── main.css                     # Structural CSS (don't modify)
├── tracing.md                       # Development tracking
├── PRD.md                           # Product requirements
├── ARCHITECTURE.md                  # This file
├── index.html                       # HTML entry
├── package.json                     # Dependencies
└── vite.config.ts                   # Vite config (don't modify)
```

---

## Core Systems

### 1. Strategy Builder System

**Components:**
- `Canvas` - React Flow canvas with custom nodes and edges
- `NodePalette` - Categorized draggable node library
- `PropertiesPanel` - Dynamic form for node configuration
- `Toolbar` - Strategy actions (save, load, validate, test)

**Node Types:**
```typescript
type NodeCategory = 'indicator' | 'condition' | 'action' | 'logic' | 'risk'

interface BaseNode {
  id: string
  type: string
  category: NodeCategory
  position: { x: number; y: number }
  data: {
    label: string
    parameters: Record<string, any>
    inputs: Port[]
    outputs: Port[]
  }
}

interface IndicatorNode extends BaseNode {
  category: 'indicator'
  data: {
    indicatorType: string  // 'SMA', 'RSI', 'MACD', etc.
    parameters: {
      period?: number
      source?: 'close' | 'open' | 'high' | 'low'
      // ... indicator-specific params
    }
    outputs: [{ id: string; type: 'number' }]
  }
}

interface ConditionNode extends BaseNode {
  category: 'condition'
  data: {
    operator: 'gt' | 'lt' | 'eq' | 'gte' | 'lte' | 'cross_above' | 'cross_below'
    inputs: [
      { id: string; type: 'number'; label: 'Value A' },
      { id: string; type: 'number'; label: 'Value B' }
    ]
    outputs: [{ id: string; type: 'boolean' }]
  }
}

interface ActionNode extends BaseNode {
  category: 'action'
  data: {
    action: 'buy' | 'sell' | 'close' | 'alert'
    parameters: {
      lots?: number
      stopLoss?: number
      takeProfit?: number
    }
    inputs: [{ id: string; type: 'boolean'; label: 'Trigger' }]
  }
}

interface LogicNode extends BaseNode {
  category: 'logic'
  data: {
    operator: 'AND' | 'OR' | 'NOT' | 'XOR'
    inputs: [
      { id: string; type: 'boolean' },
      { id: string; type: 'boolean' }
    ]
    outputs: [{ id: string; type: 'boolean' }]
  }
}
```

**Edge Validation:**
Edges can only connect ports with compatible types:
- `number` → `number`
- `boolean` → `boolean`
- `number` → `condition.input` (for comparisons)

**Strategy Persistence:**
```typescript
// Using Spark's useKV for storage
const [strategies, setStrategies] = useKV<Strategy[]>('strategies', [])

// Save strategy
const saveStrategy = (strategy: Strategy) => {
  setStrategies((current) => {
    const existing = current.findIndex(s => s.id === strategy.id)
    if (existing >= 0) {
      const updated = [...current]
      updated[existing] = strategy
      return updated
    }
    return [...current, strategy]
  })
}

// Load strategy
const loadStrategy = (id: string) => {
  return strategies.find(s => s.id === id)
}
```

---

### 2. Indicator Library System

**Architecture:**
Each indicator is a pure function that takes price data and parameters, returns calculated values.

```typescript
interface Indicator {
  id: string
  name: string
  category: 'trend' | 'momentum' | 'volatility' | 'volume'
  description: string
  parameters: ParameterDefinition[]
  calculate: (data: OHLCV[], params: Record<string, any>) => number[]
}

interface OHLCV {
  time: number  // Unix timestamp
  open: number
  high: number
  low: number
  close: number
  volume: number
}

interface ParameterDefinition {
  key: string
  label: string
  type: 'number' | 'select' | 'boolean'
  default: any
  min?: number
  max?: number
  options?: { label: string; value: any }[]
}
```

**Example Indicator Implementation:**
```typescript
// lib/indicators/sma.ts
export const SMA: Indicator = {
  id: 'sma',
  name: 'Simple Moving Average',
  category: 'trend',
  description: 'Average price over N periods',
  parameters: [
    {
      key: 'period',
      label: 'Period',
      type: 'number',
      default: 20,
      min: 1,
      max: 500
    },
    {
      key: 'source',
      label: 'Source',
      type: 'select',
      default: 'close',
      options: [
        { label: 'Close', value: 'close' },
        { label: 'Open', value: 'open' },
        { label: 'High', value: 'high' },
        { label: 'Low', value: 'low' }
      ]
    }
  ],
  calculate: (data: OHLCV[], params: { period: number; source: keyof OHLCV }) => {
    const { period, source } = params
    const values = data.map(d => d[source])
    const result: number[] = []
    
    for (let i = 0; i < values.length; i++) {
      if (i < period - 1) {
        result.push(NaN)  // Not enough data
      } else {
        const sum = values.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0)
        result.push(sum / period)
      }
    }
    
    return result
  }
}
```

**Indicator Registry:**
```typescript
// lib/indicators/index.ts
import { SMA } from './sma'
import { EMA } from './ema'
import { RSI } from './rsi'
import { MACD } from './macd'
import { BollingerBands } from './bollinger-bands'
// ... more indicators

export const INDICATOR_REGISTRY: Record<string, Indicator> = {
  sma: SMA,
  ema: EMA,
  rsi: RSI,
  macd: MACD,
  bb: BollingerBands,
  // ... more
}

export const getIndicator = (id: string): Indicator | undefined => {
  return INDICATOR_REGISTRY[id]
}

export const getIndicatorsByCategory = (category: string): Indicator[] => {
  return Object.values(INDICATOR_REGISTRY).filter(ind => ind.category === category)
}
```

---

### 3. Strategy Execution Engine

**Purpose:** Evaluate strategy logic for each bar of data, determine when to open/close positions.

```typescript
interface StrategyEngine {
  execute: (strategy: Strategy, marketData: OHLCV[]) => ExecutionResult
}

interface ExecutionResult {
  trades: Trade[]
  signals: Signal[]
  state: StrategyState
}

interface Trade {
  id: string
  type: 'buy' | 'sell'
  entryTime: number
  entryPrice: number
  exitTime?: number
  exitPrice?: number
  lots: number
  stopLoss?: number
  takeProfit?: number
  profit?: number
  pips?: number
}

interface Signal {
  time: number
  type: 'buy' | 'sell' | 'close'
  reason: string  // Which node triggered it
}

interface StrategyState {
  openPositions: Trade[]
  balance: number
  equity: number
  margin: number
}
```

**Execution Algorithm:**
```typescript
// lib/engine/strategy-engine.ts
export class StrategyExecutor {
  private nodes: Map<string, BaseNode>
  private edges: Edge[]
  private indicators: Map<string, number[]>  // Cached indicator results
  
  execute(strategy: Strategy, data: OHLCV[], initialBalance: number): ExecutionResult {
    this.nodes = new Map(strategy.nodes.map(n => [n.id, n]))
    this.edges = strategy.edges
    
    // Pre-calculate all indicators
    this.preCalculateIndicators(data)
    
    const trades: Trade[] = []
    const signals: Signal[] = []
    let balance = initialBalance
    let openPositions: Trade[] = []
    
    // Simulate bar-by-bar
    for (let i = 0; i < data.length; i++) {
      const bar = data[i]
      const context = { bar, index: i, balance, openPositions }
      
      // Evaluate all condition nodes
      const conditionResults = this.evaluateConditions(context)
      
      // Check for entry signals
      const entrySignal = this.checkEntrySignals(conditionResults)
      if (entrySignal) {
        const trade = this.openPosition(entrySignal, bar, balance)
        openPositions.push(trade)
        signals.push({ time: bar.time, type: entrySignal.type, reason: entrySignal.nodeId })
      }
      
      // Check for exit signals
      openPositions = openPositions.filter(position => {
        const exitSignal = this.checkExitSignals(position, bar, conditionResults)
        if (exitSignal) {
          position.exitTime = bar.time
          position.exitPrice = bar.close
          position.profit = this.calculateProfit(position)
          balance += position.profit
          trades.push(position)
          signals.push({ time: bar.time, type: 'close', reason: exitSignal.reason })
          return false  // Remove from open positions
        }
        return true  // Keep open
      })
    }
    
    return {
      trades,
      signals,
      state: { openPositions, balance, equity: balance, margin: 0 }
    }
  }
  
  private preCalculateIndicators(data: OHLCV[]) {
    // Find all indicator nodes and calculate their values
    for (const node of this.nodes.values()) {
      if (node.category === 'indicator') {
        const indicator = getIndicator(node.data.indicatorType)
        if (indicator) {
          const result = indicator.calculate(data, node.data.parameters)
          this.indicators.set(node.id, result)
        }
      }
    }
  }
  
  private evaluateConditions(context: ExecutionContext): Map<string, boolean> {
    const results = new Map<string, boolean>()
    
    // Topological sort nodes to evaluate dependencies in order
    const sorted = this.topologicalSort()
    
    for (const nodeId of sorted) {
      const node = this.nodes.get(nodeId)
      if (!node) continue
      
      if (node.category === 'condition') {
        results.set(nodeId, this.evaluateConditionNode(node, context, results))
      } else if (node.category === 'logic') {
        results.set(nodeId, this.evaluateLogicNode(node, results))
      }
    }
    
    return results
  }
  
  private evaluateConditionNode(node: ConditionNode, context: ExecutionContext, results: Map<string, boolean>): boolean {
    const { operator } = node.data
    const { index } = context
    
    // Get input values (from connected nodes)
    const inputA = this.getInputValue(node.id, 'input_a', index)
    const inputB = this.getInputValue(node.id, 'input_b', index)
    
    switch (operator) {
      case 'gt': return inputA > inputB
      case 'lt': return inputA < inputB
      case 'eq': return Math.abs(inputA - inputB) < 0.0001
      case 'gte': return inputA >= inputB
      case 'lte': return inputA <= inputB
      case 'cross_above': {
        if (index === 0) return false
        const prevA = this.getInputValue(node.id, 'input_a', index - 1)
        const prevB = this.getInputValue(node.id, 'input_b', index - 1)
        return prevA <= prevB && inputA > inputB
      }
      case 'cross_below': {
        if (index === 0) return false
        const prevA = this.getInputValue(node.id, 'input_a', index - 1)
        const prevB = this.getInputValue(node.id, 'input_b', index - 1)
        return prevA >= prevB && inputA < inputB
      }
      default: return false
    }
  }
  
  private evaluateLogicNode(node: LogicNode, results: Map<string, boolean>): boolean {
    const { operator } = node.data
    
    // Get connected input nodes
    const inputs = this.getConnectedInputs(node.id)
    const inputValues = inputs.map(inputId => results.get(inputId) || false)
    
    switch (operator) {
      case 'AND': return inputValues.every(v => v)
      case 'OR': return inputValues.some(v => v)
      case 'NOT': return !inputValues[0]
      case 'XOR': return inputValues.filter(v => v).length === 1
      default: return false
    }
  }
  
  private getInputValue(nodeId: string, portId: string, index: number): number {
    // Find edge connected to this input port
    const edge = this.edges.find(e => e.target === nodeId && e.targetHandle === portId)
    if (!edge) return 0
    
    // Get value from source node
    const sourceNode = this.nodes.get(edge.source)
    if (!sourceNode) return 0
    
    if (sourceNode.category === 'indicator') {
      const values = this.indicators.get(sourceNode.id)
      return values ? values[index] : 0
    }
    
    // Could be a constant value node or math operation
    return sourceNode.data.parameters.value || 0
  }
  
  private topologicalSort(): string[] {
    // Implement topological sort to ensure dependencies are evaluated first
    // ... (standard topological sort algorithm)
    return Array.from(this.nodes.keys())
  }
}
```

---

### 4. Backtesting Engine

**Purpose:** Run strategy on historical data, calculate performance metrics.

```typescript
// lib/engine/backtest-engine.ts
export interface BacktestConfig {
  startDate: Date
  endDate: Date
  initialBalance: number
  leverage: number
  spread: number  // in pips
  commission: number  // per lot
  slippage: number  // in pips
}

export interface BacktestResult {
  config: BacktestConfig
  trades: Trade[]
  equityCurve: EquityPoint[]
  metrics: PerformanceMetrics
  statistics: TradeStatistics
}

export interface EquityPoint {
  time: number
  balance: number
  equity: number
  drawdown: number
  drawdownPercent: number
}

export class BacktestEngine {
  async run(strategy: Strategy, data: OHLCV[], config: BacktestConfig): Promise<BacktestResult> {
    // Execute strategy
    const executor = new StrategyExecutor()
    const executionResult = executor.execute(strategy, data, config.initialBalance)
    
    // Apply spread, slippage, commission
    const adjustedTrades = this.applyTradingCosts(executionResult.trades, config)
    
    // Calculate equity curve
    const equityCurve = this.calculateEquityCurve(adjustedTrades, config.initialBalance, data)
    
    // Calculate metrics
    const metrics = this.calculateMetrics(adjustedTrades, equityCurve)
    
    // Calculate statistics
    const statistics = this.calculateStatistics(adjustedTrades)
    
    return {
      config,
      trades: adjustedTrades,
      equityCurve,
      metrics,
      statistics
    }
  }
  
  private applyTradingCosts(trades: Trade[], config: BacktestConfig): Trade[] {
    return trades.map(trade => {
      const spreadCost = config.spread / 10000 * trade.lots  // Convert pips to price
      const slippageCost = config.slippage / 10000 * trade.lots
      const commissionCost = config.commission * trade.lots
      
      const adjustedProfit = (trade.profit || 0) - spreadCost - slippageCost - (commissionCost * 2)
      
      return {
        ...trade,
        profit: adjustedProfit,
        costs: {
          spread: spreadCost,
          slippage: slippageCost,
          commission: commissionCost * 2
        }
      }
    })
  }
  
  private calculateEquityCurve(trades: Trade[], initialBalance: number, data: OHLCV[]): EquityPoint[] {
    const curve: EquityPoint[] = []
    let balance = initialBalance
    let peak = initialBalance
    let tradeIndex = 0
    
    for (const bar of data) {
      // Check if any trades closed at this bar
      while (tradeIndex < trades.length && trades[tradeIndex].exitTime === bar.time) {
        balance += trades[tradeIndex].profit || 0
        tradeIndex++
      }
      
      // Track peak for drawdown calculation
      if (balance > peak) {
        peak = balance
      }
      
      const drawdown = peak - balance
      const drawdownPercent = (drawdown / peak) * 100
      
      curve.push({
        time: bar.time,
        balance,
        equity: balance,  // Simplified; should include floating P&L
        drawdown,
        drawdownPercent
      })
    }
    
    return curve
  }
  
  private calculateMetrics(trades: Trade[], equityCurve: EquityPoint[]): PerformanceMetrics {
    const totalTrades = trades.length
    const winningTrades = trades.filter(t => (t.profit || 0) > 0)
    const losingTrades = trades.filter(t => (t.profit || 0) < 0)
    
    const totalProfit = trades.reduce((sum, t) => sum + (t.profit || 0), 0)
    const grossProfit = winningTrades.reduce((sum, t) => sum + (t.profit || 0), 0)
    const grossLoss = Math.abs(losingTrades.reduce((sum, t) => sum + (t.profit || 0), 0))
    
    const winRate = totalTrades > 0 ? (winningTrades.length / totalTrades) * 100 : 0
    const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : 0
    
    const avgWin = winningTrades.length > 0
      ? grossProfit / winningTrades.length
      : 0
    const avgLoss = losingTrades.length > 0
      ? grossLoss / losingTrades.length
      : 0
    
    const maxDrawdown = Math.max(...equityCurve.map(p => p.drawdown))
    const maxDrawdownPercent = Math.max(...equityCurve.map(p => p.drawdownPercent))
    
    const returns = this.calculateReturns(equityCurve)
    const sharpeRatio = this.calculateSharpeRatio(returns)
    const sortinoRatio = this.calculateSortinoRatio(returns)
    
    return {
      totalTrades,
      winningTrades: winningTrades.length,
      losingTrades: losingTrades.length,
      winRate,
      totalProfit,
      grossProfit,
      grossLoss,
      profitFactor,
      avgWin,
      avgLoss,
      maxDrawdown,
      maxDrawdownPercent,
      sharpeRatio,
      sortinoRatio,
      expectancy: avgWin * (winRate / 100) - avgLoss * ((100 - winRate) / 100),
      recoveryFactor: maxDrawdown > 0 ? totalProfit / maxDrawdown : 0
    }
  }
  
  private calculateSharpeRatio(returns: number[]): number {
    if (returns.length === 0) return 0
    
    const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length
    const variance = returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length
    const stdDev = Math.sqrt(variance)
    
    return stdDev > 0 ? (avgReturn / stdDev) * Math.sqrt(252) : 0  // Annualized
  }
  
  private calculateSortinoRatio(returns: number[]): number {
    if (returns.length === 0) return 0
    
    const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length
    const negativeReturns = returns.filter(r => r < 0)
    
    if (negativeReturns.length === 0) return 0
    
    const downside = negativeReturns.reduce((sum, r) => sum + Math.pow(r, 2), 0) / negativeReturns.length
    const downsideDev = Math.sqrt(downside)
    
    return downsideDev > 0 ? (avgReturn / downsideDev) * Math.sqrt(252) : 0
  }
  
  private calculateReturns(equityCurve: EquityPoint[]): number[] {
    const returns: number[] = []
    for (let i = 1; i < equityCurve.length; i++) {
      const ret = (equityCurve[i].balance - equityCurve[i - 1].balance) / equityCurve[i - 1].balance
      returns.push(ret)
    }
    return returns
  }
}
```

---

### 5. Market Data System

**Purpose:** Fetch and manage historical and real-time market data.

```typescript
// lib/market-data/data-provider.ts
export interface MarketDataProvider {
  getHistoricalData(symbol: string, timeframe: Timeframe, from: Date, to: Date): Promise<OHLCV[]>
  subscribeRealtime(symbol: string, callback: (bar: OHLCV) => void): () => void
}

// For MVP: Use sample data or simple fetch from free API
export class AlphaVantageProvider implements MarketDataProvider {
  private apiKey: string
  
  constructor(apiKey?: string) {
    this.apiKey = apiKey || 'demo'  // Alpha Vantage has demo key
  }
  
  async getHistoricalData(
    symbol: string,
    timeframe: Timeframe,
    from: Date,
    to: Date
  ): Promise<OHLCV[]> {
    // Alpha Vantage API call
    const interval = this.mapTimeframeToInterval(timeframe)
    const url = `https://www.alphavantage.co/query?function=FX_INTRADAY&from_symbol=${symbol.slice(0,3)}&to_symbol=${symbol.slice(3,6)}&interval=${interval}&apikey=${this.apiKey}`
    
    const response = await fetch(url)
    const data = await response.json()
    
    // Parse and convert to OHLCV format
    return this.parseAlphaVantageData(data, from, to)
  }
  
  subscribeRealtime(symbol: string, callback: (bar: OHLCV) => void): () => void {
    // For MVP: Simulate real-time with setTimeout
    // In production: Use WebSocket connection
    let isActive = true
    
    const simulate = () => {
      if (!isActive) return
      
      // Generate random price movement (for demo purposes)
      const bar = this.generateRandomBar()
      callback(bar)
      
      setTimeout(simulate, 1000)  // Update every second
    }
    
    simulate()
    
    return () => { isActive = false }
  }
  
  private mapTimeframeToInterval(timeframe: Timeframe): string {
    const map: Record<Timeframe, string> = {
      'M1': '1min',
      'M5': '5min',
      'M15': '15min',
      'M30': '30min',
      'H1': '60min',
      'H4': '60min',  // Need to aggregate
      'D1': 'daily',
      'W1': 'weekly',
      'MN': 'monthly'
    }
    return map[timeframe] || '5min'
  }
}

// Sample data for testing
export class SampleDataProvider implements MarketDataProvider {
  async getHistoricalData(
    symbol: string,
    timeframe: Timeframe,
    from: Date,
    to: Date
  ): Promise<OHLCV[]> {
    // Load from /src/data/sample-data/
    const response = await fetch(`/src/data/sample-data/${symbol.toLowerCase()}-${timeframe}.json`)
    const data = await response.json()
    return data.filter((bar: OHLCV) => 
      bar.time >= from.getTime() && bar.time <= to.getTime()
    )
  }
  
  subscribeRealtime(symbol: string, callback: (bar: OHLCV) => void): () => void {
    // Replay historical data at accelerated speed
    return () => {}
  }
}
```

---

### 6. Risk Management System

**Purpose:** Calculate position sizes, enforce limits, manage exposure.

```typescript
// lib/engine/risk-manager.ts
export interface RiskConfig {
  maxPositionSize: number  // lots
  maxDailyLoss: number  // currency
  maxDrawdown: number  // percentage
  riskPerTrade: number  // percentage of balance
  maxConcurrentTrades: number
}

export class RiskManager {
  private config: RiskConfig
  
  constructor(config: RiskConfig) {
    this.config = config
  }
  
  calculatePositionSize(
    balance: number,
    entryPrice: number,
    stopLoss: number,
    symbol: string
  ): number {
    // Risk amount in currency
    const riskAmount = balance * (this.config.riskPerTrade / 100)
    
    // Distance from entry to stop loss in pips
    const stopDistance = Math.abs(entryPrice - stopLoss)
    
    // Pip value (for standard lot)
    const pipValue = this.getPipValue(symbol)
    
    // Position size in lots
    const lots = riskAmount / (stopDistance * pipValue * 10000)
    
    // Enforce maximum
    return Math.min(lots, this.config.maxPositionSize)
  }
  
  canOpenTrade(state: StrategyState, config: BacktestConfig): boolean {
    // Check maximum concurrent trades
    if (state.openPositions.length >= this.config.maxConcurrentTrades) {
      return false
    }
    
    // Check daily loss limit (would need to track daily P&L)
    // ... implementation
    
    // Check maximum drawdown
    const drawdownPercent = ((config.initialBalance - state.balance) / config.initialBalance) * 100
    if (drawdownPercent >= this.config.maxDrawdown) {
      return false
    }
    
    return true
  }
  
  private getPipValue(symbol: string): number {
    // Simplified pip value calculation
    // In reality, this depends on account currency and quote currency
    const quoteCurrency = symbol.slice(3, 6)
    
    // For pairs quoted in USD, 1 pip = $10 per standard lot
    if (quoteCurrency === 'USD') {
      return 10
    }
    
    // For other pairs, would need to convert
    return 10  // Simplified
  }
}
```

---

## Data Flow Diagrams

### Strategy Execution Flow
```
User Creates Strategy
        │
        ▼
Strategy Saved to useKV
        │
        ▼
User Clicks "Backtest"
        │
        ▼
Load Historical Data (Market Data Provider)
        │
        ▼
Initialize Backtest Engine
        │
        ▼
For Each Bar:
  ├─ Pre-calculate Indicators
  ├─ Evaluate Conditions (traversing node graph)
  ├─ Check Logic Gates
  ├─ Determine Entry/Exit Signals
  ├─ Risk Manager validates trade
  ├─ Execute Trade (virtual)
  └─ Update State (positions, balance, equity)
        │
        ▼
Backtest Complete
        │
        ▼
Calculate Performance Metrics
        │
        ▼
Generate Equity Curve
        │
        ▼
Display Results to User
```

### Paper Trading Flow
```
User Activates Paper Trading
        │
        ▼
Subscribe to Real-time Data Stream
        │
        ▼
On Each Price Update:
  ├─ Update Chart
  ├─ Recalculate Indicators
  ├─ Evaluate Strategy Conditions
  ├─ Check for Entry Signal
  │   ├─ Yes: Risk Manager validates
  │   │       └─ Execute Virtual Trade
  │   │           └─ Send Toast Notification
  │   └─ No: Continue
  ├─ Check Open Positions for Exit
  │   └─ Exit if conditions met
  └─ Update P&L Display
        │
        ▼
User Stops Paper Trading
        │
        ▼
Disconnect Data Stream
        │
        ▼
Save Session Results
```

---

## Performance Considerations

### Canvas Performance (React Flow)
- **Node Count**: Optimize for 100+ nodes by virtualizing off-screen nodes
- **Re-rendering**: Use React.memo for node components
- **Edge Rendering**: Use SVG paths with optimized path calculation

### Indicator Calculations
- **Caching**: Pre-calculate indicators once, store results
- **Lazy Calculation**: Only calculate visible timeframe
- **Web Workers**: Move heavy calculations to worker threads (future optimization)

### Chart Performance
- **Data Decimation**: Show only visible candles, load more on scroll
- **Canvas Rendering**: Use HTML canvas instead of SVG for large datasets
- **Throttling**: Throttle real-time updates to 60fps max

### State Management
- **Selective Updates**: Update only affected components
- **Immutable Updates**: Use functional updates with useKV
- **Debouncing**: Debounce auto-save to avoid excessive writes

---

## Security Considerations

### Data Privacy
- All data stored locally in browser (IndexedDB via useKV)
- No personal trading data sent to external servers
- API keys (if used) stored in browser storage only

### Input Validation
- Validate all node parameters before execution
- Sanitize user inputs in formula editor
- Prevent infinite loops in strategy logic

### External API Safety
- Use HTTPS only for external APIs
- Rate limit API requests
- Handle API failures gracefully

---

## Testing Strategy

### Unit Testing
- Test individual indicators against known values
- Test condition evaluation logic
- Test risk calculation formulas
- Test metric calculations

### Integration Testing
- Test full strategy execution on sample data
- Test backtest engine accuracy
- Test data provider integrations

### Manual Testing
- Test UI interactions (drag-and-drop, node connection)
- Test strategy validation
- Test edge cases (zero balance, extreme market moves)
- Test performance with large datasets

---

## Future Technical Enhancements

- **Web Workers**: Parallel indicator calculation
- **IndexedDB**: Direct usage for larger datasets
- **WebAssembly**: Ultra-fast indicator calculations
- **WebSocket Streaming**: Real broker integration
- **Service Worker**: Offline support for builder
- **Code Splitting**: Lazy load indicator library
- **Cloud Sync**: Optional backend for strategy storage
- **Real-time Collaboration**: Multiple users editing same strategy

---

*This architecture supports a robust, scalable, and maintainable forex bot builder application built entirely in the browser using modern React patterns and best practices.*
