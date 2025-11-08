import { NodeCategory } from '@/types/nodes'

export interface NodeCategoryInfo {
  id: NodeCategory
  label: string
  description: string
  color: string
}

export const NODE_CATEGORIES: NodeCategoryInfo[] = [
  {
    id: 'indicator',
    label: 'Indicators',
    description: 'Technical analysis indicators',
    color: 'oklch(0.70 0.15 210)'
  },
  {
    id: 'condition',
    label: 'Conditions',
    description: 'Comparison and evaluation nodes',
    color: 'oklch(0.65 0.18 145)'
  },
  {
    id: 'logic',
    label: 'Logic',
    description: 'Boolean logic gates',
    color: 'oklch(0.70 0.15 280)'
  },
  {
    id: 'action',
    label: 'Actions',
    description: 'Trading actions (buy, sell, close)',
    color: 'oklch(0.60 0.20 40)'
  },
  {
    id: 'risk',
    label: 'Risk Management',
    description: 'Position sizing and risk controls',
    color: 'oklch(0.55 0.20 25)'
  },
  {
    id: 'constant',
    label: 'Constants',
    description: 'Fixed values',
    color: 'oklch(0.60 0.05 250)'
  }
]

export const getCategoryColor = (category: NodeCategory): string => {
  return NODE_CATEGORIES.find(c => c.id === category)?.color || 'oklch(0.60 0.05 250)'
}
