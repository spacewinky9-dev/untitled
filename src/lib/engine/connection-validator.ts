import { Node, Edge } from '@xyflow/react'
import { NodeCategory } from '@/constants/node-categories'

export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
  warnings: ValidationWarning[]
}

export interface ValidationError {
  id: string
  type: 'connection' | 'flow' | 'logic' | 'missing'
  message: string
  nodeIds: string[]
}

export interface ValidationWarning {
  id: string
  message: string
  nodeIds: string[]
}

export class ConnectionValidator {
  
  static validateConnection(
    sourceNode: Node,
    targetNode: Node,
    sourceHandle: string | null,
    targetHandle: string | null
  ): { valid: boolean; reason?: string } {
    
    if (!sourceNode.data || !targetNode.data) {
      return { valid: false, reason: 'Invalid node data' }
    }

    const sourceCategory = sourceNode.data.category as NodeCategory
    const targetCategory = targetNode.data.category as NodeCategory

    const validConnections: Record<NodeCategory, NodeCategory[]> = {
      'event': ['indicator', 'condition', 'logic', 'action', 'variable', 'constant', 'pass'],
      'indicator': ['condition', 'logic', 'indicator', 'variable', 'pass'],
      'condition': ['logic', 'action', 'risk', 'variable', 'pass'],
      'logic': ['logic', 'action', 'risk', 'variable', 'pass'],
      'risk': ['action', 'variable', 'pass'],
      'action': ['variable', 'messaging', 'graphical', 'pass'],
      'mtf': ['condition', 'logic', 'variable', 'pass'],
      'pattern': ['condition', 'logic', 'variable', 'pass'],
      'variable': ['condition', 'logic', 'indicator', 'action', 'risk', 'pass'],
      'advanced': ['action', 'variable', 'pass'],
      'money_management': ['action', 'variable', 'pass'],
      'graphical': ['variable', 'pass'],
      'messaging': ['variable', 'pass'],
      'file_ops': ['variable', 'condition', 'pass'],
      'terminal': ['condition', 'logic', 'variable', 'pass'],
      'custom': ['condition', 'logic', 'action', 'risk', 'variable', 'pass'],
      'constant': ['condition', 'logic', 'indicator', 'pass']
    }

    const allowedTargets = validConnections[sourceCategory] || []
    
    if (!allowedTargets.includes(targetCategory)) {
      return {
        valid: false,
        reason: `Cannot connect ${sourceCategory} to ${targetCategory}. Valid targets: ${allowedTargets.join(', ')}`
      }
    }

    const sourceType = this.getPortType(sourceNode, sourceHandle, 'output')
    const targetType = this.getPortType(targetNode, targetHandle, 'input')

    if (sourceType && targetType && sourceType !== 'any' && targetType !== 'any') {
      if (sourceType !== targetType) {
        return {
          valid: false,
          reason: `Type mismatch: ${sourceType} cannot connect to ${targetType}`
        }
      }
    }

    return { valid: true }
  }

  static getPortType(node: Node, handle: string | null, direction: 'input' | 'output'): string {
    if (!handle || !node.data) return 'any'
    
    const ports = direction === 'input' ? node.data.inputs : node.data.outputs
    if (!ports || !Array.isArray(ports)) return 'any'
    
    const port = ports.find((p: any) => p.id === handle)
    return port?.dataType || port?.type || 'any'
  }

