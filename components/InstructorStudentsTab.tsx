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
}

export default function InstructorStudentsTab() {
  const [students, setStudents] = useState<Student[]>([])
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadStudents()
  }, [])

  const loadStudents = async () => {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('id, name, email, phone, created_at, experience_level')
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
      <h2 className="text-2xl font-bold">Student Management</h2>
      
      <input
        type="text"
        placeholder="Search students..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-4 py-2 border rounded-lg"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="space-y-2">
            {filteredStudents.map(student => (
              <button
                key={student.id}
                onClick={() => setSelectedStudent(student)}
                className={`w-full text-left p-3 rounded-lg ${
                  selectedStudent?.id === student.id ? 'bg-blue-100' : 'bg-gray-100'
                }`}
              >
                <div className="font-semibold">{student.name || 'No name'}</div>
                <div className="text-sm text-gray-600">{student.email}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2">
          {selectedStudent ? (
            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">{selectedStudent.name || 'No name'}</h3>
              <p className="text-gray-600 mb-2">{selectedStudent.email}</p>
              <p className="text-gray-600 mb-4">{selectedStudent.phone || 'No phone'}</p>
              
              {selectedStudent.experience_level && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Student Self-Assessment</h4>
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">
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
            </div>
          ) : (
            <div className="bg-gray-100 rounded-lg p-6 text-center">
              <p className="text-gray-500">Select a student to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}