'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { toast } from '@/components/Toast'

interface StudentDetailsOnboardingProps {
  studentId: string
  email: string
  onComplete: () => void
}

export default function StudentDetailsOnboarding({ studentId, email, onComplete }: StudentDetailsOnboardingProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: ''
  })
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (!/^[\d\s+\-()]+$/.test(formData.phone)) {
      newErrors.phone = 'Enter a valid phone number'
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast('error', 'Please fix the errors in the form')
      return
    }

    setSaving(true)
    try {
      // Update student record with details
      const { error } = await supabase
        .from('students')
        .update({
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          address: formData.address.trim(),
          details_completed: true
        })
        .eq('id', studentId)

      if (error) throw error

      toast('success', 'Details saved! Welcome to Drive with Bui.')
      onComplete()
    } catch (err) {
      console.error('Error saving student details:', err)
      toast('error', 'Failed to save details. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 max-h-[90vh] overflow-y-auto">
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">👋</div>
          <h2 className="text-2xl font-bold mb-2">Welcome to Drive with Bui!</h2>
          <p className="text-gray-600">
            Let's get you set up. We need a few details to create your student profile.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Smith"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                errors.name ? 'border-red-300' : 'border-gray-300'
              }`}
              autoFocus
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number *
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="0412 345 678"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                errors.phone ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              We'll use this for booking confirmations and reminders
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address *
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="123 Main St, Lidcombe NSW 2141"
              rows={3}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                errors.address ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.address && (
              <p className="mt-1 text-sm text-red-600">{errors.address}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              We need this for picking you up for lessons
            </p>
          </div>

          <div className="bg-blue-50 rounded-xl p-4 mt-6">
            <p className="text-blue-800 text-sm">
              <strong>Why we need these details:</strong>
            </p>
            <ul className="text-blue-700 text-sm mt-2 space-y-1">
              <li>• Required for all driving lesson bookings</li>
              <li>• Pick-up address for your lessons</li>
              <li>• Contact for booking confirmations</li>
              <li>• Emergency contact information</li>
            </ul>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full mt-6 px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-secondary transition disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Details & Continue'}
          </button>
        </form>
      </div>
    </div>
  )
}
