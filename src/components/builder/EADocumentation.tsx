import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  BookOpen,
  Cpu,
  Activity,
  FlowArrow,
  CheckCircle,
  Warning,
  Lightbulb,
  Code,
  ChartLine,
  Database,
  ShieldCheck,
  Envelope,
  FileText,
  Gear
} from '@phosphor-icons/react'

interface EACapability {
  title: string
  description: string
  icon: React.ElementType
  examples: string[]
}

const EA_CAPABILITIES: EACapability[] = [
  {
    title: 'Account Information',
    description: 'Read your account details and trading status',
    icon: Database,
    examples: [
      'Balance, Equity, Margin',
      'Leverage and Account Type',
      'Server name and Account name',
      'Free margin and margin level',
      'Current profit/loss'
    ]
  },
  {
    title: 'Communication & Alerts',
    description: 'Multiple ways to receive notifications and messages',
    icon: Envelope,
    examples: [
      'Alert message boxes',
      'Print to console (Experts/Journal)',
      'Message boxes on screen',
      'Chart comments (upper left)',
      'Play sound alerts',
      'Send email notifications',
      'Push notifications to mobile'
    ]
  },
  {
    title: 'Market Data Analysis',
    description: 'Access and analyze price data and indicators',
    icon: ChartLine,
    examples: [
      'Read OHLC (Open, High, Low, Close)',
      'Access any historical bar',
      'Read indicator values',
      'Multi-timeframe analysis',
      'Pattern detection',
      'Support/Resistance levels'
    ]
  },
  {
    title: 'File Operations',
    description: 'Store and retrieve data from files',
    icon: FileText,
    examples: [
      'Write trade logs to CSV',
      'Read configuration files',
      'Store trade history',
      'Export performance data',
      'Share data between EAs'
    ]
  },
  {
    title: 'Global Variables',
    description: 'Share data between EAs and sessions',
    icon: Database,
    examples: [
      'Store counters across restarts',
      'Share signals between EAs',
      'Track cumulative statistics',
      'Coordinate multiple EAs',
      'Persistent state management'
    ]
  },
  {
    title: 'Chart Objects',
    description: 'Create and manage visual elements on charts',
    icon: Code,
    examples: [
      'Draw arrows and lines',
      'Add text labels',
      'Create rectangles',
      'Draw Fibonacci levels',
      'Modify object properties',
      'Delete objects programmatically'
    ]
  },
  {
    title: 'Trade Management',
    description: 'Full control over orders and positions',
    icon: ShieldCheck,
    examples: [
      'Open market orders (Buy/Sell)',
      'Place pending orders',
      'Modify stop loss and take profit',
      'Close partial positions',
      'Trail stops dynamically',
      'Delete pending orders',
      'Read all trade history'
    ]
  },
  {
    title: 'Mathematical Operations',
    description: 'Perform any calculations needed',
    icon: Gear,
    examples: [
      'Position sizing calculations',
      'Risk/reward ratios',
      'Statistical analysis',
      'Custom indicators',
      'Money management formulas',
      'Performance metrics'
    ]
  }
]

interface EventInfo {
  name: string
  icon: React.ElementType
  trigger: string
  usage: string
  frequency: string
  examples: string[]
  color: string
}

