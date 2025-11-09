import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { getGroupColor } from '@/lib/group-utils'

interface GroupDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (config: GroupConfig) => void
  defaultName?: string
  selectedNodeCount: number
}

export interface GroupConfig {
  name: string
  description: string
  color: string
}

const COLOR_OPTIONS = [
  { label: 'Blue', value: 'oklch(0.60 0.20 240)' },
  { label: 'Green', value: 'oklch(0.65 0.18 160)' },
  { label: 'Yellow', value: 'oklch(0.70 0.18 50)' },
  { label: 'Red', value: 'oklch(0.58 0.22 25)' },
  { label: 'Purple', value: 'oklch(0.75 0.15 290)' },
  { label: 'Cyan', value: 'oklch(0.68 0.20 200)' }
]

export function GroupDialog({
  open,
  onOpenChange,
  onConfirm,
  defaultName = 'New Group',
  selectedNodeCount
}: GroupDialogProps) {
  const [name, setName] = useState(defaultName)
  const [description, setDescription] = useState('')
  const [selectedColor, setSelectedColor] = useState(COLOR_OPTIONS[0].value)

  const handleConfirm = () => {
    if (name.trim()) {
      onConfirm({
        name: name.trim(),
        description: description.trim(),
        color: selectedColor
      })
      onOpenChange(false)
      setName(defaultName)
      setDescription('')
      setSelectedColor(COLOR_OPTIONS[0].value)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Node Group</DialogTitle>
          <DialogDescription>
            Group {selectedNodeCount} selected nodes into a reusable workflow component.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="group-name">Group Name</Label>
            <Input
              id="group-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter group name"
              autoFocus
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="group-description">Description (optional)</Label>
            <Textarea
              id="group-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what this group does"
              rows={3}
            />
          </div>

          <div className="grid gap-2">
            <Label>Color</Label>
            <div className="flex gap-2 flex-wrap">
              {COLOR_OPTIONS.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  className="w-10 h-10 rounded-lg border-2 transition-all hover:scale-110"
                  style={{
                    backgroundColor: color.value,
                    borderColor: selectedColor === color.value ? 'white' : 'transparent',
                    boxShadow: selectedColor === color.value ? '0 0 0 2px oklch(0.60 0.20 50)' : 'none'
                  }}
                  onClick={() => setSelectedColor(color.value)}
                  title={color.label}
                />
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={!name.trim()}>
            Create Group
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
