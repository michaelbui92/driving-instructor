'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { DRIVING_SKILLS, SKILL_CATEGORIES } from '@/lib/skills'
import { toast } from '@/components/Toast'

interface Student {
  id: string
  name: string
  email: string
  phone: string
  created_at: string
}

interface StudentSkill {
  skill_key: string
  skill_name: string
  self_assessment: number
  instructor_rating: number
}

export default function InstructorSkillEditor() {
  const [students, setStudents] = useState<Student[]>([])
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [studentSkills, setStudentSkills] = useState<StudentSkill[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadStudents()
  }, [])

  useEffect(() => {
    if (selectedStudent) {
      loadStudentSkills(selectedStudent.id)
    }
  }, [selectedStudent])

  const loadStudents = async () => {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('id, name, email, phone, created_at')
        .order('created_at', { ascending: false })

      if (error) throw error
      setStudents(data || [])
    } catch (err) {
      console.error('Error loading students:', err)
      toast('error', 'Failed to load students')
    } finally {
      setLoading(false)
    }
  }

  const loadStudentSkills = async (studentId: string) => {
    try {
      const { data, error } = await supabase
        .from('student_skills')
        .select('*')
        .eq('student_id', studentId)
        .order('skill_key')

      if (error) throw error

      // If no skills exist, create default entries
      if (!data || data.length === 0) {
        const defaultSkills = DRIVING_SKILLS.map(skill => ({
          student_id: studentId,
          skill_key: skill.key,
          skill_name: skill.name,
          self_assessment: 0,
          instructor_rating: 0
        }))

        const { error: insertError } = await supabase
          .from('student_skills')
          .upsert(defaultSkills, { onConflict: 'student_id,skill_key' })

        if (insertError) throw insertError

        // Reload after creating
        const { data: newData } = await supabase
          .from('student_skills')
          .select('*')
          .eq('student_id', studentId)
          .order('skill_key')

        setStudentSkills(newData || [])
      } else {
        setStudentSkills(data)
      }
    } catch (err) {
      console.error('Error loading student skills:', err)
      toast('error', 'Failed to load student skills')
    }
  }

  const handleSkillChange = (skillKey: string, rating: number) => {
    setStudentSkills(prev =>
      prev.map(skill =>
        skill.skill_key === skillKey
          ? { ...skill, instructor_rating: rating }
          : skill
      )
    )
  }

  const saveSkills = async () => {
    if (!selectedStudent) return

    setSaving(true)
    try {
      // Save all skills
      const updates = studentSkills.map(skill => ({
        student_id: selectedStudent.id,
        skill_key: skill.skill_key,
        skill_name: skill.skill_name,
        self_assessment: skill.self_assessment,
        instructor_rating: skill.instructor_rating
      }))

      const { error } = await supabase
        .from('student_skills')
        .upsert(updates, { onConflict: 'student_id,skill_key' })

      if (error) throw error

      // Record history for changed skills
      for (const skill of studentSkills) {
        const originalSkill = studentSkills.find(s => s.skill_key === skill.skill_key)
        if (originalSkill && originalSkill.instructor_rating !== skill.instructor_rating) {
          await supabase.from('skill_history').insert({
            student_id: selectedStudent.id,
            skill_key: skill.skill_key,
            old_rating: originalSkill.instructor_rating,
            new_rating: skill.instructor_rating,
            change_type: 'instructor',
            notes: `Instructor updated rating from ${originalSkill.instructor_rating} to ${skill.instructor_rating}`
          })
        }
      }

      toast('success', 'Skills updated successfully!')
    } catch (err) {
      console.error('Error saving skills:', err)
      toast('error', 'Failed to save skills')
    } finally {
      setSaving(false)
    }
  }

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Student Skill Management</h2>
        <p className="text-gray-600 mb-6">
          Update student skill ratings and track their progress over time.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Student List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-4">
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {filteredStudents.map(student => (
                <button
                  key={student.id}
                  onClick={() => setSelectedStudent(student)}
                  className={`w-full text-left p-3 rounded-lg transition ${
                    selectedStudent?.id === student.id
                      ? 'bg-primary text-white'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="font-semibold">{student.name}</div>
                  <div className={`text-sm ${selectedStudent?.id === student.id ? 'text-blue-100' : 'text-gray-500'}`}>
                    {student.email}
                  </div>
                  <div className={`text-xs ${selectedStudent?.id === student.id ? 'text-blue-100' : 'text-gray-400'}`}>
                    Joined {new Date(student.created_at).toLocaleDateString()}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Skill Editor */}
        <div className="lg:col-span-2">
          {selectedStudent ? (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold">{selectedStudent.name}</h3>
                  <p className="text-gray-600">{selectedStudent.email}</p>
                </div>
                <button
                  onClick={saveSkills}
                  disabled={saving}
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>

              <div className="space-y-6">
                {SKILL_CATEGORIES.map(category => {
                  const categorySkills = studentSkills.filter(skill => {
                    const skillDef = DRIVING_SKILLS.find(s => s.key === skill.skill_key)
                    return skillDef?.category === category.key
                  })

                  if (categorySkills.length === 0) return null

                  return (
                    <div key={category.key}>
                      <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <span>{category.icon}</span>
                        {category.name}
                      </h4>

                      <div className="space-y-3">
                        {categorySkills.map(skill => {
                          const skillDef = DRIVING_SKILLS.find(s => s.key === skill.skill_key)
                          return (
                            <div key={skill.skill_key} className="border rounded-lg p-4">
                              <div className="flex items-center justify-between mb-3">
                                <div>
                                  <p className="font-semibold">{skillDef?.icon} {skill.skill_name}</p>
                                  <p className="text-gray-500 text-sm">{skillDef?.description}</p>
                                </div>
                                <div className="text-right">
                                  <div className="text-sm text-gray-500">
                                    Self: {skill.self_assessment}/5
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium">Instructor Rating:</span>
                                  <div className="flex gap-1">
                                    {[0, 1, 2, 3, 4, 5].map(rating => (
                                      <button
                                        key={rating}
                                        onClick={() => handleSkillChange(skill.skill_key, rating)}
                                        className={`w-8 h-8 rounded-md font-semibold transition ${
                                          skill.instructor_rating === rating
                                            ? 'bg-primary text-white'
                                            : rating === 0
                                            ? 'bg-gray-200 text-gray-500 hover:bg-gray-300'
                                            : rating <= 2
                                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                            : rating <= 3
                                            ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                                        }`}
                                      >
                                        {rating}
                                      </button>
                                    ))}
                                  </div>
                                </div>

                                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full rounded-full transition-all ${
                                      skill.instructor_rating >= 4 ? 'bg-green-500' :
                                      skill.instructor_rating >= 2 ? 'bg-yellow-500' :
                                      skill.instructor_rating > 0 ? 'bg-orange-500' : 'bg-gray-300'
                                    }`}
                                    style={{ width: `${(skill.instructor_rating / 5) * 100}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <div className="text-6xl mb-4">👨‍🏫</div>
              <h3 className="text-xl font-bold mb-2">Select a Student</h3>
              <p className="text-gray-600">
                Choose a student from the list to view and edit their skill ratings.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
