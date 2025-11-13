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
    
    const homestay = await prisma.homestay.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        location: data.location,
        address: data.address,
        amenities: data.amenities || [],
        images: data.images || [],
        pricePerNight: data.pricePerNight,
        maxGuests: data.maxGuests,
        rooms: data.rooms,
        featured: data.featured || false,
        active: data.active !== undefined ? data.active : true,
        rating: data.rating || 0
      }
    })

    return NextResponse.json(homestay, { status: 201 })
  } catch (error) {
    console.error('Error creating homestay:', error)
    return NextResponse.json({ error: 'Failed to create homestay' }, { status: 500 })
  }
}

export async function GET() {
  const session = await auth()
  
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const homestays = await prisma.homestay.findMany({
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(homestays)
  } catch (error) {
    console.error('Error fetching homestays:', error)
    return NextResponse.json({ error: 'Failed to fetch homestays' }, { status: 500 })
  }
}
