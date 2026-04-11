'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'

type AuthMode = 'signin' | 'create'

export default function StudentLoginPage() {
  const [email, setEmail] = useState('')
  const [step, setStep] = useState<'mode' | 'email' | 'otp'>('mode')
  const [mode, setMode] = useState<AuthMode>('signin')
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // Check if already logged in
  useEffect(() => {
    const loggedIn = document.cookie.includes('sb-logged-in')
    if (loggedIn) {
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

      // Account created or existing - redirect to dashboard
      const params = new URLSearchParams(window.location.search)
      const redirect = params.get('redirect') || '/student/dashboard'
      window.location.href = redirect
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

  const handleModeSelect = (selectedMode: AuthMode) => {
    setMode(selectedMode)
    setStep('email')
  }

  const handleBack = () => {
    setStep('mode')
    setEmail('')
    setOtp('')
    setError('')
    setSuccess('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      
      <div className="max-w-md mx-auto px-4 py-16">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-secondary p-6 text-center">
            <div className="text-4xl mb-2">{mode === 'signin' ? '👋' : '✨'}</div>
            <h1 className="text-2xl font-bold text-white mb-1">
              {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-blue-100 text-sm">
              {mode === 'signin' 
                ? 'Sign in to view and manage your bookings' 
                : 'Create an account to book lessons and track progress'}
            </p>
          </div>
          
          {/* Mode Selection */}
          {step === 'mode' && (
            <div className="p-6 space-y-4">
              <p className="text-gray-600 text-center text-sm mb-4">
                Choose how you want to continue
              </p>
              
              <button
                onClick={() => handleModeSelect('signin')}
                className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-primary hover:bg-blue-50 transition text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🔐</span>
                  <div>
                    <p className="font-semibold text-gray-900">Sign In</p>
                    <p className="text-sm text-gray-500">Existing account — view your bookings</p>
                  </div>
                </div>
              </button>
              
              <button
                onClick={() => handleModeSelect('create')}
                className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-primary hover:bg-blue-50 transition text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">✨</span>
                  <div>
                    <p className="font-semibold text-gray-900">Create Account</p>
                    <p className="text-sm text-gray-500">New here? Create an account to get started</p>
                  </div>
                </div>
              </button>

              <div className="pt-4 border-t border-gray-100 text-center">
                <p className="text-sm text-gray-500">
                  Or{' '}
                  <Link href="/book" className="text-primary font-medium hover:underline">
                    book a lesson
                  </Link>{' '}
                  — you can create an account during checkout.
                </p>
              </div>
            </div>
          )}

          {/* Email Form */}
          {step === 'email' && (
            <div className="p-6">
              <button
                onClick={handleBack}
                className="text-sm text-gray-500 hover:text-gray-700 mb-4 flex items-center gap-1"
              >
                ← Back
              </button>
              
              <form onSubmit={handleSendOTP} className="space-y-4">
                <div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-0 text-center"
                  />
                </div>

                {error && (
                  <div className="bg-red-50 text-red-600 text-sm px-4 py-2 rounded-lg text-center">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="bg-green-50 text-green-600 text-sm px-4 py-2 rounded-lg text-center">
                    {success}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-primary text-white font-semibold rounded-xl hover:bg-secondary transition disabled:opacity-50"
                >
                  {loading ? 'Sending...' : 'Send Login Code'}
                </button>
              </form>
            </div>
          )}

          {/* OTP Form */}
          {step === 'otp' && (
            <div className="p-6">
              <button
                onClick={handleBack}
                className="text-sm text-gray-500 hover:text-gray-700 mb-4 flex items-center gap-1"
              >
                ← Back
              </button>
              
              <form onSubmit={handleVerifyOTP} className="space-y-4">
                <div className="text-center mb-2">
                  <p className="text-green-600 font-medium">✓ Code sent!</p>
                  <p className="text-gray-500 text-sm">Check your email (and spam folder)</p>
                </div>

                <div>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="● ● ● ● ● ●"
                    maxLength={6}
                    required
                    className="w-full py-4 border-2 border-gray-200 rounded-xl text-center text-2xl tracking-[0.5em] focus:border-primary focus:ring-0"
                  />
                </div>

                {error && (
                  <div className="bg-red-50 text-red-600 text-sm px-4 py-2 rounded-lg text-center">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || otp.length < 6}
                  className="w-full py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition disabled:opacity-50"
                >
                  {loading ? 'Verifying...' : mode === 'signin' ? 'Verify & Login' : 'Verify & Create Account'}
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={loading}
                    className="text-sm text-gray-500 hover:text-gray-700 py-2"
                  >
                    Didn't receive it? Resend code
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
