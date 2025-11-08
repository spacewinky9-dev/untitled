import { useState, useCallback } from 'react'
import { Node, Edge } from '@xyflow/react'

interface ClipboardData {
  nodes: Node[]
  edges: Edge[]
  type: 'copy' | 'cut'
}

interface UseClipboardReturn {
  hasData: boolean
  copy: (nodes: Node[], edges: Edge[]) => void
  cut: (nodes: Node[], edges: Edge[]) => void
  paste: (offsetX?: number, offsetY?: number) => { nodes: Node[], edges: Edge[], originalIds: string[] } | null
  clear: () => void
}

export function useClipboard(): UseClipboardReturn {
  const [clipboardData, setClipboardData] = useState<ClipboardData | null>(null)

  const copy = useCallback((nodes: Node[], edges: Edge[]) => {
    const selectedNodes = nodes.filter(n => n.selected)
    if (selectedNodes.length === 0) return

    const selectedNodeIds = new Set(selectedNodes.map(n => n.id))
    const relevantEdges = edges.filter(
      e => selectedNodeIds.has(e.source) && selectedNodeIds.has(e.target)
    )

    setClipboardData({
      nodes: JSON.parse(JSON.stringify(selectedNodes)),
      edges: JSON.parse(JSON.stringify(relevantEdges)),
      type: 'copy'
    })
  }, [])

  const cut = useCallback((nodes: Node[], edges: Edge[]) => {
    const selectedNodes = nodes.filter(n => n.selected)
    if (selectedNodes.length === 0) return

    const selectedNodeIds = new Set(selectedNodes.map(n => n.id))
    const relevantEdges = edges.filter(
      e => selectedNodeIds.has(e.source) && selectedNodeIds.has(e.target)
    )

    setClipboardData({
      nodes: JSON.parse(JSON.stringify(selectedNodes)),
      edges: JSON.parse(JSON.stringify(relevantEdges)),
      type: 'cut'
    })
  }, [])

  const paste = useCallback((offsetX: number = 50, offsetY: number = 50): { nodes: Node[], edges: Edge[], originalIds: string[] } | null => {
    if (!clipboardData) return null

    const idMap = new Map<string, string>()
    const originalIds: string[] = []

    const newNodes: Node[] = clipboardData.nodes.map(node => {
      const newId = `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      idMap.set(node.id, newId)
      originalIds.push(node.id)

      return {
        ...node,
        id: newId,
        position: {
          x: node.position.x + offsetX,
          y: node.position.y + offsetY
        },
        selected: false
      }
    })

    const newEdges: Edge[] = clipboardData.edges.map(edge => ({
      ...edge,
      id: `edge-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      source: idMap.get(edge.source) || edge.source,
      target: idMap.get(edge.target) || edge.target,
      selected: false
    }))

    return {
      nodes: newNodes,
      edges: newEdges,
      originalIds
    }
  }, [clipboardData])

  const clear = useCallback(() => {
    setClipboardData(null)
  }, [])

  return {
    hasData: !!clipboardData,
    copy,
    cut,
    paste,
    clear
  }
}
