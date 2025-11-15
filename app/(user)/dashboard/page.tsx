import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { User, Mail, Calendar, Shield } from 'lucide-react'

export default async function DashboardPage() {
  const session = await auth()
  
  if (!session?.user?.id) {
    return null
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { profile: true }
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome, {session.user.name}!</h1>
        <p className="text-gray-600 mt-2">Your Damday Village dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Account Type</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user?.role || 'USER'}</div>
            <p className="text-xs text-muted-foreground mt-1">Your membership level</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Email Status</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {user?.emailVerified ? 'Verified' : 'Pending'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {user?.emailVerified ? 'Email confirmed' : 'Please verify your email'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Member Since</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '-'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Your join date</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profile</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {user?.profile ? 'Complete' : 'Incomplete'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Profile completion status</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Links</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div>
                <h3 className="font-semibold">Update Profile</h3>
                <p className="text-sm text-gray-600">Manage your personal information</p>
              </div>
              <a href="/profile" className="text-orange-600 hover:text-orange-700 font-semibold">
                Edit →
              </a>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-semibold text-gray-400">Marketplace</h3>
                <p className="text-sm text-gray-400">Browse local organic products</p>
              </div>
              <span className="text-gray-400 text-sm">Coming in PR #4</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-semibold text-gray-400">Homestays</h3>
                <p className="text-sm text-gray-400">Book cultural tourism experiences</p>
              </div>
              <span className="text-gray-400 text-sm">Coming in PR #5</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-semibold text-gray-400">Carbon Credits</h3>
                <p className="text-sm text-gray-400">Track your environmental impact</p>
              </div>
              <span className="text-gray-400 text-sm">Coming in PR #7</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
