'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { Calendar, Users, Phone, Mail, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface BookingFormProps {
  homestayId: string
  homestayName: string
  pricePerNight: number
  maxGuests: number
}

export default function BookingForm({ homestayId, homestayName, pricePerNight, maxGuests }: BookingFormProps) {
  const [formData, setFormData] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1,
    rooms: 1,
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    specialRequests: '',
  })
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const calculateTotal = () => {
    if (!formData.checkIn || !formData.checkOut) return 0
    
    const checkIn = new Date(formData.checkIn)
    const checkOut = new Date(formData.checkOut)
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
    
    if (nights <= 0) return 0
    
    return nights * pricePerNight * formData.rooms
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const total = calculateTotal()
      
      if (total <= 0) {
        setError('Please select valid check-in and check-out dates')
        setLoading(false)
        return
      }

      if (formData.guests > maxGuests) {
        setError(`Maximum ${maxGuests} guests allowed`)
        setLoading(false)
        return
      }

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          homestayId,
          ...formData,
          checkIn: new Date(formData.checkIn),
          checkOut: new Date(formData.checkOut),
          total,
        }),
      })

      if (!response.ok) {
        throw new Error('Booking failed')
      }

      setSuccess(true)
      setFormData({
        checkIn: '',
        checkOut: '',
        guests: 1,
        rooms: 1,
        guestName: '',
        guestEmail: '',
        guestPhone: '',
        specialRequests: '',
      })
    } catch (err) {
      setError('Failed to create booking. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const total = calculateTotal()
  const nights = formData.checkIn && formData.checkOut
    ? Math.ceil((new Date(formData.checkOut).getTime() - new Date(formData.checkIn).getTime()) / (1000 * 60 * 60 * 24))
    : 0

  if (success) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h3>
          <p className="text-gray-600 mb-6">
            Your booking request has been submitted successfully. You will receive a confirmation email shortly.
          </p>
          <Button onClick={() => setSuccess(false)}>Make Another Booking</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Book Your Stay</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="checkIn">
                <Calendar className="w-4 h-4 inline mr-2" />
                Check-in Date
              </Label>
              <Input
                id="checkIn"
                type="date"
                value={formData.checkIn}
                onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
                min={format(new Date(), 'yyyy-MM-dd')}
                required
              />
            </div>
            <div>
              <Label htmlFor="checkOut">
                <Calendar className="w-4 h-4 inline mr-2" />
                Check-out Date
              </Label>
              <Input
                id="checkOut"
                type="date"
                value={formData.checkOut}
                onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
                min={formData.checkIn || format(new Date(), 'yyyy-MM-dd')}
                required
              />
            </div>
          </div>

          {/* Guests and Rooms */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="guests">
                <Users className="w-4 h-4 inline mr-2" />
                Number of Guests
              </Label>
              <Input
                id="guests"
                type="number"
                min="1"
                max={maxGuests}
                value={formData.guests}
                onChange={(e) => setFormData({ ...formData, guests: parseInt(e.target.value) })}
                required
              />
              <p className="text-xs text-gray-500 mt-1">Maximum {maxGuests} guests</p>
            </div>
            <div>
              <Label htmlFor="rooms">
                <Calendar className="w-4 h-4 inline mr-2" />
                Number of Rooms
              </Label>
              <Input
                id="rooms"
                type="number"
                min="1"
                value={formData.rooms}
                onChange={(e) => setFormData({ ...formData, rooms: parseInt(e.target.value) })}
                required
              />
            </div>
          </div>

          {/* Guest Information */}
          <div>
            <Label htmlFor="guestName">Full Name</Label>
            <Input
              id="guestName"
              type="text"
              value={formData.guestName}
              onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
              placeholder="John Doe"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="guestEmail">
                <Mail className="w-4 h-4 inline mr-2" />
                Email
              </Label>
              <Input
                id="guestEmail"
                type="email"
                value={formData.guestEmail}
                onChange={(e) => setFormData({ ...formData, guestEmail: e.target.value })}
                placeholder="john@example.com"
                required
              />
            </div>
            <div>
              <Label htmlFor="guestPhone">
                <Phone className="w-4 h-4 inline mr-2" />
                Phone
              </Label>
              <Input
                id="guestPhone"
                type="tel"
                value={formData.guestPhone}
                onChange={(e) => setFormData({ ...formData, guestPhone: e.target.value })}
                placeholder="+91 98765 43210"
                required
              />
            </div>
          </div>

          {/* Special Requests */}
          <div>
            <Label htmlFor="specialRequests">
              <MessageSquare className="w-4 h-4 inline mr-2" />
              Special Requests (Optional)
            </Label>
            <textarea
              id="specialRequests"
              value={formData.specialRequests}
              onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              rows={3}
              placeholder="Any special requirements or preferences..."
            />
          </div>

          {/* Price Summary */}
          {nights > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span>₹{pricePerNight} x {nights} nights x {formData.rooms} room(s)</span>
                <span>₹{pricePerNight * nights * formData.rooms}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Processing...' : 'Confirm Booking'}
          </Button>

          <p className="text-xs text-gray-500 text-center">
            You won&apos;t be charged yet. We&apos;ll send you a confirmation email.
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
