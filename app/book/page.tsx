'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import { supabase } from '@/lib/supabase'
import { formatDate, generateTimeSlots, getAvailableSlots, type TimeSlot } from '@/lib/booking-utils'
import { useLanguage } from '@/lib/LanguageContext'

type BookingForm = {
  studentName: string
  email: string
  phone: string
  address: string
  notes: string
  lessonType: string
  date: string
  time: string
}

type Step = 1 | 2 | 3 | 4 // 4 = email verification needed

const LESSON_TYPES = [
  {
    id: 'single',
    name: 'Single Lesson',
    price: 55,
    duration: '60 min',
    image: '/images/hover-single.png',
    title: 'Single Lesson',
    description: 'Perfect for new students taking their first steps. Learn essential driving skills including proper steering and mirror checks, lane changing and merging safely, parking techniques, road rules and situational awareness, and building confidence behind the wheel.',
  },
  {
    id: 'casual',
    name: 'Casual Driving',
    price: 45,
    duration: '60 min relaxed',
    image: '/images/hover-casual.png',
    title: 'Casual Driving',
    description: 'For students who already know the basics and want to maintain their skills. Practice real-world driving without pressure: keep your skills up to date, gain experience on various road types, relaxed stress-free driving practice, prepare for your driving test, and build muscle memory and independence.',
  },
]

