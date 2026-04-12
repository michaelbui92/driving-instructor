'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { supabase } from '@/lib/supabase'

type StudentDetails = {
  id?: string
  email: string
  name: string
  phone: string
  address: string
  detailsCompleted: boolean
}

export default function StudentDetailsPage() {
  const [details, setDetails] = useState<StudentDetails>({
    email: '',
    name: '',
    phone: '',
    address: '',
    detailsCompleted: false,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const router = useRouter()

  useEffect(() => {
    loadDetails()
  }, [])

  const loadDetails = async () => {
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
      
      if (!email) {
        // Not logged in, redirect to login
        router.push('/student/login')
        return
      }
      
      setDetails(prev => ({ ...prev, email }))
      
      // Query students table for this email
      const { data: student, error: fetchError } = await supabase
        .from('students')
        .select('id, name, phone, address, details_completed')
        .eq('email', email)
        .single()
      
      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error loading student details:', fetchError)
        throw fetchError
      }
      
      if (student) {
        setDetails(prev => ({
          ...prev,
          id: student.id,
          name: student.name || '',
          phone: student.phone || '',
          address: student.address || '',
          detailsCompleted: student.details_completed || false,
        }))
      }
    } catch (err: any) {
      console.error('Details load error:', err)
      setError(err.message || 'Failed to load details')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setDetails(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setSaving(true)

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
      
      if (!email) {
        throw new Error('Not logged in')
      }
      
      // Check if student record exists
      const { data: existing } = await supabase
        .from('students')
        .select('id')
        .eq('email', email)
        .single()
      
      if (existing) {
        // Update existing record
        const { error: updateError } = await supabase
          .from('students')
          .update({
            name: details.name,
            phone: details.phone,
            address: details.address,
            details_completed: true,
          })
          .eq('email', email)
        
        if (updateError) throw updateError
      } else {
        // Create new record
        const { error: insertError } = await supabase
          .from('students')
          .insert({
            email: email,
            name: details.name,
            phone: details.phone,
            address: details.address,
            details_completed: true,
          })
        
        if (insertError) throw insertError
      }

      setSuccess(true)
      setDetails(prev => ({ ...prev, detailsCompleted: true }))
      setIsEditing(false)
      
      // Show success then reload page
      setTimeout(() => {
        loadDetails()
      }, 1500)
    } catch (err: any) {
      console.error('Save error:', err)
      setError(err.message || 'Failed to save details')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navbar showLocation={false} />
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar showLocation={false} />

      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">My Details</h1>
          <p className="text-gray-600">
            {details.detailsCompleted 
              ? 'Update your contact information below'
              : 'Please fill in your details to continue'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
            Details saved successfully!
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email (read-only) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                value={details.email}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-100 cursor-not-allowed"
                readOnly
              />
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <input
                type="text"
                name="name"
                value={details.name}
                onChange={handleChange}
                className={`w-full px-4 py-3 border border-gray-300 rounded-xl ${isEditing || !details.detailsCompleted ? 'focus:ring-2 focus:ring-primary focus:border-transparent' : 'bg-gray-100 cursor-not-allowed'}`}
                placeholder="Your full name"
                required
                readOnly={details.detailsCompleted && !isEditing}
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
              <input
                type="tel"
                name="phone"
                value={details.phone}
                onChange={handleChange}
                className={`w-full px-4 py-3 border border-gray-300 rounded-xl ${isEditing || !details.detailsCompleted ? 'focus:ring-2 focus:ring-primary focus:border-transparent' : 'bg-gray-100 cursor-not-allowed'}`}
                placeholder="0412 345 678"
                required
                readOnly={details.detailsCompleted && !isEditing}
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pickup/Drop-off Address *</label>
              <textarea
                name="address"
                rows={3}
                value={details.address}
                onChange={handleChange}
                className={`w-full px-4 py-3 border border-gray-300 rounded-xl resize-none ${isEditing || !details.detailsCompleted ? 'focus:ring-2 focus:ring-primary focus:border-transparent' : 'bg-gray-100 cursor-not-allowed'}`}
                placeholder="Your address for pickup and drop-off"
                required
                readOnly={details.detailsCompleted && !isEditing}
              />
            </div>

            <div className="pt-4">
              {details.detailsCompleted && !isEditing ? (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="w-full px-6 py-3 bg-primary text-white rounded-xl hover:bg-secondary transition font-semibold"
                >
                  Edit Details
                </button>
              ) : (
                <div className="space-y-3">
                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full px-6 py-3 bg-primary text-white rounded-xl hover:bg-secondary transition font-semibold disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save Details'}
                  </button>
                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false)
                        loadDetails() // Reload to get original values
                      }}
                      className="w-full px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition font-semibold"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              )}
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <Link
              href="/student/dashboard"
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
