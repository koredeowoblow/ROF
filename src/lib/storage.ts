/**
 * Resilient storage adapter with automatic in-memory fallback.
 * Protects against DOMException / QuotaExceededError in:
 * - Safari iOS Private Browsing
 * - Firefox strict privacy mode
 * - Iframe sandbox environments
 */
const inMemoryFallback = new Map<string, string>()

export const safeStorage = {
  getItem(key: string): string | null {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const value = window.localStorage.getItem(key)
        if (value !== null) return value
      }
    } catch {
      // Storage access blocked or restricted
    }
    return inMemoryFallback.get(key) ?? null
  },

  setItem(key: string, value: string): void {
    inMemoryFallback.set(key, value)
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value)
      }
    } catch {
      // Storage access blocked or quota exceeded
    }
  },

  removeItem(key: string): void {
    inMemoryFallback.delete(key)
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key)
      }
    } catch {
      // Storage safe
    }
  },
}

