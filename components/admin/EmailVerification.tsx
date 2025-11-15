'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, Mail } from 'lucide-react'

interface EmailVerificationProps {
  userId: string
  isVerified: boolean
  email: string
}

export default function EmailVerification({ userId, isVerified, email }: EmailVerificationProps) {
  const [verified, setVerified] = useState(isVerified)
  const [sending, setSending] = useState(false)

  const handleVerify = async () => {
    if (confirm('Manually verify this email address?')) {
      // API call would go here
      setVerified(true)
      alert('Email verified!')
    }
  }

  const handleSendVerification = async () => {
    setSending(true)
    // API call would go here
    setTimeout(() => {
      setSending(false)
      alert('Verification email sent!')
    }, 1000)
  }

  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          <span className="font-medium">{email}</span>
        </div>
        <Badge className={verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
          {verified ? (
            <>
              <CheckCircle className="h-3 w-3 mr-1" />
              Verified
            </>
          ) : (
            <>
              <XCircle className="h-3 w-3 mr-1" />
              Unverified
            </>
          )}
        </Badge>
      </div>
      {!verified && (
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={handleVerify}>
            Manual Verify
          </Button>
          <Button size="sm" onClick={handleSendVerification} disabled={sending}>
            {sending ? 'Sending...' : 'Resend Email'}
          </Button>
        </div>
      )}
    </div>
  )
}
