'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Ban, Clock } from 'lucide-react'

interface BanSuspendProps {
  userId: string
  userName: string
  currentStatus: 'active' | 'suspended' | 'banned'
}

export default function BanSuspend({ userId, userName, currentStatus }: BanSuspendProps) {
  const [status, setStatus] = useState(currentStatus)
  const [reason, setReason] = useState('')
  const [duration, setDuration] = useState('')
  const [processing, setProcessing] = useState(false)

  const handleSuspend = async () => {
    if (!reason.trim()) {
      alert('Please provide a reason')
      return
    }

    if (confirm(`Suspend ${userName}?`)) {
      setProcessing(true)
      // API call would go here
      setTimeout(() => {
        setStatus('suspended')
        alert('User suspended')
        setProcessing(false)
      }, 1000)
    }
  }

  const handleBan = async () => {
    if (!reason.trim()) {
      alert('Please provide a reason')
      return
    }

    if (confirm(`Ban ${userName} permanently?`)) {
      setProcessing(true)
      // API call would go here
      setTimeout(() => {
        setStatus('banned')
        alert('User banned')
        setProcessing(false)
      }, 1000)
    }
  }

  const handleReactivate = async () => {
    if (confirm(`Reactivate ${userName}?`)) {
      setProcessing(true)
      // API call would go here
      setTimeout(() => {
        setStatus('active')
        alert('User reactivated')
        setProcessing(false)
      }, 1000)
    }
  }

  return (
    <div className="border rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Account Status</h3>
        <span className={`px-3 py-1 rounded-full text-sm ${
          status === 'active' ? 'bg-green-100 text-green-800' :
          status === 'suspended' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {status.toUpperCase()}
        </span>
      </div>

      {status === 'active' && (
        <div className="space-y-4">
          <div>
            <Label>Reason</Label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter reason for suspension/ban..."
              rows={3}
            />
          </div>
          <div>
            <Label>Duration (days, for suspension)</Label>
            <Input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="Leave empty for permanent"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleSuspend}
              disabled={processing}
            >
              <Clock className="h-4 w-4 mr-2" />
              Suspend
            </Button>
            <Button
              variant="destructive"
              onClick={handleBan}
              disabled={processing}
            >
              <Ban className="h-4 w-4 mr-2" />
              Ban
            </Button>
          </div>
        </div>
      )}

      {status !== 'active' && (
        <Button onClick={handleReactivate} disabled={processing}>
          Reactivate Account
        </Button>
      )}
    </div>
  )
}
