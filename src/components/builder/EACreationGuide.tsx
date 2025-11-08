import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { 
  Question, 
  ArrowRight, 
  CheckCircle,
  NumberCircleOne,
  NumberCircleTwo,
  NumberCircleThree,
  NumberCircleFour,
  NumberCircleFive,
  NumberCircleSix,
  LightbulbFilament
} from '@phosphor-icons/react'

const EA_CREATION_STEPS = [
  {
    number: 1,
    icon: NumberCircleOne,
    title: 'Start with OnTick Event',
    category: 'Event',
    description: 'Every EA needs an OnTick event node - this is where your strategy runs on every price change.',
    nodes: ['OnTick Event'],
    connections: 'This is your entry point. All trading logic flows from here.',
    settings: 'No configuration needed. This executes automatically on every tick.',
    color: 'oklch(0.80 0.10 320)'
  },
  {
    number: 2,
    icon: NumberCircleTwo,
    title: 'Add Technical Indicators',
    category: 'Indicators',
    description: 'Add indicators to analyze the market (MA, RSI, MACD, Bollinger Bands, etc.)',
    nodes: ['Moving Average', 'RSI', 'MACD', 'Bollinger Bands', 'Stochastic'],
    connections: 'Connect OnTick → Indicator nodes. Indicators read price data and output calculated values.',
    settings: 'Configure: Period (14, 20, 50, etc.), Applied Price (Close, Open, etc.), Timeframe',
    color: 'oklch(0.70 0.15 210)'
  },
  {
    number: 3,
    icon: NumberCircleThree,
    title: 'Create Trading Conditions',
    category: 'Conditions',
    description: 'Define when to enter trades based on indicator values (crossovers, thresholds, patterns)',
    nodes: ['Greater Than', 'Less Than', 'Crossover', 'Between Range', 'Equals'],
    connections: 'Connect Indicator output → Condition input. Conditions output true/false signals.',
    settings: 'Configure: Comparison value, Threshold levels, Signal type',
    color: 'oklch(0.65 0.18 145)'
  },
  {
    number: 4,
    icon: NumberCircleFour,
    title: 'Combine with Logic Gates',
    category: 'Logic',
    description: 'Use AND/OR/NOT gates to combine multiple conditions for complex entry rules',
    nodes: ['AND Gate', 'OR Gate', 'NOT Gate', 'XOR Gate'],
    connections: 'Connect multiple Conditions → Logic Gate → Trading Action. Combine signals intelligently.',
    settings: 'Logic gates have multiple inputs. Connect 2+ condition outputs to inputs.',
    color: 'oklch(0.60 0.12 280)'
  },
  {
    number: 5,
    icon: NumberCircleFive,
    title: 'Add Risk Management',
    category: 'Risk Management',
    description: 'Protect your capital with stop loss, take profit, and position sizing',
    nodes: ['Stop Loss', 'Take Profit', 'Position Size Calculator', 'Max Daily Loss', 'Trailing Stop'],
    connections: 'Connect Risk nodes before Trade Actions. They calculate safe position sizes and exits.',
    settings: 'Configure: Risk % per trade, R:R ratio, SL/TP pips, Max positions, Trailing distance',
    color: 'oklch(0.75 0.15 60)'
  },
  {
    number: 6,
    icon: NumberCircleSix,
    title: 'Execute Trade Actions',
    category: 'Actions',
    description: 'Final step: Open Buy/Sell orders, Close positions, or Modify trades',
    nodes: ['Open Buy', 'Open Sell', 'Close Position', 'Close All', 'Modify Order'],
    connections: 'Connect Logic/Conditions → Actions. Actions execute when conditions are true.',
    settings: 'Configure: Order type (Market/Pending), Lot size, Magic number, Slippage, Comment',
    color: 'oklch(0.55 0.20 25)'
  }
]

const EXAMPLE_STRATEGIES = [
  {
    name: 'Simple MA Crossover',
    description: 'Buy when fast MA crosses above slow MA, sell when crosses below',
    steps: [
      'OnTick Event',
      'MA(20) and MA(50)',
      'Crossover Condition',
      'Open Buy / Open Sell actions',
      'Fixed Stop Loss & Take Profit'
    ]
  },
  {
    name: 'RSI Reversal Strategy',
    description: 'Buy when RSI oversold (<30), sell when overbought (>70)',
    steps: [
      'OnTick Event',
      'RSI(14) indicator',
      'Less Than 30 / Greater Than 70',
      'AND gate with trend filter',
      'Position sizing with 2% risk',
      'Open trades with trailing stop'
    ]
  },
  {
    name: 'MACD + Stochastic Confirmation',
    description: 'Enter only when both MACD and Stochastic signal same direction',
    steps: [
      'OnTick Event',
      'MACD(12,26,9) + Stochastic(5,3,3)',
      'MACD > 0, Stochastic > 80 (for sell)',
      'AND gate to combine signals',
      'Risk manager for position size',
      'Open trades with break-even move'
    ]
  }
]

