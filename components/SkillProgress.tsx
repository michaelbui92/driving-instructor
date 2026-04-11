'use client'

import { useState, useEffect } from 'react'
import { DRIVING_SKILLS, SKILL_CATEGORIES, SKILL_LEVELS } from '@/lib/skills'
import { supabase } from '@/lib/supabase'
import { toast } from '@/components/Toast'

interface SkillData {
  skill_key: string
  skill_name: string
  self_assessment: number
  instructor_rating: number
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

      // Record history
      const skill = skills.find(s => s.skill_key === skillKey)
      if (skill && skill.instructor_rating !== editValue) {
        await supabase.from('skill_history').insert({
          student_id: studentId,
          skill_key: skillKey,
          old_rating: skill.instructor_rating,
          new_rating: editValue,
          change_type: 'instructor'
        })
      }

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
      <div className="animate-pulse space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-20 bg-gray-200 rounded-xl" />
        ))}
      </div>
    )
  }

  if (skills.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-xl">
        <p className="text-gray-500">No skill assessments yet.</p>
      </div>
    )
  }

  // Group skills by category
  const groupedSkills = SKILL_CATEGORIES.map(cat => ({
    ...cat,
    skills: DRIVING_SKILLS.filter(s => s.category === cat.key)
  })).filter(cat => cat.skills.length > 0)

  return (
    <div className="space-y-6">
      {groupedSkills.map(category => (
        <div key={category.key}>
          <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
            <span>{category.icon}</span>
            {category.name}
          </h3>
          
          <div className="space-y-3">
            {category.skills.map(skill => {
              const selfRating = getSkillValue(skill.key, 'self')
              const instructorRating = getSkillValue(skill.key, 'instructor')
              const bestRating = getSkillValue(skill.key, 'best')
              const isEditing = editing === skill.key

              return (
                <div key={skill.key} className="bg-white border rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-semibold">{skill.icon} {skill.name}</p>
                      <p className="text-gray-500 text-sm">{skill.description}</p>
                    </div>
                    
                    {!readOnly && (
                      <div className="text-right">
                        {isEditing ? (
                          <div className="flex items-center gap-2">
                            <select
                              value={editValue}
                              onChange={e => setEditValue(Number(e.target.value))}
                              className="px-3 py-1 border rounded-lg"
                            >
                              {[0, 1, 2, 3, 4, 5].map(v => (
                                <option key={v} value={v}>{v}</option>
                              ))}
                            </select>
                            <button
                              onClick={() => handleSaveEdit(skill.key)}
                              className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditing(null)}
                              className="px-3 py-1 bg-gray-300 rounded-lg text-sm"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setEditing(skill.key)
                              setEditValue(instructorRating)
                            }}
                            className="text-sm text-primary hover:underline"
                          >
                            Edit
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Progress bars */}
                  <div className="space-y-2">
                    {!readOnly && (
                      <div>
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>Your self-assessment</span>
                          <span>{selfRating}/5</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500 rounded-full transition-all"
                            style={{ width: `${(selfRating / 5) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Instructor rating</span>
                        <span>{instructorRating > 0 ? `${instructorRating}/5` : 'Not rated'}</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
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
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}

      {/* Overall Progress */}
      <div className="bg-gradient-to-r from-primary to-secondary rounded-xl p-6 text-white">
        <h3 className="text-lg font-bold mb-2">Overall Progress</h3>
        <div className="flex items-center justify-between">
          <p className="text-blue-100">
            Average instructor rating across all skills
          </p>
          <div className="text-3xl font-bold">
            {skills.length > 0 
              ? (skills.reduce((acc, s) => acc + Math.max(s.self_assessment, s.instructor_rating), 0) / skills.length).toFixed(1)
              : '0'}/5
          </div>
        </div>
      </div>
    </div>
  )
}
