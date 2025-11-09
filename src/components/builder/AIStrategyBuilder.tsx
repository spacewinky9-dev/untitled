import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  Sparkle, 
  Lightning, 
  CheckCircle, 
  Warning 
} from '@phosphor-icons/react'
import { Node, Edge } from '@xyflow/react'
import { toast } from 'sonner'

interface AIStrategyBuilderProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onStrategyGenerated: (nodes: Node[], edges: Edge[]) => void
}

interface GenerationStep {
  label: string
  status: 'pending' | 'processing' | 'complete' | 'error'
  message?: string
}

export function AIStrategyBuilder({ open, onOpenChange, onStrategyGenerated }: AIStrategyBuilderProps) {
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [steps, setSteps] = useState<GenerationStep[]>([
    { label: 'Analyzing prompt', status: 'pending' },
    { label: 'Identifying indicators', status: 'pending' },
    { label: 'Creating conditions', status: 'pending' },
    { label: 'Setting up actions', status: 'pending' },
    { label: 'Validating strategy', status: 'pending' }
  ])

  const updateStep = (index: number, status: GenerationStep['status'], message?: string) => {
    setSteps(prev => prev.map((step, i) => 
      i === index ? { ...step, status, message } : step
    ))
  }

  const generateStrategy = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a strategy description')
      return
    }

    setIsGenerating(true)
    setProgress(0)

    try {
      updateStep(0, 'processing')
      setProgress(20)

      const aiPrompt = spark.llmPrompt`You are a Forex trading strategy expert. Based on the following user description, generate a complete trading strategy structure.

User Description: ${prompt}

Return a JSON object with this exact structure:
{
  "nodes": [
    {
      "id": "unique-id",
      "type": "event|indicator|condition|logic|action|risk",
      "position": {"x": number, "y": number},
      "data": {
        "label": "Node Label",
        "indicatorType": "sma|ema|rsi|macd|bb|atr|stochastic|cci|adx|williams|sar|obv|vwap|wma",
        "parameters": {},
        "operator": "gt|lt|gte|lte|eq|neq|cross_above|cross_below",
        "action": "buy|sell|close",
        "riskType": "stop_loss|take_profit|position_size|trailing_stop"
      }
    }
  ],
  "edges": [
    {
      "id": "edge-id",
      "source": "source-node-id",
      "target": "target-node-id",
      "sourceHandle": "output",
      "targetHandle": "input"
    }
  ],
  "explanation": "Brief explanation of the strategy logic"
}

Available node types and their details:

EVENT NODES (always start with one):
- type: "event", data.label: "OnTick" - triggers on every price tick

INDICATOR NODES with parameters:
- type: "indicator", data.indicatorType: "sma", data.parameters: {"period": 20, "source": "close"}
- type: "indicator", data.indicatorType: "ema", data.parameters: {"period": 20, "source": "close"}
- type: "indicator", data.indicatorType: "rsi", data.parameters: {"period": 14, "overbought": 70, "oversold": 30}
- type: "indicator", data.indicatorType: "macd", data.parameters: {"fastPeriod": 12, "slowPeriod": 26, "signalPeriod": 9}
- type: "indicator", data.indicatorType: "bb", data.parameters: {"period": 20, "stdDev": 2.0}
- type: "indicator", data.indicatorType: "atr", data.parameters: {"period": 14}
- type: "indicator", data.indicatorType: "stochastic", data.parameters: {"kPeriod": 14, "dPeriod": 3, "slowing": 3}
- type: "indicator", data.indicatorType: "cci", data.parameters: {"period": 14}

CONDITION NODES with operators:
- type: "condition", data.operator: "gt" (greater than), data.parameters: {"threshold": 70}
- type: "condition", data.operator: "lt" (less than), data.parameters: {"threshold": 30}
- type: "condition", data.operator: "cross_above", data.parameters: {}
- type: "condition", data.operator: "cross_below", data.parameters: {}

LOGIC NODES:
- type: "logic", data.label: "AND" - requires all inputs true
- type: "logic", data.label: "OR" - requires any input true
- type: "logic", data.label: "NOT" - inverts input

ACTION NODES:
- type: "action", data.action: "buy", data.label: "Buy"
- type: "action", data.action: "sell", data.label: "Sell"
- type: "action", data.action: "close", data.label: "Close Position"

RISK NODES:
- type: "risk", data.riskType: "stop_loss", data.parameters: {"pips": 20}
- type: "risk", data.riskType: "take_profit", data.parameters: {"pips": 40}
- type: "risk", data.riskType: "position_size", data.parameters: {"riskPercent": 1.0}
- type: "risk", data.riskType: "trailing_stop", data.parameters: {"pips": 15, "step": 5}

Important rules:
1. ALWAYS start with an OnTick event node at position x:50, y:200
2. Position nodes left-to-right: Events(x:50) → Indicators(x:250-400) → Conditions(x:550-700) → Logic(x:850) → Actions(x:1000)
3. Vertical spacing: space nodes 150px apart vertically if multiple at same stage
4. Use realistic parameter values for indicators
5. Connect nodes in proper flow order
6. Handle format: sourceHandle: "output", targetHandle: "input"
7. Ensure all node IDs are unique (use descriptive names like "ontick_1", "rsi_1", "condition_rsi_low", "buy_action")
8. For RSI strategy: RSI indicator → condition (< 30 oversold or > 70 overbought) → action
9. For MA crossover: Two MA indicators → cross_above/cross_below condition → action
10. Include risk management nodes for realistic strategies

Example valid strategy (RSI oversold/overbought):
- OnTick event (x:50, y:200)
- RSI indicator (x:300, y:200)
- Condition RSI < 30 (x:600, y:150)
- Buy action (x:900, y:150)
- Condition RSI > 70 (x:600, y:250)
- Sell action (x:900, y:250)
With edges connecting: event→rsi, rsi→condition_low, condition_low→buy, rsi→condition_high, condition_high→sell`

      const result = await window.spark.llm(aiPrompt, 'gpt-4o', true)
      updateStep(0, 'complete')
      setProgress(40)

      const strategyData = JSON.parse(result)
      
      if (!strategyData.nodes || !Array.isArray(strategyData.nodes)) {
        throw new Error('Invalid strategy structure')
      }

      updateStep(1, 'complete', `${strategyData.nodes.filter((n: any) => n.type === 'indicator').length} indicators`)
      setProgress(60)
      
      updateStep(2, 'complete', `${strategyData.nodes.filter((n: any) => n.type === 'condition').length} conditions`)
      setProgress(75)
      
      updateStep(3, 'complete', `${strategyData.nodes.filter((n: any) => n.type === 'action').length} actions`)
      setProgress(90)

      updateStep(4, 'processing')
      
      const isValid = strategyData.nodes.length > 0 && 
                      strategyData.nodes.some((n: any) => n.type === 'action')
      
      if (!isValid) {
        updateStep(4, 'error', 'Strategy incomplete')
        toast.error('Generated strategy is incomplete. Try refining your prompt.')
        return
      }

      updateStep(4, 'complete', 'Strategy validated')
      setProgress(100)

      toast.success(`Strategy generated: ${strategyData.explanation || 'Ready to use'}`)
      
      setTimeout(() => {
        onStrategyGenerated(strategyData.nodes, strategyData.edges || [])
        onOpenChange(false)
        resetState()
      }, 1000)

    } catch (error) {
      console.error('AI generation error:', error)
      toast.error('Failed to generate strategy. Please try again.')
      const errorIndex = steps.findIndex(s => s.status === 'processing')
      if (errorIndex >= 0) {
        updateStep(errorIndex, 'error', 'Generation failed')
      }
    } finally {
      setIsGenerating(false)
    }
  }

  const resetState = () => {
    setPrompt('')
    setProgress(0)
    setSteps([
      { label: 'Analyzing prompt', status: 'pending' },
      { label: 'Identifying indicators', status: 'pending' },
      { label: 'Creating conditions', status: 'pending' },
      { label: 'Setting up actions', status: 'pending' },
      { label: 'Validating strategy', status: 'pending' }
    ])
  }

  const examplePrompts = [
    "Create a simple RSI strategy that buys when RSI(14) is below 30 (oversold) and sells when RSI is above 70 (overbought). Include 20 pip stop loss and 40 pip take profit.",
    "Build a moving average crossover strategy where we buy when 20 EMA crosses above 50 EMA, and sell when 20 EMA crosses below 50 EMA. Add position sizing with 1% risk.",
    "Make a MACD momentum strategy that buys when MACD line crosses above signal line and sells when it crosses below. Use default MACD parameters (12,26,9).",
    "Create a Bollinger Bands mean reversion strategy that buys when price touches lower band and sells when price touches upper band. Use 20 period BB with 2 standard deviations.",
    "Build a trend-following strategy using 200 EMA as filter. Buy when price is above 200 EMA AND RSI is above 50. Sell when price is below 200 EMA AND RSI is below 50.",
    "Create a breakout strategy using ATR. Buy when price breaks above recent high with ATR-based stop loss at 2x ATR. Include trailing stop of 1.5x ATR."
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-accent/20 to-primary/20 rounded-lg">
              <Sparkle size={24} className="text-accent" weight="fill" />
            </div>
            <div>
              <DialogTitle className="text-xl">AI Strategy Builder</DialogTitle>
              <DialogDescription>
                Describe your trading strategy and let AI create it for you
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-3">
            <Label htmlFor="strategy-prompt" className="text-base font-semibold">
              Strategy Description
            </Label>
            <Textarea
              id="strategy-prompt"
              placeholder="Example: Create a trend-following strategy using 20 and 50 period EMA crossover. Buy when 20 EMA crosses above 50 EMA AND price is above 200 EMA. Sell when 20 EMA crosses below 50 EMA AND price is below 200 EMA. Use 30 pip stop loss and 60 pip take profit with 1% position sizing..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[140px] resize-none"
              disabled={isGenerating}
            />
            <p className="text-xs text-muted-foreground">
              Be specific about indicators, entry/exit conditions, and risk management
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Quick Examples</Label>
            <div className="flex flex-wrap gap-2">
              {examplePrompts.map((example, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs h-auto py-2"
                  onClick={() => setPrompt(example)}
                  disabled={isGenerating}
                >
                  {example}
                </Button>
              ))}
            </div>
          </div>

          {isGenerating && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Generating Strategy...</span>
                  <span className="text-muted-foreground">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              <div className="space-y-2">
                {steps.map((step, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/30"
                  >
                    {step.status === 'pending' && (
                      <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30" />
                    )}
                    {step.status === 'processing' && (
                      <Lightning size={20} className="text-accent animate-pulse" weight="fill" />
                    )}
                    {step.status === 'complete' && (
                      <CheckCircle size={20} className="text-bullish" weight="fill" />
                    )}
                    {step.status === 'error' && (
                      <Warning size={20} className="text-destructive" weight="fill" />
                    )}
                    
                    <div className="flex-1">
                      <p className="text-sm font-medium">{step.label}</p>
                      {step.message && (
                        <p className="text-xs text-muted-foreground">{step.message}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!isGenerating && (
            <div className="bg-accent/10 border border-accent/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Sparkle size={20} className="text-accent flex-shrink-0 mt-0.5" />
                <div className="space-y-2 text-sm">
                  <p className="font-medium">Tips for better results:</p>
                  <ul className="space-y-1 text-muted-foreground list-disc list-inside">
                    <li>Mention specific indicators (RSI, MACD, Moving Averages)</li>
                    <li>Define clear entry and exit conditions</li>
                    <li>Include risk management (stop loss, take profit)</li>
                    <li>Specify any filters or confirmations needed</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isGenerating}
          >
            Cancel
          </Button>
          <Button
            onClick={generateStrategy}
            disabled={isGenerating || !prompt.trim()}
            className="gap-2"
          >
            {isGenerating ? (
              <>
                <Lightning size={16} className="animate-pulse" />
                Generating...
              </>
            ) : (
              <>
                <Sparkle size={16} weight="fill" />
                Generate Strategy
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
