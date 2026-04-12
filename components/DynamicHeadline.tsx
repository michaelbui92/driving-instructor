'use client'

import { useState, useEffect, useRef } from 'react'

const phrases = [
  " to build your confidence",
  " to be a Safe Driver",
  " to go from anxious to assured",
  " to unlock your Australian adventure",
  " to learn skills for life, not just for the test",
  " if you have never driven before"
]

export default function DynamicHeadline() {
  const [displayedText, setDisplayedText] = useState("Drive With Bui")
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0)
  const [isTyping, setIsTyping] = useState(true)
  const [charIndex, setCharIndex] = useState(0)
  
  // Keep last 2 shown indices to avoid repeats
  const recentIndices = useRef<number[]>([])

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
          // Filter out recent indices, pick random from remaining
          const availableIndices = phrases.map((_, i) => i).filter(i => !recentIndices.current.includes(i))
          const nextIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)]
          
          // Update recent indices (keep last 2)
          recentIndices.current = [...recentIndices.current.slice(-1), nextIndex]
          
          setCurrentPhraseIndex(nextIndex)
          setIsTyping(true)
        }, 500) // pause before typing next
        return () => clearTimeout(timer)
      }
    }
  }, [charIndex, isTyping, currentPhraseIndex])

  return (
    <div className="min-h-[3rem] md:min-h-[4rem] flex items-center">
      <h1 className="text-3xl md:text-5xl font-bold">
        <span className="text-primary">{displayedText}</span>
        <span className="animate-pulse text-primary">|</span>
      </h1>
    </div>
  )
}
