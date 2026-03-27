'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import { supabase } from '@/lib/supabase'

// Force dynamic rendering to prevent Vercel edge caching
export const dynamic = 'force-dynamic'

interface Booking {
  id: string
  studentName: string
  email: string
  phone: string
  date: string
  time: string
  lessonType: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  price: number
  createdAt: string
}

export default function PublicBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'upcoming' | 'all'>('upcoming')
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const loadBookings = async () => {
    try {
      const res = await fetch(`/api/bookings?t=${Date.now()}&r=${Math.random()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      })
      const data = await res.json()
      console.log('📥 loadBookings received:', data.bookings?.length, 'bookings', data.bookings?.map((b: Booking) => b.status))
      setBookings(data.bookings || [])
    } catch (err) {
      console.error('Error loading bookings:', err)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (bookingId: string, newStatus: string) => {
    if (!confirm(`Are you sure you want to ${newStatus} this booking?`)) return
    
    setUpdatingId(bookingId)
    console.log(`🔄 Updating booking ${bookingId} to ${newStatus}...`)
    
    try {
      const res = await fetch(`/api/bookings/${bookingId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })
      
      const data = await res.json()
      console.log('📦 Update response:', { status: res.status, data })
      
      if (res.ok) {
        console.log('✅ Update successful!')
        
        // IMPORTANT: Supabase has replication lag of 2-5 seconds
        // Wait 5 seconds to ensure changes propagate before refreshing
        console.log('⏳ Waiting 5 seconds for Supabase replication...')
        setUpdatingId('waiting') // Show different state
        
        // Show user feedback
        alert(`Booking ${newStatus}! Changes may take a few seconds to appear.`)
        
        // Wait for replication
        await new Promise(resolve => setTimeout(resolve, 5000))
        
        console.log('🔄 Now refreshing bookings list...')
        // Refresh bookings list
        await loadBookings()
        console.log('📋 Bookings refreshed after replication wait')
      } else {
        console.error('❌ Update failed:', data.error)
        alert(`Failed to update: ${data.error || 'Unknown error'}`)
      }
    } catch (err) {
      console.error('❌ Network error:', err)
      alert('Network error - please try again')
    } finally {
      setUpdatingId(null)
    }
  }

  useEffect(() => {
    loadBookings()
    
    // Set up real-time subscription for bookings changes
    const channel = supabase
      .channel('public-bookings-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // INSERT, UPDATE, DELETE
          schema: 'public',
          table: 'bookings'
        },
        (payload) => {
          console.log('Real-time booking change in public view:', payload)
          // Refresh bookings when any change occurs
          loadBookings()
        }
      )
      .subscribe()

    // Auto-refresh every 30 seconds as backup
    const interval = setInterval(() => {
      loadBookings()
    }, 30000)
    
    return () => {
      supabase.removeChannel(channel)
      clearInterval(interval)
    }
  }, [])

  const today = new Date().toISOString().split('T')[0]
  
  const upcomingBookings = bookings.filter(b => 
    (b.status === 'pending' || b.status === 'confirmed') && b.date >= today
  )
  
  const displayedBookings = activeTab === 'upcoming' ? upcomingBookings : bookings

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 py-16 text-center">
          <p className="text-gray-500">Loading bookings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar showLocation={false} />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold mb-2">Public Bookings</h1>
              <p className="text-gray-600">View all driving lesson bookings (no login required)</p>
            </div>
            <button
              onClick={loadBookings}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium shadow hover:-translate-y-0.5 flex items-center gap-2"
            >
              🔄 Refresh
            </button>
          </div>
          
          <div className="mt-4 flex gap-4">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-4 py-2 rounded-lg ${activeTab === 'upcoming' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              Upcoming ({upcomingBookings.length})
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-lg ${activeTab === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              All ({bookings.length})
            </button>
          </div>
        </div>

        {/* Debug info */}
        <div className="mb-6 p-4 bg-gray-100 rounded-lg">
          <p className="text-sm text-gray-600">
            Showing {displayedBookings.length} of {bookings.length} total bookings
          </p>
          <p className="text-sm text-gray-600 mt-1">
            Statuses: {(() => {
              const counts = bookings.reduce((acc: Record<string, number>, b) => {
                acc[b.status] = (acc[b.status] || 0) + 1
                return acc
              }, {})
              return Object.entries(counts).map(([status, count]) => `${status}: ${count}`).join(', ')
            })()}
          </p>
        </div>

        {displayedBookings.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">
              {activeTab === 'upcoming' ? '📅' : '📋'}
            </div>
            <h3 className="text-xl font-semibold mb-2">
              No {activeTab === 'upcoming' ? 'Upcoming' : ''} Bookings
            </h3>
            <p className="text-gray-500">
              {activeTab === 'upcoming' 
                ? 'No upcoming bookings found. Bookings will appear here once created.'
                : 'No bookings found in the system.'}
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {displayedBookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-xl shadow-sm p-6 border">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {booking.studentName || 'Guest'} • {booking.date} at {booking.time.substring(0, 5)}
                    </h3>
                    <p className="text-gray-600">
                      {booking.lessonType === 'single' ? 'Single Lesson ($55)' : 'Casual Lesson ($45)'}
                    </p>
                    <p className="text-sm text-gray-500">
                      Email: {booking.email} • Phone: {booking.phone || 'Not provided'}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {booking.status.toUpperCase()}
                    </span>
                    <p className="text-sm text-gray-500 mt-1">
                      Created: {new Date(booking.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {/* Action buttons */}
                <div className="mt-4 pt-4 border-t flex gap-3">
                  <div className="text-sm text-gray-500">
                    Booking ID: {booking.id.substring(0, 8)}...
                  </div>
                  <div className="flex-1" />
                  {booking.status === 'pending' && (
                    <>
                      <button
                        onClick={() => updateStatus(booking.id, 'confirmed')}
                        disabled={updatingId === booking.id || updatingId === 'waiting'}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 text-sm font-medium"
                      >
                        {updatingId === booking.id ? 'Updating...' : 
                         updatingId === 'waiting' ? 'Waiting...' : '✓ Confirm'}
                      </button>
                      <button
                        onClick={() => updateStatus(booking.id, 'cancelled')}
                        disabled={updatingId === booking.id || updatingId === 'waiting'}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 text-sm font-medium"
                      >
                        {updatingId === booking.id ? 'Updating...' : 
                         updatingId === 'waiting' ? 'Waiting...' : '✗ Cancel'}
                      </button>
                    </>
                  )}
                  {booking.status === 'confirmed' && (
                    <button
                      onClick={() => updateStatus(booking.id, 'cancelled')}
                      disabled={updatingId === booking.id}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 text-sm font-medium"
                    >
                      {updatingId === booking.id ? 'Updating...' : '✗ Cancel'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}