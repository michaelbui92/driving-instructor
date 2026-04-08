'use client'

import { useEffect } from 'react'
import AOS from 'aos'

export default function AOSInit() {
  useEffect(() => {
    // Disable AOS on touch devices to prevent scroll jank
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0

    if (!isTouchDevice) {
      AOS.init({
        duration: 800,
        easing: 'ease-out-cubic',
        once: true,
        offset: 50,
        delay: 0,
      })
    }
  }, [])

  return null
}
