'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface NavbarProps {
  showLocation?: boolean
}

export default function Navbar({ showLocation = true }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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
          <div className="hidden md:flex space-x-8 items-center">
            <Link href="/#services" className="text-gray-700 hover:text-primary transition font-medium">Services</Link>
            <Link href="/#pricing" className="text-gray-700 hover:text-primary transition font-medium">Pricing</Link>
            <Link href="/about" className="text-gray-700 hover:text-primary transition font-medium">About</Link>
            <Link href="/instructor-profile" className="text-gray-700 hover:text-primary transition font-medium">Instructor Profile</Link>
            <Link href="/blog" className="text-gray-700 hover:text-primary transition font-medium">Blog & Tips</Link>
            <Link href="/faq" className="text-gray-700 hover:text-primary transition font-medium">FAQ</Link>
            <Link href="/contact" className="text-gray-700 hover:text-primary transition font-medium">Contact</Link>
            <Link href="/dashboard" className="px-4 py-2 border-2 border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition font-medium">Student Portal</Link>
            <Link href="/instructor" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition font-medium">Instructor Portal</Link>
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

        {/* Mobile menu with slide animation */}
        <div className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${mobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="pb-4 space-y-1 pt-3">
            <Link href="/#services" onClick={handleLinkClick} className="block px-4 py-3.5 text-gray-800 hover:text-primary hover:bg-blue-50 rounded-lg transition-all duration-200 active:scale-95 active:bg-blue-100 font-medium">Services</Link>
            <Link href="/#pricing" onClick={handleLinkClick} className="block px-4 py-3.5 text-gray-800 hover:text-primary hover:bg-blue-50 rounded-lg transition-all duration-200 active:scale-95 active:bg-blue-100 font-medium">Pricing</Link>
            <Link href="/about" onClick={handleLinkClick} className="block px-4 py-3.5 text-gray-800 hover:text-primary hover:bg-blue-50 rounded-lg transition-all duration-200 active:scale-95 active:bg-blue-100 font-medium">About</Link>
            <Link href="/instructor-profile" onClick={handleLinkClick} className="block px-4 py-3.5 text-gray-800 hover:text-primary hover:bg-blue-50 rounded-lg transition-all duration-200 active:scale-95 active:bg-blue-100 font-medium">Instructor Profile</Link>
            <Link href="/blog" onClick={handleLinkClick} className="block px-4 py-3.5 text-gray-800 hover:text-primary hover:bg-blue-50 rounded-lg transition-all duration-200 active:scale-95 active:bg-blue-100 font-medium">Blog & Tips</Link>
            <Link href="/faq" onClick={handleLinkClick} className="block px-4 py-3.5 text-gray-800 hover:text-primary hover:bg-blue-50 rounded-lg transition-all duration-200 active:scale-95 active:bg-blue-100 font-medium">FAQ</Link>
            <Link href="/contact" onClick={handleLinkClick} className="block px-4 py-3.5 text-gray-800 hover:text-primary hover:bg-blue-50 rounded-lg transition-all duration-200 active:scale-95 active:bg-blue-100 font-medium">Contact</Link>
            
            <div className="pt-2 space-y-2">
              <Link href="/dashboard" onClick={handleLinkClick} className="block px-4 py-3 border-2 border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-all duration-200 active:scale-95 font-medium text-center">Student Portal</Link>
              <Link href="/instructor" onClick={handleLinkClick} className="block px-4 py-3 bg-primary text-white rounded-lg hover:bg-secondary transition-all duration-200 active:scale-95 font-medium text-center">Instructor Portal</Link>
            </div>
            
            {showLocation && (
              <div className="px-4 py-4 text-sm text-gray-600 border-t border-gray-200 mt-4 pt-4 bg-gray-50 rounded-lg">
                <div className="flex items-center mb-2">
                  <svg className="w-5 h-5 mr-2 text-primary" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                  <span className="font-semibold text-gray-800">📍 Lidcombe Area</span>
                </div>
                <p className="text-gray-600 pl-7">Serving Lidcombe, Auburn, Berala, Regents Park & surrounding suburbs</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}