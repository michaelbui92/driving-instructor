'use client'

import { useState, useEffect } from 'react'
import { createClient, RealtimeChannel } from '@supabase/supabase-js'

// Types
interface Booking {
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
}

interface BlockedSlot {
  date: string
  time: string
}

interface AvailabilityRule {
  id: string
  name: string
  type: 'TIME_BLOCK' | 'EXCEPTION' | 'MAX_BOOKING'
  priority: number
  dayType: 'ALL_DAYS' | 'WEEKDAY' | 'WEEKEND'
  startTime?: string
  endTime?: string
  maxBookings?: number
  repeatType: 'REPEATING' | 'ONE_TIME'
  enabled: boolean
  createdAt: string
}

interface RuleFormData {
  name: string
  type: 'TIME_BLOCK' | 'EXCEPTION' | 'MAX_BOOKING'
  priority: number
  dayType: 'ALL_DAYS' | 'WEEKDAY' | 'WEEKEND'
  startTime: string
  endTime: string
  maxBookings: number
  repeatType: 'REPEATING' | 'ONE_TIME'
}

type TabType = 'pending' | 'upcoming' | 'all' | 'rules' | 'availability' | 'calendar' | 'create'

const RULES_KEY = 'test_booking_rules'
const BLOCKED_KEY = 'test_blocked_slots'

function getRules(): AvailabilityRule[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(RULES_KEY)
    return stored ? JSON.parse(stored) : []
  } catch { return [] }
}

function saveRules(rules: AvailabilityRule[]): void {
  localStorage.setItem(RULES_KEY, JSON.stringify(rules))
}

function addRule(rule: Omit<AvailabilityRule, 'id' | 'createdAt'>): void {
  const rules = getRules()
  const newRule: AvailabilityRule = {
    ...rule,
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString()
  }
  rules.push(newRule)
  saveRules(rules)
}

function updateRule(id: string, updates: Partial<AvailabilityRule>): void {
  const rules = getRules()
  const index = rules.findIndex(r => r.id === id)
  if (index !== -1) {
    rules[index] = { ...rules[index], ...updates }
    saveRules(rules)
  }
}

function deleteRule(id: string): void {
  saveRules(getRules().filter(r => r.id !== id))
}

function toggleRule(id: string, enabled: boolean): void {
  updateRule(id, { enabled })
}

function getBlockedSlots(): BlockedSlot[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(BLOCKED_KEY)
    return stored ? JSON.parse(stored) : []
  } catch { return [] }
}

function addBlockedSlot(date: string, time: string): void {
  const blocked = getBlockedSlots()
  if (!blocked.some(b => b.date === date && b.time === time)) {
    blocked.push({ date, time })
    localStorage.setItem(BLOCKED_KEY, JSON.stringify(blocked))
  }
}

function removeBlockedSlot(date: string, time: string): void {
  const blocked = getBlockedSlots().filter(b => !(b.date === date && b.time === time))
  localStorage.setItem(BLOCKED_KEY, JSON.stringify(blocked))
}

