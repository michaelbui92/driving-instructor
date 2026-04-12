'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { logout } from '@/lib/auth'
import { supabase as globalSupabase, type Booking as SupabaseBooking } from '@/lib/supabase'
import { createClient, RealtimeChannel } from '@supabase/supabase-js'
import {
  formatDate,
  getLessonTypeName,
  getLessonPrice,
  generateTimeSlots,
  getAvailableSlots,
  shouldBlockSlot,
  type Booking,
  type BlockedSlot,
  RuleType,
  DayType,
  RepeatType,
  type AvailabilityRule,
  getRulesAsync,
  addRuleAsync,
  updateRuleAsync,
  deleteRuleAsync,
  toggleRuleAsync,
  getBlockedSlotsAsync,
  addBlockedSlotAsync,
  removeBlockedSlotAsync,
  cleanupPastBlocksAsync
} from '@/lib/booking-utils'
import { authenticatedFetch } from '@/lib/instructor-api'
import { toast } from '@/components/Toast'
import InstructorStudentsTab from '@/components/InstructorStudentsTab'

type TabType = 'bookings' | 'schedule' | 'calendar' | 'students'

interface InstructorProfile {
  id: string
  bio: string
  experience: string
  teaching_philosophy: string
  car_details: string
  service_area: string
}

interface ProfileFormData {
  bio: string
  experience: string
  teaching_philosophy: string
  car_details: string
  service_area: string
}

// Helper function to convert 24h time "HH:MM:SS" or "HH:MM" to "H:MM AM/PM" format
function formatTimeForDisplay(time: string | undefined): string {
  if (!time) return ''
  // Handle "09:00:00" or "09:00" format
  const parts = time.split(':')
  if (parts.length < 2) return time
  
  let hours = parseInt(parts[0])
  const minutes = parts[1]
  const period = hours >= 12 ? 'PM' : 'AM'
  hours = hours % 12 || 12
  
  return `${hours}:${minutes} ${period}`
}

interface RuleFormData {
  name: string
  type: RuleType
  priority: number
  dayType: DayType
  startTime: string
  endTime: string
  maxBookings: number
  repeatType: RepeatType
}

// Booking type from Supabase (snake_case from database)
interface SupabaseBookingRecord {
  id: string
  student_name: string
  email: string
  phone: string
  date: string
  time: string
  lesson_type: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  created_at: string
  archived?: boolean
  originalDate?: string
  previousDate?: string
  rescheduleHistory?: Array<{ date: string; time: string; changedAt: string }>
}

