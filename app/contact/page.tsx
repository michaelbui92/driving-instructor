'use client'

import { useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      setSuccess(true)
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      })
    } catch (err) {
      setError('Failed to send message. Please try again or contact me directly.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6" data-aos="fade-up">
              Get in Touch
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8" data-aos="fade-up" data-aos-delay="100">
              Have questions about driving lessons? Ready to book? I'm here to help!
            </p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8" data-aos="fade-right">
            <h2 className="text-3xl font-bold mb-6">Send a Message</h2>
            
            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                Message sent successfully! I'll get back to you within 24 hours.
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="John Smith"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="0412 345 678"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Select a subject</option>
                    <option value="booking">Booking Inquiry</option>
                    <option value="pricing">Pricing Question</option>
                    <option value="test">Driving Test</option>
                    <option value="area">Service Area</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  placeholder="Tell me about your driving goals, preferred times, or any questions you have..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-4 bg-primary text-white font-semibold rounded-lg hover:bg-secondary transition disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-8" data-aos="fade-left">
            {/* Contact Cards */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">📞</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Phone</h4>
                    <a href="tel:+61412345678" className="text-primary hover:underline text-lg">
                      0412 345 678
                    </a>
                    <p className="text-gray-600 text-sm mt-1">Call or text - I respond quickly!</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">✉️</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Email</h4>
                    <a href="mailto:hello@drivewithbui.com" className="text-primary hover:underline">
                      hello@drivewithbui.com
                    </a>
                    <p className="text-gray-600 text-sm mt-1">Response within 24 hours</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">📍</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Service Area</h4>
                    <p className="text-gray-700">Western Sydney</p>
                    <p className="text-gray-600 text-sm mt-1">Lidcombe, Parramatta, Bankstown, Liverpool, Campbelltown, Blacktown, Penrith</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">⏰</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Hours</h4>
                    <p className="text-gray-700">Monday - Sunday: 7:00 AM - 9:00 PM</p>
                    <p className="text-gray-600 text-sm mt-1">Flexible scheduling available</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Booking CTA */}
            <div className="bg-gradient-to-br from-primary to-secondary rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Ready to Start Driving?</h3>
              <p className="mb-6 opacity-90">
                Book your first lesson online in just 2 minutes. No phone call needed!
              </p>
              <Link
                href="/book"
                className="inline-block px-6 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-gray-100 transition"
              >
                Book Online Now
              </Link>
            </div>

            {/* FAQ Link */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-bold mb-4">Common Questions</h3>
              <p className="text-gray-600 mb-4">
                Check our FAQ for answers to common questions about lessons, pricing, and requirements.
              </p>
              <Link
                href="/faq"
                className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
              >
                View FAQ
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Map & Location */}
        <div className="mt-12 bg-white rounded-2xl shadow-xl p-8" data-aos="fade-up">
          <h3 className="text-2xl font-bold mb-6">Service Area Map</h3>
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 text-center">
            <div className="text-8xl mb-6">🗺️</div>
            <h4 className="text-xl font-bold mb-2">Western Sydney Coverage</h4>
            <p className="text-gray-600 mb-4">
              I service all of Western Sydney with free pickup within 20km of Lidcombe.
            </p>
            <div className="inline-flex flex-wrap gap-2 justify-center">
              <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full font-medium">Lidcombe</span>
              <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full font-medium">Parramatta</span>
              <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full font-medium">Bankstown</span>
              <span className="px-4 py-2 bg-orange-100 text-orange-700 rounded-full font-medium">Liverpool</span>
              <span className="px-4 py-2 bg-red-100 text-red-700 rounded-full font-medium">Campbelltown</span>
              <span className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full font-medium">Blacktown</span>
              <span className="px-4 py-2 bg-pink-100 text-pink-700 rounded-full font-medium">Penrith</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
