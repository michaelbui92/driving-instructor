'use client'

import Link from 'next/link'
import Navbar from '@/components/Navbar'

export default function TurningLongVehiclesArticle() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="mb-8">
          <Link href="/blog" className="inline-flex items-center gap-2 text-primary hover:underline mb-6">
            ← Back to Blog
          </Link>
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
            <span>📅 April 5, 2026</span>
            <span>•</span>
            <span>⏱️ 5 min read</span>
            <span>•</span>
            <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">Safety</span>
          </div>
        </div>

        <article className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <h1 className="text-4xl font-bold mb-6">Why You Should Never Overtake a Turning Truck</h1>

          <p className="text-gray-600 text-lg mb-8">
            One of the most dangerous mistakes a driver can make — especially a learner or newly licensed driver — is trying to overtake a truck, bus, or any long vehicle that's turning. It looks like an easy shortcut. It almost always ends badly. Here's exactly why, and what you should do instead.
          </p>

          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-4">The Problem: Off-Tracking</h2>
            <p className="mb-4">
              Long vehicles don't turn like cars. When a truck or bus turns a corner, its <strong>rear wheels follow a tighter path than its front wheels</strong>. This is called <em>off-tracking</em>, and it's the key reason overtaking a turning long vehicle is so dangerous.
            </p>
            <div className="bg-yellow-50 rounded-xl p-5 border border-yellow-200">
              <p className="text-yellow-800 font-medium">
                💡 Think of it this way: the front of the truck turns the corner, but the back swings wide — sometimes across multiple lanes. What looks like a safe gap on the left side of the truck can disappear in an instant.
              </p>
            </div>
          </div>

          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-4">The "Blind Side" Danger</h2>
            <p className="mb-4">
              Trucks and buses have enormous blind spots — particularly on the right side (the passenger side) and directly behind. When a truck driver signals a left turn and begins turning, they are focused on their own path and mirrors.
            </p>
            <p className="mb-4">If you're beside a truck attempting to overtake on its left as it turns left, you are:</p>
            <ul className="space-y-2">
              <li>🚫 <strong>In their blind spot</strong> — the driver can't see you</li>
              <li>🚫 <strong>In the sweep zone</strong> — the rear of the truck swings through where you're sitting</li>
              <li>🚫 <strong>With nowhere to go</strong> — kerb on one side, truck on the other</li>
            </ul>
          </div>

          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-4">What Actually Happens</h2>
            <div className="bg-red-50 rounded-xl p-6 border border-red-200">
              <p className="text-red-800 mb-3">
                <strong>Scenario:</strong> You're driving behind a semi-trailer at an intersection. The truck signals left and starts turning. You think "plenty of room" and pull out to overtake on the left.
              </p>
              <p className="text-red-800">
                The truck's cab clears the corner. But the trailer — 15, 20, maybe 25 metres long — keeps swinging. The rear of the trailer clips your car, or pins you against the kerb. The driver never knew you were there.
              </p>
            </div>
            <p className="mt-4 text-gray-600">
              This type of crash is sometimes called a "swept path" accident. They're disproportionately fatal for the smaller vehicle's occupants because of the sheer mass difference.
            </p>
          </div>

          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-4">The Same Risk Exists on the Right</h2>
            <p className="mb-4">
              You might think overtaking on the right is safer — you can see the driver's face in the mirror. But trucks turning right swing across the left lanes, meaning:
            </p>
            <ul className="space-y-2">
              <li>🚫 The truck occupies multiple lanes as it turns</li>
              <li>🚫 You may be in a lane the driver thinks is clear</li>
              <li>🚫 Right turns often mean the driver is watching oncoming traffic, not you</li>
            </ul>
          </div>

          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-4">What You Should Do Instead</h2>
            <div className="bg-green-50 rounded-xl p-6">
              <ul className="space-y-3">
                <li>✅ <strong>Wait behind</strong> — Give the truck plenty of room. If the intersection is clear, the truck will move through and you can proceed once it's clear.</li>
                <li>✅ <strong>Never squeeze past</strong> — If there's a gap between the truck and the kerb, it's not for you. That gap is the truck's own swing path.</li>
                <li>✅ <strong>Watch the trailer, not the cab</strong> — The cab clears first. Keep watching until the trailer has fully turned.</li>
                <li>✅ <strong>Give extra space on highways</strong> — Trucks changing lanes on freeways have the same off-tracking issue at scale.</li>
                <li>✅ <strong>Use your indicators as a cue</strong> — If a truck signals and starts to slow before an intersection, that's your signal to hang back.</li>
              </ul>
            </div>
          </div>

          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Know the Dimensions</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-xl p-5">
                <h3 className="font-bold mb-2">🚛 Semi-Trailer</h3>
                <p className="text-sm text-gray-700">Up to 20m long. Rear wheels can swing 2–3m wider than the cab's path on a tight turn.</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-5">
                <h3 className="font-bold mb-2">🚌 Bus</h3>
                <p className="text-sm text-gray-700">12–18m long. Articulated buses (bendy buses) can be 18–25m. Significant off-tracking on corners.</p>
              </div>
              <div className="bg-orange-50 rounded-xl p-5">
                <h3 className="font-bold mb-2">🚚 Rigid Truck</h3>
                <p className="text-sm text-gray-700">8–12m long. Less extreme off-tracking than trailers, but still wider than a car.</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-5">
                <h3 className="font-bold mb-2">🚗 Standard Car</h3>
                <p className="text-sm text-gray-700">4–5m long. Front and rear wheels follow almost the same path. Minimal off-tracking.</p>
              </div>
            </div>
          </div>

          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-4">The Rule in NSW</h2>
            <p className="mb-4">
              Under NSW road rules, you must not drive in the path of an approaching vehicle. But more importantly — even if it's technically legal to be somewhere, if a 40-tonne truck swings into that space, you lose.
            </p>
            <div className="bg-indigo-50 rounded-xl p-5">
              <p className="text-indigo-800 font-medium">
                The law doesn't protect you from physics. A truck driver who never sees you is not legally in the wrong — but you're still the one in hospital.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-8 mt-12">
            <h2 className="text-2xl font-bold mb-4">The Bottom Line</h2>
            <p className="mb-4">
              When a long vehicle is turning, <strong>your number one rule is: do not be alongside it</strong>. Stay back, watch the full vehicle clear the intersection, and only proceed when the path is completely clear.
            </p>
            <p>
              Patience at an intersection costs you 10 seconds. The alternative costs far more than that.
            </p>
          </div>
        </article>

        <div className="mt-12 text-center">
          <Link
            href="/book"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-semibold rounded-xl hover:bg-secondary transition hover-lift"
          >
            📅 Book a Lesson to Practise Safe Overtaking
          </Link>
          <p className="mt-4 text-gray-600">
            Learn to share the road safely with trucks and long vehicles with professional instruction.
          </p>
        </div>
      </div>
    </div>
  )
}
