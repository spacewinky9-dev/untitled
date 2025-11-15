'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Edit, Trash2 } from 'lucide-react'

interface TourActionsProps {
  tourId: string
  tourName: string
}

export default function TourActions({ tourId, tourName }: TourActionsProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleEdit = () => {
    router.push(`/admin/tours/${tourId}/edit`)
  }

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${tourName}"?`)) {
      return
    }

    setIsDeleting(true)
    try {
      const res = await fetch(`/api/admin/tours/${tourId}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        alert('Tour deleted successfully!')
        router.refresh()
      } else {
        alert('Failed to delete tour')
      }
    } catch (error) {
      alert('Error deleting tour')
      console.error(error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleEdit}
      >
        <Edit className="h-4 w-4 mr-1" />
        Edit
      </Button>
      <Button
        variant="destructive"
        size="sm"
        onClick={handleDelete}
        disabled={isDeleting}
      >
        <Trash2 className="h-4 w-4 mr-1" />
        {isDeleting ? 'Deleting...' : 'Delete'}
      </Button>
    </div>
  )
}
