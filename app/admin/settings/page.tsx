import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
  const settings = await prisma.settings.findMany()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">System configuration</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {settings.map((setting) => (
              <div key={setting.id} className="flex justify-between items-center py-3 border-b last:border-0">
                <div>
                  <p className="font-medium capitalize">
                    {setting.key.replace(/_/g, ' ')}
                  </p>
                  <p className="text-sm text-gray-600">{setting.value}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>System Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Version:</span>
              <span className="font-medium">1.0.0 (PR #2)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Environment:</span>
              <span className="font-medium">Development</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Database:</span>
              <span className="font-medium">SQLite (file:./dev.db)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Next.js:</span>
              <span className="font-medium">14.0.4</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
