'use client'

import { useState, useEffect } from 'react'

export default function DynamicHeadline() {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0)
  const [displayedText, setDisplayedText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [phase, setPhase] = useState<'typing' | 'pausing' | 'deleting'>('typing')

  const basePhrase = 'Drive With Bui'
  const phrases = [
    ' to Get Your License',
    ' to Become A Safe Driver',
    ' to Improve Your Confidence',
  ]

  // Typing animation effect
  useEffect(() => {
    const currentPhrase = phrases[currentPhraseIndex]
    const fullText = basePhrase + currentPhrase
    
    let timeoutId: NodeJS.Timeout

    if (phase === 'typing') {
      // Type character by character
      if (displayedText.length < fullText.length) {
        timeoutId = setTimeout(() => {
          setDisplayedText(fullText.slice(0, displayedText.length + 1))
        }, 50) // Typing speed: ~50ms per character
      } else {
        // Finished typing, pause for 1.5 seconds
        setPhase('pausing')
        timeoutId = setTimeout(() => {
          setPhase('deleting')
          setIsDeleting(true)
        }, 1500)
      }
    } else if (phase === 'deleting') {
      // Backspace character by character until only base phrase remains
      if (displayedText.length > basePhrase.length) {
        timeoutId = setTimeout(() => {
          setDisplayedText(displayedText.slice(0, -1))
        }, 30) // Backspacing speed: ~30ms per character
      } else {
        // Finished deleting, move to next phrase
        setIsDeleting(false)
        const nextIndex = (currentPhraseIndex + 1) % phrases.length
        setCurrentPhraseIndex(nextIndex)
        setPhase('typing')
      }
    }

    return () => clearTimeout(timeoutId)
  }, [displayedText, phase, currentPhraseIndex, phrases])

  return (
    <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
      <span className="text-primary">{displayedText}</span>
      <span className="animate-pulse text-primary">|</span>
    </h1>
  )
}
