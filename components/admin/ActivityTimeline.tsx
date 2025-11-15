'use client'

import { Clock } from 'lucide-react'

interface Activity {
  id: string
  action: string
  timestamp: Date
  details?: string
}

interface ActivityTimelineProps {
  activities: Activity[]
}

export default function ActivityTimeline({ activities }: ActivityTimelineProps) {
  return (
    <div className="space-y-4">
      {activities.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No activity yet</p>
      ) : (
        activities.map((activity) => (
          <div key={activity.id} className="flex gap-4 items-start">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <Clock className="h-4 w-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="font-medium">{activity.action}</div>
              {activity.details && (
                <div className="text-sm text-gray-600">{activity.details}</div>
              )}
              <div className="text-xs text-gray-400 mt-1">
                {new Date(activity.timestamp).toLocaleString()}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
