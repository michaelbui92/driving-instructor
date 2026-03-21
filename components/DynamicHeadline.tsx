'use client'

import { useState, useEffect } from 'react'

const phrases = [
  " to Get Your License",
  " to Become A Safe Driver",
  " to Build Your Confidence"
]

export default function DynamicHeadline() {
  const [displayedText, setDisplayedText] = useState("Drive With Bui")
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0)
  const [isTyping, setIsTyping] = useState(true)
  const [charIndex, setCharIndex] = useState(0)

  useEffect(() => {
    const currentPhrase = phrases[currentPhraseIndex]
    
    if (isTyping) {
      // Typing phase
      if (charIndex < currentPhrase.length) {
        const timer = setTimeout(() => {
          setDisplayedText("Drive With Bui" + currentPhrase.substring(0, charIndex + 1))
          setCharIndex(charIndex + 1)
        }, 80) // typing speed
        return () => clearTimeout(timer)
      } else {
        // Finished typing, pause then start deleting
        const timer = setTimeout(() => {
          setIsTyping(false)
          setCharIndex(currentPhrase.length)
        }, 2000) // pause before deleting
        return () => clearTimeout(timer)
      }
    } else {
      // Deleting phase
      if (charIndex > 0) {
        const timer = setTimeout(() => {
          setDisplayedText("Drive With Bui" + currentPhrase.substring(0, charIndex - 1))
          setCharIndex(charIndex - 1)
        }, 40) // deleting speed (faster than typing)
        return () => clearTimeout(timer)
      } else {
        // Finished deleting, move to next phrase (randomize, no repeats)
        const timer = setTimeout(() => {
          const nextIndex = (currentPhraseIndex + 1 + Math.floor(Math.random() * (phrases.length - 1))) % phrases.length
          setCurrentPhraseIndex(nextIndex)
          setIsTyping(true)
        }, 500) // pause before typing next
        return () => clearTimeout(timer)
      }
    }
  }, [charIndex, isTyping, currentPhraseIndex])

  return (
    <h1 className="text-4xl md:text-6xl font-bold mb-6">
      <span className="text-primary">{displayedText}</span>
      <span className="animate-pulse text-primary">|</span>
    </h1>
  )
}
