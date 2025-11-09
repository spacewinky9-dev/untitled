import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { STRATEGY_TEMPLATES, StrategyTemplate } from '@/lib/strategy-templates'
import { TrendUp, Lightning, ArrowsClockwise, ChartLineUp } from '@phosphor-icons/react'
import Zap from 'lucide-react/dist/esm/icons/zap'

interface TemplatesDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onLoadTemplate: (template: StrategyTemplate) => void
}

export function TemplatesDialog({ open, onOpenChange, onLoadTemplate }: TemplatesDialogProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'trend':
        return <TrendUp size={20} />
      case 'momentum':
        return <Lightning size={20} />
      case 'reversal':
        return <ArrowsClockwise size={20} />
      case 'breakout':
        return <ChartLineUp size={20} />
      case 'scalping':
        return <Zap className="w-5 h-5" />
      default:
        return null
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-bullish/20 text-bullish border-bullish/30'
      case 'intermediate':
        return 'bg-accent/20 text-accent border-accent/30'
      case 'advanced':
        return 'bg-bearish/20 text-bearish border-bearish/30'
      default:
        return 'bg-muted/20 text-muted-foreground border-muted'
    }
  }

  const filteredTemplates = selectedCategory === 'all'
    ? STRATEGY_TEMPLATES
    : STRATEGY_TEMPLATES.filter(t => t.category === selectedCategory)

  const categories = [
    { id: 'all', label: 'All Templates', count: STRATEGY_TEMPLATES.length },
    { id: 'trend', label: 'Trend Following', count: STRATEGY_TEMPLATES.filter(t => t.category === 'trend').length },
    { id: 'momentum', label: 'Momentum', count: STRATEGY_TEMPLATES.filter(t => t.category === 'momentum').length },
    { id: 'reversal', label: 'Reversal', count: STRATEGY_TEMPLATES.filter(t => t.category === 'reversal').length },
    { id: 'breakout', label: 'Breakout', count: STRATEGY_TEMPLATES.filter(t => t.category === 'breakout').length },
    { id: 'scalping', label: 'Scalping', count: STRATEGY_TEMPLATES.filter(t => t.category === 'scalping').length }
  ]

  const handleLoadTemplate = (template: StrategyTemplate) => {
    onLoadTemplate(template)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Strategy Templates</DialogTitle>
          <DialogDescription>
            Choose from pre-built strategies to get started quickly. All templates demonstrate proper node connections and working logic flows.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="all" className="flex-1 flex flex-col" onValueChange={setSelectedCategory}>
          <TabsList className="w-full justify-start">
            {categories.map(cat => (
              <TabsTrigger key={cat.id} value={cat.id} className="gap-2">
                {cat.label}
                <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                  {cat.count}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>

          <ScrollArea className="flex-1 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-4">
              {filteredTemplates.map(template => (
                <Card key={template.id} className="hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="text-accent">
                          {getCategoryIcon(template.category)}
                        </div>
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={getDifficultyColor(template.difficulty)}
                      >
                        {template.difficulty}
                      </Badge>
                    </div>
                    <CardDescription className="text-sm">
                      {template.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {template.strategy.nodes.length} blocks
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {template.strategy.edges.length} connections
                      </Badge>
                      <Badge variant="outline" className="text-xs capitalize">
                        {template.category}
                      </Badge>
                    </div>
                    <div className="mt-3 text-xs text-muted-foreground">
                      <div className="flex flex-wrap gap-1">
                        {template.strategy.metadata.tags.map(tag => (
                          <span key={tag} className="px-2 py-0.5 bg-muted rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      onClick={() => handleLoadTemplate(template)}
                      className="w-full"
                      size="sm"
                    >
                      Load Template
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {filteredTemplates.length === 0 && (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <p className="text-lg text-muted-foreground">
                  No templates in this category yet
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  More templates coming soon!
                </p>
              </div>
            )}
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
