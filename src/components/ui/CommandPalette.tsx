import { useState, useEffect, useMemo } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Command } from 'lucide-react'
import { KEYBOARD_SHORTCUTS } from '@/hooks/useKeyboardShortcuts'

export interface CommandAction {
  id: string
  title: string
  description?: string
  category: string
  shortcut?: string
  icon?: React.ReactNode
  action: () => void
}

interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  actions: CommandAction[]
}

export function CommandPalette({ open, onOpenChange, actions }: CommandPaletteProps) {
  const [search, setSearch] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [recentCommands, setRecentCommands] = useState<string[]>([])

  // Filter actions based on search
  const filteredActions = useMemo(() => {
    if (!search) {
      // Show recent commands first
      const recent = actions.filter(a => recentCommands.includes(a.id))
      const others = actions.filter(a => !recentCommands.includes(a.id))
      return [...recent, ...others]
    }

    const searchLower = search.toLowerCase()
    return actions.filter(action =>
      action.title.toLowerCase().includes(searchLower) ||
      action.description?.toLowerCase().includes(searchLower) ||
      action.category.toLowerCase().includes(searchLower)
    )
  }, [search, actions, recentCommands])

  // Group actions by category
  const groupedActions = useMemo(() => {
    const groups = new Map<string, CommandAction[]>()
    filteredActions.forEach(action => {
      const group = groups.get(action.category) || []
      group.push(action)
      groups.set(action.category, group)
    })
    return Array.from(groups.entries())
  }, [filteredActions])

  // Reset selection when search changes
  useEffect(() => {
    setSelectedIndex(0)
  }, [search])

  // Keyboard navigation
  useEffect(() => {
    if (!open) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex(prev => Math.min(prev + 1, filteredActions.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex(prev => Math.max(prev - 1, 0))
      } else if (e.key === 'Enter') {
        e.preventDefault()
        const action = filteredActions[selectedIndex]
        if (action) {
          executeAction(action)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, selectedIndex, filteredActions])

  const executeAction = (action: CommandAction) => {
    action.action()
    
    // Add to recent commands
    setRecentCommands(prev => {
      const updated = [action.id, ...prev.filter(id => id !== action.id)].slice(0, 5)
      localStorage.setItem('recent-commands', JSON.stringify(updated))
      return updated
    })
    
    onOpenChange(false)
    setSearch('')
  }

  // Load recent commands from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('recent-commands')
    if (stored) {
      try {
        setRecentCommands(JSON.parse(stored))
      } catch (e) {
        console.error('Failed to load recent commands', e)
      }
    }
  }, [])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0">
        <DialogHeader className="px-4 pt-4 pb-0">
          <DialogTitle className="flex items-center gap-2">
            <Command className="h-5 w-5" />
            Command Palette
          </DialogTitle>
        </DialogHeader>
        
        <div className="p-4 pt-2">
          <Input
            placeholder="Type a command or search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
            className="mb-4"
          />

          <ScrollArea className="h-[400px]">
            {groupedActions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No commands found
              </div>
            ) : (
              <div className="space-y-4">
                {groupedActions.map(([category, categoryActions]) => (
                  <div key={category}>
                    <div className="text-xs font-semibold text-muted-foreground mb-2 px-2">
                      {category}
                    </div>
                    <div className="space-y-1">
                      {categoryActions.map((action, idx) => {
                        const globalIdx = filteredActions.indexOf(action)
                        const isSelected = globalIdx === selectedIndex
                        
                        return (
                          <button
                            key={action.id}
                            onClick={() => executeAction(action)}
                            className={`w-full px-3 py-2 rounded-lg text-left transition-colors flex items-center justify-between group ${
                              isSelected
                                ? 'bg-primary text-primary-foreground'
                                : 'hover:bg-muted'
                            }`}
                            onMouseEnter={() => setSelectedIndex(globalIdx)}
                          >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              {action.icon && (
                                <div className={isSelected ? 'text-primary-foreground' : 'text-muted-foreground'}>
                                  {action.icon}
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="font-medium">{action.title}</div>
                                {action.description && (
                                  <div className={`text-xs ${isSelected ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                                    {action.description}
                                  </div>
                                )}
                              </div>
                            </div>
                            {action.shortcut && (
                              <Badge
                                variant={isSelected ? 'secondary' : 'outline'}
                                className="text-xs font-mono shrink-0"
                              >
                                {action.shortcut}
                              </Badge>
                            )}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          <div className="mt-4 pt-3 border-t text-xs text-muted-foreground flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span><Badge variant="outline" className="text-xs mr-1">↑↓</Badge> Navigate</span>
              <span><Badge variant="outline" className="text-xs mr-1">Enter</Badge> Select</span>
              <span><Badge variant="outline" className="text-xs mr-1">Esc</Badge> Close</span>
            </div>
            {filteredActions.length > 0 && (
              <span>{filteredActions.length} command{filteredActions.length !== 1 ? 's' : ''}</span>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
