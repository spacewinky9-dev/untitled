import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Building2, Users, Star, Bed } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import HomestayActions from '@/components/admin/HomestayActions'
import AdminSidebar from '@/components/admin/Sidebar'

export default async function AdminHomestaysPage() {
  const session = await auth()

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/admin/login')
  }

  const homestays = await prisma.homestay.findMany({
    orderBy: { createdAt: 'desc' }
  })

  const stats = {
    total: homestays.length,
    active: homestays.filter(h => h.active).length,
    featured: homestays.filter(h => h.featured).length,
    totalCapacity: homestays.reduce((sum, h) => sum + h.maxGuests, 0)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Homestays Management</h1>
        <Link href="/admin/homestays/new">
          <Button>Add Homestay</Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Homestays</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <Building2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Featured</CardTitle>
            <Star className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.featured}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Capacity</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCapacity} guests</div>
          </CardContent>
        </Card>
      </div>

      {/* Homestays Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Homestays</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Name</th>
                  <th className="text-left p-2">Location</th>
                  <th className="text-left p-2">Price/Night</th>
                  <th className="text-left p-2">Guests</th>
                  <th className="text-left p-2">Rooms</th>
                  <th className="text-left p-2">Rating</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {homestays.map((homestay) => (
                  <tr key={homestay.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">
                      <div>
                        <div className="font-medium">{homestay.name}</div>
                        {homestay.featured && (
                          <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                            Featured
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-2 text-sm text-gray-600">{homestay.location}</td>
                    <td className="p-2 font-medium">₹{homestay.pricePerNight.toLocaleString()}</td>
                    <td className="p-2 text-sm">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {homestay.maxGuests}
                      </div>
                    </td>
                    <td className="p-2 text-sm">
                      <div className="flex items-center gap-1">
                        <Bed className="h-4 w-4" />
                        {homestay.rooms}
                      </div>
                    </td>
                    <td className="p-2">
                      <div className={`flex items-center gap-1 ${
                        (homestay.rating || 0) >= 4.5 ? 'text-green-600' : 
                        (homestay.rating || 0) >= 4.0 ? 'text-yellow-600' : 'text-gray-600'
                      }`}>
                        <Star className="h-4 w-4 fill-current" />
                        <span className="font-medium">{(homestay.rating || 0).toFixed(1)}</span>
                      </div>
                    </td>
                    <td className="p-2">
                      <span className={`text-xs px-2 py-1 rounded ${
                        homestay.active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {homestay.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-2">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">View</Button>
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button variant="outline" size="sm">Delete</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
