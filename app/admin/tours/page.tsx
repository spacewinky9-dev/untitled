import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Map, Users, Star, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import TourActions from '@/components/admin/TourActions'
import AdminSidebar from '@/components/admin/Sidebar'

export default async function AdminToursPage() {
  const session = await auth()

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/admin/login')
  }

  const tours = await prisma.tour.findMany({
    orderBy: { createdAt: 'desc' }
  })

  const stats = {
    total: tours.length,
    active: tours.filter(t => t.active).length,
    featured: tours.filter(t => t.featured).length
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Tours Management</h1>
        <Link href="/admin/tours/new">
          <Button>Add Tour</Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tours</CardTitle>
            <Map className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <Map className="h-4 w-4 text-green-600" />
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
      </div>

      {/* Tours Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Tours</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Name</th>
                  <th className="text-left p-2">Duration</th>
                  <th className="text-left p-2">Price</th>
                  <th className="text-left p-2">Max Guests</th>
                  <th className="text-left p-2">Rating</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tours.map((tour) => (
                  <tr key={tour.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">
                      <div>
                        <div className="font-medium">{tour.name}</div>
                        {tour.featured && (
                          <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                            Featured
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-2 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {tour.duration}
                      </div>
                    </td>
                    <td className="p-2 font-medium">₹{tour.price.toLocaleString()}</td>
                    <td className="p-2 text-sm">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {tour.maxGuests}
                      </div>
                    </td>
                    <td className="p-2">
                      <div className={`flex items-center gap-1 ${
                        (tour.rating || 0) >= 4.5 ? 'text-green-600' : 
                        (tour.rating || 0) >= 4.0 ? 'text-yellow-600' : 'text-gray-600'
                      }`}>
                        <Star className="h-4 w-4 fill-current" />
                        <span className="font-medium">{(tour.rating || 0).toFixed(1)}</span>
                      </div>
                    </td>
                    <td className="p-2">
                      <span className={`text-xs px-2 py-1 rounded ${
                        tour.active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {tour.active ? 'Active' : 'Inactive'}
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
