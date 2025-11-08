import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MagnifyingGlass, GitBranch, CalendarDots } from '@phosphor-icons/react'
import { Strategy } from '@/types/strategy'

interface LoadStrategyDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  strategies: Strategy[]
  onLoadStrategy: (strategyId: string) => void
}

export function LoadStrategyDialog({ 
  open, 
  onOpenChange, 
  strategies,
  onLoadStrategy 
}: LoadStrategyDialogProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredStrategies = strategies.filter(strategy =>
    strategy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    strategy.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-xl">Load Strategy</DialogTitle>
          <DialogDescription>
            Select a strategy from your library to load onto the canvas
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="relative">
            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <Input
              placeholder="Search strategies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background"
            />
          </div>

          <ScrollArea className="h-[400px] pr-4">
            {filteredStrategies.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <GitBranch size={48} className="text-muted-foreground mb-3 opacity-50" />
                  <p className="text-muted-foreground mb-2">
                    {searchQuery ? 'No strategies found' : 'No strategies saved yet'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {searchQuery ? 'Try a different search term' : 'Create and save a strategy first'}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {filteredStrategies.map((strategy) => (
                  <Card 
                    key={strategy.id} 
                    className="group hover:border-accent transition-colors cursor-pointer"
                    onClick={() => onLoadStrategy(strategy.id)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-base truncate">{strategy.name}</CardTitle>
                          <CardDescription className="line-clamp-1 mt-1 text-xs">
                            {strategy.description || 'No description'}
                          </CardDescription>
                        </div>
                        <Badge variant="outline" className="ml-2 flex-shrink-0">
                          v{strategy.version}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <GitBranch size={12} />
                          <span>{strategy.nodes.length} blocks</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CalendarDots size={12} />
                          <span>{formatDate(strategy.updatedAt)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  )
}
