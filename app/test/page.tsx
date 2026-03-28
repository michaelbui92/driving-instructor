'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface TestEntry {
  id: string
  status: 'pending' | 'yes' | 'no'
  created_at: string
}

export default function TestPage() {
  const [entries, setEntries] = useState<TestEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const loadTestEntries = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('test')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error loading test entries:', error)
        return
      }

      console.log('📊 Test entries loaded:', data)
      setEntries(data || [])
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const createTestEntry = async () => {
    try {
      setCreating(true)
      const { data, error } = await supabase
        .from('test')
        .insert([{ status: 'pending' }])
        .select()
        .single()

      if (error) {
        console.error('Error creating test entry:', error)
        alert(`Error: ${error.message}`)
        return
      }

      console.log('✅ Test entry created:', data)
      await loadTestEntries()
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setCreating(false)
    }
  }

  const updateStatus = async (id: string, newStatus: 'yes' | 'no') => {
    try {
      setUpdatingId(id)
      
      // Optimistic update
      setEntries(prev => prev.map(entry =>
        entry.id === id ? { ...entry, status: newStatus } : entry
      ))

      const { data, error } = await supabase
        .from('test')
        .update({ status: newStatus })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('❌ Error updating status:', error)
        alert(`Error: ${error.message}`)
        // Rollback
        await loadTestEntries()
        return
      }

      console.log('✅ Status updated:', data)
      // Update with server response
      setEntries(prev => prev.map(entry =>
        entry.id === data.id ? data : entry
      ))
    } catch (err) {
      console.error('Error:', err)
      await loadTestEntries()
    } finally {
      setUpdatingId(null)
    }
  }

  const deleteEntry = async (id: string) => {
    if (!confirm('Delete this test entry?')) return
    
    const { error } = await supabase
      .from('test')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting:', error)
      alert(`Error: ${error.message}`)
      return
    }

    console.log('🗑️ Entry deleted')
    setEntries(prev => prev.filter(entry => entry.id !== id))
  }

  useEffect(() => {
    loadTestEntries()

    // Real-time subscription
    const channel = supabase
      .channel('test-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'test'
        },
        (payload: any) => {
          console.log('Real-time test change:', payload)
          if (payload.eventType === 'INSERT') {
            setEntries(prev => [payload.new, ...prev])
          } else if (payload.eventType === 'UPDATE') {
            setEntries(prev => prev.map(entry =>
              entry.id === payload.new.id ? payload.new : entry
            ))
          } else if (payload.eventType === 'DELETE') {
            setEntries(prev => prev.filter(entry => entry.id !== payload.old.id))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Supabase Connection Test</h1>
        <p className="text-gray-600 mb-6">
          This page tests if Supabase writes and reads are working correctly.
          Create a test entry, change its status, and see if it persists.
        </p>

        <div className="mb-8 p-4 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Instructions</h2>
          <ol className="list-decimal pl-5 space-y-2 text-gray-700">
            <li>Create the <code className="bg-gray-100 px-1 rounded">test</code> table in Supabase with columns: <code className="bg-gray-100 px-1 rounded">id (uuid)</code>, <code className="bg-gray-100 px-1 rounded">status (text)</code>, <code className="bg-gray-100 px-1 rounded">created_at (timestamp)</code></li>
            <li>Disable RLS on the table or add a simple policy</li>
            <li>Click "Create Test Entry" below</li>
            <li>Try changing status to "yes" or "no"</li>
            <li>Refresh the page to see if changes persist</li>
            <li>Check browser console for detailed logs</li>
          </ol>
        </div>

        <div className="flex gap-4 mb-8">
          <button
            onClick={createTestEntry}
            disabled={creating}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {creating ? 'Creating...' : 'Create Test Entry'}
          </button>
          <button
            onClick={loadTestEntries}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Refresh List
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Loading test entries...</p>
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-lg shadow">
            <p className="text-gray-500">No test entries yet. Create one above.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {entries.map((entry) => (
              <div key={entry.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">
                      Entry ID: {entry.id.substring(0, 8)}...
                    </h3>
                    <p className="text-sm text-gray-500">
                      Created: {new Date(entry.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      entry.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      entry.status === 'yes' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      Status: {entry.status.toUpperCase()}
                    </span>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t flex gap-3">
                  <button
                    onClick={() => updateStatus(entry.id, 'yes')}
                    disabled={updatingId === entry.id}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    {updatingId === entry.id ? 'Updating...' : 'Set to YES'}
                  </button>
                  <button
                    onClick={() => updateStatus(entry.id, 'no')}
                    disabled={updatingId === entry.id}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                  >
                    {updatingId === entry.id ? 'Updating...' : 'Set to NO'}
                  </button>
                  <div className="flex-1" />
                  <button
                    onClick={() => deleteEntry(entry.id)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-2">Debug Info</h3>
          <p className="text-sm text-gray-600">
            Open browser console (F12) to see detailed logs of each operation.
            Check if updates persist after page refresh.
          </p>
          <div className="mt-2 text-sm">
            <p>Entries loaded: {entries.length}</p>
            <p>Status breakdown: {
              Object.entries(
                entries.reduce((acc, entry) => {
                  acc[entry.status] = (acc[entry.status] || 0) + 1
                  return acc
                }, {} as Record<string, number>)
              ).map(([status, count]) => `${status}: ${count}`).join(', ')
            }</p>
          </div>
        </div>
      </div>
    </div>
  )
}