export default function BookPage() {
  const { t } = useLanguage()
  const [step, setStep] = useState<Step>(1)
  const [form, setForm] = useState<BookingForm>({
    studentName: '',
    email: '',
    phone: '',
    address: '',
    notes: '',
    lessonType: 'single',
    date: '',
    time: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([])
  const [existingBookings, setExistingBookings] = useState<any[]>([])
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showVerifyModal, setShowVerifyModal] = useState(false)
  const [otpCode, setOtpCode] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [otpLoading, setOtpLoading] = useState(false)
  const [otpError, setOtpError] = useState('')
  const [otpSuccess, setOtpSuccess] = useState('')

  // Check if user is logged in and load student details
  useEffect(() => {
    const isLogged = document.cookie.includes('sb-access-token') || document.cookie.includes('sb-logged-in')
    setIsLoggedIn(isLogged)
    
    // Load student details if logged in
    if (isLogged) {
      loadStudentDetails()
    }
  }, [])

  const loadStudentDetails = async () => {
    try {
      // Get email from cookie
      const cookies = document.cookie.split(';')
      let email = ''
      for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=')
        if (name === 'sb-email') {
          email = decodeURIComponent(value)
          break
        }
      }
      
      if (!email) return
      
      // Query students table for this email
      const { data: student } = await supabase
        .from('students')
        .select('*')
        .eq('email', email)
        .single()
      
      if (student) {
        setForm(prev => ({
          ...prev,
          email: email,
          studentName: student.full_name || '',
          phone: student.phone || '',
          address: student.address || '',
        }))
      } else {
        setForm(prev => ({ ...prev, email }))
      }
    } catch (err) {
      console.error('Error loading student details:', err)
    }
  }

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

  // Fetch available slots directly from Supabase when date changes
  useEffect(() => {
    if (form.date) {
      fetchAvailableSlots(form.date)
    }
  }, [form.date])

  const fetchAvailableSlots = async (date: string) => {
    try {
      // Get all rules from Supabase directly
      const { data: rules } = await supabase
        .from('availability_rules')
        .select('*')
        .eq('enabled', true)
      
      // Get manual blocked slots for this date from Supabase directly
      const { data: manualBlocks } = await supabase
        .from('blocked_slots')
        .select('time')
        .eq('date', date)
      
      // Get existing bookings for this date
      const { data: bookings } = await supabase
        .from('bookings_new')
        .select('time')
        .eq('date', date)
        .in('status', ['pending', 'confirmed'])
      
      // All possible time slots
      const allSlots = ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM']
      
      // Convert slot to minutes for comparison
      const slotToMinutes = (slot: string) => {
        const [time, period] = slot.split(' ')
        let [hours, minutes] = time.split(':').map(Number)
        if (period === 'PM' && hours !== 12) hours += 12
        if (period === 'AM' && hours === 12) hours = 0
        return hours * 60 + minutes
      }
      
      // Check if slot is in time range
      const isInRange = (slot: string, start: string, end: string) => {
        const startParts = start.split(':')
        const endParts = end.split(':')
        const startMin = parseInt(startParts[0]) * 60 + parseInt(startParts[1])
        const endMin = parseInt(endParts[0]) * 60 + parseInt(endParts[1])
        const slotMin = slotToMinutes(slot)
        return slotMin >= startMin && slotMin <= endMin
      }
      
      // Check if date matches day type
      const matchesDayType = (d: Date, dayType: string) => {
        const dayOfWeek = d.getDay()
        if (dayType === 'ALL_DAYS') return true
        if (dayType === 'WEEKDAY') return dayOfWeek >= 1 && dayOfWeek <= 5
        if (dayType === 'WEEKEND') return dayOfWeek === 0 || dayOfWeek === 6
        return false
      }
      
      const dateObj = new Date(date)
      const blockedTimes = new Set<string>()
      const bookedTimes = new Set<string>((bookings || []).map(b => b.time))
      
      // FIRST: Check MAX_BOOKING rules - if day limit reached, no slots available
      const maxBookingRules = (rules || []).filter(r => 
        r.type === 'MAX_BOOKING' && matchesDayType(dateObj, r.day_type || 'ALL_DAYS')
      )
      
      for (const rule of maxBookingRules) {
        if (rule.max_bookings !== undefined && rule.max_bookings !== null) {
          if ((bookings || []).length >= rule.max_bookings) {
            // Day is at max capacity - no slots available
            setAvailableSlots([])
            return
          }
        }
      }
      
      // Second, apply TIME_BLOCK rules - block all times that rules cover
      const timeBlockRules = (rules || []).filter(r => 
        r.type === 'TIME_BLOCK' && matchesDayType(dateObj, r.day_type || 'ALL_DAYS')
      )
      
      for (const rule of timeBlockRules) {
        if (!rule.start_time || !rule.end_time) continue
        for (const slot of allSlots) {
          if (isInRange(slot, rule.start_time, rule.end_time)) {
            blockedTimes.add(slot)
          }
        }
      }
      
      // Then handle blocked_slots entries:
      // - If time was blocked by a rule → it's an EXCEPTION → REMOVE from blocked (make available)
      // - If time was NOT blocked by a rule → it's a MANUAL block → ADD to blocked
      for (const block of (manualBlocks || [])) {
        if (blockedTimes.has(block.time)) {
          // Was blocked by rule, now exception - REMOVE from blocked
          blockedTimes.delete(block.time)
        } else {
          // Was not blocked by rule - this is a manual block - ADD to blocked
          blockedTimes.add(block.time)
        }
      }
      
      
      // Calculate available slots
      const available = allSlots.filter(slot => 
        !blockedTimes.has(slot) && !bookedTimes.has(slot)
      )
      
      const slots: TimeSlot[] = available.map(time => ({
        id: `${date}-${time}`,
        date,
        time,
        available: true,
        price: 45,
        isNightTime: time === '8:00 PM'
      }))
      
      setAvailableSlots(slots)
    } catch (err) {
      console.error('Error fetching availability:', err)
      setAvailableSlots([])
    }
  }

  // Generate dates for the next 28 days - initial placeholder
  const [availableDates, setAvailableDates] = useState<{ date: string; hasSlots: boolean }[]>([])

  // Fetch available dates from Supabase directly on mount
  useEffect(() => {
    async function fetchAvailableDates() {
      try {
        // Initialize dates
        const dates: { date: string; hasSlots: boolean }[] = []
        const today = new Date()
        for (let i = 1; i <= 28; i++) {
          const d = new Date(today)
          d.setDate(today.getDate() + i)
          const dateString = d.toISOString().split('T')[0]
          dates.push({ date: dateString, hasSlots: true })
        }
        
        // Get all rules from Supabase directly
        const { data: rules } = await supabase
          .from('availability_rules')
          .select('*')
          .eq('enabled', true)
        
        // Get all blocked slots from Supabase directly
        const { data: manualBlocks } = await supabase
          .from('blocked_slots')
          .select('date, time')
        
        // Get all bookings from Supabase directly
        const futureDates = dates.map(d => d.date)
        const { data: bookings } = await supabase
          .from('bookings_new')
          .select('date, time')
          .in('date', futureDates)
          .in('status', ['pending', 'confirmed'])
        
        // All possible time slots
        const allSlots = ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM']
        
        // Convert slot to minutes for comparison
        const slotToMinutes = (slot: string) => {
          const [time, period] = slot.split(' ')
          let [hours, minutes] = time.split(':').map(Number)
          if (period === 'PM' && hours !== 12) hours += 12
          if (period === 'AM' && hours === 12) hours = 0
          return hours * 60 + minutes
        }
        
        // Check if slot is in time range
        const isInRange = (slot: string, start: string, end: string) => {
          const startParts = start.split(':')
          const endParts = end.split(':')
          const startMin = parseInt(startParts[0]) * 60 + parseInt(startParts[1])
          const endMin = parseInt(endParts[0]) * 60 + parseInt(endParts[1])
          const slotMin = slotToMinutes(slot)
          return slotMin >= startMin && slotMin <= endMin
        }
        
        // Check if date matches day type
        const matchesDayType = (d: Date, dayType: string) => {
          const dayOfWeek = d.getDay()
          if (dayType === 'ALL_DAYS') return true
          if (dayType === 'WEEKDAY') return dayOfWeek >= 1 && dayOfWeek <= 5
          if (dayType === 'WEEKEND') return dayOfWeek === 0 || dayOfWeek === 6
          return false
        }
        
        // Calculate availability for each date
        const availableDatesResult = dates.map(dateInfo => {
          const dateObj = new Date(dateInfo.date)
          let blockedTimes = new Set<string>()
          
          // First, get bookings for this date (needed for MAX_BOOKING check)
          const dateBookings = (bookings || []).filter(b => b.date === dateInfo.date)
          
          // FIRST: Check MAX_BOOKING rules - if day limit reached, date has no availability
          const maxBookingRules = (rules || []).filter(r => 
            r.type === 'MAX_BOOKING' && matchesDayType(dateObj, r.day_type || 'ALL_DAYS')
          )
          
          for (const rule of maxBookingRules) {
            if (rule.max_bookings !== undefined && rule.max_bookings !== null) {
              if (dateBookings.length >= rule.max_bookings) {
                // Day is at max capacity - no slots available
                return {
                  date: dateInfo.date,
                  hasSlots: false,
                  dayFullyBooked: true
                }
              }
            }
          }
          
          // Second, apply TIME_BLOCK rules - block all times that rules cover
          const timeBlockRules = (rules || []).filter(r => 
            r.type === 'TIME_BLOCK' && matchesDayType(dateObj, r.day_type || 'ALL_DAYS')
          )
          
          for (const rule of timeBlockRules) {
            if (!rule.start_time || !rule.end_time) continue
            for (const slot of allSlots) {
              if (isInRange(slot, rule.start_time, rule.end_time)) {
                blockedTimes.add(slot)
              }
            }
          }
          
          // Then handle blocked_slots entries for this date:
          // - If time was blocked by a rule → it's an EXCEPTION → REMOVE from blocked (make available)
          // - If time was NOT blocked by a rule → it's a MANUAL block → ADD to blocked
          const dateBlocks = (manualBlocks || []).filter(b => b.date === dateInfo.date)
          for (const block of dateBlocks) {
            if (blockedTimes.has(block.time)) {
              blockedTimes.delete(block.time)
            } else {
              blockedTimes.add(block.time)
            }
          }
          
          // Apply bookings
          const bookedTimes = new Set(dateBookings.map(b => b.time))
          
          // Available = all - blocked - booked
          const availableSlots = allSlots.filter(slot => 
            !blockedTimes.has(slot) && !bookedTimes.has(slot)
          )
          
          return {
            date: dateInfo.date,
            hasSlots: availableSlots.length > 0
          }
        })
        
        setAvailableDates(availableDatesResult)
      } catch (err) {
        console.error('Error fetching available dates:', err)
      }
    }
    fetchAvailableDates()
  }, [])

  const handleSendOTP = async () => {
    if (!form.email) {
      setOtpError('Email is required')
      return
    }
    
    setOtpLoading(true)
    setOtpError('')
    
    try {
      const res = await fetch('/api/student-auth/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email }),
      })
      
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to send code')
      }
      
      setOtpSent(true)
      setOtpSuccess('Code sent! Check your email.')
    } catch (err: any) {
      setOtpError(err.message)
    } finally {
      setOtpLoading(false)
    }
  }

  const handleVerifyOTP = async () => {
    if (!otpCode || otpCode.length < 6) {
      setOtpError('Please enter the 6-digit code')
      return
    }
    
    setOtpLoading(true)
    setOtpError('')
    
    try {
      const res = await fetch('/api/student-auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, code: otpCode }),
      })
      
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Invalid code')
      }
      
      // Success - cookies are set by the API, redirect to dashboard
      window.location.href = '/student/dashboard'
    } catch (err: any) {
      setOtpError(err.message)
    } finally {
      setOtpLoading(false)
    }
  }

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
          notes: form.notes,
          date: form.date,
          time: form.time,
          lesson_type: form.lessonType,
          status: 'pending'
        }])

      if (insertError) {
        throw insertError
      }

      // Send booking confirmation email via server-side API route
      const price = form.lessonType === 'single' ? 55 : 45
      const emailResponse = await fetch('/api/email/booking-confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: form.studentName,
          email: form.email,
          date: form.date,
          time: form.time,
          lessonType: form.lessonType,
          price,
          address: form.address
        })
      })

      if (!emailResponse.ok) {
        console.warn('Failed to send booking confirmation email')
        // Continue anyway - booking was created successfully
      }

      // Check if logged in
      if (isLoggedIn) {
        // Already logged in - redirect to dashboard
        window.location.href = '/student/dashboard'
      } else {
        // Not logged in - show email verification modal
        setShowVerifyModal(true)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create booking')
    } finally {
      setLoading(false)
    }
  }

  const getLessonInfo = (id: string) => LESSON_TYPES.find(l => l.id === id) || LESSON_TYPES[0]
  const selectedLesson = getLessonInfo(form.lessonType)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar showLocation={false} />

      {/* Progress */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-center">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  step >= s ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {s < 3 ? s : '✓'}
                </div>
                {s < 3 && <div className={`w-32 h-1 mx-2 ${step > s ? 'bg-primary' : 'bg-gray-200'}`} />}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-600 max-w-xl mx-auto">
            <span className={step >= 1 ? 'text-primary font-medium' : ''}>{t('lessonType')}</span>
            <span className={step >= 2 ? 'text-primary font-medium' : ''}>{t('selectDate')}</span>
            <span className={step >= 3 ? 'text-primary font-medium' : ''}>{t('yourDetails')}</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Step 1: Lesson Type with Images */}
        {step === 1 && (
          <div>
            <h2 className="text-3xl font-bold mb-6 text-center">Choose Your Lesson</h2>
            
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {LESSON_TYPES.map((type) => (
                <div
                  key={type.id}
                  onClick={() => setForm({ ...form, lessonType: type.id })}
                  className={`cursor-pointer transition-all duration-300 ${
                    form.lessonType === type.id
                      ? 'transform scale-[1.02]'
                      : 'hover:transform hover:scale-[1.01]'
                  }`}
                >
                  <div className={`rounded-2xl overflow-hidden border-4 transition-all ${
                    form.lessonType === type.id
                      ? 'border-primary shadow-xl'
                      : 'border-gray-200 shadow-lg hover:shadow-xl'
                  }`}>
                    {/* Image */}
                    <div className="relative h-48 bg-gradient-to-br from-blue-100 to-indigo-100">
                      <Image
                        src={type.image}
                        alt={type.title}
                        fill
                        className="object-contain p-4"
                      />
                      {form.lessonType === type.id && (
                        <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold">
                          Selected
                        </div>
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className="p-6 bg-white">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-xl font-bold">{type.name}</h3>
                          <p className="text-gray-500 text-sm">{type.duration}</p>
                        </div>
                        <div className="text-2xl font-bold text-primary">${type.price}</div>
                      </div>
                      
                      <p className="text-gray-600 text-sm leading-relaxed">{type.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setStep(2)}
                className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-secondary transition font-semibold text-lg"
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Date & Time with Calendar Picker */}
        {step === 2 && (
          <div>
            <h2 className="text-3xl font-bold mb-6 text-center">{t('selectDate')} & {t('selectTime')}</h2>
            
            {/* Date Selection - Calendar Style */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Available Dates</h3>
              <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
                {availableDates.map(({ date, hasSlots }) => {
                  const d = new Date(date)
                  const dayName = d.toLocaleDateString('en-AU', { weekday: 'short' })
                  const dayNum = d.getDate()
                  const monthName = d.toLocaleDateString('en-AU', { month: 'short' })
                  const isSelected = form.date === date
                  const isDisabled = !hasSlots
                  
                  return (
                    <button
                      key={date}
                      disabled={isDisabled}
                      onClick={() => hasSlots && setForm({ ...form, date, time: '' })}
                      className={`p-3 rounded-xl border-2 transition-all text-center ${
                        isSelected
                          ? 'border-primary bg-primary text-white'
                          : isDisabled
                          ? 'border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed'
                          : 'border-gray-200 bg-white hover:border-primary hover:bg-blue-50'
                      }`}
                    >
                      <div className={`text-xs font-medium ${isSelected ? 'text-blue-100' : 'text-gray-500'}`}>
                        {dayName}
                      </div>
                      <div className={`text-lg font-bold ${isSelected ? 'text-white' : ''}`}>
                        {dayNum}
                      </div>
                      <div className={`text-xs ${isSelected ? 'text-blue-100' : 'text-gray-400'}`}>
                        {monthName}
                      </div>
                      {isDisabled && (
                        <div className="text-xs text-gray-400 mt-1">Full</div>
                      )}
                    </button>
                  )
                })}
              </div>
              {form.date && (
                <p className="mt-3 text-sm text-gray-600">
                  Selected: <span className="font-semibold">{formatDate(form.date)}</span>
                </p>
              )}
            </div>

            {/* Time Selection */}
            {form.date && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">
                  Available Times for {formatDate(form.date)}
                </h3>
                {availableSlots.length === 0 ? (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800">
                    No available slots for this date. Please select another date.
                  </div>
                ) : (
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                    {availableSlots.map((slot) => {
                      const isNightTime = slot.time === '8:00 PM'
                      const isSelected = form.time === slot.time
                      
                      return (
                        <button
                          key={slot.id}
                          onClick={() => setForm({ ...form, time: slot.time })}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            isSelected
                              ? 'border-primary bg-primary text-white'
                              : isNightTime
                              ? 'border-purple-300 bg-purple-50 hover:border-purple-400 hover:bg-purple-100'
                              : 'border-gray-200 bg-white hover:border-primary hover:bg-blue-50'
                          }`}
                        >
                          <div className={`font-semibold ${isSelected ? 'text-white' : ''}`}>
                            {slot.time}
                          </div>
                          {isNightTime && !isSelected && (
                            <div className="text-xs text-purple-600 mt-1">🌙 Night Time</div>
                          )}
                          {isNightTime && isSelected && (
                            <div className="text-xs text-purple-200 mt-1">🌙 Night</div>
                          )}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-between">
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

        {/* Step 3: Your Details */}
        {step === 3 && (
          <div>
            <h2 className="text-3xl font-bold mb-6 text-center">{t('yourDetails')}</h2>
            
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('fullName')} *</label>
                  <input
                    type="text"
                    value={form.studentName}
                    onChange={(e) => setForm({ ...form, studentName: e.target.value })}
                    placeholder="Your full name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('email')} *</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">We'll send your booking confirmation here</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('phone')} *</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="0412 345 678"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('address')}</label>
                  <input
                    type="text"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    placeholder="Your address for pickup"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('notes')}
                  </label>
                  <textarea
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    placeholder="e.g. Just failed a test, need to focus on reverse parking..."
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Booking Summary */}
            <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-6 text-white mb-6">
              <h3 className="font-semibold mb-3">Booking Summary</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-blue-200 text-sm">Lesson</p>
                  <p className="font-semibold">{selectedLesson.name}</p>
                </div>
                <div>
                  <p className="text-blue-200 text-sm">Price</p>
                  <p className="font-semibold text-xl">${selectedLesson.price}</p>
                </div>
                <div>
                  <p className="text-blue-200 text-sm">Date</p>
                  <p className="font-semibold">{formatDate(form.date)}</p>
                </div>
                <div>
                  <p className="text-blue-200 text-sm">Time</p>
                  <p className="font-semibold">
                    {form.time}
                    {form.time === '8:00 PM' && ' 🌙'}
                  </p>
                </div>
              </div>
              {form.time === '8:00 PM' && (
                <p className="mt-3 text-sm bg-white/20 rounded-lg p-2">
                  🌙 This is a night time booking - headlights will be used
                </p>
              )}
            </div>

            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 text-red-700">
                {error}
              </div>
            )}

            <div className="flex justify-between">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                ← Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading || !form.studentName || !form.email || !form.phone}
                className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? t('loading') : t('confirmBooking')}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Email Verification Modal */}
      {showVerifyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Verify Your Email</h2>
            <p className="text-gray-600 mb-6">
              We've sent a login code to <strong>{form.email}</strong>. 
              Enter it below to view your booking on your dashboard.
            </p>
            
            {!otpSent ? (
              <button
                onClick={handleSendOTP}
                disabled={otpLoading}
                className="w-full py-3 bg-primary text-white rounded-xl font-semibold hover:bg-secondary transition disabled:opacity-50"
              >
                {otpLoading ? t('loading') : 'Send Login Code'}
              </button>
            ) : (
              <div className="space-y-4">
                <div>
                  <input
                    type="text"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="123456"
                    maxLength={6}
                    className="w-full py-4 text-center text-2xl tracking-widest border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                
                {otpError && (
                  <p className="text-red-500 text-sm">{otpError}</p>
                )}
                {otpSuccess && (
                  <p className="text-green-500 text-sm">{otpSuccess}</p>
                )}
                
                <button
                  onClick={handleVerifyOTP}
                  disabled={otpLoading || otpCode.length < 6}
                  className="w-full py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition disabled:opacity-50"
                >
                  {otpLoading ? t('loading') : t('verify')}
                </button>
                
                <button
                  onClick={handleSendOTP}
                  disabled={otpLoading}
                  className="w-full py-2 text-gray-500 hover:text-gray-700 text-sm"
                >
                  Resend code
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
