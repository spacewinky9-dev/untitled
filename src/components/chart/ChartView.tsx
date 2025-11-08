import { useEffect, useRef, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { TrendUp, TrendDown } from '@phosphor-icons/react'
import { OHLCV } from '@/types/market-data'
import { Trade } from '@/lib/engine/strategy-executor'

interface ChartViewProps {
  data: OHLCV[]
  trades?: Trade[]
  indicators?: {
    name: string
    data: number[]
    color: string
  }[]
  symbol?: string
}

export function ChartView({ data, trades = [], indicators = [], symbol = 'EURUSD' }: ChartViewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [timeframe, setTimeframe] = useState('H1')

  useEffect(() => {
    if (!canvasRef.current || data.length === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const width = canvas.clientWidth
    const height = 500
    
    canvas.width = width * dpr
    canvas.height = height * dpr
    ctx.scale(dpr, dpr)

    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`

    ctx.fillStyle = 'oklch(0.15 0.01 250)'
    ctx.fillRect(0, 0, width, height)

    const prices = data.flatMap(d => [d.high, d.low])
    const maxPrice = Math.max(...prices)
    const minPrice = Math.min(...prices)
    const priceRange = maxPrice - minPrice
    const padding = 40

    const chartWidth = width - padding * 2
    const chartHeight = height - padding * 2
    const barWidth = Math.max(2, chartWidth / data.length - 1)

    data.forEach((candle, i) => {
      const x = padding + (i * (chartWidth / data.length))
      const openY = padding + ((maxPrice - candle.open) / priceRange) * chartHeight
      const closeY = padding + ((maxPrice - candle.close) / priceRange) * chartHeight
      const highY = padding + ((maxPrice - candle.high) / priceRange) * chartHeight
      const lowY = padding + ((maxPrice - candle.low) / priceRange) * chartHeight

      const isGreen = candle.close >= candle.open
      ctx.strokeStyle = isGreen ? 'oklch(0.65 0.18 145)' : 'oklch(0.55 0.20 25)'
      ctx.fillStyle = isGreen ? 'oklch(0.65 0.18 145)' : 'oklch(0.55 0.20 25)'

      ctx.beginPath()
      ctx.moveTo(x + barWidth / 2, highY)
      ctx.lineTo(x + barWidth / 2, lowY)
      ctx.stroke()

      const bodyHeight = Math.abs(closeY - openY)
      const bodyY = Math.min(openY, closeY)
      ctx.fillRect(x, bodyY, barWidth, Math.max(bodyHeight, 1))
    })

    if (trades && trades.length > 0) {
      trades.forEach(trade => {
        const index = data.findIndex(d => d.time >= trade.entryTime)
        if (index === -1) return

        const x = padding + (index * (chartWidth / data.length)) + barWidth / 2
        const y = padding + ((maxPrice - trade.entryPrice) / priceRange) * chartHeight

        ctx.beginPath()
        ctx.arc(x, y, 4, 0, Math.PI * 2)
        ctx.fillStyle = trade.type === 'buy' ? 'oklch(0.65 0.18 145)' : 'oklch(0.55 0.20 25)'
        ctx.fill()
      })
    }

    ctx.strokeStyle = 'oklch(0.30 0.02 250)'
    ctx.beginPath()
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, height - padding)
    ctx.lineTo(width - padding, height - padding)
    ctx.stroke()

    ctx.fillStyle = 'oklch(0.95 0 0)'
    ctx.font = '12px Inter'
    ctx.textAlign = 'right'
    
    for (let i = 0; i <= 5; i++) {
      const priceValue = maxPrice - (priceRange * i / 5)
      const y = padding + (chartHeight * i / 5)
      ctx.fillText(priceValue.toFixed(5), padding - 10, y + 4)
    }

  }, [data, trades, indicators])

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-semibold">{symbol}</h3>
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="M1">M1</SelectItem>
              <SelectItem value="M5">M5</SelectItem>
              <SelectItem value="M15">M15</SelectItem>
              <SelectItem value="M30">M30</SelectItem>
              <SelectItem value="H1">H1</SelectItem>
              <SelectItem value="H4">H4</SelectItem>
              <SelectItem value="D1">D1</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          {trades && trades.length > 0 && (
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <TrendUp className="text-bullish" size={16} />
                <span>{trades.filter(t => t.type === 'buy').length} Buys</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendDown className="text-bearish" size={16} />
                <span>{trades.filter(t => t.type === 'sell').length} Sells</span>
              </div>
            </div>
          )}
        </div>
      </div>
      <canvas ref={canvasRef} className="w-full" />
      {indicators.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {indicators.map((indicator) => (
            <div key={indicator.name} className="flex items-center gap-2 px-3 py-1 rounded bg-card border border-border">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: indicator.color }}
              />
              <span className="text-sm">{indicator.name}</span>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
