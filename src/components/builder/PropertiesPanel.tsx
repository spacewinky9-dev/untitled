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
import { X, Info } from '@phosphor-icons/react'

interface PropertiesPanelProps {
  selectedNode: Node | null
  onClose: () => void
}

export function PropertiesPanel({ selectedNode, onClose }: PropertiesPanelProps) {
  const { setNodes } = useReactFlow()
  const [nodeData, setNodeData] = useState<any>(selectedNode?.data || {})

  useEffect(() => {
    if (selectedNode) {
      setNodeData(selectedNode.data)
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

  const updateNodeData = (key: string, value: any) => {
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

  const renderField = (key: string, value: any) => {
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

    if (key === 'indicatorType' || key === 'action' || key === 'operator') {
      return null
    }

    if (key === 'source') {
      return (
        <div key={key} className="space-y-2">
          <Label htmlFor={`field-${key}`} className="text-xs font-medium">
            Price Source
          </Label>
          <Select value={value} onValueChange={(v) => updateNodeData(key, v)}>
            <SelectTrigger id={`field-${key}`} className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="close">Close</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )
    }

    if (key === 'method') {
      return (
        <div key={key} className="space-y-2">
          <Label htmlFor={`field-${key}`} className="text-xs font-medium">
            Calculation Method
          </Label>
          <Select value={value} onValueChange={(v) => updateNodeData(key, v)}>
            <SelectTrigger id={`field-${key}`} className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fixed_percent">Fixed Percent</SelectItem>
              <SelectItem value="fixed_lots">Fixed Lots</SelectItem>
              <SelectItem value="kelly">Kelly Criterion</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )
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

    if (typeof value === 'string') {
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

  const getNodeTypeInfo = () => {
    const type = selectedNode.type || 'unknown'
    const typeColors: Record<string, string> = {
      indicator: 'bg-accent text-accent-foreground',
      condition: 'bg-blue-500 text-white',
      logic: 'bg-purple-500 text-white',
      action: 'bg-bullish text-bullish-foreground',
      risk: 'bg-yellow-500 text-black'
    }
    
    return {
      label: type.charAt(0).toUpperCase() + type.slice(1),
      color: typeColors[type] || 'bg-muted text-muted-foreground'
    }
  }

  const nodeTypeInfo = getNodeTypeInfo()

  return (
    <Card className="w-80 h-full border-border bg-card flex flex-col">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-base mb-1">Node Properties</h3>
          <Badge className={nodeTypeInfo.color}>
            {nodeTypeInfo.label}
          </Badge>
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
            <p className="text-xs text-muted-foreground mb-3">
              Node ID: <span className="font-mono">{selectedNode.id}</span>
            </p>
          </div>

          <Separator />

          <div className="space-y-4">
            {Object.entries(nodeData).map(([key, value]) => renderField(key, value))}
          </div>

          {Object.keys(nodeData).length === 1 && (
            <div className="text-center py-6 text-muted-foreground text-sm">
              No configurable parameters
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-3 border-t border-border bg-muted/30 text-xs text-muted-foreground">
        <p>Changes apply immediately</p>
      </div>
    </Card>
  )
}
