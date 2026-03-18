'use client'

import { useState, useEffect } from 'react'

export default function DynamicHeadline() {
  const [currentHeadline, setCurrentHeadline] = useState(0)

  const headlines = [
    { text: 'Drive With Bui to Get Your License', highlight: 'Drive With Bui' },
    { text: 'Drive With Bui to Become A Safe Driver', highlight: 'Drive With Bui' },
    { text: 'Drive With Bui to Improve Your Confidence', highlight: 'Drive With Bui' },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeadline((prev) => (prev + 1) % headlines.length)
    }, 5000) // Rotate every 5 seconds

    return () => clearInterval(interval)
  }, [])

  const headline = headlines[currentHeadline]

  // Split the text to highlight the first part
  const parts = headline.text.split(headline.highlight)

  return (
    <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
      <span className="text-primary">{headline.highlight}</span>
      {parts[1] || ''}
    </h1>
  )
}