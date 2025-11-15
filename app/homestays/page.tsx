import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { MapPin, Users, Star, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Footer from '@/components/Footer'

export default async function HomestaysPage() {
  const homestays = await prisma.homestay.findMany({
    where: { active: true },
    orderBy: [
      { featured: 'desc' },
      { rating: 'desc' }
    ]
  })

  const featuredHomestays = homestays.filter(h => h.featured)
  const stats = {
    total: homestays.length,
    featured: featuredHomestays.length,
    capacity: homestays.reduce((sum, h) => sum + h.maxGuests, 0)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-green-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Home className="h-16 w-16 mx-auto mb-4" />
            <h1 className="text-5xl font-bold mb-4">Damday Village Homestays</h1>
            <p className="text-xl mb-8">Experience authentic Himalayan hospitality in our traditional homestays</p>
            <div className="flex justify-center gap-8 text-lg">
              <div>
                <div className="text-3xl font-bold">{stats.total}</div>
                <div>Homestays</div>
              </div>
              <div>
                <div className="text-3xl font-bold">{stats.featured}</div>
                <div>Featured</div>
              </div>
              <div>
                <div className="text-3xl font-bold">{stats.capacity}</div>
                <div>Guest Capacity</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Featured Homestays */}
        {featuredHomestays.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Homestays</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredHomestays.map((homestay) => (
                <Link 
                  key={homestay.id}
                  href={`/homestays/${homestay.slug}`}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="relative">
                    <div className="h-48 bg-gradient-to-br from-orange-200 to-green-200 flex items-center justify-center">
                      <Home className="h-24 w-24 text-gray-600" />
                    </div>
                    <span className="absolute top-4 right-4 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Featured
                    </span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{homestay.name}</h3>
                    <div className="flex items-center text-gray-600 mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="text-sm">{homestay.location}</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{homestay.description}</p>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <Star className={`h-5 w-5 mr-1 ${(homestay.rating || 0) >= 4.5 ? 'text-yellow-500' : 'text-gray-400'}`} fill="currentColor" />
                        <span className="font-semibold">{(homestay.rating || 0).toFixed(1)}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Users className="h-4 w-4 mr-1" />
                        <span className="text-sm">{homestay.maxGuests} guests · {homestay.rooms} rooms</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold text-gray-900">₹{homestay.pricePerNight.toLocaleString()}</span>
                        <span className="text-gray-600 text-sm">/night</span>
                      </div>
                      <Button className="bg-gradient-to-r from-orange-500 to-green-600 text-white">
                        View Details
                      </Button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* All Homestays */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">All Homestays</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {homestays.map((homestay) => (
              <Link 
                key={homestay.id}
                href={`/homestays/${homestay.slug}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="relative">
                  <div className="h-48 bg-gradient-to-br from-orange-200 to-green-200 flex items-center justify-center">
                    <Home className="h-24 w-24 text-gray-600" />
                  </div>
                  {homestay.featured && (
                    <span className="absolute top-4 right-4 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Featured
                    </span>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{homestay.name}</h3>
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">{homestay.location}</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{homestay.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Star className={`h-5 w-5 mr-1 ${(homestay.rating || 0) >= 4.5 ? 'text-yellow-500' : (homestay.rating || 0) >= 4.0 ? 'text-yellow-400' : 'text-gray-400'}`} fill="currentColor" />
                      <span className="font-semibold">{(homestay.rating || 0).toFixed(1)}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Users className="h-4 w-4 mr-1" />
                      <span className="text-sm">{homestay.maxGuests} guests · {homestay.rooms} rooms</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-gray-900">₹{homestay.pricePerNight.toLocaleString()}</span>
                      <span className="text-gray-600 text-sm">/night</span>
                    </div>
                    <Button className="bg-gradient-to-r from-orange-500 to-green-600 text-white">
                      View Details
                    </Button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-12 text-center">
          <Link href="/">
            <Button variant="outline" className="text-gray-700">
              ← Back to Home
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  )
}
