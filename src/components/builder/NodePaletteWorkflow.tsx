import { useState, useMemo } from 'react'
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
  type IndicatorSubcategory,
  type EventCategory
} from '@/constants/node-categories'
import { CategoryTabs } from './CategoryTabs'
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
  const [activeEventCategory, setActiveEventCategory] = useState<EventCategory>('all')
  const [openCategories, setOpenCategories] = useState<Set<string>>(new Set(['event', 'indicator']))
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
    let nodes = NODE_DEFINITIONS.filter(node => node.category === category)
    
    if (activeEventCategory !== 'all') {
      nodes = nodes.filter(node => 
        !node.eventContext || node.eventContext.includes(activeEventCategory)
      )
    }
    
    if (!searchQuery) return nodes
    return nodes.filter(node => 
      node.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }

  const getFilteredIndicators = (subcategory: IndicatorSubcategory) => {
    let indicators = INDICATOR_DEFINITIONS.filter(ind => ind.subcategory === subcategory)
    
    if (activeEventCategory !== 'all') {
      indicators = indicators.filter(ind => 
        !ind.eventContext || ind.eventContext.includes(activeEventCategory)
      )
    }
    
    if (!searchQuery) return indicators
    return indicators.filter(ind => 
      ind.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ind.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }

  const nodeCounts = useMemo(() => {
    const counts: Partial<Record<EventCategory, number>> = {
      ontick: 0,
      oninit: 0,
      ontimer: 0,
      ontrade: 0,
      onchart: 0,
      ondeinit: 0,
      all: 0
    }

    const allNodes = [...NODE_DEFINITIONS, ...INDICATOR_DEFINITIONS]
    
    allNodes.forEach(node => {
      counts.all!++
      if (!node.eventContext || node.eventContext.length === 0) {
        counts.ontick!++
        counts.oninit!++
        counts.ontimer!++
        counts.ontrade!++
        counts.onchart!++
        counts.ondeinit!++
      } else {
        node.eventContext.forEach(ctx => {
          if (ctx !== 'all' && counts[ctx] !== undefined) {
            counts[ctx]!++
          }
        })
      }
    })

    return counts
  }, [])

  const getCategoryConfig = (categoryId: NodeCategory) => {
    return NODE_CATEGORIES.find(cat => cat.id === categoryId)
  }

  const renderNodeCard = (node: NodeDefinition, categoryColor: string) => {
    const Icon = iconMap[node.icon]
    return (
      <div
        key={node.id}
        className={cn(
          "px-2.5 py-2 cursor-pointer hover:bg-accent/20 transition-colors rounded group relative bg-[oklch(0.30_0.015_260)] border border-[oklch(0.38_0.015_260)]"
        )}
        onClick={() => onNodeAdd?.(node)}
        draggable
        onDragStart={(e) => {
          e.dataTransfer.setData('application/reactflow', JSON.stringify(node))
          e.dataTransfer.effectAllowed = 'move'
        }}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div 
              className="w-0.5 h-6 rounded-full shrink-0"
              style={{ backgroundColor: categoryColor }}
            />
            <div className="flex-1 min-w-0">
              <div className="font-medium text-[11px] truncate">{node.label}</div>
            </div>
          </div>
          <Plus size={14} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
        </div>
      </div>
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
    <div className="h-full w-[280px] flex flex-col bg-[oklch(0.30_0.015_260)] border-r border-border shadow-xl">
      <CategoryTabs 
        activeCategory={activeEventCategory}
        onCategoryChange={setActiveEventCategory}
        nodeCounts={nodeCounts}
      />
      
      <div className="p-3 border-b border-border space-y-2">
        <div>
          <h3 className="font-semibold text-sm mb-1">Blocks</h3>
          <p className="text-[11px] text-muted-foreground">Drag to canvas or click to add</p>
        </div>
        <div className="relative">
          <MagnifyingGlass className="absolute left-2.5 top-2.5 text-muted-foreground" size={14} />
          <Input
            placeholder="Search blocks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-9 text-xs bg-[oklch(0.28_0.015_260)] border-[oklch(0.35_0.015_260)]"
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2.5 space-y-2">
          {sortedCategories.map((categoryConfig) => {
            const isOpen = openCategories.has(categoryConfig.id)
            const categoryNodes = getFilteredNodes(categoryConfig.id)
            const indicatorNodes = categoryConfig.id === 'indicator' ? INDICATOR_DEFINITIONS : []

            if (activeEventCategory !== 'all' && categoryNodes.length === 0 && categoryConfig.id !== 'indicator') {
              return null
            }

            return (
              <Collapsible
                key={categoryConfig.id}
                open={isOpen}
                onOpenChange={() => toggleCategory(categoryConfig.id)}
              >
                <Card className="overflow-hidden bg-[oklch(0.32_0.015_260)] border-[oklch(0.38_0.015_260)]">
                  <CollapsibleTrigger className="w-full">
                    <div 
                      className="p-2.5 flex items-center justify-between hover:bg-accent/10 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-1 h-8 rounded-full"
                          style={{ backgroundColor: categoryConfig.color }}
                        />
                        <div className="text-left">
                          <div className="font-semibold text-xs">{categoryConfig.label}</div>
                          <div className="text-[10px] text-muted-foreground">{categoryConfig.description}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-[10px] h-5 px-1.5 bg-[oklch(0.28_0.015_260)]">
                          {categoryConfig.id === 'indicator' ? indicatorNodes.length : categoryNodes.length}
                        </Badge>
                        {isOpen ? <CaretDown size={14} /> : <CaretRight size={14} />}
                      </div>
                    </div>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <div className="p-2 pt-0 space-y-1.5">
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
                                <Card className="bg-[oklch(0.28_0.015_260)] border-[oklch(0.35_0.015_260)]">
                                  <CollapsibleTrigger className="w-full">
                                    <div className="p-2 flex items-center justify-between hover:bg-accent/10 transition-colors">
                                      <div className="text-left">
                                        <div className="font-medium text-[11px]">{subcat.label}</div>
                                        <div className="text-[9px] text-muted-foreground">{subcat.description}</div>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Badge variant="secondary" className="text-[9px] px-1 py-0 h-4 bg-[oklch(0.25_0.015_260)]">
                                          {subcatNodes.length}
                                        </Badge>
                                        {isSubOpen ? <CaretDown size={12} /> : <CaretRight size={12} />}
                                      </div>
                                    </div>
                                  </CollapsibleTrigger>
                                  <CollapsibleContent>
                                    <div className="p-1.5 pt-0">
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
