import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import {
  MagnifyingGlass,
  ChartLine,
  ChartLineUp,
  Waveform,
  Activity,
  Equals,
  ArrowsLeftRight,
  LineSegment,
  CirclesThree,
  ProhibitInset,
  TrendUp,
  TrendDown,
  X,
  BellRinging,
  Percent,
  WarningOctagon,
  Target,
  ShieldCheck
} from '@phosphor-icons/react'
import { NODE_CATEGORIES, getNodesByCategory, type NodeCategory, type NodeDefinition } from '@/constants/node-categories'
import { cn } from '@/lib/utils'

const iconMap: Record<string, any> = {
  ChartLine,
  ChartLineUp,
  Waveform,
  Activity,
  Equals,
  ArrowsLeftRight,
  LineSegment,
  CirclesThree,
  ProhibitInset,
  TrendUp,
  TrendDown,
  X,
  BellRinging,
  Percent,
  WarningOctagon,
  Target,
  ShieldCheck
}

interface NodePaletteProps {
  onNodeAdd?: (nodeDefinition: NodeDefinition) => void
}

export function NodePalette({ onNodeAdd }: NodePaletteProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<NodeCategory>('indicator')

  const onDragStart = (event: React.DragEvent, nodeDefinition: NodeDefinition) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify(nodeDefinition))
    event.dataTransfer.effectAllowed = 'move'
  }

  const filteredNodes = getNodesByCategory(activeCategory).filter(node =>
    node.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    node.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Card className="w-80 h-full border-border bg-card flex flex-col">
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold text-lg mb-3">Node Library</h3>
        <div className="relative">
          <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <Input
            placeholder="Search nodes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs value={activeCategory} onValueChange={(v) => setActiveCategory(v as NodeCategory)} className="flex-1 flex flex-col">
        <div className="border-b border-border px-2 pt-2">
          <TabsList className="w-full grid grid-cols-5 h-auto gap-1 bg-transparent p-0">
            {NODE_CATEGORIES.map(category => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="text-xs px-2 py-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                {category.label === 'Risk Management' ? 'Risk' : category.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <ScrollArea className="flex-1">
          {NODE_CATEGORIES.map(category => (
            <TabsContent key={category.id} value={category.id} className="mt-0 p-4 space-y-2">
              <div className="mb-4">
                <p className="text-sm text-muted-foreground">{category.description}</p>
              </div>
              
              {filteredNodes.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  No nodes found
                </div>
              ) : (
                filteredNodes.map(node => (
                  <NodeCard
                    key={node.id}
                    node={node}
                    onDragStart={onDragStart}
                    onClick={() => onNodeAdd?.(node)}
                  />
                ))
              )}
            </TabsContent>
          ))}
        </ScrollArea>
      </Tabs>

      <div className="p-3 border-t border-border bg-muted/30 text-xs text-muted-foreground">
        <p>Drag nodes to canvas or click to add at center</p>
      </div>
    </Card>
  )
}

interface NodeCardProps {
  node: NodeDefinition
  onDragStart: (event: React.DragEvent, node: NodeDefinition) => void
  onClick: () => void
}

function NodeCard({ node, onDragStart, onClick }: NodeCardProps) {
  const Icon = iconMap[node.icon] || ChartLine

  const categoryColors: Record<NodeCategory, string> = {
    indicator: 'bg-accent/20 border-accent text-accent-foreground',
    condition: 'bg-blue-500/20 border-blue-500 text-blue-400',
    logic: 'bg-purple-500/20 border-purple-500 text-purple-400',
    action: 'bg-bullish/20 border-bullish text-bullish',
    risk: 'bg-yellow-500/20 border-yellow-500 text-yellow-400'
  }

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, node)}
      onClick={onClick}
      className={cn(
        "group cursor-grab active:cursor-grabbing",
        "border-2 border-border rounded-lg p-3",
        "bg-card hover:bg-card/80 transition-colors",
        "hover:border-accent hover:shadow-lg hover:shadow-accent/10"
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn(
          "p-2 rounded-md border-l-4 flex-shrink-0",
          categoryColors[node.category]
        )}>
          <Icon size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium text-sm">{node.label}</h4>
            <Badge variant="outline" className="text-xs px-1.5 py-0">
              {node.type}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2">
            {node.description}
          </p>
        </div>
      </div>
    </div>
  )
}
