import Link from 'next/link'
import Navbar from '@/components/Navbar'

export const metadata = {
  title: 'The 3-Second Rule - Drive with Bui',
  description: 'Learn the 3-second following distance rule and the difference between safe stopping, rolling stops, and abrupt braking. Stay safe on NSW roads.',
}

export default function ThreeSecondRulePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      
      <article className="max-w-3xl mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link href="/blog" className="text-primary hover:underline text-sm">
            ← Back to Blog
          </Link>
        </div>

        {/* Header */}
        <header className="mb-10">
          <div className="bg-primary/10 text-primary text-sm font-semibold px-4 py-2 rounded-full inline-block mb-4">
            Safety Tips
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            The 3-Second Rule: How Much Space Do You Really Need?
          </h1>
          <p className="text-gray-600 text-lg">
            Understanding safe stopping distances and why rolling stops are dangerous
          </p>
        </header>

        {/* Featured Image */}
        <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl p-12 mb-10 text-center">
          <span className="text-6xl">⏱️</span>
          <p className="text-blue-800 mt-2">3 seconds — the difference between safe and sorry</p>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <p className="text-xl text-gray-700 mb-8 font-medium">
            One of the most common mistakes new drivers make is following too closely. Not because they're reckless — but because they don't know what a safe distance looks like. Let's fix that.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">What is the 3-Second Rule?</h2>
          <p className="text-gray-700 mb-6">
            The 3-second rule is a simple way to check if you're following at a safe distance:
          </p>
          <ol className="list-decimal list-inside text-gray-700 space-y-3 mb-8">
            <li>Watch the vehicle in front of you pass a fixed point (like a signpost or lamp post)</li>
            <li>Count "one thousand, two thousand, three thousand"</li>
            <li>If you pass the same point before finishing the count — you're following too closely</li>
          </ol>
          <p className="text-gray-700 mb-8">
            <strong>3 seconds gives you enough time to react</strong> if the car in front suddenly brakes. It's your "thinking distance" — the buffer that keeps you safe.
          </p>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-8 rounded-r-xl">
            <h3 className="font-bold text-yellow-800 mb-2">🚗 When to Increase It</h3>
            <p className="text-yellow-700 mb-3">In these conditions, increase to 4-5 seconds:</p>
            <ul className="list-disc list-inside text-yellow-700 space-y-1">
              <li>Wet or slippery roads (rain, leaves, gravel)</li>
              <li>Heavy traffic</li>
              <li>Night driving</li>
              <li>Driving behind motorcycles (they can stop faster)</li>
              <li>Poor visibility (fog, glare)</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Three Types of Stops</h2>
          <p className="text-gray-700 mb-6">
            Not all stops are equal. Here's what separates a safe stop from a dangerous one:
          </p>

          {/* Rolling Stop - Too Slow */}
          <div className="bg-white rounded-xl p-6 shadow-md mb-6 border-l-4 border-yellow-400">
            <div className="flex items-start gap-4">
              <span className="text-4xl">🐌</span>
              <div>
                <h3 className="font-bold text-xl text-gray-900 mb-2">
                  Rolling Stop (Too Slow)
                </h3>
                <p className="text-gray-700 mb-3">
                  <span className="text-yellow-600 font-semibold">⚠️ This is illegal</span> — but not for the reason you think
                </p>
                <p className="text-gray-700 mb-3">
                  A rolling stop is when you slow down but never fully stop. You coast through an intersection or stop sign without coming to a complete halt.
                </p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-3">
                  <p className="text-yellow-800 text-sm">
                    <strong>Why it's dangerous:</strong> Other road users expect you to stop completely. When you roll, they misjudge your intentions and might pull out in front of you.
                  </p>
                </div>
                <p className="text-gray-600 text-sm italic">
                  "I see learners do this all the time. You're not saving time — you're creating a dangerous situation."
                </p>
              </div>
            </div>
          </div>

          {/* Abrupt Stop - Too Fast */}
          <div className="bg-white rounded-xl p-6 shadow-md mb-6 border-l-4 border-red-400">
            <div className="flex items-start gap-4">
              <span className="text-4xl">🛑</span>
              <div>
                <h3 className="font-bold text-xl text-gray-900 mb-2">
                  Abrupt Stop (Too Close)
                </h3>
                <p className="text-gray-700 mb-3">
                  <span className="text-red-600 font-semibold">🚨 This causes rear-end collisions</span>
                </p>
                <p className="text-gray-700 mb-3">
                  This happens when you follow too closely and the car in front brakes suddenly. You have to slam your brakes on to avoid hitting them.
                </p>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-3">
                  <p className="text-red-800 text-sm">
                    <strong>Why it's dangerous:</strong>
                  </p>
                  <ul className="list-disc list-inside text-red-700 space-y-1 mt-2">
                    <li>You might not stop in time</li>
                    <li>Passengers get jerked forward (unsafe)</li>
                    <li>The car behind might not stop in time either</li>
                    <li>If you're rear-ended, you're at fault</li>
                  </ul>
                </div>
                <p className="text-gray-600 text-sm italic">
                  "Following too closely is the #1 cause of rear-end collisions. It's always your fault if you run into the car in front."
                </p>
              </div>
            </div>
          </div>

          {/* Safe Stop */}
          <div className="bg-white rounded-xl p-6 shadow-md mb-6 border-l-4 border-green-400">
            <div className="flex items-start gap-4">
              <span className="text-4xl">✅</span>
              <div>
                <h3 className="font-bold text-xl text-gray-900 mb-2">
                  Safe Stop (Just Right)
                </h3>
                <p className="text-gray-700 mb-3">
                  <span className="text-green-600 font-semibold">✓ This is what you're aiming for</span>
                </p>
                <p className="text-gray-700 mb-3">
                  A safe stop means you have enough space to see the need to brake, react smoothly, and stop without rushing.
                </p>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-3">
                  <p className="text-green-800 text-sm">
                    <strong>How to do it:</strong>
                  </p>
                  <ul className="list-disc list-inside text-green-700 space-y-1 mt-2">
                    <li>Maintain 3-second gap from the car ahead</li>
                    <li>See hazards early — don't wait until you must brake</li>
                    <li>Ease off the accelerator early</li>
                    <li>Apply brakes smoothly and progressively</li>
                    <li>Come to a complete stop behind the line/marking</li>
                    <li>Check mirrors and blind spots before moving off</li>
                  </ul>
                </div>
                <p className="text-gray-600 text-sm italic">
                  "Smooth, progressive braking shows confidence. You're not just stopping — you're planning your stop."
                </p>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Progressive Braking Technique</h2>
          <p className="text-gray-700 mb-4">
            The key to a safe stop is <strong>progressive braking</strong> — gradually increasing pressure on the brake pedal:
          </p>
          <ol className="list-decimal list-inside text-gray-700 space-y-2 mb-6">
            <li><strong>Ease off accelerator</strong> — start slowing down early</li>
            <li><strong>Light pressure</strong> — apply gentle brake pressure</li>
            <li><strong>Increase pressure</strong> — as you get closer, press firmer</li>
            <li><strong>Full stop</strong> — ease off slightly at the end to avoid jerking</li>
          </ol>
          <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-8 rounded-r-xl">
            <p className="text-blue-800">
              <strong>Pro tip:</strong> Push your brake pedal with the ball of your foot, not your toes. This gives you more control and prevents jerky stops.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Real-World Examples</h2>
          <div className="grid gap-4 mb-8">
            <div className="bg-gray-100 rounded-lg p-4">
              <p className="font-medium text-gray-900 mb-2">🚦 Red light ahead</p>
              <p className="text-gray-700 text-sm">
                <strong>Wrong:</strong> Wait until the last second, then brake hard<br/>
                <strong>Right:</strong> See the light change, ease off accelerator, coast to stop smoothly
              </p>
            </div>
            <div className="bg-gray-100 rounded-lg p-4">
              <p className="font-medium text-gray-900 mb-2">🚶 Pedestrian crossing</p>
              <p className="text-gray-700 text-sm">
                <strong>Wrong:</strong> They're on the sidewalk, I'll just coast past<br/>
                <strong>Right:</strong> Slow down, be ready to stop, make eye contact with pedestrian
              </p>
            </div>
            <div className="bg-gray-100 rounded-lg p-4">
              <p className="font-medium text-gray-900 mb-2">🚗 Car indicator in traffic</p>
              <p className="text-gray-700 text-sm">
                <strong>Wrong:</strong> They might turn, but I'll squeeze past<br/>
                <strong>Right:</strong> Slow down, give them space to complete their turn safely
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Key Takeaways</h2>
          <div className="bg-gray-100 rounded-xl p-6 mb-8">
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-green-600 text-xl">✓</span>
                <span className="text-gray-700"><strong>3-second gap</strong> — count to 3 after the car ahead passes a point</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 text-xl">✓</span>
                <span className="text-gray-700"><strong>Always come to a complete stop</strong> — rolling through is illegal and dangerous</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 text-xl">✓</span>
                <span className="text-gray-700"><strong>Progressive braking</strong> — ease off accelerator, then smoothly increase brake pressure</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 text-xl">✓</span>
                <span className="text-gray-700"><strong>Never tailgate</strong> — if you have to brake hard, you were too close</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 text-xl">✓</span>
                <span className="text-gray-700"><strong>Increase gap in bad conditions</strong> — wet roads, night, heavy traffic</span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-r from-primary to-secondary rounded-xl p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-2">Practice Makes Perfect</h3>
            <p className="text-blue-100 mb-4">
              Book a lesson and I'll help you master smooth, safe stopping techniques.
            </p>
            <Link
              href="/book"
              className="inline-block px-8 py-3 bg-white text-primary font-bold rounded-xl hover:bg-gray-100 transition"
            >
              Book a Lesson →
            </Link>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-gray-200">
          <Link href="/blog" className="text-primary hover:underline">
            ← Back to Blog
          </Link>
        </footer>
      </article>
    </div>
  )
}
