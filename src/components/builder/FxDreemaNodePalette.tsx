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
    
    const dragImage = document.createElement('div')
    dragImage.style.cssText = `
      position: absolute;
      top: -1000px;
      padding: 8px 12px;
      background: ${nodeDefinition.type === 'indicator' ? '#F4D88A' : '#D9BD6A'};
      border-radius: 6px;
      font-size: 13px;
      font-weight: 600;
      color: #1a1a1a;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    `
    dragImage.textContent = nodeDefinition.label
    document.body.appendChild(dragImage)
    event.dataTransfer.setDragImage(dragImage, 0, 0)
    setTimeout(() => document.body.removeChild(dragImage), 0)
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
      nodes: NODE_DEFINITIONS.filter(n => 
        n.id.includes('_filter') && (
          n.id.includes('time') || n.id.includes('month') || n.id.includes('weekday') ||
          n.id.includes('hours') || n.id.includes('minutes') || n.id.includes('seconds') ||
          n.id.includes('spread')
        ) || n.id.includes('once_') || n.id.includes('every_n')
      )
    },
    {
      category: 'trades_count',
      label: 'Check Trades & Orders Count',
      color: '#D9BD6A',
      nodes: NODE_DEFINITIONS.filter(n => 
        n.id.includes('check_trades') || n.id.includes('check_pending') ||
        n.id.includes('if_trade') || n.id.includes('if_pending') ||
        n.id.includes('no_trade') || n.id.includes('no_pending')
      )
    },
    {
      category: 'trading_conditions',
      label: 'Check Trading Conditions',
      color: '#B3D9FF',
      nodes: NODE_DEFINITIONS.filter(n => 
        n.id.includes('balance_') || n.id.includes('equity_') ||
        n.id.includes('margin_') || n.id.includes('free_margin_') ||
        n.id.includes('profit_') || n.id.includes('floating_profit_')
      )
    },
    {
      category: 'buysell',
      label: 'Buy / Sell',
      color: '#00FF00',
      nodes: NODE_DEFINITIONS.filter(n => 
        n.id.includes('buy_market') || n.id.includes('sell_market') ||
        n.id.includes('buy_limit') || n.id.includes('sell_limit') ||
        n.id.includes('buy_stop') || n.id.includes('sell_stop')
      )
    },
    {
      category: 'bucket',
      label: 'Bucket of Trades & Orders',
      color: '#6B8EFF',
      nodes: NODE_DEFINITIONS.filter(n => 
        n.id.includes('all_trades') || n.id.includes('all_buy_trades') ||
        n.id.includes('all_sell_trades') || n.id.includes('oldest_') ||
        n.id.includes('newest_') || n.id.includes('most_profitable') ||
        n.id.includes('least_profitable') || n.id.includes('all_pending') ||
        n.id.includes('all_buy_orders') || n.id.includes('all_sell_orders') ||
        n.id.includes('trades_by_magic')
      )
    },
    {
      category: 'loop',
      label: 'Loop for Trades & Orders',
      color: '#FF00FF',
      nodes: NODE_DEFINITIONS.filter(n => 
        n.id.includes('loop_') && (
          n.id.includes('trades') || n.id.includes('orders')
        )
      )
    },
    {
      category: 'trailing',
      label: 'Trailing Stop / Break Even',
      color: '#7BA5C8',
      nodes: NODE_DEFINITIONS.filter(n => 
        n.id.includes('break_even') || n.id.includes('trailing_stop') ||
        n.id.includes('trailing_money') || n.id.includes('trailing_pending')
      )
    },
    {
      category: 'trading_actions',
      label: 'Trading Actions',
      color: '#5A8FB0',
      nodes: NODE_DEFINITIONS.filter(n => 
        n.id.includes('modify_stops') || n.id.includes('close_') ||
        n.id.includes('delete_pending')
      )
    },
    {
      category: 'chart_objects',
      label: 'Chart & Objects',
      color: '#FF8C69',
      nodes: NODE_DEFINITIONS.filter(n => 
        n.id.includes('draw_') || n.id.includes('delete_chart')
      )
    },
    {
      category: 'loop_chart',
      label: 'Loop for Chart Objects',
      color: '#FF9955',
      nodes: NODE_DEFINITIONS.filter(n => 
        n.id.includes('loop_chart_') || n.id.includes('loop_all_chart') ||
        n.id.includes('loop_chart_lines') || n.id.includes('loop_chart_shapes')
      )
    },
    {
      category: 'output',
      label: 'Output & Communication',
      color: '#FFEB3B',
      nodes: NODE_DEFINITIONS.filter(n => 
        n.id.includes('send_') || n.id.includes('print_') ||
        n.id.includes('comment_') || n.id.includes('play_sound')
      )
    },
    {
      category: 'signals',
      label: 'Various Signals',
      color: '#FFD700',
      nodes: NODE_DEFINITIONS.filter(n => 
        n.id.includes('signal_')
      )
    },
    {
      category: 'controls',
      label: 'Controlling Blocks',
      color: '#E6D5B8',
      nodes: NODE_DEFINITIONS.filter(n => 
        n.id.includes('if_else') || n.id.includes('while_') ||
        n.id.includes('for_loop') || n.id.includes('break') ||
        n.id.includes('continue') || n.id.includes('wait')
      )
    },
    {
      category: 'flags',
      label: 'Flags',
      color: '#98D98E',
      nodes: NODE_DEFINITIONS.filter(n => 
        n.id.includes('flag_')
      )
    },
    {
      category: 'counters',
      label: 'Counters',
      color: '#7BC8A4',
      nodes: NODE_DEFINITIONS.filter(n => 
        n.id.includes('counter_')
      )
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
  const handleDragStart = (e: React.DragEvent) => {
    e.stopPropagation()
    onDragStart(e, node)
  }

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onClick()
  }

  return (
    <div
      draggable={true}
      onDragStart={handleDragStart}
      onClick={handleClick}
      onDragEnd={(e) => e.preventDefault()}
      className={cn(
        'group cursor-grab active:cursor-grabbing select-none',
        'px-3 py-[3px] border-b border-[#555]/20',
        'hover:bg-[#4a4a4a] transition-colors'
      )}
      style={{ WebkitUserDrag: 'element' } as React.CSSProperties}
    >
      <div className="text-[11px] text-white font-medium leading-[1.4] pointer-events-none">
        {node.label}
      </div>
    </div>
  )
}
