'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'

export default function StudentLoginPage() {
  const [email, setEmail] = useState('')
  const [step, setStep] = useState<'email' | 'otp' | 'loading'>('email')
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // Check if already logged in
  useEffect(() => {
    const loggedIn = document.cookie.includes('sb-logged-in')
    if (loggedIn) {
      // Check for redirect param
      const params = new URLSearchParams(window.location.search)
      const redirect = params.get('redirect')
      router.push(redirect || '/student/dashboard')
    }
  }, [router])

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const res = await fetch('/api/student-auth/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to send login code')
        setLoading(false)
        return
      }

      setSuccess('Login code sent! Check your email.')
      setStep('otp')
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/student-auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: otp }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Invalid login code')
        setLoading(false)
        return
      }

      // Redirect immediately - don't wait for details check
      // Also set email cookie so Navbar shows it without needing another API call
      document.cookie = `sb-email=${encodeURIComponent(email)}; path=/; max-age=${60 * 60 * 24 * 7}`
      document.cookie = `sb-logged-in=true; path=/; max-age=${60 * 60 * 24 * 7}`
      const params = new URLSearchParams(window.location.search)
      router.push(params.get('redirect') || '/student/dashboard')
    } catch (err) {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setSuccess('')
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/student-auth/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to resend code')
      } else {
        setSuccess('New login code sent!')
      }
    } catch (err) {
      setError('Failed to resend code')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Student Portal
          </h1>
          <p className="text-gray-600">
            {step === 'email'
              ? 'Enter your email to access your bookings'
              : 'Enter the login code from your email'}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          {step === 'email' && (
            <form onSubmit={handleSendOTP} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
              </div>

              {error && (
                <p className="text-red-500 text-sm">{error}</p>
              )}
              {success && (
                <p className="text-green-500 text-sm">{success}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send Login Code'}
              </button>
              
              <div className="text-center">
                <button
                  type="button"
                  onClick={async () => {
                    if (!email) {
                      setError('Please enter your email first')
                      return
                    }
                    setError('')
                    setLoading(true)
                    
                    // Skip OTP - just create a mock session for this email
                    // In production, this would require proper verification
                    try {
                      // For now, just set a cookie and redirect
                      document.cookie = `sb-email=${encodeURIComponent(email)}; path=/; max-age=86400`
                      document.cookie = 'sb-logged-in=true; path=/; max-age=86400'
                      
                      const params = new URLSearchParams(window.location.search)
                      router.push(params.get('redirect') || '/student/dashboard')
                    } catch (err) {
                      setError('Failed to login. Please try again.')
                    } finally {
                      setLoading(false)
                    }
                  }}
                  disabled={loading}
                  className="text-sm text-gray-500 hover:text-gray-700 underline disabled:opacity-50"
                >
                  Skip for now (use email without verification)
                </button>
              </div>
            </form>
          )}

          {step === 'otp' && (
            <form onSubmit={handleVerifyOTP} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Login Code
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="123456"
                  maxLength={6}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-center text-2xl tracking-widest focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
                <p className="text-sm text-gray-500 mt-2 text-center">
                  Sent to: {email}
                </p>
              </div>

              {error && (
                <p className="text-red-500 text-sm">{error}</p>
              )}
              {success && (
                <p className="text-green-500 text-sm">{success}</p>
              )}

              <button
                type="submit"
                disabled={loading || otp.length < 6}
                className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Enter & Login'}
              </button>

              <div className="text-center space-y-2">
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={loading}
                  className="text-sm text-blue-600 hover:text-blue-700 disabled:opacity-50"
                >
                  Resend code
                </button>
                <span className="text-gray-300 mx-2">|</span>
                <button
                  type="button"
                  onClick={() => {
                    setStep('email')
                    setOtp('')
                    setError('')
                    setSuccess('')
                  }}
                  className="text-sm text-gray-600 hover:text-gray-700"
                >
                  Change email
                </button>
              </div>
            </form>
          )}

          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-sm text-gray-500 text-center">
              New student?{' '}
              <Link href="/book" className="text-blue-600 hover:underline">
                Book a lesson
              </Link>{' '}
              to get started.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
