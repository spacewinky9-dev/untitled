import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

// Force dynamic rendering for authentication
export const dynamic = 'force-dynamic'

// GET /api/bookings - List all bookings (requires auth)
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const bookings = await prisma.booking.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        homestay: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(bookings)
  } catch (error) {
    console.error('GET /api/bookings error:', error)
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 })
  }
}

// POST /api/bookings - Create a new booking
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      homestayId,
      checkIn,
      checkOut,
      guests,
      rooms,
      guestName,
      guestEmail,
      guestPhone,
      specialRequests,
      total,
    } = body

    // Validate required fields
    if (!homestayId || !checkIn || !checkOut || !guests || !guestName || !guestEmail || !guestPhone || !total) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Check if homestay exists
    const homestay = await prisma.homestay.findUnique({
      where: { id: homestayId },
    })

    if (!homestay) {
      return NextResponse.json({ error: 'Homestay not found' }, { status: 404 })
    }

    // Validate dates
    const checkInDate = new Date(checkIn)
    const checkOutDate = new Date(checkOut)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (checkInDate < today) {
      return NextResponse.json({ error: 'Check-in date cannot be in the past' }, { status: 400 })
    }

    if (checkOutDate <= checkInDate) {
      return NextResponse.json({ error: 'Check-out date must be after check-in date' }, { status: 400 })
    }

    // Validate guest count
    if (guests > homestay.maxGuests) {
      return NextResponse.json({ error: `Maximum ${homestay.maxGuests} guests allowed` }, { status: 400 })
    }

    // Generate unique booking number
    const bookingNumber = `BK${Date.now().toString().slice(-8)}`

    // Get authenticated user or create guest booking
    const session = await auth()
    let userId = session?.user?.id

    // If no authenticated user, create a guest user
    if (!userId) {
      // For production, you might want to handle guest bookings differently
      // For now, we'll require authentication
      return NextResponse.json({ error: 'Please login to make a booking' }, { status: 401 })
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        userId,
        homestayId,
        bookingNumber,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        guests,
        rooms,
        guestName,
        guestEmail,
        guestPhone,
        specialRequests: specialRequests || '',
        total,
        status: 'PENDING',
        paymentStatus: 'PENDING',
      },
      include: {
        homestay: true,
      },
    })

    // TODO: Send confirmation email
    // TODO: Notify admin

    return NextResponse.json({
      success: true,
      booking,
      message: 'Booking created successfully',
    }, { status: 201 })
  } catch (error) {
    console.error('POST /api/bookings error:', error)
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 })
  }
}
