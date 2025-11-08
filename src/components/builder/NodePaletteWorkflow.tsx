import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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
  CaretRight,
  Plus
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

interface NodePaletteWorkflowProps {
  onNodeAdd?: (nodeDefinition: NodeDefinition) => void
}

const INITIAL_SHOW_COUNT = 6

export function NodePaletteWorkflow({ onNodeAdd }: NodePaletteWorkflowProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [openCategories, setOpenCategories] = useState<Set<string>>(new Set(['indicator']))
  const [openSubcategories, setOpenSubcategories] = useState<Set<string>>(new Set(['moving_averages']))
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())

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

  const toggleExpanded = (key: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }
      return next
    })
  }

  const getFilteredNodes = (category: NodeCategory) => {
    const nodes = NODE_DEFINITIONS.filter(node => node.category === category)
    if (!searchQuery) return nodes
    return nodes.filter(node => 
      node.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }

  const getFilteredIndicators = (subcategory: IndicatorSubcategory) => {
    const indicators = INDICATOR_DEFINITIONS.filter(ind => ind.subcategory === subcategory)
    if (!searchQuery) return indicators
    return indicators.filter(ind => 
      ind.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ind.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }

  const getCategoryConfig = (categoryId: NodeCategory) => {
    return NODE_CATEGORIES.find(cat => cat.id === categoryId)
  }

  const renderNodeCard = (node: NodeDefinition, categoryColor: string) => {
    const Icon = iconMap[node.icon]
    return (
      <Card
        key={node.id}
        className={cn(
          "p-3 cursor-pointer hover:bg-accent/50 transition-colors border-l-4 group relative",
          "hover:shadow-md"
        )}
        style={{ borderLeftColor: categoryColor }}
        onClick={() => onNodeAdd?.(node)}
        draggable
        onDragStart={(e) => {
          e.dataTransfer.setData('application/reactflow', JSON.stringify(node))
          e.dataTransfer.effectAllowed = 'move'
        }}
      >
        <div className="flex items-start gap-2">
          {Icon && (
            <div className="p-1.5 rounded bg-card-foreground/5 shrink-0">
              <Icon size={16} weight="duotone" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm">{node.label}</div>
            <div className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
              {node.description}
            </div>
          </div>
          <Plus size={14} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
        </div>
      </Card>
    )
  }

  const renderNodeList = (nodes: NodeDefinition[], categoryKey: string, categoryColor: string) => {
    const isExpanded = expandedCategories.has(categoryKey)
    const visibleNodes = isExpanded ? nodes : nodes.slice(0, INITIAL_SHOW_COUNT)
    const hasMore = nodes.length > INITIAL_SHOW_COUNT

    return (
      <div className="space-y-2">
        {visibleNodes.map(node => renderNodeCard(node, categoryColor))}
        {hasMore && (
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-xs"
            onClick={() => toggleExpanded(categoryKey)}
          >
            {isExpanded ? 'Show Less' : `Show More (${nodes.length - INITIAL_SHOW_COUNT} more)`}
          </Button>
        )}
      </div>
    )
  }

  const sortedCategories = [...NODE_CATEGORIES].sort((a, b) => a.executionOrder - b.executionOrder)

  return (
    <div className="h-full flex flex-col bg-card border-r border-border">
      <div className="p-4 border-b border-border space-y-3">
        <div>
          <h3 className="font-semibold text-sm mb-1">Node Library</h3>
          <p className="text-xs text-muted-foreground">Drag nodes to canvas or click to add</p>
        </div>
        <div className="relative">
          <MagnifyingGlass className="absolute left-2.5 top-2.5 text-muted-foreground" size={16} />
          <Input
            placeholder="Search nodes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-sm"
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-3 space-y-2">
          {sortedCategories.map((categoryConfig) => {
            const isOpen = openCategories.has(categoryConfig.id)
            const categoryNodes = getFilteredNodes(categoryConfig.id)
            const indicatorNodes = categoryConfig.id === 'indicator' ? INDICATOR_DEFINITIONS : []

            return (
              <Collapsible
                key={categoryConfig.id}
                open={isOpen}
                onOpenChange={() => toggleCategory(categoryConfig.id)}
              >
                <Card className="overflow-hidden">
                  <CollapsibleTrigger className="w-full">
                    <div 
                      className="p-3 flex items-center justify-between hover:bg-accent/30 transition-colors border-l-4"
                      style={{ borderLeftColor: categoryConfig.color }}
                    >
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant="outline" 
                          className="text-xs font-mono w-6 h-6 flex items-center justify-center p-0"
                          style={{ 
                            borderColor: categoryConfig.color,
                            color: categoryConfig.color
                          }}
                        >
                          {categoryConfig.executionOrder}
                        </Badge>
                        <div className="text-left">
                          <div className="font-medium text-sm">{categoryConfig.label}</div>
                          <div className="text-xs text-muted-foreground">{categoryConfig.description}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {categoryConfig.id === 'indicator' ? indicatorNodes.length : categoryNodes.length}
                        </Badge>
                        {isOpen ? <CaretDown size={16} /> : <CaretRight size={16} />}
                      </div>
                    </div>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <div className="p-3 pt-0 space-y-2">
                      {categoryConfig.id === 'indicator' ? (
                        <>
                          {INDICATOR_SUBCATEGORIES.map((subcat) => {
                            const subcatNodes = getFilteredIndicators(subcat.id)
                            const isSubOpen = openSubcategories.has(subcat.id)

                            if (subcatNodes.length === 0 && searchQuery) return null

                            return (
                              <Collapsible
                                key={subcat.id}
                                open={isSubOpen}
                                onOpenChange={() => toggleSubcategory(subcat.id)}
                              >
                                <Card className="bg-muted/30">
                                  <CollapsibleTrigger className="w-full">
                                    <div className="p-2 flex items-center justify-between hover:bg-accent/20 transition-colors">
                                      <div className="text-left">
                                        <div className="font-medium text-xs">{subcat.label}</div>
                                        <div className="text-[10px] text-muted-foreground">{subcat.description}</div>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                                          {subcatNodes.length}
                                        </Badge>
                                        {isSubOpen ? <CaretDown size={14} /> : <CaretRight size={14} />}
                                      </div>
                                    </div>
                                  </CollapsibleTrigger>
                                  <CollapsibleContent>
                                    <div className="p-2 pt-0">
                                      {renderNodeList(subcatNodes, `${categoryConfig.id}-${subcat.id}`, categoryConfig.color)}
                                    </div>
                                  </CollapsibleContent>
                                </Card>
                              </Collapsible>
                            )
                          })}
                        </>
                      ) : (
                        renderNodeList(categoryNodes, categoryConfig.id, categoryConfig.color)
                      )}
                    </div>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            )
          })}
        </div>
      </ScrollArea>
    </div>
  )
}
