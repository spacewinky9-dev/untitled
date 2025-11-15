'use client'

import { Monitor, Smartphone, MapPin } from 'lucide-react'

interface LoginRecord {
  id: string
  timestamp: Date
  device: string
  location: string
  ipAddress: string
}

interface LoginHistoryProps {
  logins: LoginRecord[]
}

export default function LoginHistory({ logins }: LoginHistoryProps) {
  return (
    <div className="space-y-3">
      {logins.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No login history</p>
      ) : (
        logins.map((login) => (
          <div key={login.id} className="border rounded-lg p-4 hover:bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {login.device.includes('Mobile') ? (
                  <Smartphone className="h-5 w-5 text-gray-600" />
                ) : (
                  <Monitor className="h-5 w-5 text-gray-600" />
                )}
                <div>
                  <div className="font-medium">{login.device}</div>
                  <div className="text-sm text-gray-600 flex items-center gap-2">
                    <MapPin className="h-3 w-3" />
                    {login.location} • {login.ipAddress}
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                {new Date(login.timestamp).toLocaleString()}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
