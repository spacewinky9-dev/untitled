import { useState, useCallback } from 'react'
import { Node } from '@xyflow/react'

export interface SelectionState {
  selectedNodes: Set<string>
  isSelecting: boolean
  selectionBox: { x: number; y: number; width: number; height: number } | null
}

export function useSelection() {
  const [selectedNodes, setSelectedNodes] = useState<Set<string>>(new Set())
  const [isSelecting, setIsSelecting] = useState(false)
  const [selectionBox, setSelectionBox] = useState<{ x: number; y: number; width: number; height: number } | null>(null)

  const selectNode = useCallback((nodeId: string, multi = false) => {
    setSelectedNodes(prev => {
      const newSelection = multi ? new Set(prev) : new Set<string>()
      if (newSelection.has(nodeId)) {
        newSelection.delete(nodeId)
      } else {
        newSelection.add(nodeId)
      }
      return newSelection
    })
  }, [])

  const selectNodes = useCallback((nodeIds: string[], append = false) => {
    setSelectedNodes(prev => {
      const newSelection = append ? new Set(prev) : new Set<string>()
      nodeIds.forEach(id => newSelection.add(id))
      return newSelection
    })
  }, [])

  const clearSelection = useCallback(() => {
    setSelectedNodes(new Set())
  }, [])

  const selectAll = useCallback((nodes: Node[]) => {
    setSelectedNodes(new Set(nodes.map(n => n.id)))
  }, [])

  const toggleNodeSelection = useCallback((nodeId: string) => {
    setSelectedNodes(prev => {
      const newSelection = new Set(prev)
      if (newSelection.has(nodeId)) {
        newSelection.delete(nodeId)
      } else {
        newSelection.add(nodeId)
      }
      return newSelection
    })
  }, [])

  const startSelection = useCallback((x: number, y: number) => {
    setIsSelecting(true)
    setSelectionBox({ x, y, width: 0, height: 0 })
  }, [])

  const updateSelection = useCallback((x: number, y: number) => {
    if (!isSelecting || !selectionBox) return
    
    setSelectionBox(prev => {
      if (!prev) return null
      return {
        ...prev,
        width: x - prev.x,
        height: y - prev.y
      }
    })
  }, [isSelecting, selectionBox])

  const endSelection = useCallback((nodes: Node[]) => {
    if (!selectionBox) return
    
    // Calculate nodes within selection box
    const box = {
      left: Math.min(selectionBox.x, selectionBox.x + selectionBox.width),
      right: Math.max(selectionBox.x, selectionBox.x + selectionBox.width),
      top: Math.min(selectionBox.y, selectionBox.y + selectionBox.height),
      bottom: Math.max(selectionBox.y, selectionBox.y + selectionBox.height)
    }

    const nodesInBox = nodes.filter(node => {
      const nodeX = node.position.x
      const nodeY = node.position.y
      const nodeWidth = node.width || 200
      const nodeHeight = node.height || 100

      return (
        nodeX >= box.left &&
        nodeX + nodeWidth <= box.right &&
        nodeY >= box.top &&
        nodeY + nodeHeight <= box.bottom
      )
    })

    selectNodes(nodesInBox.map(n => n.id))
    setIsSelecting(false)
    setSelectionBox(null)
  }, [selectionBox, selectNodes])

  return {
    selectedNodes,
    isSelecting,
    selectionBox,
    selectNode,
    selectNodes,
    clearSelection,
    selectAll,
    toggleNodeSelection,
    startSelection,
    updateSelection,
    endSelection
  }
}
