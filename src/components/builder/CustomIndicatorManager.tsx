import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useKV } from '@github/spark/hooks'
import { CustomIndicator, CustomIndicatorInputParameter, CustomIndicatorOutputBuffer } from '@/types/custom-indicator'
import { CustomIndicatorParser } from '@/lib/custom-indicator-parser'
import { CustomIndicatorBuilder } from './CustomIndicatorBuilder'
import { Plus, Upload, Code, Trash2, Edit, FileCode, Database, ArrowRight, Info, Wrench } from '@phosphor-icons/react'
import { toast } from 'sonner'

interface CustomIndicatorManagerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onIndicatorAdded?: (indicator: CustomIndicator) => void
}

export function CustomIndicatorManager({ open, onOpenChange, onIndicatorAdded }: CustomIndicatorManagerProps) {
  const [customIndicators, setCustomIndicators] = useKV<CustomIndicator[]>('custom-indicators', [])
  const [activeTab, setActiveTab] = useState('library')
  const [editingIndicator, setEditingIndicator] = useState<CustomIndicator | null>(null)
  const [showBuilder, setShowBuilder] = useState(false)

  const handleDeleteIndicator = (id: string) => {
    setCustomIndicators((current) => current.filter(ind => ind.id !== id))
    toast.success('Custom indicator deleted')
  }

  const handleEditIndicator = (indicator: CustomIndicator) => {
    setEditingIndicator(indicator)
    setShowBuilder(true)
  }

  const handleBuilderSave = (indicator: CustomIndicator) => {
    if (editingIndicator) {
      setCustomIndicators((current) =>
        current.map(ind => ind.id === editingIndicator.id ? indicator : ind)
      )
      setEditingIndicator(null)
    } else {
      setCustomIndicators((current) => [...current, indicator])
    }
    onIndicatorAdded?.(indicator)
    setShowBuilder(false)
    setActiveTab('library')
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-5xl h-[80vh]">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Custom Indicator Library
                </DialogTitle>
                <DialogDescription>
                  Add and manage custom MetaTrader indicators from source code or manually
                </DialogDescription>
              </div>
              <Button onClick={() => setShowBuilder(true)} size="sm">
                <Wrench className="w-4 h-4 mr-2" />
                Builder
              </Button>
            </div>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="library">My Indicators</TabsTrigger>
              <TabsTrigger value="source">From Source Code</TabsTrigger>
            </TabsList>

            <TabsContent value="library" className="flex-1 overflow-hidden">
              <IndicatorLibrary
                indicators={customIndicators}
                onDelete={handleDeleteIndicator}
                onEdit={handleEditIndicator}
                onAdd={onIndicatorAdded}
              />
            </TabsContent>

            <TabsContent value="source" className="flex-1 overflow-hidden">
              <FromSourceCode
                indicators={customIndicators}
                onIndicatorAdded={(indicator) => {
                  setCustomIndicators((current) => [...current, indicator])
                  onIndicatorAdded?.(indicator)
                  setActiveTab('library')
                }}
              />
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      <CustomIndicatorBuilder
        open={showBuilder}
        onOpenChange={(open) => {
          setShowBuilder(open)
          if (!open) setEditingIndicator(null)
        }}
        editingIndicator={editingIndicator}
        onSave={handleBuilderSave}
      />
    </>
  )
}

interface IndicatorLibraryProps {
  indicators: CustomIndicator[]
  onDelete: (id: string) => void
  onEdit: (indicator: CustomIndicator) => void
  onAdd?: (indicator: CustomIndicator) => void
}

