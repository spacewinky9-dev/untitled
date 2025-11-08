import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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
  ShieldCheck,
  CaretDown,
  CaretUp
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

const INITIAL_NODES_SHOWN = 6

export function NodePalette({ onNodeAdd }: NodePaletteProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedCategories, setExpandedCategories] = useState<Set<NodeCategory>>(
    new Set(['indicator'])
  )
  const [showAllInCategory, setShowAllInCategory] = useState<Set<NodeCategory>>(new Set())

  const onDragStart = (event: React.DragEvent, nodeDefinition: NodeDefinition) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify(nodeDefinition))
    event.dataTransfer.effectAllowed = 'move'
  }

  const toggleCategory = (category: NodeCategory) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(category)) {
      newExpanded.delete(category)
    } else {
      newExpanded.add(category)
    }
    setExpandedCategories(newExpanded)
  }

  const toggleShowAll = (category: NodeCategory) => {
    const newShowAll = new Set(showAllInCategory)
    if (newShowAll.has(category)) {
      newShowAll.delete(category)
    } else {
      newShowAll.add(category)
    }
    setShowAllInCategory(newShowAll)
  }

  const getWorkflowOrder = (category: NodeCategory): number => {
    const order: Record<NodeCategory, number> = {
      event: 0,
      indicator: 1,
      mtf: 2,
      pattern: 3,
      condition: 4,
      logic: 5,
      variable: 6,
      risk: 7,
      advanced: 8,
      action: 9
    }
    return order[category]
  }

  const sortedCategories = [...NODE_CATEGORIES].sort(
    (a, b) => getWorkflowOrder(a.id) - getWorkflowOrder(b.id)
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

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {sortedCategories.map((category) => {
            const allNodes = getNodesByCategory(category.id)
            const filteredNodes = searchQuery
              ? allNodes.filter(
                  (node) =>
                    node.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    node.description.toLowerCase().includes(searchQuery.toLowerCase())
                )
              : allNodes

            const isExpanded = expandedCategories.has(category.id)
            const showAll = showAllInCategory.has(category.id)
            const visibleNodes = showAll || searchQuery
              ? filteredNodes
              : filteredNodes.slice(0, INITIAL_NODES_SHOWN)
            const hasMore = filteredNodes.length > INITIAL_NODES_SHOWN

            if (searchQuery && filteredNodes.length === 0) return null

            return (
              <CategorySection
                key={category.id}
                category={category}
                nodes={visibleNodes}
                isExpanded={isExpanded}
                hasMore={hasMore && !showAll && !searchQuery}
                showAll={showAll}
                workflowOrder={getWorkflowOrder(category.id)}
                onToggle={() => toggleCategory(category.id)}
                onShowMore={() => toggleShowAll(category.id)}
                onDragStart={onDragStart}
                onNodeAdd={onNodeAdd}
              />
            )
          })}
        </div>
      </ScrollArea>

      <div className="p-3 border-t border-border bg-muted/30">
        <p className="text-xs text-muted-foreground mb-2">
          Drag nodes to canvas or click to add
        </p>
        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-sm bg-accent/30 border-l-2 border-accent" />
            <span className="text-muted-foreground">Step 1</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-sm bg-blue-500/30 border-l-2 border-blue-500" />
            <span className="text-muted-foreground">Step 2</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-sm bg-bullish/30 border-l-2 border-bullish" />
            <span className="text-muted-foreground">Step 5</span>
          </div>
        </div>
      </div>
    </Card>
  )
}

interface CategorySectionProps {
  category: { id: NodeCategory; label: string; description: string }
  nodes: NodeDefinition[]
  isExpanded: boolean
  hasMore: boolean
  showAll: boolean
  workflowOrder: number
  onToggle: () => void
  onShowMore: () => void
  onDragStart: (event: React.DragEvent, node: NodeDefinition) => void
  onNodeAdd?: (node: NodeDefinition) => void
}

function CategorySection({
  category,
  nodes,
  isExpanded,
  hasMore,
  showAll,
  workflowOrder,
  onToggle,
  onShowMore,
  onDragStart,
  onNodeAdd
}: CategorySectionProps) {
  const categoryColors: Record<NodeCategory, string> = {
    event: 'border-purple-500 bg-purple-500/10',
    indicator: 'border-accent bg-accent/10',
    mtf: 'border-cyan-500 bg-cyan-500/10',
    pattern: 'border-green-500 bg-green-500/10',
    condition: 'border-blue-500 bg-blue-500/10',
    logic: 'border-primary bg-primary/10',
    variable: 'border-orange-500 bg-orange-500/10',
    risk: 'border-yellow-500 bg-yellow-500/10',
    advanced: 'border-pink-500 bg-pink-500/10',
    action: 'border-bullish bg-bullish/10'
  }

  const workflowBadgeColors: Record<number, string> = {
    1: 'bg-accent text-accent-foreground',
    2: 'bg-blue-500 text-white',
    3: 'bg-purple-500 text-white',
    4: 'bg-yellow-500 text-black',
    5: 'bg-bullish text-black'
  }

  return (
    <div className={cn('border-2 rounded-lg overflow-hidden', categoryColors[category.id])}>
      <button
        onClick={onToggle}
        className="w-full p-3 flex items-center justify-between hover:bg-card/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Badge className={cn('text-xs font-bold', workflowBadgeColors[workflowOrder])}>
            {workflowOrder}
          </Badge>
          <div className="text-left">
            <h4 className="font-semibold text-sm">{category.label}</h4>
            <p className="text-xs text-muted-foreground">{nodes.length} nodes</p>
          </div>
        </div>
        {isExpanded ? <CaretUp size={16} /> : <CaretDown size={16} />}
      </button>

      {isExpanded && (
        <div className="p-3 pt-0 space-y-2">
          {nodes.map((node) => (
            <NodeCard
              key={node.id}
              node={node}
              onDragStart={onDragStart}
              onClick={() => onNodeAdd?.(node)}
            />
          ))}
          {hasMore && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onShowMore}
              className="w-full text-xs"
            >
              {showAll ? 'Show Less' : 'Show More'}
            </Button>
          )}
        </div>
      )}
    </div>
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
    event: 'bg-purple-500/20 border-purple-500 text-purple-400',
    indicator: 'bg-accent/20 border-accent text-accent',
    mtf: 'bg-cyan-500/20 border-cyan-500 text-cyan-400',
    pattern: 'bg-green-500/20 border-green-500 text-green-400',
    condition: 'bg-blue-500/20 border-blue-500 text-blue-400',
    logic: 'bg-primary/20 border-primary text-primary',
    variable: 'bg-orange-500/20 border-orange-500 text-orange-400',
    risk: 'bg-yellow-500/20 border-yellow-500 text-yellow-400',
    advanced: 'bg-pink-500/20 border-pink-500 text-pink-400',
    action: 'bg-bullish/20 border-bullish text-bullish'
  }

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, node)}
      onClick={onClick}
      className={cn(
        'group cursor-grab active:cursor-grabbing',
        'border-2 border-border rounded-lg p-2.5',
        'bg-card hover:bg-card/80 transition-colors',
        'hover:border-primary hover:shadow-md'
      )}
    >
      <div className="flex items-start gap-2.5">
        <div className={cn('p-1.5 rounded-md border-l-4 flex-shrink-0', categoryColors[node.category])}>
          <Icon size={18} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm mb-0.5">{node.label}</h4>
          <p className="text-xs text-muted-foreground line-clamp-2">{node.description}</p>
        </div>
      </div>
    </div>
  )
}
