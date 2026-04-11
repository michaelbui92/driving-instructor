'use client'

import { useState } from 'react'
import { DRIVING_SKILLS, SKILL_CATEGORIES } from '@/lib/skills'
import { supabase } from '@/lib/supabase'
import { toast } from '@/components/Toast'

interface SkillOnboardingProps {
  studentId: string
  email: string
  onComplete: () => void
  onSkip: () => void
}

export default function SkillOnboarding({ studentId, email, onComplete, onSkip }: SkillOnboardingProps) {
  const [currentCategory, setCurrentCategory] = useState(0)
  const [ratings, setRatings] = useState<Record<string, number>>({})
  const [saving, setSaving] = useState(false)
  const [step, setStep] = useState<'intro' | 'assessment' | 'done'>('intro')

  const categories = SKILL_CATEGORIES.filter(cat => 
    DRIVING_SKILLS.some(s => s.category === cat.key)
  )

  const currentCategoryData = categories[currentCategory]
  const currentSkills = DRIVING_SKILLS.filter(s => s.category === currentCategoryData?.key)
  const isLastCategory = currentCategory === categories.length - 1

  const handleRatingChange = (skillKey: string, rating: number) => {
    setRatings(prev => ({ ...prev, [skillKey]: rating }))
  }

  const handleNext = () => {
    if (currentCategory < categories.length - 1) {
      setCurrentCategory(prev => prev + 1)
    } else {
      handleSave()
    }
  }

  const handleBack = () => {
    if (currentCategory > 0) {
      setCurrentCategory(prev => prev - 1)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      // Insert skill ratings
      const skillInserts = DRIVING_SKILLS.map(skill => ({
        student_id: studentId,
        skill_key: skill.key,
        skill_name: skill.name,
        self_assessment: ratings[skill.key] || 0,
        instructor_rating: 0
      }))

      const { error } = await supabase
        .from('student_skills')
        .upsert(skillInserts, { onConflict: 'student_id,skill_key' })

      if (error) throw error

      // Mark onboarding complete
      await supabase
        .from('students')
        .update({ onboarding_completed: true })
        .eq('id', studentId)

      setStep('done')
      toast('success', 'Skills saved! You can update these anytime.')
      onComplete()
    } catch (err) {
      console.error('Error saving skills:', err)
      toast('error', 'Failed to save skills. Please try again.')
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
            <div className="text-6xl mb-4">📋</div>
            <h2 className="text-2xl font-bold mb-2">Tell Us About Your Driving</h2>
            <p className="text-gray-600">
              Help us understand your current skill level so we can tailor lessons to your needs. 
              This takes about 2 minutes.
            </p>
          </div>

          <div className="bg-blue-50 rounded-xl p-4 mb-6">
            <p className="text-blue-800 text-sm">
              <strong>How it works:</strong>
            </p>
            <ul className="text-blue-700 text-sm mt-2 space-y-1">
              <li>• Rate your skills from 1-5</li>
              <li>• Be honest — this is just for your instructor</li>
              <li>• You can update these anytime</li>
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
              onClick={() => setStep('assessment')}
              className="flex-1 px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-secondary transition"
            >
              Start Assessment
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>Step {currentCategory + 1} of {categories.length}</span>
            <span>{currentCategoryData?.name}</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full">
            <div 
              className="h-2 bg-primary rounded-full transition-all"
              style={{ width: `${((currentCategory + 1) / categories.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Category Header */}
        <div className="text-center mb-6">
          <span className="text-4xl">{currentCategoryData?.icon}</span>
          <h2 className="text-xl font-bold mt-2">{currentCategoryData?.name}</h2>
          <p className="text-gray-500 text-sm">Rate your skill level (1 = low, 5 = high)</p>
        </div>

        {/* Skills */}
        <div className="space-y-4 mb-6">
          {currentSkills.map(skill => (
            <div key={skill.key} className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-semibold">{skill.icon} {skill.name}</p>
                  <p className="text-gray-500 text-sm">{skill.description}</p>
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(level => (
                    <button
                      key={level}
                      onClick={() => handleRatingChange(skill.key, level)}
                      className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                        ratings[skill.key] === level
                          ? 'bg-primary text-white scale-110'
                          : ratings[skill.key] && ratings[skill.key] > level
                          ? 'bg-primary/30 text-primary'
                          : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
              {ratings[skill.key] && (
                <p className="text-sm text-primary font-medium">
                  Self-assessment: {ratings[skill.key]}/5
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex gap-3">
          <button
            onClick={currentCategory > 0 ? handleBack : handleSkip}
            className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition"
          >
            {currentCategory > 0 ? '← Back' : 'Skip'}
          </button>
          <button
            onClick={handleNext}
            disabled={saving}
            className="flex-1 px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-secondary transition disabled:opacity-50"
          >
            {saving ? 'Saving...' : isLastCategory ? 'Complete' : 'Next →'}
          </button>
        </div>
      </div>
    </div>
  )
}
