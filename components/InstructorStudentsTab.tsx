'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { EXPERIENCE_LEVELS } from '@/lib/skills'
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

export default function InstructorStudentsTab() {
  const [students, setStudents] = useState<Student[]>([])
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    loadStudents()
  }, [])

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

  const handleDeleteStudent = async (student: Student) => {
    if (!confirm(`Delete student "${student.name || student.email}"?\n\nThis will permanently delete:\n- Their profile\n- All their bookings\n- All their skill records\n\nThis cannot be undone.`)) {
      return
    }

    setDeleting(true)
    try {
      // 1. Delete student's skill records
      const { error: skillsError } = await supabase
        .from('student_skills')
        .delete()
        .eq('student_id', student.id)

      if (skillsError) {
        console.error('Error deleting skills:', skillsError)
        // Continue anyway - skills might not exist
      }

      // 2. Delete student's bookings
      const { error: bookingsError } = await supabase
        .from('bookings_new')
        .delete()
        .eq('email', student.email)

      if (bookingsError) {
        console.error('Error deleting bookings:', bookingsError)
        // Continue anyway - bookings might not exist
      }

      // 3. Delete the student record
      const { error: studentError } = await supabase
        .from('students')
        .delete()
        .eq('id', student.id)

      if (studentError) throw studentError

      toast('success', `Student "${student.name || student.email}" deleted`)
      
      // Clear selection and reload
      setSelectedStudent(null)
      loadStudents()
    } catch (err) {
      console.error('Error deleting student:', err)
      toast('error', 'Failed to delete student')
    } finally {
      setDeleting(false)
    }
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
                      <div className="text-xs text-gray-400 mt-1">
                        Created: {new Date(student.created_at).toLocaleDateString()}
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
            <div className="bg-white border rounded-lg p-6">
              <div className="flex items-start justify-between mb-6">
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
                  {deleting ? 'Deleting...' : '🗑️ Delete Student'}
                </button>
              </div>

              {/* Status Badges */}
              <div className="flex flex-wrap gap-2 mb-6">
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
                <div className="bg-blue-50 p-4 rounded-lg mb-6">
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
                      <p className="text-sm text-blue-700 mt-1">
                        <strong>Instructor focus:</strong> {EXPERIENCE_LEVELS.find(l => l.key === selectedStudent.experience_level)?.instructor_notes}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Student Info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
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
