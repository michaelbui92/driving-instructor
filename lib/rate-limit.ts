/**
 * Simple in-memory rate limiter for API routes
 * Tracks failed attempts per IP + identifier combination
 */

// In-memory store (resets on server restart — fine for MVP)
const attempts = new Map<string, { count: number; lastAttempt: number }>()

const WINDOW_MS = 15 * 60 * 1000 // 15-minute window
const MAX_OTP_ATTEMPTS = 5       // max 5 failed OTP attempts per window
const OTP_COOLDOWN_MS = 30 * 1000 // 30-second cooldown after max attempts reached

/**
 * Check if a request should be rate limited
 * @param key - unique key for this action (e.g. "verify:{ip}:{email}" or "otp:{ip}:{email}")
 * @param maxAttempts - max attempts allowed in the window
 * @param windowMs - window size in ms
 * @param cooldownMs - cooldown after max attempts reached
 */
export function checkRateLimit(
  key: string,
  maxAttempts: number = MAX_OTP_ATTEMPTS,
  windowMs: number = WINDOW_MS,
  cooldownMs: number = OTP_COOLDOWN_MS
): { allowed: boolean; retryAfterMs?: number } {
  const now = Date.now()
  const record = attempts.get(key)

  if (!record) {
    attempts.set(key, { count: 1, lastAttempt: now })
    return { allowed: true }
  }

  // Reset if window has passed
  if (now - record.lastAttempt > windowMs) {
    attempts.set(key, { count: 1, lastAttempt: now })
    return { allowed: true }
  }

  // Still in cooldown
  if (now - record.lastAttempt < cooldownMs && record.count >= maxAttempts) {
    const retryAfter = cooldownMs - (now - record.lastAttempt)
    return { allowed: false, retryAfterMs: retryAfter }
  }

  // Increment
  record.count++
  record.lastAttempt = now

  if (record.count > maxAttempts) {
    return { allowed: false, retryAfterMs: cooldownMs }
  }

  return { allowed: true }
}

/**
 * Get client IP from request headers
 */
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  const realIP = request.headers.get('x-real-ip')
  if (realIP) return realIP
  return '127.0.0.1'
}
