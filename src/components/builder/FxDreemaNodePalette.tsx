import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { MagnifyingGlass } from '@phosphor-icons/react'
import { NODE_DEFINITIONS, NodeDefinition } from '@/constants/node-categories'
import { cn } from '@/lib/utils'

interface FxDreemaNodePaletteProps {
  onNodeAdd?: (nodeDefinition: NodeDefinition) => void
}

interface CategoryNodes {
  category: string
  label: string
  color: string
  nodes: NodeDefinition[]
  collapsed?: boolean
}

export function FxDreemaNodePalette({ onNodeAdd }: FxDreemaNodePaletteProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['variables']))

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
      category: 'constants',
      label: 'Constants (Inputs)',
      color: '#C8A46E',
      nodes: NODE_DEFINITIONS.filter(n => n.id === 'global_constant')
    },
    {
      category: 'variables',
      label: 'Variables',
      color: '#8B7355',
      nodes: NODE_DEFINITIONS.filter(n => 
        n.id === 'set_variable' || n.id === 'get_variable' || 
        n.id === 'global_variable' || n.id === 'array'
      )
    },
    {
      category: 'condition_formula',
      label: 'Condition & Formula',
      color: '#D9BD6A',
      nodes: NODE_DEFINITIONS.filter(n => 
        ['comparison', 'cross', 'threshold', 'range', 'pattern'].includes(n.id) ||
        ['math_add', 'math_subtract', 'math_multiply', 'math_divide', 'math_power', 
         'math_sqrt', 'math_abs', 'math_min', 'math_max', 'math_modulus'].includes(n.id)
      )
    },
    {
      category: 'indicators',
      label: 'Conditions for Indicators',
      color: '#F4D88A',
      nodes: NODE_DEFINITIONS.filter(n => 
        n.id.includes('indicator_') || 
        n.id.includes('price_above_indicator') ||
        n.id.includes('price_below_indicator') ||
        n.id.includes('two_indicators_cross')
      )
    },
    {
      category: 'timefilters',
      label: 'Time Filters',
      color: '#C4DC96',
      nodes: NODE_DEFINITIONS.filter(n => n.id === 'time_filter')
    },
    {
      category: 'trades_count',
      label: 'Check Trades & Orders Count',
      color: '#D9BD6A',
      nodes: NODE_DEFINITIONS.filter(n => 
        ['trades_count', 'trade_exists', 'pending_exists'].includes(n.id)
      )
    },
    {
      category: 'trading_conditions',
      label: 'Check Trading Conditions',
      color: '#D9BD6A',
      nodes: NODE_DEFINITIONS.filter(n => ['spread_filter', 'dynamic_value_check'].includes(n.id))
    },
    {
      category: 'buysell',
      label: 'Buy / Sell',
      color: '#E74C3C',
      nodes: NODE_DEFINITIONS.filter(n => ['buy', 'sell', 'close'].includes(n.id))
    },
    {
      category: 'bucket',
      label: 'Bucket of Trades & Orders',
      color: '#5DADE2',
      nodes: NODE_DEFINITIONS.filter(n => ['trade_group', 'for_each_trade'].includes(n.id))
    },
    {
      category: 'loop',
      label: 'Loop for Trades & Orders',
      color: '#BB8FCE',
      nodes: NODE_DEFINITIONS.filter(n => 
        ['for_each_trade', 'for_each_pending', 'for_each_symbol', 'repeat_n'].includes(n.id)
      )
    },
    {
      category: 'trailing',
      label: 'Trailing Stop / Break Even',
      color: '#D4AC6E',
      nodes: NODE_DEFINITIONS.filter(n => 
        ['trailing_stop', 'break_even', 'trailing_stop_advanced', 'trail_group'].includes(n.id)
      )
    },
    {
      category: 'trading_actions',
      label: 'Trading Actions',
      color: '#F39C12',
      nodes: NODE_DEFINITIONS.filter(n => 
        ['buy_limit', 'sell_limit', 'buy_stop', 'sell_stop', 'modify_pending', 
         'delete_pending', 'stop-loss', 'take-profit', 'position-size', 'trailing-stop'].includes(n.id)
      )
    },
    {
      category: 'chart_objects',
      label: 'Chart & Objects',
      color: '#CD853F',
      nodes: NODE_DEFINITIONS.filter(n => n.category === 'graphical')
    },
    {
      category: 'loop_chart',
      label: 'Loop for Chart Objects',
      color: '#E67E22',
      nodes: NODE_DEFINITIONS.filter(n => n.id === 'delete_object')
    },
    {
      category: 'output',
      label: 'Output & Communication',
      color: '#8B6914',
      nodes: NODE_DEFINITIONS.filter(n => 
        ['print', 'comment', 'alert'].includes(n.id) || n.category === 'messaging'
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
      color: '#8B7355',
      nodes: NODE_DEFINITIONS.filter(n => 
        ['if', 'else', 'and', 'or', 'not', 'xor', 'pass'].includes(n.id)
      )
    },
    {
      category: 'flags',
      label: 'Flags',
      color: '#A9A9A9',
      nodes: NODE_DEFINITIONS.filter(n => ['set_variable', 'get_variable'].includes(n.id))
    },
    {
      category: 'counters',
      label: 'Counters',
      color: '#B4C7A9',
      nodes: NODE_DEFINITIONS.filter(n => n.id === 'counter')
    },
    {
      category: 'more',
      label: 'More...',
      color: '#7F8C8D',
      nodes: NODE_DEFINITIONS.filter(n => 
        n.category === 'money_management' || n.category === 'file_ops' || 
        n.category === 'terminal' || n.category === 'custom' ||
        ['account_balance', 'account_equity', 'account_margin', 'account_profit',
         'symbol_bid', 'symbol_ask', 'symbol_spread'].includes(n.id)
      )
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
    <Card className="w-[200px] h-full border-r border-[#555] bg-[#404040] flex flex-col shadow-none rounded-none">
      <div className="p-2 border-b border-[#555]">
        <div className="relative">
          <MagnifyingGlass className="absolute left-2 top-1/2 -translate-y-1/2 text-[#999]" size={14} weight="bold" />
          <Input
            placeholder="Search:"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-6 pl-7 text-[11px] bg-[#383838] border-[#555] text-white placeholder:text-[#999] rounded-sm"
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-0">
          {filteredCategories.map((category) => {
            const isExpanded = expandedCategories.has(category.category)

            return (
              <div key={category.category} className="border-b border-[#555]/50">
                <button
                  onClick={() => toggleCategory(category.category)}
                  className="w-full px-2 py-[3px] flex items-start gap-1 hover:brightness-110 transition-all text-left"
                  style={{ backgroundColor: category.color }}
                >
                  <span className="text-[11px] font-bold text-black leading-[1.3] mt-[1px]">
                    {!isExpanded ? '▶' : '▼'} {category.label}
                  </span>
                </button>

                {isExpanded && (
                  <div className="bg-[#383838]">
                    {category.nodes.map((node) => (
                      <NodeItem
                        key={node.id}
                        node={node}
                        onDragStart={onDragStart}
                        onClick={() => onNodeAdd?.(node)}
                      />
                    ))}
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
        'px-3 py-[3px] border-b border-[#555]/20',
        'hover:bg-[#4a4a4a] transition-colors'
      )}
    >
      <div className="text-[11px] text-white font-normal leading-[1.4]">
        {node.label}
      </div>
    </div>
  )
}
