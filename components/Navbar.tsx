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
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Check auth status
  useEffect(() => {
    setIsLoggedIn(document.cookie.includes('sb-logged-in'))
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

          {/* Desktop Navigation - Simplified without dropdowns */}
          <div className="hidden md:flex space-x-4 items-center">
            <Link href="/#services" className="text-gray-700 hover:text-primary transition font-medium px-2 py-1">Services</Link>
            <Link href="/#pricing" className="text-gray-700 hover:text-primary transition font-medium px-2 py-1">Pricing</Link>
            <Link href="/about" className="text-gray-700 hover:text-primary transition font-medium px-2 py-1">About</Link>
            <Link href="/blog" className="text-gray-700 hover:text-primary transition font-medium px-2 py-1">Blog</Link>
            <Link href="/faq" className="text-gray-700 hover:text-primary transition font-medium px-2 py-1">FAQ</Link>
            <Link href="/contact" className="text-gray-700 hover:text-primary transition font-medium px-2 py-1">Contact</Link>
            <div className="flex space-x-2 ml-2">
              {/* Student Portal Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setStudentDropdownOpen(!studentDropdownOpen)}
                  className="px-3 py-1.5 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition font-medium text-sm flex items-center gap-1"
                >
                  Student Portal
                  <svg className={`w-4 h-4 transition-transform ${studentDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {studentDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
                    {isLoggedIn ? (
                      <>
                        <Link
                          href="/student/dashboard"
                          onClick={handleLinkClick}
                          className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-primary transition"
                        >
                          📊 Dashboard
                        </Link>
                        <div className="border-t border-gray-100 my-1" />
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition"
                        >
                          🚪 Logout
                        </button>
                      </>
                    ) : (
                      <Link
                        href="/student/login"
                        onClick={handleLinkClick}
                        className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-primary transition"
                      >
                        🔐 Login
                      </Link>
                    )}
                  </div>
                )}
              </div>
              <Link href="/instructor" className="px-3 py-1.5 bg-primary text-white rounded-lg hover:bg-secondary transition font-medium text-sm">Instructor Portal</Link>
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

        {/* Mobile menu with slide animation - Simplified */}
        <div className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${mobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="pb-4 space-y-1 pt-3">
            <Link href="/#services" onClick={handleLinkClick} className="block px-4 py-3 text-gray-800 hover:text-primary hover:bg-blue-50 rounded-lg transition font-medium">Services</Link>
            <Link href="/#pricing" onClick={handleLinkClick} className="block px-4 py-3 text-gray-800 hover:text-primary hover:bg-blue-50 rounded-lg transition font-medium">Pricing</Link>
            <Link href="/about" onClick={handleLinkClick} className="block px-4 py-3 text-gray-800 hover:text-primary hover:bg-blue-50 rounded-lg transition font-medium">About</Link>
            <Link href="/blog" onClick={handleLinkClick} className="block px-4 py-3 text-gray-800 hover:text-primary hover:bg-blue-50 rounded-lg transition font-medium">Blog</Link>
            <Link href="/faq" onClick={handleLinkClick} className="block px-4 py-3 text-gray-800 hover:text-primary hover:bg-blue-50 rounded-lg transition font-medium">FAQ</Link>
            <Link href="/contact" onClick={handleLinkClick} className="block px-4 py-3 text-gray-800 hover:text-primary hover:bg-blue-50 rounded-lg transition font-medium">Contact</Link>
            
            <div className="pt-3 space-y-2 border-t border-gray-200">
              <p className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Student Portal</p>
              <Link href="/student/dashboard" onClick={handleLinkClick} className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-primary rounded-lg transition">📊 Dashboard</Link>
              <Link href="/student/login" onClick={handleLinkClick} className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-primary rounded-lg transition">🔐 Login</Link>
              {isLoggedIn && (
                <button
                  onClick={() => { handleLogout(); handleLinkClick(); }}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  🚪 Logout
                </button>
              )}
              <Link href="/instructor" onClick={handleLinkClick} className="block px-4 py-3 bg-primary text-white rounded-lg hover:bg-secondary transition font-medium text-center">Instructor Portal</Link>
            </div>
            
            {showLocation && (
              <div className="px-4 py-3 text-sm text-gray-600 border-t border-gray-200 mt-3 pt-3">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-primary" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                  <span className="font-medium text-gray-800">📍 Lidcombe Area</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}