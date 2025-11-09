# Quick Integration Reference Guide
## How to Use the New Node Execution Engine

---

## 🚀 Quick Start

### Import the Engine
```typescript
import { NodeExecutionEngine, NodeExecutionContext } from '@/lib/engine/node-execution-engine'
```

### Create Engine Instance
```typescript
const nodeEngine = new NodeExecutionEngine()
```

### Execute a Node
```typescript
const context: NodeExecutionContext = {
  node: strategyNode,
  bar: currentOHLCV,
  index: barIndex,
  allBars: historicalData,
  balance: accountBalance,
  openPositions: positions,
  variables: variableStorage,
  nodeValues: nodeValueMap,
  indicatorCache: indicatorCacheMap,
  symbol: 'EURUSD',
  timeframe: 'M15',
  edges: strategyEdges
}

const result = nodeEngine.executeNode(context)
```

---

## 📋 Node Type Reference

### Event Nodes
```typescript
// Always returns true to trigger downstream
Type: 'event'
Returns: boolean (always true)
Example: OnTick, OnInit, OnTimer
```

### Indicator Nodes
```typescript
// Returns calculated indicator value(s)
Type: 'indicator'
Returns: number | { [key: string]: number }
Example: SMA returns number, MACD returns { macd, signal, histogram }
Parameters: period, source, etc.
```

### Condition Nodes
```typescript
// Returns boolean from comparison
Type: 'condition'
Returns: boolean
Operators: gt, lt, gte, lte, eq, neq, cross_above, cross_below, cross
Example: value1 > value2 → true/false
```

### Logic Nodes
```typescript
// Boolean algebra on inputs
Type: 'logic'
Returns: boolean
Operations: AND, OR, NOT, XOR, NAND, NOR
Example: [true, true] AND → true
```

### Pattern Nodes
```typescript
// Candlestick pattern detection
Type: 'pattern'
Returns: boolean
Patterns: bullish_engulfing, bearish_engulfing, doji, hammer, etc.
Example: Detects pattern in recent candles → true/false
```

### MTF Nodes
```typescript
// Multi-timeframe indicator access
Type: 'mtf'
Returns: number | null
Example: Get H4 SMA(50) value on M15 chart
Parameters: timeframe, indicator, indicatorParams
```

### Variable Nodes
```typescript
// State storage and retrieval
Type: 'variable'
Returns: any
Actions: set, get, increment, reset
Example: Store trade counter, retrieve risk %
```

### Risk Management Nodes
```typescript
// Position sizing and risk controls
Type: 'risk'
Returns: number (lot size or pip distance)
Types: position_size, stop_loss, take_profit, trailing_stop
Example: Calculate 2% risk position size
```

### Money Management Nodes
```typescript
// Advanced position sizing methods
Type: 'money_management'
Returns: number (calculated lot size)
Methods: risk_percent, fixed, martingale, kelly, etc.
Example: Martingale 2x after loss
```

### Advanced Trade Nodes
```typescript
// Trade management operations
Type: 'advanced'
Returns: object with type and parameters
Operations: trailing_stop, break_even, partial_close
Example: Move to break-even at 20 pips
```

### Action Nodes
```typescript
// Trade execution triggers
Type: 'action'
Returns: object | null
Actions: buy, sell, close
Example: Execute buy if input condition true
```

### Graphical Nodes
```typescript
// Chart drawing operations
Type: 'graphical'
Returns: object with drawing parameters
Objects: arrow, line, text, fibonacci
Example: Draw arrow at signal point
```

### Messaging Nodes
```typescript
// Notification and alerts
Type: 'messaging'
Returns: object with message details
Methods: notification, email, sms
Example: Send email when signal triggers
```

### File Operations Nodes
```typescript
// Data persistence
Type: 'file_ops'
Returns: object with file operation details
Operations: read, write, append
Example: Log trade to CSV file
```

### Terminal Nodes
```typescript
// Account and symbol information
Type: 'terminal'
Returns: number (account/symbol value)
Info: balance, equity, margin, bid, ask, point
Example: Get current account balance
```

---

## 🔗 Connection Flow Rules

### Valid Flows
```
✅ Event → Indicator
✅ Indicator → Indicator (chaining)
✅ Indicator → Condition
✅ Condition → Logic
✅ Condition → Action
✅ Logic → Logic (nesting)
✅ Logic → Action
✅ Money Management → Action
✅ Variable → Any node
```

