'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { supabase } from '@/lib/supabase'
import { formatDate, generateTimeSlots, getAvailableSlots, getLessonTypes, type TimeSlot } from '@/lib/booking-utils'

type BookingForm = {
  studentName: string
  email: string
  phone: string
  address: string
  lessonType: string
  date: string
  time: string
}

export default function BookPage() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<BookingForm>({
    studentName: '',
    email: '',
    phone: '',
    address: '',
    lessonType: 'single',
    date: '',
    time: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([])
  const [existingBookings, setExistingBookings] = useState<any[]>([])

  const lessonTypes = getLessonTypes()

  // Load existing bookings to check availability
  useEffect(() => {
    async function loadBookings() {
      try {
        const { data } = await supabase
          .from('bookings_new')
          .select('*')
          .in('status', ['pending', 'confirmed'])
        
        setExistingBookings(data || [])
      } catch (err) {
        console.error('Error loading bookings:', err)
      }
    }
    loadBookings()
  }, [])

  // Update available slots when date changes
  useEffect(() => {
    if (form.date) {
      const slots = getAvailableSlots(form.date, existingBookings)
      setAvailableSlots(slots)
    }
  }, [form.date, existingBookings])

  const handleSubmit = async () => {
    if (!form.studentName || !form.email || !form.phone || !form.date || !form.time) {
      setError('Please fill in all fields')
      return
    }

    setLoading(true)
    setError('')

    try {
      const { error: insertError } = await supabase
        .from('bookings_new')
        .insert([{
          student_name: form.studentName,
          email: form.email,
          phone: form.phone,
          address: form.address,
          date: form.date,
          time: form.time,
          lesson_type: form.lessonType,
          status: 'pending'
        }])

      if (insertError) {
        throw insertError
      }

      setSuccess(true)
      setStep(3)
    } catch (err: any) {
      setError(err.message || 'Failed to create booking')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-6xl mb-4">✅</div>
            <h1 className="text-3xl font-bold mb-4">Booking Submitted!</h1>
            <p className="text-gray-600 mb-6">
              Your booking request has been sent. You'll receive a confirmation once it's reviewed.
            </p>
            <div className="bg-blue-50 rounded-lg p-4 mb-6 text-left">
              <p><strong>Name:</strong> {form.studentName}</p>
              <p><strong>Date:</strong> {formatDate(form.date)}</p>
              <p><strong>Time:</strong> {form.time}</p>
              <p><strong>Lesson:</strong> {form.lessonType === 'single' ? 'Single Lesson ($55)' : 'Casual Driving ($45)'}</p>
            </div>
            <Link
              href="/student/login"
              className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-secondary transition"
            >
              View My Bookings
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar showLocation={false} />

      {/* Progress */}
      <div className="bg-white shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  step >= s ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {s < 3 ? s : '✓'}
                </div>
                {s < 3 && <div className={`w-24 h-1 mx-2 ${step > s ? 'bg-primary' : 'bg-gray-200'}`} />}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>Lesson Type</span>
            <span>Date & Time</span>
            <span>Your Details</span>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Step 1: Lesson Type */}
        {step === 1 && (
          <div>
            <h2 className="text-3xl font-bold mb-6">Choose Your Lesson</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {lessonTypes.map((type) => (
                <div
                  key={type.id}
                  onClick={() => setForm({ ...form, lessonType: type.id })}
                  className={`p-6 rounded-xl border-2 cursor-pointer transition ${
                    form.lessonType === type.id
                      ? 'border-primary bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-primary'
                  }`}
                >
                  <h3 className="text-xl font-bold mb-2">{type.name}</h3>
                  <p className="text-gray-600 mb-4">{type.duration}</p>
                  <div className="text-3xl font-bold text-primary">${type.price}</div>
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-8">
              <button
                onClick={() => setStep(2)}
                className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-secondary transition font-semibold"
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Date & Time */}
        {step === 2 && (
          <div>
            <h2 className="text-3xl font-bold mb-6">Select Date & Time</h2>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input
                type="date"
                value={form.date}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setForm({ ...form, date: e.target.value, time: '' })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary"
              />
            </div>

            {form.date && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Available Times</label>
                {availableSlots.length === 0 ? (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800">
                    No available slots for this date. Please select another date.
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-3">
                    {availableSlots.map((slot) => (
                      <button
                        key={slot.id}
                        onClick={() => setForm({ ...form, time: slot.time })}
                        className={`p-3 rounded-lg border-2 transition ${
                          form.time === slot.time
                            ? 'border-primary bg-blue-50'
                            : 'border-gray-200 hover:border-primary'
                        }`}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-between mt-8">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                ← Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!form.date || !form.time}
                className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-secondary transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Details */}
        {step === 3 && (
          <div>
            <h2 className="text-3xl font-bold mb-6">Your Details</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  value={form.studentName}
                  onChange={(e) => setForm({ ...form, studentName: e.target.value })}
                  placeholder="Your full name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="0412 345 678"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Address</label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="Your address for pickup"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {error && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3 text-red-700">
                {error}
              </div>
            )}

            {/* Summary */}
            <div className="mt-6 bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Booking Summary</h3>
              <p><strong>Lesson:</strong> {form.lessonType === 'single' ? 'Single Lesson ($55)' : 'Casual Driving ($45)'}</p>
              <p><strong>Date:</strong> {formatDate(form.date)}</p>
              <p><strong>Time:</strong> {form.time}</p>
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                ← Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Submit Booking'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
