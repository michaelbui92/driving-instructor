'use client'

import Link from 'next/link'
import Navbar from '@/components/Navbar'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
          <p className="text-gray-600 mb-8">Last updated: March 29, 2026</p>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4">1. Information We Collect</h2>
              <div className="space-y-3 text-gray-600">
                <p><strong>1.1 Personal Information:</strong> When you book a lesson, we collect:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Full name</li>
                  <li>Email address</li>
                  <li>Phone number</li>
                  <li>Residential address (for pickup)</li>
                  <li>Driving licence details</li>
                </ul>
                <p><strong>1.2 Booking Information:</strong> Lesson dates, times, locations, and payment details.</p>
                <p><strong>1.3 Communication:</strong> Emails, messages, and feedback you send us.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">2. How We Use Your Information</h2>
              <div className="space-y-3 text-gray-600">
                <p><strong>2.1 Service Delivery:</strong> To schedule and conduct driving lessons.</p>
                <p><strong>2.2 Communication:</strong> To send booking confirmations, reminders, and updates.</p>
                <p><strong>2.3 Safety:</strong> To verify your identity and driving eligibility.</p>
                <p><strong>2.4 Improvement:</strong> To improve our services and customer experience.</p>
                <p><strong>2.5 Legal Compliance:</strong> To meet regulatory requirements.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">3. Data Storage & Security</h2>
              <div className="space-y-3 text-gray-600">
                <p><strong>3.1 Storage:</strong> Your data is stored securely in Australia using Supabase cloud services.</p>
                <p><strong>3.2 Security:</strong> We implement industry-standard security measures to protect your data.</p>
                <p><strong>3.3 Retention:</strong> We retain your data for as long as necessary to provide our services, or as required by law.</p>
                <p><strong>3.4 Payment:</strong> Payment information is processed securely through our payment provider. We do not store full credit card details.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">4. Sharing Your Information</h2>
              <div className="space-y-3 text-gray-600">
                <p><strong>4.1 Service Providers:</strong> We may share information with trusted third parties who assist with:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Payment processing</li>
                  <li>Email communication</li>
                  <li>Website hosting</li>
                </ul>
                <p><strong>4.2 Legal Requirements:</strong> We may disclose information if required by law or to protect our rights.</p>
                <p><strong>4.3 Never Sold:</strong> We do not sell your personal information to third parties.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">5. Your Rights</h2>
              <div className="space-y-3 text-gray-600">
                <p><strong>5.1 Access:</strong> You can request access to your personal information.</p>
                <p><strong>5.2 Correction:</strong> You can request corrections to inaccurate information.</p>
                <p><strong>5.3 Deletion:</strong> You can request deletion of your personal information, subject to legal requirements.</p>
                <p><strong>5.4 Opt-Out:</strong> You can opt out of marketing communications at any time.</p>
                <p><strong>5.5 Complaints:</strong> You can lodge a complaint with the Office of the Australian Information Commissioner.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">6. Cookies & Tracking</h2>
              <div className="space-y-3 text-gray-600">
                <p><strong>6.1 Cookies:</strong> Our website uses cookies to improve your experience and remember your preferences.</p>
                <p><strong>6.2 Analytics:</strong> We may use analytics tools to understand how our website is used.</p>
                <p><strong>6.3 Control:</strong> You can control cookies through your browser settings.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">7. Children's Privacy</h2>
              <div className="space-y-3 text-gray-600">
                <p><strong>7.1 Age Limit:</strong> Our services are for individuals aged 16 years and older (NSW learner permit age).</p>
                <p><strong>7.2 Parental Consent:</strong> For students under 18, we may require parental consent for certain activities.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">8. Changes to This Policy</h2>
              <div className="space-y-3 text-gray-600">
                <p><strong>8.1 Updates:</strong> We may update this policy periodically. The latest version will always be available on our website.</p>
                <p><strong>8.2 Notification:</strong> Significant changes will be communicated to you via email.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">9. Contact Us</h2>
              <div className="space-y-3 text-gray-600">
                <p>If you have questions about this Privacy Policy or your personal information:</p>
                <p><strong>Email:</strong> michael@drivewithbui.com</p>
                <p><strong>Website:</strong> <Link href="/contact" className="text-primary hover:underline">Contact Form</Link></p>
                <p><strong>Mail:</strong> Drive With Bui, Lidcombe NSW 2141, Australia</p>
              </div>
            </section>

            <div className="pt-8 border-t">
              <p className="text-gray-600">
                By using our website and services, you consent to the collection and use of your information as described in this Privacy Policy.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-secondary transition"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}