### Invalid Flows
```
❌ Event → Action (skip logic)
❌ Indicator → Action (skip condition)
❌ Logic → Indicator (wrong direction)
❌ Action → Condition (wrong direction)
```

### Best Practice Flow
```
1. Event (trigger)
   ↓
2. Indicators (data)
   ↓
3. Conditions (decisions)
   ↓
4. Logic (combine)
   ↓
5. Risk/Money Mgmt (sizing)
   ↓
6. Action (execute)
```

---

## 🎯 Common Patterns

### Simple Signal
```
OnTick → RSI(14) → < 30 → Buy
```

### Confirmed Signal
```
OnTick → SMA(20) → SMA(50) → Cross Above → Buy
```

### Multi-Condition
```
OnTick → [RSI < 30] → AND ← [Price > SMA(50)] → Buy
```

### With Money Management
```
OnTick → RSI → Condition → Risk% 2% → Buy
```

### With Pattern Confirmation
```
OnTick → [SMA Cross] → AND ← [Bullish Engulfing] → Buy
```

### Multi-Timeframe
```
OnTick → [MTF H4 Uptrend] → AND ← [MTF D1 Uptrend] → AND ← [M15 Signal] → Buy
```

### Complete Professional
```
OnTick → [MTF Analysis] → [Indicators] → [Conditions] → [Logic] → 
  [Variables] → [Money Mgmt] → [Action] → [Advanced Mgmt] → [Notifications]
```

---

## 💡 Pro Tips

### 1. Always Cache Indicators
```typescript
// Indicators are pre-calculated and cached
// Don't recalculate - use cache
const cached = indicatorCache.get(`${nodeId}_${index}`)
```

### 2. Handle Edge Connections
```typescript
// Use edges array to find input nodes
const inputNodes = edges
  .filter(e => e.target === node.id)
  .map(e => e.source)
```

### 3. Previous Values for Crosses
```typescript
// Cross detection needs previous bar
if (operator === 'cross_above') {
  const prevValue1 = getValueAtIndex(index - 1)
  const prevValue2 = getValueAtIndex(index - 1)
  return prevValue1 <= prevValue2 && currentValue1 > currentValue2
}
```

### 4. Error Handling
```typescript
try {
  const result = nodeEngine.executeNode(context)
  nodeValues.set(nodeId, result)
} catch (error) {
  console.error(`Node ${nodeId} failed:`, error)
  stateManager.updateNodeState(nodeId, 'failed', null)
}
```

### 5. Visualization States
```typescript
// Update visual state based on result
const state = result === true ? 'triggered' : 
              result === false ? 'inactive' :
              result !== null ? 'success' : 'idle'
stateManager.updateNodeState(nodeId, state, result)
```

---

## 🔧 Debugging Guide

### Check Node Execution
```typescript
console.log(`Executing node ${node.id} of type ${node.type}`)
console.log('Parameters:', node.data?.parameters)
console.log('Result:', result)
```

### Verify Connections
```typescript
const inputs = edges.filter(e => e.target === nodeId)
console.log(`Node ${nodeId} has ${inputs.length} inputs:`, inputs)
```

### Trace Data Flow
```typescript
sorted.forEach(nodeId => {
  const value = nodeValues.get(nodeId)
  console.log(`${nodeId}: ${value}`)
})
```

### Monitor Cache
```typescript
console.log('Indicator cache size:', indicatorCache.size)
console.log('Cached keys:', Array.from(indicatorCache.keys()))
```

### Execution Order
```typescript
const sorted = topologicalSort()
console.log('Execution order:', sorted)
```

---

## 📚 Integration Examples

### Add New Node Type
```typescript
// 1. Add case to executeNode switch
case 'my_new_type':
  return this.executeMyNewNode(context)

// 2. Implement execution method
private executeMyNewNode(context: NodeExecutionContext): any {
  const { node, bar } = context
  const params = node.data?.parameters || {}
  
  // Your logic here
  return result
}

// 3. Update type definitions
export type NodeCategory = 'indicator' | 'condition' | 'my_new_type' | ...
```

### Custom Indicator Integration
```typescript
// Use getIndicator to access any indicator
const indicator = getIndicator('custom_indicator')
if (indicator) {
  const result = indicator.calculate(allBars, params, index)
  return result
}
```

