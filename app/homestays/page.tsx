import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { MapPin, Users, Star, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import StatsSidebar from '@/components/StatsSidebar'
import ParticleBackground from '@/components/ParticleBackground'

export const dynamic = 'force-dynamic'

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
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden relative">
        <ParticleBackground />
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600/20 via-purple-900/15 to-emerald-600/20 z-[1]" />
        
        <div className="relative z-10">
          {/* Hero Header */}
          <div className="pt-24 pb-12 px-6">
            <div className="container mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8">
                  <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-12">
                    <div className="max-w-4xl">
                      <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto md:mx-0 mb-6">
                        <Home className="h-10 w-10 text-white" />
                      </div>
                      <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">Damday Village Homestays</h1>
                      <p className="text-xl text-white/80 mb-8 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">Experience authentic Himalayan hospitality in our traditional homestays</p>
                      <div className="flex flex-wrap gap-8 text-white">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-orange-300">{stats.total}</div>
                          <div className="text-sm text-white/70">Homestays</div>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-green-300">{stats.featured}</div>
                          <div className="text-sm text-white/70">Featured</div>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-blue-300">{stats.capacity}</div>
                          <div className="text-sm text-white/70">Guest Capacity</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="lg:col-span-4">
                  <StatsSidebar />
                </div>
              </div>
            </div>
          </div>

          <div className="container mx-auto px-6 py-12">
            {/* Featured Homestays */}
            {featuredHomestays.length > 0 && (
              <div className="mb-16">
                <h2 className="text-3xl font-bold text-white mb-8">Featured Homestays</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {featuredHomestays.map((homestay) => (
                    <Link 
                      key={homestay.id}
                      href={`/homestays/${homestay.slug}`}
                      className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden hover:bg-white/15 hover:scale-105 transition-all"
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
                        <h3 className="text-xl font-bold text-white mb-2">{homestay.name}</h3>
                        <div className="flex items-center text-white/70 mb-2">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span className="text-sm">{homestay.location}</span>
                        </div>
                        <p className="text-white/60 text-sm mb-4 line-clamp-2">{homestay.description}</p>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center">
                            <Star className={`h-5 w-5 mr-1 ${(homestay.rating || 0) >= 4.5 ? 'text-yellow-400' : 'text-gray-400'}`} fill="currentColor" />
                            <span className="font-semibold text-white">{(homestay.rating || 0).toFixed(1)}</span>
                          </div>
                          <div className="flex items-center text-white/70">
                            <Users className="h-4 w-4 mr-1" />
                            <span className="text-sm">{homestay.maxGuests} guests · {homestay.rooms} rooms</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-2xl font-bold text-white">₹{homestay.pricePerNight.toLocaleString()}</span>
                            <span className="text-white/60 text-sm">/night</span>
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
              <h2 className="text-3xl font-bold text-white mb-8">All Homestays</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {homestays.map((homestay) => (
                  <Link 
                    key={homestay.id}
                    href={`/homestays/${homestay.slug}`}
                    className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden hover:bg-white/15 hover:scale-105 transition-all"
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
                      <h3 className="text-xl font-bold text-white mb-2">{homestay.name}</h3>
                      <div className="flex items-center text-white/70 mb-2">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span className="text-sm">{homestay.location}</span>
                      </div>
                      <p className="text-white/60 text-sm mb-4 line-clamp-2">{homestay.description}</p>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <Star className={`h-5 w-5 mr-1 ${(homestay.rating || 0) >= 4.5 ? 'text-yellow-400' : (homestay.rating || 0) >= 4.0 ? 'text-yellow-300' : 'text-gray-400'}`} fill="currentColor" />
                          <span className="font-semibold text-white">{(homestay.rating || 0).toFixed(1)}</span>
                        </div>
                        <div className="flex items-center text-white/70">
                          <Users className="h-4 w-4 mr-1" />
                          <span className="text-sm">{homestay.maxGuests} guests · {homestay.rooms} rooms</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-2xl font-bold text-white">₹{homestay.pricePerNight.toLocaleString()}</span>
                          <span className="text-white/60 text-sm">/night</span>
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
                <Button variant="outline" className="border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm">
                  ← Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </>
  )
}
