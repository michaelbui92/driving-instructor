'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function TestSupabasePage() {
  const [connectionStatus, setConnectionStatus] = useState<'testing' | 'connected' | 'error'>('testing')
  const [errorMessage, setErrorMessage] = useState('')
  const [tables, setTables] = useState<string[]>([])
  const [testBooking, setTestBooking] = useState<any>(null)

  useEffect(() => {
    async function testConnection() {
      try {
        // Test 1: Check if we can connect to Supabase
        const { data, error } = await supabase.from('bookings').select('count', { count: 'exact', head: true })
        
        if (error) {
          // Table might not exist yet, but connection works
          if (error.message.includes('relation "bookings" does not exist')) {
            setConnectionStatus('connected')
            setTables([])
            setErrorMessage('Tables not created yet. Run the SQL from scripts/create-tables.sql in Supabase dashboard.')
          } else {
            setConnectionStatus('error')
            setErrorMessage(`Connection error: ${error.message}`)
          }
        } else {
          setConnectionStatus('connected')
          setTables(['bookings', 'availability_rules', 'instructor_profile'])
        }

        // Test 2: Try to create a test booking
        const testBookingData = {
          student_name: 'Test Student',
          email: 'test@example.com',
          phone: '0412345678',
          date: '2026-03-22',
          time: '10:00',
          lesson_type: 'single',
          status: 'pending'
        }

        const { data: bookingData, error: bookingError } = await supabase
          .from('bookings')
          .insert([testBookingData])
          .select()

        if (!bookingError && bookingData) {
          setTestBooking(bookingData[0])
          
          // Clean up test booking
          await supabase.from('bookings').delete().eq('id', bookingData[0].id)
        }

      } catch (err: any) {
        setConnectionStatus('error')
        setErrorMessage(`Unexpected error: ${err.message}`)
      }
    }

    testConnection()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Supabase Connection Test</h1>
        
        <div className="space-y-6">
          {/* Connection Status */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Connection Status</h2>
            <div className="flex items-center space-x-3">
              <div className={`w-4 h-4 rounded-full ${
                connectionStatus === 'testing' ? 'bg-yellow-500' :
                connectionStatus === 'connected' ? 'bg-green-500' :
                'bg-red-500'
              }`} />
              <span className="font-medium">
                {connectionStatus === 'testing' && 'Testing connection...'}
                {connectionStatus === 'connected' && 'Connected successfully!'}
                {connectionStatus === 'error' && 'Connection failed'}
              </span>
            </div>
            
            {errorMessage && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded">
                <p className="text-red-700">{errorMessage}</p>
              </div>
            )}
          </div>

          {/* Environment Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
            <div className="space-y-2">
              <div className="flex">
                <span className="font-medium w-48">SUPABASE_URL:</span>
                <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                  {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✓ Set' : '✗ Missing'}
                </code>
              </div>
              <div className="flex">
                <span className="font-medium w-48">SUPABASE_ANON_KEY:</span>
                <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                  {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✓ Set' : '✗ Missing'}
                </code>
              </div>
            </div>
          </div>

          {/* Tables Status */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Database Tables</h2>
            {tables.length > 0 ? (
              <ul className="space-y-2">
                {tables.map(table => (
                  <li key={table} className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {table}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
                <p className="text-yellow-800">
                  Tables not detected. Please run the SQL from <code>scripts/create-tables.sql</code> in your Supabase dashboard.
                </p>
              </div>
            )}
          </div>

          {/* Test Results */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Test Results</h2>
            {testBooking ? (
              <div className="bg-green-50 border border-green-200 rounded p-4">
                <p className="text-green-800 font-medium mb-2">✓ CRUD operations working!</p>
                <p className="text-green-700 text-sm">
                  Successfully created and deleted a test booking. Database operations are functional.
                </p>
              </div>
            ) : connectionStatus === 'connected' ? (
              <div className="bg-blue-50 border border-blue-200 rounded p-4">
                <p className="text-blue-800">
                  Connection established. Tables need to be created for full functionality.
                </p>
              </div>
            ) : null}
          </div>

          {/* Next Steps */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Next Steps</h2>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Go to <a href="https://cxmpdqsqbwmelywssuew.supabase.co" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Supabase Dashboard</a></li>
              <li>Navigate to SQL Editor</li>
              <li>Run the SQL from <code>scripts/create-tables.sql</code></li>
              <li>Refresh this page to verify tables are created</li>
              <li>Test API endpoints at <code>/api/bookings</code> and <code>/api/availability</code></li>
            </ol>
          </div>

          {/* API Test Links */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">API Test Links</h2>
            <div className="space-y-3">
              <a 
                href="/api/availability?date=2026-03-22" 
                target="_blank"
                className="inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded hover:bg-blue-200 transition"
              >
                Test Availability API
              </a>
              <button
                onClick={async () => {
                  const response = await fetch('/api/bookings', {
                    method: 'GET'
                  })
                  const data = await response.json()
                  alert(JSON.stringify(data, null, 2))
                }}
                className="block bg-green-100 text-green-800 px-4 py-2 rounded hover:bg-green-200 transition"
              >
                Test Bookings API (GET)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}