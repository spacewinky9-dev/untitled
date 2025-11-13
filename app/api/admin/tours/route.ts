import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const session = await auth()
  
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const data = await request.json()
    
    const tour = await prisma.tour.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        duration: data.duration,
        price: data.price,
        maxGuests: data.maxGuests,
        highlights: data.highlights || [],
        itinerary: data.itinerary || [],
        includes: data.includes || [],
        excludes: data.excludes || [],
        images: data.images || [],
        featured: data.featured || false,
        active: data.active !== undefined ? data.active : true,
        rating: data.rating || 0
      }
    })

    return NextResponse.json(tour, { status: 201 })
  } catch (error) {
    console.error('Error creating tour:', error)
    return NextResponse.json({ error: 'Failed to create tour' }, { status: 500 })
  }
}

export async function GET() {
  const session = await auth()
  
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const tours = await prisma.tour.findMany({
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(tours)
  } catch (error) {
    console.error('Error fetching tours:', error)
    return NextResponse.json({ error: 'Failed to fetch tours' }, { status: 500 })
  }
}
