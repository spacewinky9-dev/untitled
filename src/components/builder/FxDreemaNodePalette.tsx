import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { CaretDown, CaretRight, MagnifyingGlass } from '@phosphor-icons/react'
import { NODE_DEFINITIONS, NodeDefinition, NodeCategory } from '@/constants/node-categories'
import { cn } from '@/lib/utils'

interface FxDreemaNodePaletteProps {
  onNodeAdd?: (nodeDefinition: NodeDefinition) => void
}

interface CategoryNodes {
  category: string
  label: string
  color: string
  nodes: NodeDefinition[]
}

export function FxDreemaNodePalette({ onNodeAdd }: FxDreemaNodePaletteProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())

  const onDragStart = (event: React.DragEvent, nodeDefinition: NodeDefinition) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify(nodeDefinition))
    event.dataTransfer.effectAllowed = 'move'
  }

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(category)) {
      newExpanded.delete(category)
    } else {
      newExpanded.add(category)
    }
    setExpandedCategories(newExpanded)
  }

  const categories: CategoryNodes[] = [
    {
      category: 'variables',
      label: 'Variables',
      color: '#C8A46E',
      nodes: NODE_DEFINITIONS.filter(n => 
        n.id === 'set_variable' || n.id === 'get_variable' || 
        n.id === 'global_constant' || n.id === 'global_variable'
      )
    },
    {
      category: 'condition',
      label: 'Condition & Formula',
      color: '#D9BD6A',
      nodes: NODE_DEFINITIONS.filter(n => 
        n.id === 'comparison' || n.id === 'cross' || 
        n.id === 'threshold' || n.id === 'range'
      )
    },
    {
      category: 'indicators',
      label: 'Conditions for Indicators',
      color: '#F4D88A',
      nodes: NODE_DEFINITIONS.filter(n => n.category === 'indicator')
    },
    {
      category: 'timefilters',
      label: 'Time Filters',
      color: '#C4DC96',
      nodes: NODE_DEFINITIONS.filter(n => n.id === 'time_filter')
    },
    {
      category: 'trades',
      label: 'Check Trades & Orders Count',
      color: '#D9BD6A',
      nodes: NODE_DEFINITIONS.filter(n => 
        n.id === 'trades_count' || n.id === 'trade_exists' || 
        n.id === 'pending_exists'
      )
    },
    {
      category: 'tradingconditions',
      label: 'Check Trading Conditions',
      color: '#D9BD6A',
      nodes: NODE_DEFINITIONS.filter(n => n.id === 'spread_filter')
    },
    {
      category: 'buysell',
      label: 'Buy / Sell',
      color: '#F05D5E',
      nodes: NODE_DEFINITIONS.filter(n => 
        n.id === 'buy' || n.id === 'sell' || n.id === 'close'
      )
    },
    {
      category: 'bucket',
      label: 'Bucket of Trades & Orders',
      color: '#0F52BA',
      nodes: NODE_DEFINITIONS.filter(n => 
        n.id === 'trade_group' || n.id === 'for_each_trade'
      )
    },
    {
      category: 'loop',
      label: 'Loop for Trades & Orders',
      color: '#A855F7',
      nodes: NODE_DEFINITIONS.filter(n => 
        n.id === 'for_each_trade' || n.id === 'for_each_pending' || 
        n.id === 'for_each_symbol' || n.id === 'repeat_n'
      )
    },
    {
      category: 'trailing',
      label: 'Trailing Stop / Break Even',
      color: '#D4AF37',
      nodes: NODE_DEFINITIONS.filter(n => 
        n.id === 'trailing_stop' || n.id === 'break_even' || 
        n.id === 'trailing_stop_advanced' || n.id === 'trail_group'
      )
    },
    {
      category: 'tradingactions',
      label: 'Trading Actions',
      color: '#F97316',
      nodes: NODE_DEFINITIONS.filter(n => 
        n.id === 'buy_limit' || n.id === 'sell_limit' || 
        n.id === 'buy_stop' || n.id === 'sell_stop' ||
        n.id === 'modify_pending' || n.id === 'delete_pending' ||
        n.id === 'stop-loss' || n.id === 'take-profit'
      )
    },
    {
      category: 'chartobjects',
      label: 'Chart & Objects',
      color: '#D2691E',
      nodes: NODE_DEFINITIONS.filter(n => n.category === 'graphical')
    },
    {
      category: 'loopchart',
      label: 'Loop for Chart Objects',
      color: '#F97316',
      nodes: NODE_DEFINITIONS.filter(n => n.id === 'delete_object')
    },
    {
      category: 'output',
      label: 'Output & Communication',
      color: '#8B4513',
      nodes: NODE_DEFINITIONS.filter(n => 
        n.id === 'print' || n.id === 'comment' || n.id === 'alert' ||
        n.category === 'messaging'
      )
    },
    {
      category: 'signals',
      label: 'Various Signals',
      color: '#DAA520',
      nodes: NODE_DEFINITIONS.filter(n => n.category === 'pattern')
    },
    {
      category: 'controlling',
      label: 'Controlling Blocks',
      color: '#8B4513',
      nodes: NODE_DEFINITIONS.filter(n => 
        n.id === 'if' || n.id === 'else' || n.id === 'and' || 
        n.id === 'or' || n.id === 'not' || n.id === 'xor'
      )
    },
    {
      category: 'flags',
      label: 'Flags',
      color: '#A9A9A9',
      nodes: NODE_DEFINITIONS.filter(n => 
        n.id === 'set_variable' || n.id === 'get_variable'
      )
    },
    {
      category: 'counters',
      label: 'Counters',
      color: '#B4C7A9',
      nodes: NODE_DEFINITIONS.filter(n => n.id === 'counter')
    }
  ]

  const filteredCategories = categories
    .map(cat => ({
      ...cat,
      nodes: searchQuery
        ? cat.nodes.filter(n =>
            n.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
            n.description.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : cat.nodes
    }))
    .filter(cat => cat.nodes.length > 0)

  return (
    <Card className="w-[200px] h-full border-r border-border bg-[#404040] flex flex-col">
      <div className="p-2 border-b border-border/50">
        <div className="relative mb-2">
          <MagnifyingGlass className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
          <Input
            placeholder="Search:"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-7 pl-7 text-xs bg-[#383838] border-border/50"
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-0">
          {filteredCategories.map((category) => {
            const isExpanded = expandedCategories.has(category.category)
            const visibleNodes = isExpanded ? category.nodes : category.nodes.slice(0, 5)
            const hasMore = category.nodes.length > 5

            return (
              <div key={category.category} className="border-b border-border/30">
                <button
                  onClick={() => toggleCategory(category.category)}
                  className="w-full px-2 py-1.5 flex items-center gap-1 hover:bg-white/5 transition-colors text-left"
                  style={{ backgroundColor: category.color }}
                >
                  {isExpanded ? (
                    <CaretDown size={12} weight="bold" className="flex-shrink-0" />
                  ) : (
                    <CaretRight size={12} weight="bold" className="flex-shrink-0" />
                  )}
                  <span className="text-xs font-bold text-black leading-tight">
                    {category.label}
                  </span>
                </button>

                {isExpanded && (
                  <div className="bg-[#383838]">
                    {visibleNodes.map((node) => (
                      <NodeItem
                        key={node.id}
                        node={node}
                        onDragStart={onDragStart}
                        onClick={() => onNodeAdd?.(node)}
                      />
                    ))}
                    {hasMore && (
                      <button
                        onClick={() => toggleCategory(category.category)}
                        className="w-full px-3 py-1 text-xs text-primary hover:bg-white/5"
                      >
                        Show Less...
                      </button>
                    )}
                  </div>
                )}

                {!isExpanded && hasMore && (
                  <div className="bg-[#383838] px-3 py-1">
                    <button
                      onClick={() => toggleCategory(category.category)}
                      className="text-xs text-primary hover:underline"
                    >
                      More...
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </ScrollArea>
    </Card>
  )
}

interface NodeItemProps {
  node: NodeDefinition
  onDragStart: (event: React.DragEvent, node: NodeDefinition) => void
  onClick: () => void
}

function NodeItem({ node, onDragStart, onClick }: NodeItemProps) {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, node)}
      onClick={onClick}
      className={cn(
        'group cursor-grab active:cursor-grabbing',
        'px-3 py-1.5 border-b border-border/20',
        'hover:bg-white/10 transition-colors'
      )}
    >
      <div className="text-xs text-foreground font-medium leading-tight">
        {node.label}
      </div>
    </div>
  )
}