  static validateStrategyFlow(nodes: Node[], edges: Edge[]): ValidationResult {
    const errors: ValidationError[] = []
    const warnings: ValidationWarning[] = []

    const eventNodes = nodes.filter(n => n.data?.category === 'event')
    if (eventNodes.length === 0) {
      warnings.push({
        id: 'no-event',
        message: 'No event node found. Strategy will not execute. Add an OnTick or OnInit event.',
        nodeIds: []
      })
    }

    const actionNodes = nodes.filter(n => n.data?.category === 'action')
    if (actionNodes.length === 0) {
      warnings.push({
        id: 'no-action',
        message: 'No action nodes found. Strategy will not place any trades.',
        nodeIds: []
      })
    }

    const nodeIdSet = new Set(nodes.map(n => n.id))
    edges.forEach((edge, idx) => {
      if (!nodeIdSet.has(edge.source)) {
        errors.push({
          id: `edge-invalid-source-${idx}`,
          type: 'connection',
          message: `Edge references non-existent source node: ${edge.source}`,
          nodeIds: [edge.source]
        })
      }
      if (!nodeIdSet.has(edge.target)) {
        errors.push({
          id: `edge-invalid-target-${idx}`,
          type: 'connection',
          message: `Edge references non-existent target node: ${edge.target}`,
          nodeIds: [edge.target]
        })
      }
    })

    const disconnectedNodes = nodes.filter(node => {
      if (node.data?.category === 'event') return false
      
      const hasIncoming = edges.some(e => e.target === node.id)
      const hasOutgoing = edges.some(e => e.source === node.id)
      
      return !hasIncoming && !hasOutgoing
    })

    disconnectedNodes.forEach(node => {
      warnings.push({
        id: `disconnected-${node.id}`,
        message: `Node "${node.data?.label || node.id}" is not connected`,
        nodeIds: [node.id]
      })
    })

    const cycles = this.detectCycles(nodes, edges)
    if (cycles.length > 0) {
      cycles.forEach((cycle, idx) => {
        errors.push({
          id: `cycle-${idx}`,
          type: 'flow',
          message: `Circular dependency detected: ${cycle.join(' → ')}`,
          nodeIds: cycle
        })
      })
    }

    const unreachableActions = this.findUnreachableNodes(nodes, edges, 'action')
    unreachableActions.forEach(nodeId => {
      const node = nodes.find(n => n.id === nodeId)
      errors.push({
        id: `unreachable-${nodeId}`,
        type: 'flow',
        message: `Action node "${node?.data?.label || nodeId}" is not reachable from any event`,
        nodeIds: [nodeId]
      })
    })

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    }
  }

  private static detectCycles(nodes: Node[], edges: Edge[]): string[][] {
    const graph = new Map<string, string[]>()
    nodes.forEach(node => graph.set(node.id, []))
    edges.forEach(edge => {
      const neighbors = graph.get(edge.source) || []
      neighbors.push(edge.target)
      graph.set(edge.source, neighbors)
    })

    const cycles: string[][] = []
    const visited = new Set<string>()
    const recStack = new Set<string>()
    const path: string[] = []

    const dfs = (nodeId: string): boolean => {
      visited.add(nodeId)
      recStack.add(nodeId)
      path.push(nodeId)

      const neighbors = graph.get(nodeId) || []
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          if (dfs(neighbor)) {
            return true
          }
        } else if (recStack.has(neighbor)) {
          const cycleStart = path.indexOf(neighbor)
          cycles.push([...path.slice(cycleStart), neighbor])
          return true
        }
      }

      path.pop()
      recStack.delete(nodeId)
      return false
    }

    for (const nodeId of graph.keys()) {
      if (!visited.has(nodeId)) {
        dfs(nodeId)
      }
    }

    return cycles
  }

  private static findUnreachableNodes(
    nodes: Node[],
    edges: Edge[],
    targetCategory: NodeCategory
  ): string[] {
    const eventNodes = nodes.filter(n => n.data?.category === 'event').map(n => n.id)
    if (eventNodes.length === 0) return []

    const targetNodes = nodes
      .filter(n => n.data?.category === targetCategory)
      .map(n => n.id)

    const reachable = new Set<string>()
    const queue = [...eventNodes]
    
    while (queue.length > 0) {
      const current = queue.shift()!
      if (reachable.has(current)) continue
      
      reachable.add(current)
      
      const outgoing = edges.filter(e => e.source === current)
      outgoing.forEach(edge => {
        if (!reachable.has(edge.target)) {
          queue.push(edge.target)
        }
      })
    }

    return targetNodes.filter(id => !reachable.has(id))
  }

  static suggestConnection(
    sourceNode: Node,
    allNodes: Node[],
    existingEdges: Edge[]
  ): Node[] {
    if (!sourceNode.data) return []

    const sourceCategory = sourceNode.data.category as NodeCategory
    
    const validConnections: Record<NodeCategory, NodeCategory[]> = {
      'event': ['indicator', 'condition', 'logic', 'action'],
      'indicator': ['condition', 'logic', 'indicator'],
      'condition': ['logic', 'action', 'risk'],
      'logic': ['logic', 'action', 'risk'],
      'risk': ['action'],
      'action': ['messaging', 'graphical'],
      'mtf': ['condition', 'logic'],
      'pattern': ['condition', 'logic'],
      'variable': ['condition', 'logic', 'action'],
      'advanced': ['action'],
      'money_management': ['action'],
      'graphical': [],
      'messaging': [],
      'file_ops': ['variable', 'condition'],
      'terminal': ['condition', 'logic'],
      'custom': ['condition', 'logic', 'action'],
      'constant': ['condition', 'logic', 'indicator']
    }

    const allowedCategories = validConnections[sourceCategory] || []
    
    const connectedTargets = new Set(
      existingEdges.filter(e => e.source === sourceNode.id).map(e => e.target)
    )

    const suggestions = allNodes.filter(node => {
      if (node.id === sourceNode.id) return false
      if (connectedTargets.has(node.id)) return false
      if (!node.data?.category) return false
      
      return allowedCategories.includes(node.data.category as NodeCategory)
    })

    return suggestions.sort((a, b) => {
      const categoryOrder = allowedCategories.indexOf(a.data.category as NodeCategory)
      const categoryOrderB = allowedCategories.indexOf(b.data.category as NodeCategory)
      return categoryOrder - categoryOrderB
    })
  }
}
