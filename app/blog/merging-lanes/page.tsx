'use client'

import Link from 'next/link'
import Navbar from '@/components/Navbar'

export default function MergingLanesArticle() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="mb-8">
          <Link href="/blog" className="inline-flex items-center gap-2 text-primary hover:underline mb-6">
            ← Back to Blog
          </Link>
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
            <span>📅 March 20, 2026</span>
            <span>•</span>
            <span>⏱️ 5 min read</span>
            <span>•</span>
            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">Skills</span>
          </div>
        </div>

        <article className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <h1 className="text-4xl font-bold mb-6" data-aos="fade-up">Merging Lanes Safely: A Step-by-Step Guide</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 text-lg mb-8" data-aos="fade-up" data-aos-delay="100">
              Lane merging is one of the most anxiety-inducing maneuvers for new drivers. Whether you're joining a motorway or navigating a busy interchange, mastering safe merging technique is essential for confident driving.
            </p>

            <div className="mb-10" data-aos="fade-up" data-aos-delay="200">
              <h2 className="text-2xl font-bold mb-4">Why Merging Is Challenging</h2>
              <p>Merging requires you to:</p>
              <ul className="space-y-2 mt-3">
                <li>✅ Assess gaps in traffic accurately</li>
                <li>✅ Match the speed of surrounding vehicles</li>
                <li>✅ Communicate your intentions clearly</li>
                <li>✅ Execute the maneuver smoothly</li>
                <li>✅ Remain calm under pressure</li>
              </ul>
              <p className="mt-4 text-gray-600">The key to successful merging is <strong>planning ahead</strong> and <strong>assertiveness</strong> — not aggression.</p>
            </div>

            <div className="mb-10" data-aos="fade-up" data-aos-delay="300">
              <h2 className="text-2xl font-bold mb-4">The Zipper Merge Technique</h2>
              <p>The zipper merge is the recommended technique for merging in heavy traffic. It reduces congestion and is fairer to all drivers.</p>
              
              <div className="bg-blue-50 rounded-xl p-6 mt-4">
                <h3 className="text-xl font-bold mb-3">How to Zipper Merge:</h3>
                <ol className="space-y-3">
                  <li><strong>1. Stay in your lane</strong> until you reach the merge point</li>
                  <li><strong>2. Use both lanes</strong> — it's not "cutting in line" when done correctly</li>
                  <li><strong>3. Alternate</strong> — one car from each lane merges in turn</li>
                  <li><strong>4. Leave space</strong> — create room for others to merge</li>
                  <li><strong>5. Be patient</strong> — the zipper works best when everyone cooperates</li>
                </ol>
              </div>
            </div>

            <div className="mb-10" data-aos="fade-up" data-aos-delay="400">
              <h2 className="text-2xl font-bold mb-4">Step-by-Step Motorway Merging</h2>
              
              <div className="space-y-6">
                <div className="bg-green-50 rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-3">Step 1: Prepare Early</h3>
                  <ul className="space-y-2">
                    <li>• Move to the merging lane well before the merge point</li>
                    <li>• Use your indicator 3-5 seconds before merging</li>
                    <li>• Check your mirrors frequently as you approach</li>
                    <li>• Look for a gap in traffic</li>
                  </ul>
                </div>

                <div className="bg-purple-50 rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-3">Step 2: Match the Speed</h3>
                  <ul className="space-y-2">
                    <li>• Accelerate to match the speed of traffic in the target lane</li>
                    <li>• Aim for a speed slightly faster than the lane you're merging into</li>
                    <li>• Never slow down dramatically — this causes rear-end collisions</li>
                    <li>• If traffic is moving slowly, you can still merge slowly</li>
                  </ul>
                </div>

                <div className="bg-yellow-50 rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-3">Step 3: Find the Gap</h3>
                  <ul className="space-y-2">
                    <li>• Look for a gap of at least 2-3 car lengths</li>
                    <li>• The gap should be in front of you, not behind</li>
                    <li>• If no gap exists, slow slightly and wait</li>
                    <li>• Don't force your way in — it's dangerous and inconsiderate</li>
                  </ul>
                </div>

                <div className="bg-red-50 rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-3">Step 4: Execute the Merge</h3>
                  <ul className="space-y-2">
                    <li>• Merge at a slight angle (not 90 degrees)</li>
                    <li>• Keep your steering smooth and controlled</li>
                    <li>• Don't brake during the merge</li>
                    <li>• Once merged, cancel your indicator</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mb-10" data-aos="fade-up" data-aos-delay="500">
              <h2 className="text-2xl font-bold mb-4">Common Merging Mistakes</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-xl p-5">
                  <h3 className="font-bold mb-2 text-red-700">❌ Merging Too Slowly</h3>
                  <p className="text-gray-600">Driving significantly below traffic speed creates dangerous situations and causes congestion.</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-5">
                  <h3 className="font-bold mb-2 text-red-700">❌ Stopping at the Merge Point</h3>
                  <p className="text-gray-600">Coming to a complete stop blocks the zipper pattern and creates frustration for others.</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-5">
                  <h3 className="font-bold mb-2 text-red-700">❌ Cutting Off Other Drivers</h3>
                  <p className="text-gray-600">Forcing your way in without adequate space is dangerous and can cause accidents.</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-5">
                  <h3 className="font-bold mb-2 text-red-700">❌ Not Using Your Indicator</h3>
                  <p className="text-gray-600">Failing to signal means other drivers can't anticipate your move.</p>
                </div>
              </div>
            </div>

            <div className="mb-10" data-aos="fade-up" data-aos-delay="600">
              <h2 className="text-2xl font-bold mb-4">Tips for Nervous Mergers</h2>
              <div className="bg-indigo-50 rounded-xl p-6">
                <ul className="space-y-3">
                  <li>💪 <strong>Practice makes progress</strong> — Start with quieter roads and work up to busier motorways</li>
                  <li>💪 <strong>Plan your merge</strong> — Don't wait until the last second to look for gaps</li>
                  <li>💪 <strong>Trust your skills</strong> — You've learned the technique, now believe in yourself</li>
                  <li>💪 <strong>It's okay to wait</strong> — If there's no safe gap, slow down and wait for one</li>
                  <li>💪 <strong>Other drivers expect you to merge</strong> — They're watching for merging traffic too</li>
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 mt-12" data-aos="fade-up" data-aos-delay="700">
              <h2 className="text-2xl font-bold mb-4">Practice Makes Perfect</h2>
              <p className="mb-4">Merging confidently takes practice. During your driving lessons, we'll work on merging techniques in various traffic conditions to build your skills and confidence.</p>
              <p className="font-semibold">Remember: Merging is a cooperation between drivers. Be patient, signal early, and match the speed of traffic.</p>
            </div>
          </div>
        </article>

        <div className="mt-12 text-center">
          <Link
            href="/book"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-semibold rounded-xl hover:bg-secondary transition hover-lift"
          >
            📅 Book a Lesson to Practice Merging
          </Link>
          <p className="mt-4 text-gray-600">
            Want to master lane merging and other essential skills? Book a lesson today!
          </p>
        </div>
      </div>
    </div>
  )
}
