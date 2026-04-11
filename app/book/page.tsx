'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import { supabase } from '@/lib/supabase'
import { formatDate, generateTimeSlots, getAvailableSlots, type TimeSlot } from '@/lib/booking-utils'
import { BookingPageSkeleton, TimeSlotSkeleton } from '@/components/Skeletons'
import ErrorBoundary from '@/components/ErrorBoundary'
import { toast } from '@/components/Toast'

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
  const [initialLoading, setInitialLoading] = useState(true)
  const [slotsLoading, setSlotsLoading] = useState(false)
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
  const [promoCode, setPromoCode] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)
  const [promoError, setPromoError] = useState('')

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
    } catch {
      // Silent fail for student details
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
      } catch {
        // Silent fail for bookings
      } finally {
        setInitialLoading(false)
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
    setSlotsLoading(true)
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
    } catch {
      setAvailableSlots([])
    } finally {
      setSlotsLoading(false)
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
      
      // Success - reload page to pick up new login cookies
      // This will show the details form (pre-filled if returning user, blank if new)
      window.location.reload()
    } catch (err: any) {
      setOtpError(err.message)
    } finally {
      setOtpLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (!form.studentName || !form.email || !form.phone || !form.date || !form.time) {
      setError('Please fill in all fields')
      toast('warning', 'Please fill in all required fields')
      return
    }

    setLoading(true)
    setError('')

    try {
      const price = promoApplied ? 0 : (form.lessonType === 'single' ? 55 : 45)
      
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
          status: 'pending',
          price: price,
          promo_code: promoApplied ? 'safedriving' : null
        }])

      if (insertError) {
        throw insertError
      }

      // Send booking confirmation email via server-side API route
      const emailPrice = promoApplied ? 0 : (form.lessonType === 'single' ? 55 : 45)
      const emailResponse = await fetch('/api/email/booking-confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: form.studentName,
          email: form.email,
          date: form.date,
          time: form.time,
          lessonType: form.lessonType,
          price: emailPrice,
          address: form.address,
          promoApplied: promoApplied
        })
      })

      if (!emailResponse.ok) {
        // Continue anyway - booking was created successfully
      }

      // Check if logged in
      if (isLoggedIn) {
        // Already logged in - redirect to dashboard
        toast('success', 'Booking created successfully!')
        window.location.href = '/student/dashboard'
      } else {
        // Not logged in - show email verification modal
        toast('success', 'Booking created! Check your email for confirmation.')
        setShowVerifyModal(true)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create booking')
      toast('error', err.message || 'Failed to create booking')
    } finally {
      setLoading(false)
    }
  }

  const getLessonInfo = (id: string) => LESSON_TYPES.find(l => l.id === id) || LESSON_TYPES[0]
  const selectedLesson = getLessonInfo(form.lessonType)

  // Promo code handler
  const handlePromoSubmit = () => {
    if (promoCode.toLowerCase() === 'safedriving') {
      setPromoApplied(true)
      setPromoError('')
      setForm({ ...form, lessonType: 'single' }) // Default to single when unlocked
      toast('success', 'Promo applied! Lessons are now free.')
    } else {
      setPromoApplied(false)
      setPromoError('Invalid promo code')
    }
  }

  // Get display price
  const getDisplayPrice = (price: number) => promoApplied ? 0 : price

  // Show skeleton while loading initial data
  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navbar showLocation={false} />
        <BookingPageSkeleton />
      </div>
    )
  }

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
            <span className={step >= 1 ? 'text-primary font-medium' : ''}>Lesson Type</span>
            <span className={step >= 2 ? 'text-primary font-medium' : ''}>Date & Time</span>
            <span className={step >= 3 ? 'text-primary font-medium' : ''}>Your Details</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Step 1: Lesson Type with Images */}
        {step === 1 && (
          <div>
            <h2 className="text-3xl font-bold mb-6 text-center">Choose Your Lesson</h2>
            
            {/* Promo Code Box */}
            {!promoApplied && (
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-6 mb-8">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">🎁</span>
                  <h3 className="text-lg font-bold text-amber-800">Have a Promo Code?</h3>
                </div>
                <p className="text-amber-700 text-sm mb-4">
                  Enter your code below to unlock free lessons for your test drive.
                </p>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => {
                      setPromoCode(e.target.value)
                      setPromoError('')
                    }}
                    placeholder="Enter promo code"
                    className="flex-1 px-4 py-3 border-2 border-amber-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 bg-white"
                    onKeyDown={(e) => e.key === 'Enter' && handlePromoSubmit()}
                  />
                  <button
                    onClick={handlePromoSubmit}
                    className="px-6 py-3 bg-amber-500 text-white font-semibold rounded-xl hover:bg-amber-600 transition"
                  >
                    Apply
                  </button>
                </div>
                {promoError && (
                  <p className="text-red-500 text-sm mt-2">{promoError}</p>
                )}
              </div>
            )}

            {promoApplied && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-2xl p-6 mb-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">✅</span>
                    <div>
                      <h3 className="text-lg font-bold text-green-800">Promo Applied!</h3>
                      <p className="text-green-600 text-sm">Lessons are now free. Select below to continue.</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setPromoApplied(false)
                      setPromoCode('')
                      setForm({ ...form, lessonType: 'single' })
                    }}
                    className="text-sm text-green-600 hover:text-green-800 underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
            
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {LESSON_TYPES.map((type) => {
                const isDisabled = !promoApplied
                const isSelected = form.lessonType === type.id
                const displayPrice = getDisplayPrice(type.price)
                
                return (
                  <div
                    key={type.id}
                    onClick={() => !isDisabled && setForm({ ...form, lessonType: type.id })}
                    className={`transition-all duration-300 ${
                      isDisabled 
                        ? 'cursor-not-allowed opacity-60' 
                        : isSelected
                          ? 'cursor-pointer transform scale-[1.02]'
                          : 'cursor-pointer hover:transform hover:scale-[1.01]'
                    }`}
                  >
                    <div className={`rounded-2xl overflow-hidden border-4 transition-all ${
                      isSelected && promoApplied
                        ? 'border-primary shadow-xl'
                        : isDisabled
                        ? 'border-gray-300 shadow-md'
                        : 'border-gray-200 shadow-lg hover:shadow-xl'
                    }`}>
                      {/* Image */}
                      <div className={`relative h-48 bg-gradient-to-br ${
                        isDisabled ? 'from-gray-100 to-gray-200' : 'from-blue-100 to-indigo-100'
                      }`}>
                        <Image
                          src={type.image}
                          alt={type.title}
                          fill
                          className="object-contain p-4"
                        />
                        {isSelected && promoApplied && (
                          <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold">
                            Selected
                          </div>
                        )}
                        {isDisabled && (
                          <div className="absolute inset-0 bg-gray-900/20 flex items-center justify-center">
                            <div className="bg-white/90 px-4 py-2 rounded-lg text-center">
                              <p className="text-sm font-semibold text-gray-600">🔒 Enter promo code</p>
                              <p className="text-xs text-gray-500">to unlock</p>
                            </div>
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
                          <div className={`text-2xl font-bold ${isDisabled ? 'text-gray-400' : 'text-primary'}`}>
                            {promoApplied ? (
                              <span className="text-green-600">$0</span>
                            ) : (
                              <>${type.price}</>
                            )}
                          </div>
                        </div>
                        
                        <p className="text-gray-600 text-sm leading-relaxed">{type.description}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setStep(2)}
                disabled={!promoApplied}
                className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-secondary transition font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Date & Time with Calendar Picker */}
        {step === 2 && (
          <div>
            <h2 className="text-3xl font-bold mb-6 text-center">Select Date & Time</h2>
            
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
                {slotsLoading ? (
                  <TimeSlotSkeleton count={8} />
                ) : availableSlots.length === 0 ? (
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
            {!isLoggedIn ? (
              <>
                <h2 className="text-3xl font-bold mb-6 text-center">Log in to Complete Booking</h2>
                
                {/* Login Card */}
                <div className="max-w-md mx-auto">
                  <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-primary to-secondary p-6 text-center text-white">
                      <div className="text-4xl mb-2">🔐</div>
                      <h3 className="text-xl font-bold">Save Your Booking</h3>
                      <p className="text-blue-100 text-sm mt-1">
                        Sign in to securely save your lesson and receive reminders
                      </p>
                    </div>
                    
                    {/* Form */}
                    <div className="p-6">
                      {!otpSent ? (
                        <>
                          <p className="text-gray-600 text-sm mb-4 text-center">
                            Enter your email and we'll send you a login code
                          </p>
                          <div className="space-y-4">
                            <div>
                              <input
                                type="email"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                placeholder="your@email.com"
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-0 text-center"
                              />
                            </div>
                            
                            {otpError && (
                              <div className="bg-red-50 text-red-600 text-sm px-4 py-2 rounded-lg text-center">
                                {otpError}
                              </div>
                            )}
                            
                            <button
                              onClick={handleSendOTP}
                              disabled={otpLoading || !form.email}
                              className="w-full py-3 bg-primary text-white rounded-xl font-semibold hover:bg-secondary transition disabled:opacity-50"
                            >
                              {otpLoading ? (
                                <span>Sending...</span>
                              ) : (
                                <span>Send Login Code</span>
                              )}
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="text-center mb-4">
                            <p className="text-green-600 font-medium">✓ Code sent!</p>
                            <p className="text-gray-500 text-sm">Check your email (and spam folder)</p>
                          </div>
                          
                          <div className="space-y-4">
                            <div>
                              <input
                                type="text"
                                value={otpCode}
                                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                placeholder="● ● ● ● ● ●"
                                maxLength={6}
                                className="w-full py-4 text-center text-2xl tracking-[0.5em] border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-0"
                              />
                            </div>
                            
                            {otpError && (
                              <div className="bg-red-50 text-red-600 text-sm px-4 py-2 rounded-lg text-center">
                                {otpError}
                              </div>
                            )}
                            
                            <button
                              onClick={handleVerifyOTP}
                              disabled={otpLoading || otpCode.length < 6}
                              className="w-full py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition disabled:opacity-50"
                            >
                              {otpLoading ? 'Verifying...' : 'Verify & Continue'}
                            </button>
                            
                            <button
                              onClick={handleSendOTP}
                              disabled={otpLoading}
                              className="w-full text-sm text-gray-500 hover:text-gray-700 py-2"
                            >
                              Didn't receive it? Resend code
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-3xl font-bold mb-6 text-center">Your Details</h2>
                
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                      <input
                        type="text"
                        value={form.studentName}
                        onChange={(e) => setForm({ ...form, studentName: e.target.value })}
                        placeholder="Your full name"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                      <input
                        type="email"
                        value={form.email}
                        disabled
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-600"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="0412 345 678"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Address</label>
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
                        Notes for instructor (optional)
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
              </>
            )}

            {/* Only show booking summary and confirm button when logged in */}
            {isLoggedIn && (
              <>
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
                      <p className="font-semibold text-xl">
                        {promoApplied ? (
                          <span className="text-green-300">$0</span>
                        ) : (
                          <>${selectedLesson.price}</>
                        )}
                      </p>
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
                    {loading ? 'Submitting...' : 'Confirm Booking'}
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Email Verification Modal */}
      {showVerifyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Verify Your Email</h2>
            <p className="text-gray-600 mb-4">
              Your booking was created! Enter the login code sent to <strong>{form.email}</strong> to view your dashboard.
            </p>
            {otpSuccess && (
              <div className="bg-green-50 text-green-700 text-sm px-4 py-2 rounded-lg mb-4">
                ✓ Login code sent! Check your email (and spam folder).
              </div>
            )}
            {otpError && (
              <div className="bg-red-50 text-red-700 text-sm px-4 py-2 rounded-lg mb-4">
                {otpError}
              </div>
            )}
            
            {!otpSent ? (
              <button
                onClick={handleSendOTP}
                disabled={otpLoading}
                className="w-full py-3 bg-primary text-white rounded-xl font-semibold hover:bg-secondary transition disabled:opacity-50"
              >
                {otpLoading ? 'Sending...' : 'Send Login Code'}
              </button>
            ) : (
              <div className="space-y-4">
                <div>
                  <input
                    type="text"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                    className="w-full py-4 text-center text-2xl tracking-widest border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                
                <button
                  onClick={handleVerifyOTP}
                  disabled={otpLoading || otpCode.length < 6}
                  className="w-full py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition disabled:opacity-50"
                >
                  {otpLoading ? 'Verifying...' : 'Verify & View Dashboard'}
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
