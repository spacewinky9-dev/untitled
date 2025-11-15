import { redirect } from 'next/navigation'
import Link from 'next/link'
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

  // Comprehensive stats
  const userCount = await prisma.user.count()
  const adminCount = await prisma.user.count({ where: { role: 'ADMIN' } })
  const productCount = await prisma.product.count()
  const orderCount = await prisma.order.count()
  const homestayCount = await prisma.homestay.count()
  const tourCount = await prisma.tour.count()
  const postCount = await prisma.post.count()
  const bookingCount = await prisma.booking.count()

  const stats = [
    {
      title: 'Total Users',
      value: userCount.toString(),
      icon: Users,
      description: 'Registered users',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Products',
      value: productCount.toString(),
      icon: ShoppingCart,
      description: 'Marketplace items',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Orders',
      value: orderCount.toString(),
      icon: ShoppingCart,
      description: 'Total orders',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Homestays',
      value: homestayCount.toString(),
      icon: TreePine,
      description: 'Available homestays',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      title: 'Tours',
      value: tourCount.toString(),
      icon: TreePine,
      description: 'Tour packages',
      color: 'text-teal-600',
      bgColor: 'bg-teal-100',
    },
    {
      title: 'Blog Posts',
      value: postCount.toString(),
      icon: Users,
      description: 'Published posts',
      color: 'text-pink-600',
      bgColor: 'bg-pink-100',
    },
    {
      title: 'Bookings',
      value: bookingCount.toString(),
      icon: SettingsIcon,
      description: 'Total bookings',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
    },
    {
      title: 'Admins',
      value: adminCount.toString(),
      icon: SettingsIcon,
      description: 'System admins',
      color: 'text-gray-600',
      bgColor: 'bg-gray-100',
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Admin Panel Features</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">✅ Complete User Management</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">✅ Products & Marketplace</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">✅ Orders Management</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">✅ Homestays & Tours</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">✅ Blog Management</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">✅ Bookings Calendar</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">✅ Blockchain Integration</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">✅ Navigation Builder</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">✅ Media Library</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">✅ Reports & Analytics</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">✅ System Health Monitor</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">✅ Settings & Configuration</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link href="/admin/products/new" className="block">
                    <div className="p-3 bg-blue-50 hover:bg-blue-100 rounded-lg cursor-pointer transition-colors">
                      <span className="text-sm font-medium text-blue-700">+ Add New Product</span>
                    </div>
                  </Link>
                  <Link href="/admin/homestays/new" className="block">
                    <div className="p-3 bg-green-50 hover:bg-green-100 rounded-lg cursor-pointer transition-colors">
                      <span className="text-sm font-medium text-green-700">+ Add New Homestay</span>
                    </div>
                  </Link>
                  <Link href="/admin/tours/new" className="block">
                    <div className="p-3 bg-purple-50 hover:bg-purple-100 rounded-lg cursor-pointer transition-colors">
                      <span className="text-sm font-medium text-purple-700">+ Add New Tour</span>
                    </div>
                  </Link>
                  <Link href="/admin/blog/new" className="block">
                    <div className="p-3 bg-orange-50 hover:bg-orange-100 rounded-lg cursor-pointer transition-colors">
                      <span className="text-sm font-medium text-orange-700">+ Write New Post</span>
                    </div>
                  </Link>
                  <Link href="/admin/orders" className="block">
                    <div className="p-3 bg-pink-50 hover:bg-pink-100 rounded-lg cursor-pointer transition-colors">
                      <span className="text-sm font-medium text-pink-700">→ View All Orders</span>
                    </div>
                  </Link>
                  <Link href="/admin/reports" className="block">
                    <div className="p-3 bg-indigo-50 hover:bg-indigo-100 rounded-lg cursor-pointer transition-colors">
                      <span className="text-sm font-medium text-indigo-700">→ View Reports</span>
                    </div>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
