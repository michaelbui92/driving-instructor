'use client'

import { useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      
      if (!res.ok) {
        throw new Error('Failed to send message')
      }
      
      setSuccess(true)
      setForm({ name: '', email: '', phone: '', message: '' })
    } catch (err) {
      setError('Failed to send message. Please try again or contact directly.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-4">Get in Touch</h1>
        <p className="text-center text-gray-600 mb-12">Have questions? Send me a message and I'll get back to you soon.</p>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="text-2xl">📍</div>
                <div>
                  <h3 className="font-semibold">Location</h3>
                  <p className="text-gray-600">Lidcombe Area, Sydney NSW</p>
                  <p className="text-gray-500 text-sm">Pickup & drop-off available</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="text-2xl">✉️</div>
                <div>
                  <h3 className="font-semibold">Email</h3>
                  <a href="mailto:drivewithbui@agentmail.to" className="text-primary hover:underline">drivewithbui@agentmail.to</a>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="text-2xl">📱</div>
                <div>
                  <h3 className="font-semibold">Phone</h3>
                  <p className="text-gray-600">Message via email for fastest response</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="text-2xl">🕐</div>
                <div>
                  <h3 className="font-semibold">Availability</h3>
                  <p className="text-gray-600">Weekdays: 9am - 8pm</p>
                  <p className="text-gray-600">Weekends: 8am - 7pm</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="text-2xl">📸</div>
                <div>
                  <h3 className="font-semibold">Instagram</h3>
                  <a href="https://instagram.com/DriveWithBui" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">@DriveWithBui</a>
                  <p className="text-gray-500 text-sm">Follow for driving tips!</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Send a Message</h2>
            
            {success ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">✅</div>
                <h3 className="text-xl font-bold mb-2">Message Sent!</h3>
                <p className="text-gray-600 mb-6">I'll get back to you as soon as possible.</p>
                <button
                  onClick={() => setSuccess(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Your name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="your@email.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone (optional)</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="0412 345 678"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    required
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    placeholder="How can I help you?"
                  />
                </div>
                
                {error && (
                  <p className="text-red-500 text-sm">{error}</p>
                )}
                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-primary text-white rounded-xl font-semibold hover:bg-secondary transition disabled:opacity-50"
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
