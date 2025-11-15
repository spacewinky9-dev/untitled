'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Edit, Trash2 } from 'lucide-react'

interface ProductActionsProps {
  productId: string
  productName: string
}

export default function ProductActions({ productId, productName }: ProductActionsProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleEdit = () => {
    router.push(`/admin/products/${productId}/edit`)
  }

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${productName}"?`)) {
      return
    }

    setIsDeleting(true)
    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        alert('Product deleted successfully!')
        router.refresh()
      } else {
        alert('Failed to delete product')
      }
    } catch (error) {
      alert('Error deleting product')
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
