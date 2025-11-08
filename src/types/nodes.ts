export type NodeCategory = 'indicator' | 'condition' | 'action' | 'logic' | 'risk' | 'constant'

export type PortType = 'number' | 'boolean' | 'signal'

export interface Port {
  id: string
  type: PortType
  label: string
}

export interface BaseNodeData {
  label: string
  category: NodeCategory
  parameters: Record<string, any>
  inputs: Port[]
  outputs: Port[]
}

export interface IndicatorNodeData extends BaseNodeData {
  category: 'indicator'
  indicatorType: string
  parameters: {
    period?: number
    source?: 'open' | 'high' | 'low' | 'close'
    [key: string]: any
  }
}

export interface ConditionNodeData extends BaseNodeData {
  category: 'condition'
  operator: 'gt' | 'lt' | 'eq' | 'gte' | 'lte' | 'cross_above' | 'cross_below'
}

export interface ActionNodeData extends BaseNodeData {
  category: 'action'
  action: 'buy' | 'sell' | 'close' | 'alert'
  parameters: {
    lots?: number
    stopLoss?: number
    takeProfit?: number
    message?: string
  }
}

export interface LogicNodeData extends BaseNodeData {
  category: 'logic'
  operator: 'AND' | 'OR' | 'NOT' | 'XOR'
}

export interface ConstantNodeData extends BaseNodeData {
  category: 'constant'
  value: number
}

export type NodeData = 
  | IndicatorNodeData 
  | ConditionNodeData 
  | ActionNodeData 
  | LogicNodeData 
  | ConstantNodeData
