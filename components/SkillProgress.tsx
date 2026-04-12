'use client'

import { useState, useEffect } from 'react'
import { EXPERIENCE_LEVELS, DRIVING_SKILLS, SKILL_CATEGORIES } from '@/lib/skills'
import { supabase } from '@/lib/supabase'
import { toast } from '@/components/Toast'

interface SkillData {
  skill_key: string
  skill_name: string
  self_assessment: number
  instructor_rating: number
  notes: string
}

interface SkillProgressProps {
  studentId: string
  readOnly?: boolean
}

export default function SkillProgress({ studentId, readOnly = false }: SkillProgressProps) {
  const [skills, setSkills] = useState<SkillData[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<string | null>(null)
  const [editValue, setEditValue] = useState(0)
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)

  useEffect(() => {
    loadSkills()
  }, [studentId])

  const loadSkills = async () => {
    try {
      const { data, error } = await supabase
        .from('student_skills')
        .select('*')
        .eq('student_id', studentId)
        .order('skill_key')

      if (error) throw error
      setSkills(data || [])
    } catch (err) {
      console.error('Error loading skills:', err)
    } finally {
      setLoading(false)
    }
  }

  const getSkillValue = (skillKey: string, type: 'self' | 'instructor' | 'best') => {
    const skill = skills.find(s => s.skill_key === skillKey)
    if (!skill) return 0
    if (type === 'best') {
      return Math.max(skill.self_assessment, skill.instructor_rating)
    }
    return type === 'self' ? skill.self_assessment : skill.instructor_rating
  }

  const handleSaveEdit = async (skillKey: string) => {
    try {
      const { error } = await supabase
        .from('student_skills')
        .update({ instructor_rating: editValue })
        .eq('student_id', studentId)
        .eq('skill_key', skillKey)

      if (error) throw error

      toast('success', 'Skill updated!')
      setEditing(null)
      loadSkills()
    } catch (err) {
      console.error('Error updating skill:', err)
      toast('error', 'Failed to update skill')
    }
  }

  if (loading) {
    return (
      <div className="animate-pulse flex gap-4">
        <div className="h-24 flex-1 bg-gray-200 rounded-xl" />
        <div className="h-24 flex-1 bg-gray-200 rounded-xl" />
      </div>
    )
  }

  if (skills.length === 0) {
    return (
      <div className="text-center py-6 bg-gray-50 rounded-xl">
        <p className="text-gray-500 text-sm">No skill assessments yet.</p>
      </div>
    )
  }

  // Get experience level from student skills
  const experienceSkill = skills.find(s => s.skill_key === 'experience_level')
  const expLevel = experienceSkill ? EXPERIENCE_LEVELS.find(l => {
    // Map numeric value back to key
    const levelMap: Record<number, string> = {
      1: 'complete_beginner',
      2: 'overseas_driver',
      3: 'learner',
      4: 'refresher',
      5: 'advanced'
    }
    return l.key === levelMap[experienceSkill.self_assessment]
  }) : null

  // Calculate overall progress
  const ratedSkills = skills.filter(s => s.skill_key !== 'experience_level' && s.instructor_rating > 0)
  const overallRating = ratedSkills.length > 0 
    ? (ratedSkills.reduce((acc, s) => acc + s.instructor_rating, 0) / ratedSkills.length).toFixed(1)
    : null

  return (
    <div className="space-y-4">
      {/* Compact Summary for Students */}
      {readOnly ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Experience Level Card */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{expLevel?.icon || '🚗'}</span>
              <span className="text-sm font-medium text-blue-700">Experience</span>
            </div>
            <p className="font-semibold text-blue-900">{expLevel?.name || 'Not set'}</p>
            <p className="text-xs text-blue-600 mt-1">{expLevel?.description || 'Complete self-assessment'}</p>
          </div>

          {/* Skills Rated Card */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">📊</span>
              <span className="text-sm font-medium text-green-700">Skills Rated</span>
            </div>
            <p className="font-semibold text-green-900">{ratedSkills.length}</p>
            <p className="text-xs text-green-600 mt-1">
              {ratedSkills.length === 0 ? 'Instructor will rate after lessons' : 'skills assessed'}
            </p>
          </div>

          {/* Overall Progress Card */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🎯</span>
              <span className="text-sm font-medium text-purple-700">Progress</span>
            </div>
            <p className="font-semibold text-purple-900">{overallRating ? `${overallRating}/5` : 'N/A'}</p>
            <p className="text-xs text-purple-600 mt-1">
              {overallRating ? 'average instructor rating' : 'awaiting instructor rating'}
            </p>
          </div>
        </div>
      ) : (
        /* Expanded View for Instructor */
        <div className="space-y-3">
          {SKILL_CATEGORIES.map(category => {
            const categorySkills = DRIVING_SKILLS.filter(s => s.category === category.key)
            const isExpanded = expandedCategory === category.key
            const ratedCount = categorySkills.filter(s => {
              const skill = skills.find(sk => sk.skill_key === s.key)
              return skill && skill.instructor_rating > 0
            }).length

            return (
              <div key={category.key} className="border rounded-lg overflow-hidden">
                <button
                  onClick={() => setExpandedCategory(isExpanded ? null : category.key)}
                  className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{category.icon}</span>
                    <div className="text-left">
                      <p className="font-semibold">{category.name}</p>
                      <p className="text-xs text-gray-500">{ratedCount}/{categorySkills.length} rated</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Mini progress dots */}
                    <div className="flex gap-1">
                      {categorySkills.map(skill => {
                        const rating = getSkillValue(skill.key, 'best')
                        return (
                          <div
                            key={skill.key}
                            className={`w-2 h-2 rounded-full ${
                              rating >= 4 ? 'bg-green-500' :
                              rating >= 2 ? 'bg-yellow-500' :
                              rating > 0 ? 'bg-orange-500' :
                              'bg-gray-300'
                            }`}
                          />
                        )
                      })}
                    </div>
                    <span className="text-gray-400">{isExpanded ? '▲' : '▼'}</span>
                  </div>
                </button>

                {isExpanded && (
                  <div className="p-4 space-y-3">
                    {categorySkills.map(skill => {
                      const selfRating = getSkillValue(skill.key, 'self')
                      const instructorRating = getSkillValue(skill.key, 'instructor')
                      const isEditing = editing === skill.key

                      return (
                        <div key={skill.key} className="bg-white border rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span>{skill.icon}</span>
                              <span className="font-medium text-sm">{skill.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`text-sm font-semibold ${
                                instructorRating >= 4 ? 'text-green-600' :
                                instructorRating >= 2 ? 'text-yellow-600' :
                                'text-gray-400'
                              }`}>
                                {instructorRating > 0 ? `${instructorRating}/5` : '—'}
                              </span>
                              {!readOnly && (
                                isEditing ? (
                                  <div className="flex items-center gap-1">
                                    <select
                                      value={editValue}
                                      onChange={e => setEditValue(Number(e.target.value))}
                                      className="px-2 py-1 border rounded text-sm"
                                    >
                                      {[0, 1, 2, 3, 4, 5].map(v => (
                                        <option key={v} value={v}>{v}</option>
                                      ))}
                                    </select>
                                    <button
                                      onClick={() => handleSaveEdit(skill.key)}
                                      className="px-2 py-1 bg-green-600 text-white rounded text-sm"
                                    >
                                      ✓
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => {
                                      setEditing(skill.key)
                                      setEditValue(instructorRating)
                                    }}
                                    className="text-xs text-primary hover:underline"
                                  >
                                    Edit
                                  </button>
                                )
                              )}
                            </div>
                          </div>
                          {/* Mini progress bar */}
                          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all ${
                                instructorRating >= 4 ? 'bg-green-500' : 
                                instructorRating >= 2 ? 'bg-yellow-500' : 
                                instructorRating > 0 ? 'bg-orange-500' : 'bg-gray-300'
                              }`}
                              style={{ width: `${(instructorRating / 5) * 100}%` }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
