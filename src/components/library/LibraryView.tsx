import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { 
  BookOpen, 
  MagnifyingGlass, 
  GitBranch, 
  CalendarDots,
  Trash
} from '@phosphor-icons/react'
import { useKV } from '@github/spark/hooks'
import { Strategy } from '@/types/strategy'
import { toast } from 'sonner'

export function LibraryView() {
  const [strategies, setStrategies] = useKV<Strategy[]>('strategies', [])
  const [searchQuery, setSearchQuery] = useState('')

  const filteredStrategies = (strategies || []).filter(strategy =>
    strategy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    strategy.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleDelete = (strategyId: string) => {
    setStrategies((current) => {
      const updated = (current || []).filter(s => s.id !== strategyId)
      toast.success('Strategy deleted')
      return updated
    })
  }

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
    <div className="h-full flex flex-col p-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <BookOpen size={32} className="text-accent" />
          <div>
            <h1 className="text-2xl font-bold">Strategy Library</h1>
            <p className="text-sm text-muted-foreground">
              Browse and manage your trading strategies
            </p>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="relative">
          <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <Input
            placeholder="Search strategies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        {filteredStrategies.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <GitBranch size={48} className="text-muted-foreground mb-3 opacity-50" />
              <p className="text-muted-foreground mb-2">
                {searchQuery ? 'No strategies found' : 'No strategies saved yet'}
              </p>
              <p className="text-sm text-muted-foreground">
                {searchQuery ? 'Try a different search term' : 'Create a strategy in the Builder tab and save it'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStrategies.map((strategy) => (
              <Card key={strategy.id} className="group hover:border-accent transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg truncate">{strategy.name}</CardTitle>
                      <CardDescription className="line-clamp-2 mt-1">
                        {strategy.description || 'No description'}
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="ml-2 flex-shrink-0">
                      v{strategy.version}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <GitBranch size={14} />
                      <span>{strategy.nodes.length} nodes</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CalendarDots size={14} />
                      <span>{formatDate(strategy.updatedAt)}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={() => toast.info('Load strategy functionality coming soon')}
                    >
                      Load
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => handleDelete(strategy.id)}
                    >
                      <Trash size={16} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  )
}
