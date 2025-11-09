import { useState, useEffect, useRef } from 'react'
import { useReactFlow } from '@xyflow/react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface InlineNodeEditorProps {
  nodeId: string
  currentLabel: string
  isEditing: boolean
  onEditComplete: () => void
  className?: string
}

export function InlineNodeEditor({ 
  nodeId, 
  currentLabel, 
  isEditing, 
  onEditComplete,
  className 
}: InlineNodeEditorProps) {
  const { setNodes } = useReactFlow()
  const [label, setLabel] = useState(currentLabel)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  useEffect(() => {
    setLabel(currentLabel)
  }, [currentLabel])

  const handleSave = () => {
    if (label.trim() !== '') {
      setNodes((nodes) =>
        nodes.map((node) => {
          if (node.id === nodeId) {
            return { 
              ...node, 
              data: { ...node.data, label: label.trim() } 
            }
          }
          return node
        })
      )
    } else {
      setLabel(currentLabel)
    }
    onEditComplete()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSave()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      setLabel(currentLabel)
      onEditComplete()
    }
  }

  if (!isEditing) {
    return (
      <div className={cn("font-semibold text-xs text-foreground text-center leading-tight", className)}>
        {currentLabel}
      </div>
    )
  }

  return (
    <Input
      ref={inputRef}
      value={label}
      onChange={(e) => setLabel(e.target.value)}
      onBlur={handleSave}
      onKeyDown={handleKeyDown}
      className={cn(
        "h-auto px-1 py-0 text-xs font-semibold text-center border-primary bg-background/90",
        className
      )}
      onClick={(e) => e.stopPropagation()}
    />
  )
}
