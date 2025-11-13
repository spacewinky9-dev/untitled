import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { MapPin, Users, Star, Home, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import BookingForm from '@/components/BookingForm'

export default async function HomestayDetailPage({ params }: { params: { slug: string } }) {
  const homestay = await prisma.homestay.findUnique({
    where: { slug: params.slug, active: true },
  })

  if (!homestay) {
    notFound()
  }

  const relatedHomestays = await prisma.homestay.findMany({
    where: {
      active: true,
      slug: { not: params.slug },
      location: homestay.location,
    },
    take: 3,
  })

  const amenities = homestay.amenities ? JSON.parse(homestay.amenities as string) : []

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/homestays" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6">
          ← Back to Homestays
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="relative h-96 bg-gradient-to-br from-orange-500 to-green-600 rounded-2xl mb-6 flex items-center justify-center">
              <Home className="h-32 w-32 text-white opacity-50" />
              {homestay.featured && (
                <div className="absolute top-4 right-4 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Featured
                </div>
              )}
            </div>

            <div>
              <h1 className="text-4xl font-bold mb-2">{homestay.name}</h1>
              <div className="flex items-center text-gray-600 mb-4">
                <MapPin className="h-5 w-5 mr-2" />
                <span>{homestay.location}</span>
              </div>
              {homestay.address && (
                <p className="text-gray-600 mb-6">{homestay.address}</p>
              )}

              <div className="flex items-center space-x-6 mb-6 pb-6 border-b">
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-gray-600" />
                  <span className="font-semibold">{homestay.maxGuests} Guests</span>
                </div>
                <div className="flex items-center">
                  <Home className="h-5 w-5 mr-2 text-gray-600" />
                  <span className="font-semibold">{homestay.rooms} Rooms</span>
                </div>
                <div className="flex items-center">
                  <Star className="h-5 w-5 mr-2 text-yellow-500" fill="currentColor" />
                  <span className="font-semibold">{(homestay.rating || 0).toFixed(1)}</span>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">About this property</h2>
                <p className="text-gray-700 leading-relaxed">{homestay.description}</p>
              </div>

              {amenities.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">Amenities</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {amenities.map((amenity: string, index: number) => (
                      <div key={index} className="flex items-center">
                        <Check className="h-5 w-5 mr-2 text-green-600" />
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <BookingForm
                homestayId={homestay.id}
                homestayName={homestay.name}
                pricePerNight={homestay.pricePerNight}
                maxGuests={homestay.maxGuests}
              />
            </div>
          </div>
        </div>

        {relatedHomestays.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold mb-8">More in {homestay.location}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedHomestays.map((related) => (
                <Link key={related.id} href={`/homestays/${related.slug}`}>
                  <Card className="hover:shadow-lg transition-shadow">
                    <div className="h-48 bg-gradient-to-br from-orange-400 to-green-500 rounded-t-lg flex items-center justify-center">
                      <Home className="h-16 w-16 text-white opacity-50" />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-bold text-lg mb-2">{related.name}</h3>
                      <p className="text-gray-600 text-sm mb-2">{related.location}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 mr-1 text-yellow-500" fill="currentColor" />
                          <span className="text-sm font-semibold">{(related.rating || 0).toFixed(1)}</span>
                        </div>
                        <div className="text-lg font-bold">₹{related.pricePerNight}/night</div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
