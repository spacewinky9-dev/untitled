import { useState, useCallback } from 'react'
import { Node, Edge } from '@xyflow/react'

export interface HistoryState {
  nodes: Node[]
  edges: Edge[]
  timestamp: number
  description: string
}

interface UseHistoryReturn {
  history: HistoryState[]
  currentIndex: number
  canUndo: boolean
  canRedo: boolean
  addHistory: (nodes: Node[], edges: Edge[], description: string) => void
  undo: () => { nodes: Node[], edges: Edge[] } | null
  redo: () => { nodes: Node[], edges: Edge[] } | null
  clearHistory: () => void
  markCheckpoint: (nodes: Node[], edges: Edge[], description: string) => void
}

const MAX_HISTORY_SIZE = 50

export function useHistory(): UseHistoryReturn {
  const [history, setHistory] = useState<HistoryState[]>([])
  const [currentIndex, setCurrentIndex] = useState(-1)

  const addHistory = useCallback((nodes: Node[], edges: Edge[], description: string) => {
    setHistory((prev) => {
      const newHistory = prev.slice(0, currentIndex + 1)
      
      newHistory.push({
        nodes: JSON.parse(JSON.stringify(nodes)),
        edges: JSON.parse(JSON.stringify(edges)),
        timestamp: Date.now(),
        description
      })

      if (newHistory.length > MAX_HISTORY_SIZE) {
        newHistory.shift()
        return newHistory
      }

      setCurrentIndex(newHistory.length - 1)
      return newHistory
    })
  }, [currentIndex])

  const undo = useCallback((): { nodes: Node[], edges: Edge[] } | null => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1
      setCurrentIndex(newIndex)
      return {
        nodes: JSON.parse(JSON.stringify(history[newIndex].nodes)),
        edges: JSON.parse(JSON.stringify(history[newIndex].edges))
      }
    }
    return null
  }, [currentIndex, history])

  const redo = useCallback((): { nodes: Node[], edges: Edge[] } | null => {
    if (currentIndex < history.length - 1) {
      const newIndex = currentIndex + 1
      setCurrentIndex(newIndex)
      return {
        nodes: JSON.parse(JSON.stringify(history[newIndex].nodes)),
        edges: JSON.parse(JSON.stringify(history[newIndex].edges))
      }
    }
    return null
  }, [currentIndex, history])

  const clearHistory = useCallback(() => {
    setHistory([])
    setCurrentIndex(-1)
  }, [])

  const markCheckpoint = useCallback((nodes: Node[], edges: Edge[], description: string) => {
    addHistory(nodes, edges, `[CHECKPOINT] ${description}`)
  }, [addHistory])

  return {
    history,
    currentIndex,
    canUndo: currentIndex > 0,
    canRedo: currentIndex < history.length - 1,
    addHistory,
    undo,
    redo,
    clearHistory,
    markCheckpoint
  }
}
