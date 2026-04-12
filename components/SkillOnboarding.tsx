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
  const [step, setStep] = useState<'intro' | 'selection' | 'done'>('intro')

  const handleSave = async () => {
    if (!selectedLevel) {
      toast('error', 'Please select your experience level')
      return
    }

    setSaving(true)
    try {
      const selected = EXPERIENCE_LEVELS.find(l => l.key === selectedLevel)
      
      // 1. Store experience level in students table
      const { error: studentError } = await supabase
        .from('students')
        .update({ 
          onboarding_completed: true,
          experience_level: selectedLevel
        })
        .eq('id', studentId)

      if (studentError) throw studentError

      // 2. Store experience level as a special skill record
      const { error: skillError } = await supabase
        .from('student_skills')
        .upsert({
          student_id: studentId,
          skill_key: 'experience_level',
          skill_name: 'Experience Level',
          self_assessment: selectedLevel === 'complete_beginner' ? 1 : 
                          selectedLevel === 'overseas_driver' ? 2 : 
                          selectedLevel === 'learner' ? 3 : 
                          selectedLevel === 'refresher' ? 4 : 5,
          instructor_rating: 0,
          notes: selected ? `${selected.name}: ${selected.description}` : selectedLevel
        })

      if (skillError) throw skillError

      toast('success', 'Experience level saved! Your instructor will use this to plan your lessons.')
      onComplete()
    } catch (err) {
      console.error('Error saving experience level:', err)
      toast('error', 'Failed to save. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleSkip = async () => {
    try {
      await supabase
        .from('students')
        .update({ onboarding_skipped: true })
        .eq('id', studentId)
      onSkip()
    } catch (err) {
      console.error('Error skipping onboarding:', err)
      onSkip()
    }
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
            onClick={step === 'selection' ? () => setStep('intro') : handleSkip}
            className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition"
          >
            {step === 'selection' ? '← Back' : 'Skip'}
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
