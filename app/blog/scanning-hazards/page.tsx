import Link from 'next/link'
import Navbar from '@/components/Navbar'

export const metadata = {
  title: 'Scanning for Hazards - Drive with Bui',
  description: 'Learn essential hazard scanning techniques every driver should master. From reversing out of driveways to spotting children near parks, stay one step ahead.',
}

export default function ScanningHazardsPage() {
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
            Scanning for Hazards: Stay One Step Ahead
          </h1>
          <p className="text-gray-600 text-lg">
            Essential techniques to spot dangers before they become disasters
          </p>
        </header>

        {/* Featured Image Placeholder */}
        <div className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl p-12 mb-10 text-center">
          <span className="text-6xl">👁️</span>
          <p className="text-amber-800 mt-2">Constant awareness saves lives</p>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <p className="text-xl text-gray-700 mb-8 font-medium">
            Driving isn't just about controlling your vehicle — it's about anticipating what others might do. The best drivers aren't the fastest or most skilled; they're the ones who see trouble coming before it arrives.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Why Scanning Matters</h2>
          <p className="text-gray-700 mb-6">
            Most collisions happen because drivers weren't paying attention to their surroundings. By constantly scanning your environment — not just the car in front — you give yourself precious seconds to react.
          </p>

          <div className="bg-blue-50 border-l-4 border-primary p-6 mb-8 rounded-r-xl">
            <p className="text-blue-800 font-medium">
              <strong>The 12-Second Rule:</strong> You should be scanning 12 seconds ahead at all times. This gives you approximately 300 metres of visibility at highway speeds — enough time to spot and respond to hazards.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Common Hazards to Watch For</h2>

          <div className="space-y-6 mb-8">
            {/* Reversing Out of Driveways */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="flex items-start gap-4">
                <span className="text-3xl">🚗</span>
                <div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">Reversing Out of Driveways</h3>
                  <p className="text-gray-700 mb-3">
                    Every year, children are injured or worse because drivers didn't check their blind spots when reversing. Driveways are particularly dangerous because:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Children can appear suddenly from behind parked cars</li>
                    <li>Other vehicles on the road may not expect you to reverse</li>
                    <li>Blind spots are larger when reversing than going forward</li>
                  </ul>
                  <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-green-800 text-sm">
                      <strong>Tip:</strong> Before reversing, walk around your car to check for children or pets. Use your mirrors and turn your head — cameras don't catch everything.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Children Near Parks and Schools */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="flex items-start gap-4">
                <span className="text-3xl">👶</span>
                <div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">Children Near Parks and Schools</h3>
                  <p className="text-gray-700 mb-3">
                    Children are unpredictable. They might:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Chase a ball into the street without looking</li>
                    <li>Push each other near traffic</li>
                    <li>Not understand dangerous traffic situations</li>
                    <li>Hide behind parked cars or bushes</li>
                  </ul>
                  <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-800 text-sm">
                      <strong>Warning:</strong> Slow to 40km/h in school zones and always scan footpaths for movement, especially near parked cars where children might emerge.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Parked Cars and Doors */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="flex items-start gap-4">
                <span className="text-3xl">🚪</span>
                <div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">Parked Cars and Opening Doors</h3>
                  <p className="text-gray-700 mb-3">
                    "Dooring" — when a car door opens into traffic — causes serious injuries every year. Watch for:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Passengers in parked cars who might exit</li>
                    <li>Cars with their brake lights on (about to move)</li>
                    <li>Drivers or passengers who appear distracted</li>
                  </ul>
                  <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-green-800 text-sm">
                      <strong>Tip:</strong> Give parked cars at least 1 metre clearance when passing. If a passenger looks like they're about to exit, slow down and make eye contact with them.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Pedestrians at Intersections */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="flex items-start gap-4">
                <span className="text-3xl">🚶</span>
                <div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">Pedestrians at Intersections</h3>
                  <p className="text-gray-700 mb-3">
                    Drivers often focus on other vehicles and forget to check for pedestrians, especially:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Pedestrians who start crossing when your light turns green</li>
                    <li>Pedestrians crossing from your blind side when turning</li>
                    <li>Elderly or mobility-impaired pedestrians who move slowly</li>
                  </ul>
                  <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-green-800 text-sm">
                      <strong>Tip:</strong> When turning, check your mirrors AND look over your shoulder. A pedestrian in your blind spot could be invisible in mirrors alone.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Cyclists and Motorcyclists */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="flex items-start gap-4">
                <span className="text-3xl">🚴</span>
                <div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">Cyclists and Motorcyclists</h3>
                  <p className="text-gray-700 mb-3">
                    Two-wheeled vehicles can appear quickly and are harder to see. They're also more vulnerable in collisions:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Check blind spots carefully, especially for motorcycles</li>
                    <li>Give cyclists at least 1.5 metres when passing</li>
                    <li>Watch for cyclists moving between lanes or filtering</li>
                  </ul>
                  <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-green-800 text-sm">
                      <strong>Tip:</strong> In heavy traffic, assume there are motorcycles you can't see. Always check twice before changing lanes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The IPS Scanning Technique</h2>
          <p className="text-gray-700 mb-4">
            Use this systematic approach to scan your surroundings:
          </p>
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="bg-primary/10 rounded-xl p-5 text-center">
              <div className="text-4xl mb-2">👀</div>
              <h3 className="font-bold text-primary mb-2">I — Information</h3>
              <p className="text-gray-700 text-sm">
                Gather information about the road ahead, traffic, signs, and signals.
              </p>
            </div>
            <div className="bg-secondary/10 rounded-xl p-5 text-center">
              <div className="text-4xl mb-2">🎯</div>
              <h3 className="font-bold text-secondary mb-2">P — Predict</h3>
              <p className="text-gray-700 text-sm">
                Predict what other road users might do based on their behaviour and situation.
              </p>
            </div>
            <div className="bg-amber-100 rounded-xl p-5 text-center">
              <div className="text-4xl mb-2">✅</div>
              <h3 className="font-bold text-amber-700 mb-2">S — Select</h3>
              <p className="text-gray-700 text-sm">
                Select your position, speed and gear to avoid or minimise potential danger.
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Key Takeaways</h2>
          <div className="bg-gray-100 rounded-xl p-6 mb-8">
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-green-600 text-xl">✓</span>
                <span className="text-gray-700">Scan 12 seconds ahead — look beyond the car in front</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 text-xl">✓</span>
                <span className="text-gray-700">Check mirrors and blind spots before any manoeuvre</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 text-xl">✓</span>
                <span className="text-gray-700">Watch for vulnerable road users: children, cyclists, pedestrians</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 text-xl">✓</span>
                <span className="text-gray-700">Assume other drivers don't see you — drive defensively</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 text-xl">✓</span>
                <span className="text-gray-700">Never reverse without checking all angles first</span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-r from-primary to-secondary rounded-xl p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-2">Ready to Improve Your Driving?</h3>
            <p className="text-blue-100 mb-4">
              Book a lesson with me and I'll help you develop these hazard perception skills.
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
          <div className="flex items-center justify-between flex-wrap gap-4">
            <Link href="/blog" className="text-primary hover:underline">
              ← Back to Blog
            </Link>
            <div className="text-gray-500 text-sm">
              Share this article:
            </div>
          </div>
        </footer>
      </article>
    </div>
  )
}
