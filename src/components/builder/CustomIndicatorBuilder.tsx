import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { CustomIndicator, CustomIndicatorInputParameter, CustomIndicatorOutputBuffer, CustomIndicatorDataType } from '@/types/custom-indicator'
import { Plus, Trash2, ArrowUp, ArrowDown, Play, Hash, TextT, Toggle, Calendar, Palette, ListChecks } from '@phosphor-icons/react'
import { toast } from 'sonner'

interface CustomIndicatorBuilderProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingIndicator?: CustomIndicator | null
  onSave: (indicator: CustomIndicator) => void
}

const DATA_TYPE_OPTIONS: Array<{ value: CustomIndicatorDataType; label: string; icon: any }> = [
  { value: 'int', label: 'Integer', icon: Hash },
  { value: 'double', label: 'Decimal', icon: Hash },
  { value: 'bool', label: 'Boolean', icon: Toggle },
  { value: 'string', label: 'Text', icon: TextT },
  { value: 'datetime', label: 'DateTime', icon: Calendar },
  { value: 'color', label: 'Color', icon: Palette },
  { value: 'enum', label: 'Dropdown', icon: ListChecks }
]

const CATEGORY_OPTIONS = [
  { value: 'trend', label: 'Trend' },
  { value: 'momentum', label: 'Momentum' },
  { value: 'volatility', label: 'Volatility' },
  { value: 'volume', label: 'Volume' },
  { value: 'custom', label: 'Custom' }
]

