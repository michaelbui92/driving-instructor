'use client'

import ProtectedRoute from '@/components/ProtectedRoute'
import InstructorPageContent from './InstructorPageContent'

export default function InstructorPageWrapper() {
  return (
    <ProtectedRoute>
      <InstructorPageContent />
    </ProtectedRoute>
  )
}