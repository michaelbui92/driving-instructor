'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { DRIVING_SKILLS, SKILL_CATEGORIES, EXPERIENCE_LEVELS } from '@/lib/skills'
import { toast } from '@/components/Toast'
import { formatDate, getLessonTypeName, getLessonPrice } from '@/lib/booking-utils'

interface Student {
  id: string
  name: string
  email: string
  phone: string
  created_at: string
  experience_level?: string
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
        .select('id, name, email, phone, created_at, experience_level')
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

      if (skillsError) throw skillsError

      // If no skills exist, create default ones
      if (!skillsData || skillsData.length === 0) {
        const defaultSkills = DRIVING_SKILLS.map(skill => ({
          student_id: studentId,
          skill_key: skill.key,
          skill_name: skill.name,
          self_assessment: 0,
          instructor_rating: 0,
          notes: ''
        }))

        await supabase
          .from('student_skills')
          .upsert(defaultSkills, { onConflict: 'student_id,skill_key' })

        // Reload skills
        const { data: newSkillsData } = await supabase
          .from('student_skills')
          .select('*')
          .eq('student_id', studentId)

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

  const handleSkillChange = async (skillKey: string, rating: number) => {
    try {
      setSaving(true)
      const { error } = await supabase
        .from('student_skills')
        .update({ instructor_rating: rating })
        .eq('student_id', selectedStudent?.id || '')
        .eq('skill_key', skillKey)

      if (error) throw error

      // Update local state
      setStudentSkills(prev =>
        prev.map(skill =>
          skill.skill_key === skillKey
            ? { ...skill, instructor_rating: rating }
            : skill
        )
      )

      toast('success', 'Skill rating updated')
    } catch (err) {
      console.error('Error updating skill:', err)
      toast('error', 'Failed to update skill rating')
    } finally {
      setSaving(false)
    }
  }

  const handleBookingStatusChange = async (bookingId: string, status: 'confirmed' | 'cancelled' | 'completed') => {
    try {
      setSaving(true)
      const { error } = await supabase
        .from('bookings_new')
        .update({ status })
        .eq('id', bookingId)

      if (error) throw error

      // Update local state
      setStudentBookings(prev =>
        prev.map(booking =>
          booking.id === bookingId
            ? { ...booking, status }
            : booking
        )
      )

      toast('success', `Booking ${status}`)
    } catch (err) {
      console.error('Error updating booking:', err)
      toast('error', 'Failed to update booking')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteStudent = async (studentId: string) => {
    if (!confirm('Delete this student and all their bookings and skills?')) return

    try {
      setSaving(true)
      
      // Delete student skills
      await supabase
        .from('student_skills')
        .delete()
        .eq('student_id', studentId)

      // Delete student bookings
      await supabase
        .from('bookings_new')
        .delete()
        .eq('email', students.find(s => s.id === studentId)?.email || '')

      // Delete student record
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', studentId)

      if (error) throw error

      toast('success', 'Student deleted')
      loadStudents()
      setSelectedStudent(null)
    } catch (err) {
      console.error('Error deleting student:', err)
      toast('error', 'Failed to delete student')
    } finally {
      setSaving(false)
    }
  }

  const filteredStudents = students.filter(student => {
    const name = (student.name || '').toLowerCase()
    const email = (student.email || '').toLowerCase()
    const search = searchTerm.toLowerCase()
    
    return name.includes(search) || email.includes(search)
  })

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

      {/* Search and Student List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border p-4">
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                list="student-suggestions"
              />
              <datalist id="student-suggestions">
                {students.map(student => (
                  <option key={student.id} value={student.name || student.email} />
                ))}
              </datalist>
            </div>

            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {filteredStudents.map(student => (
                <button
                  key={student.id}
                  onClick={() => setSelectedStudent(student)}
                  className={`w-full text-left p-3 rounded-lg transition ${
                    selectedStudent?.id === student.id
                      ? 'bg-primary text-white'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <div className="font-semibold">{student.name || 'No name'}</div>
                  <div className="text-sm opacity-80 truncate">{student.email}</div>
                  <div className="text-xs mt-1">
                    {new Date(student.created_at).toLocaleDateString()}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteStudent(student.id)
                    }}
                    className="mt-2 text-xs px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
                  >
                    🗑️ Delete
                  </button>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Student Details */}
        <div className="lg:col-span-2">
          {selectedStudent ? (
            <div className="bg-white rounded-xl border p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold">{selectedStudent.name || 'No name'}</h3>
                  <p className="text-gray-600">{selectedStudent.email}</p>
                  <p className="text-gray-600">{selectedStudent.phone || 'No phone'}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveView('bookings')}
                    className={`px-4 py-2 rounded-lg transition ${
                      activeView === 'bookings'
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Bookings
                  </button>
                  <button
                    onClick={() => setActiveView('skills')}
                    className={`px-4 py-2 rounded-lg transition ${
                      activeView === 'skills'
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Skills
                  </button>
                </div>
              </div>

              {activeView === 'bookings' ? (
                <div>
                  <h4 className="text-lg font-semibold mb-4">Student Bookings</h4>
                  {studentBookings.length > 0 ? (
                    <div className="space-y-3">
                      {studentBookings.map(booking => (
                        <div key={booking.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <p className="font-semibold">
                                {getLessonTypeName(booking.lesson_type)} - {formatDate(booking.date)} {booking.time}
                              </p>
                              <p className="text-gray-600 text-sm">
                                ${getLessonPrice(booking.lesson_type, booking.promo_code)} 
                                {booking.promo_code && ` (Promo: ${booking.promo_code})`}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {booking.status}
                              </span>
                              {booking.status === 'pending' && (
                                <>
                                  <button
                                    onClick={() => handleBookingStatusChange(booking.id, 'confirmed')}
                                    className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
                                  >
                                    Confirm
                                  </button>
                                  <button
                                    onClick={() => handleBookingStatusChange(booking.id, 'cancelled')}
                                    className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
                                  >
                                    Cancel
                                  </button>
                                </>
                              )}
                              {booking.status === 'confirmed' && (
                                <button
                                  onClick={() => handleBookingStatusChange(booking.id, 'completed')}
                                  className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                                >
                                  Mark Complete
                                </button>
                              )}
                            </div>
                          </div>
                          <div className="text-sm text-gray-500">
                            Created: {new Date(booking.created_at).toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No bookings found for this student.</p>
                  )}
                </div>
              ) : (
                <div>
                  {/* Student Self-Assessment (Experience Level) */}
                  <div className="border rounded-lg p-4 bg-blue-50 mb-6">
                    <h5 className="text-md font-semibold mb-3">Student Self-Assessment</h5>
                    {selectedStudent.experience_level ? (
                      <div>
                        <div className="flex items-start gap-3">
                          <div className="text-2xl">
                            {EXPERIENCE_LEVELS.find(l => l.key === selectedStudent.experience_level)?.icon || '🚗'}
                          </div>
                          <div>
                            <p className="font-semibold">
                              {EXPERIENCE_LEVELS.find(l => l.key === selectedStudent.experience_level)?.name || selectedStudent.experience_level}
                            </p>
                            <p className="text-gray-600 text-sm mt-1">
                              {EXPERIENCE_LEVELS.find(l => l.key === selectedStudent.experience_level)?.description || 'No description'}
                            </p>
                            <div className="mt-2 p-2 bg-white rounded border">
                              <p className="text-sm font-medium text-blue-800">Instructor Notes:</p>
                              <p className="text-sm text-blue-700 mt-1">
                                {EXPERIENCE_LEVELS.find(l => l.key === selectedStudent.experience_level)?.instructor_notes || 'No notes'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">Student hasn't completed self-assessment yet.</p>
                    )}
                  </div>

                  {/* Instructor Detailed Assessment */}
                  <div>
                    <h5 className="text-md font-semibold mb-4">Instructor Skill Assessment</h5>
                    <p className="text-gray-600 text-sm mb-4">
                      Rate student skills after lessons (0 = not assessed, 1 = needs work, 5 = excellent)
                    </p>
                    
                    {SKILL_CATEGORIES.map(category => {
                      const categorySkills = studentSkills.filter(skill => {
                        const skillDef = DRIVING_SKILLS.find(s => s.key === skill.skill_key)
                        return skillDef?.category === category.key
                      })

                      if (categorySkills.length === 0) return null

                      return (
                        <div key={category.key} className="mb-6">
                          <h5 className="text-md font-semibold mb-3 flex items-center gap-2">
                            <span>{category.icon}</