export default function InstructorPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [selectedTab, setSelectedTab] = useState<TabType>('bookings')
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [actionLoading, setActionLoading] = useState(false) // Prevents rapid actions
  const [blockedSlots, setBlockedSlots] = useState<BlockedSlot[]>([])
  const [selectedBlockDate, setSelectedBlockDate] = useState<string>('')
  const [selectedBlockTimes, setSelectedBlockTimes] = useState<string[]>([])
  const [showArchived, setShowArchived] = useState(false)
  const [instructorNotes, setInstructorNotes] = useState('')
  const [bookingsView, setBookingsView] = useState<'upcoming' | 'all'>('upcoming')
  const [notesSaving, setNotesSaving] = useState(false)
  
  // Bulk blocking state
  const [bulkMode, setBulkMode] = useState<'none' | 'weekdays' | 'weekends' | 'daterange'>('none')
  const [bulkStartDate, setBulkStartDate] = useState<string>('')
  const [bulkEndDate, setBulkEndDate] = useState<string>('')

  // Email filter state
  const [emailFilter, setEmailFilter] = useState<string>('')

  // Calendar state
  const [calendarMonth, setCalendarMonth] = useState<number>(new Date().getMonth())
  const [calendarYear, setCalendarYear] = useState<number>(new Date().getFullYear())

  // Rules management state
  const [rules, setRules] = useState<AvailabilityRule[]>([])
  const [showRuleForm, setShowRuleForm] = useState(false)
  const [editingRule, setEditingRule] = useState<AvailabilityRule | null>(null)

  // Instructor profile state
  const [instructorProfile, setInstructorProfile] = useState<InstructorProfile | null>(null)
  const [profileForm, setProfileForm] = useState<ProfileFormData>({
    bio: '',
    experience: '',
    teaching_philosophy: '',
    car_details: '',
    service_area: ''
  })
  const [editingProfile, setEditingProfile] = useState(false)
  const [savingProfile, setSavingProfile] = useState(false)
  const [ruleForm, setRuleForm] = useState<RuleFormData>({
    name: '',
    type: RuleType.TIME_BLOCK,
    priority: 10,
    dayType: DayType.ALL_DAYS,
    startTime: '9:00 AM',
    endTime: '5:00 PM',
    maxBookings: 1,
    repeatType: RepeatType.REPEATING
  })

  // Booking creation form state
  const [bookingForm, setBookingForm] = useState({
    studentName: '',
    email: '',
    phone: '',
    date: '',
    time: '9:00 AM',
    lessonType: 'single'
  })
  const [creatingBooking, setCreatingBooking] = useState(false)
  const [availableTimes, setAvailableTimes] = useState<string[]>([])

  // Supabase status for debugging
  const [supabaseStatus, setSupabaseStatus] = useState<string>('Connecting...')

  // Supabase client - DIRECT initialization (same pattern as test booking page)
  // Use the centralized supabase client from lib/supabase.ts to ensure consistency
  const supabaseUrl = typeof window !== 'undefined' ? process.env.NEXT_PUBLIC_SUPABASE_URL : undefined
  const supabaseKey = typeof window !== 'undefined' ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY : undefined
  
  // Initialize supabase client - use centralized lib/supabase.ts client
  // This ensures consistency with addRuleAsync and other functions that use the centralized client
  const supabase = (() => {
    if (typeof window === 'undefined') return null
    if (!supabaseUrl || !supabaseKey) {
      return null
    }
    return globalSupabase
  })()
  const subscriptionRef = useRef<RealtimeChannel | null>(null)

  // Load bookings function using DIRECT Supabase queries (matching test booking page pattern)
  const loadBookings = async () => {
    if (!supabase) {
      console.error('Supabase client not available')
      return
    }
    
    try {
      const { data, error } = await supabase
        .from('bookings_new')
        .select('*')
        .order('date', { ascending: false })

      if (error) {
        console.error('Error loading bookings:', error)
        setSupabaseStatus(`Error: ${error.message}`)
        return
      }

      // Convert to app format (snake_case from DB -> camelCase for app)
      const formatted: Booking[] = ((data as SupabaseBookingRecord[]) || []).map((b) => ({
        id: b.id,
        studentName: b.student_name || '',
        email: b.email || '',
        phone: b.phone || '',
        date: b.date || '',
        time: b.time || '',
        lessonType: b.lesson_type || 'single',
        status: b.status || 'pending',
        price: getLessonPrice(b.lesson_type || 'single'),
        createdAt: b.created_at || '',
        archived: b.archived || false,
        originalDate: b.originalDate,
        previousDate: b.previousDate,
        rescheduleHistory: b.rescheduleHistory,
      }))
      setBookings(formatted)
      setSupabaseStatus(`✅ Connected (${data?.length || 0} bookings)`)
    } catch (error) {
      console.error('Error loading bookings:', error)
      setBookings([])
      setSupabaseStatus(`Error: ${error}`)
    }
  }

  // Sync instructor notes when selected booking changes
  useEffect(() => {
    if (selectedBooking) {
      setInstructorNotes(selectedBooking.instructor_notes || '')
    }
  }, [selectedBooking])

  // Load bookings on mount and set up real-time subscription
  useEffect(() => {
    loadBookings()
    
    // Load rules and blocked slots from Supabase
    const loadRulesAndSlots = async () => {
      try {
        // Clean up past blocks first (non-blocking - we don't need to wait for it)
        cleanupPastBlocksAsync().catch(err => {
          console.warn('Failed to cleanup past blocks (non-critical):', err)
        })
        
        const [rulesData, blockedSlotsData] = await Promise.all([
          getRulesAsync(),
          getBlockedSlotsAsync()
        ])
        setRules(rulesData)
        setBlockedSlots(blockedSlotsData)
      } catch (error) {
        console.error('Error loading rules or blocked slots:', error)
      }
    }
    loadRulesAndSlots()
    
    // Set up real-time subscription for database changes (matching test booking page)
    if (supabase) {
      // Clean up any existing subscription
      if (subscriptionRef.current) {
        supabase.removeChannel(subscriptionRef.current)
      }
      
      // Subscribe to changes on bookings_new table
      subscriptionRef.current = supabase
        .channel('instructor-bookings-changes')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'bookings_new' },
          () => {
            // Reload bookings on any change
            loadBookings()
          }
        )
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            setSupabaseStatus(prev => prev.includes('✅') ? '✅ Connected (subscribed)' : prev)
          }
        })
    }
    
    // Auto-refresh every 30 seconds as backup (in addition to real-time)
    const interval = setInterval(() => {
      loadBookings()
    }, 30000)
    
    return () => {
      clearInterval(interval)
      if (subscriptionRef.current && supabase) {
        supabase.removeChannel(subscriptionRef.current)
      }
    }
  }, [])

  // Load instructor profile from Supabase
  useEffect(() => {
    async function loadProfile() {
      try {
        const { data, error } = await globalSupabase
          .from('instructor_profile')
          .select('*')
          .single()

        if (error) {
          console.error('Error loading profile:', error)
          return
        }

        setInstructorProfile(data)
        setProfileForm({
          bio: data.bio || '',
          experience: data.experience || '',
          teaching_philosophy: data.teaching_philosophy || '',
          car_details: data.car_details || '',
          service_area: data.service_area || ''
        })
      } catch (error) {
        console.error('Error loading profile:', error)
      }
    }
    loadProfile()
  }, [])

  const today = new Date().toISOString().split('T')[0]
  const todayBookings = bookings.filter(b => b.date === today && b.status !== 'cancelled' && !b.archived)
  const upcomingBookings = bookings.filter(b => b.date > today && (b.status === 'pending' || b.status === 'confirmed') && !b.archived)
  const allBookings = bookings.filter(b => !b.archived).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  const archivedBookings = bookings.filter(b => b.archived).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const getFilteredBookings = () => {
    if (bookingsView === 'upcoming') {
      return [...todayBookings, ...upcomingBookings]
    }
    if (bookingsView === 'all') {
      if (emailFilter.trim() === '') return allBookings
      const filterLower = emailFilter.toLowerCase()
      return allBookings.filter(b =>
        b.email.toLowerCase().includes(filterLower) ||
        b.studentName.toLowerCase().includes(filterLower) ||
        b.phone.includes(emailFilter)
      )
    }
    return []
  }

  // UPDATE BOOKING STATUS using API route (sends emails for confirm/cancel)
  const updateBookingStatus = async (bookingId: string, newStatus: Booking['status']) => {
    if (actionLoading || !supabase) return // Prevent rapid actions
    setActionLoading(true)
    
    try {
      // OPTIMISTIC UPDATE: Update local state immediately for instant feedback
      setBookings(prev => prev.map(b => 
        b.id === bookingId ? { ...b, status: newStatus } : b
      ))
      
      // Call API route which handles emails
      const response = await authenticatedFetch(`/api/instructor/bookings/${bookingId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })

      const data = await response.json()

      if (!response.ok) {
        // Rollback on error
        await loadBookings()
        throw new Error(data.error || 'Failed to update status')
      }

      toast('success', `Booking status updated to ${newStatus}`)

    } catch (error: any) {
      toast('error', 'Error updating booking status. Please try again.')
      // Reload to ensure sync
      await loadBookings()
    } finally {
      setActionLoading(false)
    }
  }

  // UPDATE INSTRUCTOR NOTES
  const saveInstructorNotes = async (bookingId: string) => {
    if (!supabase) return
    setNotesSaving(true)
    try {
      const { error } = await supabase
        .from('bookings_new')
        .update({ instructor_notes: instructorNotes })
        .eq('id', bookingId)

      if (error) throw new Error(error.message)

      // Update local state
      setBookings(prev => prev.map(b =>
        b.id === bookingId ? { ...b, instructor_notes: instructorNotes } : b
      ))
      setSelectedBooking(prev => prev ? { ...prev, instructor_notes: instructorNotes } : null)
      toast('success', 'Notes saved!')
    } catch (error: any) {
      toast('error', 'Failed to save notes. Please try again.')
    } finally {
      setNotesSaving(false)
    }
  }

  // DELETE BOOKING using DIRECT Supabase query (replacing API route)
  const deleteBooking = async (bookingId: string) => {
    if (actionLoading || !supabase) return // Prevent rapid actions
    if (!confirm('⚠️ WARNING: This will permanently delete the booking. This action cannot be undone.\n\nAre you sure you want to delete this booking?')) {
      return
    }

    // Store previous state for rollback
    const previousBookings = [...bookings]
    
    // OPTIMISTIC UPDATE: Remove from UI immediately
    const updatedBookings = bookings.filter(b => b.id !== bookingId)
    setBookings(updatedBookings)
    setSelectedBooking(null)
    setActionLoading(true)
    
    try {
      // DIRECT Supabase query (matching test booking page pattern)
      const { error } = await supabase
        .from('bookings_new')
        .delete()
        .eq('id', bookingId)

      if (error) {
        throw new Error(error.message || 'Failed to delete booking')
      }

      toast('success', 'Booking deleted successfully')
    } catch (error: any) {
      // ROLLBACK on error - restore previous state
      setBookings(previousBookings)
      toast('error', `Error deleting booking: ${error.message}. Please try again.`)
    } finally {
      setActionLoading(false)
    }
  }

  const archiveBooking = async (bookingId: string) => {
    if (!supabase) return
    
    try {
      const booking = bookings.find(b => b.id === bookingId)
      if (!booking) return

      const newArchived = !booking.archived
      const { error } = await supabase
        .from('bookings_new')
        .update({ archived: newArchived })
        .eq('id', bookingId)

      if (error) {
        throw error
      }

      const updatedBookings = bookings.map(b => 
        b.id === bookingId ? { ...b, archived: !b.archived } : b
      )
      setBookings(updatedBookings)
      toast('success', booking.archived ? 'Booking unarchived successfully' : 'Booking archived successfully')
    } catch (error) {
      toast('error', 'Error archiving booking. Please try again.')
    }
  }

  const getTotalRevenue = () => bookings.filter(b => b.status === 'completed').reduce((sum, b) => sum + b.price, 0)
  const getPendingRevenue = () => bookings.filter(b => b.status !== 'cancelled').reduce((sum, b) => sum + b.price, 0)

  // Fetch available times for booking form
  const fetchAvailableTimes = async (date: string) => {
    try {
      const res = await fetch(`/api/availability?date=${date}`)
      if (res.ok) {
        const data = await res.json()
        setAvailableTimes(data.availableSlots || [])
      }
    } catch (error) {
      console.error('Error fetching availability:', error)
    }
  }

  // Handle booking form date change
  const handleBookingDateChange = (date: string) => {
    setBookingForm({ ...bookingForm, date, time: '9:00 AM' })
    fetchAvailableTimes(date)
  }

  // Create booking handler using API route (auto-confirms and sends email)
  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!bookingForm.studentName || !bookingForm.date || !bookingForm.time) {
      toast('warning', 'Please fill in student name, date, and time')
      return
    }

    setCreatingBooking(true)
    
    try {
      const response = await authenticatedFetch('/api/instructor/bookings/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: bookingForm.studentName,
          email: bookingForm.email,
          phone: bookingForm.phone,
          date: bookingForm.date,
          time: bookingForm.time,
          lessonType: bookingForm.lessonType
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create booking')
      }

      toast('success', data.message || `Booking created and confirmed for ${bookingForm.studentName} on ${formatDate(bookingForm.date)} at ${bookingForm.time}`)
      
      // Reset form
      setBookingForm({
        studentName: '',
        email: '',
        phone: '',
        date: '',
        time: '9:00 AM',
        lessonType: 'single'
      })
      setAvailableTimes([])
      
      // Refresh bookings list
      await loadBookings()
      
      // Switch to upcoming tab
      setSelectedTab('bookings')
      setBookingsView('upcoming')
    } catch (error: any) {
      toast('error', `Error creating booking: ${error.message}`)
    } finally {
      setCreatingBooking(false)
    }
  }

  const handleBlockSlot = async () => {
    if (!selectedBlockDate || selectedBlockTimes.length === 0) {
      toast('warning', 'Please select a date and at least one time slot to block')
      return
    }
    try {
      // Add all blocked slots asynchronously
      await Promise.all(
        selectedBlockTimes.map(time => addBlockedSlotAsync(selectedBlockDate, time))
      )
      const updatedSlots = await getBlockedSlotsAsync()
      setBlockedSlots(updatedSlots)
      setSelectedBlockTimes([])
      toast('success', `Blocked ${selectedBlockTimes.length} time slot(s) successfully`)
    } catch (error) {
      toast('error', 'Error blocking slots. Please try again.')
    }
  }

  const handleUnblockSlot = async (date: string, time: string) => {
    try {
      await removeBlockedSlotAsync(date, time)
      const updatedSlots = await getBlockedSlotsAsync()
      setBlockedSlots(updatedSlots)
      toast('success', 'Slot unblocked successfully')
    } catch (error) {
      toast('error', 'Error unblocking slot. Please try again.')
    }
  }

  const handleBulkBlock = async () => {
    if (bulkMode === 'none') return
    
    try {
      const slots = generateTimeSlots()
      let blockedCount = 0
      const blockPromises: Promise<void>[] = []
      
      if (bulkMode === 'weekdays') {
        // Block all weekdays EXCEPT 6pm, 7pm, 8pm
        const allowedTimes = ['6:00 PM', '7:00 PM', '8:00 PM']
        slots.forEach(slot => {
          const dateObj = new Date(slot.date)
          const dayOfWeek = dateObj.getDay()
          const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
          
          if (!isWeekend && !allowedTimes.includes(slot.time)) {
            blockPromises.push(addBlockedSlotAsync(slot.date, slot.time))
            blockedCount++
          }
        })
      } else if (bulkMode === 'weekends') {
        // Block all weekends EXCEPT 6pm, 7pm, 8pm
        const allowedTimes = ['6:00 PM', '7:00 PM', '8:00 PM']
        slots.forEach(slot => {
          const dateObj = new Date(slot.date)
          const dayOfWeek = dateObj.getDay()
          const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
          
          if (isWeekend && !allowedTimes.includes(slot.time)) {
            blockPromises.push(addBlockedSlotAsync(slot.date, slot.time))
            blockedCount++
          }
        })
      } else if (bulkMode === 'daterange') {
        if (!bulkStartDate || !bulkEndDate) {
          toast('warning', 'Please select start and end dates')
          return
        }
        // Block all slots in range EXCEPT 6pm, 7pm, 8pm
        const allowedTimes = ['6:00 PM', '7:00 PM', '8:00 PM']
        slots.forEach(slot => {
          if (slot.date >= bulkStartDate && slot.date <= bulkEndDate) {
            if (!allowedTimes.includes(slot.time)) {
              blockPromises.push(addBlockedSlotAsync(slot.date, slot.time))
              blockedCount++
            }
          }
        })
      }
      
      // Wait for all block operations to complete
      await Promise.all(blockPromises)
      const updatedSlots = await getBlockedSlotsAsync()
      setBlockedSlots(updatedSlots)
      toast('success', `Blocked ${blockedCount} time slot(s). Remaining slots: 6pm, 7pm, 8pm.`)
      setBulkMode('none')
    } catch (error) {
      toast('error', 'Error blocking slots. Please try again.')
    }
  }

  const getTimeSlotsForDate = (date: string): string[] => {
    // For manual blocking, show only slots that are NOT blocked by rules
    // This uses getAvailableSlots logic to determine which times CAN be blocked
    const availableSlots = getAvailableSlots(date, [])
    // Get all possible slots for this date
    const allSlots = generateTimeSlots().filter(slot => slot.date === date).map(slot => slot.time)
    // Only show slots that are available (not blocked by rules)
    const availableTimes = availableSlots.map(slot => slot.time)
    // Return all slots that are available in terms of rules
    return allSlots
  }

  const isSlotBlockedByRule = (date: string, time: string): boolean => {
    // Check if this slot is blocked by any availability rule
    return shouldBlockSlot(date, time, [])
  }

  const isSlotBlocked = (date: string, time: string): boolean => {
    return blockedSlots.some(b => b.date === date && b.time === time)
  }

  // ============== Rules Management Functions ==============
  const handleCreateRule = async () => {
    try {
      // Validation
      if (!ruleForm.name.trim()) {
        toast('warning', 'Please enter a rule name')
        return
      }

      if (ruleForm.priority < 1 || ruleForm.priority > 100) {
        toast('warning', 'Priority must be between 1 and 100')
        return
      }

      if ((ruleForm.type === RuleType.TIME_BLOCK || ruleForm.type === RuleType.EXCEPTION)) {
        if (!ruleForm.startTime || !ruleForm.endTime) {
          toast('warning', 'Please enter both start and end times for this rule type')
          return
        }
      }

      if (ruleForm.type === RuleType.MAX_BOOKING && ruleForm.maxBookings < 1) {
        toast('warning', 'Max bookings must be at least 1')
        return
      }

      // Create rule
      const newRule: Omit<AvailabilityRule, 'id' | 'createdAt'> = {
        name: ruleForm.name,
        type: ruleForm.type,
        priority: ruleForm.priority,
        dayType: ruleForm.dayType,
        repeatType: ruleForm.repeatType,
        startTime: (ruleForm.type === RuleType.TIME_BLOCK || ruleForm.type === RuleType.EXCEPTION) ? ruleForm.startTime : undefined,
        endTime: (ruleForm.type === RuleType.TIME_BLOCK || ruleForm.type === RuleType.EXCEPTION) ? ruleForm.endTime : undefined,
        maxBookings: ruleForm.type === RuleType.MAX_BOOKING ? ruleForm.maxBookings : undefined,
        enabled: true
      }

      const ruleId = await addRuleAsync(newRule)
      const updatedRules = await getRulesAsync()
      setRules(updatedRules)
      setShowRuleForm(false)
      resetRuleForm()
      toast('success', 'Rule created successfully!')
    } catch (error: any) {
      const errorMessage = error?.message || error?.details || JSON.stringify(error)
      toast('error', `Error creating rule: ${errorMessage}`)
    }
  }

  const handleUpdateRule = async (id: string) => {
    try {
      // Validation (same as create)
      if (!ruleForm.name.trim()) {
        toast('warning', 'Please enter a rule name')
        return
      }

      if (ruleForm.priority < 1 || ruleForm.priority > 100) {
        toast('warning', 'Priority must be between 1 and 100')
        return
      }

      if ((ruleForm.type === RuleType.TIME_BLOCK || ruleForm.type === RuleType.EXCEPTION)) {
        if (!ruleForm.startTime || !ruleForm.endTime) {
          toast('warning', 'Please enter both start and end times for this rule type')
          return
        }
      }

      if (ruleForm.type === RuleType.MAX_BOOKING && ruleForm.maxBookings < 1) {
        toast('warning', 'Max bookings must be at least 1')
        return
      }

      await updateRuleAsync(id, {
        name: ruleForm.name,
        type: ruleForm.type,
        priority: ruleForm.priority,
        dayType: ruleForm.dayType,
        repeatType: ruleForm.repeatType,
        startTime: (ruleForm.type === RuleType.TIME_BLOCK || ruleForm.type === RuleType.EXCEPTION) ? ruleForm.startTime : undefined,
        endTime: (ruleForm.type === RuleType.TIME_BLOCK || ruleForm.type === RuleType.EXCEPTION) ? ruleForm.endTime : undefined,
        maxBookings: ruleForm.type === RuleType.MAX_BOOKING ? ruleForm.maxBookings : undefined
      })

      const updatedRules = await getRulesAsync()
      setRules(updatedRules)
      setShowRuleForm(false)
      setEditingRule(null)
      resetRuleForm()
      toast('success', 'Rule updated successfully!')
    } catch (error) {
      toast('error', 'Error updating rule. Please try again.')
    }
  }

  const handleDeleteRule = async (id: string) => {
    if (confirm('Are you sure you want to delete this rule?')) {
      try {
        await deleteRuleAsync(id)
        const updatedRules = await getRulesAsync()
        setRules(updatedRules)
        toast('success', 'Rule deleted successfully!')
      } catch (error) {
        toast('error', 'Error deleting rule. Please try again.')
      }
    }
  }

  const handleSaveProfile = async () => {
    setSavingProfile(true)
    try {
      const { error } = await globalSupabase
        .from('instructor_profile')
        .update({
          bio: profileForm.bio,
          experience: profileForm.experience,
          teaching_philosophy: profileForm.teaching_philosophy,
          car_details: profileForm.car_details,
          service_area: profileForm.service_area,
          updated_at: new Date().toISOString()
        })
        .eq('id', instructorProfile?.id || '')

      if (error) {
        throw error
      }

      setInstructorProfile({
        ...instructorProfile!,
        ...profileForm
      })
      setEditingProfile(false)
      toast('success', 'Profile updated successfully!')
    } catch (error) {
      toast('error', 'Error saving profile. Please try again.')
    }
    setSavingProfile(false)
  }

  const handleToggleRule = async (id: string, enabled: boolean) => {
    try {
      await toggleRuleAsync(id, enabled)
      const updatedRules = await getRulesAsync()
      setRules(updatedRules)
    } catch (error) {
      toast('error', 'Error toggling rule. Please try again.')
    }
  }

  const startEditRule = (rule: AvailabilityRule) => {
    setEditingRule(rule)
    setRuleForm({
      name: rule.name,
      type: rule.type,
      priority: rule.priority,
      dayType: rule.dayType,
      startTime: rule.startTime || '9:00 AM',
      endTime: rule.endTime || '5:00 PM',
      maxBookings: rule.maxBookings || 1,
      repeatType: rule.repeatType
    })
    setShowRuleForm(true)
  }

  const resetRuleForm = () => {
    setRuleForm({
      name: '',
      type: RuleType.TIME_BLOCK,
      priority: 10,
      dayType: DayType.ALL_DAYS,
      startTime: '9:00 AM',
      endTime: '5:00 PM',
      maxBookings: 1,
      repeatType: RepeatType.REPEATING
    })
  }

  const sortedRules = rules.sort((a, b) => a.priority - b.priority)

  const renderProfileTab = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Instructor Profile</h2>
        {!editingProfile && (
          <button
            onClick={() => setEditingProfile(true)}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition"
          >
            Edit Profile
          </button>
        )}
      </div>
      
      <p className="text-gray-600 mb-6">
        This information is displayed on the public instructor profile page. Keep it up to date to attract new students.
      </p>

      <div className="bg-white rounded-xl shadow-lg p-6">
        {editingProfile ? (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
              <textarea
                value={profileForm.bio}
                onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Tell students about yourself..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
              <textarea
                value={profileForm.experience}
                onChange={(e) => setProfileForm({ ...profileForm, experience: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Describe your teaching experience..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Teaching Philosophy</label>
              <textarea
                value={profileForm.teaching_philosophy}
                onChange={(e) => setProfileForm({ ...profileForm, teaching_philosophy: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="What is your approach to teaching?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Car Details</label>
              <input
                type="text"
                value={profileForm.car_details}
                onChange={(e) => setProfileForm({ ...profileForm, car_details: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="e.g., Automatic transmission, dual controls"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Service Area</label>
              <input
                type="text"
                value={profileForm.service_area}
                onChange={(e) => setProfileForm({ ...profileForm, service_area: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="e.g., Lidcombe and surrounding suburbs"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={handleSaveProfile}
                disabled={savingProfile}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-secondary disabled:opacity-50 transition"
              >
                {savingProfile ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={() => {
                  setEditingProfile(false)
                  if (instructorProfile) {
                    setProfileForm({
                      bio: instructorProfile.bio || '',
                      experience: instructorProfile.experience || '',
                      teaching_philosophy: instructorProfile.teaching_philosophy || '',
                      car_details: instructorProfile.car_details || '',
                      service_area: instructorProfile.service_area || ''
                    })
                  }
                }}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Bio</h3>
              <p className="text-gray-900">{instructorProfile?.bio || 'Not set'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Experience</h3>
              <p className="text-gray-900">{instructorProfile?.experience || 'Not set'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Teaching Philosophy</h3>
              <p className="text-gray-900">{instructorProfile?.teaching_philosophy || 'Not set'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Car Details</h3>
              <p className="text-gray-900">{instructorProfile?.car_details || 'Not set'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Service Area</h3>
              <p className="text-gray-900">{instructorProfile?.service_area || 'Not set'}</p>
            </div>
            <div className="pt-4 border-t">
              <a
                href="/instructor-profile"
                target="_blank"
                className="text-primary hover:underline"
              >
                View public profile →
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )

  const renderRulesTab = () => (
    <div>
      <h2 className="text-2xl font-bold mb-6">Availability Rules</h2>
      <p className="text-gray-600 mb-6">
        Rules allow you to create automatic blocking patterns. Rules with lower priority numbers are applied first.
        Time Blocks block time ranges, while Exceptions override Time Blocks to allow specific times.
      </p>

      {!showRuleForm && (
        <button
          onClick={() => { setShowRuleForm(true); resetRuleForm(); }}
          className="mb-6 px-6 py-3 bg-primary text-white rounded-lg hover:bg-secondary transition font-semibold shadow-md"
        >
          + Create New Rule
        </button>
      )}

      {showRuleForm && (
        <div className="bg-white border-2 border-primary rounded-xl p-6 mb-6 shadow-lg">
          <h3 className="text-xl font-bold mb-4">
            {editingRule ? 'Edit Rule' : 'Create New Rule'}
          </h3>

          <div className="grid gap-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rule Name *</label>
              <input
                type="text"
                value={ruleForm.name}
                onChange={(e) => setRuleForm({ ...ruleForm, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="e.g., Block 9am-5pm on weekdays"
              />
            </div>

            {/* Rule Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rule Type</label>
              <select
                value={ruleForm.type}
                onChange={(e) => setRuleForm({ ...ruleForm, type: e.target.value as RuleType })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value={RuleType.TIME_BLOCK}>🚫 Time Block (block time range)</option>
                <option value={RuleType.EXCEPTION}>✅ Exception (allow specific time)</option>
                <option value={RuleType.MAX_BOOKING}>📊 Max Bookings (limit bookings per day)</option>
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority * (1 = highest, 100 = lowest)</label>
              <input
                type="number"
                min="1"
                max="100"
                value={ruleForm.priority}
                onChange={(e) => setRuleForm({ ...ruleForm, priority: parseInt(e.target.value) || 1 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">Lower numbers are evaluated first. Use priorities to layer rules.</p>
            </div>

            {/* Day Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Day Type</label>
              <select
                value={ruleForm.dayType}
                onChange={(e) => setRuleForm({ ...ruleForm, dayType: e.target.value as DayType })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value={DayType.ALL_DAYS}>📅 All Days</option>
                <option value={DayType.WEEKDAY}>📆 Weekdays (Mon-Fri)</option>
                <option value={DayType.WEEKEND}>🎉 Weekends (Sat-Sun)</option>
              </select>
            </div>

            {/* Time Range */}
            {(ruleForm.type === RuleType.TIME_BLOCK || ruleForm.type === RuleType.EXCEPTION) && (
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time *</label>
                  <select
                    value={ruleForm.startTime}
                    onChange={(e) => setRuleForm({ ...ruleForm, startTime: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    {['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM'].map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Time *</label>
                  <select
                    value={ruleForm.endTime}
                    onChange={(e) => setRuleForm({ ...ruleForm, endTime: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    {['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM'].map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Max Bookings Field */}
            {ruleForm.type === RuleType.MAX_BOOKING && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Bookings Per Day *</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={ruleForm.maxBookings}
                  onChange={(e) => setRuleForm({ ...ruleForm, maxBookings: parseInt(e.target.value) || 1 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Maximum number of bookings allowed per day. Must be at least 1.</p>
              </div>
            )}

            {/* Repeat Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Repeat Pattern</label>
              <select
                value={ruleForm.repeatType}
                onChange={(e) => setRuleForm({ ...ruleForm, repeatType: e.target.value as RepeatType })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value={RepeatType.REPEATING}>🔄 Repeating (applies every week)</option>
                <option value={RepeatType.ONE_TIME}>📅 One-time (phase 3b - not fully implemented)</option>
              </select>
            </div>

            {/* Form Actions */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={editingRule ? () => handleUpdateRule(editingRule.id) : handleCreateRule}
                className="flex-1 px-6 py-3 bg-primary text-white rounded-lg hover:bg-secondary transition font-semibold"
              >
                {editingRule ? 'Update Rule' : 'Save Rule'}
              </button>
              <button
                onClick={() => { setShowRuleForm(false); setEditingRule(null); resetRuleForm(); }}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rules List */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Active Rules (sorted by priority)</h3>
        {sortedRules.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
            <div className="text-4xl mb-2">📋</div>
            <p className="text-gray-800 font-semibold">No rules configured</p>
            <p className="text-gray-600 text-sm">Create a rule to automate your availability management</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedRules.map((rule) => (
              <div key={rule.id} className={`border-2 rounded-lg p-5 ${!rule.enabled ? 'bg-gray-50 opacity-60' : rule.type === RuleType.EXCEPTION ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-primary text-white">
                        Priority #{rule.priority}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        rule.type === RuleType.EXCEPTION ? 'bg-green-100 text-green-800' :
                        rule.type === RuleType.MAX_BOOKING ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {rule.type === RuleType.TIME_BLOCK ? '🚫 Time Block' :
                         rule.type === RuleType.EXCEPTION ? '✅ Exception' :
                         '📊 Max Bookings'}
                      </span>
                      <span className="text-xs px-2 py-1 bg-gray-100 text-gray-800 rounded-full">
                        {rule.repeatType === RepeatType.REPEATING ? '🔄 Repeating' : '📅 One-time'}
                      </span>
                    </div>
                    <h4 className="text-lg font-bold text-gray-900">{rule.name}</h4>
                  </div>
                  <button
                    onClick={() => handleToggleRule(rule.id, !rule.enabled)}
                    className={`px-3 py-1 rounded-lg text-sm font-semibold transition ${rule.enabled ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' : 'bg-green-100 text-green-800 hover:bg-green-200'}`}
                  >
                    {rule.enabled ? 'Disable' : 'Enable'}
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <span className="text-gray-600">Day Type:</span>{' '}
                    <span className="font-semibold">
                      {rule.dayType === DayType.WEEKDAY ? '📆 Weekdays (Mon-Fri)' : rule.dayType === DayType.WEEKEND ? '🎉 Weekends (Sat-Sun)' : '📅 All Days'}
                    </span>
                  </div>
                  {(rule.type === RuleType.TIME_BLOCK || rule.type === RuleType.EXCEPTION) && (
                    <div>
                      <span className="text-gray-600">Time Range:</span>{' '}
                      <span className="font-semibold">{formatTimeForDisplay(rule.startTime)} - {formatTimeForDisplay(rule.endTime)}</span>
                    </div>
                  )}
                  {rule.type === RuleType.MAX_BOOKING && (
                    <div>
                      <span className="text-gray-600">Max Bookings:</span>{' '}
                      <span className="font-semibold">{rule.maxBookings} per day</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => startEditRule(rule)}
                    className="text-xs px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteRule(rule.id)}
                    className="text-xs px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )

  // Separate component for Availability Tab - needed because hooks must be at component root
  const AvailabilityTab = ({ selectedBlockDate, setSelectedBlockDate, blockedSlots, setBlockedSlots }: any) => {
    const allTimeSlots = ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM']
    
    // Fetch rules when date is selected
    const [rules, setRules] = useState<any[]>([])
    
    useEffect(() => {
      loadRules()
    }, [selectedBlockDate])
    
    const loadRules = async () => {
      if (!globalSupabase) return
      const { data } = await globalSupabase.from('availability_rules').select('*').eq('enabled', true)
      setRules(data || [])
    }
    
    // Helper functions for rule checking
    const slotToMinutes = (slot: string) => {
      const [time, period] = slot.split(' ')
      let [hours, minutes] = time.split(':').map(Number)
      if (period === 'PM' && hours !== 12) hours += 12
      if (period === 'AM' && hours === 12) hours = 0
      return hours * 60 + minutes
    }
    
    const isInRange = (slot: string, start: string, end: string) => {
      const startParts = start.split(':')
      const endParts = end.split(':')
      const startMin = parseInt(startParts[0]) * 60 + parseInt(startParts[1])
      const endMin = parseInt(endParts[0]) * 60 + parseInt(endParts[1])
      return slotToMinutes(slot) >= startMin && slotToMinutes(slot) <= endMin
    }
    
    const matchesDayType = (date: Date, dayType: string) => {
      const dayOfWeek = date.getDay()
      if (dayType === 'ALL_DAYS') return true
      if (dayType === 'WEEKDAY') return dayOfWeek >= 1 && dayOfWeek <= 5
      if (dayType === 'WEEKEND') return dayOfWeek === 0 || dayOfWeek === 6
      return false
    }
    
    // Get blocked slots for selected date from Supabase
    const [blockedForDate, setBlockedForDate] = useState<BlockedSlot[]>([])
    
    useEffect(() => {
      loadBlockedSlots()
    }, [selectedBlockDate])
    
    const loadBlockedSlots = async () => {
      if (!globalSupabase || !selectedBlockDate) return
      const { data } = await globalSupabase
        .from('blocked_slots')
        .select('*')
        .eq('date', selectedBlockDate)
      setBlockedForDate(data || [])
    }
    
    const blockedTimesSet = new Set(blockedForDate.map((b: BlockedSlot) => b.time))
    
    // Check if a slot is blocked by any rule
    const isBlockedByRule = (time: string) => {
      if (!selectedBlockDate) return false
      const dateObj = new Date(selectedBlockDate + 'T00:00:00')
      
      const timeBlockRules = rules.filter((r: any) => 
        r.type === 'TIME_BLOCK' && matchesDayType(dateObj, r.day_type || 'ALL_DAYS')
      )
      
      for (const rule of timeBlockRules) {
        if (!rule.start_time || !rule.end_time) continue
        if (isInRange(time, rule.start_time, rule.end_time)) {
          return true
        }
      }
      return false
    }
    
    // Check if a slot is manually blocked
    const isManuallyBlocked = (time: string) => blockedTimesSet.has(time)
    
    // Determine slot status:
    // - isException: slot is in blocked_slots but IS blocked by rule → this means it's an EXCEPTION (available despite rule)
    // - isBlocked: slot is blocked (manually blocked OR blocked by rule without exception)
    // - isAvailable: slot is not blocked
    const getSlotStatus = (time: string): 'available' | 'blocked' | 'exception' => {
      const ruleBlocks = isBlockedByRule(time)
      const manuallyBlocked = isManuallyBlocked(time)
      
      if (manuallyBlocked && ruleBlocks) {
        return 'exception' // In blocked_slots AND blocked by rule = exception (available)
      }
      if (manuallyBlocked || ruleBlocks) {
        return 'blocked' // Either manually blocked OR blocked by rule (without exception)
      }
      return 'available' // Not blocked at all
    }
    
    // Toggle slot - different actions based on current status
    const toggleSlot = async (time: string) => {
      const status = getSlotStatus(time)
      
      if (status === 'available') {
        // Currently available - block it
        await addBlockedSlotAsync(selectedBlockDate, time)
      } else if (status === 'blocked') {
        // Currently blocked - unblock it (add to blocked_slots as exception if it's a rule block)
        await addBlockedSlotAsync(selectedBlockDate, time)
      } else if (status === 'exception') {
        // Currently exception - remove the exception (remove from blocked_slots, rule will block it again)
        await removeBlockedSlotAsync(selectedBlockDate, time)
      }
      
      await loadBlockedSlots()
      const updated = await getBlockedSlotsAsync()
      setBlockedSlots(updated)
    }
    
    // Block all available times
    const blockAll = async () => {
      for (const time of allTimeSlots) {
        if (getSlotStatus(time) === 'available') {
          await addBlockedSlotAsync(selectedBlockDate, time)
        }
      }
      await loadBlockedSlots()
      const updated = await getBlockedSlotsAsync()
      setBlockedSlots(updated)
    }
    
    // Unblock all times (remove all manual blocks/exceptions)
    const unblockAll = async () => {
      for (const time of allTimeSlots) {
        if (getSlotStatus(time) !== 'available') {
          await removeBlockedSlotAsync(selectedBlockDate, time)
        }
      }
      await loadBlockedSlots()
      const updated = await getBlockedSlotsAsync()
      setBlockedSlots(updated)
    }
    
    // Get rule name that blocks a time
    const getBlockingRuleName = (time: string): string | null => {
      if (!selectedBlockDate) return null
      const dateObj = new Date(selectedBlockDate + 'T00:00:00')
      
      const timeBlockRules = rules.filter((r: any) => 
        r.type === 'TIME_BLOCK' && matchesDayType(dateObj, r.day_type || 'ALL_DAYS')
      )
      
      for (const rule of timeBlockRules) {
        if (!rule.start_time || !rule.end_time) continue
        if (isInRange(time, rule.start_time, rule.end_time)) {
          return rule.name
        }
      }
      return null
    }
    
    return (
      <div>
        <h2 className="text-2xl font-bold mb-6">Manage Your Availability</h2>
        <p className="text-gray-600 mb-6">
          View and override your availability rules. You can unblock times blocked by rules for specific days.
        </p>

        {/* Date Picker */}
        <div className="bg-gray-50 rounded-xl p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">Select Date</h3>
          <input
            type="date"
            value={selectedBlockDate}
            onChange={(e) => setSelectedBlockDate(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-lg"
            min={today}
          />
        </div>

        {/* Time Slots Grid - Only show when date is selected */}
        {selectedBlockDate && (
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                Time Slots for {new Date(selectedBlockDate + 'T00:00:00').toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long' })}
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={blockAll}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-semibold text-sm"
                >
                  Block All
                </button>
                <button
                  onClick={unblockAll}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-semibold text-sm"
                >
                  Unblock All
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {allTimeSlots.map(time => {
                const manuallyBlocked = isManuallyBlocked(time)
                const ruleBlocked = isBlockedByRule(time)
                const blockingRuleName = getBlockingRuleName(time)
                
                return (
                  <button
                    key={time}
                    onClick={() => toggleSlot(time)}
                    className={`p-4 rounded-lg border-2 font-semibold transition ${
                      getSlotStatus(time) === 'blocked'
                        ? 'bg-red-100 border-red-300 text-red-700 hover:bg-red-200'
                        : getSlotStatus(time) === 'exception'
                        ? 'bg-blue-100 border-blue-300 text-blue-700 hover:bg-blue-200'
                        : 'bg-green-100 border-green-300 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    <div className="text-lg">{time}</div>
                    <div className="text-xs mt-1">
                      {getSlotStatus(time) === 'blocked' ? '🔴 Blocked' : 
                       getSlotStatus(time) === 'exception' ? '🔵 Exception' : 
                       '🟢 Available'}
                    </div>
                  </button>
                )
              })}
            </div>
            
            <div className="mt-4 p-3 bg-gray-100 rounded-lg text-sm">
              <p className="text-gray-700 font-medium mb-2">Click to toggle:</p>
              <div className="grid grid-cols-2 gap-1 text-gray-600">
                <span>🟢 <strong>Available</strong> → Click to Block</span>
                <span>🔴 <strong>Blocked</strong> → Click to Unblock</span>
                <span>🔵 <strong>Exception</strong> → Click to Remove Exception</span>
              </div>
              <p className="text-gray-500 text-xs mt-2">
                Exception = You manually opened a time that was blocked by a rule
              </p>
            </div>
          </div>
        )}

        {/* Summary of Manual Blocks & Exceptions */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Your Overrides</h3>
          {blockedSlots.length === 0 ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <div className="text-4xl mb-2">✅</div>
              <p className="text-green-800 font-semibold">No overrides</p>
              <p className="text-green-600 text-sm">All times follow your rules.</p>
            </div>
          ) : (
            <>
              {/* Group by type - manual blocks vs exceptions */}
              {(() => {
                // Categorize blocked slots
                const manualBlocksList: any[] = []
                const exceptionsList: any[] = []
                
                blockedSlots.forEach((slot: any) => {
                  const dateObj = new Date(slot.date + 'T00:00:00')
                  const isRuleBlocked = (rules || []).some((r: any) => {
                    if (r.type !== 'TIME_BLOCK') return false
                    if (!matchesDayType(dateObj, r.day_type || 'ALL_DAYS')) return false
                    if (!r.start_time || !r.end_time) return false
                    return isInRange(slot.time, r.start_time, r.end_time)
                  })
                  
                  if (isRuleBlocked) {
                    exceptionsList.push({ ...slot, ruleName: getBlockingRuleName(slot.time) })
                  } else {
                    manualBlocksList.push(slot)
                  }
                })
                
                return (
                  <div className="space-y-4">
                    {/* Manual Blocks - slots you blocked that aren't blocked by rules */}
                    {manualBlocksList.length > 0 && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-semibold text-red-800">
                            🔴 Manual Blocks ({manualBlocksList.length})
                          </h4>
                          <button
                            onClick={async () => {
                              for (const s of manualBlocksList) {
                                await removeBlockedSlotAsync(s.date, s.time)
                              }
                              const updated = await getBlockedSlotsAsync()
                              setBlockedSlots(updated)
                            }}
                            className="text-sm text-red-600 hover:text-red-800 underline"
                          >
                            Remove all
                          </button>
                        </div>
                        {Object.entries(
                          manualBlocksList.reduce((acc: any, slot: any) => {
                            if (!acc[slot.date]) acc[slot.date] = []
                            acc[slot.date].push(slot)
                            return acc
                          }, {})
                        ).map(([date, slots]: [any, any]) => (
                          <div key={date} className="mb-2">
                            <p className="text-sm font-medium text-red-700 mb-1">
                              {new Date(date + 'T00:00:00').toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short' })}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {slots.map((slot: any, idx: number) => (
                                <span key={idx} className="inline-flex items-center px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                                  {slot.time}
                                  <button 
                                    onClick={async () => {
                                      await removeBlockedSlotAsync(slot.date, slot.time)
                                      const updated = await getBlockedSlotsAsync()
                                      setBlockedSlots(updated)
                                    }} 
                                    className="ml-2 text-red-600 hover:text-red-800 font-bold"
                                  >
                                    ×
                                  </button>
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Exceptions - slots you opened that are blocked by rules */}
                    {exceptionsList.length > 0 && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-semibold text-blue-800">
                            🔵 Exceptions ({exceptionsList.length})
                          </h4>
                          <p className="text-xs text-blue-600">Students can book these despite rules</p>
                        </div>
                        {Object.entries(
                          exceptionsList.reduce((acc: any, slot: any) => {
                            if (!acc[slot.date]) acc[slot.date] = []
                            acc[slot.date].push(slot)
                            return acc
                          }, {})
                        ).map(([date, slots]: [any, any]) => (
                          <div key={date} className="mb-2">
                            <p className="text-sm font-medium text-blue-700 mb-1">
                              {new Date(date + 'T00:00:00').toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short' })}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {slots.map((slot: any, idx: number) => (
                                <span key={idx} className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                  {slot.time}
                                  <span className="ml-1 text-xs text-blue-500">({slot.ruleName})</span>
                                  <button 
                                    onClick={async () => {
                                      await removeBlockedSlotAsync(slot.date, slot.time)
                                      const updated = await getBlockedSlotsAsync()
                                      setBlockedSlots(updated)
                                    }} 
                                    className="ml-2 text-blue-600 hover:text-blue-800 font-bold"
                                  >
                                    ×
                                  </button>
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })()}
            </>
          )}
        </div>
      </div>
    )
  }

  const renderAvailabilityTab = () => {
    return (
      <AvailabilityTab 
        selectedBlockDate={selectedBlockDate}
        setSelectedBlockDate={setSelectedBlockDate}
        blockedSlots={blockedSlots}
        setBlockedSlots={setBlockedSlots}
      />
    )
  }

  const renderCalendarTab = () => {
    // Use state for month/year navigation
    const currentMonth = calendarMonth
    const currentYear = calendarYear
    const today = new Date()
    
    // Get first day of month
    const firstDay = new Date(currentYear, currentMonth, 1)
    const lastDay = new Date(currentYear, currentMonth + 1, 0)
    
    // Get day of week for first day (0 = Sunday, 6 = Saturday)
    const firstDayOfWeek = firstDay.getDay()
    
    // Generate days in month
    const daysInMonth = lastDay.getDate()
    
    // Create array of days
    const days = []
    
    // Add empty cells for days before first day of month
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null)
    }
    
    // Add days of month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentYear, currentMonth, i)
      const dateString = date.toISOString().split('T')[0]
      days.push(dateString)
    }
    
    // Group bookings by date
    const bookingsByDate: Record<string, Booking[]> = {}
    allBookings.forEach(booking => {
      if (!bookingsByDate[booking.date]) {
        bookingsByDate[booking.date] = []
      }
      bookingsByDate[booking.date].push(booking)
    })
    
    // Day names
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    
    return (
      <div>
        <h2 className="text-2xl font-bold mb-6">Calendar View</h2>
        <p className="text-gray-600 mb-6">
          View all bookings in a calendar format. Click on a booking to see details.
        </p>
        
        <div className="bg-white border rounded-xl p-6 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">
              {new Date(currentYear, currentMonth).toLocaleDateString('en-AU', { month: 'long', year: 'numeric' })}
            </h3>
            <div className="flex gap-2">
              <button 
                onClick={() => {
                  if (calendarMonth === 0) {
                    setCalendarMonth(11)
                    setCalendarYear(calendarYear - 1)
                  } else {
                    setCalendarMonth(calendarMonth - 1)
                  }
                }}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Previous
              </button>
              <button 
                onClick={() => {
                  setCalendarMonth(new Date().getMonth())
                  setCalendarYear(new Date().getFullYear())
                }}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Today
              </button>
              <button 
                onClick={() => {
                  if (calendarMonth === 11) {
                    setCalendarMonth(0)
                    setCalendarYear(calendarYear + 1)
                  } else {
                    setCalendarMonth(calendarMonth + 1)
                  }
                }}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
          
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {/* Day headers */}
            {dayNames.map(day => (
              <div key={day} className="text-center font-semibold text-gray-700 py-2 border-b">
                {day}
              </div>
            ))}
            
            {/* Calendar days */}
            {days.map((date, index) => {
              if (date === null) {
                return <div key={`empty-${index}`} className="h-32 bg-gray-50 rounded-lg"></div>
              }
              
              const dayBookings = bookingsByDate[date] || []
              const isToday = date === new Date().toISOString().split('T')[0]
              const dayNumber = new Date(date).getDate()
              
              return (
                <div 
                  key={date} 
                  className={`h-32 border rounded-lg p-2 overflow-y-auto ${isToday ? 'bg-blue-50 border-blue-300' : 'bg-white'}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className={`font-semibold ${isToday ? 'text-blue-600' : 'text-gray-700'}`}>
                      {dayNumber}
                    </span>
                    {isToday && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-1 rounded">Today</span>
                    )}
                  </div>
                  
                  {/* Bookings for this day */}
                  <div className="space-y-1">
                    {dayBookings.slice(0, 3).map(booking => (
                      <div 
                        key={booking.id}
                        className={`text-xs p-1 rounded cursor-pointer hover:opacity-90 ${
                          booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border border-yellow-300' :
                          booking.status === 'confirmed' ? 'bg-green-100 text-green-800 border border-green-300' :
                          booking.status === 'completed' ? 'bg-gray-100 text-gray-800 border border-gray-300' :
                          'bg-red-100 text-red-800 border border-red-300'
                        }`}
                        onClick={() => setSelectedBooking(booking)}
                      >
                        <div className="font-medium truncate">
                          {emailFilter ? highlightSearchTerm(booking.studentName, emailFilter) : booking.studentName}
                        </div>
                        <div className="truncate">{booking.time}</div>
                      </div>
                    ))}
                    
                    {dayBookings.length > 3 && (
                      <div className="text-xs text-gray-500 text-center">
                        +{dayBookings.length - 3} more
                      </div>
                    )}
                    
                    {dayBookings.length === 0 && (
                      <div className="text-xs text-gray-400 text-center mt-4">No bookings</div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
          
          {/* Legend */}
          <div className="mt-6 pt-4 border-t">
            <h4 className="font-semibold mb-2">Legend:</h4>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-100 border border-yellow-300 rounded mr-2"></div>
                <span className="text-sm">Pending</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-100 border border-green-300 rounded mr-2"></div>
                <span className="text-sm">Confirmed</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-gray-100 border border-gray-300 rounded mr-2"></div>
                <span className="text-sm">Completed</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-100 border border-red-300 rounded mr-2"></div>
                <span className="text-sm">Cancelled</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Helper function to highlight search terms in text
  const highlightSearchTerm = (text: string, searchTerm: string) => {
    if (!searchTerm || !text) return text;
    
    const lowerText = text.toLowerCase();
    const lowerSearch = searchTerm.toLowerCase();
    const index = lowerText.indexOf(lowerSearch);
    
    if (index === -1) return text;
    
    const before = text.substring(0, index);
    const match = text.substring(index, index + searchTerm.length);
    const after = text.substring(index + searchTerm.length);
    
    return (
      <>
        {before}
        <mark className="bg-yellow-200 px-1 rounded">{match}</mark>
        {after}
      </>
    );
  };

  const renderCreateBookingTab = () => (
    <div>
      <h2 className="text-2xl font-bold mb-6">Create New Booking</h2>
      <p className="text-gray-600 mb-6">
        Create a booking directly in the system. The booking will be created with 'pending' status.
      </p>

      <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl">
        <form onSubmit={handleCreateBooking} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Student Name *</label>
            <input
              type="text"
              value={bookingForm.studentName}
              onChange={(e) => setBookingForm({ ...bookingForm, studentName: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter student's full name"
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={bookingForm.email}
                onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="student@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <input
                type="tel"
                value={bookingForm.phone}
                onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="0412 345 678"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
              <input
                type="date"
                value={bookingForm.date}
                onChange={(e) => handleBookingDateChange(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time *</label>
              <select
                value={bookingForm.time}
                onChange={(e) => setBookingForm({ ...bookingForm, time: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              >
                {availableTimes.length > 0 ? (
                  availableTimes.map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))
                ) : (
                  <>
                    <option value="8:00 AM">8:00 AM</option>
                    <option value="9:00 AM">9:00 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="12:00 PM">12:00 PM</option>
                    <option value="1:00 PM">1:00 PM</option>
                    <option value="2:00 PM">2:00 PM</option>
                    <option value="3:00 PM">3:00 PM</option>
                    <option value="4:00 PM">4:00 PM</option>
                    <option value="5:00 PM">5:00 PM</option>
                    <option value="6:00 PM">6:00 PM</option>
                    <option value="7:00 PM">7:00 PM</option>
                    <option value="8:00 PM">8:00 PM</option>
                  </>
                )}
              </select>
              {bookingForm.date && (
                <p className="text-xs text-gray-500 mt-1">
                  {availableTimes.length} slots available
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Lesson Type</label>
              <select
                value={bookingForm.lessonType}
                onChange={(e) => setBookingForm({ ...bookingForm, lessonType: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="single">Single Lesson ($55)</option>
                <option value="casual">Casual Driving ($45)</option>
                <option value="test">Driving Test ($75)</option>
                <option value="package_5">5-Lesson Package ($225)</option>
                <option value="package_10">10-Lesson Package ($440)</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t">
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={creatingBooking || !bookingForm.studentName || !bookingForm.date || !bookingForm.time}
                className="flex-1 px-6 py-3 bg-primary text-white rounded-lg hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold"
              >
                {creatingBooking ? 'Creating...' : 'Create Booking'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setBookingForm({
                    studentName: '',
                    email: '',
                    phone: '',
                    date: '',
                    time: '9:00 AM',
                    lessonType: 'single'
                  })
                  setAvailableTimes([])
                }}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Clear
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )

  const renderBookingList = () => {
    const filtered = getFilteredBookings()
    if (filtered.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-xl font-semibold mb-2">
            {emailFilter ? 'No Matching Bookings Found' : 'No Bookings Found'}
          </h3>
          <p className="text-gray-600">
            {emailFilter 
              ? `No bookings found matching "${emailFilter}". Try a different search term.`
              : 'Bookings will appear here once students schedule lessons'
            }
          </p>
          {emailFilter && (
            <button
              onClick={() => setEmailFilter('')}
              className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition"
            >
              Clear Search
            </button>
          )}
        </div>
      )
    }
    return filtered.map((booking) => {
      const isTodayBooking = booking.date === today
      // Determine if booking is a reschedule or new booking
      // ANY booking with originalDate field is a Reschedule (because it was rescheduled at least once)
      // Only bookings WITHOUT originalDate field are New Bookings
      const isReschedule = !!booking.originalDate;
      const isNewBooking = !booking.originalDate;
      
      return (
        <div
          key={booking.id}
          className={`border-2 rounded-lg p-6 mb-4 hover:shadow-md transition cursor-pointer ${
            isTodayBooking ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200 bg-white'
          }`}
          onClick={() => setSelectedBooking(booking)}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              {isTodayBooking && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-yellow-400 text-yellow-900">
                  📅 TODAY
                </span>
              )}
              {isNewBooking && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800 border border-green-300">
                  📅 New Booking
                </span>
              )}
              {isReschedule && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-800 border border-orange-300">
                  🔄 Reschedule
                </span>
              )}
            </div>
            {isTodayBooking && booking.status === 'confirmed' && (
              <button
                onClick={(e) => { e.stopPropagation(); updateBookingStatus(booking.id, 'completed') }}
                className="ml-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold text-sm"
              >
                Mark as Completed
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3 md:gap-4">
            <div>
              <p className="text-xs md:text-sm text-gray-500 mb-1">Date</p>
              <p className="font-semibold text-sm md:text-base">{formatDate(booking.date)}</p>
              {isReschedule && booking.originalDate && booking.originalDate !== booking.date && (
                <p className="text-xs text-orange-600 mt-1 hidden md:block">
                  Was {formatDate(booking.originalDate)}
                </p>
              )}
            </div>
            <div>
              <p className="text-xs md:text-sm text-gray-500 mb-1">Time</p>
              <p className="font-semibold text-primary text-sm md:text-base">{booking.time}</p>
            </div>
            <div className="col-span-2">
              <p className="text-xs md:text-sm text-gray-500 mb-1">Student</p>
              <p className="font-semibold text-sm md:text-base truncate">
                {emailFilter ? highlightSearchTerm(booking.studentName, emailFilter) : booking.studentName}
              </p>
              <p className="text-gray-500 text-xs hidden md:block">
                {emailFilter ? highlightSearchTerm(booking.email, emailFilter) : booking.email}
              </p>
            </div>
            <div>
              <p className="text-xs md:text-sm text-gray-500 mb-1">Lesson</p>
              <p className="font-semibold text-sm">{getLessonTypeName(booking.lessonType)}</p>
              <p className="text-primary font-bold text-sm">${booking.price}</p>
            </div>
            <div>
              <p className="text-xs md:text-sm text-gray-500 mb-1">Status</p>
              <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800'
                : booking.status === 'confirmed' ? 'bg-green-100 text-green-800'
                : booking.status === 'completed' ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-100 text-gray-800'
              }`}>
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </span>
              {booking.status === 'pending' && (
                <button
                  onClick={(e) => { e.stopPropagation(); updateBookingStatus(booking.id, 'confirmed') }}
                  className="block mt-1 text-primary hover:text-secondary text-xs font-semibold"
                >
                  Confirm
                </button>
              )}
            </div>
          </div>
          {/* Reschedule info */}
          {isReschedule && (
            <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <p className="text-sm text-orange-700">
                <span className="font-semibold">⚠️ Reschedule:</span> 
                {booking.originalDate !== booking.date ? (
                  <> Originally booked for {formatDate(booking.originalDate)}, changed to {formatDate(booking.date)}</>
                ) : (
                  <> Rescheduled to same date ({formatDate(booking.date)})</>
                )}
                {booking.previousDate && booking.previousDate !== booking.originalDate && (
                  <span className="block text-xs text-orange-600 mt-1">
                    (Previously rescheduled to {formatDate(booking.previousDate)})
                  </span>
                )}
              </p>
            </div>
          )}
          <div className="flex items-end mt-4">
            {bookingsView === 'all' && !booking.archived && (
              <button
                onClick={(e) => { e.stopPropagation(); archiveBooking(booking.id) }}
                className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition font-semibold"
              >
                Archive
              </button>
            )}
          </div>
        </div>
      )
    })
  }

  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/instructor/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100">
      <Navbar showLocation={false} />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Instructor Portal</h1>
            <p className="text-gray-600">Manage your schedule and student bookings</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => { setSelectedTab('bookings'); setBookingsView('upcoming') }}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition font-semibold"
            >
              ➕ New Booking
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition font-semibold"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Pending Bookings Notification */}
        {bookings.filter(b => b.status === 'pending').length > 0 && (
          <div className="bg-yellow-50 border-2 border-yellow-400 rounded-xl p-6 mb-8 shadow-md">
            <h2 className="text-xl font-bold text-yellow-800 mb-4">⚠️ Pending Bookings - Awaiting Confirmation</h2>
            <div className="space-y-3">
              {bookings.filter(b => b.status === 'pending').map((booking) => {
                // Determine if booking is a reschedule or new booking
                // ANY booking with originalDate field is a Reschedule (because it was rescheduled at least once)
                // Only bookings WITHOUT originalDate field are New Bookings
                const isReschedule = !!booking.originalDate;
                const isNewBooking = !booking.originalDate;
                
                return (
                  <div key={booking.id} className="flex items-center justify-between bg-white rounded-lg p-4 border border-yellow-300">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        {isNewBooking && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800 border border-green-300">
                            📅 New Booking
                          </span>
                        )}
                        {isReschedule && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-800 border border-orange-300">
                            🔄 Reschedule
                          </span>
                        )}
                        <p className="font-semibold text-gray-900">
                          {emailFilter ? highlightSearchTerm(booking.studentName, emailFilter) : booking.studentName}
                        </p>
                      </div>
                      <p className="text-sm text-gray-600">{formatDate(booking.date)} at {booking.time} - ${booking.price}</p>
                      {isReschedule && booking.originalDate && (
                        <p className="text-sm text-orange-600 mt-1">
                          ⚠️ {booking.originalDate !== booking.date ? (
                            <>Originally booked for {formatDate(booking.originalDate)} (needs confirmation)</>
                          ) : (
                            <>Rescheduled to same date (needs confirmation)</>
                          )}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => { updateBookingStatus(booking.id, 'confirmed') }}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => { updateBookingStatus(booking.id, 'cancelled') }}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => { 
                          if (confirm(`Delete pending booking for ${booking.studentName}?`)) {
                            deleteBooking(booking.id);
                          }
                        }}
                        className="px-4 py-2 bg-red-800 text-white rounded-lg hover:bg-red-900 transition font-semibold"
                        title="Delete permanently"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="text-3xl mb-2">🗓️</div>
            <div className="text-3xl font-bold text-blue-600">{todayBookings.length + upcomingBookings.length}</div>
            <p className="text-gray-600">Today & Upcoming</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="text-3xl mb-2">📋</div>
            <div className="text-3xl font-bold text-green-600">{allBookings.length}</div>
            <p className="text-gray-600">Total Bookings</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg col-span-2 md:col-span-1">
            <div className="text-3xl mb-2">⚠️</div>
            <div className="text-3xl font-bold text-yellow-600">{bookings.filter(b => b.status === 'pending').length}</div>
            <p className="text-gray-600">Pending</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg mb-8">
          <div className="border-b">
            <div className="flex overflow-x-auto scrollbar-hide">
              <button
                className={`shrink-0 px-6 py-4 font-semibold transition whitespace-nowrap ${selectedTab === 'bookings' ? 'border-b-2 border-primary text-primary' : 'text-gray-600 hover:text-gray-800'}`}
                onClick={() => { setSelectedTab('bookings'); setBookingsView('upcoming') }}
              >📅 Bookings</button>
              <button
                className={`shrink-0 px-6 py-4 font-semibold transition whitespace-nowrap ${selectedTab === 'schedule' ? 'border-b-2 border-primary text-primary' : 'text-gray-600 hover:text-gray-800'}`}
                onClick={() => setSelectedTab('schedule')}
              >📋 Schedule</button>
              <button
                className={`shrink-0 px-6 py-4 font-semibold transition whitespace-nowrap ${selectedTab === 'calendar' ? 'border-b-2 border-primary text-primary' : 'text-gray-600 hover:text-gray-800'}`}
                onClick={() => setSelectedTab('calendar')}
              >📅 Calendar</button>
              <button
                className={`shrink-0 px-6 py-4 font-semibold transition whitespace-nowrap ${selectedTab === 'students' ? 'border-b-2 border-primary text-primary' : 'text-gray-600 hover:text-gray-800'}`}
                onClick={() => setSelectedTab('students')}
              >👨‍🎓 Students</button>
            </div>
          </div>
          <div className="p-6">
            {selectedTab === 'schedule' ? (
              <>
                {renderRulesTab()}
                <div className="my-8 border-t" />
                {renderAvailabilityTab()}
              </>
            ) : selectedTab === 'calendar' ? renderCalendarTab() : selectedTab === 'students' ? (
              <InstructorStudentsTab />
            ) : (
              <>
                {/* Bookings sub-toggle + search */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
                  <div className="flex bg-gray-100 rounded-lg p-1 shrink-0">
                    <button
                      onClick={() => setBookingsView('upcoming')}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition ${bookingsView === 'upcoming' ? 'bg-white shadow text-primary' : 'text-gray-600 hover:text-gray-800'}`}
                    >
                      Upcoming ({todayBookings.length + upcomingBookings.length})
                    </button>
                    <button
                      onClick={() => setBookingsView('all')}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition ${bookingsView === 'all' ? 'bg-white shadow text-primary' : 'text-gray-600 hover:text-gray-800'}`}
                    >
                      All ({allBookings.length})
                    </button>
                  </div>
                  <input
                    type="text"
                    value={emailFilter}
                    onChange={(e) => setEmailFilter(e.target.value)}
                    placeholder="Search by name, email or phone..."
                    className="px-4 py-2 border rounded-lg w-full sm:w-80 text-sm"
                  />
                  {emailFilter && (
                    <button
                      onClick={() => setEmailFilter('')}
                      className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition shrink-0"
                    >
                      Clear
                    </button>
                  )}
                </div>
                {emailFilter && (
                  <p className="text-sm text-gray-600 mb-3 -mt-2">
                    Found {getFilteredBookings().length} result{getFilteredBookings().length !== 1 ? 's' : ''} for "{emailFilter}"
                  </p>
                )}
                {renderBookingList()}
                {bookingsView === 'all' && archivedBookings.length > 0 && (
                  <div className="mt-8 border-t pt-6">
                    <button
                      onClick={() => setShowArchived(!showArchived)}
                      className="flex items-center gap-2 text-lg font-semibold text-gray-700 hover:text-gray-900 mb-4"
                    >
                      {showArchived ? '▲' : '▼'} Archived ({archivedBookings.length})
                    </button>
                    {showArchived && (
                      <div className="space-y-3">
                        {archivedBookings.map((booking) => (
                          <div
                            key={booking.id}
                            className="border rounded-lg p-4 md:p-6 bg-gray-50 opacity-75 hover:opacity-100 transition"
                          >
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Date & Time</p>
                                <p className="font-semibold text-gray-700">{formatDate(booking.date)}</p>
                                <p className="text-gray-500 text-sm">{booking.time}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Student</p>
                                <p className="font-semibold text-gray-700 text-sm">
                                  {emailFilter ? highlightSearchTerm(booking.studentName, emailFilter) : booking.studentName}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Lesson</p>
                                <p className="font-semibold text-gray-700 text-sm">{getLessonTypeName(booking.lessonType)}</p>
                                <p className="text-gray-600 font-bold text-sm">${booking.price}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Status</p>
                                <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                                  booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800'
                                  : booking.status === 'confirmed' ? 'bg-green-100 text-green-800'
                                  : booking.status === 'completed' ? 'bg-blue-100 text-blue-800'
                                  : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                </span>
                              </div>
                              <div className="flex flex-col gap-1">
                                <button
                                  onClick={() => archiveBooking(booking.id)}
                                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition font-semibold text-xs"
                                >
                                  Unarchive
                                </button>
                                <button
                                  onClick={() => {
                                    if (confirm(`Permanently delete archived booking for ${booking.studentName}?`)) {
                                      deleteBooking(booking.id);
                                    }
                                  }}
                                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition font-semibold text-xs"
                                >
                                  🗑️ Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {selectedBooking && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Booking Details</h2>
                <button onClick={() => setSelectedBooking(null)} className="text-gray-500 hover:text-gray-700 text-2xl">×</button>
              </div>
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div><p className="text-sm text-gray-600 mb-1">Booking ID</p><p className="font-semibold">{selectedBooking.id}</p></div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Status</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                      selectedBooking.status === 'pending' ? 'bg-yellow-100 text-yellow-800'
                      : selectedBooking.status === 'confirmed' ? 'bg-green-100 text-green-800'
                      : selectedBooking.status === 'completed' ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                    }`}>
                      {selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)}
                    </span>
                  </div>
                  <div><p className="text-sm text-gray-600 mb-1">Student Name</p><p className="font-semibold">{selectedBooking.studentName}</p></div>
                  <div><p className="text-sm text-gray-600 mb-1">Email</p><p className="font-semibold">{selectedBooking.email}</p></div>
                  <div><p className="text-sm text-gray-600 mb-1">Phone</p><p className="font-semibold">{selectedBooking.phone}</p></div>
                  <div><p className="text-sm text-gray-600 mb-1">Lesson Type</p><p className="font-semibold">{getLessonTypeName(selectedBooking.lessonType)}</p></div>
                  <div><p className="text-sm text-gray-600 mb-1">Date</p><p className="font-semibold">{formatDate(selectedBooking.date)}</p></div>
                  <div><p className="text-sm text-gray-600 mb-1">Time</p><p className="font-semibold">{selectedBooking.time}</p></div>
                  <div><p className="text-sm text-gray-600 mb-1">Price</p><p className="font-semibold text-2xl text-primary">${selectedBooking.price}</p></div>
                  <div><p className="text-sm text-gray-600 mb-1">Booked On</p><p className="font-semibold">{new Date(selectedBooking.createdAt).toLocaleDateString()}</p></div>
                </div>
                
                {/* Instructor Notes */}
                <div className="border-t pt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📝 Notes for student
                  </label>
                  <p className="text-xs text-gray-500 mb-2">These notes are visible to the student after the lesson is completed.</p>
                  <textarea
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    placeholder="e.g. Great progress on lane changes! Focus on mirror checks next lesson..."
                    value={instructorNotes}
                    onChange={(e) => setInstructorNotes(e.target.value)}
                    rows={3}
                  />
                  <button
                    onClick={() => saveInstructorNotes(selectedBooking.id)}
                    disabled={notesSaving}
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm disabled:opacity-50"
                  >
                    {notesSaving ? 'Saving...' : 'Save Notes'}
                  </button>
                </div>

                {/* Reschedule History */}
                {selectedBooking.originalDate && (
                  <div className="border-t pt-6">
                    <p className="text-sm text-gray-600 mb-2">Reschedule History</p>
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                      <p className="text-sm text-orange-700 mb-2">
                        <span className="font-semibold">⚠️ Originally booked for:</span> {formatDate(selectedBooking.originalDate)}
                      </p>
                      <p className="text-sm text-orange-700">
                        <span className="font-semibold">Current date:</span> {formatDate(selectedBooking.date)}
                        {selectedBooking.originalDate === selectedBooking.date && (
                          <span className="text-xs text-orange-600 ml-2">(Rescheduled to same date)</span>
                        )}
                      </p>
                      {selectedBooking.previousDate && selectedBooking.previousDate !== selectedBooking.originalDate && (
                        <p className="text-sm text-orange-700 mt-2">
                          <span className="font-semibold">Previous reschedule:</span> {formatDate(selectedBooking.previousDate)}
                        </p>
                      )}
                      {selectedBooking.rescheduleHistory && selectedBooking.rescheduleHistory.length > 0 && (
                        <div className="mt-3">
                          <p className="text-xs font-semibold text-orange-800 mb-1">Full reschedule history:</p>
                          <ul className="text-xs text-orange-700 space-y-1">
                            {selectedBooking.rescheduleHistory.map((change, idx) => (
                              <li key={idx}>
                                {formatDate(change.date)} at {change.time} (changed on {new Date(change.changedAt).toLocaleDateString()})
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="border-t pt-6">
                  <p className="text-sm text-gray-600 mb-4">Update Status</p>
                  <div className="flex flex-wrap gap-3">
                    {selectedBooking.status !== 'confirmed' && selectedBooking.status !== 'completed' && (
                      <button onClick={() => { updateBookingStatus(selectedBooking.id, 'confirmed'); setSelectedBooking(null) }} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">Confirm Booking</button>
                    )}
                    {selectedBooking.status === 'confirmed' && (
                      <button onClick={() => { updateBookingStatus(selectedBooking.id, 'completed'); setSelectedBooking(null) }} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Mark as Completed</button>
                    )}
                    {selectedBooking.status !== 'cancelled' && selectedBooking.status !== 'completed' && (
                      <button onClick={() => { updateBookingStatus(selectedBooking.id, 'cancelled'); setSelectedBooking(null) }} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">Cancel Booking</button>
                    )}
                  </div>
                </div>

                <div className="border-t pt-6 mt-6">
                  <p className="text-sm text-gray-600 mb-4">Danger Zone</p>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-sm text-red-700 mb-3">
                      <strong>⚠️ Permanent Deletion</strong><br/>
                      This will completely remove the booking from the database. Use only for test bookings or errors.
                    </p>
                    <button 
                      onClick={() => { deleteBooking(selectedBooking.id) }}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
                    >
                      🗑️ Delete Booking Permanently
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