export default function TestBookingPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [supabaseStatus, setSupabaseStatus] = useState<string>('Connecting...')
  const [selectedTab, setSelectedTab] = useState<TabType>('pending')
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [blockedSlots, setBlockedSlots] = useState<BlockedSlot[]>([])
  const [selectedBlockDate, setSelectedBlockDate] = useState<string>('')
  const [selectedBlockTimes, setSelectedBlockTimes] = useState<string[]>([])
  const [rules, setRules] = useState<AvailabilityRule[]>([])
  const [showRuleForm, setShowRuleForm] = useState(false)
  const [editingRule, setEditingRule] = useState<AvailabilityRule | null>(null)
  const [ruleForm, setRuleForm] = useState<RuleFormData>({
    name: '', type: 'TIME_BLOCK', priority: 10, dayType: 'ALL_DAYS',
    startTime: '9:00 AM', endTime: '5:00 PM', maxBookings: 3, repeatType: 'REPEATING'
  })
  const [calendarMonth, setCalendarMonth] = useState<number>(new Date().getMonth())
  const [calendarYear, setCalendarYear] = useState<number>(new Date().getFullYear())
  const [bookingForm, setBookingForm] = useState({
    studentName: '', email: '', phone: '', date: '', time: '9:00 AM', lessonType: 'single'
  })
  const [creatingBooking, setCreatingBooking] = useState(false)

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null
  let subscription: RealtimeChannel | null = null

  useEffect(() => {
    checkSupabase()
    loadBookings()
    setBlockedSlots(getBlockedSlots())
    setRules(getRules())
    if (supabase) {
      subscription = supabase
        .channel('bookings_changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings_new' }, () => { loadBookings() })
        .subscribe()
    }
    return () => { if (subscription) supabase?.removeChannel(subscription) }
  }, [])

  const checkSupabase = async () => {
    if (!supabase) { setSupabaseStatus('❌ Missing Supabase credentials'); return }
    try {
      const { data, error, count } = await supabase.from('bookings_new').select('*', { count: 'exact' }).limit(1)
      if (error) setSupabaseStatus(`❌ Error: ${error.message}`)
      else setSupabaseStatus(`✅ Connected (${count || 0} bookings)`)
    } catch (err: any) { setSupabaseStatus(`❌ Failed: ${err.message}`) }
  }

  const loadBookings = async () => {
    if (!supabase) return
    setLoading(true)
    const { data, error } = await supabase.from('bookings_new').select('*').order('date', { ascending: false })
    if (error) console.error('Error:', error)
    else setBookings(data || [])
    setLoading(false)
  }

  const today = new Date().toISOString().split('T')[0]
  const pendingBookings = bookings.filter(b => b.status === 'pending')
  const upcomingBookings = bookings.filter(b => b.date >= today && (b.status === 'pending' || b.status === 'confirmed'))
  const allBookings = [...bookings].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const updateBookingStatus = async (id: string, newStatus: Booking['status']) => {
    if (actionLoading || !supabase) return
    setActionLoading(true)
    try {
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b))
      const { error } = await supabase.from('bookings_new').update({ status: newStatus }).eq('id', id)
      if (error) { await loadBookings(); throw error }
      alert(`Status updated to: ${newStatus}`)
    } catch (err: any) { alert(`Error: ${err.message}`) }
    finally { setActionLoading(false) }
  }

  const deleteBooking = async (id: string) => {
    if (!supabase) return
    if (!confirm('Delete this booking permanently?')) return
    setActionLoading(true)
    try {
      const { error } = await supabase.from('bookings_new').delete().eq('id', id)
      if (error) throw error
      setBookings(prev => prev.filter(b => b.id !== id))
      setSelectedBooking(null)
      alert('Booking deleted')
    } catch (err: any) { alert(`Error: ${err.message}`) }
    finally { setActionLoading(false) }
  }

  const createBooking = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!supabase) return
    setCreatingBooking(true)
    try {
      const { error } = await supabase.from('bookings_new').insert([{
        student_name: bookingForm.studentName,
        email: bookingForm.email || 'guest@example.com',
        phone: bookingForm.phone,
        date: bookingForm.date,
        time: bookingForm.time,
        lesson_type: bookingForm.lessonType,
        status: 'pending'
      }])
      if (error) throw error
      alert(`Booking created for ${bookingForm.studentName}`)
      setBookingForm({ studentName: '', email: '', phone: '', date: '', time: '9:00 AM', lessonType: 'single' })
      setSelectedTab('pending')
      await loadBookings()
    } catch (err: any) { alert(`Error: ${err.message}`) }
    finally { setCreatingBooking(false) }
  }

  const handleBlockSlot = () => {
    if (!selectedBlockDate || selectedBlockTimes.length === 0) { alert('Select a date and at least one time slot'); return }
    selectedBlockTimes.forEach(time => addBlockedSlot(selectedBlockDate, time))
    setBlockedSlots(getBlockedSlots())
    setSelectedBlockTimes([])
    alert(`Blocked ${selectedBlockTimes.length} slot(s)`)
  }

  const handleUnblockSlot = (date: string, time: string) => {
    removeBlockedSlot(date, time)
    setBlockedSlots(getBlockedSlots())
  }

  const handleCreateRule = () => {
    if (!ruleForm.name.trim()) { alert('Enter a rule name'); return }
    const newRule: Omit<AvailabilityRule, 'id' | 'createdAt'> = {
      name: ruleForm.name, type: ruleForm.type, priority: ruleForm.priority, dayType: ruleForm.dayType,
      repeatType: ruleForm.repeatType, startTime: ruleForm.startTime, endTime: ruleForm.endTime,
      maxBookings: ruleForm.maxBookings, enabled: true
    }
    if (editingRule) updateRule(editingRule.id, newRule)
    else addRule(newRule)
    setRules(getRules())
    setShowRuleForm(false)
    setEditingRule(null)
    setRuleForm({ name: '', type: 'TIME_BLOCK', priority: 10, dayType: 'ALL_DAYS', startTime: '9:00 AM', endTime: '5:00 PM', maxBookings: 3, repeatType: 'REPEATING' })
    alert(editingRule ? 'Rule updated!' : 'Rule created!')
  }

  const handleDeleteRule = (id: string) => {
    if (!confirm('Delete this rule?')) return
    deleteRule(id)
    setRules(getRules())
  }

  const handleToggleRule = (id: string, enabled: boolean) => {
    toggleRule(id, enabled)
    setRules(getRules())
  }

  const startEditRule = (rule: AvailabilityRule) => {
    setEditingRule(rule)
    setRuleForm({
      name: rule.name, type: rule.type, priority: rule.priority, dayType: rule.dayType,
      startTime: rule.startTime || '9:00 AM', endTime: rule.endTime || '5:00 PM',
      maxBookings: rule.maxBookings || 3, repeatType: rule.repeatType
    })
    setShowRuleForm(true)
  }

  const getTimeSlotsForDate = (date: string): string[] => {
    const dayOfWeek = new Date(date).getDay()
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
    if (isWeekend) return ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM']
    return ['9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM']
  }

  const formatDate = (dateStr: string): string => {
    return new Date(dateStr).toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
  }

  const tabs: { key: TabType; label: string; count?: number }[] = [
    { key: 'pending', label: 'Pending', count: pendingBookings.length },
    { key: 'upcoming', label: 'Upcoming', count: upcomingBookings.length },
    { key: 'all', label: 'All', count: allBookings.length },
    { key: 'rules', label: 'Rules', count: rules.filter(r => r.enabled).length },
    { key: 'availability', label: 'Availability' },
    { key: 'calendar', label: 'Calendar' },
    { key: 'create', label: '+ New' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Test Booking Page</h1>
              <p className="text-gray-600 mt-1">Comprehensive Supabase test with instructor portal features</p>
            </div>
            <div className="text-right">
              <p className={`font-mono text-sm ${supabaseStatus.includes('✅') ? 'text-green-600' : supabaseStatus.includes('❌') ? 'text-red-600' : 'text-gray-600'}`}>
                {supabaseStatus}
              </p>
              <button onClick={checkSupabase} className="text-xs text-blue-600 hover:underline mt-1">Re-check</button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-5 shadow"><div className="text-2xl mb-1">📋</div><div className="text-2xl font-bold text-yellow-600">{pendingBookings.length}</div><p className="text-gray-600 text-sm">Pending</p></div>
          <div className="bg-white rounded-xl p-5 shadow"><div className="text-2xl mb-1">📅</div><div className="text-2xl font-bold text-blue-600">{upcomingBookings.length}</div><p className="text-gray-600 text-sm">Upcoming</p></div>
          <div className="bg-white rounded-xl p-5 shadow"><div className="text-2xl mb-1">✅</div><div className="text-2xl font-bold text-green-600">{bookings.filter(b => b.status === 'confirmed').length}</div><p className="text-gray-600 text-sm">Confirmed</p></div>
          <div className="bg-white rounded-xl p-5 shadow"><div className="text-2xl mb-1">🚫</div><div className="text-2xl font-bold text-red-600">{blockedSlots.length}</div><p className="text-gray-600 text-sm">Blocked</p></div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="border-b">
            <div className="flex overflow-x-auto">
              {tabs.map(tab => (
                <button key={tab.key} onClick={() => setSelectedTab(tab.key)}
                  className={`px-6 py-4 font-semibold whitespace-nowrap transition ${selectedTab === tab.key ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}>
                  {tab.label}
                  {tab.count !== undefined && <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${selectedTab === tab.key ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>{tab.count}</span>}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {/* Pending */}
            {selectedTab === 'pending' && (
              <div>
                <h2 className="text-xl font-bold mb-4">Pending Bookings</h2>
                <p className="text-gray-600 mb-4">Bookings awaiting confirmation</p>
                {pendingBookings.length === 0 ? (
                  <div className="text-center py-12 text-gray-500"><div className="text-5xl mb-3">📋</div><p>No pending bookings</p></div>
                ) : (
                  <div className="space-y-4">
                    {pendingBookings.map(booking => (
                      <div key={booking.id} className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-5">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="px-2 py-1 bg-yellow-200 text-yellow-800 rounded text-xs font-bold">PENDING</span>
                              <span className="text-xs text-gray-500 font-mono">{booking.id.substring(0, 8)}...</span>
                            </div>
                            <p className="font-bold text-lg">{booking.student_name}</p>
                            <p className="text-gray-600">{booking.email}</p>
                            <p className="text-gray-600">{booking.phone}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">{formatDate(booking.date)}</p>
                            <p className="text-blue-600 font-bold text-xl">{booking.time}</p>
                            <p className="text-sm text-gray-500">{booking.lesson_type === 'single' ? 'Single Lesson' : 'Casual'}</p>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <button onClick={() => updateBookingStatus(booking.id, 'confirmed')} disabled={actionLoading} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold disabled:opacity-50">✅ Confirm</button>
                          <button onClick={() => updateBookingStatus(booking.id, 'cancelled')} disabled={actionLoading} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold disabled:opacity-50">❌ Cancel</button>
                          <button onClick={() => setSelectedBooking(booking)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">Details</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Upcoming */}
            {selectedTab === 'upcoming' && (
              <div>
                <h2 className="text-xl font-bold mb-4">Upcoming Bookings (Today & Future)</h2>
                <p className="text-gray-600 mb-4">Bookings with date &gt;= today and status pending/confirmed</p>
                {upcomingBookings.length === 0 ? (
                  <div className="text-center py-12 text-gray-500"><div className="text-5xl mb-3">📅</div><p>No upcoming bookings</p></div>
                ) : (
                  <div className="space-y-4">
                    {upcomingBookings.map(booking => {
                      const isToday = booking.date === today
                      return (
                        <div key={booking.id} className={`border-2 rounded-lg p-5 ${isToday ? 'border-blue-400 bg-blue-50' : 'border-gray-200 bg-white'}`}>
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                {isToday && <span className="px-2 py-1 bg-blue-500 text-white rounded text-xs font-bold">📅 TODAY</span>}
                                <span className={`px-2 py-1 rounded text-xs font-bold ${booking.status === 'confirmed' ? 'bg-green-200 text-green-800' : booking.status === 'pending' ? 'bg-yellow-200 text-yellow-800' : 'bg-gray-200 text-gray-800'}`}>{booking.status.toUpperCase()}</span>
                              </div>
                              <p className="font-bold text-lg">{booking.student_name}</p>
                              <p className="text-gray-600">{booking.email}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">{formatDate(booking.date)}</p>
                              <p className="text-blue-600 font-bold text-xl">{booking.time}</p>
                              <p className="text-sm text-gray-500">{booking.lesson_type === 'single' ? 'Single Lesson' : 'Casual'}</p>
                            </div>
                          </div>
                          <div className="flex gap-2 mt-4">
                            {booking.status === 'confirmed' && <button onClick={() => updateBookingStatus(booking.id, 'completed')} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold">✓ Completed</button>}
                            {booking.status !== 'cancelled' && <button onClick={() => updateBookingStatus(booking.id, 'cancelled')} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold">Cancel</button>}
                            <button onClick={() => setSelectedBooking(booking)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">Details</button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

            {/* All */}
            {selectedTab === 'all' && (
              <div>
                <h2 className="text-xl font-bold mb-4">All Bookings ({allBookings.length})</h2>
                {loading ? <div className="text-center py-8">Loading...</div> : allBookings.length === 0 ? (
                  <div className="text-center py-12 text-gray-500"><div className="text-5xl mb-3">📋</div><p>No bookings found</p></div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead><tr className="bg-gray-100">
                        <th className="px-4 py-3 text-left font-semibold">Student</th>
                        <th className="px-4 py-3 text-left font-semibold">Date/Time</th>
                        <th className="px-4 py-3 text-left font-semibold">Type</th>
                        <th className="px-4 py-3 text-left font-semibold">Status</th>
                        <th className="px-4 py-3 text-left font-semibold">Actions</th>
                      </tr></thead>
                      <tbody>
                        {allBookings.map(booking => (
                          <tr key={booking.id} className="border-b hover:bg-gray-50">
                            <td className="px-4 py-3"><p className="font-medium">{booking.student_name}</p><p className="text-sm text-gray-500">{booking.email}</p></td>
                            <td className="px-4 py-3"><p className="font-semibold">{formatDate(booking.date)}</p><p className="text-sm text-gray-500">{booking.time}</p></td>
                            <td className="px-4 py-3">{booking.lesson_type === 'single' ? 'Single Lesson' : 'Casual'}</td>
                            <td className="px-4 py-3"><span className={`px-2 py-1 rounded text-xs font-bold ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : booking.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>{booking.status.toUpperCase()}</span></td>
                            <td className="px-4 py-3">
                              <div className="flex gap-1 flex-wrap">
                                {booking.status === 'pending' && <><button onClick={() => updateBookingStatus(booking.id, 'confirmed')} className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700">Confirm</button><button onClick={() => updateBookingStatus(booking.id, 'cancelled')} className="text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700">Cancel</button></>}
                                {booking.status === 'confirmed' && <button onClick={() => updateBookingStatus(booking.id, 'cancelled')} className="text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700">Cancel</button>}
                                <button onClick={() => setSelectedBooking(booking)} className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300">Details</button>
                                <button onClick={() => deleteBooking(booking.id)} className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200">Delete</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Rules */}
            {selectedTab === 'rules' && (
              <div>
                <h2 className="text-xl font-bold mb-4">Booking Rules</h2>
                <p className="text-gray-600 mb-4">Rules control availability. Time Blocks prevent booking. Max Bookings limits daily slots.</p>
                {!showRuleForm && (
                  <button onClick={() => { setShowRuleForm(true); setEditingRule(null); setRuleForm({ name: '', type: 'TIME_BLOCK', priority: 10, dayType: 'ALL_DAYS', startTime: '9:00 AM', endTime: '5:00 PM', maxBookings: 3, repeatType: 'REPEATING' }) }}
                    className="mb-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold">+ Create New Rule</button>
                )}
                {showRuleForm && (
                  <div className="bg-white border-2 border-blue-300 rounded-xl p-6 mb-6">
                    <h3 className="text-lg font-bold mb-4">{editingRule ? 'Edit Rule' : 'Create New Rule'}</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div><label className="block text-sm font-medium mb-1">Rule Name *</label><input type="text" value={ruleForm.name} onChange={(e) => setRuleForm({ ...ruleForm, name: e.target.value })} className="w-full px-4 py-2 border rounded-lg" placeholder="e.g., Block weekday mornings" /></div>
                      <div><label className="block text-sm font-medium mb-1">Type</label><select value={ruleForm.type} onChange={(e) => setRuleForm({ ...ruleForm, type: e.target.value as any })} className="w-full px-4 py-2 border rounded-lg"><option value="TIME_BLOCK">🚫 Time Block</option><option value="EXCEPTION">✅ Exception</option><option value="MAX_BOOKING">📊 Max Bookings</option></select></div>
                      <div><label className="block text-sm font-medium mb-1">Priority (1-100)</label><input type="number" min="1" max="100" value={ruleForm.priority} onChange={(e) => setRuleForm({ ...ruleForm, priority: parseInt(e.target.value) || 1 })} className="w-full px-4 py-2 border rounded-lg" /></div>
                      <div><label className="block text-sm font-medium mb-1">Day Type</label><select value={ruleForm.dayType} onChange={(e) => setRuleForm({ ...ruleForm, dayType: e.target.value as any })} className="w-full px-4 py-2 border rounded-lg"><option value="ALL_DAYS">All Days</option><option value="WEEKDAY">Weekdays</option><option value="WEEKEND">Weekends</option></select></div>
                      {(ruleForm.type === 'TIME_BLOCK' || ruleForm.type === 'EXCEPTION') && (<><div><label className="block text-sm font-medium mb-1">Start Time</label><select value={ruleForm.startTime} onChange={(e) => setRuleForm({ ...ruleForm, startTime: e.target.value })} className="w-full px-4 py-2 border rounded-lg">{['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM'].map(t => <option key={t} value={t}>{t}</option>)}</select></div><div><label className="block text-sm font-medium mb-1">End Time</label><select value={ruleForm.endTime} onChange={(e) => setRuleForm({ ...ruleForm, endTime: e.target.value })} className="w-full px-4 py-2 border rounded-lg">{['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM'].map(t => <option key={t} value={t}>{t}</option>)}</select></div></>)}
                      {ruleForm.type === 'MAX_BOOKING' && <div><label className="block text-sm font-medium mb-1">Max Bookings Per Day</label><input type="number" min="1" max="20" value={ruleForm.maxBookings} onChange={(e) => setRuleForm({ ...ruleForm, maxBookings: parseInt(e.target.value) || 1 })} className="w-full px-4 py-2 border rounded-lg" /></div>}
                    </div>
                    <div className="flex gap-3 mt-6">
                      <button onClick={handleCreateRule} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold">{editingRule ? 'Update' : 'Save'}</button>
                      <button onClick={() => { setShowRuleForm(false); setEditingRule(null) }} className="px-6 py-2 border rounded-lg">Cancel</button>
                    </div>
                  </div>
                )}
                {rules.length === 0 ? (
                  <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg"><div className="text-5xl mb-3">📋</div><p>No rules configured</p></div>
                ) : (
                  <div className="space-y-4">
                    {[...rules].sort((a, b) => a.priority - b.priority).map(rule => (
                      <div key={rule.id} className={`border-2 rounded-lg p-5 ${!rule.enabled ? 'bg-gray-100 opacity-60' : rule.type === 'EXCEPTION' ? 'bg-green-50 border-green-200' : rule.type === 'MAX_BOOKING' ? 'bg-blue-50 border-blue-200' : 'bg-red-50 border-red-200'}`}>
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="px-2 py-1 bg-blue-500 text-white rounded-full text-xs font-bold">#{rule.priority}</span>
                              <span className={`px-2 py-1 rounded-full text-xs font-bold ${rule.type === 'EXCEPTION' ? 'bg-green-200 text-green-800' : rule.type === 'MAX_BOOKING' ? 'bg-blue-200 text-blue-800' : 'bg-red-200 text-red-800'}`}>{rule.type === 'TIME_BLOCK' ? '🚫 Block' : rule.type === 'EXCEPTION' ? '✅ Exception' : '📊 Max'}</span>
                              {!rule.enabled && <span className="px-2 py-1 bg-gray-200 text-gray-600 rounded-full text-xs">DISABLED</span>}
                            </div>
                            <h4 className="font-bold text-lg">{rule.name}</h4>
                          </div>
                          <button onClick={() => handleToggleRule(rule.id, !rule.enabled)} className={`px-3 py-1 rounded-lg text-sm font-semibold ${rule.enabled ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>{rule.enabled ? 'Disable' : 'Enable'}</button>
                        </div>
                        <div className="grid md:grid-cols-2 gap-2 text-sm mb-4">
                          <div><span className="text-gray-600">Days:</span> <span className="font-semibold">{rule.dayType === 'WEEKDAY' ? 'Weekdays' : rule.dayType === 'WEEKEND' ? 'Weekends' : 'All Days'}</span></div>
                          {rule.startTime && <div><span className="text-gray-600">Time:</span> <span className="font-semibold">{rule.startTime} - {rule.endTime}</span></div>}
                          {rule.maxBookings && <div><span className="text-gray-600">Max:</span> <span className="font-semibold">{rule.maxBookings}/day</span></div>}
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => startEditRule(rule)} className="px-3 py-2 bg-white border rounded-lg hover:bg-gray-50 text-sm">Edit</button>
                          <button onClick={() => handleDeleteRule(rule.id)} className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm">Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Availability */}
            {selectedTab === 'availability' && (
              <div>
                <h2 className="text-xl font-bold mb-4">Manage Availability</h2>
                <p className="text-gray-600 mb-4">Block time slots to prevent new bookings</p>
                <div className="bg-gray-50 rounded-xl p-6 mb-6">
                  <h3 className="font-semibold mb-4">Block Slots for Specific Day</h3>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Select Date</label>
                      <input type="date" value={selectedBlockDate} onChange={(e) => { setSelectedBlockDate(e.target.value); setSelectedBlockTimes([]) }} className="w-full px-4 py-2 border rounded-lg" min={today} />
                    </div>
                    {selectedBlockDate && (
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="block text-sm font-medium">Select Times to Block</label>
                          <button onClick={() => setSelectedBlockTimes(getTimeSlotsForDate(selectedBlockDate).filter(t => !blockedSlots.some(b => b.date === selectedBlockDate && b.time === t)))} className="text-xs text-blue-600 hover:underline">Select all</button>
                        </div>
                        <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto">
                          {getTimeSlotsForDate(selectedBlockDate).map(time => {
                            const isBlocked = blockedSlots.some(b => b.date === selectedBlockDate && b.time === time)
                            return (
                              <label key={time} className={`flex items-center p-2 border rounded cursor-pointer ${isBlocked ? 'bg-red-100 border-red-300 text-red-700' : selectedBlockTimes.includes(time) ? 'bg-blue-100 border-blue-300' : 'bg-white hover:bg-gray-100'}`}>
                                <input type="checkbox" checked={selectedBlockTimes.includes(time) || isBlocked} disabled={isBlocked} onChange={(e) => { if (e.target.checked) setSelectedBlockTimes([...selectedBlockTimes, time]); else setSelectedBlockTimes(selectedBlockTimes.filter(t => t !== time)) }} className="mr-2" />
                                <span className="text-sm">{time}</span>
                              </label>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                  <button onClick={handleBlockSlot} disabled={!selectedBlockDate || selectedBlockTimes.length === 0} className={`px-6 py-2 rounded-lg font-semibold transition ${selectedBlockDate && selectedBlockTimes.length > 0 ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}>
                    Block {selectedBlockTimes.length > 0 ? `${selectedBlockTimes.length} Slot(s)` : 'Selected'}
                  </button>
                </div>
                <h3 className="text-lg font-semibold mb-4">Currently Blocked ({blockedSlots.length})</h3>
                {blockedSlots.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 bg-green-50 border border-green-200 rounded-lg"><div className="text-4xl mb-2">✅</div><p>No blocked slots</p></div>
                ) : (
                  <div className="space-y-2">
                    {Object.entries(blockedSlots.reduce((acc, slot) => { if (!acc[slot.date]) acc[slot.date] = []; acc[slot.date].push(slot); return acc }, {} as Record<string, BlockedSlot[]>)).map(([date, slots]) => (
                      <div key={date} className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <p className="font-semibold text-red-800">{formatDate(date)}</p>
                          <button onClick={() => slots.forEach(s => handleUnblockSlot(s.date, s.time))} className="text-sm text-red-600 hover:text-red-800 underline">Unblock all</button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {slots.map((slot, idx) => (
                            <span key={idx} className="inline-flex items-center px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                              {slot.time}
                              <button onClick={() => handleUnblockSlot(slot.date, slot.time)} className="ml-2 text-red-600 hover:text-red-800 font-bold">×</button>
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Calendar */}
            {selectedTab === 'calendar' && (
              <div>
                <h2 className="text-xl font-bold mb-4">Calendar View</h2>
                <p className="text-gray-600 mb-4">View all bookings in a calendar format</p>
                <div className="bg-white border rounded-xl p-6 shadow-lg">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold">{new Date(calendarYear, calendarMonth).toLocaleDateString('en-AU', { month: 'long', year: 'numeric' })}</h3>
                    <div className="flex gap-2">
                      <button onClick={() => { if (calendarMonth === 0) { setCalendarMonth(11); setCalendarYear(calendarYear - 1) } else setCalendarMonth(calendarMonth - 1) }} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Previous</button>
                      <button onClick={() => { setCalendarMonth(new Date().getMonth()); setCalendarYear(new Date().getFullYear()) }} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Today</button>
                      <button onClick={() => { if (calendarMonth === 11) { setCalendarMonth(0); setCalendarYear(calendarYear + 1) } else setCalendarMonth(calendarMonth + 1) }} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Next</button>
                    </div>
                  </div>
                  <div className="grid grid-cols-7 gap-2">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <div key={day} className="text-center font-semibold text-gray-700 py-2 border-b">{day}</div>
                    ))}
                    {(() => {
                      const firstDay = new Date(calendarYear, calendarMonth, 1).getDay()
                      const lastDay = new Date(calendarYear, calendarMonth + 1, 0).getDate()
                      const days: (string | null)[] = []
                      for (let i = 0; i < firstDay; i++) days.push(null)
                      for (let i = 1; i <= lastDay; i++) {
                        const d = new Date(calendarYear, calendarMonth, i)
                        days.push(d.toISOString().split('T')[0])
                      }
                      const bookingsByDate: Record<string, Booking[]> = {}
                      allBookings.forEach(b => { if (!bookingsByDate[b.date]) bookingsByDate[b.date] = []; bookingsByDate[b.date].push(b) })
                      return days.map((date, index) => {
                        if (!date) return <div key={`empty-${index}`} className="h-32 bg-gray-50 rounded-lg"></div>
                        const dayBookings = bookingsByDate[date] || []
                        const isToday = date === today
                        return (
                          <div key={date} className={`h-32 border rounded-lg p-2 overflow-y-auto ${isToday ? 'bg-blue-50 border-blue-300' : 'bg-white'}`}>
                            <div className="flex justify-between items-start mb-1">
                              <span className={`font-semibold ${isToday ? 'text-blue-600' : 'text-gray-700'}`}>{new Date(date).getDate()}</span>
                              {isToday && <span className="text-xs bg-blue-100 text-blue-800 px-1 rounded">Today</span>}
                            </div>
                            <div className="space-y-1">
                              {dayBookings.slice(0, 3).map(booking => (
                                <div key={booking.id} onClick={() => setSelectedBooking(booking)}
                                  className={`text-xs p-1 rounded cursor-pointer hover:opacity-80 ${booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                  <div className="font-medium truncate">{booking.student_name}</div>
                                  <div className="truncate">{booking.time}</div>
                                </div>
                              ))}
                              {dayBookings.length > 3 && <div className="text-xs text-gray-500 text-center">+{dayBookings.length - 3} more</div>}
                              {dayBookings.length === 0 && <div className="text-xs text-gray-400 text-center mt-4">No bookings</div>}
                            </div>
                          </div>
                        )
                      })
                    })()}
                  </div>
                  <div className="mt-6 pt-4 border-t">
                    <h4 className="font-semibold mb-2">Legend:</h4>
                    <div className="flex flex-wrap gap-3">
                      <div className="flex items-center"><div className="w-3 h-3 bg-yellow-100 border border-yellow-300 rounded mr-2"></div><span className="text-sm">Pending</span></div>
                      <div className="flex items-center"><div className="w-3 h-3 bg-green-100 border border-green-300 rounded mr-2"></div><span className="text-sm">Confirmed</span></div>
                      <div className="flex items-center"><div className="w-3 h-3 bg-gray-100 border border-gray-300 rounded mr-2"></div><span className="text-sm">Completed</span></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Create Booking */}
            {selectedTab === 'create' && (
              <div>
                <h2 className="text-xl font-bold mb-4">Create New Booking</h2>
                <p className="text-gray-600 mb-6">Create a booking directly in the system with status pending</p>
                <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl">
                  <form onSubmit={createBooking} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Student Name *</label>
                      <input type="text" value={bookingForm.studentName} onChange={(e) => setBookingForm({ ...bookingForm, studentName: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Enter student's full name" required />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input type="email" value={bookingForm.email} onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="student@example.com" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                        <input type="tel" value={bookingForm.phone} onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="0412 345 678" />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                        <input type="date" value={bookingForm.date} onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value, time: '9:00 AM' })} min={today} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Time *</label>
                        <select value={bookingForm.time} onChange={(e) => setBookingForm({ ...bookingForm, time: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required>
                          {bookingForm.date ? getTimeSlotsForDate(bookingForm.date).map(t => <option key={t} value={t}>{t}</option>) : <><option value="9:00 AM">9:00 AM</option><option value="10:00 AM">10:00 AM</option><option value="11:00 AM">11:00 AM</option><option value="1:00 PM">1:00 PM</option><option value="2:00 PM">2:00 PM</option><option value="3:00 PM">3:00 PM</option><option value="4:00 PM">4:00 PM</option><option value="5:00 PM">5:00 PM</option><option value="6:00 PM">6:00 PM</option><option value="7:00 PM">7:00 PM</option></>}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Lesson Type</label>
                        <select value={bookingForm.lessonType} onChange={(e) => setBookingForm({ ...bookingForm, lessonType: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                          <option value="single">Single Lesson ($55)</option>
                          <option value="casual">Casual Driving ($45)</option>
                        </select>
                      </div>
                    </div>
                    <div className="pt-4 border-t">
                      <div className="flex gap-4">
                        <button type="submit" disabled={creatingBooking || !bookingForm.studentName || !bookingForm.date || !bookingForm.time}
                          className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold">
                          {creatingBooking ? 'Creating...' : 'Create Booking'}
                        </button>
                        <button type="button" onClick={() => setBookingForm({ studentName: '', email: '', phone: '', date: '', time: '9:00 AM', lessonType: 'single' })}
                          className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition">Clear</button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedBooking(null)}>
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Booking Details</h2>
              <button onClick={() => setSelectedBooking(null)} className="text-gray-500 hover:text-gray-700 text-2xl">×</button>
            </div>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div><p className="text-sm text-gray-600 mb-1">Booking ID</p><p className="font-semibold font-mono text-sm">{selectedBooking.id}</p></div>
                <div><p className="text-sm text-gray-600 mb-1">Status</p><span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${selectedBooking.status === 'confirmed' ? 'bg-green-100 text-green-800' : selectedBooking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : selectedBooking.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>{selectedBooking.status.toUpperCase()}</span></div>
                <div><p className="text-sm text-gray-600 mb-1">Student Name</p><p className="font-semibold">{selectedBooking.student_name}</p></div>
                <div><p className="text-sm text-gray-600 mb-1">Email</p><p className="font-semibold">{selectedBooking.email}</p></div>
                <div><p className="text-sm text-gray-600 mb-1">Phone</p><p className="font-semibold">{selectedBooking.phone}</p></div>
                <div><p className="text-sm text-gray-600 mb-1">Lesson Type</p><p className="font-semibold">{selectedBooking.lesson_type === 'single' ? 'Single Lesson' : 'Casual'}</p></div>
                <div><p className="text-sm text-gray-600 mb-1">Date</p><p className="font-semibold">{formatDate(selectedBooking.date)}</p></div>
                <div><p className="text-sm text-gray-600 mb-1">Time</p><p className="font-semibold text-xl text-blue-600">{selectedBooking.time}</p></div>
                <div><p className="text-sm text-gray-600 mb-1">Created</p><p className="font-semibold">{new Date(selectedBooking.created_at).toLocaleString()}</p></div>
              </div>
              <div className="border-t pt-6 mt-6">
                <p className="text-sm text-gray-600 mb-4">Update Status</p>
                <div className="flex flex-wrap gap-3">
                  {selectedBooking.status !== 'confirmed' && selectedBooking.status !== 'completed' && <button onClick={() => { updateBookingStatus(selectedBooking.id, 'confirmed'); setSelectedBooking(null) }} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">Confirm</button>}
                  {selectedBooking.status === 'confirmed' && <button onClick={() => { updateBookingStatus(selectedBooking.id, 'completed'); setSelectedBooking(null) }} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Mark Completed</button>}
                  {selectedBooking.status !== 'cancelled' && selectedBooking.status !== 'completed' && <button onClick={() => { updateBookingStatus(selectedBooking.id, 'cancelled'); setSelectedBooking(null) }} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">Cancel</button>}
                </div>
              </div>
              <div className="border-t pt-6 mt-6">
                <p className="text-sm text-gray-600 mb-4">Danger Zone</p>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-700 mb-3"><strong>⚠️ Permanent Deletion</strong><br/>This will completely remove the booking.</p>
                  <button onClick={() => deleteBooking(selectedBooking.id)} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold">🗑️ Delete Permanently</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

