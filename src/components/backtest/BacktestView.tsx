import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Strategy } from '@/types/strategy'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Play, Stop, ChartLine, TrendUp, TrendDown, Target, WarningCircle } from '@phosphor-icons/react'
import { useBacktest } from '@/hooks/use-backtest'
import { toast } from 'sonner'

export function BacktestView() {
  const [strategies] = useKV<Strategy[]>('strategies', [])
  const [selectedStrategyId, setSelectedStrategyId] = useState<string>('')
  const [symbol, setSymbol] = useState('EURUSD')
  const [initialBalance, setInitialBalance] = useState('10000')
  const [spread, setSpread] = useState('2')
  const [commission, setCommission] = useState('7')
  
  const { runBacktest, isRunning, progress, result, error } = useBacktest()

  const handleRunBacktest = () => {
    const strategy = strategies?.find(s => s.id === selectedStrategyId)
    if (!strategy) {
      toast.error('Please select a strategy')
      return
    }

    if (!strategy.nodes || strategy.nodes.length === 0) {
      toast.error('Strategy has no nodes')
      return
    }

    runBacktest(strategy, symbol, {
      initialBalance: parseFloat(initialBalance),
      spread: parseFloat(spread),
      commission: parseFloat(commission)
    })
  }

  return (
    <div className="h-full flex flex-col p-6 gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Backtest Engine</h1>
          <p className="text-muted-foreground">Test strategies on historical data</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Configuration</CardTitle>
            <CardDescription>Select strategy and parameters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Strategy</Label>
              <Select value={selectedStrategyId} onValueChange={setSelectedStrategyId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a strategy" />
                </SelectTrigger>
                <SelectContent>
                  {strategies && strategies.length > 0 ? (
                    strategies.map(s => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name} ({s.nodes.length} nodes)
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>
                      No strategies available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Symbol</Label>
              <Select value={symbol} onValueChange={setSymbol}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EURUSD">EUR/USD</SelectItem>
                  <SelectItem value="GBPUSD">GBP/USD</SelectItem>
                  <SelectItem value="USDJPY">USD/JPY</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Initial Balance ($)</Label>
              <Input
                type="number"
                value={initialBalance}
                onChange={(e) => setInitialBalance(e.target.value)}
                disabled={isRunning}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Spread (pips)</Label>
                <Input
                  type="number"
                  value={spread}
                  onChange={(e) => setSpread(e.target.value)}
                  disabled={isRunning}
                />
              </div>
              <div className="space-y-2">
                <Label>Commission ($)</Label>
                <Input
                  type="number"
                  value={commission}
                  onChange={(e) => setCommission(e.target.value)}
                  disabled={isRunning}
                />
              </div>
            </div>

            <Separator />

            <Button 
              onClick={handleRunBacktest} 
              disabled={isRunning || !selectedStrategyId}
              className="w-full"
            >
              {isRunning ? (
                <>
                  <Stop className="mr-2" />
                  Running...
                </>
              ) : (
                <>
                  <Play className="mr-2" />
                  Run Backtest
                </>
              )}
            </Button>

            {isRunning && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} />
              </div>
            )}

            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive rounded-md">
                <p className="text-sm text-destructive flex items-center gap-2">
                  <WarningCircle />
                  {error}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          {result ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardDescription>Total Profit</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-baseline gap-2">
                      <span className={`text-2xl font-bold font-mono ${result.metrics.totalProfit >= 0 ? 'text-bullish' : 'text-bearish'}`}>
                        ${result.metrics.totalProfit.toFixed(2)}
                      </span>
                    </div>
                    <p className={`text-sm ${result.metrics.totalReturn >= 0 ? 'text-bullish' : 'text-bearish'}`}>
                      {result.metrics.totalReturn >= 0 ? '+' : ''}{result.metrics.totalReturn.toFixed(2)}%
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardDescription>Total Trades</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold font-mono">{result.metrics.totalTrades}</div>
                    <p className="text-sm text-muted-foreground">
                      {result.metrics.winningTrades}W / {result.metrics.losingTrades}L
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardDescription>Win Rate</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold font-mono">{result.metrics.winRate.toFixed(1)}%</div>
                    <p className="text-sm text-muted-foreground">
                      PF: {result.metrics.profitFactor.toFixed(2)}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardDescription>Max Drawdown</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold font-mono text-bearish">
                      {result.metrics.maxDrawdownPercent.toFixed(2)}%
                    </div>
                    <p className="text-sm text-muted-foreground">
                      ${result.metrics.maxDrawdown.toFixed(2)}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Sharpe Ratio</p>
                      <p className="text-lg font-mono font-semibold">{result.metrics.sharpeRatio.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Sortino Ratio</p>
                      <p className="text-lg font-mono font-semibold">{result.metrics.sortinoRatio.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Profit Factor</p>
                      <p className="text-lg font-mono font-semibold">{result.metrics.profitFactor.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Expectancy</p>
                      <p className="text-lg font-mono font-semibold">${result.metrics.expectancy.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Recovery Factor</p>
                      <p className="text-lg font-mono font-semibold">{result.metrics.recoveryFactor.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Avg Win / Loss</p>
                      <p className="text-lg font-mono font-semibold">
                        ${result.metrics.avgWin.toFixed(2)} / ${result.metrics.avgLoss.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Trade History</CardTitle>
                  <CardDescription>{result.trades.length} trades executed</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[300px]">
                    <div className="space-y-2">
                      {result.trades.map((trade, idx) => (
                        <div key={trade.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                          <div className="flex items-center gap-3">
                            <Badge variant={trade.type === 'buy' ? 'default' : 'secondary'}>
                              {trade.type === 'buy' ? <TrendUp className="mr-1" /> : <TrendDown className="mr-1" />}
                              {trade.type.toUpperCase()}
                            </Badge>
                            <div>
                              <p className="text-sm font-medium">Trade #{idx + 1}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(trade.entryTime).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`text-sm font-mono font-semibold ${(trade.profit || 0) >= 0 ? 'text-bullish' : 'text-bearish'}`}>
                              {(trade.profit || 0) >= 0 ? '+' : ''}${(trade.profit || 0).toFixed(2)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {(trade.pips || 0).toFixed(1)} pips
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="flex items-center justify-center h-full">
              <CardContent className="text-center py-12">
                <ChartLine size={64} className="mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-medium mb-2">No backtest results yet</p>
                <p className="text-sm text-muted-foreground">
                  Select a strategy and click "Run Backtest" to see results
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
