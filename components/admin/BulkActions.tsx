'use client'

import { Button } from '@/components/ui/button'
import { Trash2, Edit, Eye, Download } from 'lucide-react'

interface BulkActionsProps {
  selectedCount: number
  onDelete?: () => void
  onEdit?: () => void
  onExport?: () => void
  onView?: () => void
}

export default function BulkActions({ 
  selectedCount, 
  onDelete, 
  onEdit, 
  onExport,
  onView 
}: BulkActionsProps) {
  if (selectedCount === 0) return null

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
      <span className="text-sm font-medium">
        {selectedCount} item{selectedCount > 1 ? 's' : ''} selected
      </span>
      <div className="flex gap-2">
        {onView && (
          <Button variant="outline" size="sm" onClick={onView}>
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
        )}
        {onEdit && (
          <Button variant="outline" size="sm" onClick={onEdit}>
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
        )}
        {onExport && (
          <Button variant="outline" size="sm" onClick={onExport}>
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
        )}
        {onDelete && (
          <Button variant="destructive" size="sm" onClick={onDelete}>
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        )}
      </div>
    </div>
  )
}
