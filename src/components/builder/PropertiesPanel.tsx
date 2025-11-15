import { useEffect, useState } from 'react'
import { Node, useReactFlow } from '@xyflow/react'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { X, Info, ArrowCounterClockwise, ArrowClockwise } from '@phosphor-icons/react'
import { getNodeDefinition, type IndicatorNodeDefinition, NODE_CATEGORIES } from '@/constants/node-categories'

interface NodeParameter {
  key: string
  label: string
  type: 'number' | 'select' | 'boolean'
  default: string | number | boolean
  min?: number
  max?: number
  step?: number
  description?: string
  options?: Array<{ label: string; value: string | number | boolean }>
}

interface NodeDataType extends Record<string, unknown> {
  label?: string
  parameters?: Record<string, string | number | boolean>
  [key: string]: unknown
}

interface ParameterHistory {
  parameters: Record<string, string | number | boolean>
  timestamp: number
}

interface PropertiesPanelProps {
  selectedNode: Node | null
  onClose: () => void
}

// Parameter templates for common indicators
const PARAMETER_TEMPLATES: Record<string, Record<string, Record<string, string | number | boolean>>> = {
  sma: {
    fast: { period: 10, source: 'close' },
    standard: { period: 20, source: 'close' },
    slow: { period: 50, source: 'close' },
    longterm: { period: 200, source: 'close' }
  },
  ema: {
    fast: { period: 12, source: 'close' },
    standard: { period: 26, source: 'close' },
    slow: { period: 50, source: 'close' }
  },
  rsi: {
    standard: { period: 14, source: 'close' },
    short: { period: 7, source: 'close' },
    long: { period: 21, source: 'close' }
  },
  macd: {
    standard: { fastPeriod: 12, slowPeriod: 26, signalPeriod: 9 },
    fast: { fastPeriod: 6, slowPeriod: 13, signalPeriod: 5 }
  }
}

