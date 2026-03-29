'use client'

import Link from 'next/link'
import Navbar from '@/components/Navbar'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <h1 className="text-4xl font-bold mb-8">Terms & Conditions</h1>
          <p className="text-gray-600 mb-8">Last updated: March 29, 2026</p>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4">1. Booking & Payment</h2>
              <div className="space-y-3 text-gray-600">
                <p><strong>1.1 Booking Confirmation:</strong> All bookings are confirmed upon receipt of payment or instructor approval.</p>
                <p><strong>1.2 Payment:</strong> Payment is due at the time of booking unless otherwise arranged with the instructor.</p>
                <p><strong>1.3 Lesson Duration:</strong> All lessons are 60 minutes unless otherwise specified.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">2. Cancellation & Rescheduling</h2>
              <div className="space-y-3 text-gray-600">
                <p><strong>2.1 Cancellation Policy:</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>More than 24 hours notice: Full refund or reschedule</li>
                  <li>Less than 24 hours notice: 50% cancellation fee applies</li>
                  <li>No-show or less than 2 hours notice: No refund</li>
                </ul>
                <p><strong>2.2 Rescheduling:</strong> Free rescheduling with more than 24 hours notice. Less than 24 hours may incur a fee.</p>
                <p><strong>2.3 Instructor Cancellation:</strong> If the instructor cancels, you will receive a full refund or option to reschedule.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">3. Student Requirements</h2>
              <div className="space-y-3 text-gray-600">
                <p><strong>3.1 Licence:</strong> You must hold a valid NSW learner's permit or equivalent.</p>
                <p><strong>3.2 Age:</strong> Minimum age 16 years (NSW learner permit requirements).</p>
                <p><strong>3.3 Health:</strong> You must disclose any medical conditions that may affect your ability to drive safely.</p>
                <p><strong>3.4 Sobriety:</strong> No alcohol or drugs may be consumed before or during lessons.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">4. Lesson Conduct</h2>
              <div className="space-y-3 text-gray-600">
                <p><strong>4.1 Safety:</strong> The instructor has the right to terminate any lesson immediately if safety is compromised.</p>
                <p><strong>4.2 Behaviour:</strong> Respectful behaviour is required at all times. Aggressive or abusive behaviour will result in lesson termination without refund.</p>
                <p><strong>4.3 Personal Items:</strong> You are responsible for your personal belongings during lessons.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">5. Liability & Insurance</h2>
              <div className="space-y-3 text-gray-600">
                <p><strong>5.1 Insurance:</strong> The instructor's vehicle is fully insured for driving instruction purposes.</p>
                <p><strong>5.2 Accidents:</strong> In the event of an accident, the instructor's insurance will cover damage to the instructor's vehicle.</p>
                <p><strong>5.3 Personal Injury:</strong> Personal injury is covered by the instructor's insurance as per NSW regulations.</p>
                <p><strong>5.4 Third-Party Damage:</strong> Damage to other vehicles or property is covered by the instructor's insurance.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">6. Data Protection</h2>
              <div className="space-y-3 text-gray-600">
                <p><strong>6.1 Privacy:</strong> Your personal information is protected as per our Privacy Policy.</p>
                <p><strong>6.2 Communication:</strong> We may contact you regarding your bookings, lesson reminders, or service updates.</p>
                <p><strong>6.3 Marketing:</strong> You may opt out of marketing communications at any time.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">7. General</h2>
              <div className="space-y-3 text-gray-600">
                <p><strong>7.1 Changes:</strong> These terms may be updated periodically. Continued use of our services constitutes acceptance of updated terms.</p>
                <p><strong>7.2 Governing Law:</strong> These terms are governed by the laws of New South Wales, Australia.</p>
                <p><strong>7.3 Contact:</strong> For questions about these terms, contact us through our website.</p>
              </div>
            </section>

            <div className="pt-8 border-t">
              <p className="text-gray-600">
                By booking a lesson with Drive With Bui, you agree to these Terms & Conditions.
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