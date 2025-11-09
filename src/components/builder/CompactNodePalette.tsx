import { useState } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ChevronDown, ChevronRight, MagnifyingGlass } from '@phosphor-icons/react'
import { NodeDefinition, EventCategory, NODE_DEFINITIONS } from '@/constants/node-categories'

interface CompactNodePaletteProps {
  activeEvent: EventCategory
  onDragStart: (event: React.DragEvent, nodeType: NodeDefinition) => void
}

const INITIAL_SHOW_COUNT = 6

export function CompactNodePalette({ activeEvent, onDragStart }: CompactNodePaletteProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['indicator', 'condition', 'action']))
  const [showMoreMap, setShowMoreMap] = useState<Map<string, boolean>>(new Map())

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId)
    } else {
      newExpanded.add(categoryId)
    }
    setExpandedCategories(newExpanded)
  }

  const toggleShowMore = (categoryId: string) => {
    const newMap = new Map(showMoreMap)
    newMap.set(categoryId, !newMap.get(categoryId))
    setShowMoreMap(newMap)
  }

  const filterNodes = (nodes: NodeDefinition[]) => {
    if (!searchTerm) return nodes
    return nodes.filter(node => 
      node.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      node.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }

  const categorizedNodes = NODE_DEFINITIONS.reduce((acc, node) => {
    if (activeEvent !== 'all' && node.eventContext && !node.eventContext.includes(activeEvent)) {
      return acc
    }
    
    if (!acc[node.category]) {
      acc[node.category] = []
    }
    acc[node.category].push(node)
    return acc
  }, {} as Record<string, NodeDefinition[]>)

  const categoryOrder = ['event', 'indicator', 'condition', 'logic', 'action', 'risk', 'money_management', 
    'pattern', 'mtf', 'variable', 'graphical', 'messaging', 'file_ops', 'terminal', 'advanced', 'custom']
  
  const categoryLabels: Record<string, string> = {
    event: 'Events',
    indicator: 'Indicators',
    condition: 'Conditions',
    logic: 'Logic',
    action: 'Actions',
    risk: 'Risk Management',
    money_management: 'Money Management',
    pattern: 'Patterns',
    mtf: 'Multi-Timeframe',
    variable: 'Variables',
    graphical: 'Graphical Objects',
    messaging: 'Messaging',
    file_ops: 'File Operations',
    terminal: 'Terminal',
    advanced: 'Advanced',
    custom: 'Custom Blocks'
  }

  const categoryColors: Record<string, string> = {
    event: 'bg-purple-500/20 border-purple-500',
    indicator: 'bg-accent/20 border-accent',
    condition: 'bg-bullish/20 border-bullish',
    logic: 'bg-primary/20 border-primary',
    action: 'bg-blue-500/20 border-blue-500',
    risk: 'bg-yellow-500/20 border-yellow-500',
    money_management: 'bg-green-500/20 border-green-500',
    pattern: 'bg-cyan-500/20 border-cyan-500',
    mtf: 'bg-indigo-500/20 border-indigo-500',
    variable: 'bg-orange-500/20 border-orange-500',
    graphical: 'bg-pink-500/20 border-pink-500',
    messaging: 'bg-teal-500/20 border-teal-500',
    file_ops: 'bg-amber-500/20 border-amber-500',
    terminal: 'bg-slate-500/20 border-slate-500',
    advanced: 'bg-red-500/20 border-red-500',
    custom: 'bg-violet-500/20 border-violet-500'
  }

  return (
    <div className="w-64 h-full bg-card border-r border-border flex flex-col">
      <div className="p-2 border-b border-border">
        <div className="relative">
          <MagnifyingGlass className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search blocks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 h-8 text-xs"
          />
        </div>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {categoryOrder.map(categoryId => {
            const nodes = categorizedNodes[categoryId]
            if (!nodes || nodes.length === 0) return null
            
            const filteredNodes = filterNodes(nodes)
            if (filteredNodes.length === 0) return null
            
            const isExpanded = expandedCategories.has(categoryId)
            const showMore = showMoreMap.get(categoryId) || false
            const displayNodes = showMore ? filteredNodes : filteredNodes.slice(0, INITIAL_SHOW_COUNT)
            const hasMore = filteredNodes.length > INITIAL_SHOW_COUNT

            return (
              <div key={categoryId} className="space-y-0.5">
                <button
                  onClick={() => toggleCategory(categoryId)}
                  className="w-full flex items-center gap-1.5 px-2 py-1.5 text-xs font-medium text-foreground hover:bg-accent/50 rounded transition-colors"
                >
                  {isExpanded ? (
                    <ChevronDown className="w-3 h-3" />
                  ) : (
                    <ChevronRight className="w-3 h-3" />
                  )}
                  <span className="flex-1 text-left">{categoryLabels[categoryId]}</span>
                  <span className="text-[10px] text-muted-foreground">{filteredNodes.length}</span>
                </button>
                
                {isExpanded && (
                  <div className="ml-2 space-y-0.5">
                    {displayNodes.map(node => (
                      <div
                        key={node.id}
                        draggable
                        onDragStart={(e) => onDragStart(e, node)}
                        className={`
                          px-2 py-1.5 text-[11px] rounded cursor-move
                          border border-l-2
                          ${categoryColors[categoryId]}
                          hover:bg-opacity-30 transition-all
                          flex items-center gap-1.5
                        `}
                      >
                        <span className="text-base">{node.icon}</span>
                        <span className="flex-1 truncate">{node.label}</span>
                      </div>
                    ))}
                    
                    {hasMore && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleShowMore(categoryId)}
                        className="w-full h-6 text-[10px] text-muted-foreground hover:text-foreground"
                      >
                        {showMore ? 'Show Less' : `Show ${filteredNodes.length - INITIAL_SHOW_COUNT} More...`}
                      </Button>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </ScrollArea>
    </div>
  )
}
