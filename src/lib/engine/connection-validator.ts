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
    targetHandle: string | null,
    existingEdges?: Edge[]
  ): { valid: boolean; reason?: string } {
    
    if (!sourceNode.data || !targetNode.data) {
      return { valid: false, reason: 'Invalid node data' }
    }

    // Check for self-connection
    if (sourceNode.id === targetNode.id) {
      return { valid: false, reason: 'Cannot connect a node to itself' }
    }

    // Check for circular dependencies
    if (existingEdges) {
      const wouldCreateCycle = this.wouldCreateCycle(sourceNode.id, targetNode.id, existingEdges)
      if (wouldCreateCycle) {
        return { 
          valid: false, 
          reason: 'This connection would create a circular dependency. Circular dependencies can cause infinite loops in strategy execution.' 
        }
      }
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
        reason: this.getConnectionErrorMessage(sourceCategory, targetCategory, allowedTargets)
      }
    }

    // Check data type compatibility
    const sourceType = this.getPortType(sourceNode, sourceHandle, 'output')
    const targetType = this.getPortType(targetNode, targetHandle, 'input')

    if (sourceType && targetType && sourceType !== 'any' && targetType !== 'any') {
      if (sourceType !== targetType) {
        return {
          valid: false,
          reason: `Data type mismatch: Cannot connect ${sourceType} output to ${targetType} input. ${this.getTypeConversionHint(sourceType, targetType)}`
        }
      }
    }

    // Check for duplicate connections
    if (existingEdges) {
      const duplicateConnection = existingEdges.some(
        edge => edge.source === sourceNode.id && edge.target === targetNode.id
      )
      if (duplicateConnection) {
        return {
          valid: false,
          reason: 'A connection already exists between these nodes'
        }
      }
    }

    return { valid: true }
  }

  private static wouldCreateCycle(
    sourceId: string,
    targetId: string,
    edges: Edge[]
  ): boolean {
    // Build adjacency list with the new edge included
    const graph = new Map<string, string[]>()
    
    edges.forEach(edge => {
      if (!graph.has(edge.source)) {
        graph.set(edge.source, [])
      }
      graph.get(edge.source)!.push(edge.target)
    })
    
    // Add the proposed new edge
    if (!graph.has(sourceId)) {
      graph.set(sourceId, [])
    }
    graph.get(sourceId)!.push(targetId)
    
    // Check if we can reach sourceId from targetId (which would create a cycle)
    const visited = new Set<string>()
    const queue = [targetId]
    
    while (queue.length > 0) {
      const current = queue.shift()!
      
      if (current === sourceId) {
        return true // Cycle detected
      }
      
      if (visited.has(current)) {
        continue
      }
      
      visited.add(current)
      const neighbors = graph.get(current) || []
      queue.push(...neighbors)
    }
    
    return false
  }

  private static getConnectionErrorMessage(
    sourceCategory: NodeCategory,
    targetCategory: NodeCategory,
    allowedTargets: NodeCategory[]
  ): string {
    const hints: Record<string, string> = {
      'event-action': 'Events should connect to indicators or conditions first, not directly to actions.',
      'indicator-action': 'Indicators should connect to conditions that evaluate their values before triggering actions.',
      'action-indicator': 'Actions come at the end of the flow. They cannot feed back into indicators.',
      'action-condition': 'Actions come at the end of the flow. They cannot feed back into conditions.',
      'risk-condition': 'Risk management nodes should connect to actions, not back to conditions.',
    }
    
    const key = `${sourceCategory}-${targetCategory}`
    const hint = hints[key] || ''
    
    return `Cannot connect ${sourceCategory} to ${targetCategory}. ${hint} Valid targets for ${sourceCategory}: ${allowedTargets.join(', ')}.`
  }

  private static getTypeConversionHint(sourceType: string, targetType: string): string {
    if (sourceType === 'number' && targetType === 'boolean') {
      return 'Use a condition node to convert numeric values to boolean (true/false).'
    }
    if (sourceType === 'boolean' && targetType === 'number') {
      return 'Boolean values cannot be used where numbers are expected.'
    }
    if (sourceType === 'string' && (targetType === 'number' || targetType === 'boolean')) {
      return 'String values cannot be directly used in numeric or boolean operations.'
    }
    return 'Consider adding a conversion or transformation node.'
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
