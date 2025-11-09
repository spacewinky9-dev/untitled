import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ListNumbers, TextAa } from '@phosphor-icons/react'

interface EditBlockLabelDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentLabel?: string | number
  onSave: (label: string | number) => void
}

export function EditBlockLabelDialog({ 
  open, 
  onOpenChange, 
  currentLabel = 1,
  onSave 
}: EditBlockLabelDialogProps) {
  const [labelType, setLabelType] = useState<'number' | 'text'>(
    typeof currentLabel === 'number' ? 'number' : 'text'
  )
  const [numberValue, setNumberValue] = useState(
    typeof currentLabel === 'number' ? currentLabel : 1
  )
  const [textValue, setTextValue] = useState(
    typeof currentLabel === 'string' ? currentLabel : ''
  )

  useEffect(() => {
    if (typeof currentLabel === 'number') {
      setLabelType('number')
      setNumberValue(currentLabel)
    } else if (typeof currentLabel === 'string') {
      setLabelType('text')
      setTextValue(currentLabel)
    }
  }, [currentLabel])

  const handleSave = () => {
    if (labelType === 'number') {
      onSave(numberValue)
    } else {
      onSave(textValue.trim() || 'LABEL')
    }
    onOpenChange(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSave()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px] bg-card border-border">
        <DialogHeader>
          <DialogTitle>Edit Block Label</DialogTitle>
          <DialogDescription>
            Set a number or text label for this block. Text labels help organize complex strategies.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={labelType} onValueChange={(v) => setLabelType(v as 'number' | 'text')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="number" className="gap-2">
              <ListNumbers size={16} />
              Number
            </TabsTrigger>
            <TabsTrigger value="text" className="gap-2">
              <TextAa size={16} />
              Text Label
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="number" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="block-number">Block Number</Label>
              <Input
                id="block-number"
                type="number"
                min={1}
                value={numberValue}
                onChange={(e) => setNumberValue(parseInt(e.target.value) || 1)}
                onKeyDown={handleKeyDown}
                className="bg-background font-mono"
              />
              <p className="text-xs text-muted-foreground">
                Use numbers for execution order. Lower numbers run first.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="text" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="block-label">Block Label</Label>
              <Input
                id="block-label"
                value={textValue}
                onChange={(e) => setTextValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="e.g., ENTRY, EXIT, FILTER"
                maxLength={12}
                className="bg-background font-mono uppercase"
                style={{ textTransform: 'uppercase' }}
              />
              <p className="text-xs text-muted-foreground">
                Use text labels to organize blocks. Latin characters and numbers recommended.
              </p>
            </div>
            
            <div className="p-3 rounded-lg bg-muted/30 border border-border">
              <div className="text-xs font-medium mb-2">Examples:</div>
              <div className="flex flex-wrap gap-2">
                {['ENTRY', 'EXIT', 'FILTER', 'CONFIRM', 'CHECK'].map(example => (
                  <button
                    key={example}
                    onClick={() => setTextValue(example)}
                    className="px-2 py-1 text-xs font-mono bg-background rounded border border-border hover:border-primary transition-colors"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
