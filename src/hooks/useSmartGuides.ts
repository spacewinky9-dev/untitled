import { useState, useCallback } from 'react'
import { Node } from '@xyflow/react'

export interface Guide {
  type: 'vertical' | 'horizontal'
  position: number
  nodes: string[]
}

export interface SmartGuidesSettings {
  enabled: boolean
  snapToGrid: boolean
  gridSize: number
  snapDistance: number
}

export function useSmartGuides(settings: SmartGuidesSettings) {
  const [guides, setGuides] = useState<Guide[]>([])

  const calculateGuides = useCallback((
    draggingNode: Node,
    allNodes: Node[]
  ): Guide[] => {
    if (!settings.enabled) return []

    const newGuides: Guide[] = []
    const SNAP_THRESHOLD = settings.snapDistance

    allNodes.forEach(node => {
      if (node.id === draggingNode.id) return

      const nodeWidth = node.width || 200
      const nodeHeight = node.height || 100
      const draggingWidth = draggingNode.width || 200
      const draggingHeight = draggingNode.height || 100

      // Vertical alignment guides
      // Left edges align
      if (Math.abs(node.position.x - draggingNode.position.x) < SNAP_THRESHOLD) {
        newGuides.push({
          type: 'vertical',
          position: node.position.x,
          nodes: [node.id, draggingNode.id]
        })
      }
      
      // Right edges align
      if (Math.abs((node.position.x + nodeWidth) - (draggingNode.position.x + draggingWidth)) < SNAP_THRESHOLD) {
        newGuides.push({
          type: 'vertical',
          position: node.position.x + nodeWidth,
          nodes: [node.id, draggingNode.id]
        })
      }

      // Centers align vertically
      if (Math.abs((node.position.x + nodeWidth / 2) - (draggingNode.position.x + draggingWidth / 2)) < SNAP_THRESHOLD) {
        newGuides.push({
          type: 'vertical',
          position: node.position.x + nodeWidth / 2,
          nodes: [node.id, draggingNode.id]
        })
      }

      // Horizontal alignment guides
      // Top edges align
      if (Math.abs(node.position.y - draggingNode.position.y) < SNAP_THRESHOLD) {
        newGuides.push({
          type: 'horizontal',
          position: node.position.y,
          nodes: [node.id, draggingNode.id]
        })
      }

      // Bottom edges align
      if (Math.abs((node.position.y + nodeHeight) - (draggingNode.position.y + draggingHeight)) < SNAP_THRESHOLD) {
        newGuides.push({
          type: 'horizontal',
          position: node.position.y + nodeHeight,
          nodes: [node.id, draggingNode.id]
        })
      }

      // Centers align horizontally
      if (Math.abs((node.position.y + nodeHeight / 2) - (draggingNode.position.y + draggingHeight / 2)) < SNAP_THRESHOLD) {
        newGuides.push({
          type: 'horizontal',
          position: node.position.y + nodeHeight / 2,
          nodes: [node.id, draggingNode.id]
        })
      }
    })

    return newGuides
  }, [settings.enabled, settings.snapDistance])

  const snapToGuide = useCallback((
    position: { x: number; y: number },
    node: Node
  ): { x: number; y: number } => {
    if (!settings.enabled) return position

    let snappedX = position.x
    let snappedY = position.y

    guides.forEach(guide => {
      if (guide.nodes.includes(node.id)) {
        if (guide.type === 'vertical') {
          snappedX = guide.position
        } else {
          snappedY = guide.position
        }
      }
    })

    return { x: snappedX, y: snappedY }
  }, [guides, settings.enabled])

  const snapToGrid = useCallback((
    position: { x: number; y: number }
  ): { x: number; y: number } => {
    if (!settings.snapToGrid) return position

    return {
      x: Math.round(position.x / settings.gridSize) * settings.gridSize,
      y: Math.round(position.y / settings.gridSize) * settings.gridSize
    }
  }, [settings.snapToGrid, settings.gridSize])

  const showGuides = useCallback((draggingNode: Node, allNodes: Node[]) => {
    const newGuides = calculateGuides(draggingNode, allNodes)
    setGuides(newGuides)
  }, [calculateGuides])

  const hideGuides = useCallback(() => {
    setGuides([])
  }, [])

  return {
    guides,
    showGuides,
    hideGuides,
    snapToGuide,
    snapToGrid,
    calculateGuides
  }
}
