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

      const promptText = `You are a Forex trading strategy expert. Based on the following user description, generate a complete trading strategy structure.

User Description: ${prompt}

Return a JSON object with this exact structure:
{
  "nodes": [
    {
      "id": "unique-id",
      "type": "indicator|condition|logic|action|risk",
      "position": {"x": number, "y": number},
      "data": {
        "label": "Node Label",
        "indicatorType": "optional indicator type",
        "parameters": {"key": "value"},
        "operator": "optional operator",
        "action": "optional action type"
      }
    }
  ],
  "edges": [
    {
      "id": "edge-id",
      "source": "source-node-id",
      "target": "target-node-id",
      "sourceHandle": "output-handle-id",
      "targetHandle": "input-handle-id"
    }
  ],
  "explanation": "Brief explanation of the strategy logic"
}

Important rules:
1. Create realistic technical indicator nodes (SMA, EMA, RSI, MACD, etc.)
2. Include proper condition nodes to compare indicators
3. Add logic gates (AND, OR) if multiple conditions needed
4. Include buy and sell action nodes
5. Add risk management nodes (stop loss, take profit)
6. Position nodes in a logical left-to-right flow (indicators left, conditions center, actions right)
7. Ensure all node IDs are unique
8. Create valid edges connecting nodes properly
9. Use standard parameter values

Example flow: Indicator → Condition → Logic Gate → Action`

      const result = await window.spark.llm(promptText, 'gpt-4o', true)
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
    "Create a simple moving average crossover strategy with 20 and 50 periods",
    "Build an RSI strategy that buys when oversold below 30 and sells when overbought above 70",
    "Make a MACD strategy with trend confirmation using 200 EMA",
    "Create a Bollinger Bands mean reversion strategy with RSI filter"
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
              placeholder="Example: Create a trend-following strategy using EMA crossover with RSI confirmation. Buy when 20 EMA crosses above 50 EMA and RSI is above 50. Set stop loss at 50 pips and take profit at 100 pips..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[120px] resize-none"
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
