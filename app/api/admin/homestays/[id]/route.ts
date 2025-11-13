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
    
    const homestay = await prisma.homestay.update({
      where: { id: params.id },
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        location: data.location,
        address: data.address,
        amenities: data.amenities,
        images: data.images,
        pricePerNight: data.pricePerNight,
        maxGuests: data.maxGuests,
        rooms: data.rooms,
        featured: data.featured,
        active: data.active,
        rating: data.rating
      }
    })

    return NextResponse.json(homestay)
  } catch (error) {
    console.error('Error updating homestay:', error)
    return NextResponse.json({ error: 'Failed to update homestay' }, { status: 500 })
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
    await prisma.homestay.update({
      where: { id: params.id },
      data: { active: false }
    })

    return NextResponse.json({ message: 'Homestay deleted' })
  } catch (error) {
    console.error('Error deleting homestay:', error)
    return NextResponse.json({ error: 'Failed to delete homestay' }, { status: 500 })
  }
}
