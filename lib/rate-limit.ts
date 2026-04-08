/**
 * Simple in-memory rate limiter for API routes
 * Tracks failed attempts per IP + identifier combination
 */

const attempts = new Map<string, { count: number; lastAttempt: number }>()

const WINDOW_MS = 15 * 60 * 1000 // 15-minute window
const MAX_OTP_ATTEMPTS = 5       // max 5 failed OTP attempts per window
const OTP_COOLDOWN_MS = 30 * 1000 // 30-second cooldown after max attempts reached

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

  if (now - record.lastAttempt > windowMs) {
    attempts.set(key, { count: 1, lastAttempt: now })
    return { allowed: true }
  }

  if (now - record.lastAttempt < cooldownMs && record.count >= maxAttempts) {
    const retryAfter = cooldownMs - (now - record.lastAttempt)
    return { allowed: false, retryAfterMs: retryAfter }
  }

  record.count++
  record.lastAttempt = now

  if (record.count > maxAttempts) {
    return { allowed: false, retryAfterMs: cooldownMs }
  }

  return { allowed: true }
}

export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  const realIP = request.headers.get('x-real-ip')
  if (realIP) return realIP
  return '127.0.0.1'
}
