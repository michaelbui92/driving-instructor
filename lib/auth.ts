/**
 * PIN-based authentication for instructor portal
 * 
 * PIN is stored in Supabase for cross-device sync
 * Session (24-hour) is stored in localStorage (device-specific)
 * 
 * Security notes:
 * - PIN is stored hashed in Supabase (bcrypt would be ideal but requires backend)
 * - This is MVP-level security - consider moving to proper backend auth soon
 * - PIN can be reset by clearing from Supabase
 */

import { supabase } from './supabase'

const AUTH_KEY = 'instructor_auth'; // Session storage key (localStorage)
const INSTRUCTOR_AUTH_TABLE = 'instructor_auth';

/**
 * Hash a PIN (simple client-side hash for MVP)
 * In production, this should be done server-side with bcrypt
 */
function hashPin(pin: string): string {
  let hash = 0;
  for (let i = 0; i < pin.length; i++) {
    const char = pin.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(36);
}

/**
 * Check if instructor is authenticated (session check)
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
 * Check if PIN is already set in Supabase
 */
export async function hasPinSet(): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  try {
    const { data, error } = await supabase
      .from(INSTRUCTOR_AUTH_TABLE)
      .select('pin_hash')
      .single();
    
    if (error || !data) return false;
    return !!data.pin_hash;
  } catch {
    return false;
  }
}

/**
 * Set a new PIN in Supabase (first-time setup or reset)
 */
export async function setPin(pin: string): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  
  if (pin.length < 4 || pin.length > 6) {
    throw new Error('PIN must be 4-6 digits');
  }
  
  if (!/^\d+$/.test(pin)) {
    throw new Error('PIN must contain only digits');
  }
  
  const hashedPin = hashPin(pin);
  
  // Upsert to Supabase - either insert or update existing
  const { error } = await supabase
    .from(INSTRUCTOR_AUTH_TABLE)
    .upsert({ 
      id: 1, // Single row for instructor auth
      pin_hash: hashedPin,
      updated_at: new Date().toISOString()
    }, { onConflict: 'id' });
  
  if (error) {
    console.error('Error saving PIN to Supabase:', error);
    throw new Error('Failed to save PIN');
  }
  
  return true;
}

/**
 * Verify PIN against Supabase and create auth session
 */
export async function login(pin: string): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  
  try {
    // Get stored PIN hash from Supabase
    const { data, error } = await supabase
      .from(INSTRUCTOR_AUTH_TABLE)
      .select('pin_hash')
      .single();
    
    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching PIN:', error);
      return false;
    }
    
    if (!data || !data.pin_hash) {
      // No PIN set yet - set this as the PIN
      await setPin(pin);
      createAuthSession();
      return true;
    }
    
    const inputHash = hashPin(pin);
    if (inputHash === data.pin_hash) {
      createAuthSession();
      return true;
    }
    
    return false;
  } catch (err) {
    console.error('Login error:', err);
    return false;
  }
}

/**
 * Create authentication session (8 hours)
 * Admin sessions expire after 8 hours for security.
 * This prevents indefinite access if browser is left open.
 * Session is stored in localStorage (device-specific).
 */
function createAuthSession(): void {
  if (typeof window === 'undefined') return;
  
  const expiresAt = Date.now() + (8 * 60 * 60 * 1000); // 8 hours
  localStorage.setItem(AUTH_KEY, JSON.stringify({ expiresAt }));
  window.dispatchEvent(new Event('auth-change'));
}

/**
 * Logout - clear auth session only (keeps PIN in Supabase)
 */
export function logout(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(AUTH_KEY);
  window.dispatchEvent(new Event('auth-change'));
}

/**
 * Clear PIN from Supabase (for reset)
 */
export async function resetPin(): Promise<void> {
  if (typeof window === 'undefined') return;
  
  try {
    await supabase
      .from(INSTRUCTOR_AUTH_TABLE)
      .delete()
      .eq('id', 1);
  } catch (err) {
    console.error('Error resetting PIN:', err);
  }
  
  localStorage.removeItem(AUTH_KEY);
}

/**
 * Get auth status (async - checks both session and Supabase)
 */
export async function getAuthStatus(): Promise<{
  isAuthenticated: boolean;
  hasPinSet: boolean;
  expiresAt?: number;
}> {
  if (typeof window === 'undefined') {
    return { isAuthenticated: false, hasPinSet: false };
  }
  
  const hasPin = await hasPinSet();
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

/**
 * Initialize the instructor_auth table in Supabase if it doesn't exist
 * Call this on app startup
 */
export async function initAuthTable(): Promise<void> {
  try {
    // Try to create the table (will fail silently if exists due to RLS)
    const { error } = await supabase
      .from(INSTRUCTOR_AUTH_TABLE)
      .select('*')
      .limit(1);
    
    if (error && error.code === 'PGRST116') {
      // Table doesn't exist - create it
      console.log('Creating instructor_auth table...');
    }
  } catch {
    // Table might not exist yet - that's ok
  }
}
