/**
 * Simple PIN-based authentication for instructor portal
 * 
 * Security notes:
 * - PIN is stored hashed in localStorage (bcrypt would be ideal but requires backend)
 * - This is MVP-level security - consider moving to proper backend auth soon
 * - PIN can be reset by clearing localStorage
 */

const AUTH_KEY = 'instructor_auth';
const PIN_KEY = 'instructor_pin_hash';

/**
 * Hash a PIN (simple client-side hash for MVP)
 * In production, this should be done server-side with bcrypt
 */
function hashPin(pin: string): string {
  // Simple hash for MVP - in production use bcrypt or similar
  let hash = 0;
  for (let i = 0; i < pin.length; i++) {
    const char = pin.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString(36);
}

/**
 * Check if instructor is authenticated
 */
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  
  const auth = localStorage.getItem(AUTH_KEY);
  if (!auth) return false;
  
  try {
    const { expiresAt } = JSON.parse(auth);
    return Date.now() < expiresAt;
  } catch {
    return false;
  }
}

/**
 * Check if PIN is already set
 */
export function hasPinSet(): boolean {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem(PIN_KEY);
}

/**
 * Set a new PIN (first-time setup or reset)
 */
export function setPin(pin: string): boolean {
  if (typeof window === 'undefined') return false;
  
  if (pin.length < 4 || pin.length > 6) {
    throw new Error('PIN must be 4-6 digits');
  }
  
  if (!/^\d+$/.test(pin)) {
    throw new Error('PIN must contain only digits');
  }
  
  const hashedPin = hashPin(pin);
  localStorage.setItem(PIN_KEY, hashedPin);
  return true;
}

/**
 * Verify PIN and create auth session
 */
export function login(pin: string): boolean {
  if (typeof window === 'undefined') return false;
  
  const storedHash = localStorage.getItem(PIN_KEY);
  if (!storedHash) {
    // No PIN set yet - set this as the PIN
    setPin(pin);
    // Auto-login after setting PIN
    createAuthSession();
    return true;
  }
  
  const inputHash = hashPin(pin);
  if (inputHash === storedHash) {
    createAuthSession();
    return true;
  }
  
  return false;
}

/**
 * Create authentication session (8 hours)
 * Admin sessions expire after 8 hours for security.
 * This prevents indefinite access if browser is left open.
 */
function createAuthSession(): void {
  if (typeof window === 'undefined') return;
  
  const expiresAt = Date.now() + (8 * 60 * 60 * 1000); // 8 hours
  localStorage.setItem(AUTH_KEY, JSON.stringify({ expiresAt }));
  // Dispatch custom event to notify auth state change
  window.dispatchEvent(new Event('auth-change'));
}

/**
 * Logout - clear auth session
 */
export function logout(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(AUTH_KEY);
  // Dispatch custom event to notify auth state change
  window.dispatchEvent(new Event('auth-change'));
}

/**
 * Clear PIN (for reset)
 */
export function resetPin(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(PIN_KEY);
  localStorage.removeItem(AUTH_KEY);
}

/**
 * Get auth status
 */
export function getAuthStatus(): {
  isAuthenticated: boolean;
  hasPinSet: boolean;
  expiresAt?: number;
} {
  if (typeof window === 'undefined') {
    return { isAuthenticated: false, hasPinSet: false };
  }
  
  const hasPin = hasPinSet();
  const authenticated = isAuthenticated();
  
  if (authenticated) {
    try {
      const auth = localStorage.getItem(AUTH_KEY);
      if (auth) {
        const { expiresAt } = JSON.parse(auth);
        return { isAuthenticated: true, hasPinSet: hasPin, expiresAt };
      }
    } catch {
      // Fall through
    }
  }
  
  return { isAuthenticated: false, hasPinSet: hasPin };
}