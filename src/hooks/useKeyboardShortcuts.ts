import { useEffect, useCallback } from 'react'

export interface KeyboardShortcutsConfig {
  onSave?: () => void
  onUndo?: () => void
  onRedo?: () => void
  onCopy?: () => void
  onPaste?: () => void
  onDelete?: () => void
  onSelectAll?: () => void
  onSearch?: () => void
  onCommandPalette?: () => void
  onZoomIn?: () => void
  onZoomOut?: () => void
  onFitView?: () => void
  onMoveNodes?: (direction: 'up' | 'down' | 'left' | 'right') => void
}

export function useKeyboardShortcuts(config: KeyboardShortcutsConfig, enabled = true) {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!enabled) return

    // Check if user is typing in an input field
    const target = e.target as HTMLElement
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
      // Allow Ctrl+A in input fields
      if (e.ctrlKey && e.key === 'a') return
      // But prevent other shortcuts while typing
      if (e.ctrlKey || e.metaKey) {
        if (['s', 'z', 'y', 'c', 'v', 'k', 'f'].includes(e.key.toLowerCase())) {
          return
        }
      }
      return
    }

    const ctrl = e.ctrlKey || e.metaKey

    // Ctrl/Cmd + Key combinations
    if (ctrl) {
      switch (e.key.toLowerCase()) {
        case 's':
          e.preventDefault()
          config.onSave?.()
          break
        case 'z':
          e.preventDefault()
          if (e.shiftKey) {
            config.onRedo?.()
          } else {
            config.onUndo?.()
          }
          break
        case 'y':
          e.preventDefault()
          config.onRedo?.()
          break
        case 'c':
          e.preventDefault()
          config.onCopy?.()
          break
        case 'v':
          e.preventDefault()
          config.onPaste?.()
          break
        case 'a':
          e.preventDefault()
          config.onSelectAll?.()
          break
        case 'f':
          e.preventDefault()
          config.onSearch?.()
          break
        case 'k':
          e.preventDefault()
          config.onCommandPalette?.()
          break
      }
      return
    }

    // Single key shortcuts
    switch (e.key) {
      case 'Delete':
      case 'Backspace':
        if (!e.ctrlKey && !e.metaKey) {
          e.preventDefault()
          config.onDelete?.()
        }
        break
      case '+':
      case '=':
        e.preventDefault()
        config.onZoomIn?.()
        break
      case '-':
        e.preventDefault()
        config.onZoomOut?.()
        break
      case '0':
        e.preventDefault()
        config.onFitView?.()
        break
      case 'ArrowUp':
        if (!e.shiftKey && !e.ctrlKey) {
          e.preventDefault()
          config.onMoveNodes?.('up')
        }
        break
      case 'ArrowDown':
        if (!e.shiftKey && !e.ctrlKey) {
          e.preventDefault()
          config.onMoveNodes?.('down')
        }
        break
      case 'ArrowLeft':
        if (!e.shiftKey && !e.ctrlKey) {
          e.preventDefault()
          config.onMoveNodes?.('left')
        }
        break
      case 'ArrowRight':
        if (!e.shiftKey && !e.ctrlKey) {
          e.preventDefault()
          config.onMoveNodes?.('right')
        }
        break
    }
  }, [config, enabled])

  useEffect(() => {
    if (!enabled) return

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown, enabled])

  return {
    enabled
  }
}

export const KEYBOARD_SHORTCUTS = {
  save: { key: 'Ctrl+S', description: 'Save strategy' },
  undo: { key: 'Ctrl+Z', description: 'Undo last action' },
  redo: { key: 'Ctrl+Y or Ctrl+Shift+Z', description: 'Redo action' },
  copy: { key: 'Ctrl+C', description: 'Copy selected nodes' },
  paste: { key: 'Ctrl+V', description: 'Paste nodes' },
  delete: { key: 'Delete', description: 'Delete selected nodes' },
  selectAll: { key: 'Ctrl+A', description: 'Select all nodes' },
  search: { key: 'Ctrl+F', description: 'Search nodes' },
  commandPalette: { key: 'Ctrl+K', description: 'Open command palette' },
  zoomIn: { key: '+', description: 'Zoom in' },
  zoomOut: { key: '-', description: 'Zoom out' },
  fitView: { key: '0', description: 'Fit view to canvas' },
  moveUp: { key: '↑', description: 'Move selected nodes up' },
  moveDown: { key: '↓', description: 'Move selected nodes down' },
  moveLeft: { key: '←', description: 'Move selected nodes left' },
  moveRight: { key: '→', description: 'Move selected nodes right' }
} as const
