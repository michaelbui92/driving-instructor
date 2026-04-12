'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { supabase } from '@/lib/supabase'
import { EXPERIENCE_LEVELS, DRIVING_SKILLS, SKILL_CATEGORIES } from '@/lib/skills'
import { toast } from '@/components/Toast'

interface SkillData {
  skill_key: string
  skill_name: string
  self_assessment: number
  instructor_rating: number
  notes: string
}

export default function StudentSkillsPage() {
  const [studentId, setStudentId] = useState<string>('')
  const [skills, setSkills] = useState<SkillData[]>([])
  const [loading, setLoading] = useState(true)
  const [userEmail, setUserEmail] = useState<string>('')
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    loadStudentData()
  }, [])

  const loadStudentData = async () => {
    try {
      // Get email from cookie
      const cookies = document.cookie.split(';')
      let email = ''
      for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=')
        if (name === 'sb-email') {
          email = decodeURIComponent(value)
          break
        }
      }
      
      if (!email) {
        router.push('/student/login')
        return
      }
      
      setUserEmail(email)
      
      // Get student
      const { data: student, error: studentError } = await supabase
        .from('students')
        .select('id, name, experience_level')
        .eq('email', email)
        .single()
      
      if (studentError || !student) {
        router.push('/student/dashboard')
        return
      }
      
      setStudentId(student.id)
      
      // Get skills
      const { data: skillsData, error: skillsError } = await supabase
        .from('student_skills')
        .select('*')
        .eq('student_id', student.id)
        .order('skill_key')

      if (skillsError) throw skillsError
      setSkills(skillsData || [])
    } catch (err) {
      console.error('Error loading student data:', err)
      toast('error', 'Failed to load skills')
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navbar showLocation={false} />
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  // Get experience level info
  const experienceSkill = skills.find(s => s.skill_key === 'experience_level')
  const expLevel = experienceSkill ? EXPERIENCE_LEVELS.find(l => {
    const levelMap: Record<number, string> = {
      1: 'complete_beginner',
      2: 'overseas_driver',
      3: 'learner',
      4: 'refresher',
      5: 'advanced'
    }
    return l.key === levelMap[experienceSkill.self_assessment]
  }) : null

  // Calculate overall stats
  const ratedSkills = skills.filter(s => s.skill_key !== 'experience_level' && s.instructor_rating > 0)
  const overallRating = ratedSkills.length > 0 
    ? (ratedSkills.reduce((acc, s) => acc + s.instructor_rating, 0) / ratedSkills.length).toFixed(1)
    : null

  // Group skills by category
  const groupedSkills = SKILL_CATEGORIES.map(cat => ({
    ...cat,
    skills: DRIVING_SKILLS.filter(s => s.category === cat.key)
  })).filter(cat => cat.skills.length > 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar showLocation={false} />

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">📈 My Skills</h1>
          <p className="text-gray-600">Track your driving progress</p>
          <div className="mt-4 max-w-2xl mx-auto">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
              <p className="font-medium">📝 Note for Students:</p>
              <p>This page displays your skills as assessed by your instructor. Only your instructor can update these ratings based on your driving performance during lessons.</p>
              <p className="mt-1">Your instructor will regularly update your skill ratings to track your progress and identify areas for improvement.</p>
            </div>
          </div>
        </div>

        {/* Experience Level Card */}
        {expLevel && (
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-6 text-white mb-8">
            <div className="flex items-center gap-4">
              <div className="text-5xl">{expLevel.icon}</div>
              <div>
                <p className="text-blue-100 text-sm">Your Starting Point</p>
                <p className="text-2xl font-bold">{expLevel.name}</p>
                <p className="text-blue-100 text-sm mt-1">{expLevel.description}</p>
              </div>
            </div>
          </div>
        )}

        {/* Overall Progress Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-3xl font-bold text-primary">{skills.filter(s => s.skill_key !== 'experience_level').length}</p>
              <p className="text-sm text-gray-500">Total Skills</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-green-600">{ratedSkills.length}</p>
              <p className="text-sm text-gray-500">Skills Rated</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-purple-600">{overallRating || '—'}</p>
              <p className="text-sm text-gray-500">Avg Rating</p>
            </div>
          </div>
        </div>

        {/* Skills by Category */}
        <div className="space-y-4">
          {groupedSkills.map(category => {
            const categorySkills = DRIVING_SKILLS.filter(s => s.category === category.key)
            const isExpanded = expandedCategory === category.key
            const ratedCount = categorySkills.filter(s => {
              const skill = skills.find(sk => sk.skill_key === s.key)
              return skill && skill.instructor_rating > 0
            }).length

            return (
              <div key={category.key} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <button
                  onClick={() => setExpandedCategory(isExpanded ? null : category.key)}
                  className="w-full flex items-center justify-between p-5 bg-gray-50 hover:bg-gray-100 transition"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{category.icon}</span>
                    <div className="text-left">
                      <p className="font-semibold text-lg">{category.name}</p>
                      <p className="text-sm text-gray-500">{ratedCount}/{categorySkills.length} skills rated</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {/* Mini progress dots */}
                    <div className="flex gap-1.5">
                      {categorySkills.map(skill => {
                        const rating = getSkillValue(skill.key, 'best')
                        return (
                          <div
                            key={skill.key}
                            className={`w-3 h-3 rounded-full ${
                              rating >= 4 ? 'bg-green-500' :
                              rating >= 2 ? 'bg-yellow-500' :
                              rating > 0 ? 'bg-orange-500' :
                              'bg-gray-300'
                            }`}
                            title={skill.name}
                          />
                        )
                      })}
                    </div>
                    <span className="text-gray-400 text-xl">{isExpanded ? '▲' : '▼'}</span>
                  </div>
                </button>

                {isExpanded && (
                  <div className="p-5 space-y-4">
                    {categorySkills.map(skill => {
                      const selfRating = getSkillValue(skill.key, 'self')
                      const instructorRating = getSkillValue(skill.key, 'instructor')

                      return (
                        <div key={skill.key} className="border rounded-xl p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{skill.icon}</span>
                              <div>
                                <p className="font-semibold">{skill.name}</p>
                                <p className="text-sm text-gray-500">{skill.description}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className={`text-2xl font-bold ${
                                instructorRating >= 4 ? 'text-green-600' :
                                instructorRating >= 2 ? 'text-yellow-600' :
                                instructorRating > 0 ? 'text-orange-600' :
                                'text-gray-400'
                              }`}>
                                {instructorRating > 0 ? `${instructorRating}/5` : '—'}
                              </p>
                              <p className="text-xs text-gray-400">
                                {instructorRating > 0 ? 'Instructor' : 'Not rated'}
                              </p>
                            </div>
                          </div>

                          {/* Progress bar */}
                          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all ${
                                instructorRating >= 4 ? 'bg-green-500' : 
                                instructorRating >= 2 ? 'bg-yellow-500' : 
                                instructorRating > 0 ? 'bg-orange-500' : 'bg-gray-300'
                              }`}
                              style={{ width: `${(instructorRating / 5) * 100}%` }}
                            />
                          </div>

                          {/* Self assessment indicator */}
                          {selfRating > 0 && selfRating !== instructorRating && (
                            <div className="mt-2 flex items-center gap-2 text-xs text-blue-600">
                              <span>Your self-assessment: {selfRating}/5</span>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Empty State */}
        {skills.length === 0 && (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-xl font-semibold mb-2">No Skills Yet</h3>
            <p className="text-gray-600">
              Complete some lessons with your instructor to see your skill ratings here.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
