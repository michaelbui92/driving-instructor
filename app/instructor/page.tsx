'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  formatDate,
  getLessonTypeName,
  generateTimeSlots,
  getBlockedSlots,
  addBlockedSlot,
  removeBlockedSlot,
  type Booking,
  type BlockedSlot,
  RuleType,
  DayType,
  RepeatType,
  type AvailabilityRule,
  getRules,
  addRule,
  updateRule,
  deleteRule,
  toggleRule,
  getSortedRules
} from '@/lib/booking-utils'

type TabType = 'today' | 'upcoming' | 'all' | 'rules' | 'availability'

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

export default function InstructorPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [selectedTab, setSelectedTab] = useState<TabType>('today')
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [blockedSlots, setBlockedSlots] = useState<BlockedSlot[]>([])
  const [selectedBlockDate, setSelectedBlockDate] = useState<string>('')
  const [selectedBlockTimes, setSelectedBlockTimes] = useState<string[]>([])
  const [showArchived, setShowArchived] = useState(false)
  
  // Bulk blocking state
  const [bulkMode, setBulkMode] = useState<'none' | 'weekdays' | 'weekends' | 'daterange'>('none')
  const [bulkStartDate, setBulkStartDate] = useState<string>('')
  const [bulkEndDate, setBulkEndDate] = useState<string>('')

  // Rules management state
  const [rules, setRules] = useState<AvailabilityRule[]>([])
  const [showRuleForm, setShowRuleForm] = useState(false)
  const [editingRule, setEditingRule] = useState<AvailabilityRule | null>(null)
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

  useEffect(() => {
    try {
      const storedBookings = localStorage.getItem('bookings')
      if (storedBookings) {
        setBookings(JSON.parse(storedBookings))
      }
    } catch (error) {
      console.error('Error loading bookings:', error)
      setBookings([])
    }
    setBlockedSlots(getBlockedSlots())
    setRules(getRules())
  }, [])

  const today = new Date().toISOString().split('T')[0]
  const todayBookings = bookings.filter(b => b.date === today && b.status !== 'cancelled' && !b.archived)
  const upcomingBookings = bookings.filter(b => b.date > today && (b.status === 'pending' || b.status === 'confirmed') && !b.archived)
  const allBookings = bookings.filter(b => !b.archived).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  const archivedBookings = bookings.filter(b => b.archived).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const getFilteredBookings = () => {
    if (selectedTab === 'today') return todayBookings
    if (selectedTab === 'upcoming') return upcomingBookings
    if (selectedTab === 'all') return allBookings
    return []
  }

  const updateBookingStatus = (bookingId: string, newStatus: Booking['status']) => {
    try {
      const updatedBookings = bookings.map(b => b.id === bookingId ? { ...b, status: newStatus } : b)
      setBookings(updatedBookings)
      localStorage.setItem('bookings', JSON.stringify(updatedBookings))
      alert(`Booking status updated to: ${newStatus}`)
    } catch (error) {
      console.error('Error updating booking status:', error)
      alert('Error updating booking status. Please try again.')
    }
  }

  const archiveBooking = (bookingId: string) => {
    try {
      const booking = bookings.find(b => b.id === bookingId)
      if (!booking) return

      const updatedBookings = bookings.map(b => 
        b.id === bookingId ? { ...b, archived: !b.archived } : b
      )
      setBookings(updatedBookings)
      localStorage.setItem('bookings', JSON.stringify(updatedBookings))
      alert(booking.archived ? 'Booking unarchived successfully' : 'Booking archived successfully')
    } catch (error) {
      console.error('Error archiving booking:', error)
      alert('Error archiving booking. Please try again.')
    }
  }

  const getTotalRevenue = () => bookings.filter(b => b.status === 'completed').reduce((sum, b) => sum + b.price, 0)
  const getPendingRevenue = () => bookings.filter(b => b.status !== 'cancelled').reduce((sum, b) => sum + b.price, 0)

  const handleBlockSlot = () => {
    if (!selectedBlockDate || selectedBlockTimes.length === 0) {
      alert('Please select a date and at least one time slot to block')
      return
    }
    try {
      selectedBlockTimes.forEach(time => addBlockedSlot(selectedBlockDate, time))
      setBlockedSlots(getBlockedSlots())
      setSelectedBlockTimes([])
      alert(`Blocked ${selectedBlockTimes.length} time slot(s) successfully`)
    } catch (error) {
      console.error('Error blocking slots:', error)
      alert('Error blocking slots. Please try again.')
    }
  }

  const handleUnblockSlot = (date: string, time: string) => {
    try {
      removeBlockedSlot(date, time)
      setBlockedSlots(getBlockedSlots())
    } catch (error) {
      console.error('Error unblocking slot:', error)
      alert('Error unblocking slot. Please try again.')
    }
  }

  const handleBulkBlock = () => {
    if (bulkMode === 'none') return
    
    try {
      const slots = generateTimeSlots()
      let blockedCount = 0
      
      if (bulkMode === 'weekdays') {
        // Block all weekdays EXCEPT 6pm, 7pm, 8pm
        const allowedTimes = ['6:00 PM', '7:00 PM', '8:00 PM']
        slots.forEach(slot => {
          const dateObj = new Date(slot.date)
          const dayOfWeek = dateObj.getDay()
          const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
          
          if (!isWeekend && !allowedTimes.includes(slot.time)) {
            addBlockedSlot(slot.date, slot.time)
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
            addBlockedSlot(slot.date, slot.time)
            blockedCount++
          }
        })
      } else if (bulkMode === 'daterange') {
        if (!bulkStartDate || !bulkEndDate) {
          alert('Please select start and end dates')
          return
        }
        // Block all slots in range EXCEPT 6pm, 7pm, 8pm
        const allowedTimes = ['6:00 PM', '7:00 PM', '8:00 PM']
        slots.forEach(slot => {
          if (slot.date >= bulkStartDate && slot.date <= bulkEndDate) {
            if (!allowedTimes.includes(slot.time)) {
              addBlockedSlot(slot.date, slot.time)
              blockedCount++
            }
          }
        })
      }
      
      setBlockedSlots(getBlockedSlots())
      alert(`Blocked ${blockedCount} time slot(s). Remaining slots: 6pm, 7pm, 8pm.`)
      setBulkMode('none')
    } catch (error) {
      console.error('Error in bulk block:', error)
      alert('Error blocking slots. Please try again.')
    }
  }

  const getTimeSlotsForDate = (date: string): string[] => {
    return generateTimeSlots().filter(slot => slot.date === date).map(slot => slot.time)
  }

  const isSlotBlocked = (date: string, time: string): boolean => {
    return blockedSlots.some(b => b.date === date && b.time === time)
  }

  // ============== Rules Management Functions ==============
  const handleCreateRule = () => {
    try {
      // Validation
      if (!ruleForm.name.trim()) {
        alert('Please enter a rule name')
        return
      }

      if (ruleForm.priority < 1 || ruleForm.priority > 100) {
        alert('Priority must be between 1 and 100')
        return
      }

      if ((ruleForm.type === RuleType.TIME_BLOCK || ruleForm.type === RuleType.EXCEPTION)) {
        if (!ruleForm.startTime || !ruleForm.endTime) {
          alert('Please enter both start and end times for this rule type')
          return
        }
      }

      if (ruleForm.type === RuleType.MAX_BOOKING && ruleForm.maxBookings < 1) {
        alert('Max bookings must be at least 1')
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

      addRule(newRule)
      setRules(getRules())
      setShowRuleForm(false)
      resetRuleForm()
      alert('Rule created successfully!')
    } catch (error) {
      console.error('Error creating rule:', error)
      alert('Error creating rule. Please try again.')
    }
  }

  const handleUpdateRule = (id: string) => {
    try {
      // Validation (same as create)
      if (!ruleForm.name.trim()) {
        alert('Please enter a rule name')
        return
      }

      if (ruleForm.priority < 1 || ruleForm.priority > 100) {
        alert('Priority must be between 1 and 100')
        return
      }

      if ((ruleForm.type === RuleType.TIME_BLOCK || ruleForm.type === RuleType.EXCEPTION)) {
        if (!ruleForm.startTime || !ruleForm.endTime) {
          alert('Please enter both start and end times for this rule type')
          return
        }
      }

      if (ruleForm.type === RuleType.MAX_BOOKING && ruleForm.maxBookings < 1) {
        alert('Max bookings must be at least 1')
        return
      }

      updateRule(id, {
        name: ruleForm.name,
        type: ruleForm.type,
        priority: ruleForm.priority,
        dayType: ruleForm.dayType,
        repeatType: ruleForm.repeatType,
        startTime: (ruleForm.type === RuleType.TIME_BLOCK || ruleForm.type === RuleType.EXCEPTION) ? ruleForm.startTime : undefined,
        endTime: (ruleForm.type === RuleType.TIME_BLOCK || ruleForm.type === RuleType.EXCEPTION) ? ruleForm.endTime : undefined,
        maxBookings: ruleForm.type === RuleType.MAX_BOOKING ? ruleForm.maxBookings : undefined
      })

      setRules(getRules())
      setShowRuleForm(false)
      setEditingRule(null)
      resetRuleForm()
      alert('Rule updated successfully!')
    } catch (error) {
      console.error('Error updating rule:', error)
      alert('Error updating rule. Please try again.')
    }
  }

  const handleDeleteRule = (id: string) => {
    if (confirm('Are you sure you want to delete this rule?')) {
      try {
        deleteRule(id)
        setRules(getRules())
        alert('Rule deleted successfully!')
      } catch (error) {
        console.error('Error deleting rule:', error)
        alert('Error deleting rule. Please try again.')
      }
    }
  }

  const handleToggleRule = (id: string, enabled: boolean) => {
    try {
      toggleRule(id, enabled)
      setRules(getRules())
    } catch (error) {
      console.error('Error toggling rule:', error)
      alert('Error toggling rule. Please try again.')
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

  const sortedRules = getSortedRules()

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
                      <span className={`text-xs px-2 py-1 rounded-full ${rule.type === RuleType.EXCEPTION ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {rule.type === RuleType.TIME_BLOCK ? '🚫 Time Block' : '✅ Exception'}
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
                      <span className="font-semibold">{rule.startTime} - {rule.endTime}</span>
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

  const renderAvailabilityTab = () => (
    <div>
      <h2 className="text-2xl font-bold mb-6">Manage Your Availability</h2>
      <p className="text-gray-600 mb-6">
        Students can only book slots that you have not blocked. Use bulk blocking to quickly set your availability, then fine-tune individual days.
      </p>

      {/* Bulk Blocking Section */}
      <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4">⚡ Quick Block</h3>
        <p className="text-sm text-gray-600 mb-4">
          Block multiple slots at once. This will block all slots EXCEPT 6pm, 7pm, and 8pm.
        </p>
        
        <div className="grid md:grid-cols-4 gap-4 mb-4">
          <button
            onClick={() => { setBulkMode('weekdays'); handleBulkBlock() }}
            className="px-4 py-3 bg-white border-2 border-purple-300 rounded-lg hover:border-purple-500 transition text-left"
          >
            <span className="font-semibold block">All Weekdays</span>
            <span className="text-xs text-gray-500">Block 9am-5pm (keep 6-8pm)</span>
          </button>
          <button
            onClick={() => { setBulkMode('weekends'); handleBulkBlock() }}
            className="px-4 py-3 bg-white border-2 border-purple-300 rounded-lg hover:border-purple-500 transition text-left"
          >
            <span className="font-semibold block">All Weekends</span>
            <span className="text-xs text-gray-500">Block 8am-5pm (keep 6-8pm)</span>
          </button>
          <div className="px-4 py-3 bg-white border-2 border-purple-300 rounded-lg">
            <span className="font-semibold block mb-2">Date Range</span>
            <div className="flex gap-2 mb-2">
              <input
                type="date"
                value={bulkStartDate}
                onChange={(e) => setBulkStartDate(e.target.value)}
                className="text-sm px-2 py-1 border rounded w-full"
                min={today}
              />
              <input
                type="date"
                value={bulkEndDate}
                onChange={(e) => setBulkEndDate(e.target.value)}
                className="text-sm px-2 py-1 border rounded w-full"
                min={bulkStartDate || today}
              />
            </div>
            <button
              onClick={() => { setBulkMode('daterange'); handleBulkBlock() }}
              disabled={!bulkStartDate || !bulkEndDate}
              className="w-full text-xs px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Apply
            </button>
          </div>
          <button
            onClick={() => {
              if (confirm('This will unblock ALL slots. Continue?')) {
                blockedSlots.forEach(b => removeBlockedSlot(b.date, b.time))
                setBlockedSlots(getBlockedSlots())
                alert('All slots unblocked!')
              }
            }}
            className="px-4 py-3 bg-red-50 border-2 border-red-300 rounded-lg hover:border-red-500 transition text-left"
          >
            <span className="font-semibold text-red-700 block">Unblock All</span>
            <span className="text-xs text-red-500">Reset to all available</span>
          </button>
        </div>
      </div>

      {/* Individual Day Blocking */}
      <div className="bg-gray-50 rounded-xl p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4">Block Slots for Specific Day</h3>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
            <input
              type="date"
              value={selectedBlockDate}
              onChange={(e) => { setSelectedBlockDate(e.target.value); setSelectedBlockTimes([]) }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              min={today}
            />
          </div>
          {selectedBlockDate && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">Select Times to Block</label>
                <button
                  onClick={() => {
                    const available = getTimeSlotsForDate(selectedBlockDate).filter(t => !isSlotBlocked(selectedBlockDate, t))
                    setSelectedBlockTimes(available)
                  }}
                  className="text-xs text-primary hover:underline"
                >
                  Select all available
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto">
                {getTimeSlotsForDate(selectedBlockDate).map(time => (
                  <label
                    key={time}
                    className={`flex items-center p-2 border rounded cursor-pointer ${
                      isSlotBlocked(selectedBlockDate, time)
                        ? 'bg-red-100 border-red-300 text-red-700'
                        : 'bg-white hover:bg-gray-100'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedBlockTimes.includes(time)}
                      disabled={isSlotBlocked(selectedBlockDate, time)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedBlockTimes([...selectedBlockTimes, time])
                        } else {
                          setSelectedBlockTimes(selectedBlockTimes.filter(t => t !== time))
                        }
                      }}
                      className="mr-2"
                    />
                    <span className="text-sm">{time}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleBlockSlot}
            disabled={!selectedBlockDate || selectedBlockTimes.length === 0}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              selectedBlockDate && selectedBlockTimes.length > 0
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Block {selectedBlockTimes.length > 0 ? `${selectedBlockTimes.length} Slot(s)` : 'Selected'}
          </button>
          {selectedBlockTimes.length > 0 && (
            <button
              onClick={() => setSelectedBlockTimes([])}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Clear Selection
            </button>
          )}
        </div>
      </div>

      {/* Currently Blocked Slots */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Currently Blocked ({blockedSlots.length})</h3>
        {blockedSlots.length === 0 ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <div className="text-4xl mb-2">✅</div>
            <p className="text-green-800 font-semibold">No blocked slots</p>
            <p className="text-green-600 text-sm">All time slots are available for booking</p>
          </div>
        ) : (
          <div className="space-y-2">
            {Object.entries(
              blockedSlots.reduce((acc, slot) => {
                if (!acc[slot.date]) acc[slot.date] = []
                acc[slot.date].push(slot)
                return acc
              }, {} as Record<string, BlockedSlot[]>)
            ).map(([date, slots]) => (
              <div key={date} className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <p className="font-semibold text-red-800">{formatDate(date)}</p>
                  <button
                    onClick={() => slots.forEach(s => handleUnblockSlot(s.date, s.time))}
                    className="text-sm text-red-600 hover:text-red-800 underline"
                  >
                    Unblock all
                  </button>
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
    </div>
  )

  const renderBookingList = () => {
    const filtered = getFilteredBookings()
    if (filtered.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-xl font-semibold mb-2">No Bookings Found</h3>
          <p className="text-gray-600">Bookings will appear here once students schedule lessons</p>
        </div>
      )
    }
    return filtered.map((booking) => (
      <div
        key={booking.id}
        className="border rounded-lg p-6 mb-4 hover:shadow-md transition cursor-pointer"
        onClick={() => setSelectedBooking(booking)}
      >
        <div className="grid md:grid-cols-6 gap-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">Date & Time</p>
            <p className="font-semibold">{formatDate(booking.date)}</p>
            <p className="text-gray-600">{booking.time}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Student</p>
            <p className="font-semibold">{booking.studentName}</p>
            <p className="text-gray-600 text-sm">{booking.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Phone</p>
            <p className="font-semibold">{booking.phone}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Lesson Type</p>
            <p className="font-semibold">{getLessonTypeName(booking.lessonType)}</p>
            <p className="text-primary font-bold">${booking.price}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Status</p>
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
                className="block mt-1 text-primary hover:text-secondary text-sm font-semibold"
              >
                Confirm
              </button>
            )}
          </div>
          <div className="flex items-end">
            {selectedTab === 'all' && (
              <button
                onClick={(e) => { e.stopPropagation(); archiveBooking(booking.id) }}
                className="w-full px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition font-semibold"
              >
                Archive
              </button>
            )}
          </div>
        </div>
      </div>
    ))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-primary">🚗 Drive With Bui</Link>
            <div className="flex space-x-4">
              <Link href="/dashboard" className="px-4 py-2 border-2 border-primary text-primary rounded-lg hover:bg-blue-50 transition">Student View</Link>
              <Link href="/" className="text-gray-700 hover:text-primary transition">Home</Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Instructor Portal</h1>
          <p className="text-gray-600">Manage your schedule and student bookings</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="text-3xl mb-2">📅</div>
            <div className="text-3xl font-bold text-primary">{todayBookings.length}</div>
            <p className="text-gray-600">Todays Lessons</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="text-3xl mb-2">🗓️</div>
            <div className="text-3xl font-bold text-blue-600">{upcomingBookings.length}</div>
            <p className="text-gray-600">Upcoming</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="text-3xl mb-2">✅</div>
            <div className="text-3xl font-bold text-green-600">${getTotalRevenue()}</div>
            <p className="text-gray-600">Revenue</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="text-3xl mb-2">💰</div>
            <div className="text-3xl font-bold text-accent">${getPendingRevenue()}</div>
            <p className="text-gray-600">Pending</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg mb-8">
          <div className="border-b">
            <div className="flex">
              <button
                className={`flex-1 px-6 py-4 font-semibold transition ${selectedTab === 'today' ? 'border-b-2 border-primary text-primary' : 'text-gray-600 hover:text-gray-800'}`}
                onClick={() => setSelectedTab('today')}
              >Today ({todayBookings.length})</button>
              <button
                className={`flex-1 px-6 py-4 font-semibold transition ${selectedTab === 'upcoming' ? 'border-b-2 border-primary text-primary' : 'text-gray-600 hover:text-gray-800'}`}
                onClick={() => setSelectedTab('upcoming')}
              >Upcoming ({upcomingBookings.length})</button>
              <button
                className={`flex-1 px-6 py-4 font-semibold transition ${selectedTab === 'all' ? 'border-b-2 border-primary text-primary' : 'text-gray-600 hover:text-gray-800'}`}
                onClick={() => setSelectedTab('all')}
              >All ({allBookings.length})</button>
              <button
                className={`flex-1 px-6 py-4 font-semibold transition ${selectedTab === 'rules' ? 'border-b-2 border-primary text-primary' : 'text-gray-600 hover:text-gray-800'}`}
                onClick={() => setSelectedTab('rules')}
              >📋 Rules ({rules.filter(r => r.enabled).length})</button>
              <button
                className={`flex-1 px-6 py-4 font-semibold transition ${selectedTab === 'availability' ? 'border-b-2 border-primary text-primary' : 'text-gray-600 hover:text-gray-800'}`}
                onClick={() => setSelectedTab('availability')}
              >🚫 Availability</button>
            </div>
          </div>
          <div className="p-6">
            {selectedTab === 'availability' ? renderAvailabilityTab() : selectedTab === 'rules' ? renderRulesTab() : (
              <>
                {renderBookingList()}
                {selectedTab === 'all' && archivedBookings.length > 0 && (
                  <div className="mt-8 border-t pt-6">
                    <button
                      onClick={() => setShowArchived(!showArchived)}
                      className="flex items-center gap-2 text-lg font-semibold text-gray-700 hover:text-gray-900 mb-4"
                    >
                      {showArchived ? 'Show Archived ▲' : 'Show Archived ▼'}
                      <span className="text-sm font-normal text-gray-500">({archivedBookings.length})</span>
                    </button>
                    {showArchived && (
                      <div className="space-y-3">
                        {archivedBookings.map((booking) => (
                          <div
                            key={booking.id}
                            className="border rounded-lg p-6 bg-gray-50 opacity-75 hover:opacity-100 transition"
                          >
                            <div className="grid md:grid-cols-5 gap-4">
                              <div>
                                <p className="text-sm text-gray-600 mb-1">Date & Time</p>
                                <p className="font-semibold text-gray-700">{formatDate(booking.date)}</p>
                                <p className="text-gray-500">{booking.time}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600 mb-1">Student</p>
                                <p className="font-semibold text-gray-700">{booking.studentName}</p>
                                <p className="text-gray-500 text-sm">{booking.email}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600 mb-1">Phone</p>
                                <p className="font-semibold text-gray-700">{booking.phone}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600 mb-1">Lesson Type</p>
                                <p className="font-semibold text-gray-700">{getLessonTypeName(booking.lessonType)}</p>
                                <p className="text-gray-600 font-bold">${booking.price}</p>
                              </div>
                              <div className="flex flex-col">
                                <p className="text-sm text-gray-600 mb-1">Status</p>
                                <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                                  booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800'
                                  : booking.status === 'confirmed' ? 'bg-green-100 text-green-800'
                                  : booking.status === 'completed' ? 'bg-blue-100 text-blue-800'
                                  : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                </span>
                                <button
                                  onClick={() => archiveBooking(booking.id)}
                                  className="mt-2 px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition font-semibold text-sm"
                                >
                                  Unarchive
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
                <div className="border-t pt-6">
                  <p className="text-sm text-gray-600 mb-4">Update Status</p>
                  <div className="flex flex-wrap gap-3">
                    {selectedBooking.status !== 'confirmed' && (
                      <button onClick={() => { updateBookingStatus(selectedBooking.id, 'confirmed'); setSelectedBooking(null) }} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">Confirm Booking</button>
                    )}
                    {selectedBooking.status !== 'cancelled' && (
                      <button onClick={() => { updateBookingStatus(selectedBooking.id, 'cancelled'); setSelectedBooking(null) }} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">Cancel Booking</button>
                    )}
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