const EA_EVENTS: EventInfo[] = [
  {
    name: 'OnTick',
    icon: Activity,
    trigger: 'Fired when a new tick (price change) comes',
    usage: 'Main trading logic - where most of your EA code runs',
    frequency: 'Every price update (can be hundreds per second)',
    examples: [
      'Check indicator values',
      'Evaluate entry conditions',
      'Monitor open positions',
      'Update trailing stops',
      'Execute trade signals'
    ],
    color: 'oklch(0.80 0.10 320)'
  },
  {
    name: 'OnInit',
    icon: CheckCircle,
    trigger: 'Fired once when the EA starts',
    usage: 'Initialization tasks - setup code that runs once at start',
    frequency: 'Once per EA startup',
    examples: [
      'Initialize variables',
      'Load configuration',
      'Validate settings',
      'Set up indicators',
      'Print startup message'
    ],
    color: 'oklch(0.70 0.15 210)'
  },
  {
    name: 'OnDeinit',
    icon: Warning,
    trigger: 'Fired once when the EA is stopped',
    usage: 'Cleanup tasks - runs once before EA shuts down',
    frequency: 'Once per EA shutdown',
    examples: [
      'Close open files',
      'Save state to disk',
      'Delete chart objects',
      'Print shutdown message',
      'Clean up resources'
    ],
    color: 'oklch(0.65 0.18 145)'
  },
  {
    name: 'OnTrade',
    icon: FlowArrow,
    trigger: 'Fired every time you open, close or modify trades/orders',
    usage: 'Trade event monitoring - react to trade changes',
    frequency: 'Every trade state change',
    examples: [
      'Log trade events',
      'Update statistics',
      'Notify on trade close',
      'Adjust remaining positions',
      'Update money management'
    ],
    color: 'oklch(0.60 0.12 280)'
  },
  {
    name: 'OnTimer',
    icon: Cpu,
    trigger: 'Fired on certain period of time (e.g., every 60 seconds)',
    usage: 'Time-based operations - periodic tasks',
    frequency: 'User-defined interval (e.g., every 60 seconds)',
    examples: [
      'Check session times',
      'Update hourly statistics',
      'Periodic monitoring',
      'Time-based alerts',
      'Scheduled operations'
    ],
    color: 'oklch(0.75 0.15 60)'
  },
  {
    name: 'OnChart',
    icon: ChartLine,
    trigger: 'Fired when you create, modify, delete or click objects on chart',
    usage: 'Chart interaction - respond to chart events',
    frequency: 'On chart object changes',
    examples: [
      'Handle manual line drawing',
      'React to object clicks',
      'Update visual indicators',
      'Interactive trading tools',
      'Dynamic chart updates'
    ],
    color: 'oklch(0.55 0.20 25)'
  }
]

const WORKFLOW_EXAMPLE = {
  title: 'Simple EA Example: RSI Strategy',
  description: 'A basic EA that buys when RSI is oversold and sells when overbought',
  flow: [
    { step: 1, event: 'OnTick', description: 'New price tick arrives' },
    { step: 2, check: 'No Trade', description: 'Check if we have open positions' },
    { step: 3, action: 'Buy Now', description: 'If no trades and RSI < 30, open buy order' }
  ],
  structure: 'Event (OnTick) → Checks and Calculations (No trade) → Trading Actions (Buy now)',
  visualization: 'OnTick → [No Trade?] → [RSI < 30?] → [Buy 0.01 lot]'
}

const BEST_PRACTICES = [
  {
    title: 'Always Backtest First',
    description: 'Test your EA on historical data before risking real money',
    icon: ChartLine,
    priority: 'critical'
  },
  {
    title: 'Use Demo Account',
    description: 'After backtesting, test on a live DEMO account with real market conditions',
    icon: ShieldCheck,
    priority: 'critical'
  },
  {
    title: 'Only Then Go Live',
    description: 'Only use real accounts when you\'re confident the EA works properly and safely',
    icon: Warning,
    priority: 'critical'
  },
  {
    title: 'Include Error Handling',
    description: 'Always handle errors gracefully to prevent EA crashes',
    icon: Code,
    priority: 'important'
  },
  {
    title: 'Implement Risk Management',
    description: 'Always include stop loss, position sizing, and maximum drawdown limits',
    icon: ShieldCheck,
    priority: 'critical'
  },
  {
    title: 'Test Edge Cases',
    description: 'Test what happens during high volatility, weekends, news events, etc.',
    icon: Lightbulb,
    priority: 'important'
  },
  {
    title: 'Use Magic Numbers',
    description: 'Assign unique magic numbers to identify trades from your EA',
    icon: Database,
    priority: 'important'
  },
  {
    title: 'Add Logging',
    description: 'Log important events and decisions for debugging and analysis',
    icon: FileText,
    priority: 'recommended'
  }
]

