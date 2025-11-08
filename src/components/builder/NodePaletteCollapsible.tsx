import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
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
  CaretRight
} from '@phosphor-icons/react'
import { 
  NODE_CATEGORIES, 
  INDICATOR_SUBCATEGORIES,
  INDICATOR_DEFINITIONS,
  NODE_DEFINITIONS,
  type NodeCategory, 
  type NodeDefinition,
  type IndicatorNodeDefinition,
  type IndicatorSubcategory
} from '@/constants/node-categories'
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

interface NodePaletteCollapsibleProps {
  onNodeAdd?: (nodeDefinition: NodeDefinition) => void
}

export function NodePaletteCollapsible({ onNodeAdd }: NodePaletteCollapsibleProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [openCategories, setOpenCategories] = useState<Set<string>>(new Set(['indicator']))
  const [openSubcategories, setOpenSubcategories] = useState<Set<string>>(new Set(['moving_averages']))

  const toggleCategory = (categoryId: string) => {
    setOpenCategories(prev => {
      const next = new Set(prev)
      if (next.has(categoryId)) {
        next.delete(categoryId)
      } else {
        next.add(categoryId)
      }
      return next
    })
  }

  const toggleSubcategory = (subcategoryId: string) => {
    setOpenSubcategories(prev => {
      const next = new Set(prev)
      if (next.has(subcategoryId)) {
        next.delete(subcategoryId)
      } else {
        next.add(subcategoryId)
      }
      return next
    })
  }

  const onDragStart = (event: React.DragEvent, nodeDefinition: NodeDefinition) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify(nodeDefinition))
    event.dataTransfer.effectAllowed = 'move'
  }

  const filterNodes = (nodes: NodeDefinition[]) => {
    if (!searchQuery) return nodes
    const query = searchQuery.toLowerCase()
    return nodes.filter(node =>
      node.label.toLowerCase().includes(query) ||
      node.description.toLowerCase().includes(query)
    )
  }

  const getIndicatorsBySubcategory = (subcategory: IndicatorSubcategory): IndicatorNodeDefinition[] => {
    return INDICATOR_DEFINITIONS.filter(ind => ind.subcategory === subcategory)
  }

  const getNonIndicatorNodes = (category: NodeCategory): NodeDefinition[] => {
    return NODE_DEFINITIONS.filter(node => node.category === category && node.type !== 'indicator')
  }

  const categoryColors: Record<NodeCategory, string> = {
    event: 'border-l-purple-500',
    indicator: 'border-l-accent',
    mtf: 'border-l-cyan-500',
    pattern: 'border-l-green-500',
    condition: 'border-l-blue-500',
    logic: 'border-l-primary',
    variable: 'border-l-orange-500',
    risk: 'border-l-yellow-500',
    advanced: 'border-l-pink-500',
    action: 'border-l-bullish'
  }

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

      <ScrollArea className="flex-1 p-2">
        <div className="space-y-2">
          {NODE_CATEGORIES.map(category => {
            const isOpen = openCategories.has(category.id)
            
            return (
              <Collapsible
                key={category.id}
                open={isOpen}
                onOpenChange={() => toggleCategory(category.id)}
              >
                <CollapsibleTrigger className="w-full">
                  <div className={cn(
                    "flex items-center justify-between p-3 rounded-lg",
                    "bg-muted/50 hover:bg-muted transition-colors",
                    "border-l-4",
                    categoryColors[category.id]
                  )}>
                    <div className="flex items-center gap-2">
                      {isOpen ? <CaretDown size={16} weight="bold" /> : <CaretRight size={16} weight="bold" />}
                      <span className="font-semibold text-sm">{category.label}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {category.id === 'indicator' 
                        ? INDICATOR_DEFINITIONS.length 
                        : getNonIndicatorNodes(category.id).length}
                    </Badge>
                  </div>
                </CollapsibleTrigger>
                
                <CollapsibleContent className="mt-1 ml-2 space-y-1">
                  {category.id === 'indicator' ? (
                    INDICATOR_SUBCATEGORIES.map(subcategory => {
                      const isSubOpen = openSubcategories.has(subcategory.id)
                      const indicators = filterNodes(getIndicatorsBySubcategory(subcategory.id))
                      
                      if (searchQuery && indicators.length === 0) return null
                      
                      return (
                        <Collapsible
                          key={subcategory.id}
                          open={isSubOpen}
                          onOpenChange={() => toggleSubcategory(subcategory.id)}
                        >
                          <CollapsibleTrigger className="w-full">
                            <div className="flex items-center gap-2 p-2 rounded hover:bg-muted/30 transition-colors">
                              {isSubOpen ? <CaretDown size={14} /> : <CaretRight size={14} />}
                              <span className="text-xs font-medium text-muted-foreground">{subcategory.label}</span>
                              <Badge variant="outline" className="text-xs ml-auto">
                                {indicators.length}
                              </Badge>
                            </div>
                          </CollapsibleTrigger>
                          
                          <CollapsibleContent className="ml-4 mt-1 space-y-1">
                            {indicators.map(node => (
                              <NodeCard
                                key={node.id}
                                node={node}
                                onDragStart={onDragStart}
                                onClick={() => onNodeAdd?.(node)}
                                categoryColor={categoryColors[category.id]}
                              />
                            ))}
                          </CollapsibleContent>
                        </Collapsible>
                      )
                    })
                  ) : (
                    <div className="space-y-1 ml-2">
                      {filterNodes(getNonIndicatorNodes(category.id)).map(node => (
                        <NodeCard
                          key={node.id}
                          node={node}
                          onDragStart={onDragStart}
                          onClick={() => onNodeAdd?.(node)}
                          categoryColor={categoryColors[category.id]}
                        />
                      ))}
                    </div>
                  )}
                </CollapsibleContent>
              </Collapsible>
            )
          })}
        </div>
      </ScrollArea>

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
  categoryColor: string
}

function NodeCard({ node, onDragStart, onClick, categoryColor }: NodeCardProps) {
  const Icon = iconMap[node.icon] || ChartLine

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, node)}
      onClick={onClick}
      className={cn(
        "group cursor-grab active:cursor-grabbing",
        "border border-border rounded-md p-2",
        "bg-card hover:bg-accent/10 transition-colors",
        "hover:border-accent"
      )}
    >
      <div className="flex items-center gap-2">
        <div className={cn(
          "p-1.5 rounded border-l-2 bg-muted/50 flex-shrink-0",
          categoryColor
        )}>
          <Icon size={14} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-xs truncate">{node.label}</h4>
          <p className="text-xs text-muted-foreground line-clamp-1">
            {node.description}
          </p>
        </div>
      </div>
    </div>
  )
}
