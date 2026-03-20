'use client'

import { useState, useEffect } from 'react'

export default function DynamicHeadline() {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0)
  const [typedPortion, setTypedPortion] = useState('')
  const [isTyping, setIsTyping] = useState(true)
  const [phase, setPhase] = useState<'typing' | 'pausing' | 'deleting' | 'blinking'>('typing')
  const [cursorVisible, setCursorVisible] = useState(true)

  const basePhrase = 'Drive With Bui'
  const phrases = [
    ' to Get Your License',
    ' to Become A Safe Driver',
    ' to Improve Your Confidence',
  ]

  // Blink cursor effect - alternates every 500ms
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setCursorVisible((prev) => !prev)
    }, 500)

    return () => clearInterval(blinkInterval)
  }, [])

  // Typing animation effect
  useEffect(() => {
    const currentPhrase = phrases[currentPhraseIndex]
    const targetLength = currentPhrase.length

    let timeoutId: NodeJS.Timeout

    if (phase === 'typing') {
      // Type character by character
      if (typedPortion.length < targetLength) {
        timeoutId = setTimeout(() => {
          setTypedPortion(currentPhrase.slice(0, typedPortion.length + 1))
        }, 50) // Typing speed: ~50ms per character
      } else {
        // Finished typing, pause for 1 second
        setPhase('pausing')
        timeoutId = setTimeout(() => {
          setPhase('deleting')
        }, 1000)
      }
    } else if (phase === 'deleting') {
      // Backspace character by character
      if (typedPortion.length > 0) {
        timeoutId = setTimeout(() => {
          setTypedPortion(typedPortion.slice(0, -1))
        }, 30) // Backspacing speed: ~30ms per character
      } else {
        // Finished deleting, blink cursor for 1 second
        setPhase('blinking')
        timeoutId = setTimeout(() => {
          // Move to next phrase
          setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length)
          setPhase('typing')
        }, 1000)
      }
    }

    return () => clearTimeout(timeoutId)
  }, [currentPhraseIndex, typedPortion, phase, phrases])

  const isCursorBlinking = phase === 'blinking'
  const showCursor = !isCursorBlinking || cursorVisible

  return (
    <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
      <span className="text-primary">{basePhrase}</span>
      <span className="text-gray-600">{typedPortion}</span>
      {showCursor && <span className="text-primary animate-pulse">|</span>}
    </h1>
  )
}