export function EADocumentation() {
  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-6 max-w-5xl mx-auto">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <BookOpen size={24} className="text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Expert Advisor (EA) Documentation</h1>
              <p className="text-muted-foreground">Complete guide to understanding and creating Expert Advisors</p>
            </div>
          </div>
        </div>

        <Separator />

        <Card>
          <CardHeader>
            <CardTitle>What is an Expert Advisor?</CardTitle>
            <CardDescription>Understanding the fundamentals</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <p className="text-sm leading-relaxed">
                An <strong>Expert Advisor (EA)</strong> is a small program that contains a set of trading instructions for MetaTrader. 
                You can also call it a <strong>Robot</strong>, because it does something instead of you. Expert Advisors can be put to 
                work in real time or they can be back-tested over past periods of time.
              </p>
              
              <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                <p className="text-sm font-semibold">Programming Language:</p>
                <ul className="text-sm space-y-1 ml-4 list-disc">
                  <li><strong>MQL4</strong> for MetaTrader 4</li>
                  <li><strong>MQL5</strong> for MetaTrader 5</li>
                </ul>
              </div>

              <div className="p-4 border-l-4 border-primary bg-primary/5 rounded">
                <p className="text-sm">
                  <strong>Important:</strong> Expert Advisors cannot work as standalone programs. To run any EA, you need MetaTrader. 
                  MetaTrader loads your EA, feeds it with data, controls its events, and executes all instructions inside.
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-semibold">File Locations:</p>
                <div className="space-y-1 text-sm font-mono bg-muted/50 p-3 rounded">
                  <div>MetaTrader 4: <span className="text-primary">%Data Folder%/MQL4/Experts/</span></div>
                  <div>MetaTrader 5: <span className="text-primary">%Data Folder%/MQL5/Experts/</span></div>
                </div>
              </div>

              <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg space-y-2">
                <p className="text-sm font-semibold flex items-center gap-2">
                  <Warning className="text-amber-500" size={20} />
                  Critical Guidelines
                </p>
                <ul className="text-sm space-y-1 ml-4 list-disc">
                  <li>You can run multiple EAs simultaneously</li>
                  <li>You can only have <strong>1 EA per chart</strong></li>
                  <li><strong className="text-amber-600">Always backtest your EAs first</strong></li>
                  <li>Test on a live DEMO account before going live</li>
                  <li>Only allow on REAL account when you're sure it's safe</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="capabilities" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="capabilities">Capabilities</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="workflow">How it Works</TabsTrigger>
            <TabsTrigger value="best-practices">Best Practices</TabsTrigger>
          </TabsList>

          <TabsContent value="capabilities" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>What Can an Expert Advisor Do?</CardTitle>
                <CardDescription>Complete list of EA capabilities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {EA_CAPABILITIES.map((capability, idx) => {
                    const Icon = capability.icon
                    return (
                      <Card key={idx}>
                        <CardHeader className="pb-3">
                          <div className="flex items-start gap-3">
                            <div className="p-2 rounded-lg bg-primary/10 mt-0.5">
                              <Icon size={20} className="text-primary" />
                            </div>
                            <div className="flex-1">
                              <CardTitle className="text-base">{capability.title}</CardTitle>
                              <CardDescription className="text-sm mt-1">{capability.description}</CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <ul className="grid grid-cols-2 gap-2 text-sm">
                            {capability.examples.map((example, i) => (
                              <li key={i} className="flex items-center gap-2">
                                <CheckCircle size={14} className="text-bullish flex-shrink-0" />
                                <span>{example}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="events" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>EA Event System</CardTitle>
                <CardDescription>
                  When an Event is detected by MetaTrader, it executes certain part of the EA code. 
                  Understanding events is crucial to EA development.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {EA_EVENTS.map((event, idx) => {
                    const Icon = event.icon
                    return (
                      <AccordionItem key={idx} value={`event-${idx}`}>
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center gap-3">
                            <div 
                              className="p-2 rounded-lg" 
                              style={{ backgroundColor: `${event.color}20` }}
                            >
                              <Icon size={20} style={{ color: event.color }} />
                            </div>
                            <div className="text-left">
                              <div className="font-semibold">{event.name}</div>
                              <div className="text-xs text-muted-foreground">{event.trigger}</div>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="space-y-3 pt-3">
                          <div className="grid gap-3">
                            <div className="p-3 bg-muted/50 rounded-lg space-y-1">
                              <div className="text-xs font-semibold text-muted-foreground">Usage</div>
                              <div className="text-sm">{event.usage}</div>
                            </div>
                            
                            <div className="p-3 bg-muted/50 rounded-lg space-y-1">
                              <div className="text-xs font-semibold text-muted-foreground">Frequency</div>
                              <div className="text-sm">{event.frequency}</div>
                            </div>

                            <div className="space-y-2">
                              <div className="text-xs font-semibold text-muted-foreground">Common Use Cases</div>
                              <ul className="space-y-1.5">
                                {event.examples.map((example, i) => (
                                  <li key={i} className="flex items-center gap-2 text-sm">
                                    <CheckCircle size={14} className="text-primary flex-shrink-0" />
                                    <span>{example}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )
                  })}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="workflow" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>How Does an Expert Advisor Work?</CardTitle>
                <CardDescription>Understanding the EA execution flow</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="text-sm font-semibold">Basic EA Flow:</div>
                  <div className="p-4 bg-primary/10 rounded-lg">
                    <div className="flex items-center justify-center gap-3 text-sm font-mono">
                      <Badge variant="outline">Event</Badge>
                      <span>→</span>
                      <Badge variant="outline">Checks & Calculations</Badge>
                      <span>→</span>
                      <Badge variant="outline">Trading Actions</Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Your EA gets data from MetaTrader, makes checks and calculations with that data, 
                    and then tells MetaTrader what trading action to make - Buy, Sell, or whatever.
                  </p>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-bullish/10">
                      <Lightbulb size={20} className="text-bullish" />
                    </div>
                    <div>
                      <div className="font-semibold">{WORKFLOW_EXAMPLE.title}</div>
                      <div className="text-sm text-muted-foreground">{WORKFLOW_EXAMPLE.description}</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="text-sm font-semibold">Flow Diagram:</div>
                    <div className="p-4 bg-muted/50 rounded-lg space-y-3">
                      {WORKFLOW_EXAMPLE.flow.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <Badge className="mt-0.5">{item.step}</Badge>
                          <div className="flex-1">
                            <div className="text-sm font-semibold">
                              {'event' in item ? item.event : 'check' in item ? item.check : item.action}
                            </div>
                            <div className="text-sm text-muted-foreground">{item.description}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg space-y-2">
                      <div className="text-sm font-semibold">Structure:</div>
                      <div className="text-sm font-mono">{WORKFLOW_EXAMPLE.structure}</div>
                    </div>

                    <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                      <div className="text-sm font-semibold">Visual Flow:</div>
                      <div className="text-sm font-mono text-center py-2">
                        {WORKFLOW_EXAMPLE.visualization}
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="text-sm font-semibold">In ForexFlow:</div>
                  <p className="text-sm text-muted-foreground">
                    ForexFlow makes this process visual and intuitive. Instead of writing code, you drag and drop nodes 
                    representing each step. Connect them with edges to define the flow. ForexFlow then generates the 
                    complete MQL4/MQL5 code for you, ready to deploy in MetaTrader.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="best-practices" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>EA Development Best Practices</CardTitle>
                <CardDescription>Essential guidelines for safe and effective EA development</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {BEST_PRACTICES.map((practice, idx) => {
                    const Icon = practice.icon
                    const priorityColors = {
                      critical: 'border-red-500/50 bg-red-500/5',
                      important: 'border-amber-500/50 bg-amber-500/5',
                      recommended: 'border-blue-500/50 bg-blue-500/5'
                    }
                    const badgeColors = {
                      critical: 'bg-red-500/20 text-red-700 border-red-500/30',
                      important: 'bg-amber-500/20 text-amber-700 border-amber-500/30',
                      recommended: 'bg-blue-500/20 text-blue-700 border-blue-500/30'
                    }
                    
                    return (
                      <div 
                        key={idx} 
                        className={`p-4 border rounded-lg ${priorityColors[practice.priority as keyof typeof priorityColors]}`}
                      >
                        <div className="flex items-start gap-3">
                          <Icon size={20} className="mt-0.5 flex-shrink-0" />
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center justify-between gap-3">
                              <div className="font-semibold">{practice.title}</div>
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${badgeColors[practice.priority as keyof typeof badgeColors]}`}
                              >
                                {practice.priority.toUpperCase()}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{practice.description}</p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <Separator className="my-6" />

                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg space-y-2">
                  <div className="flex items-center gap-2 font-semibold text-red-600">
                    <Warning size={20} />
                    Critical Warning
                  </div>
                  <p className="text-sm">
                    Never deploy an EA directly to a real trading account without thorough testing. Always follow this sequence:
                  </p>
                  <div className="flex items-center gap-2 text-sm font-mono mt-2">
                    <Badge variant="outline">1. Backtest</Badge>
                    <span>→</span>
                    <Badge variant="outline">2. Demo Account</Badge>
                    <span>→</span>
                    <Badge variant="outline">3. Real Account</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>Ready to build your first EA?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm">
              ForexFlow makes EA development visual and accessible. Start by dragging an <strong>OnTick</strong> event node 
              to your canvas, then add indicators, conditions, and actions. Connect them to define your trading logic, 
              and export to MQL4/MQL5 when ready.
            </p>
            <div className="flex items-center gap-2">
              <CheckCircle className="text-bullish" size={16} />
              <span className="text-sm">No programming knowledge required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="text-bullish" size={16} />
              <span className="text-sm">Visual node-based interface</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="text-bullish" size={16} />
              <span className="text-sm">Production-ready MQL4/MQL5 code generation</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  )
}
