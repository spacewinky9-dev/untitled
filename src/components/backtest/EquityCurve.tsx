import { useMemo } from 'react'
import { EquityPoint } from '@/types/backtest'
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Area, ComposedChart } from 'recharts'
import { Card } from '@/components/ui/card'

interface EquityCurveProps {
  equityCurve: EquityPoint[]
}

export function EquityCurve({ equityCurve }: EquityCurveProps) {
  const chartData = useMemo(() => {
    return equityCurve.map((point, index) => ({
      index,
      balance: point.balance,
      equity: point.equity,
      drawdown: -point.drawdown,
      time: new Date(point.time).toLocaleDateString(),
    }))
  }, [equityCurve])

  const maxDrawdown = useMemo(() => {
    return Math.max(...equityCurve.map(p => p.drawdown))
  }, [equityCurve])

  const finalBalance = equityCurve[equityCurve.length - 1]?.balance || 0

  return (
    <Card className="p-4">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Equity Curve</h3>
        <div className="flex gap-6 mt-2 text-sm">
          <div>
            <span className="text-muted-foreground">Final Balance: </span>
            <span className="font-mono font-semibold">
              ${finalBalance.toFixed(2)}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Max Drawdown: </span>
            <span className="font-mono font-semibold text-bearish">
              ${maxDrawdown.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.30 0.02 250)" />
          <XAxis 
            dataKey="index" 
            stroke="oklch(0.65 0 0)"
            tick={{ fill: 'oklch(0.65 0 0)' }}
          />
          <YAxis 
            stroke="oklch(0.65 0 0)"
            tick={{ fill: 'oklch(0.65 0 0)' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'oklch(0.20 0.02 250)',
              border: '1px solid oklch(0.30 0.02 250)',
              borderRadius: '0.5rem',
              color: 'oklch(0.95 0 0)'
            }}
            labelFormatter={(value) => `Bar ${value}`}
            formatter={(value: number) => [`$${value.toFixed(2)}`]}
          />
          <Line 
            type="monotone" 
            dataKey="balance" 
            stroke="oklch(0.70 0.15 210)" 
            strokeWidth={2}
            dot={false}
            name="Balance"
          />
          <Line 
            type="monotone" 
            dataKey="equity" 
            stroke="oklch(0.65 0.18 145)" 
            strokeWidth={2}
            dot={false}
            strokeDasharray="5 5"
            name="Equity"
          />
          <Area
            type="monotone"
            dataKey="drawdown"
            fill="oklch(0.55 0.20 25 / 0.3)"
            stroke="oklch(0.55 0.20 25)"
            strokeWidth={1}
            name="Drawdown"
          />
        </ComposedChart>
      </ResponsiveContainer>
      
      <div className="flex gap-4 mt-4 justify-center text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-[oklch(0.70_0.15_210)]" />
          <span>Balance</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-[oklch(0.65_0.18_145)] border-dashed border-t-2" />
          <span>Equity</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-3 bg-[oklch(0.55_0.20_25)] opacity-30" />
          <span>Drawdown</span>
        </div>
      </div>
    </Card>
  )
}
