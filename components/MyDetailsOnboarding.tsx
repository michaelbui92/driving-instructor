'use client'

import { useState } from 'react'
import { EXPERIENCE_LEVELS } from '@/lib/skills'
import { supabase } from '@/lib/supabase'
import { toast } from '@/components/Toast'

interface MyDetailsOnboardingProps {
  studentId: string
  email: string
  onComplete: () => void
}

export default function MyDetailsOnboarding({ studentId, email, onComplete }: MyDetailsOnboardingProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: ''
  })
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null)
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
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSave = async () => {
    console.log('=== MyDetailsOnboarding handleSave called ===')
    
    // Validate required details first
    if (!validateForm()) {
      toast('error', 'Please fill in all required fields')
      return
    }

    setSaving(true)
    try {
      // 1. Map experience level to numeric value
      const levelValue = selectedLevel === 'complete_beginner' ? 1 : 
                        selectedLevel === 'overseas_driver' ? 2 : 
                        selectedLevel === 'learner' ? 3 : 
                        selectedLevel === 'refresher' ? 4 : 
                        selectedLevel ? 5 : 0

      const selected = EXPERIENCE_LEVELS.find(l => l.key === selectedLevel)

      // 2. Update student record with details AND experience level
      const updateData: any = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        details_completed: true,
        onboarding_completed: !!selectedLevel, // Only true if they selected a level
        onboarding_skipped: !selectedLevel, // True if they didn't select
      }

      if (selectedLevel) {
        updateData.experience_level = selectedLevel
      }

      console.log('Updating student with:', updateData)

      const { data: studentData, error: studentError } = await supabase
        .from('students')
        .update(updateData)
        .eq('id', studentId)
        .select()
        .single()

      console.log('Student update result:', { data: studentData, error: studentError })

      if (studentError) throw studentError

      // 3. If experience level selected, create skill record
      if (selectedLevel) {
        const { error: skillError } = await supabase
          .from('student_skills')
          .insert({
            student_id: studentId,
            skill_key: 'experience_level',
            skill_name: 'Experience Level',
            self_assessment: levelValue,
            instructor_rating: 0,
            notes: `${selected?.name}: ${selected?.description}` || selectedLevel
          })

        if (skillError) {
          console.error('Skill insert error:', skillError)
          // Don't throw - details were saved successfully
        }
      }

      console.log('=== Save successful, calling onComplete ===')
      toast('success', 'Welcome to Drive with Bui! Your profile is set up.')
      
      setTimeout(() => {
        onComplete()
      }, 500)
      
    } catch (err: any) {
      console.error('=== Save error ===')
      console.error('Error:', err)
      toast('error', `Failed to save: ${err?.message || 'Unknown error'}`)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-lg w-full p-8 max-h-[90vh] overflow-y-auto">
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">👋</div>
          <h2 className="text-2xl font-bold mb-2">Welcome to Drive with Bui!</h2>
          <p className="text-gray-600">
            Let's get you set up. Please fill in your details below.
          </p>
        </div>

        {/* Personal Details Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-primary text-white text-sm flex items-center justify-center">1</span>
            Your Details
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name * <span className="text-red-500">required</span>
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
                Phone Number * <span className="text-red-500">required</span>
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
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address * <span className="text-red-500">required</span>
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="123 Main St, Lidcombe NSW 2141"
                rows={2}
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
          </div>
        </div>

        {/* Self Assessment Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-primary text-white text-sm flex items-center justify-center">2</span>
            Driving Experience <span className="text-gray-500 text-sm font-normal">(optional but recommended)</span>
          </h3>

          <p className="text-gray-600 text-sm mb-4">
            This helps your instructor understand your starting point and plan lessons that match your needs.
          </p>

          <div className="space-y-3">
            {EXPERIENCE_LEVELS.map(level => (
              <button
                key={level.key}
                type="button"
                onClick={() => setSelectedLevel(level.key)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                  selectedLevel === level.key
                    ? 'border-primary bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl">{level.icon}</div>
                  <div className="flex-1">
                    <div className="font-semibold">{level.name}</div>
                    <div className="text-gray-600 text-sm mt-1">{level.description}</div>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedLevel === level.key
                      ? 'border-primary bg-primary'
                      : 'border-gray-300'
                  }`}>
                    {selectedLevel === level.key && (
                      <div className="w-3 h-3 rounded-full bg-white" />
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-secondary transition disabled:opacity-50"
        >
          {saving ? 'Setting up your profile...' : 'Set Up My Profile'}
        </button>

        <p className="text-center text-sm text-gray-500 mt-4">
          You can update your details anytime from your dashboard.
        </p>
      </div>
    </div>
  )
}
