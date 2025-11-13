import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Settings as SettingsIcon, TreePine, ShoppingCart } from 'lucide-react'
import AdminSidebar from '@/components/admin/Sidebar'

export default async function AdminDashboard() {
  const session = await auth()

  if (!session) {
    redirect('/admin/login')
  }

  if (session.user.role !== 'ADMIN') {
    redirect('/')
  }

  const userCount = await prisma.user.count()
  const adminCount = await prisma.user.count({ where: { role: 'ADMIN' } })

  const stats = [
    {
      title: 'Total Users',
      value: userCount.toString(),
      icon: Users,
      description: 'Registered users in the system',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Admin Users',
      value: adminCount.toString(),
      icon: SettingsIcon,
      description: 'System administrators',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Products',
      value: '22',
      icon: ShoppingCart,
      description: 'Local organic products',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Trees Planted',
      value: '0 / 25,000',
      icon: TreePine,
      description: 'Carbon credit goal',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100',
    },
  ]

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-2">Welcome to Damday Village Admin Portal</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat) => {
                const Icon = stat.icon
                return (
                  <Card key={stat.title}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        {stat.title}
                      </CardTitle>
                      <div className={`p-2 rounded-full ${stat.bgColor}`}>
                        <Icon className={`h-4 w-4 ${stat.color}`} />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {stat.description}
                      </p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Quick Start Guide</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-semibold">✅ Completed</h3>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    <li>Next.js 14 project initialized</li>
                    <li>Database configured with Prisma ORM</li>
                    <li>Authentication system with NextAuth.js</li>
                    <li>Admin user created and seeded</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">📋 Next Steps (PR #3-#12)</h3>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    <li>User Panel & Public Authentication (PR #3)</li>
                    <li>Marketplace Module (PR #4)</li>
                    <li>Homestay & Tour Booking (PR #5)</li>
                    <li>Blog & News Hub (PR #6)</li>
                    <li>Blockchain Carbon Credits (PR #7)</li>
                    <li>Carbon Marketplace (PR #8)</li>
                    <li>Sustainability Tracker (PR #9)</li>
                    <li>Community Hub (PR #10)</li>
                    <li>UI/UX Enhancement (PR #11)</li>
                    <li>Final Documentation (PR #12)</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
