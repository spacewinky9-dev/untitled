import { Node, Edge } from '@xyflow/react'

export interface GroupBounds {
  minX: number
  minY: number
  maxX: number
  maxY: number
  width: number
  height: number
}

export function calculateNodesBounds(nodes: Node[]): GroupBounds {
  if (nodes.length === 0) {
    return { minX: 0, minY: 0, maxX: 0, maxY: 0, width: 0, height: 0 }
  }

  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity

  nodes.forEach((node) => {
    const nodeWidth = node.measured?.width || node.width || 200
    const nodeHeight = node.measured?.height || node.height || 100

    minX = Math.min(minX, node.position.x)
    minY = Math.min(minY, node.position.y)
    maxX = Math.max(maxX, node.position.x + nodeWidth)
    maxY = Math.max(maxY, node.position.y + nodeHeight)
  })

  return {
    minX,
    minY,
    maxX,
    maxY,
    width: maxX - minX,
    height: maxY - minY
  }
}

export function createGroupFromNodes(
  selectedNodes: Node[],
  allEdges: Edge[],
  groupName: string = 'Group',
  groupColor?: string
): {
  groupNode: Node
  updatedNodes: Node[]
  internalEdges: Edge[]
  externalEdges: Edge[]
} {
  const bounds = calculateNodesBounds(selectedNodes)
  const padding = 40
  
  const selectedNodeIds = new Set(selectedNodes.map(n => n.id))
  
  const internalEdges = allEdges.filter(
    edge => selectedNodeIds.has(edge.source) && selectedNodeIds.has(edge.target)
  )
  
  const externalEdges = allEdges.filter(
    edge => !(selectedNodeIds.has(edge.source) && selectedNodeIds.has(edge.target))
  )

  const centerX = bounds.minX + bounds.width / 2
  const centerY = bounds.minY + bounds.height / 2

  const updatedNodes = selectedNodes.map(node => ({
    ...node,
    position: {
      x: node.position.x - bounds.minX + padding,
      y: node.position.y - bounds.minY + padding
    },
    parentNode: undefined,
    extent: undefined
  }))

  const groupNode: Node = {
    id: `group-${Date.now()}`,
    type: 'group',
    position: {
      x: centerX - (bounds.width + padding * 2) / 2,
      y: centerY - (bounds.height + padding * 2) / 2
    },
    data: {
      label: groupName,
      category: 'group',
      isExpanded: true,
      childNodeIds: selectedNodes.map(n => n.id),
      internalNodes: updatedNodes,
      internalEdges: internalEdges,
      color: groupColor,
      parameters: {},
      inputs: [{
        id: 'input',
        type: 'signal',
        label: 'In'
      }],
      outputs: [{
        id: 'output',
        type: 'signal',
        label: 'Out'
      }]
    },
    style: {
      width: bounds.width + padding * 2,
      height: bounds.height + padding * 2
    }
  }

  return {
    groupNode,
    updatedNodes,
    internalEdges,
    externalEdges
  }
}

export function ungroupNodes(
  groupNode: Node,
  currentNodes: Node[],
  currentEdges: Edge[]
): {
  restoredNodes: Node[]
  restoredEdges: Edge[]
  remainingNodes: Node[]
  remainingEdges: Edge[]
} {
  const groupData = groupNode.data
  const internalNodes = groupData.internalNodes || []
  const internalEdges = groupData.internalEdges || []
  
  const groupPosition = groupNode.position
  
  const restoredNodes = internalNodes.map((node: Node) => ({
    ...node,
    position: {
      x: groupPosition.x + node.position.x,
      y: groupPosition.y + node.position.y
    },
    hidden: false
  }))

  const remainingNodes = currentNodes.filter(n => n.id !== groupNode.id)
  
  const groupConnections = currentEdges.filter(
    edge => edge.source === groupNode.id || edge.target === groupNode.id
  )
  
  const remainingEdges = currentEdges.filter(
    edge => edge.source !== groupNode.id && edge.target !== groupNode.id
  )

  const restoredEdges = [...internalEdges]

  groupConnections.forEach(conn => {
    if (conn.source === groupNode.id) {
      const firstInternalNodeId = internalNodes[0]?.id
      if (firstInternalNodeId) {
        restoredEdges.push({
          ...conn,
          id: `${firstInternalNodeId}-${conn.target}`,
          source: firstInternalNodeId
        })
      }
    }
    if (conn.target === groupNode.id) {
      const lastInternalNodeId = internalNodes[internalNodes.length - 1]?.id
      if (lastInternalNodeId) {
        restoredEdges.push({
          ...conn,
          id: `${conn.source}-${lastInternalNodeId}`,
          target: lastInternalNodeId
        })
      }
    }
  })

  return {
    restoredNodes,
    restoredEdges,
    remainingNodes,
    remainingEdges
  }
}

export function findConnectedGroups(nodeId: string, edges: Edge[]): Set<string> {
  const connectedGroups = new Set<string>()
  
  edges.forEach(edge => {
    if (edge.source === nodeId && edge.target.startsWith('group-')) {
      connectedGroups.add(edge.target)
    }
    if (edge.target === nodeId && edge.source.startsWith('group-')) {
      connectedGroups.add(edge.source)
    }
  })
  
  return connectedGroups
}

export function validateGroupCreation(
  selectedNodes: Node[],
  allEdges: Edge[]
): { valid: boolean; message?: string } {
  if (selectedNodes.length === 0) {
    return { valid: false, message: 'No nodes selected' }
  }

  if (selectedNodes.length === 1) {
    return { valid: false, message: 'Select at least 2 nodes to create a group' }
  }

  const hasGroupNode = selectedNodes.some(node => node.type === 'group')
  if (hasGroupNode) {
    return { valid: false, message: 'Cannot create nested groups' }
  }

  return { valid: true }
}

export function getGroupColor(index: number): string {
  const colors = [
    'oklch(0.60 0.20 240)',
    'oklch(0.65 0.18 160)', 
    'oklch(0.70 0.18 50)',
    'oklch(0.58 0.22 25)',
    'oklch(0.75 0.15 290)',
    'oklch(0.68 0.20 200)'
  ]
  return colors[index % colors.length]
}
