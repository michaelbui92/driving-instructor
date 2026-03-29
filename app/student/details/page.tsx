'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'

type StudentDetails = {
  id?: string
  email: string
  fullName: string
  phone: string
  address: string
  hasCompletedDetails: boolean
}

export default function StudentDetailsPage() {
  const [details, setDetails] = useState<StudentDetails>({
    email: '',
    fullName: '',
    phone: '',
    address: '',
    hasCompletedDetails: false,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  useEffect(() => {
    loadDetails()
  }, [])

  const loadDetails = async () => {
    try {
      const res = await fetch('/api/student/details')
      const data = await res.json()

      if (!res.ok) {
        if (res.status === 401) {
          router.push('/student/login')
          return
        }
        throw new Error(data.error || 'Failed to load details')
      }

      setDetails(data)
    } catch (err: any) {
      setError(err.message)
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
      const res = await fetch('/api/student/details', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: details.fullName,
          phone: details.phone,
          address: details.address,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to save details')
      }

      setSuccess(true)
      setDetails(prev => ({ ...prev, hasCompletedDetails: true }))
      
      // Redirect to dashboard after short delay
      setTimeout(() => {
        router.push('/student/dashboard')
      }, 1500)
    } catch (err: any) {
      setError(err.message)
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
            {details.hasCompletedDetails 
              ? 'Update your contact information below'
              : 'Please fill in your details to continue booking'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
            Details saved! Redirecting to dashboard...
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email (read-only) */}
            <div className="floating-label-group">
              <input
                type="email"
                name="email"
                id="email"
                value={details.email}
                className="floating-label-input bg-gray-100 cursor-not-allowed"
                readOnly
              />
              <label htmlFor="email" className="floating-label">Email Address (logged in)</label>
            </div>

            {/* Full Name */}
            <div className="floating-label-group">
              <input
                type="text"
                name="fullName"
                id="fullName"
                value={details.fullName}
                onChange={handleChange}
                className="floating-label-input"
                placeholder="Full Name"
                required
              />
              <label htmlFor="fullName" className="floating-label">Full Name *</label>
            </div>

            {/* Phone */}
            <div className="floating-label-group">
              <input
                type="tel"
                name="phone"
                id="phone"
                value={details.phone}
                onChange={handleChange}
                className="floating-label-input"
                placeholder="Phone Number"
                required
              />
              <label htmlFor="phone" className="floating-label">Phone Number *</label>
            </div>

            {/* Address */}
            <div className="floating-label-group">
              <textarea
                name="address"
                id="address"
                rows={3}
                value={details.address}
                onChange={handleChange}
                className="floating-label-input resize-none"
                placeholder="Pickup/Drop-off Address"
                required
              />
              <label htmlFor="address" className="floating-label">Pickup/Drop-off Address *</label>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={saving}
                className="w-full shimmer-btn px-6 py-3 bg-primary text-white rounded-lg hover:bg-secondary transition font-semibold disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Details'}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <Link
              href="/student/dashboard"
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              Skip for now
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