export function PropertiesPanel({ selectedNode, onClose }: PropertiesPanelProps) {
  const { setNodes } = useReactFlow()
  const [nodeData, setNodeData] = useState<NodeDataType>(selectedNode?.data as NodeDataType || {})
  const [history, setHistory] = useState<ParameterHistory[]>([])
  const [historyIndex, setHistoryIndex] = useState<number>(-1)
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')

  useEffect(() => {
    if (selectedNode) {
      setNodeData(selectedNode.data)
      // Initialize history with current state
      if (history.length === 0) {
        const initialHistory: ParameterHistory = {
          parameters: { ...(selectedNode.data.parameters || {}) },
          timestamp: Date.now()
        }
        setHistory([initialHistory])
        setHistoryIndex(0)
      }
    }
  }, [selectedNode])

  if (!selectedNode) {
    return (
      <Card className="w-80 h-full border-border bg-card p-6 flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <Info size={48} className="mx-auto mb-3 opacity-50" />
          <p className="text-sm">Select a node to edit properties</p>
        </div>
      </Card>
    )
  }

  const nodeDefinition = getNodeDefinition((selectedNode.data.indicatorType || selectedNode.type) as string)
  const indicatorDef = nodeDefinition as IndicatorNodeDefinition | undefined

  const updateNodeData = (key: string, value: unknown) => {
    const newData = { ...nodeData, [key]: value }
    setNodeData(newData)
    
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === selectedNode.id) {
          return { ...node, data: newData }
        }
        return node
      })
    )
  }

  const updateParameterWithHistory = (key: string, value: string | number | boolean) => {
    const newParams = { ...nodeData.parameters, [key]: value }
    updateNodeData('parameters', newParams)
    
    // Add to history
    const newHistory: ParameterHistory = {
      parameters: newParams,
      timestamp: Date.now()
    }
    const updatedHistory = history.slice(0, historyIndex + 1)
    updatedHistory.push(newHistory)
    setHistory(updatedHistory)
    setHistoryIndex(updatedHistory.length - 1)
  }

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      setHistoryIndex(newIndex)
      const previousState = history[newIndex]
      updateNodeData('parameters', previousState.parameters)
    }
  }

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1
      setHistoryIndex(newIndex)
      const nextState = history[newIndex]
      updateNodeData('parameters', nextState.parameters)
    }
  }

  const resetToDefaults = () => {
    if (indicatorDef?.defaultParameters) {
      updateNodeData('parameters', { ...indicatorDef.defaultParameters })
      
      // Add to history
      const newHistory: ParameterHistory = {
        parameters: { ...indicatorDef.defaultParameters },
        timestamp: Date.now()
      }
      const updatedHistory = history.slice(0, historyIndex + 1)
      updatedHistory.push(newHistory)
      setHistory(updatedHistory)
      setHistoryIndex(updatedHistory.length - 1)
    }
  }

  const applyTemplate = (templateName: string) => {
    const indicatorType = selectedNode.data.indicatorType as string || selectedNode.type
    const templates = PARAMETER_TEMPLATES[indicatorType]
    
    if (templates && templates[templateName]) {
      const templateParams = templates[templateName]
      updateNodeData('parameters', { ...nodeData.parameters, ...templateParams })
      
      // Add to history
      const newHistory: ParameterHistory = {
        parameters: { ...nodeData.parameters, ...templateParams },
        timestamp: Date.now()
      }
      const updatedHistory = history.slice(0, historyIndex + 1)
      updatedHistory.push(newHistory)
      setHistory(updatedHistory)
      setHistoryIndex(updatedHistory.length - 1)
      
      setSelectedTemplate(templateName)
    }
  }

  const renderParameterField = (param: NodeParameter) => {
    const currentValue = nodeData.parameters?.[param.key] ?? param.default

    const updateParameter = (value: string | number | boolean) => {
      updateParameterWithHistory(param.key, value)
    }

    if (param.type === 'select' && param.options) {
      return (
        <div key={param.key} className="space-y-2">
          <div className="flex items-center gap-2">
            <Label htmlFor={`param-${param.key}`} className="text-xs font-medium">
              {param.label}
            </Label>
            {param.description && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info size={12} className="text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs max-w-xs">{param.description}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          <Select value={currentValue} onValueChange={updateParameter}>
            <SelectTrigger id={`param-${param.key}`} className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {param.options.map((opt: { label: string; value: string | number | boolean }) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )
    }

    if (param.type === 'number') {
      const showSlider = param.min !== undefined && param.max !== undefined
      return (
        <div key={param.key} className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Label htmlFor={`param-${param.key}`} className="text-xs font-medium">
                {param.label}
              </Label>
              {param.description && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info size={12} className="text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs max-w-xs">{param.description}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            <span className="text-xs text-muted-foreground font-mono">{currentValue}</span>
          </div>
          {showSlider ? (
            <>
              <Slider
                id={`param-${param.key}`}
                min={param.min}
                max={param.max}
                step={param.step || 1}
                value={[currentValue]}
                onValueChange={([v]) => updateParameter(v)}
                className="py-1"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                <span>{param.min}</span>
                <span>{param.max}</span>
              </div>
            </>
          ) : (
            <Input
              id={`param-${param.key}`}
              type="number"
              value={currentValue}
              onChange={(e) => updateParameter(parseFloat(e.target.value) || param.default)}
              className="h-9"
              step={param.step || 1}
            />
          )}
        </div>
      )
    }

    if (param.type === 'boolean') {
      return (
        <div key={param.key} className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Label htmlFor={`param-${param.key}`} className="text-xs font-medium">
              {param.label}
            </Label>
            {param.description && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info size={12} className="text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs max-w-xs">{param.description}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          <Switch
            id={`param-${param.key}`}
            checked={currentValue}
            onCheckedChange={updateParameter}
          />
        </div>
      )
    }

    return null
  }

  const renderLegacyField = (key: string, value: unknown) => {
    if (key === 'label') {
      return (
        <div key={key} className="space-y-2">
          <Label htmlFor={`field-${key}`} className="text-xs font-medium">
            Node Label
          </Label>
          <Input
            id={`field-${key}`}
            value={value}
            onChange={(e) => updateNodeData(key, e.target.value)}
            className="h-9"
          />
        </div>
      )
    }

    if (key === 'indicatorType' || key === 'action' || key === 'operator' || key === 'parameters') {
      return null
    }

    if (typeof value === 'number') {
      return (
        <div key={key} className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor={`field-${key}`} className="text-xs font-medium capitalize">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </Label>
            <span className="text-xs text-muted-foreground font-mono">{value}</span>
          </div>
          <Input
            id={`field-${key}`}
            type="number"
            value={value}
            onChange={(e) => updateNodeData(key, parseFloat(e.target.value) || 0)}
            className="h-9"
            step={key === 'lots' || key === 'riskPercent' ? 0.01 : 1}
          />
        </div>
      )
    }

    if (typeof value === 'boolean') {
      return (
        <div key={key} className="flex items-center justify-between">
          <Label htmlFor={`field-${key}`} className="text-xs font-medium capitalize">
            {key.replace(/([A-Z])/g, ' $1').trim()}
          </Label>
          <Switch
            id={`field-${key}`}
            checked={value}
            onCheckedChange={(checked) => updateNodeData(key, checked)}
          />
        </div>
      )
    }

    if (typeof value === 'string' && key !== 'indicatorType') {
      return (
        <div key={key} className="space-y-2">
          <Label htmlFor={`field-${key}`} className="text-xs font-medium capitalize">
            {key.replace(/([A-Z])/g, ' $1').trim()}
          </Label>
          <Input
            id={`field-${key}`}
            value={value}
            onChange={(e) => updateNodeData(key, e.target.value)}
            className="h-9"
          />
        </div>
      )
    }

    return null
  }

  const getCategoryConfig = () => {
    const category = selectedNode.type
    return NODE_CATEGORIES.find(cat => cat.id === category)
  }

  const categoryConfig = getCategoryConfig()
  const hasParameters = indicatorDef?.parameters && indicatorDef.parameters.length > 0

  return (
    <Card className="w-80 h-full border-border bg-card flex flex-col">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-base mb-2">Node Properties</h3>
          {categoryConfig && (
            <div className="flex items-center gap-2">
              <Badge 
                variant="outline" 
                className="text-xs font-mono w-6 h-6 flex items-center justify-center p-0"
                style={{ 
                  borderColor: categoryConfig.color,
                  color: categoryConfig.color
                }}
              >
                {categoryConfig.executionOrder}
              </Badge>
              <Badge 
                variant="secondary"
                className="text-xs"
              >
                {categoryConfig.label}
              </Badge>
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onClose}
        >
          <X size={18} />
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">
              Node ID
            </p>
            <p className="text-xs font-mono bg-muted px-2 py-1 rounded">{selectedNode.id}</p>
          </div>

          {nodeDefinition && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">Description</p>
              <p className="text-xs">{nodeDefinition.description}</p>
            </div>
          )}

          <Separator />

          <div>
            <Label className="text-xs font-medium">Node Label</Label>
            <Input
              value={nodeData.label}
              onChange={(e) => updateNodeData('label', e.target.value)}
              className="h-9 mt-2"
            />
          </div>

          {hasParameters && (
            <>
              <Separator />
              
              {/* Parameter History Controls */}
              <div className="flex items-center gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={undo}
                        disabled={historyIndex <= 0}
                        className="h-8 w-8 p-0"
                      >
                        <ArrowCounterClockwise size={14} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">Undo</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={redo}
                        disabled={historyIndex >= history.length - 1}
                        className="h-8 w-8 p-0"
                      >
                        <ArrowClockwise size={14} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">Redo</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <div className="flex-1" />
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={resetToDefaults}
                        className="h-8 text-xs"
                      >
                        Reset
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">Reset to defaults</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              
              {/* Parameter Templates */}
              {PARAMETER_TEMPLATES[selectedNode.data.indicatorType as string || selectedNode.type] && (
                <div className="space-y-2">
                  <Label className="text-xs font-medium">Presets</Label>
                  <Select value={selectedTemplate} onValueChange={applyTemplate}>
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Select a preset..." />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(PARAMETER_TEMPLATES[selectedNode.data.indicatorType as string || selectedNode.type] || {}).map(templateName => (
                        <SelectItem key={templateName} value={templateName}>
                          {templateName.charAt(0).toUpperCase() + templateName.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <div>
                <h4 className="text-sm font-semibold mb-3">Parameters</h4>
                <div className="space-y-4">
                  {indicatorDef.parameters.map(param => renderParameterField(param))}
                </div>
              </div>
            </>
          )}

          {!hasParameters && (
            <>
              <Separator />
              <div className="space-y-4">
                {Object.entries(nodeData)
                  .filter(([key]) => key !== 'label')
                  .map(([key, value]) => renderLegacyField(key, value))}
              </div>
            </>
          )}

          {indicatorDef?.outputs && indicatorDef.outputs.length > 0 && (
            <>
              <Separator />
              <div>
                <h4 className="text-sm font-semibold mb-2">Outputs</h4>
                <div className="space-y-1">
                  {indicatorDef.outputs.map(output => (
                    <div key={output.id} className="text-xs bg-muted px-2 py-1.5 rounded flex items-center justify-between">
                      <span>{output.label}</span>
                      <Badge variant="outline" className="text-[10px] font-mono">
                        {output.id}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </ScrollArea>

      <div className="p-3 border-t border-border bg-muted/30 text-xs text-muted-foreground">
        <p>Changes apply immediately</p>
      </div>
    </Card>
  )
}
