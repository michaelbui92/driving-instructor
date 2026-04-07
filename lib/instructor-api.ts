/**
 * Instructor API key management for client-side
 * 
 * The instructor portal uses this to authenticate API calls to instructor-specific routes.
 * Generate a secure key: openssl rand -hex 32
 */

const API_KEY_STORAGE_KEY = 'instructor_api_key'

/**
 * Get the stored API key from localStorage
 */
export function getApiKey(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(API_KEY_STORAGE_KEY)
}

/**
 * Set the API key in localStorage
 */
export function setApiKey(key: string): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(API_KEY_STORAGE_KEY, key)
}

/**
 * Check if API key is configured
 */
export function hasApiKey(): boolean {
  return !!getApiKey()
}

/**
 * Generate headers for authenticated API requests
 */
export function getAuthHeaders(): Record<string, string> {
  const key = getApiKey()
  if (!key) return {}
  return {
    'x-instructor-api-key': key
  }
}

/**
 * Fetch wrapper with API key authentication
 */
export async function authenticatedFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const headers = {
    ...options.headers,
    ...getAuthHeaders()
  }
  return fetch(url, { ...options, headers })
}

/**
 * Initialize API key from environment variable (called on app load)
 * This is set server-side in NEXT_PUBLIC_INSTRUCTOR_API_KEY
 */
export function initializeApiKey(): void {
  if (typeof window === 'undefined') return
  
  // If not already set, try to get from environment
  const envKey = (window as any).__NEXT_PUBLIC_INSTRUCTOR_API_KEY__
  if (envKey && !hasApiKey()) {
    setApiKey(envKey)
  }
}
