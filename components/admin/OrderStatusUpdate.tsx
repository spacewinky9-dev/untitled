'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

interface OrderStatusUpdateProps {
  orderId: string
  currentStatus: string
}

const statusOptions = [
  { value: 'PENDING', label: 'Pending', color: 'bg-yellow-500' },
  { value: 'PROCESSING', label: 'Processing', color: 'bg-blue-500' },
  { value: 'COMPLETED', label: 'Completed', color: 'bg-green-500' },
  { value: 'CANCELLED', label: 'Cancelled', color: 'bg-red-500' },
]

export default function OrderStatusUpdate({ orderId, currentStatus }: OrderStatusUpdateProps) {
  const router = useRouter()
  const [status, setStatus] = useState(currentStatus)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleUpdate = async (newStatus: string) => {
    if (newStatus === status) return

    if (!confirm(`Change order status to ${newStatus}?`)) {
      return
    }

    setIsUpdating(true)
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (res.ok) {
        setStatus(newStatus)
        alert('Order status updated successfully!')
        router.refresh()
      } else {
        alert('Failed to update order status')
      }
    } catch (error) {
      alert('Error updating order status')
      console.error(error)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="space-y-3">
      {statusOptions.map((option) => (
        <Button
          key={option.value}
          variant={status === option.value ? 'default' : 'outline'}
          className="w-full justify-start"
          onClick={() => handleUpdate(option.value)}
          disabled={isUpdating}
        >
          <div className={`w-3 h-3 rounded-full ${option.color} mr-2`} />
          {option.label}
          {status === option.value && ' (Current)'}
        </Button>
      ))}
    </div>
  )
}
