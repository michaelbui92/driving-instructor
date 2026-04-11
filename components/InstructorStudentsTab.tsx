'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { DRIVING_SKILLS, SKILL_CATEGORIES } from '@/lib/skills'
import { toast } from '@/components/Toast'
import { formatDate, getLessonTypeName, getLessonPrice } from '@/lib/booking-utils'

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

interface StudentBooking {
  id: string
  student_name: string
  email: string
  phone: string
  date: string
  time: string
  lesson_type: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  price?: number
  promo_code?: string
  created_at: string
}

export default function InstructorStudentsTab() {
  const [students, setStudents] = useState<Student[]>([])
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [studentSkills, setStudentSkills] = useState<StudentSkill[]>([])
  const [studentBookings, setStudentBookings] = useState<StudentBooking[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeView, setActiveView] = useState<'bookings' | 'skills'>('bookings')

  useEffect(() => {
    loadStudents()
  }, [])

  useEffect(() => {
    if (selectedStudent) {
      loadStudentData(selectedStudent.id)
    }
  }, [selectedStudent])

  const loadStudents = async () => {
    try {
      console.log('Loading students from database...')
      const { data, error } = await supabase
        .from('students')
        .select('id, name, email, phone, created_at')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Database error loading students:', error)
        throw error
      }
      
      console.log(`Loaded ${data?.length || 0} students:`, data)
      setStudents(data || [])
      
      if (data?.length === 0) {
        toast('info', 'No students found in database. Students are created when they verify OTP.')
      }
    } catch (err) {
      console.error('Error loading students:', err)
      toast('error', `Failed to load students: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  const loadStudentData = async (studentId: string) => {
    try {
      // Load student skills
      const { data: skillsData, error: skillsError } = await supabase
        .from('student_skills')
        .select('*')
        .eq('student_id', studentId)
        .order('skill_key')

      if (skillsError) throw skillsError

      // If no skills exist, create default entries
      if (!skillsData || skillsData.length === 0) {
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
        const { data: newSkillsData } = await supabase
          .from('student_skills')
          .select('*')
          .eq('student_id', studentId)
          .order('skill_key')

        setStudentSkills(newSkillsData || [])
      } else {
        setStudentSkills(skillsData)
      }

      // Load student bookings
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings_new')
        .select('*')
        .eq('email', selectedStudent?.email || '')
        .order('date', { ascending: false })

      if (bookingsError) throw bookingsError
      setStudentBookings(bookingsData || [])

    } catch (err) {
      console.error('Error loading student data:', err)
      toast('error', 'Failed to load student data')
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

  const updateBookingStatus = async (bookingId: string, newStatus: 'confirmed' | 'cancelled' | 'completed') => {
    try {
      const { error } = await supabase
        .from('bookings_new')
        .update({ status: newStatus })
        .eq('id', bookingId)

      if (error) throw error

      // Reload student data
      if (selectedStudent) {
        loadStudentData(selectedStudent.id)
      }

      toast('success', `Booking ${newStatus}!`)
    } catch (err) {
      console.error('Error updating booking:', err)
      toast('error', 'Failed to update booking')
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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Student Management</h2>
          <p className="text-gray-600">
            View student bookings, track skill progress, and manage student data.
          </p>
        </div>
        <button
          onClick={async () => {
            try {
              const testEmail = `test.student.${Date.now()}@example.com`
              const { data, error } = await supabase
                .from('students')
                .insert({
                  email: testEmail,
                  name: 'Test Student',
                  phone: '0412 345 678',
                  address: '123 Test St, Sydney',
                  details_completed: true,
                  onboarding_completed: false,
                  onboarding_skipped: false
                })
                .select()
                .single()

              if (error) throw error
              
              toast('success', 'Test student created')
              loadStudents()
            } catch (err) {
              console.error('Error creating test student:', err)
              toast('error', 'Failed to create test student')
            }
          }}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm"
        >
          + Test Student
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Student List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-4">
            <div className="mb-4">
              {/* Dropdown search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  list="student-options"
                />
                <datalist id="student-options">
                  {students.map(student => (
                    <option key={student.id} value={student.name}>
                      {student.email}
                    </option>
                  ))}
                </datalist>
              </div>
            </div>

            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {filteredStudents.map(student => (
                <div
                  key={student.id}
                  className={`group p-3 rounded-lg transition ${
                    selectedStudent?.id === student.id
                      ? 'bg-primary text-white'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setSelectedStudent(student)}
                      className="flex-1 text-left"
                    >
                      <div className="font-semibold">{student.name}</div>
                      <div className={`text-sm ${selectedStudent?.id === student.id ? 'text-blue-100' : 'text-gray-500'}`}>
                        {student.email}
                      </div>
                      <div className={`text-xs ${selectedStudent?.id === student.id ? 'text-blue-100' : 'text-gray-400'}`}>
                        Joined {new Date(student.created_at).toLocaleDateString()}
                      </div>
                    </button>
                    
                    {/* Delete button */}
                    <button
                      onClick={async () => {
                        if (confirm(`Delete student "${student.name}"? This will remove all their data including bookings and skills.`)) {
                          try {
                            // Delete student skills first
                            await supabase
                              .from('student_skills')
                              .delete()
                              .eq('student_id', student.id)

                            // Delete student bookings
                            await supabase
                              .from('bookings_new')
                              .delete()
                              .eq('email', student.email)

                            // Delete student record
                            await supabase
                              .from('students')
                              .delete()
                              .eq('id', student.id)

                            // If this is the selected student, clear selection
                            if (selectedStudent?.id === student.id) {
                              setSelectedStudent(null)
                            }

                            // Reload student list
                            loadStudents()
                            
                            toast('success', `Student "${student.name}" deleted`)
                          } catch (err) {
                            console.error('Error deleting student:', err)
                            toast('error', 'Failed to delete student')
                          }
                        }
                      }}
                      className={`ml-2 p-2 rounded-lg transition ${
                        selectedStudent?.id === student.id
                          ? 'text-red-200 hover:bg-red-500 hover:text-white'
                          : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                      }`}
                      title="Delete student"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Student Details */}
        <div className="lg:col-span-2">
          {selectedStudent ? (
            <div className="space-y-6">
              {/* Student Header */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold">{selectedStudent.name}</h3>
                    <p className="text-gray-600">{selectedStudent.email}</p>
                    <p className="text-gray-500 text-sm">{selectedStudent.phone}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      {studentBookings.length} bookings
                    </p>
                    <p className="text-sm text-gray-500">
                      Joined {new Date(selectedStudent.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* View Toggle */}
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setActiveView('bookings')}
                    className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition ${
                      activeView === 'bookings' ? 'bg-white shadow text-primary' : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    📅 Bookings ({studentBookings.length})
                  </button>
                  <button
                    onClick={() => setActiveView('skills')}
                    className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition ${
                      activeView === 'skills' ? 'bg-white shadow text-primary' : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    📊 Skills
                  </button>
                </div>
              </div>

              {/* Bookings View */}
              {activeView === 'bookings' && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h4 className="text-lg font-semibold mb-4">Student Bookings</h4>
                  
                  {studentBookings.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No bookings found for this student.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {studentBookings.map(booking => (
                        <div key={booking.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <p className="font-semibold">
                                {formatDate(booking.date)} at {booking.time}
                              </p>
                              <p className="text-gray-600 text-sm">
                                {getLessonTypeName(booking.lesson_type)} • 
                                {booking.price === 0 ? ' FREE (Promo)' : ` $${booking.price || getLessonPrice(booking.lesson_type)}`}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {booking.status}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex gap-2 mt-3">
                            {booking.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                                  className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
                                >
                                  Confirm
                                </button>
                                <button
                                  onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                                  className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
                                >
                                  Cancel
                                </button>
                              </>
                            )}
                            {booking.status === 'confirmed' && (
                              <button
                                onClick={() => updateBookingStatus(booking.id, 'completed')}
                                className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                              >
                                Mark Complete
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Skills View */}
              {activeView === 'skills' && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-lg font-semibold">Skill Assessment</h4>
                    <button
                      onClick={saveSkills}
                      disabled={saving}
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition disabled:opacity-50 text-sm"
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
                          <h5 className="text-md font-semibold mb-3 flex items-center gap-2">
                            <span>{category.icon}</span>
                            {category.name}
                          </h5>

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
              )}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <div className="text-6xl mb-4">👨‍🎓</div>
              <h3 className="text-xl font-bold mb-2">Select a Student</h3>
              <p className="text-gray-600">
                Choose a student from the list to view their bookings and skill progress.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}