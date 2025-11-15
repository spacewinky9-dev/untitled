import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import AdminSidebar from '@/components/admin/Sidebar'
import { ArrowLeft, Mail, Calendar, Shield } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function UserProfilePage({ params }: { params: { id: string } }) {
  const session = await auth()
  if (!session || session.user.role !== 'ADMIN') {
    redirect('/admin/login')
  }

  const user = await prisma.user.findUnique({
    where: { id: params.id },
  })

  if (!user) {
    return <div>User not found</div>
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Link href="/admin/users">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <h1 className="text-3xl font-bold">User Profile</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>User Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-600">Name</label>
                    <div className="text-lg font-medium">{user.name}</div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Email</label>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span>{user.email}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Role</label>
                    <div>
                      <Badge className={user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}>
                        <Shield className="h-3 w-3 mr-1" />
                        {user.role}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Created</label>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(user.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Orders</span>
                    <span className="font-bold">0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bookings</span>
                    <span className="font-bold">0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Reviews</span>
                    <span className="font-bold">0</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
