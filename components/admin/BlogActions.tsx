'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Edit, Trash2 } from 'lucide-react'

interface BlogActionsProps {
  postId: string
  postTitle: string
}

export default function BlogActions({ postId, postTitle }: BlogActionsProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleEdit = () => {
    router.push(`/admin/blog/${postId}/edit`)
  }

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${postTitle}"?`)) {
      return
    }

    setIsDeleting(true)
    try {
      const res = await fetch(`/api/admin/blog/${postId}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        alert('Blog post deleted successfully!')
        router.refresh()
      } else {
        alert('Failed to delete post')
      }
    } catch (error) {
      alert('Error deleting post')
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
