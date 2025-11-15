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
import { Plus, Code, Database, Info } from '@phosphor-icons/react'
import Trash from 'lucide-react/dist/esm/icons/trash'
import Pencil from 'lucide-react/dist/esm/icons/pencil'
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

  const handleDeleteIndicator = (id: string) => {
    setCustomIndicators((current) => current.filter(ind => ind.id !== id))
    toast.success('Custom indicator deleted')
  }

  const handleEditIndicator = (indicator: CustomIndicator) => {
    setEditingIndicator(indicator)
    setActiveTab('manual')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Custom Indicator Library
          </DialogTitle>
          <DialogDescription>
            Add and manage custom MetaTrader indicators from source code or manually
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="library">My Indicators</TabsTrigger>
            <TabsTrigger value="source">From Source Code</TabsTrigger>
            <TabsTrigger value="manual">Manual Entry</TabsTrigger>
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

          <TabsContent value="manual" className="flex-1 overflow-hidden">
            <ManualEntry
              indicators={customIndicators}
              editingIndicator={editingIndicator}
              onIndicatorAdded={(indicator) => {
                if (editingIndicator) {
                  setCustomIndicators((current) =>
                    current.map(ind => ind.id === editingIndicator.id ? indicator : ind)
                  )
                  setEditingIndicator(null)
                  toast.success('Indicator updated')
                } else {
                  setCustomIndicators((current) => [...current, indicator])
                  toast.success('Indicator added')
                }
                onIndicatorAdded?.(indicator)
                setActiveTab('library')
              }}
              onCancel={() => {
                setEditingIndicator(null)
              }}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
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
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onDelete(indicator.id)}
                  >
                    <Trash className="w-4 h-4" />
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

interface ManualEntryProps {
  indicators: CustomIndicator[]
  editingIndicator: CustomIndicator | null
  onIndicatorAdded: (indicator: CustomIndicator) => void
  onCancel: () => void
}