### Variable Storage
```typescript
// Set variable
variables.set('trade_count', tradeCount)
variableManager.setVariable('trade_count', tradeCount)

// Get variable
const count = variables.get('trade_count') || 
              variableManager.getVariable('trade_count')

// Increment
const newCount = (variables.get('count') || 0) + 1
variables.set('count', newCount)
```

### Money Management
```typescript
const config = {
  method: 'risk_percent',
  riskPercent: 2,
  maxLotSize: 10,
  minLotSize: 0.01
}

const lotSize = moneyManagement.calculateLotSize(
  config, 
  stopLossPips,
  pipValue,
  symbol
)
```

---

## ⚡ Performance Tips

### 1. Pre-calculate Indicators
```typescript
// Before main loop
preCalculateIndicators(allBars)

// During loop - use cache
const value = indicatorCache.get(`${nodeId}_${index}`)
```

### 2. Topological Sort Once
```typescript
// Sort execution order once
const sorted = topologicalSort()

// Use sorted order for all bars
for (const bar of allBars) {
  for (const nodeId of sorted) {
    // Execute in correct order
  }
}
```

### 3. Minimize Recalculation
```typescript
// Don't recalculate if result won't change
if (nodeType === 'event' && lastEventResult) {
  return lastEventResult
}
```

### 4. Batch Updates
```typescript
// Update all node values, then update UI once
nodeValues.clear()
sorted.forEach(nodeId => {
  const value = executeNode(context)
  nodeValues.set(nodeId, value)
})
// Now update visualization in single batch
updateVisualization(nodeValues)
```

---

## 🎓 Learning Resources

### Documentation Files
- `PHASE_10_COMPLETE_INTEGRATION.md` - Full implementation details
- `COMPLETE_STRATEGY_EXAMPLES.md` - 15 working examples
- `SESSION_IMPLEMENTATION_SUMMARY.md` - Session overview
- `CURRENT_STATUS_AND_ROADMAP.md` - Project status

### Code Files
- `src/lib/engine/node-execution-engine.ts` - Main engine
- `src/lib/engine/strategy-executor.ts` - Integration point
- `src/constants/node-categories.ts` - Node definitions
- `src/lib/indicators/` - Indicator implementations

### Example Strategies
See `COMPLETE_STRATEGY_EXAMPLES.md` for:
- RSI Mean Reversion
- SMA Crossover
- Bollinger Bounce
- MACD Momentum
- Multi-Timeframe
- Martingale System
- And 9 more...

---

## 🆘 Common Issues

### Issue: Node returns undefined
**Solution:** Check input connections exist and have values
```typescript
const inputs = getInputNodes(context)
if (inputs.length === 0) {
  console.warn('No inputs connected to node')
  return null
}
```

### Issue: Cross detection not working
**Solution:** Ensure previous values available (index > 0)
```typescript
if (index === 0) {
  return false // Can't detect cross on first bar
}
```

### Issue: Indicator shows NaN
**Solution:** Check enough bars for period calculation
```typescript
if (index < period) {
  return NaN // Not enough data yet
}
```

### Issue: Logic gate always false
**Solution:** Verify inputs are boolean, not numbers
```typescript
const boolInputs = inputs.map(v => Boolean(v))
return boolInputs.every(v => v) // AND
```

### Issue: Money management returns 0
**Solution:** Check balance, pipValue, stopLossPips all > 0
```typescript
if (balance <= 0 || stopLossPips <= 0 || pipValue <= 0) {
  return minLotSize
}
```

---

## ✅ Checklist for New Implementation

When adding new features:

- [ ] Create execution method in `node-execution-engine.ts`
- [ ] Add case to `executeNode()` switch
- [ ] Handle parameters from `node.data.parameters`
- [ ] Use input connections via `edges`
- [ ] Store results in `nodeValues` map
- [ ] Update visualization state
- [ ] Add error handling (try-catch)
- [ ] Test with simple strategy
- [ ] Test with complex strategy
- [ ] Document in markdown files
- [ ] Create usage example
- [ ] Update type definitions

---

## 🎯 Success Criteria

Your integration is complete when:

✅ Node executes without errors  
✅ Returns expected value type  
✅ Handles all edge cases  
✅ Works with input connections  
✅ Updates visualization correctly  
✅ Performs well (no lag)  
✅ Error handling works  
✅ Documentation exists  
✅ Examples provided  
✅ Tests pass  

---

**Quick Reference Version:** 1.0  
**Last Updated:** Current Session  
**Status:** Complete and Production Ready  
**Support:** See full documentation files for details
