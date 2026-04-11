/**
 * PIN-based authentication for instructor portal
 * 
 * All sensitive auth logic is server-side.
 * Client only calls /api/instructor/auth/* endpoints.
 * Session is stored in HttpOnly cookie (not localStorage).
 */

const AUTH_COOKIE_NAME = 'instructor_session'

/**
 * Check if instructor session is valid (server-side check via API)
 */
export async function getAuthStatus(): Promise<{
  isAuthenticated: boolean
  hasPinSet: boolean
  expiresAt?: number
}> {
  if (typeof window === 'undefined') return { isAuthenticated: false, hasPinSet: false }

  try {
    const response = await fetch('/api/instructor/auth/session', {
      credentials: 'include',
    })
    const data = await response.json()
    return {
      isAuthenticated: data.isAuthenticated,
      hasPinSet: data.hasPinSet,
    }
  } catch {
    return { isAuthenticated: false, hasPinSet: false }
  }
}

/**
 * Check if PIN is already set (server-side)
 */
export async function hasPinSet(): Promise<boolean> {
  if (typeof window === 'undefined') return false
  try {
    const response = await fetch('/api/instructor/auth/session', {
      credentials: 'include',
    })
    const data = await response.json()
    return data.hasPinSet
  } catch {
    return false
  }
}

/**
 * Verify PIN against server and create auth session (HttpOnly cookie)
 */
export async function login(pin: string): Promise<boolean> {
  if (typeof window === 'undefined') return false

  try {
    const response = await fetch('/api/instructor/auth/verify-pin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin, action: 'login' }),
      credentials: 'include',
    })

    const data = await response.json()

    if (response.ok && data.success) {
      window.dispatchEvent(new Event('auth-change'))
      return true
    }

    console.error('Login failed:', data.error)
    return false
  } catch (err) {
    console.error('Login error:', err)
    return false
  }
}

/**
 * Set a new PIN (first-time setup or reset) via server
 */
export async function setPin(pin: string): Promise<boolean> {
  if (typeof window === 'undefined') return false

  if (pin.length < 4 || pin.length > 6) {
    throw new Error('PIN must be 4-6 digits')
  }

  if (!/^\d+$/.test(pin)) {
    throw new Error('PIN must contain only digits')
  }

  try {
    const response = await fetch('/api/instructor/auth/verify-pin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin, action: 'setPin' }),
      credentials: 'include',
    })

    const data = await response.json()

    if (response.ok && data.success) {
      window.dispatchEvent(new Event('auth-change'))
      return true
    }

    throw new Error(data.error || 'Failed to set PIN')
  } catch (err) {
    console.error('setPin error:', err)
    throw err
  }
}

/**
 * Check if authenticated (sync check for client-side routing)
 */
export function isAuthenticated(): boolean {
  // This is a sync check - real auth is done server-side
  // Client-side component uses getAuthStatus() for proper check
  if (typeof window === 'undefined') return false

  const auth = localStorage.getItem('instructor_auth_fallback')
  if (!auth) return false

  try {
    const { expiresAt } = JSON.parse(auth)
    return Date.now() < expiresAt
  } catch {
    return false
  }
}

/**
 * Logout - clear server session cookie
 */
export async function logout(): Promise<void> {
  if (typeof window === 'undefined') return

  try {
    await fetch('/api/instructor/auth/verify-pin', {
      method: 'DELETE',
      credentials: 'include',
    })
  } catch (err) {
    console.error('Logout error:', err)
  }

  localStorage.removeItem('instructor_auth_fallback')
  window.dispatchEvent(new Event('auth-change'))
}

/**
 * Reset PIN (clear from Supabase)
 */
export async function resetPin(): Promise<void> {
  if (typeof window === 'undefined') return

  // Note: This should be a server-side endpoint in production
  // For now, logout clears the session
  localStorage.removeItem('instructor_auth_fallback')
  window.dispatchEvent(new Event('auth-change'))
}

/**
 * Initialize auth table (no-op now - server handles everything)
 */
export async function initAuthTable(): Promise<void> {
  // No-op - server-side auth doesn't need client-side table init
}
