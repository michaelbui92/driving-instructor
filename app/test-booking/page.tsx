'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

export default function TestBookingPage() {
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [supabaseStatus, setSupabaseStatus] = useState<string>('checking...')

  // Create Supabase client directly (not through db-client)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  const supabase = supabaseUrl && supabaseKey 
    ? createClient(supabaseUrl, supabaseKey)
    : null

  useEffect(() => {
    checkSupabase()
    loadBookings()
  }, [])

  const checkSupabase = async () => {
    if (!supabase) {
      setSupabaseStatus('Missing Supabase credentials')
      return
    }
    
    try {
      const { data, error } = await supabase
        .from('bookings_new')
        .select('count', { count: 'exact', head: true })
      
      if (error) {
        setSupabaseStatus(`Error: ${error.message}`)
      } else {
        setSupabaseStatus(`Connected ✓ (${data?.count || 0} bookings)`)
      }
    } catch (err: any) {
      setSupabaseStatus(`Failed: ${err.message}`)
    }
  }

  const loadBookings = async () => {
    if (!supabase) {
      console.error('No Supabase client')
      return
    }
    
    setLoading(true)
    const { data, error } = await supabase
      .from('bookings_new')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10)
    
    if (error) {
      console.error('Error loading bookings:', error)
    } else {
      setBookings(data || [])
    }
    setLoading(false)
  }

  const createTestBooking = async () => {
    if (!supabase) {
      alert('No Supabase client')
      return
    }
    
    const testBooking = {
      student_name: 'Test Student',
      email: 'test@example.com',
      phone: '0412345678',
      date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
      time: '14:00:00',
      lesson_type: 'single',
      status: 'pending'
    }

    const { data, error } = await supabase
      .from('bookings_new')
      .insert([testBooking])
      .select()

    if (error) {
      alert(`Error: ${error.message}`)
    } else {
      alert('Test booking created!')
      loadBookings()
    }
  }

  const deleteAllTestBookings = async () => {
    if (!supabase) {
      alert('No Supabase client')
      return
    }
    
    if (!confirm('Delete ALL test bookings?')) return

    const { error } = await supabase
      .from('bookings_new')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all

    if (error) {
      alert(`Error: ${error.message}`)
    } else {
      alert('All test bookings deleted!')
      loadBookings()
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Test Booking Page</h1>
      
      <div className="mb-8 p-4 bg-gray-50 rounded">
        <h2 className="text-xl font-semibold mb-2">Supabase Status</h2>
        <p className="font-mono">{supabaseStatus}</p>
        <div className="mt-4 flex gap-4">
          <button
            onClick={checkSupabase}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Re-check Connection
          </button>
          <button
            onClick={createTestBooking}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Create Test Booking
          </button>
          <button
            onClick={deleteAllTestBookings}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Delete All Test Bookings
          </button>
          <button
            onClick={loadBookings}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Refresh List
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">
          Bookings ({bookings.length})
          {loading && <span className="ml-2 text-sm text-gray-500">Loading...</span>}
        </h2>
        
        {bookings.length === 0 ? (
          <p className="text-gray-500">No bookings found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium">ID</th>
                  <th className="px-4 py-2 text-left text-sm font-medium">Student</th>
                  <th className="px-4 py-2 text-left text-sm font-medium">Date/Time</th>
                  <th className="px-4 py-2 text-left text-sm font-medium">Type</th>
                  <th className="px-4 py-2 text-left text-sm font-medium">Status</th>
                  <th className="px-4 py-2 text-left text-sm font-medium">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td className="px-4 py-2 text-sm font-mono">
                      {booking.id.substring(0, 8)}...
                    </td>
                    <td className="px-4 py-2">
                      <div className="font-medium">{booking.student_name || 'Guest'}</div>
                      <div className="text-sm text-gray-600">{booking.email}</div>
                    </td>
                    <td className="px-4 py-2">
                      {booking.date} {booking.time?.substring(0, 5)}
                    </td>
                    <td className="px-4 py-2">
                      {booking.lesson_type === 'single' ? 'Single' : 'Casual'}
                    </td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-sm">
                      {new Date(booking.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded">
        <h3 className="font-medium mb-2">Purpose</h3>
        <p className="text-sm">
          This is a simple test page to verify Supabase connectivity and basic CRUD operations.
          It uses direct Supabase client queries (not API routes) to test the database connection.
        </p>
        <p className="text-sm mt-2">
          If this page works but the instructor portal doesn't, the issue is in the API routes or frontend logic.
          If this page also doesn't work, the issue is with Supabase connectivity or database configuration.
        </p>
      </div>
    </div>
  )
}
