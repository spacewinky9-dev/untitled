import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartLine } from '@phosphor-icons/react'

export function BacktestView() {
  return (
    <div className="flex items-center justify-center h-full p-6">
      <Card className="max-w-md">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <ChartLine size={32} className="text-accent" />
            <CardTitle>Backtesting Engine</CardTitle>
          </div>
          <CardDescription>
            Test your strategies on historical data to validate performance before trading live.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <p>Coming in Phase 5: Backtesting System</p>
          <ul className="mt-3 space-y-1 list-disc list-inside">
            <li>Historical data replay</li>
            <li>Comprehensive metrics</li>
            <li>Equity curve visualization</li>
            <li>Trade-by-trade analysis</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
