'use client'

import { useState } from 'react'
import { EXPERIENCE_LEVELS } from '@/lib/skills'
import { supabase } from '@/lib/supabase'
import { toast } from '@/components/Toast'

interface SkillOnboardingProps {
  studentId: string
  email: string
  onComplete: () => void
  onSkip: () => void
}

export default function SkillOnboarding({ studentId, email, onComplete, onSkip }: SkillOnboardingProps) {
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [step, setStep] = useState<'intro' | 'selection'>('intro')

  const handleSave = async () => {
    console.log('=== SkillOnboarding handleSave called ===')
    console.log('studentId:', studentId)
    console.log('selectedLevel:', selectedLevel)
    
    if (!selectedLevel) {
      toast('error', 'Please select your experience level')
      return
    }

    if (!studentId) {
      toast('error', 'Student ID not found. Please refresh the page.')
      return
    }

    setSaving(true)
    try {
      const selected = EXPERIENCE_LEVELS.find(l => l.key === selectedLevel)
      console.log('Selected experience level:', selected?.name)
      
      // Map level key to numeric value
      const levelValue = selectedLevel === 'complete_beginner' ? 1 : 
                        selectedLevel === 'overseas_driver' ? 2 : 
                        selectedLevel === 'learner' ? 3 : 
                        selectedLevel === 'refresher' ? 4 : 5
      
      console.log('Level numeric value:', levelValue)

      // 1. Store experience level in students table
      console.log('Updating students table...')
      const { data: studentData, error: studentError } = await supabase
        .from('students')
        .update({ 
          onboarding_completed: true,
          experience_level: selectedLevel
        })
        .eq('id', studentId)
        .select()
        .single()

      console.log('Student update result:', { data: studentData, error: studentError })
      
      if (studentError) {
        console.error('Student update error:', studentError)
        throw studentError
      }

      // 2. Store experience level as a skill record
      console.log('Inserting into student_skills table...')
      const { data: skillData, error: skillError } = await supabase
        .from('student_skills')
        .insert({
          student_id: studentId,
          skill_key: 'experience_level',
          skill_name: 'Experience Level',
          self_assessment: levelValue,
          instructor_rating: 0,
          notes: `${selected?.name}: ${selected?.description}` || selectedLevel
        })
        .select()
        .single()

      console.log('Skill insert result:', { data: skillData, error: skillError })
      
      if (skillError) {
        console.error('Skill insert error:', skillError)
        throw skillError
      }

      console.log('=== Save successful, calling onComplete ===')
      toast('success', 'Experience level saved! Your instructor will use this to plan your lessons.')
      
      // Small delay to show success message
      setTimeout(() => {
        onComplete()
      }, 500)
      
    } catch (err: any) {
      console.error('=== Save error ===')
      console.error('Error:', err)
      console.error('Error message:', err?.message)
      console.error('Error details:', err?.details)
      console.error('Error hint:', err?.hint)
      toast('error', `Failed to save: ${err?.message || 'Unknown error'}`)
    } finally {
      setSaving(false)
    }
  }

  const handleSkip = async () => {
    console.log('=== SkillOnboarding handleSkip called ===')
    console.log('studentId:', studentId)
    
    if (!studentId) {
      onSkip()
      return
    }

    try {
      const { error } = await supabase
        .from('students')
        .update({ onboarding_skipped: true })
        .eq('id', studentId)

      if (error) {
        console.error('Skip update error:', error)
      }
    } catch (err) {
      console.error('Skip error:', err)
    }
    
    onSkip()
  }

  if (step === 'intro') {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl max-w-lg w-full p-8 max-h-[90vh] overflow-y-auto">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">🚗</div>
            <h2 className="text-2xl font-bold mb-2">Tell Us About Your Driving Experience</h2>
            <p className="text-gray-600">
              This helps your instructor understand your starting point and plan lessons that match your needs.
            </p>
          </div>

          <div className="bg-blue-50 rounded-xl p-4 mb-6">
            <p className="text-blue-800 text-sm">
              <strong>Why this matters:</strong>
            </p>
            <ul className="text-blue-700 text-sm mt-2 space-y-1">
              <li>• Helps tailor lessons to your exact needs</li>
              <li>• Saves time by focusing on what you need most</li>
              <li>• Makes your first lesson more effective</li>
              <li>• Your instructor can prepare better</li>
            </ul>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSkip}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition"
            >
              Skip for Now
            </button>
            <button
              onClick={() => setStep('selection')}
              className="flex-1 px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-secondary transition"
            >
              Select Experience Level
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold mb-2">What best describes your driving experience?</h2>
          <p className="text-gray-500 text-sm">Select one option</p>
        </div>

        {/* Experience Levels */}
        <div className="space-y-3 mb-6">
          {EXPERIENCE_LEVELS.map(level => (
            <button
              key={level.key}
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
                  {selectedLevel === level.key && (
                    <div className="mt-2 p-2 bg-blue-100 rounded-lg">
                      <div className="text-blue-800 text-xs font-medium">Instructor will focus on:</div>
                      <div className="text-blue-700 text-xs mt-1">{level.instructor_notes}</div>
                    </div>
                  )}
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

        {/* Navigation */}
        <div className="flex gap-3">
          <button
            onClick={() => setStep('intro')}
            className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition"
          >
            ← Back
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !selectedLevel}
            className="flex-1 px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-secondary transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Complete'}
          </button>
        </div>
      </div>
    </div>
  )
}