const ADVANCED_TIPS = [
  {
    title: 'Use Multiple Timeframes',
    tip: 'Add MTF nodes to check higher timeframe trend before entering on lower timeframe'
  },
  {
    title: 'Add Trade Filters',
    tip: 'Use Time Filter node to avoid trading during news or low liquidity hours'
  },
  {
    title: 'Implement Break-Even',
    tip: 'Add Trailing Stop or Break-Even node to protect profits once trade moves favorably'
  },
  {
    title: 'Variable Management',
    tip: 'Use Variable nodes to store state across ticks (counters, flags, previous values)'
  },
  {
    title: 'Pattern Recognition',
    tip: 'Add Pattern nodes to detect candlestick patterns (Doji, Engulfing, Pin Bar, etc.)'
  }
]

interface EACreationGuideProps {
  trigger?: React.ReactNode
}

export function EACreationGuide({ trigger }: EACreationGuideProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-2">
            <Question size={16} />
            How to Create EA
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <LightbulbFilament size={24} weight="duotone" className="text-accent" />
            How to Create a Full Working Expert Advisor
          </DialogTitle>
          <DialogDescription>
            Follow these steps to build a complete automated trading strategy from scratch
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[calc(90vh-120px)] pr-4">
          <div className="space-y-6">
            <Card className="p-4 bg-accent/10 border-accent">
              <div className="flex items-start gap-3">
                <CheckCircle size={20} weight="fill" className="text-accent shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold mb-1">Complete Workflow</p>
                  <p className="text-muted-foreground">
                    An EA requires nodes from multiple categories connected in logical order. 
                    Follow these 6 steps to ensure nothing is missing.
                  </p>
                </div>
              </div>
            </Card>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Step-by-Step Guide</h3>
              
              {EA_CREATION_STEPS.map((step) => {
                const Icon = step.icon
                return (
                  <Card key={step.number} className="overflow-hidden">
                    <div 
                      className="p-4 border-l-4"
                      style={{ borderLeftColor: step.color }}
                    >
                      <div className="flex items-start gap-3">
                        <Icon size={32} weight="fill" style={{ color: step.color }} className="shrink-0" />
                        <div className="flex-1 space-y-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-base">{step.title}</h4>
                              <Badge variant="outline" className="text-xs">
                                {step.category}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{step.description}</p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                            <div>
                              <div className="font-medium text-foreground mb-1">Common Nodes:</div>
                              <div className="text-muted-foreground space-y-0.5">
                                {step.nodes.map((node, i) => (
                                  <div key={i}>• {node}</div>
                                ))}
                              </div>
                            </div>
                            <div>
                              <div className="font-medium text-foreground mb-1">Connections:</div>
                              <div className="text-muted-foreground">{step.connections}</div>
                            </div>
                            <div>
                              <div className="font-medium text-foreground mb-1">Settings:</div>
                              <div className="text-muted-foreground">{step.settings}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Example Strategies</h3>
              <Accordion type="single" collapsible className="space-y-2">
                {EXAMPLE_STRATEGIES.map((strategy, idx) => (
                  <AccordionItem key={idx} value={`strategy-${idx}`} className="border rounded-lg px-4">
                    <AccordionTrigger className="text-sm font-medium hover:no-underline">
                      {strategy.name}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm">
                      <p className="text-muted-foreground mb-3">{strategy.description}</p>
                      <div className="space-y-1.5">
                        {strategy.steps.map((step, stepIdx) => (
                          <div key={stepIdx} className="flex items-center gap-2 text-xs">
                            <Badge variant="outline" className="w-5 h-5 p-0 flex items-center justify-center text-[10px]">
                              {stepIdx + 1}
                            </Badge>
                            <ArrowRight size={12} className="text-muted-foreground" />
                            <span>{step}</span>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Advanced Tips</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {ADVANCED_TIPS.map((tip, idx) => (
                  <Card key={idx} className="p-3">
                    <div className="font-medium text-sm mb-1">{tip.title}</div>
                    <div className="text-xs text-muted-foreground">{tip.tip}</div>
                  </Card>
                ))}
              </div>
            </div>

            <Card className="p-4 bg-primary/5 border-primary/20">
              <div className="text-sm">
                <p className="font-semibold mb-2">💡 Pro Tip: Test First!</p>
                <p className="text-muted-foreground">
                  After building your EA, always run a backtest before live trading. 
                  The backtest will show if your logic works correctly and reveal any missing connections or configuration errors.
                </p>
              </div>
            </Card>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
