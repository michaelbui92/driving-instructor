'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface NavbarProps {
  showLocation?: boolean
}

export default function Navbar({ showLocation = true }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [studentDropdownOpen, setStudentDropdownOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const [darkMode, setDarkMode] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Initialize dark mode
  useEffect(() => {
    // Check localStorage for dark mode preference
    const savedDarkMode = localStorage.getItem('darkMode') === 'true'
    // Check system preference
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    const initialDarkMode = savedDarkMode || systemPrefersDark
    setDarkMode(initialDarkMode)
    
    if (initialDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    localStorage.setItem('darkMode', newDarkMode.toString())
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  // Check auth status and get email
  useEffect(() => {
    const getCookie = (name: string) => {
      const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
      return match ? decodeURIComponent(match[2]) : null
    }

    const checkAuth = async () => {
      // First check the basic cookie
      const hasLoginCookie = getCookie('sb-logged-in')
      
      if (hasLoginCookie) {
        // Verify session is still valid by calling the API
        try {
          const res = await fetch('/api/student/me', {
            method: 'GET',
            credentials: 'include'
          })
          
          const data = await res.json()
          
          if (data.authenticated) {
            setIsLoggedIn(true)
            const email = data.email
            if (email) {
              setUserEmail(email)
              // Ensure email cookie is set for cross-page persistence
              if (!document.cookie.includes('sb-email')) {
                document.cookie = `sb-email=${encodeURIComponent(email)}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=lax`
              }
            } else {
              // Fallback to cookie email
              const cookieEmail = getCookie('sb-email')
              if (cookieEmail) setUserEmail(cookieEmail)
            }
          } else {
            // Session invalid/expired - clear cookies and show login
            setIsLoggedIn(false)
            setUserEmail('')
            document.cookie = 'sb-logged-in=; path=/; max-age=0; SameSite=lax'
            document.cookie = 'sb-email=; path=/; max-age=0; SameSite=lax'
          }
        } catch {
          // Network error - assume logged in if cookie exists
          setIsLoggedIn(true)
        }
      } else {
        setIsLoggedIn(false)
        setUserEmail('')
        document.cookie = 'sb-logged-in=; path=/; max-age=0; SameSite=lax'
        document.cookie = 'sb-email=; path=/; max-age=0; SameSite=lax'
      }
    }
    
    checkAuth()
  }, [])

  // Close student dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setStudentDropdownOpen(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  // Close mobile menu when clicking outside or clicking a link
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (mobileMenuOpen && !target.closest('nav')) {
        setMobileMenuOpen(false)
      }
    }

    document.addEventListener('click', handleClickOutside)

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [mobileMenuOpen])

  const handleLinkClick = () => {
    setMobileMenuOpen(false)
    setStudentDropdownOpen(false)
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/student-auth/logout', { method: 'POST' })
      setIsLoggedIn(false)
      setUserEmail('')
      setStudentDropdownOpen(false)
      router.push('/student/login')
    } catch (err) {
      console.error('Logout error:', err)
    }
  }

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-primary hover:text-secondary transition">
              🚗 Drive With Bui
            </Link>
            {showLocation && (
              <span className="ml-2 text-sm text-gray-600 hidden md:inline">• Lidcombe Area</span>
            )}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-4 items-center">
            <Link href="/about" className="text-gray-700 hover:text-primary transition font-medium px-2 py-1">About</Link>
            <Link href="/blog" className="text-gray-700 hover:text-primary transition font-medium px-2 py-1">Blog</Link>
            <Link href="/faq" className="text-gray-700 hover:text-primary transition font-medium px-2 py-1">FAQ</Link>
            <Link href="/contact" className="text-gray-700 hover:text-primary transition font-medium px-2 py-1">Contact</Link>
            <div className="flex items-center gap-2 ml-2">
              {/* Student - show email if logged in */}
              {isLoggedIn ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setStudentDropdownOpen(!studentDropdownOpen)}
                    className="px-3 py-1.5 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition font-medium text-sm flex items-center gap-1 max-w-[200px]"
                  >
                    <span className="truncate">{userEmail || 'Student'}</span>
                    <svg className={`w-4 h-4 transition-transform ${studentDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {studentDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
                      <Link
                        href="/student/dashboard"
                        onClick={handleLinkClick}
                        className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-primary transition"
                      >
                        📊 Dashboard
                      </Link>
                      <Link
                        href="/student/skills"
                        onClick={handleLinkClick}
                        className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-primary transition"
                      >
                        📈 Skills
                      </Link>
                      <Link
                        href="/student/details"
                        onClick={handleLinkClick}
                        className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-primary transition"
                      >
                        👤 My Details
                      </Link>
                      <div className="border-t border-gray-100 my-1" />
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition"
                      >
                        🚪 Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/student/login"
                  className="px-3 py-1.5 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition font-medium text-sm"
                >
                  Student Login
                </Link>
              )}
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="flex items-center justify-center w-10 h-10 bg-white dark:bg-gray-800 rounded-full shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition ml-2"
                aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {darkMode ? (
                  <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 hover:text-primary focus:outline-none p-2"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${mobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="pb-4 space-y-1 pt-3">
            <Link href="/about" onClick={handleLinkClick} className="block px-4 py-3 text-gray-800 hover:text-primary hover:bg-blue-50 rounded-lg transition font-medium">About</Link>
            <Link href="/blog" onClick={handleLinkClick} className="block px-4 py-3 text-gray-800 hover:text-primary hover:bg-blue-50 rounded-lg transition font-medium">Blog</Link>
            <Link href="/faq" onClick={handleLinkClick} className="block px-4 py-3 text-gray-800 hover:text-primary hover:bg-blue-50 rounded-lg transition font-medium">FAQ</Link>
            <Link href="/contact" onClick={handleLinkClick} className="block px-4 py-3 text-gray-800 hover:text-primary hover:bg-blue-50 rounded-lg transition font-medium">Contact</Link>
            
            <div className="pt-3 space-y-2 border-t border-gray-200">
              {isLoggedIn ? (
                <>
                  <p className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider truncate">{userEmail}</p>
                  <Link href="/student/dashboard" onClick={handleLinkClick} className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-primary rounded-lg transition">📊 Dashboard</Link>
                  <Link href="/student/skills" onClick={handleLinkClick} className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-primary rounded-lg transition">📈 Skills</Link>
                  <Link href="/student/details" onClick={handleLinkClick} className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-primary rounded-lg transition">👤 My Details</Link>
                  <button
                    onClick={() => { handleLogout(); handleLinkClick(); }}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                  >
                    🚪 Logout
                  </button>
                </>
              ) : (
                <Link href="/student/login" onClick={handleLinkClick} className="block px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-center">Student Login</Link>
              )}

            </div>
            
            {/* Dark Mode Toggle for Mobile */}
            <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 mt-3 pt-3">
              <button
                onClick={toggleDarkMode}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {darkMode ? (
                  <>
                    <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700 dark:text-gray-300 font-medium">Switch to Light Mode</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                    </svg>
                    <span className="text-gray-700 dark:text-gray-300 font-medium">Switch to Dark Mode</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