function IndicatorLibrary({ indicators, onDelete, onEdit, onAdd }: IndicatorLibraryProps) {
  if (indicators.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 text-muted-foreground">
        <Database className="w-16 h-16 opacity-50" />
        <div className="text-center">
          <p className="text-lg font-medium">No custom indicators yet</p>
          <p className="text-sm">Add indicators from source code or create them manually</p>
        </div>
      </div>
    )
  }

  return (
    <ScrollArea className="h-full pr-4">
      <div className="grid gap-4">
        {indicators.map((indicator) => (
          <Card key={indicator.id} className="hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2">
                    {indicator.name}
                    <Badge variant="outline" className="font-mono text-xs">
                      {indicator.fileName}
                    </Badge>
                  </CardTitle>
                  <CardDescription>{indicator.description}</CardDescription>
                </div>
                <div className="flex gap-2">
                  {onAdd && (
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => onAdd(indicator)}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Use
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onEdit(indicator)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onDelete(indicator.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium mb-2">Input Parameters ({indicator.inputParameters.length})</p>
                  <div className="space-y-1">
                    {indicator.inputParameters.slice(0, 3).map((param, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Badge variant="secondary" className="font-mono">{param.dataType}</Badge>
                        <span>{param.displayName}</span>
                      </div>
                    ))}
                    {indicator.inputParameters.length > 3 && (
                      <p className="text-xs text-muted-foreground">
                        +{indicator.inputParameters.length - 3} more
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <p className="font-medium mb-2">Output Buffers ({indicator.outputBuffers.length})</p>
                  <div className="space-y-1">
                    {indicator.outputBuffers.map((buffer, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Badge variant="secondary" className="font-mono">#{buffer.index}</Badge>
                        <span>{buffer.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  )
}

interface FromSourceCodeProps {
  indicators: CustomIndicator[]
  onIndicatorAdded: (indicator: CustomIndicator) => void
}

function FromSourceCode({ indicators, onIndicatorAdded }: FromSourceCodeProps) {
  const [sourceCode, setSourceCode] = useState('')
  const [fileName, setFileName] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<'trend' | 'momentum' | 'volatility' | 'volume' | 'custom'>('custom')
  const [parsing, setParsing] = useState(false)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.name.endsWith('.mq4') && !file.name.endsWith('.mq5')) {
      toast.error('Please upload a .mq4 or .mq5 file')
      return
    }

    setFileName(file.name)

    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      setSourceCode(content)
      toast.success('Source code loaded')
    }
    reader.readAsText(file)
  }

  const handleParse = () => {
    if (!sourceCode.trim()) {
      toast.error('Please provide source code')
      return
    }

    if (!fileName.trim()) {
      toast.error('Please provide a file name')
      return
    }

    setParsing(true)

    try {
      const parsed = CustomIndicatorParser.parseFromSourceCode(sourceCode, fileName)

      const nameValidation = CustomIndicatorParser.validateIndicatorName(parsed.name)
      if (!nameValidation.valid) {
        toast.error(nameValidation.error)
        setParsing(false)
        return
      }

      const existingIndicator = indicators.find(ind => ind.fileName === fileName)
      if (existingIndicator) {
        toast.error('An indicator with this filename already exists')
        setParsing(false)
        return
      }

      const indicator: CustomIndicator = {
        id: `custom-${Date.now()}`,
        name: parsed.name,
        fileName: fileName,
        description: description || `Custom indicator: ${parsed.name}`,
        category,
        createdAt: new Date(),
        updatedAt: new Date(),
        inputParameters: parsed.inputParameters,
        outputBuffers: parsed.outputBuffers,
        sourceCode,
        isBuiltIn: false
      }

      onIndicatorAdded(indicator)
      toast.success(`Indicator "${indicator.name}" added successfully`)

      setSourceCode('')
      setFileName('')
      setDescription('')
      setCategory('custom')
    } catch (error) {
      console.error('Error parsing indicator:', error)
      toast.error('Failed to parse indicator source code')
    } finally {
      setParsing(false)
    }
  }

  return (
    <ScrollArea className="h-full pr-4">
      <div className="space-y-4">
        <Card className="bg-muted/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Info className="w-4 h-4" />
              How to Add from Source Code
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2 text-muted-foreground">
            <p>Upload your custom indicator .mq4 or .mq5 file, or paste the source code directly.</p>
            <p>The parser will automatically extract:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Input parameters (with data types and default values)</li>
              <li>Output buffers (with labels and indices)</li>
              <li>Indicator name from the filename</li>
            </ul>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="file-upload">Upload Indicator File</Label>
            <div className="flex gap-2">
              <Input
                id="file-upload"
                type="file"
                accept=".mq4,.mq5"
                onChange={handleFileUpload}
                className="flex-1"
              />
              <Button variant="outline" onClick={() => {
                const input = document.getElementById('file-upload') as HTMLInputElement
                input.value = ''
                setSourceCode('')
                setFileName('')
              }}>
                Clear
              </Button>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="file-name">File Name (e.g., CustomATR.mq5)</Label>
            <Input
              id="file-name"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="MyCustomIndicator.mq4"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="source-code">Source Code</Label>
            <Textarea
              id="source-code"
              value={sourceCode}
              onChange={(e) => setSourceCode(e.target.value)}
              placeholder="Paste your indicator source code here..."
              className="font-mono text-xs h-64"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={(v: any) => setCategory(v)}>
                <SelectTrigger id="category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="trend">Trend</SelectItem>
                  <SelectItem value="momentum">Momentum</SelectItem>
                  <SelectItem value="volatility">Volatility</SelectItem>
                  <SelectItem value="volume">Volume</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description..."
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              onClick={handleParse}
              disabled={!sourceCode.trim() || !fileName.trim() || parsing}
              className="w-full"
            >
              <Code className="w-4 h-4 mr-2" />
              {parsing ? 'Parsing...' : 'Parse and Add Indicator'}
            </Button>
          </div>
        </div>
      </div>
    </ScrollArea>
  )
}
