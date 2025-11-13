import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const data = await request.json()
    
    const tour = await prisma.tour.update({
      where: { id: params.id },
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        duration: data.duration,
        price: data.price,
        maxGuests: data.maxGuests,
        highlights: data.highlights,
        itinerary: data.itinerary,
        includes: data.includes,
        excludes: data.excludes,
        images: data.images,
        featured: data.featured,
        active: data.active,
        rating: data.rating
      }
    })

    return NextResponse.json(tour)
  } catch (error) {
    console.error('Error updating tour:', error)
    return NextResponse.json({ error: 'Failed to update tour' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await prisma.tour.update({
      where: { id: params.id },
      data: { active: false }
    })

    return NextResponse.json({ message: 'Tour deleted' })
  } catch (error) {
    console.error('Error deleting tour:', error)
    return NextResponse.json({ error: 'Failed to delete tour' }, { status: 500 })
  }
}
