'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Trash2, UserCog } from 'lucide-react'

interface UserActionsProps {
  userId: string
  userName: string
  userRole: string
}

export default function UserActions({ userId, userName, userRole }: UserActionsProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [isChangingRole, setIsChangingRole] = useState(false)

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete user "${userName}"?`)) {
      return
    }

    setIsDeleting(true)
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        alert('User deleted successfully!')
        router.refresh()
      } else {
        alert('Failed to delete user')
      }
    } catch (error) {
      alert('Error deleting user')
      console.error(error)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleRoleChange = async () => {
    const newRole = userRole === 'ADMIN' ? 'USER' : 'ADMIN'
    
    if (!confirm(`Change ${userName}'s role to ${newRole}?`)) {
      return
    }

    setIsChangingRole(true)
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      })

      if (res.ok) {
        alert(`User role changed to ${newRole}!`)
        router.refresh()
      } else {
        alert('Failed to change user role')
      }
    } catch (error) {
      alert('Error changing user role')
      console.error(error)
    } finally {
      setIsChangingRole(false)
    }
  }

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleRoleChange}
        disabled={isChangingRole}
      >
        <UserCog className="h-4 w-4 mr-1" />
        {isChangingRole ? 'Changing...' : 'Change Role'}
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