export function CustomIndicatorBuilder({ open, onOpenChange, editingIndicator, onSave }: CustomIndicatorBuilderProps) {
  const [name, setName] = useState('')
  const [fileName, setFileName] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<'trend' | 'momentum' | 'volatility' | 'volume' | 'custom'>('custom')
  const [inputParameters, setInputParameters] = useState<CustomIndicatorInputParameter[]>([])
  const [outputBuffers, setOutputBuffers] = useState<CustomIndicatorOutputBuffer[]>([{ index: 0, name: 'Value', description: 'Main output' }])

  useEffect(() => {
    if (editingIndicator) {
      setName(editingIndicator.name)
      setFileName(editingIndicator.fileName)
      setDescription(editingIndicator.description)
      setCategory(editingIndicator.category)
      setInputParameters(editingIndicator.inputParameters)
      setOutputBuffers(editingIndicator.outputBuffers)
    } else {
      resetForm()
    }
  }, [editingIndicator, open])

  const resetForm = () => {
    setName('')
    setFileName('')
    setDescription('')
    setCategory('custom')
    setInputParameters([])
    setOutputBuffers([{ index: 0, name: 'Value', description: 'Main output' }])
  }

  const addInputParameter = () => {
    const newParam: CustomIndicatorInputParameter = {
      name: `param${inputParameters.length + 1}`,
      displayName: `Parameter ${inputParameters.length + 1}`,
      dataType: 'int',
      defaultValue: 0,
      min: 1,
      max: 500,
      step: 1,
      description: ''
    }
    setInputParameters([...inputParameters, newParam])
  }

  const updateInputParameter = (index: number, updates: Partial<CustomIndicatorInputParameter>) => {
    const updated = [...inputParameters]
    updated[index] = { ...updated[index], ...updates }
    setInputParameters(updated)
  }

  const removeInputParameter = (index: number) => {
    setInputParameters(inputParameters.filter((_, i) => i !== index))
  }

  const moveInputParameter = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= inputParameters.length) return
    
    const updated = [...inputParameters]
    const temp = updated[index]
    updated[index] = updated[newIndex]
    updated[newIndex] = temp
    setInputParameters(updated)
  }

  const addOutputBuffer = () => {
    const newBuffer: CustomIndicatorOutputBuffer = {
      index: outputBuffers.length,
      name: `Buffer ${outputBuffers.length}`,
      description: `Output buffer ${outputBuffers.length}`
    }
    setOutputBuffers([...outputBuffers, newBuffer])
  }

  const updateOutputBuffer = (index: number, updates: Partial<CustomIndicatorOutputBuffer>) => {
    const updated = [...outputBuffers]
    updated[index] = { ...updated[index], ...updates }
    setOutputBuffers(updated)
  }

  const removeOutputBuffer = (index: number) => {
    if (outputBuffers.length <= 1) {
      toast.error('At least one output buffer is required')
      return
    }
    const updated = outputBuffers.filter((_, i) => i !== index)
    updated.forEach((buffer, i) => buffer.index = i)
    setOutputBuffers(updated)
  }

  const handleSave = () => {
    if (!name.trim()) {
      toast.error('Indicator name is required')
      return
    }

    if (!fileName.trim()) {
      toast.error('File name is required')
      return
    }

    if (outputBuffers.length === 0) {
      toast.error('At least one output buffer is required')
      return
    }

    const indicator: CustomIndicator = {
      id: editingIndicator?.id || `custom_${Date.now()}`,
      name: name.trim(),
      fileName: fileName.trim(),
      description: description.trim(),
      category,
      createdAt: editingIndicator?.createdAt || new Date(),
      updatedAt: new Date(),
      inputParameters,
      outputBuffers,
      isBuiltIn: false
    }

    onSave(indicator)
    toast.success(editingIndicator ? 'Indicator updated' : 'Indicator created')
    onOpenChange(false)
    resetForm()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {editingIndicator ? 'Edit Custom Indicator' : 'Create Custom Indicator'}
          </DialogTitle>
          <DialogDescription>
            Define parameters and output buffers for your custom MetaTrader indicator
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Indicator Name *</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g., Custom ATR"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fileName">File Name (MT4/MT5) *</Label>
                    <Input
                      id="fileName"
                      value={fileName}
                      onChange={(e) => setFileName(e.target.value)}
                      placeholder="e.g., CustomATR"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={category} onValueChange={(v: any) => setCategory(v)}>
                    <SelectTrigger id="category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORY_OPTIONS.map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe what this indicator does..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div>
                  <CardTitle className="text-base">Input Parameters</CardTitle>
                  <CardDescription>Define configurable parameters for the indicator</CardDescription>
                </div>
                <Button onClick={addInputParameter} size="sm" variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Parameter
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {inputParameters.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No input parameters defined. Click "Add Parameter" to create one.
                  </div>
                ) : (
                  inputParameters.map((param, index) => (
                    <ParameterEditor
                      key={index}
                      parameter={param}
                      index={index}
                      canMoveUp={index > 0}
                      canMoveDown={index < inputParameters.length - 1}
                      onUpdate={(updates) => updateInputParameter(index, updates)}
                      onRemove={() => removeInputParameter(index)}
                      onMoveUp={() => moveInputParameter(index, 'up')}
                      onMoveDown={() => moveInputParameter(index, 'down')}
                    />
                  ))
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div>
                  <CardTitle className="text-base">Output Buffers</CardTitle>
                  <CardDescription>Define output values the indicator produces</CardDescription>
                </div>
                <Button onClick={addOutputBuffer} size="sm" variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Buffer
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {outputBuffers.map((buffer, index) => (
                  <Card key={index} className="bg-muted/30">
                    <CardContent className="pt-4">
                      <div className="flex items-start gap-4">
                        <div className="flex-1 space-y-4">
                          <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label>Buffer Index</Label>
                              <Input value={index} disabled className="bg-muted" />
                            </div>
                            <div className="space-y-2 col-span-2">
                              <Label>Buffer Name *</Label>
                              <Input
                                value={buffer.name}
                                onChange={(e) => updateOutputBuffer(index, { name: e.target.value })}
                                placeholder="e.g., Upper Band"
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label>Description</Label>
                            <Input
                              value={buffer.description}
                              onChange={(e) => updateOutputBuffer(index, { description: e.target.value })}
                              placeholder="Describe this output..."
                            />
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeOutputBuffer(index)}
                          disabled={outputBuffers.length <= 1}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </div>
        </ScrollArea>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Play className="w-4 h-4 mr-2" />
            {editingIndicator ? 'Update Indicator' : 'Create Indicator'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface ParameterEditorProps {
  parameter: CustomIndicatorInputParameter
  index: number
  canMoveUp: boolean
  canMoveDown: boolean
  onUpdate: (updates: Partial<CustomIndicatorInputParameter>) => void
  onRemove: () => void
  onMoveUp: () => void
  onMoveDown: () => void
}

function ParameterEditor({ parameter, index, canMoveUp, canMoveDown, onUpdate, onRemove, onMoveUp, onMoveDown }: ParameterEditorProps) {
  const [showAdvanced, setShowAdvanced] = useState(false)

  const getDefaultValueForType = (dataType: CustomIndicatorDataType): any => {
    switch (dataType) {
      case 'int': return 0
      case 'double': return 0.0
      case 'bool': return false
      case 'string': return ''
      case 'datetime': return new Date().toISOString()
      case 'color': return '#FFFFFF'
      case 'enum': return ''
      default: return ''
    }
  }

  const handleDataTypeChange = (newType: CustomIndicatorDataType) => {
    const updates: Partial<CustomIndicatorInputParameter> = {
      dataType: newType,
      defaultValue: getDefaultValueForType(newType)
    }

    if (newType === 'int' || newType === 'double') {
      updates.min = 1
      updates.max = newType === 'int' ? 500 : 1000
      updates.step = newType === 'int' ? 1 : 0.1
    } else {
      updates.min = undefined
      updates.max = undefined
      updates.step = undefined
    }

    if (newType === 'enum') {
      updates.options = [{ label: 'Option 1', value: 'option1' }]
    } else {
      updates.options = undefined
    }

    onUpdate(updates)
  }

  const addEnumOption = () => {
    const options = parameter.options || []
    onUpdate({
      options: [...options, { label: `Option ${options.length + 1}`, value: `option${options.length + 1}` }]
    })
  }

  const updateEnumOption = (optIndex: number, label: string, value: string) => {
    const options = [...(parameter.options || [])]
    options[optIndex] = { label, value }
    onUpdate({ options })
  }

  const removeEnumOption = (optIndex: number) => {
    const options = parameter.options?.filter((_, i) => i !== optIndex)
    onUpdate({ options })
  }

  return (
    <Card className="bg-muted/30">
      <CardContent className="pt-4">
        <div className="flex items-start gap-4">
          <div className="flex flex-col gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={onMoveUp}
              disabled={!canMoveUp}
              className="h-7 w-7 p-0"
            >
              <ArrowUp className="w-3 h-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onMoveDown}
              disabled={!canMoveDown}
              className="h-7 w-7 p-0"
            >
              <ArrowDown className="w-3 h-3" />
            </Button>
          </div>

          <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between">
              <Badge variant="outline">Parameter {index + 1}</Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={onRemove}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Variable Name *</Label>
                <Input
                  value={parameter.name}
                  onChange={(e) => onUpdate({ name: e.target.value })}
                  placeholder="e.g., Period"
                  className="font-mono text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label>Display Name *</Label>
                <Input
                  value={parameter.displayName}
                  onChange={(e) => onUpdate({ displayName: e.target.value })}
                  placeholder="e.g., Period"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Data Type *</Label>
                <Select value={parameter.dataType} onValueChange={handleDataTypeChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DATA_TYPE_OPTIONS.map(opt => {
                      const Icon = opt.icon
                      return (
                        <SelectItem key={opt.value} value={opt.value}>
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4" />
                            {opt.label}
                          </div>
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Default Value *</Label>
                {parameter.dataType === 'bool' ? (
                  <div className="flex items-center h-10 px-3 border rounded-md">
                    <Switch
                      checked={parameter.defaultValue}
                      onCheckedChange={(checked) => onUpdate({ defaultValue: checked })}
                    />
                    <span className="ml-2 text-sm">{parameter.defaultValue ? 'True' : 'False'}</span>
                  </div>
                ) : parameter.dataType === 'enum' ? (
                  <Select
                    value={parameter.defaultValue}
                    onValueChange={(v) => onUpdate({ defaultValue: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select default" />
                    </SelectTrigger>
                    <SelectContent>
                      {parameter.options?.map((opt, i) => (
                        <SelectItem key={i} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    type={parameter.dataType === 'int' || parameter.dataType === 'double' ? 'number' : 'text'}
                    value={parameter.defaultValue}
                    onChange={(e) => onUpdate({ 
                      defaultValue: parameter.dataType === 'int' ? parseInt(e.target.value) || 0 :
                                   parameter.dataType === 'double' ? parseFloat(e.target.value) || 0 :
                                   e.target.value 
                    })}
                    step={parameter.step}
                  />
                )}
              </div>
            </div>

            {(parameter.dataType === 'int' || parameter.dataType === 'double') && (
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Minimum</Label>
                  <Input
                    type="number"
                    value={parameter.min}
                    onChange={(e) => onUpdate({ min: parseFloat(e.target.value) })}
                    step={parameter.step}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Maximum</Label>
                  <Input
                    type="number"
                    value={parameter.max}
                    onChange={(e) => onUpdate({ max: parseFloat(e.target.value) })}
                    step={parameter.step}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Step</Label>
                  <Input
                    type="number"
                    value={parameter.step}
                    onChange={(e) => onUpdate({ step: parseFloat(e.target.value) })}
                    step={parameter.dataType === 'int' ? 1 : 0.1}
                  />
                </div>
              </div>
            )}

            {parameter.dataType === 'enum' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Dropdown Options</Label>
                  <Button onClick={addEnumOption} size="sm" variant="outline">
                    <Plus className="w-3 h-3 mr-1" />
                    Add Option
                  </Button>
                </div>
                <div className="space-y-2">
                  {parameter.options?.map((opt, i) => (
                    <div key={i} className="flex gap-2">
                      <Input
                        placeholder="Label"
                        value={opt.label}
                        onChange={(e) => updateEnumOption(i, e.target.value, opt.value)}
                        className="flex-1"
                      />
                      <Input
                        placeholder="Value"
                        value={opt.value}
                        onChange={(e) => updateEnumOption(i, opt.label, e.target.value)}
                        className="flex-1 font-mono text-sm"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeEnumOption(i)}
                        className="text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label>Description</Label>
              <Input
                value={parameter.description}
                onChange={(e) => onUpdate({ description: e.target.value })}
                placeholder="Optional description or help text..."
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
