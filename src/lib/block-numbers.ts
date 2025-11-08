import { Node, Edge } from '@xyflow/react'

export interface NodeExecutionInfo {
  nodeId: string
  blockNumber: number
  executionOrder: number
  depth: number
  branch: number
  eventContext: string
}

export function calculateBlockNumbers(nodes: Node[], edges: Edge[]): Map<string, NodeExecutionInfo> {
  const executionMap = new Map<string, NodeExecutionInfo>()
  
  const eventNodes = nodes.filter(n => n.type === 'event')
  
  if (eventNodes.length === 0) {
    nodes.forEach((node, index) => {
      executionMap.set(node.id, {
        nodeId: node.id,
        blockNumber: index + 1,
        executionOrder: index,
        depth: 0,
        branch: 0,
        eventContext: 'global'
      })
    })
    return executionMap
  }

  let globalBlockNumber = 1

  eventNodes.forEach((eventNode, eventIndex) => {
    const visited = new Set<string>()
    const queue: Array<{ nodeId: string; depth: number; branch: number }> = []
    
    const outgoingEdges = edges.filter(e => e.source === eventNode.id)
    outgoingEdges.forEach((edge, branchIndex) => {
      queue.push({
        nodeId: edge.target,
        depth: 1,
        branch: branchIndex
      })
    })

    executionMap.set(eventNode.id, {
      nodeId: eventNode.id,
      blockNumber: globalBlockNumber++,
      executionOrder: eventIndex,
      depth: 0,
      branch: 0,
      eventContext: eventNode.data?.label || 'Event'
    })
    visited.add(eventNode.id)

    while (queue.length > 0) {
      const current = queue.shift()!
      
      if (visited.has(current.nodeId)) continue
      visited.add(current.nodeId)

      executionMap.set(current.nodeId, {
        nodeId: current.nodeId,
        blockNumber: globalBlockNumber++,
        executionOrder: globalBlockNumber - 1,
        depth: current.depth,
        branch: current.branch,
        eventContext: eventNode.data?.label || 'Event'
      })

      const childEdges = edges.filter(e => e.source === current.nodeId)
      childEdges.forEach((edge, idx) => {
        if (!visited.has(edge.target)) {
          queue.push({
            nodeId: edge.target,
            depth: current.depth + 1,
            branch: childEdges.length > 1 ? idx : current.branch
          })
        }
      })
    }
  })

  nodes.forEach(node => {
    if (!executionMap.has(node.id)) {
      executionMap.set(node.id, {
        nodeId: node.id,
        blockNumber: globalBlockNumber++,
        executionOrder: 9999,
        depth: 0,
        branch: 0,
        eventContext: 'disconnected'
      })
    }
  })

  return executionMap
}

export function getNodeExecutionOrder(nodes: Node[], edges: Edge[]): string[] {
  const executionMap = calculateBlockNumbers(nodes, edges)
  
  return Array.from(executionMap.entries())
    .sort((a, b) => a[1].blockNumber - b[1].blockNumber)
    .map(([nodeId]) => nodeId)
}

export function validateMultipleBranches(nodes: Node[], edges: Edge[]): { 
  isValid: boolean
  warnings: string[]
  info: string[]
} {
  const warnings: string[] = []
  const info: string[] = []
  
  const eventNodes = nodes.filter(n => n.type === 'event')
  
  eventNodes.forEach(eventNode => {
    const outgoingEdges = edges.filter(e => e.source === eventNode.id)
    
    if (outgoingEdges.length > 1) {
      info.push(
        `${eventNode.data?.label || 'Event'} has ${outgoingEdges.length} branches - each will execute independently`
      )
    }
    
    if (outgoingEdges.length === 0) {
      warnings.push(
        `${eventNode.data?.label || 'Event'} has no connected blocks - it will not execute anything`
      )
    }
  })

  const connectedNodeIds = new Set<string>()
  edges.forEach(edge => {
    connectedNodeIds.add(edge.source)
    connectedNodeIds.add(edge.target)
  })
  
  const disconnectedNodes = nodes.filter(n => 
    n.type !== 'event' && !connectedNodeIds.has(n.id)
  )
  
  if (disconnectedNodes.length > 0) {
    warnings.push(
      `${disconnectedNodes.length} block(s) are not connected and will not execute`
    )
  }

  return {
    isValid: warnings.length === 0,
    warnings,
    info
  }
}

export function findNodesByBlockNumber(blockNumber: number, executionMap: Map<string, NodeExecutionInfo>): string[] {
  return Array.from(executionMap.entries())
    .filter(([_, info]) => info.blockNumber === blockNumber)
    .map(([nodeId]) => nodeId)
}

export function getBlockNumberForNode(nodeId: string, executionMap: Map<string, NodeExecutionInfo>): number {
  return executionMap.get(nodeId)?.blockNumber || 0
}
