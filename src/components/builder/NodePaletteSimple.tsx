import { useState } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { CaretDown, CaretRight } from '@phosphor-icons/react'
import { 
  NODE_CATEGORIES, 
  INDICATOR_SUBCATEGORIES,
  INDICATOR_DEFINITIONS,
  NODE_DEFINITIONS,
  type NodeCategory, 
  type NodeDefinition,
  type IndicatorSubcategory
} from '@/constants/node-categories'
import { cn } from '@/lib/utils'

interface NodePaletteSimpleProps {
  onNodeAdd?: (nodeDefinition: NodeDefinition) => void
}

const INITIAL_SHOW_COUNT = 5

export function NodePaletteSimple({ onNodeAdd }: NodePaletteSimpleProps) {
  const [openCategories, setOpenCategories] = useState<Set<string>>(new Set(['indicator']))
  const [openSubcategories, setOpenSubcategories] = useState<Set<string>>(new Set())
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

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
    setExpandedItems(prev => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }
      return next
    })
  }

  const onDragStart = (event: React.DragEvent, nodeDefinition: NodeDefinition) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify(nodeDefinition))
    event.dataTransfer.effectAllowed = 'move'
  }

  const handleNodeClick = (nodeDef: NodeDefinition) => {
    if (onNodeAdd) {
      onNodeAdd(nodeDef)
    }
  }

  const getNodesByCategory = (category: NodeCategory) => {
    return NODE_DEFINITIONS.filter(node => node.category === category)
  }

  const getIndicatorsBySubcategory = (subcategory: IndicatorSubcategory) => {
    return INDICATOR_DEFINITIONS.filter(ind => ind.subcategory === subcategory)
  }

  const getCategoryColor = (category: string) => {
    const cat = NODE_CATEGORIES.find(c => c.id === category)
    return cat?.color || '#888'
  }

  return (
    <div className="w-64 bg-[#2a2a2a] border-r border-[#404040] h-full flex flex-col">
      <div className="px-3 py-3 border-b border-[#404040]">
        <div className="text-xs font-semibold text-gray-300 uppercase tracking-wide">
          Blocks Library
        </div>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {NODE_CATEGORIES.map(category => {
            const isOpen = openCategories.has(category.id)
            const nodes = getNodesByCategory(category.id as NodeCategory)
            
            if (category.id === 'indicator') {
              return (
                <div key={category.id}>
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className="w-full flex items-center gap-2 px-2 py-1.5 text-left text-sm text-gray-200 hover:bg-[#404040] rounded transition-colors"
                  >
                    {isOpen ? <CaretDown size={14} weight="bold" /> : <CaretRight size={14} weight="bold" />}
                    <div 
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: getCategoryColor(category.id) }}
                    />
                    <span className="font-medium">{category.label}</span>
                    <span className="ml-auto text-xs text-gray-500">{INDICATOR_DEFINITIONS.length}</span>
                  </button>
                  
                  {isOpen && (
                    <div className="ml-4 mt-1 space-y-1">
                      {INDICATOR_SUBCATEGORIES.map(subcat => {
                        const isSubOpen = openSubcategories.has(subcat.id)
                        const indicators = getIndicatorsBySubcategory(subcat.id)
                        const expandKey = `indicator-${subcat.id}`
                        const isExpanded = expandedItems.has(expandKey)
                        const displayIndicators = isExpanded ? indicators : indicators.slice(0, INITIAL_SHOW_COUNT)
                        
                        return (
                          <div key={subcat.id}>
                            <button
                              onClick={() => toggleSubcategory(subcat.id)}
                              className="w-full flex items-center gap-2 px-2 py-1 text-left text-xs text-gray-300 hover:bg-[#383838] rounded transition-colors"
                            >
                              {isSubOpen ? <CaretDown size={12} weight="bold" /> : <CaretRight size={12} weight="bold" />}
                              <span>{subcat.label}</span>
                              <span className="ml-auto text-xs text-gray-600">{indicators.length}</span>
                            </button>
                            
                            {isSubOpen && (
                              <div className="ml-4 mt-1 space-y-0.5">
                                {displayIndicators.map(indicator => (
                                  <div
                                    key={indicator.id}
                                    draggable
                                    onDragStart={(e) => onDragStart(e, indicator)}
                                    onClick={() => handleNodeClick(indicator)}
                                    className="px-2 py-1.5 text-xs text-gray-200 hover:bg-[#4a4a4a] rounded cursor-move transition-colors"
                                  >
                                    {indicator.label}
                                  </div>
                                ))}
                                
                                {indicators.length > INITIAL_SHOW_COUNT && (
                                  <button
                                    onClick={() => toggleExpanded(expandKey)}
                                    className="w-full px-2 py-1 text-xs text-blue-400 hover:text-blue-300 text-left"
                                  >
                                    {isExpanded ? '− Show Less' : `+ ${indicators.length - INITIAL_SHOW_COUNT} More`}
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            }
            
            if (nodes.length === 0) return null
            
            const expandKey = `category-${category.id}`
            const isExpanded = expandedItems.has(expandKey)
            const displayNodes = isExpanded ? nodes : nodes.slice(0, INITIAL_SHOW_COUNT)
            
            return (
              <div key={category.id}>
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="w-full flex items-center gap-2 px-2 py-1.5 text-left text-sm text-gray-200 hover:bg-[#404040] rounded transition-colors"
                >
                  {isOpen ? <CaretDown size={14} weight="bold" /> : <CaretRight size={14} weight="bold" />}
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: getCategoryColor(category.id) }}
                  />
                  <span className="font-medium">{category.label}</span>
                  <span className="ml-auto text-xs text-gray-500">{nodes.length}</span>
                </button>
                
                {isOpen && (
                  <div className="ml-6 mt-1 space-y-0.5">
                    {displayNodes.map(node => (
                      <div
                        key={node.id}
                        draggable
                        onDragStart={(e) => onDragStart(e, node)}
                        onClick={() => handleNodeClick(node)}
                        className="px-2 py-1.5 text-xs text-gray-200 hover:bg-[#4a4a4a] rounded cursor-move transition-colors"
                      >
                        {node.label}
                      </div>
                    ))}
                    
                    {nodes.length > INITIAL_SHOW_COUNT && (
                      <button
                        onClick={() => toggleExpanded(expandKey)}
                        className="w-full px-2 py-1 text-xs text-blue-400 hover:text-blue-300 text-left"
                      >
                        {isExpanded ? '− Show Less' : `+ ${nodes.length - INITIAL_SHOW_COUNT} More`}
                      </button>
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
