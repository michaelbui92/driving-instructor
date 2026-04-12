'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { EXPERIENCE_LEVELS, DRIVING_SKILLS, SKILL_CATEGORIES } from '@/lib/skills'
import { toast } from '@/components/Toast'

interface Student {
  id: string
  name: string
  email: string
  phone: string
  created_at: string
  experience_level?: string
  details_completed?: boolean
  onboarding_completed?: boolean
}

interface StudentSkill {
  skill_key: string
  skill_name: string
  self_assessment: number
  instructor_rating: number
  notes: string
}

export default function InstructorStudentsTab() {
  const [students, setStudents] = useState<Student[]>([])
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [studentSkills, setStudentSkills] = useState<StudentSkill[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editingSkill, setEditingSkill] = useState<string | null>(null)
  const [editValue, setEditValue] = useState(0)

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
        .select('id, name, email, phone, created_at, experience_level, details_completed, onboarding_completed')
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
      setStudentSkills(data || [])
    } catch (err) {
      console.error('Error loading skills:', err)
      toast('error', 'Failed to load skills')
    }
  }

  const handleSaveSkill = async (skillKey: string) => {
    if (!selectedStudent) return

    setSaving(true)
    try {
      const { error } = await supabase
        .from('student_skills')
        .update({ instructor_rating: editValue })
        .eq('student_id', selectedStudent.id)
        .eq('skill_key', skillKey)

      if (error) throw error

      // Update local state
      setStudentSkills(prev =>
        prev.map(s =>
          s.skill_key === skillKey
            ? { ...s, instructor_rating: editValue }
            : s
        )
      )

      toast('success', 'Skill rating updated!')
      setEditingSkill(null)
    } catch (err) {
      console.error('Error updating skill:', err)
      toast('error', 'Failed to update skill')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteStudent = async (student: Student) => {
    if (!confirm(`Delete student "${student.name || student.email}"?\n\nThis will permanently delete:\n- Their profile\n- All their bookings\n- All their skill records\n\nThis cannot be undone.`)) {
      return
    }

    setDeleting(true)
    try {
      // 1. Delete student's skill records
      await supabase
        .from('student_skills')
        .delete()
        .eq('student_id', student.id)

      // 2. Delete student's bookings
      await supabase
        .from('bookings_new')
        .delete()
        .eq('email', student.email)

      // 3. Delete the student record
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', student.id)

      if (error) throw error

      toast('success', `Student "${student.name || student.email}" deleted`)
      setSelectedStudent(null)
      loadStudents()
    } catch (err) {
      console.error('Error deleting student:', err)
      toast('error', 'Failed to delete student')
    } finally {
      setDeleting(false)
    }
  }

  const getSkillRating = (skillKey: string) => {
    const skill = studentSkills.find(s => s.skill_key === skillKey)
    return skill ? skill.instructor_rating : 0
  }

  const filteredStudents = students.filter(student => {
    const name = (student.name || '').toLowerCase()
    const email = (student.email || '').toLowerCase()
    const search = searchTerm.toLowerCase()
    return name.includes(search) || email.includes(search)
  })

  if (loading) {
    return <div className="p-6">Loading students...</div>
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Student Management</h2>
        <button
          onClick={loadStudents}
          className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition"
        >
          🔄 Refresh
        </button>
      </div>
      
      <input
        type="text"
        placeholder="Search by name or email..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-4 py-2 border rounded-lg"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white border rounded-lg overflow-hidden">
            <div className="p-4 bg-gray-50 border-b">
              <p className="text-sm text-gray-600">
                {filteredStudents.length} student{filteredStudents.length !== 1 ? 's' : ''} found
              </p>
            </div>
            <div className="max-h-[400px] overflow-y-auto">
              {filteredStudents.map(student => (
                <button
                  key={student.id}
                  onClick={() => setSelectedStudent(student)}
                  className={`w-full text-left p-4 border-b last:border-b-0 transition ${
                    selectedStudent?.id === student.id 
                      ? 'bg-blue-50 border-l-4 border-l-primary' 
                      : 'hover:bg-gray-50 border-l-4 border-l-transparent'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold truncate">
                        {student.name || 'No name set'}
                      </div>
                      <div className="text-sm text-gray-600 truncate">{student.email}</div>
                      <div className="flex items-center gap-2 mt-1">
                        {student.experience_level && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                            {EXPERIENCE_LEVELS.find(l => l.key === student.experience_level)?.icon} {' '}
                            {EXPERIENCE_LEVELS.find(l => l.key === student.experience_level)?.name}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
              {filteredStudents.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  No students found
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          {selectedStudent ? (
            <div className="bg-white border rounded-lg p-6 space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-2">
                    {selectedStudent.name || 'No name set'}
                  </h3>
                  <p className="text-gray-600">{selectedStudent.email}</p>
                  {selectedStudent.phone && (
                    <p className="text-gray-600">{selectedStudent.phone}</p>
                  )}
                </div>
                <button
                  onClick={() => handleDeleteStudent(selectedStudent)}
                  disabled={deleting}
                  className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition text-sm font-medium disabled:opacity-50"
                >
                  {deleting ? 'Deleting...' : '🗑️ Delete'}
                </button>
              </div>

              {/* Status Badges */}
              <div className="flex flex-wrap gap-2">
                {selectedStudent.details_completed ? (
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                    ✅ Details Complete
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
                    ⚠️ Details Incomplete
                  </span>
                )}
                {selectedStudent.onboarding_completed ? (
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                    ✅ Self-Assessment Done
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
                    ⚠️ Self-Assessment Pending
                  </span>
                )}
              </div>

              {/* Experience Level */}
              {selectedStudent.experience_level && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Student Self-Assessment</h4>
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">
                      {EXPERIENCE_LEVELS.find(l => l.key === selectedStudent.experience_level)?.icon || '🚗'}
                    </div>
                    <div>
                      <p className="font-medium">
                        {EXPERIENCE_LEVELS.find(l => l.key === selectedStudent.experience_level)?.name || selectedStudent.experience_level}
                      </p>
                      <p className="text-sm text-gray-600">
                        {EXPERIENCE_LEVELS.find(l => l.key === selectedStudent.experience_level)?.description}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Instructor Skill Rating Section */}
              <div>
                <h4 className="font-semibold text-lg mb-4">Instructor Skill Ratings</h4>
                <p className="text-sm text-gray-500 mb-4">
                  Rate student skills after lessons (0 = not assessed, 5 = excellent)
                </p>

                <div className="space-y-4">
                  {SKILL_CATEGORIES.map(category => {
                    const categorySkills = DRIVING_SKILLS.filter(s => s.category === category.key)
                    
                    return (
                      <div key={category.key} className="border rounded-lg overflow-hidden">
                        <div className="bg-gray-50 p-3 border-b">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{category.icon}</span>
                            <span className="font-semibold">{category.name}</span>
                          </div>
                        </div>
                        <div className="p-3 space-y-3">
                          {categorySkills.map(skill => {
                            const rating = getSkillRating(skill.key)
                            const isEditing = editingSkill === skill.key

                            return (
                              <div key={skill.key} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span>{skill.icon}</span>
                                  <div>
                                    <p className="font-medium text-sm">{skill.name}</p>
                                    <p className="text-xs text-gray-500">{skill.description}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  {isEditing ? (
                                    <>
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
                                        onClick={() => handleSaveSkill(skill.key)}
                                        disabled={saving}
                                        className="px-2 py-1 bg-green-600 text-white rounded text-sm disabled:opacity-50"
                                      >
                                        ✓
                                      </button>
                                      <button
                                        onClick={() => setEditingSkill(null)}
                                        className="px-2 py-1 bg-gray-300 rounded text-sm"
                                      >
                                        ✕
                                      </button>
                                    </>
                                  ) : (
                                    <>
                                      <span className={`text-lg font-bold w-8 text-center ${
                                        rating >= 4 ? 'text-green-600' :
                                        rating >= 2 ? 'text-yellow-600' :
                                        rating > 0 ? 'text-orange-600' :
                                        'text-gray-400'
                                      }`}>
                                        {rating > 0 ? rating : '—'}
                                      </span>
                                      <button
                                        onClick={() => {
                                          setEditingSkill(skill.key)
                                          setEditValue(rating)
                                        }}
                                        className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200"
                                      >
                                        Edit
                                      </button>
                                    </>
                                  )}
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

              {/* Student Info */}
              <div className="grid grid-cols-2 gap-4 text-sm pt-4 border-t">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-gray-500">Student ID</p>
                  <p className="font-mono text-xs truncate">{selectedStudent.id}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-gray-500">Account Created</p>
                  <p>{new Date(selectedStudent.created_at).toLocaleString()}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-100 rounded-lg p-6 text-center">
              <p className="text-gray-500">Select a student to view their details</p>
              <p className="text-sm text-gray-400 mt-2">Click on a student from the list on the left</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