function ManualEntry({ indicators, editingIndicator, onIndicatorAdded, onCancel }: ManualEntryProps) {
  const [name, setName] = useState(editingIndicator?.name || '')
  const [fileName, setFileName] = useState(editingIndicator?.fileName || '')
  const [description, setDescription] = useState(editingIndicator?.description || '')
  const [category, setCategory] = useState<'trend' | 'momentum' | 'volatility' | 'volume' | 'custom'>(
    editingIndicator?.category || 'custom'
  )
  const [inputParameters, setInputParameters] = useState<CustomIndicatorInputParameter[]>(
    editingIndicator?.inputParameters || []
  )
  const [outputBuffers, setOutputBuffers] = useState<CustomIndicatorOutputBuffer[]>(
    editingIndicator?.outputBuffers || [{ index: 0, name: 'Value', description: 'Main output' }]
  )

  const handleAddParameter = () => {
    setInputParameters([...inputParameters, {
      name: `param${inputParameters.length + 1}`,
      displayName: `Parameter ${inputParameters.length + 1}`,
      dataType: 'int',
      defaultValue: 0
    }])
  }

  const handleRemoveParameter = (index: number) => {
    setInputParameters(inputParameters.filter((_, i) => i !== index))
  }

  const handleUpdateParameter = (index: number, updates: Partial<CustomIndicatorInputParameter>) => {
    setInputParameters(inputParameters.map((param, i) =>
      i === index ? { ...param, ...updates } : param
    ))
  }

  const handleAddBuffer = () => {
    setOutputBuffers([...outputBuffers, {
      index: outputBuffers.length,
      name: `Buffer ${outputBuffers.length}`,
      description: `Output buffer ${outputBuffers.length}`
    }])
  }

  const handleRemoveBuffer = (index: number) => {
    setOutputBuffers(outputBuffers.filter((_, i) => i !== index).map((buf, i) => ({ ...buf, index: i })))
  }

  const handleUpdateBuffer = (index: number, updates: Partial<CustomIndicatorOutputBuffer>) => {
    setOutputBuffers(outputBuffers.map((buf, i) =>
      i === index ? { ...buf, ...updates } : buf
    ))
  }

  const handleSave = () => {
    if (!name.trim()) {
      toast.error('Please provide an indicator name')
      return
    }

    if (!fileName.trim()) {
      toast.error('Please provide a file name')
      return
    }

    const nameValidation = CustomIndicatorParser.validateIndicatorName(name)
    if (!nameValidation.valid) {
      toast.error(nameValidation.error)
      return
    }

    if (!editingIndicator) {
      const existingIndicator = indicators.find(ind => ind.fileName === fileName)
      if (existingIndicator) {
        toast.error('An indicator with this filename already exists')
        return
      }
    }

    if (outputBuffers.length === 0) {
      toast.error('Please add at least one output buffer')
      return
    }

    const indicator: CustomIndicator = {
      id: editingIndicator?.id || `custom-${Date.now()}`,
      name,
      fileName,
      description,
      category,
      createdAt: editingIndicator?.createdAt || new Date(),
      updatedAt: new Date(),
      inputParameters,
      outputBuffers,
      isBuiltIn: false
    }

    onIndicatorAdded(indicator)

    setName('')
    setFileName('')
    setDescription('')
    setCategory('custom')
    setInputParameters([])
    setOutputBuffers([{ index: 0, name: 'Value', description: 'Main output' }])
  }

  return (
    <ScrollArea className="h-full pr-4">
      <div className="space-y-6">
        <Card className="bg-muted/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Info className="w-4 h-4" />
              Manual Entry
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2 text-muted-foreground">
            <p>Manually define your custom indicator by specifying its parameters and output buffers.</p>
            <p>This is useful when you don't have access to the source code but know the indicator's structure.</p>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="manual-name">Indicator Name *</Label>
              <Input
                id="manual-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="My Custom Indicator"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="manual-filename">File Name *</Label>
              <Input
                id="manual-filename"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                placeholder="MyIndicator.mq4"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="manual-category">Category</Label>
              <Select value={category} onValueChange={(v: any) => setCategory(v)}>
                <SelectTrigger id="manual-category">
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
              <Label htmlFor="manual-description">Description</Label>
              <Input
                id="manual-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description..."
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Input Parameters ({inputParameters.length})</Label>
              <Button size="sm" variant="outline" onClick={handleAddParameter}>
                <Plus className="w-4 h-4 mr-1" />
                Add Parameter
              </Button>
            </div>

            <div className="space-y-2">
              {inputParameters.map((param, index) => (
                <Card key={index} className="p-3">
                  <div className="grid grid-cols-4 gap-3">
                    <Input
                      value={param.name}
                      onChange={(e) => handleUpdateParameter(index, { name: e.target.value })}
                      placeholder="name"
                      className="font-mono text-xs"
                    />
                    <Input
                      value={param.displayName}
                      onChange={(e) => handleUpdateParameter(index, { displayName: e.target.value })}
                      placeholder="Display Name"
                    />
                    <Select
                      value={param.dataType}
                      onValueChange={(v: any) => handleUpdateParameter(index, { dataType: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="int">int</SelectItem>
                        <SelectItem value="double">double</SelectItem>
                        <SelectItem value="bool">bool</SelectItem>
                        <SelectItem value="string">string</SelectItem>
                        <SelectItem value="color">color</SelectItem>
                        <SelectItem value="datetime">datetime</SelectItem>
                        <SelectItem value="enum">enum</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="flex gap-1">
                      <Input
                        value={param.defaultValue}
                        onChange={(e) => handleUpdateParameter(index, { defaultValue: e.target.value })}
                        placeholder="default"
                        className="flex-1"
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRemoveParameter(index)}
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Output Buffers ({outputBuffers.length})</Label>
              <Button size="sm" variant="outline" onClick={handleAddBuffer}>
                <Plus className="w-4 h-4 mr-1" />
                Add Buffer
              </Button>
            </div>

            <div className="space-y-2">
              {outputBuffers.map((buffer, index) => (
                <Card key={index} className="p-3">
                  <div className="grid grid-cols-4 gap-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="font-mono">
                        #{buffer.index}
                      </Badge>
                    </div>
                    <Input
                      value={buffer.name}
                      onChange={(e) => handleUpdateBuffer(index, { name: e.target.value })}
                      placeholder="Buffer Name"
                      className="col-span-2"
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRemoveBuffer(index)}
                      disabled={outputBuffers.length === 1}
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            {editingIndicator && (
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button onClick={handleSave} className="min-w-32">
              {editingIndicator ? 'Update' : 'Add'} Indicator
            </Button>
          </div>
        </div>
      </div>
    </ScrollArea>
  )
}
