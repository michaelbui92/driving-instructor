'use client'

import { useEffect } from 'react'
import AOS from 'aos'

export default function AOSInit() {
  useEffect(() => {
    // Only disable AOS on pure touch devices (phones) — not laptops with touch screens
    // '(hover: none)' means the device doesn't support hover (i.e., a phone, not a touchscreen laptop)
    const isPureTouchDevice = typeof window !== 'undefined' &&
      window.matchMedia('(hover: none)').matches &&
      window.matchMedia('(pointer: coarse)').matches

    if (!isPureTouchDevice) {
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
